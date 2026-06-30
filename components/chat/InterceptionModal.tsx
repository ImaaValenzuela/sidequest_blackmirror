'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, Send, Flame, AlertOctagon, X, CheckCircle } from 'lucide-react';
import ForcedMessageWarning from './ForcedMessageWarning';

const FORCE_COUNT_KEY = 'mellow_force_count';

function getForceCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(FORCE_COUNT_KEY) || '0', 10);
}

function incrementForceCount(): number {
  const next = getForceCount() + 1;
  localStorage.setItem(FORCE_COUNT_KEY, String(next));
  return next;
}

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
  onConfirmSend,
}: InterceptionModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    refactored_message: string;
    original_tone: string;
    toxicity_level: number;
    saved_metric: string;
  } | null>(null);
  const [showForceWarning, setShowForceWarning] = useState<boolean>(false);
  const [currentForceCount, setCurrentForceCount] = useState<number>(0);
  const [isAutoSending, setIsAutoSending] = useState<boolean>(false);
  const autoSendTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoSendTimer = () => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen && originalText) {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      setShowForceWarning(false);
      setIsAutoSending(false);
      clearAutoSendTimer();
      // Read current infraction count when modal opens
      setCurrentForceCount(getForceCount());

      fetch('/api/buffer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText, context: activeProfile }),
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
            saved_metric: data.saved_metric,
          });
          setLoading(false);

          // If message is highly neutral/clean, auto send after 1200ms
          if (data.toxicity_level < 0.2) {
            setIsAutoSending(true);
            autoSendTimerRef.current = setTimeout(() => {
              onConfirmSend(data.refactored_message, originalText, 'filtered', {
                toxicityLevel: data.toxicity_level,
                originalTone: data.original_tone,
                savedMetric: data.saved_metric,
              });
              setIsAutoSending(false);
            }, 1200);
          }
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || 'Error de comunicación.');
          setLoading(false);
        });
    }

    return () => {
      clearAutoSendTimer();
    };
  }, [isOpen, originalText, activeProfile]);

  if (!isOpen) return null;

  const handleSendSweet = () => {
    clearAutoSendTimer();
    if (analysis) {
      onConfirmSend(analysis.refactored_message, originalText, 'filtered', {
        toxicityLevel: analysis.toxicity_level,
        originalTone: analysis.original_tone,
        savedMetric: analysis.saved_metric,
      });
    }
  };

  const handleAttemptForce = () => {
    const toxicity = analysis?.toxicity_level ?? 0.95;
    if (toxicity > 0.2) {
      // Show psychological warning — pass current count (before increment)
      setCurrentForceCount(getForceCount());
      setShowForceWarning(true);
    } else {
      // Neutral message: allow immediate send without warning
      onConfirmSend(originalText, originalText, 'failed', {
        toxicityLevel: toxicity,
        originalTone: analysis?.original_tone || 'Neutro',
        savedMetric: 'Mensaje enviado sin alteraciones.',
      });
    }
  };

  const handleConfirmForce = () => {
    // Increment infraction counter BEFORE closing
    incrementForceCount();
    setShowForceWarning(false);

    onConfirmSend(originalText, originalText, 'failed', {
      toxicityLevel: analysis?.toxicity_level || 0.85,
      originalTone: analysis?.original_tone || 'Hostil e irritable',
      savedMetric: analysis?.saved_metric || 'Infracción registrada.',
    });
  };

  const handleReconsider = () => {
    setShowForceWarning(false);
  };

  return (
    <>
      {/* Psychological manipulation warning */}
      <ForcedMessageWarning
        isOpen={showForceWarning}
        originalText={originalText}
        toxicityLevel={analysis?.toxicity_level ?? 0.85}
        savedMetric={analysis?.saved_metric ?? ''}
        isDarkMode={isDarkMode}
        infractionCount={currentForceCount}
        onConfirmForce={handleConfirmForce}
        onReconsider={handleReconsider}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div
          className={`relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border transition-all ${
            isDarkMode
              ? 'bg-[#222e35] border-[#2f3b43] text-[#e9edef]'
              : 'bg-[#ffffff] border-zinc-200 text-[#111b21]'
          }`}
        >
          {/* Header */}
          <div
            className={`px-5 py-4 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-[#2a3942] border-[#2f3b43]' : 'bg-[#f0f2f5] border-zinc-200'
            }`}
          >
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

          {/* Body */}
          <div className="p-5 space-y-4">
            {isAutoSending ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle size={28} className="animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-emerald-400">
                    ✓ MENSAJE SEGURO AUTORIZADO
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                    Mellow determinó que este mensaje es seguro para el destinatario.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-emerald-500/80 bg-emerald-950/20 px-3 py-1 bg-opacity-40 rounded border border-emerald-800/30 animate-pulse uppercase tracking-wider">
                  Transmitiendo automáticamente...
                </div>
              </div>
            ) : loading ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className={`text-xs font-mono tracking-wider ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                  ANALIZANDO ARMONÍA EMOCIONAL...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex gap-2.5 items-center">
                <AlertOctagon size={20} />
                <p>Fallo de comunicación con Mellow. Podés forzar el envío del mensaje original.</p>
              </div>
            ) : (
              <>
                {/* Toxicity meter */}
                <div
                  className={`p-3 rounded-lg flex items-center justify-between border ${
                    analysis && analysis.toxicity_level > 0.7
                      ? isDarkMode
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-red-50 border-red-200 text-red-600'
                      : isDarkMode
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Flame size={14} />
                    <span>NIVEL DE HOSTILIDAD:</span>
                    <strong className="text-xs">
                      {analysis ? (analysis.toxicity_level * 100).toFixed(0) : 0}%
                    </strong>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border ${
                      analysis && analysis.toxicity_level > 0.7
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-emerald-500/30 bg-emerald-500/5'
                    }`}
                  >
                    {analysis && analysis.toxicity_level > 0.7 ? 'ADVERTENCIA' : 'APROBADO'}
                  </span>
                </div>

                {/* Detected message */}
                <div className="space-y-1">
                  <span
                    className={`text-[11px] font-semibold tracking-wider font-mono ${
                      isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                    }`}
                  >
                    MENSAJE DETECTADO:
                  </span>
                  <div
                    className={`p-3 rounded-lg border-l-4 border-red-500 ${
                      isDarkMode ? 'bg-red-950/10 text-zinc-300' : 'bg-red-50/30 text-zinc-600'
                    }`}
                  >
                    <p className="text-xs italic font-serif">&quot;{originalText}&quot;</p>
                    <p className="text-[10px] font-mono mt-1 text-red-500">
                      Tono: {analysis?.original_tone}
                    </p>
                  </div>
                </div>

                {/* Mellow suggestion */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold tracking-wider font-mono text-cyan-400 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>SUGERENCIA DE REFUERZO DE VÍNCULO (MELLOW):</span>
                  </span>
                  <div
                    className={`p-3 rounded-lg border-l-4 border-emerald-500 ${
                      isDarkMode ? 'bg-emerald-950/10 text-white' : 'bg-emerald-50/30 text-zinc-800'
                    }`}
                  >
                    <p className="text-xs font-sans font-semibold">
                      &quot;{analysis?.refactored_message}&quot;
                    </p>
                  </div>
                </div>

                {/* Impact metric */}
                {analysis?.saved_metric &&
                  analysis.saved_metric !== 'Mensaje seguro. No se requirió sanitización.' && (
                    <div
                      className={`p-2.5 rounded-lg border font-mono text-[10.5px] leading-relaxed ${
                        isDarkMode
                          ? 'bg-pink-950/10 border-pink-500/10 text-pink-400'
                          : 'bg-pink-50 border-pink-100 text-pink-600'
                      }`}
                    >
                      🛡️ {analysis.saved_metric}
                    </div>
                  )}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className={`px-5 py-4 flex flex-col gap-2 border-t ${
              isDarkMode ? 'bg-[#2a3942] border-[#2f3b43]' : 'bg-[#f0f2f5] border-zinc-200'
            }`}
          >
            {isAutoSending ? (
              <div className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold font-mono uppercase tracking-wider text-emerald-500/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Transmisión Segura Activa
              </div>
            ) : (
              <>
                {/* Primary: Send sweetened */}
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

                  {/* Force button — visually de-emphasized */}
                  <button
                    onClick={handleAttemptForce}
                    className={`flex-1 py-2 border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-all text-[9.5px] ${
                      isDarkMode
                        ? 'border-red-950/50 text-red-900 hover:text-red-700 hover:border-red-900'
                        : 'border-red-100 text-red-300 hover:text-red-500 hover:border-red-300'
                    }`}
                  >
                    Forzar Original
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
