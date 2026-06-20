'use client';

import React, { useState } from 'react';
import { X, UserPlus, Phone, User, Settings } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onCreateChat: (name: string, phone: string, profile: 'couple' | 'family' | 'corporate') => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  isDarkMode,
  onCreateChat
}: NewChatModalProps) {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [profile, setProfile] = useState<'couple' | 'family' | 'corporate'>('couple');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, ingresa un nombre.');
      return;
    }
    if (!phone.trim()) {
      setError('Por favor, ingresa un teléfono.');
      return;
    }
    
    setError(null);
    onCreateChat(name, phone, profile);
    
    // Reset form
    setName('');
    setPhone('');
    setProfile('couple');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden border transition-all ${
        isDarkMode 
          ? 'bg-[#222e35] border-[#2f3b43] text-[#e9edef]' 
          : 'bg-[#ffffff] border-zinc-200 text-[#111b21]'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#2a3942] border-[#2f3b43]' : 'bg-[#f0f2f5] border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <UserPlus size={18} className={isDarkMode ? 'text-cyan-400' : 'text-[#00a884]'} />
            <h2 className="text-[15px] font-bold tracking-tight">Iniciar Conversación</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#374248]' : 'hover:bg-zinc-200'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold tracking-wider font-mono flex items-center gap-1 ${
              isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
            }`}>
              <User size={12} />
              <span>NOMBRE DEL CONTACTO</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Jefe de Proyecto, Mi Amor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border-none outline-none rounded-lg text-sm px-3.5 py-2 focus:ring-2 transition-colors ${
                isDarkMode 
                  ? 'bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:ring-cyan-500' 
                  : 'bg-[#f0f2f5] text-[#111b21] placeholder-[#667781] focus:ring-[#00a884]'
              }`}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold tracking-wider font-mono flex items-center gap-1 ${
              isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
            }`}>
              <Phone size={12} />
              <span>NÚMERO DE TELÉFONO</span>
            </label>
            <input
              type="tel"
              placeholder="Ej: +54 9 11 5555-1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full border-none outline-none rounded-lg text-sm px-3.5 py-2 focus:ring-2 transition-colors ${
                isDarkMode 
                  ? 'bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:ring-cyan-500' 
                  : 'bg-[#f0f2f5] text-[#111b21] placeholder-[#667781] focus:ring-[#00a884]'
              }`}
              required
            />
          </div>

          {/* Profile Tone Field */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold tracking-wider font-mono flex items-center gap-1 ${
              isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
            }`}>
              <Settings size={12} />
              <span>PERFIL EMOCIONAL INICIAL (MELLOW)</span>
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value as any)}
              className={`w-full border-none outline-none rounded-lg text-sm px-3.5 py-2.5 focus:ring-2 transition-colors ${
                isDarkMode 
                  ? 'bg-[#2a3942] text-[#e9edef] focus:ring-cyan-500' 
                  : 'bg-[#f0f2f5] text-[#111b21] focus:ring-[#00a884]'
              }`}
            >
              <option value="couple">💕 Pareja (Ternura y Cariño)</option>
              <option value="family">🙏 Familiar (Respeto y Humildad)</option>
              <option value="corporate">💼 Corporativo (Sinergia y Formalidad)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-[#2f3b43] text-[#8696a0] hover:bg-[#2a3942]' 
                  : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#00a884] text-[#111b21] hover:bg-[#00bfa5] rounded-lg uppercase tracking-wider text-center font-bold cursor-pointer transition-transform active:scale-95"
            >
              Iniciar Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
