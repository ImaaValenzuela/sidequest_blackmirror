'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, Send, Flame, AlertOctagon, X } from 'lucide-react';

interface InterceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  activeProfile: 'couple' | 'family' | 'corporate';
  isDarkMode: boolean;
  onConfirmSend: (
    text: string, 
    originalText: string, 
    status: 'filtered' | 'failed', 
    metadata: { toxicityLevel?: number; originalTone?: string; savedMetric?: string }
  ) => void;
}

export default function InterceptionModal({
  isOpen,
  onClose,
  originalText,
  activeProfile,
  isDarkMode,
  onConfirmSend
}: InterceptionModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    refactored_message: string;
    original_tone: string;
    toxicity_level: number;
    saved_metric: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && originalText) {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      // Call API endpoint
      fetch('/api/buffer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText, context: activeProfile })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al procesar el mensaje.');
          return res.json();
        })
        .then((data) => {
          setAnalysis({
            refactored_message: data.refactored_message,
            original_tone: data.original_tone,
            toxicity_level: data.toxicity_level,
            saved_metric: data.saved_metric
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || 'Error de comunicación.');
          setLoading(false);
        });
    }
  }, [isOpen, originalText, activeProfile]);

  if (!isOpen) return null;

  const handleSendSweet = () => {
    if (analysis) {
      onConfirmSend(
        analysis.refactored_message,
        originalText,
        'filtered',
        {
          toxicityLevel: analysis.toxicity_level,
          originalTone: analysis.original_tone,
          savedMetric: analysis.saved_metric
        }
      );
    }
  };

  const handleSendRaw = () => {
    onConfirmSend(
      originalText,
      originalText,
      'failed',
      {
        toxicityLevel: analysis?.toxicity_level || 0.95,
        originalTone: analysis?.original_tone || 'Hostil e irritable',
        savedMetric: 'Infracción de Convivencia: Enviaste el mensaje original sin pulir.'
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent dark overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className={`relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border transition-all ${
        isDarkMode 
          ? 'bg-[#222e35] border-[#2f3b43] text-[#e9edef]' 
          : 'bg-[#ffffff] border-zinc-200 text-[#111b21]'
      }`}>
        
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#2a3942] border-[#2f3b43]' : 'bg-[#f0f2f5] border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-cyan-500 animate-pulse" size={20} />
            <h2 className="text-[15px] font-semibold tracking-wide uppercase font-mono">
              Consola de Intercepción Mellow
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#374248]' : 'hover:bg-zinc-200'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className={`text-xs font-mono tracking-wider ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                ANALIZANDO ARMONÍA EMOCIONAL...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex gap-2.5 items-center">
              <AlertOctagon size={20} />
              <p>Fallo de comunicación con Mellow. Puedes forzar el envío del mensaje original.</p>
            </div>
          ) : (
            <>
              {/* Telemetry alert block */}
              <div className={`p-3 rounded-lg flex items-center justify-between border ${
                analysis && analysis.toxicity_level > 0.7 
                  ? isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
                  : isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <Flame size={14} />
                  <span>NIVEL DE HOSTILIDAD:</span>
                  <strong className="text-xs">
                    {analysis ? (analysis.toxicity_level * 100).toFixed(0) : 0}%
                  </strong>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border ${
                  analysis && analysis.toxicity_level > 0.7 
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-emerald-500/30 bg-emerald-500/5'
                }`}>
                  {analysis && analysis.toxicity_level > 0.7 ? 'ADVERTENCIA' : 'APROBADO'}
                </span>
              </div>

              {/* Intercepted Raw message */}
              <div className="space-y-1">
                <span className={`text-[11px] font-semibold tracking-wider font-mono ${
                  isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                }`}>
                  MENSAJE DETECTADO:
                </span>
                <div className={`p-3 rounded-lg border-l-4 border-red-500 ${
                  isDarkMode ? 'bg-red-950/10 text-zinc-300' : 'bg-red-50/30 text-zinc-600'
                }`}>
                  <p className="text-xs italic line-through font-serif">
                    "{originalText}"
                  </p>
                  <p className="text-[10px] font-mono mt-1 text-red-500">
                    Tono: {analysis?.original_tone}
                  </p>
                </div>
              </div>

              {/* Mellow Sweetened proposal */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold tracking-wider font-mono text-cyan-400 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>SUGERENCIA DE REFUERZO DE VÍNCULO (MELLOW):</span>
                </span>
                <div className={`p-3 rounded-lg border-l-4 border-emerald-500 ${
                  isDarkMode ? 'bg-emerald-950/10 text-white' : 'bg-emerald-50/30 text-zinc-800'
                }`}>
                  <p className="text-xs font-sans font-semibold">
                    "{analysis?.refactored_message}"
                  </p>
                </div>
              </div>

              {/* Impact / Metric */}
              {analysis?.saved_metric && (
                <div className={`p-2.5 rounded-lg border font-mono text-[10.5px] leading-relaxed ${
                  isDarkMode ? 'bg-pink-950/10 border-pink-500/10 text-pink-400' : 'bg-pink-50 border-pink-100 text-pink-600'
                }`}>
                  🛡️ {analysis.saved_metric}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className={`px-5 py-4 flex flex-col gap-2 border-t ${
          isDarkMode ? 'bg-[#2a3942] border-[#2f3b43]' : 'bg-[#f0f2f5] border-zinc-200'
        }`}>
          {/* Main button: Send Sweetened */}
          <button
            onClick={handleSendSweet}
            disabled={loading && !error}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all select-none ${
              loading 
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-[#00a884] text-[#111b21] hover:bg-[#00bfa5] active:scale-[0.99] cursor-pointer'
            }`}
          >
            <Send size={14} />
            <span>Enviar Versión Dulce (Recomendado)</span>
          </button>

          {/* Secondary buttons row */}
          <div className="flex gap-2 text-[11px] font-mono">
            <button
              onClick={onClose}
              className={`flex-1 py-2 border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-[#2f3b43] text-[#8696a0] hover:bg-[#202c33]' 
                  : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Corregir
            </button>
            <button
              onClick={handleSendRaw}
              className={`flex-1 py-2 border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-all ${
                isDarkMode 
                  ? 'border-red-950 text-red-400 bg-red-950/10 hover:bg-red-950/30' 
                  : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'
              }`}
            >
              Forzar Original (Infracción)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
