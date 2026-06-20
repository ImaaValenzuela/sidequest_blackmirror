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
  onNewChat?: () => void;
}

export default function ChatListSidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
  isFirebaseConnected,
  isDarkMode,
  profileConfig,
  onNewChat
}: ChatListSidebarProps) {
  return (
    <div className={`w-[390px] min-w-[340px] flex flex-col border-r shrink-0 transition-colors ${
      isDarkMode ? 'bg-[#111b21] border-[#222e35]' : 'bg-[#ffffff] border-[#e9edef]'
    }`}>
      
      {/* Header */}
      <div className="px-4 pt-5 pb-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
            Chats
          </h1>
          <div className="flex items-center gap-2 text-[#aebac1] dark:text-[#aebac1] text-[#54656f]">
            <button 
              onClick={onNewChat}
              className="p-1.5 hover:bg-[#202c33] dark:hover:bg-[#202c33] hover:bg-zinc-100 rounded-full cursor-pointer transition-colors"
              title="Nuevo Chat"
            >
              <Plus size={20} />
            </button>
            <div className="p-1.5 hover:bg-[#202c33] dark:hover:bg-[#202c33] hover:bg-zinc-100 rounded-full cursor-pointer transition-colors">
              <MoreVertical size={20} />
            </div>
          </div>
        </div>

        {/* Search bar & Filter */}
        <div className="flex items-center gap-2">
          <div className={`rounded-xl flex-1 flex items-center px-3.5 py-1.5 transition-colors ${
            isDarkMode 
              ? 'bg-[#202c33]' 
              : 'bg-[#f0f2f5]'
          }`}>
            <Search size={16} className={`mr-3 shrink-0 ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`} />
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
          <button className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#202c33] shrink-0 text-[#54656f] dark:text-[#aebac1]`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>
            </svg>
          </button>
        </div>

        {/* Pills / Filters Row */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-[13px]">
          <span className={`px-3 py-1 rounded-full cursor-pointer font-medium ${
            isDarkMode 
              ? 'bg-[#00a884]/20 text-[#00a884]' 
              : 'bg-[#e1f3d4] text-[#00a884]'
          }`}>
            Todos
          </span>
          <span className={`px-3 py-1 rounded-full cursor-pointer font-medium ${
            isDarkMode 
              ? 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]' 
              : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e1e3e6]'
          }`}>
            No leídos
          </span>
          <span className={`px-3 py-1 rounded-full cursor-pointer font-medium ${
            isDarkMode 
              ? 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]' 
              : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e1e3e6]'
          }`}>
            Favoritos
          </span>
          <span className={`px-3 py-1 rounded-full cursor-pointer font-medium ${
            isDarkMode 
              ? 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]' 
              : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e1e3e6]'
          }`}>
            Grupos
          </span>
        </div>
      </div>

      {/* Notifications Off banner */}
      <div className={`px-4 py-3 flex items-center gap-3 border-b transition-colors ${
        isDarkMode 
          ? 'bg-[#182229] border-[#222e35]/30' 
          : 'bg-[#53bdeb]/10 border-zinc-100'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isDarkMode ? 'bg-[#53bdeb]/15 text-[#53bdeb]' : 'bg-[#53bdeb] text-white'
        }`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zM9 11.5c0-1.66 1.34-3 3-3s3 1.34 3 3H9z"></path>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-medium leading-tight ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
            Activar notificaciones de escritorio
          </p>
          <button className={`text-[12px] hover:underline text-[#53bdeb] text-left mt-0.5`}>
            Recibir notificaciones de nuevos mensajes
          </button>
        </div>
        <button className="text-[#8696a0] hover:text-[#e9edef] shrink-0 p-1">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.9-1.9-5.3 5.3-5.3-5.3-1.9 1.9 5.3 5.3-5.3 5.3 1.9 1.9 5.3-5.3 5.3 5.3z"></path>
          </svg>
        </button>
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
