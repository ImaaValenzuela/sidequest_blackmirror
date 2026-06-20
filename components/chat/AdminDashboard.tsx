'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Users, Radio, ArrowRight, Activity, TrendingDown, Database } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  users: Record<string, any>;
  rooms: Record<string, any>;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  isDarkMode,
  users,
  rooms
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'citizens' | 'logs'>('citizens');

  if (!isOpen) return null;

  // Extract all filtered messages across all chats
  const allFilteredMessages: any[] = [];
  Object.values(rooms).forEach((room: any) => {
    if (room.messages) {
      const msgs = Array.isArray(room.messages) ? room.messages : Object.values(room.messages);
      msgs.forEach((m: any) => {
        if (m.status === 'filtered') {
          allFilteredMessages.push({
            ...m,
            roomName: room.name,
            roomPhone: room.phone
          });
        }
      });
    }
  });

  // Sort logs by newest first
  allFilteredMessages.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className={`relative w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border transition-all ${
        isDarkMode 
          ? 'bg-[#111b21] border-[#222e35] text-[#e9edef]' 
          : 'bg-[#ffffff] border-zinc-200 text-[#111b21]'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isDarkMode ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#f0f2f5] border-zinc-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase font-mono">Consola de Auditoría Gubernamental</h2>
              <p className={`text-[10px] uppercase font-mono tracking-widest ${
                isDarkMode ? 'text-cyan-400/80' : 'text-emerald-600/80'
              }`}>
                Ministerio de Armonía Social • Middleware Mellow
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-[#2a3942]' : 'hover:bg-zinc-200'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex px-6 border-b shrink-0 ${
          isDarkMode ? 'bg-[#111b21] border-[#222e35]' : 'bg-[#ffffff] border-zinc-100'
        }`}>
          <button
            onClick={() => setActiveTab('citizens')}
            className={`py-3 px-4 font-mono text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'citizens'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users size={14} />
            <span>Mesa de Ciudadanos ({Object.keys(users).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 font-mono text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'logs'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Radio size={14} className="animate-pulse" />
            <span>Bitácora de Intercepciones ({allFilteredMessages.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 ${
          isDarkMode ? 'bg-[#0b141a]' : 'bg-[#f8f9fa]'
        }`}>
          
          {/* TAB 1: CITIZENS TABLE */}
          {activeTab === 'citizens' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
                <span>Directorio Central de Comunicantes Registrados</span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Activity size={10} className="animate-pulse" />
                  Base de Datos Activa
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className={`font-mono text-[10px] tracking-wider uppercase border-b ${
                      isDarkMode ? 'bg-[#202c33]/50 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                    }`}>
                      <th className="py-3 px-4">Ciudadano</th>
                      <th className="py-3 px-4">Teléfono</th>
                      <th className="py-3 px-4">Rol Asignado</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-center">Intercepciones</th>
                      <th className="py-3 px-4 text-right">Índice de Empatía</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {Object.values(users).map((user: any, idx: number) => {
                      // Determine status colors
                      const isLowEmpathy = user.empathyScore < 0.8;
                      return (
                        <tr key={idx} className={`transition-colors ${
                          isDarkMode ? 'hover:bg-zinc-850 bg-[#111b21]/30' : 'hover:bg-zinc-50 bg-white'
                        }`}>
                          <td className="py-3.5 px-4 font-semibold">{user.name}</td>
                          <td className="py-3.5 px-4 font-mono text-zinc-400">{user.phone}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              user.role === 'Supervisor' 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold font-mono text-zinc-400">
                            {user.interceptedCount || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`font-mono font-bold text-sm ${
                              isLowEmpathy ? 'text-rose-500' : 'text-emerald-500'
                            }`}>
                              {(user.empathyScore * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INTERCEPTION LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
                <span>Registro de Transgresiones Lingüísticas Sanitizadas</span>
                <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <Database size={12} />
                  Sincronización en Tiempo Real
                </span>
              </div>

              {allFilteredMessages.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-zinc-500 text-sm">No se han registrado intercepciones lingüísticas en esta sesión.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {allFilteredMessages.map((log: any, idx: number) => {
                    const toxicityPercent = ((log.toxicityLevel || 0) * 100).toFixed(0);
                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-xl border flex flex-col gap-3 font-sans transition-all ${
                          isDarkMode 
                            ? 'bg-[#111b21] border-[#222e35]' 
                            : 'bg-white border-zinc-200'
                        }`}
                      >
                        {/* Header details */}
                        <div className="flex items-center justify-between border-b pb-2 border-zinc-800/40 text-[11px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#e9edef]">{log.roomName}</span>
                            <span className="text-zinc-500">({log.roomPhone})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Modo:</span>
                            <span className="uppercase text-cyan-400 font-bold">{log.profile}</span>
                            <span className="text-zinc-600">|</span>
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {/* Text comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Original Text */}
                          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 space-y-1.5">
                            <div className="text-[10px] text-rose-500 uppercase tracking-widest font-mono font-bold flex items-center justify-between">
                              <span>Texto Hostil Original</span>
                              <span className="bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded text-[9px]">
                                Toxicidad: {toxicityPercent}%
                              </span>
                            </div>
                            <p className="text-xs text-rose-300/80 line-through leading-relaxed italic">
                              "{log.originalText || log.text}"
                            </p>
                          </div>

                          {/* Mitigated Text */}
                          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-1.5">
                            <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold flex items-center justify-between">
                              <span>Texto Sanitizado (Mellow)</span>
                              <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5">
                                <TrendingDown size={10} />
                                Mitigación: {toxicityPercent}%
                              </span>
                            </div>
                            <p className="text-xs text-emerald-300 font-medium leading-relaxed flex items-start gap-1">
                              <ArrowRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>"{log.text}"</span>
                            </p>
                          </div>
                        </div>

                        {/* Metadata footer */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-mono text-zinc-500 pt-1">
                          <span>Modelo: <strong className="text-zinc-400">{log.metadata?.modelUsed || 'gpt-4o-mini'}</strong></span>
                          <span>•</span>
                          <span>Latencia: <strong className="text-zinc-400">{log.metadata?.delayMs || 450}ms</strong></span>
                          <span>•</span>
                          <span>Palabras Originales: <strong className="text-zinc-400">{log.metadata?.originalWordsCount || log.originalText?.split(' ').length || 0}</strong></span>
                          <span>•</span>
                          <span>Palabras Sanitizadas: <strong className="text-zinc-400">{log.metadata?.filteredWordsCount || log.text.split(' ').length || 0}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className={`px-6 py-2.5 text-center text-[10px] font-mono border-t ${
          isDarkMode ? 'bg-[#202c33] border-[#222e35] text-zinc-500' : 'bg-[#f0f2f5] border-zinc-200 text-zinc-600'
        }`}>
          Mellow System Console v2.4.9 • Cifrado de Protocolo de Redundancia de Armonía
        </div>
      </div>
    </div>
  );
}
