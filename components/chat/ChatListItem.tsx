'use client';

import React from 'react';
import { CheckCheck, Clock } from 'lucide-react';
import { Room } from '../../hooks/useChatSync';

interface ChatListItemProps {
  room: Room;
  isActive: boolean;
  isDarkMode: boolean;
  onClick: () => void;
  emoji: string;
}

export default function ChatListItem({
  room,
  isActive,
  isDarkMode,
  onClick,
  emoji
}: ChatListItemProps) {
  const lastMsg = room.messages?.[room.messages.length - 1];

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b transition-all ${
        isDarkMode 
          ? `border-[#222e35]/30 ${isActive ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'}` 
          : `border-[#e9edef]/60 ${isActive ? 'bg-[#efeae2]' : 'hover:bg-[#f5f6f6]'}`
      }`}
    >
      <img 
        src={room.avatar} 
        alt={room.name}
        className={`w-12 h-12 rounded-full object-cover shrink-0 border ${
          isDarkMode ? 'border-[#222e35]' : 'border-zinc-200'
        }`}
      />
      
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex justify-between items-baseline mb-1">
          <span className={`font-semibold text-[15px] truncate ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
            {room.name}
          </span>
          <span className={`text-[12px] ${
            room.unreadCount && room.unreadCount > 0 
              ? 'text-[#00a884] font-medium' 
              : isDarkMode 
                ? 'text-[#8696a0]' 
                : 'text-[#667781]'
          }`}>
            {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {lastMsg && lastMsg.sender === 'me' && lastMsg.status === 'filtered' && (
              <CheckCheck size={15} className="text-[#53bdeb] shrink-0" />
            )}
            {lastMsg && lastMsg.sender === 'me' && lastMsg.status === 'filtering' && (
              <Clock size={12} className={`${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'} shrink-0`} />
            )}
            <span className={`text-[13px] truncate ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
              {lastMsg ? lastMsg.text : 'No hay mensajes.'}
            </span>
          </div>

          {/* Unread count / Profile Badge */}
          {room.unreadCount && room.unreadCount > 0 ? (
            <span className="w-5 h-5 bg-[#00a884] text-[#111b21] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">
              {room.unreadCount}
            </span>
          ) : (
            <span className={`text-[10px] px-1 py-0.2 rounded border uppercase font-mono tracking-wide shrink-0 ${
              isDarkMode ? 'text-[#8696a0] border-[#222e35] bg-[#202c33]/30' : 'text-[#667781] border-zinc-200 bg-zinc-50'
            }`}>
              {emoji}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
