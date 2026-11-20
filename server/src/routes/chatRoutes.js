const express = require('express');
const router = express.Router();
const {
  streamChat,
  getConversations,
  getConversationById,
  deleteConversation,
  clearAllConversations,
} = require('../controllers/chatController');

// Streaming chat endpoint
router.post('/chat/stream', streamChat);

// Conversation management endpoints
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);
router.delete('/conversations', clearAllConversations);

module.exports = router;
