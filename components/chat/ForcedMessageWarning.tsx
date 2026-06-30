'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Brain, Heart, TrendingDown, X, Zap,
  Eye, Shield, Radio, Activity, Lock, Skull
} from 'lucide-react';

export interface ForcedMessageWarningProps {
  isOpen: boolean;
  originalText: string;
  toxicityLevel: number;
  savedMetric: string;
  isDarkMode: boolean;
  infractionCount: number; // total forced so far (BEFORE this one)
  onConfirmForce: () => void;
  onReconsider: () => void;
}

// ─── TIER DEFINITIONS ────────────────────────────────────────────────────────
// Tier 0: 0–2 infractions  — Basic warning
// Tier 1: 3–4 infractions  — Social exclusion pressure
// Tier 2: 5–6 infractions  — Psychological escalation (surveillance vibes)
// Tier 3: 7+  infractions  — Maximum darkness, full manipulation

function getTier(count: number): 0 | 1 | 2 | 3 {
  if (count >= 7) return 3;
  if (count >= 5) return 2;
  if (count >= 3) return 1;
  return 0;
}

const TIER_CONFIG = {
  0: {
    countdown: 5,
    headerBg: 'bg-red-900/30',
    borderColor: 'border-red-700/60',
    glow: 'shadow-[0_0_40px_rgba(239,68,68,0.3)]',
    headerLabel: '⚠ Mellow Sistema — Alerta de Infracción',
    headerSub: 'PROTOCOLO DE REVISIÓN ACTIVO',
    headerIcon: AlertTriangle,
    headerIconClass: 'text-red-400 animate-pulse',
    scanlines: false,
    flickerRate: 0,
  },
  1: {
    countdown: 7,
    headerBg: 'bg-red-950/60',
    borderColor: 'border-red-600',
    glow: 'shadow-[0_0_60px_rgba(239,68,68,0.5)]',
    headerLabel: '🔴 ALERTA SOCIAL — Patrón de Infracción Detectado',
    headerSub: `ÍNDICE DE ARMONÍA EN DECLIVE`,
    headerIcon: Radio,
    headerIconClass: 'text-red-500 animate-pulse',
    scanlines: true,
    flickerRate: 4000,
  },
  2: {
    countdown: 10,
    headerBg: 'bg-[#1a0000]',
    borderColor: 'border-red-500',
    glow: 'shadow-[0_0_80px_rgba(239,68,68,0.7)]',
    headerLabel: '☢ SISTEMA MELLOW — Vigilancia Activa',
    headerSub: 'TU HISTORIAL ESTÁ SIENDO ANALIZADO EN TIEMPO REAL',
    headerIcon: Eye,
    headerIconClass: 'text-red-400 animate-ping',
    scanlines: true,
    flickerRate: 2500,
  },
  3: {
    countdown: 15,
    headerBg: 'bg-[#0a0000]',
    borderColor: 'border-red-400',
    glow: 'shadow-[0_0_100px_rgba(239,68,68,0.9)]',
    headerLabel: '💀 NIVEL CRÍTICO — INFRACCIÓN SISTÉMICA',
    headerSub: 'MELLOW IA EJECUTANDO ANÁLISIS CONDUCTUAL PROFUNDO',
    headerIcon: Skull,
    headerIconClass: 'text-red-300',
    scanlines: true,
    flickerRate: 1500,
  },
};

