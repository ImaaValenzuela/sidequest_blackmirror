'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface MessageDiffProps {
  originalText: string;
  text: string;
  originalTone?: string;
  toxicityLevel?: number;
  savedMetric?: string;
  isDarkMode: boolean;
  isFiltering: boolean;
}

export default function MessageDiff({
  originalText,
  text,
  originalTone,
  toxicityLevel,
  savedMetric,
  isDarkMode,
  isFiltering
}: MessageDiffProps) {
  return (
    <div className={`w-full mt-1 border rounded-lg p-2.5 space-y-2 shadow-md transition-colors ${
      isDarkMode ? 'bg-[#182229] border-[#2a3942]/70' : 'bg-white border-zinc-200/80'
    }`}>
      {/* Section 1: Red Quote block (Original Message) */}
      <div className={`border-l-[4px] px-2 py-1 rounded ${
        isDarkMode ? 'border-red-500/80 bg-red-950/10' : 'border-red-500 bg-red-50/50'
      }`}>
        <div className={`text-[10px] font-bold uppercase tracking-wide ${
          isDarkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          INTERCEPTADO (CRUDO)
        </div>
        <p className={`text-[12px] italic break-words mt-0.5 ${
          isDarkMode ? 'text-zinc-300' : 'text-zinc-500'
        }`}>
          "{originalText}"
        </p>
      </div>

      {/* Section 2: Green Quote block (Refactored message) */}
      <div className={`border-l-[4px] px-2 py-1 rounded ${
        isDarkMode ? 'border-emerald-500/80 bg-emerald-950/10' : 'border-emerald-500 bg-emerald-50/50'
      }`}>
        <div className={`text-[10px] font-bold uppercase tracking-wide ${
          isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          REFACTORIZADO (EMPATIZADO)
        </div>
        <p className={`text-[12px] break-words mt-0.5 ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
          "{text}"
        </p>
      </div>

      {/* Metadata row */}
      {!isFiltering && (
        <div className={`flex items-center justify-between text-[10.5px] border-t pt-1.5 mt-1 font-mono ${
          isDarkMode ? 'border-[#2a3942]/50 text-[#8696a0]' : 'border-zinc-200 text-[#667781]'
        }`}>
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-cyan-500" />
            <span>
              Tono: <strong className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}>{originalTone || 'Normal'}</strong>
            </span>
          </span>
          {toxicityLevel !== undefined && (
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
              toxicityLevel > 0.7 
                ? isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700' 
                : isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            }`}>
              Hostilidad: {(toxicityLevel * 100).toFixed(0)}%
            </span>
          )}
        </div>
      )}

      {!isFiltering && savedMetric && (
        <p className={`text-[10.5px] border-l-[3px] px-2 py-1 rounded leading-normal font-sans ${
          isDarkMode 
            ? 'text-pink-400 bg-pink-950/10 border-pink-500/50' 
            : 'text-pink-600 bg-pink-50/50 border-pink-400'
        }`}>
          🛡️ {savedMetric}
        </p>
      )}
    </div>
  );
}
