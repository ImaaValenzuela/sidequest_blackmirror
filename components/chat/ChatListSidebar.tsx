'use client';

import React from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';
import ChatListItem from './ChatListItem';
import { Room } from '../../hooks/useChatSync';

interface ChatListSidebarProps {
  rooms: Record<string, Room>;
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  isFirebaseConnected: boolean;
  isDarkMode: boolean;
  profileConfig: Record<string, { emoji: string }>;
}

export default function ChatListSidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
  isFirebaseConnected,
  isDarkMode,
  profileConfig
}: ChatListSidebarProps) {
  return (
    <div className={`w-[390px] min-w-[340px] flex flex-col border-r shrink-0 transition-colors ${
      isDarkMode ? 'bg-[#111b21] border-[#222e35]' : 'bg-[#ffffff] border-[#e9edef]'
    }`}>
      
      {/* Header */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
            Chats
          </h1>
          <div className="flex items-center gap-3 text-[#aebac1] dark:text-[#aebac1] text-[#54656f]">
            <div className="p-1.5 hover:bg-[#202c33] dark:hover:bg-[#202c33] hover:bg-zinc-100 rounded-full cursor-pointer transition-colors">
              <Plus size={20} />
            </div>
            <div className="p-1.5 hover:bg-[#202c33] dark:hover:bg-[#202c33] hover:bg-zinc-100 rounded-full cursor-pointer transition-colors">
              <MoreVertical size={20} />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className={`rounded-lg flex items-center px-3.5 py-1.5 border-b border-transparent transition-colors ${
          isDarkMode 
            ? 'bg-[#202c33] focus-within:border-cyan-500' 
            : 'bg-[#f0f2f5] focus-within:border-[#00a884]'
        }`}>
          <Search size={15} className={`mr-3 shrink-0 ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`} />
          <input 
            type="text" 
            placeholder="Busca un chat o inicia uno nuevo" 
            className={`bg-transparent border-none outline-none text-[13px] w-full focus:ring-0 ${
              isDarkMode 
                ? 'placeholder-[#8696a0] text-[#e9edef]' 
                : 'placeholder-[#667781] text-[#111b21]'
            }`}
          />
        </div>
      </div>

      {/* Database Mode indicator */}
      <div className={`px-5 py-1.5 border-b flex items-center justify-between text-[11px] font-mono transition-colors ${
        isDarkMode 
          ? 'bg-[#202c33]/40 border-[#222e35] text-[#8696a0]' 
          : 'bg-[#f0f2f5]/80 border-[#e9edef] text-[#667781]'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
          {isFirebaseConnected ? 'Firebase Connected' : 'Mellow Local Sandbox'}
        </span>
        {!isFirebaseConnected && (
          <span className={`px-1.5 py-0.2 border rounded text-[9px] font-bold ${
            isDarkMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>DEMO</span>
        )}
      </div>

      {/* Rooms list */}
      <div className="flex-1 overflow-y-auto">
        {Object.values(rooms).map((room) => (
          <ChatListItem
            key={room.id}
            room={room}
            isActive={room.id === activeRoomId}
            isDarkMode={isDarkMode}
            onClick={() => onSelectRoom(room.id)}
            emoji={profileConfig[room.profile]?.emoji || '💬'}
          />
        ))}
      </div>
    </div>
  );
}
