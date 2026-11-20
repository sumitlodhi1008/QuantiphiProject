import React, { useState, useEffect } from 'react';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import { useChatStream } from './hooks/useChatStream';
import { useConversations } from './hooks/useConversations';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    conversations,
    fetchConversations,
    addOptimisticConversation,
    getConversationDetails,
    deleteConversation,
  } = useConversations();

  const {
    messages,
    isStreaming,
    conversationId,
    activeTitle,
    tone,
    setTone,
    sendMessage,
    stopStreaming,
    resetChat,
    loadConversation,
  } = useChatStream({
    onConversationCreated: (metadata) => {
      addOptimisticConversation(metadata);
      fetchConversations();
    },
    onMessageFinished: () => {
      fetchConversations();
    },
  });

  // Restore previous active conversation on page refresh
  useEffect(() => {
    const restoreActiveChat = async () => {
      const cachedId = localStorage.getItem('quantiphi_active_chat_id');
      if (cachedId) {
        try {
          const conv = await getConversationDetails(cachedId);
          if (conv) {
            loadConversation(conv);
          }
        } catch {
          // If conversation was deleted or not found, silently clear
          localStorage.removeItem('quantiphi_active_chat_id');
        }
      }
    };

    restoreActiveChat();
  }, [getConversationDetails, loadConversation]);

  // Select a past conversation thread
  const handleSelectConversation = async (id) => {
    try {
      const conv = await getConversationDetails(id);
      if (conv) {
        loadConversation(conv);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  // Start a fresh new chat
  const handleNewChat = () => {
    resetChat();
  };

  // Delete a conversation thread
  const handleDeleteConversation = async (id) => {
    const success = await deleteConversation(id);
    if (success && id === conversationId) {
      resetChat();
    }
  };

  const currentConversation = conversations.find(
    (c) => c.id.toString() === (conversationId || '').toString()
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Past Conversations Sidebar with Collapse Toggle */}
      <HistorySidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Interactive Chat Interface */}
      <ChatInterface
        messages={messages}
        isStreaming={isStreaming}
        selectedTone={tone}
        onSelectTone={setTone}
        onSendMessage={sendMessage}
        onStopStreaming={stopStreaming}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        currentConversation={currentConversation}
        activeTitle={activeTitle}
      />
    </div>
  );
}
