'use client';

import React from 'react';
import { X, Lock, ChevronRight } from 'lucide-react';
import { Room } from '../../hooks/useChatSync';

interface ContactInfoSidebarProps {
  room: Room;
  isDarkMode: boolean;
  onClose: () => void;
  onChangeProfile: (roomId: string, profile: 'couple' | 'family' | 'corporate') => void;
  metrics: {
    avoidedFights: number;
    avgToxicity: number;
    modifiedCount: number;
  };
  profileConfig: Record<string, {
    name: string;
    emoji: string;
    description: string;
    badgeDark: string;
    badgeLight: string;
  }>;
}

export default function ContactInfoSidebar({
  room,
  isDarkMode,
  onClose,
  onChangeProfile,
  metrics,
  profileConfig
}: ContactInfoSidebarProps) {
  return (
    <div className={`w-[360px] min-w-[320px] border-l flex flex-col shrink-0 transition-colors ${
      isDarkMode ? 'bg-[#121c24] border-[#222e35]' : 'bg-[#f0f2f5] border-[#e9edef]'
    }`}>
      {/* Header */}
      <div className={`h-[60px] px-5 flex items-center justify-between border-b transition-colors ${
        isDarkMode ? 'bg-[#202c33] border-[#222e35]/30 text-[#e9edef]' : 'bg-[#f0f2f5] border-[#e9edef]/80 text-[#111b21]'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className={`p-1 rounded-full cursor-pointer transition-colors ${
              isDarkMode ? 'hover:bg-[#2a3942]' : 'hover:bg-zinc-200'
            }`}
          >
            <X size={18} />
          </button>
          <span className="font-medium text-[15px]">Info. del contacto</span>
        </div>
      </div>

      {/* Info Content Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-200/10 dark:divide-zinc-200/5">
        
        {/* Contact Card profile */}
        <div className={`px-6 py-6 flex flex-col items-center text-center transition-colors ${
          isDarkMode ? 'bg-[#111b21]' : 'bg-[#ffffff]'
        }`}>
          <img 
            src={room?.avatar} 
            alt={room?.name} 
            className={`w-[120px] h-[120px] rounded-full object-cover shadow-sm mb-3 border ${
              isDarkMode ? 'border-[#222e35]' : 'border-zinc-200'
            }`}
          />
          <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}>{room?.name}</h2>
          <p className={`text-[13px] mt-1 font-mono ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>{room?.phone}</p>
          <span className="text-[12px] text-emerald-400 mt-1 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/10">
            {room?.statusText === 'en línea' ? 'En línea' : 'Middleware activo'}
          </span>
        </div>

        {/* Mellow Empathy Filter Selection */}
        <div className={`px-6 py-5 space-y-3.5 transition-colors ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#ffffff]'}`}>
          <div>
            <h3 className={`text-[12.5px] font-semibold tracking-wide uppercase font-mono ${
              isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
            }`}>
              Filtro de Empatía (Mellow)
            </h3>
            <p className={`text-[11.5px] mt-1 leading-snug ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
              Elija el perfil de redacción para esta conversación.
            </p>
          </div>

          <div className="space-y-2">
            {(Object.keys(profileConfig) as Array<keyof typeof profileConfig>).map((key) => {
              const isSelected = room?.profile === key;
              const config = profileConfig[key];

              return (
                <div
                  key={key}
                  onClick={() => onChangeProfile(room.id, key as 'couple' | 'family' | 'corporate')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#00a884] bg-[#2a3942]/30 ring-1 ring-[#00a884]/30' 
                      : isDarkMode 
                        ? 'border-[#2a3942]/60 hover:border-[#374248] bg-[#202c33]/20' 
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold text-[13px] flex items-center gap-1.5 ${
                      isDarkMode ? 'text-[#e9edef]' : 'text-zinc-800'
                    }`}>
                      <span>{config.emoji}</span>
                      <span>{config.name}</span>
                    </span>
                    {isSelected && (
                      <span className="text-[9px] bg-[#00a884] text-[#111b21] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className={`text-[11.5px] mt-1 leading-relaxed ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                    {config.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Harmony Metrics Panel */}
        <div className={`px-6 py-5 space-y-3.5 transition-colors ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#ffffff]'}`}>
          <h3 className={`text-[12.5px] font-semibold tracking-wide uppercase font-mono ${
            isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
          }`}>
            Métricas de Armonía Social
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            <div className={`border p-3 rounded-lg text-center transition-colors ${
              isDarkMode ? 'bg-[#202c33]/30 border-[#2a3942]/50' : 'bg-[#f0f2f5]/40 border-zinc-200'
            }`}>
              <span className={`text-[10px] block font-mono ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>EVITADAS</span>
              <strong className={`text-xl font-bold mt-1 block ${isDarkMode ? 'text-[#e9edef]' : 'text-zinc-800'}`}>{metrics.avoidedFights}</strong>
              <span className="text-[9px] text-[#00a884] block mt-0.5 font-mono">DISPUTAS</span>
            </div>
            <div className={`border p-3 rounded-lg text-center transition-colors ${
              isDarkMode ? 'bg-[#202c33]/30 border-[#2a3942]/50' : 'bg-[#f0f2f5]/40 border-zinc-200'
            }`}>
              <span className={`text-[10px] block font-mono ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>MODIFICADOS</span>
              <strong className="text-xl font-bold mt-1 block text-pink-500">{metrics.modifiedCount}</strong>
              <span className={`text-[9px] block mt-0.5 font-mono ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>MENSAJES</span>
            </div>
          </div>

          {/* Hostility meter */}
          <div className={`border p-3.5 rounded-lg space-y-2 transition-colors ${
            isDarkMode ? 'bg-[#202c33]/20 border-[#2a3942]/40' : 'bg-[#f0f2f5]/30 border-zinc-200'
          }`}>
            <div className={`flex justify-between items-center text-[11px] font-mono ${
              isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
            }`}>
              <span>HOSTILIDAD DETECTADA</span>
              <span className={metrics.avgToxicity > 0.7 ? 'text-red-500 font-bold' : 'text-emerald-500'}>
                {(metrics.avgToxicity * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className={`w-full h-1.5 rounded-full overflow-hidden border transition-colors ${
              isDarkMode ? 'bg-[#111b21] border-[#2a3942]/30' : 'bg-zinc-200 border-zinc-300/40'
            }`}>
              <div 
                className={`h-full transition-all duration-500 ${
                  metrics.avgToxicity > 0.7 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${metrics.avgToxicity * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Standard WhatsApp Info options */}
        <div className={`px-6 py-4 space-y-4 text-[13px] transition-colors ${
          isDarkMode ? 'bg-[#111b21] text-[#8696a0]' : 'bg-[#ffffff] text-[#667781]'
        }`}>
          <div className={`flex items-center justify-between cursor-pointer py-1 rounded ${
            isDarkMode ? 'hover:bg-[#202c33]/20' : 'hover:bg-zinc-100/50'
          }`}>
            <span className={isDarkMode ? 'text-[#e9edef]' : 'text-zinc-800'}>Silenciar notificaciones</span>
            <ChevronRight size={18} />
          </div>
          <div className={`flex items-center justify-between cursor-pointer py-1 rounded ${
            isDarkMode ? 'hover:bg-[#202c33]/20' : 'hover:bg-zinc-100/50'
          }`}>
            <span className={isDarkMode ? 'text-[#e9edef]' : 'text-zinc-800'}>Mensajes temporales</span>
            <div className="flex items-center gap-1 text-[12px]">
              <span>Desactivados</span>
              <ChevronRight size={18} />
            </div>
          </div>
          <div className={`flex items-center gap-3.5 py-1 cursor-pointer rounded ${
            isDarkMode ? 'hover:bg-[#202c33]/20' : 'hover:bg-zinc-100/50'
          }`}>
            <Lock size={16} className="text-[#8696a0] shrink-0" />
            <div>
              <p className={`text-[13px] leading-tight ${isDarkMode ? 'text-[#e9edef]' : 'text-zinc-800'}`}>Cifrado</p>
              <p className="text-[11px] leading-normal mt-0.5">Los mensajes y las llamadas están cifrados de extremo a extremo.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