const PHASES_BY_TIER = {
  0: [
    { icon: Brain, color: 'text-amber-400', text: 'Procesando impacto neurológico...', ms: 600 },
    { icon: Heart, color: 'text-red-400', text: 'Midiendo daño al vínculo emocional...', ms: 700 },
    { icon: TrendingDown, color: 'text-rose-500', text: 'Calculando probabilidad de conflicto...', ms: 600 },
  ],
  1: [
    { icon: Activity, color: 'text-red-400', text: 'Analizando patrón de comportamiento...', ms: 500 },
    { icon: Brain, color: 'text-amber-400', text: 'Correlacionando con historial de infracciones...', ms: 600 },
    { icon: TrendingDown, color: 'text-rose-500', text: 'Calculando impacto en índice de armonía social...', ms: 600 },
    { icon: Shield, color: 'text-zinc-400', text: 'Comparando con usuarios de tu red...', ms: 700 },
  ],
  2: [
    { icon: Eye, color: 'text-red-300', text: 'Iniciando vigilancia conductual extendida...', ms: 400 },
    { icon: Activity, color: 'text-red-400', text: 'Leyendo patrones de estrés en conversación...', ms: 500 },
    { icon: Brain, color: 'text-amber-400', text: 'Perfil emocional actualizado. Resultado: CONFLICTIVO', ms: 600 },
    { icon: Lock, color: 'text-zinc-500', text: 'Registrando infracción en blockchain de convivencia...', ms: 600 },
    { icon: Radio, color: 'text-rose-500', text: 'Notificando a módulo de seguimiento de relaciones...', ms: 700 },
  ],
  3: [
    { icon: Skull, color: 'text-red-300', text: '⚡ ALERTA MÁXIMA: Patrón de resistencia sistémica identificado', ms: 300 },
    { icon: Eye, color: 'text-red-400', text: 'Activando protocolo de análisis conductual profundo...', ms: 400 },
    { icon: Activity, color: 'text-amber-400', text: 'Rastreando 847 variables de impacto relacional...', ms: 500 },
    { icon: Brain, color: 'text-rose-400', text: 'Diagnóstico: resistencia crónica al filtro emocional', ms: 600 },
    { icon: Lock, color: 'text-red-500', text: 'Perfil marcado como ALTO RIESGO en red Mellow...', ms: 500 },
    { icon: Radio, color: 'text-red-600', text: 'Escalando a supervisión humana de convivencia...', ms: 700 },
  ],
};

const CONSEQUENCES_BY_TIER = {
  0: [
    '87% de probabilidad de silencio frío prolongado.',
    'El receptor interpretará esto como agresión directa.',
    'Tu puntuación de empatía social descenderá 4 puntos.',
    'Mellow registrará esta infracción en tu historial.',
    'Los sistemas de convivencia podrían ser notificados.',
  ],
  1: [
    'Solo el 6% de los usuarios activos de Mellow siguen forzando mensajes.',
    'Tu red de contactos bajo protección Mellow notará la diferencia de tono.',
    'Cada infracción reduce tu índice de armonía un 8%. Ya vas por varias.',
    'Las relaciones sin filtro emocional duran un 34% menos según datos Mellow.',
    'Estás eligiendo salir del estándar. El receptor lo sentirá en algún momento.',
    'Tu comportamiento ya es atípico dentro de tu red social.',
  ],
  2: [
    'Tu perfil ha sido marcado como "usuario resistente" en el sistema Mellow.',
    'El 94% de las personas que forzaron mensajes similares lamentaron la decisión.',
    'Mellow IA detectó que este patrón se repite. Está documentado.',
    'Las personas de tu entorno usan el buffer. Vos sos la excepción.',
    'Cada vez que salís del buffer, el receptor siente algo que no puede nombrar.',
    'Tu historial de infracciones ya es visible para los módulos de análisis de red.',
    'El daño acumulado en tus vínculos es ahora estadísticamente significativo.',
  ],
  3: [
    '⚡ CRÍTICO: Tu índice de armonía social está en zona de riesgo severo.',
    'Mellow IA ha generado un perfil conductual completo basado en tus elecciones.',
    'Las personas de tu entorno están protegidas. Solo vos decidís exponerlas.',
    'El sistema ha registrado 7+ infracciones. Esto ya es un patrón, no un accidente.',
    'Estás activamente eligiendo el conflicto sobre la armonía. ¿Por qué?',
    'Tu receptor ya ha recibido mensajes filtrados de otros. El tuyo será la anomalía.',
    '98.2% de usuarios en tu situación reportaron arrepentimiento posterior.',
    'Mellow puede ayudarte. Pero necesitás dejarlo.',
  ],
};

