import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Bot,
  PanelLeftClose,
} from 'lucide-react';

export default function HistorySidebar({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onToggleSidebar,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations in real time
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.preview?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container with smooth hide/show toggle for desktop and mobile (Default: OPEN) */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex-shrink-0 ${
          isOpen
            ? 'w-72 md:w-80 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full lg:translate-x-0 border-r-0 overflow-hidden opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-72 md:w-80 flex flex-col h-full overflow-hidden">
          {/* Header / Brand + Hide Sidebar Toggle Button */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 truncate">
                  Quantiphi AI
                  <span className="text-[10px] font-semibold px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    v1.0
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 truncate">Assistant</p>
              </div>
            </div>

            {/* Toggle Button to Hide Sidebar (Like ChatGPT / Gemini) */}
            <button
              onClick={onToggleSidebar}
              title="Close Sidebar"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer pointer-events-auto"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Action: New Chat Button */}
          <div className="p-2.5">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors duration-150 active:scale-[0.99] cursor-pointer pointer-events-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Search Bar Filter */}
          <div className="px-2.5 pb-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors pointer-events-auto"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-500 text-xs">
                {searchQuery ? (
                  <p>No conversations match &quot;{searchQuery}&quot;</p>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-slate-600" />
                    <p>No past conversations yet.</p>
                    <p className="text-[11px] text-slate-600">Start a chat to see history</p>
                  </div>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      if (window.innerWidth < 1024) onToggleSidebar();
                    }}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors duration-150 pointer-events-auto ${
                      isActive
                        ? 'bg-slate-800 text-cyan-400 border border-slate-700/80'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <MessageSquare
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium leading-tight">
                          {conv.title || 'Untitled Chat'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          {formatDate(conv.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this conversation?')) {
                          onDeleteConversation(conv.id);
                        }
                      }}
                      title="Delete Conversation"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer info */}
          <div className="p-2.5 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500">
              Quantiphi AI Assistant
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
