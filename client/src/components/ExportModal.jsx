import React from 'react';
import { Download, FileText, FileCode, X } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, conversation, messages }) {
  if (!isOpen) return null;

  const exportAsMarkdown = () => {
    let md = `# Conversation: ${conversation?.title || 'AI Chat Session'}\n`;
    md += `*Exported on: ${new Date().toLocaleString()}*\n\n`;
    md += `---\n\n`;

    messages.forEach((msg) => {
      const role = msg.role === 'user' ? 'User' : `AI (${msg.tone || 'Assistant'})`;
      const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
      md += `### ${role} [${time}]\n\n${msg.content}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(conversation?.title || 'chat-export').replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportAsJSON = () => {
    const data = {
      title: conversation?.title || 'AI Chat Session',
      exportedAt: new Date().toISOString(),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        tone: m.tone,
        timestamp: m.timestamp,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(conversation?.title || 'chat-export').replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Export Conversation</h3>
            <p className="text-xs text-slate-400">Save this conversation thread locally</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5">
          Select export format:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={exportAsMarkdown}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition group"
          >
            <FileText className="w-6 h-6 mb-2 text-cyan-400" />
            <span className="text-xs font-semibold">Markdown (.md)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Formatted text</span>
          </button>

          <button
            onClick={exportAsJSON}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition group"
          >
            <FileCode className="w-6 h-6 mb-2 text-cyan-400" />
            <span className="text-xs font-semibold">JSON (.json)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Structured data</span>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
