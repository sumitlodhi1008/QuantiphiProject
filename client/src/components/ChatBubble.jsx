import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';
import CodeBlock from './CodeBlock';

export default function ChatBubble({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`flex w-full mb-6 ${
        isUser ? 'justify-end' : 'justify-start'
      } transition-opacity duration-200`}
    >
      <div
        className={`flex max-w-[88%] md:max-w-[78%] gap-3.5 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar Icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            isUser
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-900 text-cyan-400 border border-slate-800'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Bubble Container */}
        <div className="flex flex-col flex-grow min-w-0">
          <div
            className={`relative px-4 py-3.5 rounded-xl text-sm ${
              isUser
                ? 'bg-cyan-600 text-white rounded-tr-none'
                : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
            }`}
          >
            {/* Header / Tone Badge for AI */}
            {!isUser && (
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                <span className="text-xs font-semibold text-slate-300">
                  Assistant
                </span>
                {message.tone && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                    {message.tone}
                  </span>
                )}
              </div>
            )}

            {/* Message Body with Markdown */}
            {isUser ? (
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]} value={codeString} />
                      ) : (
                        <code
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return <p className="mb-2 last:mb-0">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>;
                    },
                    li({ children }) {
                      return <li className="mb-0.5">{children}</li>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {/* Real-time Streaming cursor */}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 align-middle rounded-sm animate-cursor" />
                )}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`text-[11px] text-slate-500 mt-1 px-1 flex ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}
