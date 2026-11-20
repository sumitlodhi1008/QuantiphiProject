import React from 'react';
import { Briefcase, Coffee, Zap } from 'lucide-react';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    icon: Briefcase,
    color: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10',
    description: 'Polished, structured, and enterprise-grade',
  },
  {
    id: 'Casual',
    label: 'Casual',
    icon: Coffee,
    color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
    description: 'Friendly, warm, and conversational',
  },
  {
    id: 'Concise',
    label: 'Concise',
    icon: Zap,
    color: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
    description: 'Ultra-direct with zero conversational fluff',
  },
];

export default function ToneSelector({ selectedTone, onSelectTone, disabled = false }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isSelected
                ? `${tone.color} shadow-sm border`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? '' : 'text-slate-400'}`} />
            <span>{tone.label}</span>
          </button>
        );
      })}
    </div>
  );
}
