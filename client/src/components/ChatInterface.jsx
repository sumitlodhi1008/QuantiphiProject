import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Menu,
  Download,
  Plus,
  Bot,
  Code,
  Briefcase,
  MessageSquare,
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
    title: 'Executive Summary',
    prompt: 'Draft an executive summary proposal for modernizing enterprise cloud infrastructure.',
  },
  {
    icon: MessageSquare,
    title: 'Conversational Inquiry',
    prompt: 'Explain the fundamentals of machine learning model quantization.',
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

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
      <header className="h-16 px-4 md:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-semibold text-slate-100 truncate">
              {currentConversation?.title || 'New Conversation'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">Stream Engine Active</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            title="Start New Chat"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Scrollable Conversation View */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center mb-4 text-white">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-100 mb-2">
              How can I assist you today?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
              Real-time conversational streaming with dynamic tone calibration.
              Select <b>Professional</b>, <b>Casual</b>, or <b>Concise</b>.
            </p>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
              {STARTER_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="flex flex-col text-left p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-slate-300 hover:text-white transition-colors group"
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
      <footer className="p-4 md:p-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-cyan-500/80 transition-colors"
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputPrompt.trim()}
                  className="p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
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
