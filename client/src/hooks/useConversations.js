import { useState, useEffect, useCallback } from 'react';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setConversations(data.data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    }
  }, []);

  const addOptimisticConversation = useCallback((newConv) => {
    const convId = (newConv.id || newConv.conversationId || '').toString();
    if (!convId) return;

    setConversations((prev) => {
      const existsIndex = prev.findIndex((c) => c.id.toString() === convId);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          title: newConv.title || updated[existsIndex].title,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return [
        {
          id: convId,
          title: newConv.title || 'New Conversation',
          updatedAt: new Date().toISOString(),
          messageCount: 1,
          preview: '',
        },
        ...prev,
      ];
    });
  }, []);

  const getConversationDetails = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) throw new Error('Failed to fetch conversation details');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error('Error fetching conversation details:', err);
      throw err;
    }
  }, []);

  const deleteConversation = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete conversation');
      setConversations((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting conversation:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    addOptimisticConversation,
    getConversationDetails,
    deleteConversation,
  };
}
