const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');
const { generateTitleFromPrompt } = require('../services/promptService');

// In-Memory Guest User Cache
const guestUserCache = new Map();

const getOrCreateGuestUser = (userId = 'guest_user_quantiphi') => {
  if (!guestUserCache.has(userId)) {
    guestUserCache.set(userId, {
      userId,
      createdAt: new Date(),
      lastActive: new Date(),
    });
  } else {
    guestUserCache.get(userId).lastActive = new Date();
  }
  return guestUserCache.get(userId);
};

/**
 * Handle Real-Time SSE Chat Streaming
 * POST /api/chat/stream
 */
const streamChat = async (req, res, next) => {
  const { prompt, tone = 'Professional', conversationId, userId: incomingUserId } = req.body;
  const userId = incomingUserId || req.headers['x-user-id'] || 'guest_user_quantiphi';
  getOrCreateGuestUser(userId);

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required and must be non-empty.' });
  }

  // Validate tone
  const validTones = ['Professional', 'Casual', 'Concise'];
  const normalizedTone = validTones.find(
    (t) => t.toLowerCase() === tone.toLowerCase()
  ) || 'Professional';

  try {
    let conversation = null;

    // Retrieve or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      const generatedTitle = await generateTitleFromPrompt(prompt, aiService.geminiClient);
      conversation = new Conversation({
        userId,
        title: generatedTitle,
        tone: normalizedTone,
        messages: [],
      });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: prompt.trim(),
      tone: normalizedTone,
      timestamp: new Date(),
    };
    conversation.messages.push(userMessage);
    conversation.tone = normalizedTone; // update active tone
    await conversation.save();

    // Setup Server-Sent Events (SSE) headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering for nginx
    res.flushHeaders?.();

    // Send metadata event with conversationId and title
    res.write(
      `event: metadata\ndata: ${JSON.stringify({
        conversationId: conversation._id.toString(),
        title: conversation.title,
        tone: normalizedTone,
      })}\n\n`
    );

    // Prepare message history context for LLM (excluding the latest prompt we just appended)
    const history = conversation.messages.slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let isAborted = false;
    req.on('close', () => {
      isAborted = true;
    });

    let fullAIResponse = '';

    // Stream from AI Service
    fullAIResponse = await aiService.streamResponse({
      prompt: prompt.trim(),
      tone: normalizedTone,
      history,
      onChunk: (chunk) => {
        if (!isAborted) {
          res.write(`event: chunk\ndata: ${JSON.stringify({ delta: chunk })}\n\n`);
        }
      },
    });

    // Save assistant message to MongoDB
    const assistantMessage = {
      role: 'assistant',
      content: fullAIResponse,
      tone: normalizedTone,
      timestamp: new Date(),
    };
    conversation.messages.push(assistantMessage);
    await conversation.save();

    // Send completion event
    if (!isAborted) {
      res.write(
        `event: done\ndata: ${JSON.stringify({
          conversationId: conversation._id,
          messageId: conversation.messages[conversation.messages.length - 1]._id,
          fullResponse: fullAIResponse,
        })}\n\n`
      );
      res.end();
    }
  } catch (err) {
    console.error('[ChatController Stream Error]', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
};

/**
 * Get all conversations list (for sidebar)
 * GET /api/conversations
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'guest_user_quantiphi';
    getOrCreateGuestUser(userId);

    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .select('_id userId title tone updatedAt messages');

    // Filter conversations for this guest user (or any default guest conversations)
    const userConversations = (conversations || []).filter(
      (c) => !c.userId || c.userId === userId || c.userId === 'guest_user_quantiphi'
    );

    const formatted = userConversations.map((conv) => ({
      id: (conv._id || '').toString(),
      title: conv.title || 'Untitled Conversation',
      tone: conv.tone || 'Professional',
      updatedAt: conv.updatedAt || new Date(),
      messageCount: conv.messages ? conv.messages.length : 0,
      preview:
        conv.messages && conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1].content.substring(0, 60)
          : '',
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

/**
 * Get specific conversation with full message history
 * GET /api/conversations/:id
 */
const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    res.json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a conversation
 * DELETE /api/conversations/:id
 */
const deleteConversation = async (req, res, next) => {
  try {
    const deleted = await Conversation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Clear all conversations
 * DELETE /api/conversations
 */
const clearAllConversations = async (req, res, next) => {
  try {
    await Conversation.deleteMany({});
    res.json({ success: true, message: 'All conversations cleared' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  streamChat,
  getConversations,
  getConversationById,
  deleteConversation,
  clearAllConversations,
};