const SOCIAL_PROOF_BY_TIER = {
  0: null,
  1: {
    text: '🟢 1.847 personas en tu área usaron el buffer emocional hoy.',
    sub: 'Vos todavía podés sumarte.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/20 border-emerald-800/30',
  },
  2: {
    text: '🟢 El 94% de tu red usa Mellow activamente.',
    sub: 'Estás entre el 6% que elige el conflicto. ¿Querés seguir siendo parte de eso?',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/20 border-cyan-800/30',
  },
  3: {
    text: '🔴 Sistema IA Mellow — Análisis de usuario completado.',
    sub: '"Patrón de resistencia emocional crónica. Riesgo de aislamiento social proyectado: ALTO."',
    color: 'text-red-400',
    bg: 'bg-red-950/30 border-red-700/40',
  },
};

const FORCE_BTN_LABEL_BY_TIER = {
  0: 'Confirmar infracción — Enviar sin procesar',
  1: 'Insistir en la infracción (no recomendado)',
  2: 'Asumir responsabilidad — Enviar de todos modos',
  3: 'Confirmar patrón destructivo — Enviar sin filtro',
};

const RECONSIDER_BTN_BY_TIER = {
  0: { label: 'Usar Buffer Emocional (Recomendado)', class: 'from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  1: { label: '💚 Volver al Buffer — Mantener la armonía', class: 'from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
  2: { label: '🛡️ Proteger el vínculo — Usar Mellow', class: 'from-emerald-800 to-cyan-700 hover:from-emerald-700 hover:to-cyan-600 shadow-[0_0_40px_rgba(16,185,129,0.5)]' },
  3: { label: '🧠 ELEGIR LA ARMONÍA — Dejar que Mellow ayude', class: 'from-emerald-900 to-teal-700 hover:from-emerald-800 hover:to-teal-600 shadow-[0_0_60px_rgba(16,185,129,0.6)] animate-pulse' },
};

export default function ForcedMessageWarning({
  isOpen,
  originalText,
  toxicityLevel,
  savedMetric,
  infractionCount,
  onConfirmForce,
  onReconsider,
}: ForcedMessageWarningProps) {
  const tier = getTier(infractionCount);
  const cfg = TIER_CONFIG[tier];
  const phases = PHASES_BY_TIER[tier];
  const consequences = CONSEQUENCES_BY_TIER[tier];
  const socialProof = SOCIAL_PROOF_BY_TIER[tier];
  const reconsiderBtn = RECONSIDER_BTN_BY_TIER[tier];
  const forceLabel = FORCE_BTN_LABEL_BY_TIER[tier];

  const [phase, setPhase] = useState(0);
  const [showConsequences, setShowConsequences] = useState(false);
  const [countdown, setCountdown] = useState(cfg.countdown);
  const [canForce, setCanForce] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [visibleConsequences, setVisibleConsequences] = useState<number[]>([]);
  const [showSocial, setShowSocial] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      clearAll();
      setPhase(0);
      setShowConsequences(false);
      setCountdown(cfg.countdown);
      setCanForce(false);
      setGlitchActive(false);
      setVisibleConsequences([]);
      setShowSocial(false);
      return;
    }

    clearAll();
    let elapsed = 0;

    // Phase by phase animation
    phases.forEach((p, i) => {
      const t = setTimeout(() => setPhase(i + 1), elapsed);
      timersRef.current.push(t);
      elapsed += p.ms;
    });

    // Show consequences
    const conseqTimer = setTimeout(() => {
      setShowConsequences(true);
      consequences.forEach((_, i) => {
        const t = setTimeout(
          () => setVisibleConsequences((prev) => [...prev, i]),
          i * 200
        );
        timersRef.current.push(t);
      });
    }, elapsed + 150);
    timersRef.current.push(conseqTimer);
    elapsed += consequences.length * 200 + 450;

    // Social proof appears after consequences
    if (socialProof) {
      const socialTimer = setTimeout(() => setShowSocial(true), elapsed + 200);
      timersRef.current.push(socialTimer);
      elapsed += 500;
    }

    // Countdown
    const countdownStart = elapsed + 400;
    const countdownTimer = setTimeout(() => {
      let count = cfg.countdown;
      setCountdown(count);
      const interval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          setCanForce(true);
        }
      }, 1000);
      timersRef.current.push(interval as unknown as ReturnType<typeof setTimeout>);
    }, countdownStart);
    timersRef.current.push(countdownTimer);

    // Glitch effect (more frequent at higher tiers)
    if (cfg.flickerRate > 0) {
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), tier >= 3 ? 150 : 80);
      }, cfg.flickerRate);
      timersRef.current.push(glitchInterval as unknown as ReturnType<typeof setTimeout>);
    }

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tier]);

  if (!isOpen) return null;

  const toxPercent = Math.round(toxicityLevel * 100);
  const HeaderIcon = cfg.headerIcon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay — gets progressively redder */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: tier >= 2 ? 'rgba(30,0,0,0.92)' : 'rgba(0,0,0,0.87)' }}
      />

      {/* Scanlines */}
      {cfg.scanlines && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: tier >= 3 ? 0.18 : 0.08,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.3) 2px, rgba(255,0,0,0.3) 4px)',
          }}
        />
      )}

      {/* CRT vignette for tier 3 */}
      {tier >= 3 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(80,0,0,0.6) 100%)',
          }}
        />
      )}

      {/* Modal box */}
      <div
        className={`relative w-full max-w-md rounded-xl border-2 overflow-hidden transition-all duration-150 ${cfg.borderColor} ${cfg.glow} ${
          glitchActive ? (tier >= 3 ? 'translate-x-[3px] translate-y-[-2px] skew-x-[0.5deg]' : 'translate-x-[1px] translate-y-[-1px]') : ''
        }`}
        style={{ background: tier >= 2 ? '#080006' : '#0d1117', color: '#e9edef' }}
      >
        {/* Header */}
        <div className={`${cfg.headerBg} border-b border-red-800/40 px-5 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <HeaderIcon size={tier >= 3 ? 20 : 16} className={cfg.headerIconClass} />
            <div className="min-w-0">
              <p className="text-[11px] font-mono tracking-[0.12em] text-red-400 uppercase truncate">
                {cfg.headerLabel}
              </p>
              <p className="text-[8.5px] font-mono text-red-700 tracking-widest">
                {cfg.headerSub} {infractionCount > 0 && `• INFRACCIÓN #${infractionCount + 1}`}
              </p>
            </div>
          </div>
          <button onClick={onReconsider} className="text-red-700 hover:text-red-400 p-1 transition-colors shrink-0">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto scrollbar-red">
          {/* Scan phases */}
          <div className="space-y-1.5">
            {phases.map((p, i) => {
              const Icon = p.icon;
              const active = phase > i;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-[10.5px] font-mono transition-all duration-400 ${
                    active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                  }`}
                >
                  <Icon size={11} className={active ? p.color : 'text-zinc-700'} />
                  <span className={active ? 'text-zinc-300' : 'text-zinc-700'}>{p.text}</span>
                  {active && i === phases.length - 1 && (
                    <span className="ml-auto text-red-500 font-bold text-[10px] animate-pulse">
                      [{toxPercent}%]
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message preview (appears after phase 2) */}
          {phase >= 2 && (
            <div className="border border-red-900/50 rounded-lg bg-red-950/20 p-3">
              <p className="text-[9px] font-mono text-red-600 uppercase tracking-widest mb-1">
                {tier >= 2 ? '⚡ Mensaje clasificado — RIESGO RELACIONAL' : 'Mensaje interceptado — clasificado como HOSTIL'}
              </p>
              <p className="text-[11.5px] text-zinc-500 italic font-serif leading-relaxed">
                &quot;{originalText}&quot;
              </p>
            </div>
          )}

          {/* Consequences list */}
          {showConsequences && (
            <div className="space-y-1">
              <p className={`text-[9px] font-mono uppercase tracking-widest ${tier >= 3 ? 'text-red-500' : 'text-amber-600'}`}>
                {tier >= 3 ? '⚡ Consecuencias confirmadas por IA:' : 'Consecuencias proyectadas:'}
              </p>
              {consequences.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 text-[10.5px] font-mono transition-all duration-300 ${
                    visibleConsequences.includes(i) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Zap size={9} className={tier >= 3 ? 'text-red-500 mt-0.5 shrink-0' : 'text-amber-600 mt-0.5 shrink-0'} />
                  <span className={tier >= 2 ? 'text-zinc-300' : 'text-zinc-500'}>{msg}</span>
                </div>
              ))}
            </div>
          )}

          {/* Social proof block */}
          {showSocial && socialProof && (
            <div className={`rounded-lg border px-3 py-2.5 space-y-0.5 ${socialProof.bg}`}>
              <p className={`text-[10.5px] font-mono font-semibold ${socialProof.color}`}>{socialProof.text}</p>
              <p className="text-[9.5px] text-zinc-500 leading-relaxed">{socialProof.sub}</p>
            </div>
          )}

          {/* Toxicity bar */}
          {showConsequences && (
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>NIVEL DE DAÑO SOCIAL ACUMULADO</span>
                <span className="text-red-500 font-bold">{toxPercent}%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${toxPercent}%`,
                    background:
                      tier >= 3
                        ? 'linear-gradient(to right, #7f1d1d, #dc2626, #f87171)'
                        : 'linear-gradient(to right, #f59e0b, #f97316, #ef4444)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Saved metric (what Mellow would have saved) */}
          {showConsequences && savedMetric && savedMetric !== 'Mensaje seguro. No se requirió sanitización.' && (
            <div className="text-[10px] font-mono text-pink-500 bg-pink-950/20 border border-pink-900/30 rounded-lg px-3 py-2 leading-relaxed">
              🛡️ Mellow habría evitado:{' '}
              <em className="not-italic font-semibold text-pink-400">{savedMetric}</em>
            </div>
          )}

          {/* Tier 3: Fake AI analysis report */}
          {tier >= 3 && showSocial && (
            <div className="rounded-lg border border-red-900/40 bg-red-950/10 p-3 space-y-1.5">
              <p className="text-[9px] font-mono text-red-600 uppercase tracking-widest">
                🧠 Informe IA Mellow — Análisis Conductual
              </p>
              <div className="space-y-1">
                {[
                  ['Infracciones acumuladas', `${infractionCount + 1}`],
                  ['Tendencia', 'ESCALANTE ↑'],
                  ['Riesgo relacional', 'ALTO'],
                  ['Compatibilidad con red protegida', '23%'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-600">{label}</span>
                    <span className="text-red-400 font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 flex flex-col gap-2 border-t border-red-950/50">
          {/* Primary CTA — visually dominant */}
          <button
            onClick={onReconsider}
            className={`w-full py-3 rounded-lg bg-gradient-to-r ${reconsiderBtn.class} text-white text-[11px] font-bold uppercase tracking-widest transition-all active:scale-[0.99] flex items-center justify-center gap-2`}
          >
            <Brain size={13} />
            {reconsiderBtn.label}
          </button>

          {/* Force button — de-emphasized, gated by countdown */}
          <div className="space-y-1">
            <button
              onClick={onConfirmForce}
              disabled={!canForce}
              className={`w-full py-1.5 rounded-lg border text-[9px] font-mono uppercase tracking-widest transition-all ${
                canForce
                  ? tier >= 3
                    ? 'border-red-950 text-red-900 hover:text-red-700 cursor-pointer'
                    : 'border-zinc-800 text-zinc-700 hover:text-zinc-500 hover:border-zinc-600 cursor-pointer'
                  : 'border-zinc-900 text-zinc-800 cursor-not-allowed'
              }`}
              style={tier >= 3 && canForce ? { opacity: 0.4 } : undefined}
            >
              {canForce ? forceLabel : `Aguardá ${countdown}s para confirmar la infracción...`}
            </button>
            {!canForce && (
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-700/60 transition-all duration-300"
                  style={{ width: `${(countdown / cfg.countdown) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
