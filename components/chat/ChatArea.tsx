'use client';

import React, { useRef, useEffect } from 'react';
import { Search, Info, Terminal } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Room, Message } from '../../hooks/useChatSync';

interface ChatAreaProps {
  room: Room;
  messages: Message[];
  isAuditMode: boolean;
  isDarkMode: boolean;
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onToggleInfo: () => void;
  onToggleAuditMode: () => void;
}

export default function ChatArea({
  room,
  messages,
  isAuditMode,
  isDarkMode,
  isSending,
  onSendMessage,
  onToggleInfo,
  onToggleAuditMode
}: ChatAreaProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <div className={`flex-1 flex flex-col relative min-w-0 transition-colors ${
      isDarkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]'
    }`}>
      
      {/* Repeating doodle SVG wallpaper */}
      <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity ${
        isDarkMode 
          ? 'opacity-[0.04] bg-[radial-gradient(#8696a0_1px,transparent_1px)] [background-size:20px_20px]' 
          : 'opacity-[0.08] bg-[radial-gradient(#54656f_1px,transparent_1px)] [background-size:20px_20px]'
      }`}></div>

      {/* Chat Header */}
      <div className={`h-[60px] flex items-center justify-between px-4 z-10 border-b transition-colors ${
        isDarkMode ? 'bg-[#202c33] border-[#222e35]/30' : 'bg-[#f0f2f5] border-[#e9edef]/80'
      }`}>
        <div 
          className={`flex items-center gap-3 cursor-pointer py-1.5 pr-8 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-[#2a3942]/20' : 'hover:bg-zinc-200/55'
          }`}
          onClick={onToggleInfo}
        >
          <img 
            src={room?.avatar} 
            alt={room?.name} 
            className={`w-10 h-10 rounded-full object-cover shrink-0 border ${
              isDarkMode ? 'border-[#2a3942]' : 'border-zinc-300'
            }`}
          />
          <div className="min-w-0">
            <h3 className={`font-medium text-[15px] truncate ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
              {room?.name}
            </h3>
            <p className={`text-[12px] truncate leading-tight mt-0.5 ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
              {room?.statusText}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-4 shrink-0 ${isDarkMode ? 'text-[#aebac1]' : 'text-[#54656f]'}`}>
          <button 
            onClick={onToggleAuditMode}
            className={`p-2 rounded-full transition-all ${
              isAuditMode 
                ? isDarkMode 
                  ? 'text-cyan-400 bg-[#2a3942]' 
                  : 'text-[#00a884] bg-zinc-200' 
                : isDarkMode 
                  ? 'hover:bg-[#2a3942]' 
                  : 'hover:bg-zinc-200'
            }`}
            title={isAuditMode ? "Desactivar Modo Auditoría" : "Activar Modo Auditoría"}
          >
            <Terminal size={19} />
          </button>
          <div className={`p-2 rounded-full cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-[#2a3942]' : 'hover:bg-zinc-200'}`}>
            <Search size={19} />
          </div>
          <div 
            className={`p-2 rounded-full cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-[#2a3942]' : 'hover:bg-zinc-200'}`}
            onClick={onToggleInfo}
          >
            <Info size={19} />
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 relative z-10">
        {messages.length === 0 ? (
          <div className={`h-full flex items-center justify-center ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
            Escribe tu mensaje para comenzar.
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isAuditMode={isAuditMode}
              isDarkMode={isDarkMode}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={onSendMessage}
        isSending={isSending}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
