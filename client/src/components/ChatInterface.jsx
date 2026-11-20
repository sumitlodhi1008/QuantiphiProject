import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Menu,
  Download,
  Plus,
  Sparkles,
  Code,
  Briefcase,
  Smile,
} from 'lucide-react';
import ChatBubble from './ChatBubble';
import ToneSelector from './ToneSelector';
import ExportModal from './ExportModal';

const STARTER_PROMPTS = [
  {
    icon: Code,
    title: 'Code Architecture',
    prompt: 'Explain the difference between synchronous and asynchronous execution in Node.js with a code example.',
  },
  {
    icon: Briefcase,
    title: 'Professional Memo',
    prompt: 'Draft an executive summary proposal for modernizing enterprise cloud infrastructure.',
  },
  {
    icon: Smile,
    title: 'Casual Chat',
    prompt: 'What are the top three coolest space discoveries from this year?',
  },
];

export default function ChatInterface({
  messages = [],
  isStreaming = false,
  selectedTone = 'Professional',
  onSelectTone,
  onSendMessage,
  onStopStreaming,
  onNewChat,
  onToggleSidebar,
  currentConversation,
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Handle auto-resizing textarea
  const handleInputChange = (e) => {
    setInputPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isStreaming) return;

    onSendMessage(inputPrompt);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-950 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 px-4 md:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-semibold text-slate-100 truncate">
              {currentConversation?.title || 'New Conversation'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">Real-time Stream Engine</span>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* "The Vibe Check" Tone Selector */}
          <ToneSelector
            selectedTone={selectedTone}
            onSelectTone={onSelectTone}
            disabled={isStreaming}
          />

          {/* Export Chat Button (Extra Feature) */}
          <button
            onClick={() => setIsExportOpen(true)}
            disabled={messages.length === 0}
            title="Export Conversation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            title="Start New Chat"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Scrollable Conversation View */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 mb-4 text-white">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">
              How can I assist you today?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
              Experience intelligent real-time conversational streaming with dynamic tone calibration.
              Choose between <b>Professional</b>, <b>Casual</b>, or <b>Concise</b> responses.
            </p>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
              {STARTER_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="flex flex-col text-left p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-slate-300 hover:text-white transition group shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-cyan-400">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-semibold">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isLast = index === messages.length - 1;
              const isMsgStreaming = isStreaming && isLast && msg.role === 'assistant';
              return (
                <ChatBubble
                  key={msg.id || index}
                  message={msg}
                  isStreaming={isMsgStreaming}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/80 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-xl transition"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Press Enter to send, Shift+Enter for newline)"
              className="flex-1 max-h-44 p-2 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center gap-1.5 pb-1 pr-1">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium transition"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputPrompt.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition active:scale-95"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
            <span>Powered by Gemini API &amp; Server-Sent Events</span>
            <span className="hidden sm:inline">Shift + Enter for new line</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        conversation={currentConversation}
        messages={messages}
      />
    </div>
  );
}
