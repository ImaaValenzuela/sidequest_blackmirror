'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatSync } from '../../hooks/useChatSync';
import SidebarIconRail from '../../components/chat/SidebarIconRail';
import ChatListSidebar from '../../components/chat/ChatListSidebar';
import ChatArea from '../../components/chat/ChatArea';
import ContactInfoSidebar from '../../components/chat/ContactInfoSidebar';
import InterceptionModal from '../../components/chat/InterceptionModal';
import NewChatModal from '../../components/chat/NewChatModal';
import AdminDashboard from '../../components/chat/AdminDashboard';
import MellowLogo from '../../components/chat/MellowLogo';
import MobileChatView from '../../components/chat/MobileChatView';
import { MessageSquare } from 'lucide-react';

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
  const router = useRouter();
  const {
    activeRoomId,
    setActiveRoomId,
    rooms,
    messages,
    isFirebaseConnected,
    isSending,
    metrics,
    currentUser,
    authLoading,
    users,
    sendProcessedMessage,
    createRoom,
    changeRoomProfile,
    logout
  } = useChatSync();

  const [isAuditMode, setIsAuditMode] = useState<boolean>(true);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Modal states
  const [interceptionText, setInterceptionText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load user theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mellow_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem('mellow_theme', nextTheme ? 'dark' : 'light');
  };

  const handleInterceptSendMessage = (text: string) => {
    setInterceptionText(text);
    setIsModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0c1317] text-[#e9edef] font-mono">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs tracking-widest uppercase">Verificando Credenciales de Convivencia...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will trigger router redirect
  }

  const currentRoom = rooms[activeRoomId];
  const totalUnread = Object.values(rooms).reduce((sum, r) => sum + (r.unreadCount || 0), 0);

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <>
        <MobileChatView
          rooms={rooms}
          messages={messages}
          activeRoomId={activeRoomId}
          isDarkMode={isDarkMode}
          isSending={isSending}
          isAuditMode={isAuditMode}
          profileConfig={profileConfig}
          totalUnread={totalUnread}
          onSelectRoom={setActiveRoomId}
          onSendMessage={handleInterceptSendMessage}
        />
        <InterceptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          originalText={interceptionText}
          activeProfile={currentRoom?.profile || 'couple'}
          isDarkMode={isDarkMode}
          onConfirmSend={(finalText, original, status, meta) => {
            sendProcessedMessage(finalText, original, status, meta);
            setIsModalOpen(false);
          }}
        />
      </>
    );
  }

  // ── DESKTOP LAYOUT ──
  return (
    <div 
      className={`relative flex h-screen w-screen overflow-hidden select-none text-[14px] transition-colors duration-150 ${
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
        onLogout={logout}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        isAdminActive={isAdminOpen}
        totalUnread={totalUnread}
      />

      {/* COLUMN 2: CHATS LIST */}
      <ChatListSidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        isFirebaseConnected={isFirebaseConnected}
        isDarkMode={isDarkMode}
        profileConfig={profileConfig}
        onNewChat={() => setIsNewChatOpen(true)}
      />

      {/* COLUMN 3: ACTIVE CHAT WINDOW / EMPTY PLACEHOLDER */}
      {currentRoom ? (
        <ChatArea
          room={currentRoom}
          messages={messages}
          isAuditMode={isAuditMode}
          isDarkMode={isDarkMode}
          isSending={isSending}
          onSendMessage={handleInterceptSendMessage}
          onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
          onToggleAuditMode={() => setIsAuditMode(!isAuditMode)}
        />
      ) : (
        <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 transition-colors ${
          isDarkMode ? 'bg-[#222e35]/10' : 'bg-[#f8f9fa]'
        }`}>
          <div className="mb-4">
            <MellowLogo 
              size={64} 
              className={isDarkMode ? 'text-[#8696a0]' : 'text-[#aebac1]'} 
            />
          </div>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-[#e9edef]' : 'text-zinc-800'}`}>
            Mellow Middleware
          </h2>
          <p className={`text-xs mt-1.5 max-w-xs leading-normal ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
            Sincronización segura y control de armonía activo. Haz clic en el botón "+" para iniciar un nuevo chat y comenzar.
          </p>
        </div>
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

      {/* INTERCEPTION MODAL */}
      <InterceptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        originalText={interceptionText}
        activeProfile={currentRoom?.profile || 'couple'}
        isDarkMode={isDarkMode}
        onConfirmSend={(finalText, original, status, meta) => {
          sendProcessedMessage(finalText, original, status, meta);
          setIsModalOpen(false);
        }}
      />

      {/* NEW CHAT MODAL */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        isDarkMode={isDarkMode}
        onCreateChat={createRoom}
      />

      {/* ADMIN DASHBOARD PORTAL */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isDarkMode={isDarkMode}
        users={users}
        rooms={rooms}
      />
    </div>
  );
}
