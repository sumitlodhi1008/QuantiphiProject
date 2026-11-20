import React, { useState } from 'react';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import { useChatStream } from './hooks/useChatStream';
import { useConversations } from './hooks/useConversations';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    conversations,
    fetchConversations,
    getConversationDetails,
    deleteConversation,
  } = useConversations();

  const {
    messages,
    isStreaming,
    conversationId,
    tone,
    setTone,
    sendMessage,
    stopStreaming,
    resetChat,
    loadConversation,
  } = useChatStream({
    onConversationCreated: () => {
      fetchConversations();
    },
    onMessageFinished: () => {
      fetchConversations();
    },
  });

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

  const currentConversation = conversations.find((c) => c.id === conversationId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Past Conversations Sidebar */}
      <HistorySidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Interactive Chat Interface */}
      <ChatInterface
        messages={messages}
        isStreaming={isStreaming}
        selectedTone={tone}
        onSelectTone={setTone}
        onSendMessage={sendMessage}
        onStopStreaming={stopStreaming}
        onNewChat={handleNewChat}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        currentConversation={currentConversation}
      />
    </div>
  );
}
