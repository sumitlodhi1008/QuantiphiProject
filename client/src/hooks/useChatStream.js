import { useState, useRef, useCallback } from 'react';

export function useChatStream({ onConversationCreated, onMessageFinished }) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [tone, setTone] = useState('Professional');
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * Reset the current chat session
   */
  const resetChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setConversationId(null);
    setIsStreaming(false);
    setError(null);
  }, []);

  /**
   * Load existing messages into view
   */
  const loadConversation = useCallback((conv) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setConversationId(conv._id || conv.id);
    setTone(conv.tone || 'Professional');
    setMessages(
      (conv.messages || []).map((m) => ({
        id: m._id,
        role: m.role,
        content: m.content,
        tone: m.tone,
        timestamp: m.timestamp,
      }))
    );
    setIsStreaming(false);
    setError(null);
  }, []);

  /**
   * Send prompt with SSE Streaming
   */
  const sendMessage = useCallback(
    async (promptText, explicitTone) => {
      if (!promptText || promptText.trim() === '' || isStreaming) return;

      const activeTone = explicitTone || tone;
      setError(null);

      // Create new user message object
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: promptText.trim(),
        tone: activeTone,
        timestamp: new Date().toISOString(),
      };

      // Create initial assistant message object for streaming
      const assistantMessageId = `ai-${Date.now()}`;
      const initialAssistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        tone: activeTone,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptText.trim(),
            tone: activeTone,
            conversationId: conversationId,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullAIContent = '';
        let currentConvId = conversationId;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          // Retain the last incomplete segment
          buffer = lines.pop() || '';

          for (const block of lines) {
            const trimmed = block.trim();
            if (!trimmed) continue;

            const eventMatch = trimmed.match(/^event:\s*(\w+)/m);
            const dataMatch = trimmed.match(/^data:\s*(.*)$/m);

            const event = eventMatch ? eventMatch[1] : 'message';
            const rawData = dataMatch ? dataMatch[1] : null;

            if (!rawData) continue;

            let parsed;
            try {
              parsed = JSON.parse(rawData);
            } catch {
              continue;
            }

            if (event === 'metadata') {
              if (parsed.conversationId && parsed.conversationId !== currentConvId) {
                currentConvId = parsed.conversationId;
                setConversationId(parsed.conversationId);
                onConversationCreated?.(parsed);
              }
            } else if (event === 'chunk') {
              if (parsed.delta) {
                fullAIContent += parsed.delta;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: fullAIContent }
                      : msg
                  )
                );
              }
            } else if (event === 'done') {
              if (parsed.fullResponse) {
                fullAIContent = parsed.fullResponse;
              }
              onMessageFinished?.(currentConvId);
            } else if (event === 'error') {
              throw new Error(parsed.error || 'Stream error');
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Stream generation aborted by user.');
        } else {
          console.error('Error during chat stream:', err);
          setError(err.message || 'Failed to complete streaming response');
          // Add error indicator in message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId && !msg.content
                ? {
                    ...msg,
                    content: `⚠️ *An error occurred: ${err.message || 'Unable to connect to server'}*`,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [conversationId, isStreaming, onConversationCreated, onMessageFinished, tone]
  );

  /**
   * Stop active streaming
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  return {
    messages,
    isStreaming,
    conversationId,
    tone,
    setTone,
    error,
    sendMessage,
    stopStreaming,
    resetChat,
    loadConversation,
  };
}
