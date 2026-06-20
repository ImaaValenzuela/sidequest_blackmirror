'use client';

import React from 'react';
import { 
  MessageSquare, 
  Compass, 
  Users, 
  Volume2, 
  Terminal, 
  Settings, 
  Sun, 
  Moon 
} from 'lucide-react';

interface SidebarIconRailProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAuditMode: boolean;
  onToggleAuditMode: () => void;
}

export default function SidebarIconRail({
  isDarkMode,
  onToggleTheme,
  isAuditMode,
  onToggleAuditMode
}: SidebarIconRailProps) {
  return (
    <div className={`w-[64px] border-r flex flex-col items-center justify-between py-4 shrink-0 transition-colors ${
      isDarkMode ? 'bg-[#202c33] border-[#222e35] text-[#aebac1]' : 'bg-[#f0f2f5] border-[#e9edef] text-[#54656f]'
    }`}>
      {/* Top icons */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div 
          className={`p-2 rounded-lg cursor-pointer transition-colors ${
            isDarkMode 
              ? 'text-cyan-400 bg-[#374248]' 
              : 'text-[#00a884] bg-[#e1e3e6]'
          }`} 
          title="Chats"
        >
          <MessageSquare size={22} />
        </div>
        <div className="p-2 hover:bg-[#374248] dark:hover:bg-[#374248] hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors relative" title="Estado">
          <Compass size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </div>
        <div className="p-2 hover:bg-[#374248] dark:hover:bg-[#374248] hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors" title="Comunidades">
          <Users size={22} />
        </div>
        <div className="p-2 hover:bg-[#374248] dark:hover:bg-[#374248] hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors" title="Canales">
          <Volume2 size={22} />
        </div>
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Theme Toggle Button */}
        <button 
          onClick={onToggleTheme}
          className="p-2 hover:bg-[#374248] dark:hover:bg-[#374248] hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors"
          title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {isDarkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} />}
        </button>
        
        {/* Audit Mode Toggle */}
        <button 
          onClick={onToggleAuditMode} 
          className={`p-2 rounded-lg cursor-pointer transition-colors ${
            isAuditMode 
              ? isDarkMode 
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/30' 
                : 'text-[#00a884] bg-emerald-50 border border-emerald-200'
              : 'hover:bg-[#374248] dark:hover:bg-[#374248] hover:bg-zinc-200'
          }`}
          title="Toggle Modo Auditoría (Black Mirror Debug)"
        >
          <Terminal size={22} />
        </button>
        <div className="p-2 hover:bg-[#374248] dark:hover:bg-[#374248] hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors" title="Configuración">
          <Settings size={22} />
        </div>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
          alt="User profile" 
          className={`w-8 h-8 rounded-full object-cover border ${isDarkMode ? 'border-[#2a3942]' : 'border-zinc-300'}`}
          title="Perfil de Usuario"
        />
      </div>
    </div>
  );
}
