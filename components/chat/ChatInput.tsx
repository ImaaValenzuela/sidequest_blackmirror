'use client';

import React, { useState } from 'react';
import { Smile, Plus, Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isSending: boolean;
  isDarkMode: boolean;
}

export default function ChatInput({
  onSendMessage,
  isSending,
  isDarkMode
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className={`h-[62px] flex items-center px-4 gap-3.5 z-10 border-t shrink-0 transition-colors ${
      isDarkMode ? 'bg-[#202c33] border-[#222e35]/30' : 'bg-[#f0f2f5] border-[#e9edef]/80'
    }`}>
      <div className={`flex gap-3.5 shrink-0 ${isDarkMode ? 'text-[#aebac1]' : 'text-[#54656f]'}`}>
        <button type="button" className="hover:text-[#e9edef] dark:hover:text-[#e9edef] hover:text-zinc-800 transition-colors">
          <Smile size={24} />
        </button>
        <button type="button" className="hover:text-[#e9edef] dark:hover:text-[#e9edef] hover:text-zinc-800 transition-colors">
          <Plus size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex gap-3.5 items-center">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe un mensaje aquí"
          className={`flex-1 border-none outline-none rounded-lg text-[14px] px-3.5 py-2 focus:ring-0 focus:border-none transition-colors ${
            isDarkMode 
              ? 'bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0]' 
              : 'bg-[#ffffff] text-[#111b21] placeholder-[#667781]'
          }`}
          disabled={isSending}
        />
        
        <button 
          type="submit"
          disabled={isSending}
          className={`p-2 transition-colors shrink-0 ${
            isDarkMode ? 'text-[#aebac1] hover:text-[#e9edef]' : 'text-[#54656f] hover:text-zinc-800'
          }`}
        >
          {inputValue.trim() && !isSending ? (
            <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-black shadow-sm transition-transform active:scale-95">
              <Send size={18} className="ml-0.5 text-black" />
            </div>
          ) : isSending ? (
            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Mic size={24} />
          )}
        </button>
      </form>
    </div>
  );
}
