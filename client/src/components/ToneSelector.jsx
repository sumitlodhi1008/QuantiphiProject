import React from 'react';
import { Briefcase, MessageSquare, Zap } from 'lucide-react';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    icon: Briefcase,
    description: 'Polished, structured, and enterprise-grade',
  },
  {
    id: 'Casual',
    label: 'Casual',
    icon: MessageSquare,
    description: 'Conversational, approachable, and natural',
  },
  {
    id: 'Concise',
    label: 'Concise',
    icon: Zap,
    description: 'Direct with zero filler',
  },
];

export default function ToneSelector({ selectedTone, onSelectTone, disabled = false }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
      <span className="hidden md:inline-block text-xs font-medium text-slate-400 px-2 uppercase tracking-wider">
        Vibe:
      </span>
      {TONES.map((tone) => {
        const Icon = tone.icon;
        const isSelected = selectedTone === tone.id;
        return (
          <button
            key={tone.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectTone(tone.id)}
            title={tone.description}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isSelected
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{tone.label}</span>
          </button>
        );
      })}
    </div>
  );
}
