import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      className={`flex w-full mb-3.5 ${
        isUser ? 'justify-end' : 'justify-start'
      } transition-opacity duration-150`}
    >
      <div className="flex flex-col max-w-[85%] md:max-w-[75%] min-w-0">
        {/* Clean WhatsApp-Style Chat Bubble */}
        <div
          className={`relative px-4 py-2.5 text-xs md:text-sm shadow-sm ${
            isUser
              ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl rounded-tl-sm'
          }`}
        >
          {/* Message Content */}
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
                    return <p className="mb-1.5 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>;
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
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 align-middle rounded-sm animate-cursor" />
              )}
            </div>
          )}
        </div>

        {/* Timestamp right below message */}
        <div
          className={`text-[10px] text-slate-500 mt-1 px-1 flex ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
