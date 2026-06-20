'use client';

import React, { useState, useEffect } from 'react';
import { useChatSync } from '../../hooks/useChatSync';
import SidebarIconRail from '../../components/chat/SidebarIconRail';
import ChatListSidebar from '../../components/chat/ChatListSidebar';
import ChatArea from '../../components/chat/ChatArea';
import ContactInfoSidebar from '../../components/chat/ContactInfoSidebar';

const profileConfig = {
  couple: {
    name: 'Modo Pareja',
    emoji: '💕',
    description: 'Transforma ira en ternura vulnerable y afecto.',
    badgeDark: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    badgeLight: 'bg-pink-50 text-pink-600 border-pink-200'
  },
  family: {
    name: 'Modo Familiar',
    emoji: '🙏',
    description: 'Traduce disputas en respeto, humildad y paciencia filial.',
    badgeDark: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badgeLight: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  corporate: {
    name: 'Modo Corporativo',
    emoji: '💼',
    description: 'Limpia insultos traduciendo a sinergia formal y proactividad.',
    badgeDark: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badgeLight: 'bg-cyan-50 text-cyan-600 border-cyan-200'
  }
};

export default function ChatPage() {
  const {
    activeRoomId,
    setActiveRoomId,
    rooms,
    messages,
    isFirebaseConnected,
    isSending,
    metrics,
    sendMessage,
    changeRoomProfile
  } = useChatSync();

  const [isAuditMode, setIsAuditMode] = useState<boolean>(true);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Load user theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mellow_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem('mellow_theme', nextTheme ? 'dark' : 'light');
  };

  const currentRoom = rooms[activeRoomId];

  return (
    <div 
      className={`flex h-screen w-screen overflow-hidden select-none text-[14px] transition-colors duration-150 ${
        isDarkMode ? 'bg-[#0c1317] text-[#e9edef]' : 'bg-[#eae6df] text-[#111b21]'
      }`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* COLUMN 1: LEFTMOST ICON BAR */}
      <SidebarIconRail
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        isAuditMode={isAuditMode}
        onToggleAuditMode={() => setIsAuditMode(!isAuditMode)}
      />

      {/* COLUMN 2: CHATS LIST */}
      <ChatListSidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        isFirebaseConnected={isFirebaseConnected}
        isDarkMode={isDarkMode}
        profileConfig={profileConfig}
      />

      {/* COLUMN 3: ACTIVE CHAT WINDOW */}
      {currentRoom && (
        <ChatArea
          room={currentRoom}
          messages={messages}
          isAuditMode={isAuditMode}
          isDarkMode={isDarkMode}
          isSending={isSending}
          onSendMessage={sendMessage}
          onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
          onToggleAuditMode={() => setIsAuditMode(!isAuditMode)}
        />
      )}

      {/* COLUMN 4: CONTACT INFO SIDEBAR */}
      {isInfoOpen && currentRoom && (
        <ContactInfoSidebar
          room={currentRoom}
          isDarkMode={isDarkMode}
          onClose={() => setIsInfoOpen(false)}
          onChangeProfile={changeRoomProfile}
          metrics={metrics}
          profileConfig={profileConfig}
        />
      )}
    </div>
  );
}
