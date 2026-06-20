'use client';

import React from 'react';
import { Clock, CheckCheck } from 'lucide-react';
import { Message } from '../../hooks/useChatSync';
import MessageDiff from './MessageDiff';

interface MessageBubbleProps {
  message: Message;
  isAuditMode: boolean;
  isDarkMode: boolean;
}

export default function MessageBubble({
  message,
  isAuditMode,
  isDarkMode
}: MessageBubbleProps) {
  const isMe = message.sender === 'me';
  const isFiltering = message.status === 'filtering';
  const isFailed = message.status === 'failed';

  return (
    <div className={`flex flex-col max-w-[65%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
      {/* WhatsApp-style bubble */}
      <div 
        className={`px-3 py-1.5 text-[14px] leading-relaxed relative group shadow-sm transition-all ${
          isMe 
            ? isFiltering 
              ? 'bg-cyan-950 border border-cyan-800/60 rounded-lg rounded-tr-none animate-pulse text-[#e9edef]' 
              : isFailed
                ? isDarkMode
                  ? 'bg-red-950/60 border border-red-800/40 rounded-lg rounded-tr-none text-[#e9edef]'
                  : 'bg-red-50 border border-red-200 rounded-lg rounded-tr-none text-red-700 font-medium'
                : isDarkMode 
                  ? 'bg-[#005c4b] rounded-lg rounded-tr-none text-[#e9edef]' 
                  : 'bg-[#d9fdd3] rounded-lg rounded-tr-none text-[#111b21]'
            : isFiltering
              ? isDarkMode 
                ? 'bg-[#202c33]/70 border border-[#2a3942] rounded-lg rounded-tl-none animate-pulse text-[#e9edef]' 
                : 'bg-white/80 border border-zinc-200 rounded-lg rounded-tl-none animate-pulse text-[#111b21]'
              : isDarkMode 
                ? 'bg-[#202c33] rounded-lg rounded-tl-none text-[#e9edef]' 
                : 'bg-[#ffffff] rounded-lg rounded-tl-none text-[#111b21]'
        }`}
      >
        {/* Message contents */}
        <div className="break-words pb-1">
          {message.text}
        </div>

        {/* Time & status checks */}
        <div className={`flex items-center justify-end gap-1 text-[11px] select-none h-4 ${
          isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
        }`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <span>
              {isFiltering ? (
                <Clock size={11} className="text-cyan-400" />
              ) : isFailed ? (
                <span className="text-rose-500 font-bold">!</span>
              ) : (
                <CheckCheck size={15} className="text-[#53bdeb]" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Audit Mode (Git Diff styled as an official WhatsApp Quote/Reply block) */}
      {isAuditMode && message.originalText && (
        <MessageDiff
          originalText={message.originalText}
          text={message.text}
          originalTone={message.originalTone}
          toxicityLevel={message.toxicityLevel}
          savedMetric={message.savedMetric}
          isDarkMode={isDarkMode}
          isFiltering={isFiltering}
        />
      )}
    </div>
  );
}
