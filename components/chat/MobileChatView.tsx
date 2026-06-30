'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search, MoreVertical, Camera, MessageSquare,
  RefreshCw, Users, Phone, ArrowLeft,
  Smile, Plus, Mic, Send, Info, CheckCheck, Clock,
  Volume2, VolumeX
} from 'lucide-react';
import { Room, Message } from '../../hooks/useChatSync';

/* ─────────────────────────────────────────────
   BOTTOM NAV TABS
───────────────────────────────────────────── */
type Tab = 'chats' | 'updates' | 'communities' | 'calls';

interface BottomNavProps {
  active: Tab;
  onSelect: (t: Tab) => void;
  isDarkMode: boolean;
  totalUnread: number;
}

function BottomNav({ active, onSelect, isDarkMode, totalUnread }: BottomNavProps) {
  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'chats', label: 'Chats', Icon: MessageSquare },
    { id: 'updates', label: 'Updates', Icon: RefreshCw },
    { id: 'communities', label: 'Communities', Icon: Users },
    { id: 'calls', label: 'Calls', Icon: Phone },
  ];

  return (
    <div
      className={`flex items-center border-t shrink-0 ${
        isDarkMode ? 'bg-[#1f2c34] border-[#2a3942]' : 'bg-[#f0f2f5] border-[#e9edef]'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative"
          >
            <div className="relative">
              <Icon
                size={22}
                className={isActive ? 'text-[#00a884]' : isDarkMode ? 'text-[#8696a0]' : 'text-[#54656f]'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {id === 'chats' && totalUnread > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#00a884] text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5">
                  {totalUnread > 99 ? '99+' : totalUnread}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide ${
                isActive ? 'text-[#00a884]' : isDarkMode ? 'text-[#8696a0]' : 'text-[#54656f]'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER PILL
───────────────────────────────────────────── */
type Filter = 'all' | 'unread' | 'favorites' | 'groups';

interface FilterPillProps {
  label: string;
  active: boolean;
  count?: number;
  isDarkMode: boolean;
  onClick: () => void;
}

function FilterPill({ label, active, count, isDarkMode, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 border transition-all ${
        active
          ? isDarkMode
            ? 'bg-[#00a884]/20 text-[#00a884] border-[#00a884]/30'
            : 'bg-[#e8f7f0] text-[#00a884] border-[#00a884]/30'
          : isDarkMode
          ? 'bg-[#2a3942] text-[#aebac1] border-[#2a3942]'
          : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef]'
      }`}
    >
      {label}
      {count != null && (
        <span className={`text-[11px] ${active ? 'text-[#00a884]' : isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   CHAT LIST SCREEN
───────────────────────────────────────────── */
interface ChatListScreenProps {
  rooms: Record<string, Room>;
  isDarkMode: boolean;
  profileConfig: Record<string, { emoji: string }>;
  onSelectRoom: (id: string) => void;
  totalUnread: number;
}

function ChatListScreen({ rooms, isDarkMode, profileConfig, onSelectRoom, totalUnread }: ChatListScreenProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const allRooms = Object.values(rooms);
  const filtered = allRooms.filter((r) => {
    if (search) return r.name.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === 'unread') return (r.unreadCount || 0) > 0;
    if (activeFilter === 'groups') return r.isGroup;
    return true;
  });
  const unreadCount = allRooms.reduce((s, r) => s + (r.unreadCount || 0), 0);

  return (
    <div className={`flex flex-col flex-1 min-h-0 ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#fff]'}`}>
      {/* ── Header ── */}
      <div className={`flex items-center justify-between px-4 pt-12 pb-2 ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#fff]'}`}>
        <h1 className={`text-[22px] font-bold ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
          WhatsApp
        </h1>
        <div className={`flex gap-3 ${isDarkMode ? 'text-[#aebac1]' : 'text-[#54656f]'}`}>
          <button className="p-1"><Camera size={22} /></button>
          <button className="p-1"><MoreVertical size={22} /></button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="px-3 pb-2">
        <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full ${isDarkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'}`}>
          <Search size={16} className={isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ask Meta AI or Search"
            className={`bg-transparent text-[14px] flex-1 outline-none ${isDarkMode ? 'text-[#e9edef] placeholder-[#8696a0]' : 'text-[#111b21] placeholder-[#667781]'}`}
          />
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex gap-2 px-3 pb-2 overflow-x-auto scrollbar-none">
        <FilterPill label="All" active={activeFilter === 'all'} isDarkMode={isDarkMode} onClick={() => setActiveFilter('all')} />
        <FilterPill label="Unread" count={unreadCount > 0 ? unreadCount : undefined} active={activeFilter === 'unread'} isDarkMode={isDarkMode} onClick={() => setActiveFilter('unread')} />
        <FilterPill label="Favorites" active={activeFilter === 'favorites'} isDarkMode={isDarkMode} onClick={() => setActiveFilter('favorites')} />
        <FilterPill label="Groups" active={activeFilter === 'groups'} isDarkMode={isDarkMode} onClick={() => setActiveFilter('groups')} />
      </div>

      {/* ── Chat List ── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((room) => {
          const lastMsg = room.messages?.[room.messages.length - 1];
          const timeStr = lastMsg
            ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b text-left transition-colors ${
                isDarkMode ? 'border-[#222e35]/40 hover:bg-[#202c33] active:bg-[#2a3942]' : 'border-[#f5f6f6] hover:bg-[#f5f6f6] active:bg-[#efeae2]'
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={room.avatar}
                  alt={room.name}
                  className="w-[52px] h-[52px] rounded-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <span className={`font-semibold text-[16px] truncate ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>
                    {room.name}
                  </span>
                  <span className={`text-[12px] shrink-0 ml-2 ${(room.unreadCount || 0) > 0 ? 'text-[#00a884] font-medium' : isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                    {timeStr}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    {lastMsg?.sender === 'me' && (
                      <CheckCheck size={14} className="text-[#53bdeb] shrink-0" />
                    )}
                    <span className={`text-[13px] truncate ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                      {lastMsg ? lastMsg.text : 'No hay mensajes.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {room.isPinned && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={isDarkMode ? 'text-[#8696a0]' : 'text-[#aebac1]'}>
                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                      </svg>
                    )}
                    {(room.unreadCount || 0) > 0 ? (
                      <span className="bg-[#00a884] text-white text-[11px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
                        {room.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── FAB ── */}
      <div className="absolute bottom-[72px] right-4 z-20">
        <button className="w-14 h-14 bg-[#00a884] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          <MessageSquare size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PLACEHOLDER SCREENS
───────────────────────────────────────────── */
function PlaceholderScreen({ icon, title, subtitle, isDarkMode }: { icon: React.ReactNode; title: string; subtitle: string; isDarkMode: boolean }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center gap-3 p-8 ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#fff]'}`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'}`}>
        {icon}
      </div>
      <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>{title}</h2>
      <p className={`text-[13px] text-center max-w-xs ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>{subtitle}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE CHAT AREA
───────────────────────────────────────────── */
interface MobileChatAreaProps {
  room: Room;
  messages: Message[];
  isDarkMode: boolean;
  isSending: boolean;
  isAuditMode: boolean;
  onBack: () => void;
  onSendMessage: (text: string) => void;
}

function MobileChatArea({ room, messages, isDarkMode, isSending, isAuditMode, onBack, onSendMessage }: MobileChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className={`flex flex-col flex-1 min-h-0 ${isDarkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]'}`}>
      {/* Wallpaper */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundSize: '400px',
          backgroundRepeat: 'repeat',
          opacity: isDarkMode ? 0.04 : 0.05,
        }}
      />

      {/* ── Chat Header ── */}
      <div
        className={`flex items-center gap-2 px-2 py-2 z-10 shrink-0 ${isDarkMode ? 'bg-[#202c33]' : 'bg-[#008069]'}`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}
      >
        <button onClick={onBack} className="p-2">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <img src={room.avatar} alt={room.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-[15px] truncate">{room.name}</h2>
          <p className="text-white/70 text-[12px] truncate">{room.statusText || 'tap here for contact info'}</p>
        </div>
        <div className="flex gap-1 text-white">
          <button className="p-2"><Phone size={20} /></button>
          <button className="p-2"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 relative z-10">
        {messages.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-[13px] ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
            Enviá un mensaje para comenzar.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === 'me' || msg.senderName === 'Tú';
            const isFiltering = msg.status === 'filtering';
            return (
              <div key={msg.id} className={`flex flex-col max-w-[78%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`px-3 py-1.5 rounded-lg shadow-sm text-[14px] leading-relaxed relative ${
                  isMe
                    ? isFiltering
                      ? 'bg-cyan-950 border border-cyan-800/60 animate-pulse text-[#e9edef] rounded-tr-none'
                      : isDarkMode
                        ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                        : 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                    : isDarkMode
                      ? 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                      : 'bg-white text-[#111b21] rounded-tl-none'
                }`}>
                  <div className="break-words pb-1">{msg.text}</div>
                  <div className={`flex items-center justify-end gap-1 text-[10px] ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && (
                      isFiltering
                        ? <Clock size={10} className="text-cyan-400" />
                        : <CheckCheck size={13} className="text-[#53bdeb]" />
                    )}
                  </div>
                </div>

                {/* Audit diff */}
                {isAuditMode && msg.originalText && (
                  <div className={`mt-1 px-3 py-2 rounded-lg text-[11px] max-w-full font-mono border ${isDarkMode ? 'bg-[#0d1f2d] border-cyan-900/40 text-[#8696a0]' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                    <span className="text-rose-400 block">{msg.originalText}</span>
                    <span className="text-emerald-400 block mt-0.5">{msg.text}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Input ── */}
      <div
        className={`flex items-end gap-2 px-2 py-2 z-10 shrink-0 ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#f0f2f5]'}`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
          <div className={`flex-1 flex items-end gap-2 rounded-3xl px-3.5 py-2 ${isDarkMode ? 'bg-[#202c33]' : 'bg-white'}`}>
            <button type="button">
              <Smile size={22} className={isDarkMode ? 'text-[#8696a0]' : 'text-[#54656f]'} />
            </button>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message"
              rows={1}
              className={`flex-1 bg-transparent outline-none text-[14px] resize-none max-h-32 py-0.5 ${isDarkMode ? 'text-[#e9edef] placeholder-[#8696a0]' : 'text-[#111b21] placeholder-[#667781]'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
            <button type="button">
              <Plus size={22} className={isDarkMode ? 'text-[#8696a0]' : 'text-[#54656f]'} />
            </button>
          </div>

          <button
            type={inputValue.trim() ? 'submit' : 'button'}
            disabled={isSending}
            className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow"
          >
            {inputValue.trim() && !isSending ? (
              <Send size={20} className="text-white ml-0.5" />
            ) : isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic size={20} className="text-white" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN MOBILE CHAT VIEW
───────────────────────────────────────────── */
interface MobileChatViewProps {
  rooms: Record<string, Room>;
  messages: Message[];
  activeRoomId: string;
  isDarkMode: boolean;
  isSending: boolean;
  isAuditMode: boolean;
  profileConfig: Record<string, { emoji: string }>;
  totalUnread: number;
  onSelectRoom: (id: string) => void;
  onSendMessage: (text: string) => void;
}

export default function MobileChatView({
  rooms,
  messages,
  activeRoomId,
  isDarkMode,
  isSending,
  isAuditMode,
  profileConfig,
  totalUnread,
  onSelectRoom,
  onSendMessage,
}: MobileChatViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  // null = show list; roomId = show chat
  const [openRoomId, setOpenRoomId] = useState<string | null>(null);

  const handleSelectRoom = (id: string) => {
    onSelectRoom(id);
    setOpenRoomId(id);
  };

  const currentRoom = openRoomId ? rooms[openRoomId] : null;

  return (
    <div
      className={`fixed inset-0 flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#111b21]' : 'bg-white'}`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* ── Panel: Chat Conversation ── */}
      {openRoomId && currentRoom ? (
        <MobileChatArea
          room={currentRoom}
          messages={messages}
          isDarkMode={isDarkMode}
          isSending={isSending}
          isAuditMode={isAuditMode}
          onBack={() => setOpenRoomId(null)}
          onSendMessage={onSendMessage}
        />
      ) : (
        <>
          {/* ── Panel: Tab Content ── */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {activeTab === 'chats' && (
              <ChatListScreen
                rooms={rooms}
                isDarkMode={isDarkMode}
                profileConfig={profileConfig}
                onSelectRoom={handleSelectRoom}
                totalUnread={totalUnread}
              />
            )}
            {activeTab === 'updates' && (
              <PlaceholderScreen
                isDarkMode={isDarkMode}
                icon={<RefreshCw size={32} className="text-[#8696a0]" />}
                title="Updates"
                subtitle="Status updates from your contacts will appear here."
              />
            )}
            {activeTab === 'communities' && (
              <PlaceholderScreen
                isDarkMode={isDarkMode}
                icon={<Users size={32} className="text-[#8696a0]" />}
                title="Communities"
                subtitle="Get started by creating or discovering communities."
              />
            )}
            {activeTab === 'calls' && (
              <PlaceholderScreen
                isDarkMode={isDarkMode}
                icon={<Phone size={32} className="text-[#8696a0]" />}
                title="Calls"
                subtitle="Your recent calls will appear here."
              />
            )}
          </div>

          {/* ── Bottom Navigation ── */}
          <BottomNav
            active={activeTab}
            onSelect={setActiveTab}
            isDarkMode={isDarkMode}
            totalUnread={totalUnread}
          />
        </>
      )}
    </div>
  );
}
