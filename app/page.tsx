'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Terminal, Shield, Sparkles, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);

  const logs = [
    'Initializing Mellow Dystopian Client v1.0.4...',
    'Loading neural linguistics model (gpt-4o-mini)... OK',
    'Injecting empathy-filtering modules...',
    'Injecting Couples Tone filter (💕 Soft & Vulnerable)... OK',
    'Injecting Family Tone filter (🙏 Respectful & Humble)... OK',
    'Injecting Corporate Tone filter (💼 Synergy & Compliance)... OK',
    'Establishing connection to Firebase Realtime Database...',
    'Middleware Core status: ONLINE & FILTERING',
    'WARNING: Empathy filter cannot be disabled. Have a nice, polite day.'
  ];

  useEffect(() => {
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-[#070b0e] text-[#e9edef] overflow-hidden select-none px-4">
      {/* Scanline / Grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_95%,rgba(6,182,212,0.35)_95%)] bg-[size:100%_4px] [animation:scanline_10s_linear_infinite]"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Cyberpunk background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="w-full max-w-xl flex flex-col items-center text-center space-y-8 z-10">
        
        {/* Logo and Dystopian Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-950/40 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-950/50">
            <Sparkles size={36} className="text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200">
            MELLOW
          </h1>
          <p className="text-xs font-mono text-cyan-500/80 tracking-widest uppercase">
            MIDDLEWARE EMOCIONAL CLIENT
          </p>
        </div>

        {/* Dystopian Description */}
        <p className="text-sm text-[#8696a0] max-w-md leading-relaxed">
          Bienvenido al cliente de comunicación unificada del Ministerio de Armonía Social. 
          Su teclado ha sido intervenido. Toda agresión, sarcasmo o pasivo-agresividad será erradicada y reformulada de manera diplomática en tiempo real.
        </p>

        {/* Terminal Screen */}
        <div className="w-full bg-[#0a0f12]/90 border border-cyan-950 rounded-xl p-4 text-left font-mono text-[11px] leading-relaxed shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-cyan-950 pb-2 mb-3 text-[10px] text-cyan-500/60">
            <div className="flex items-center gap-1.5">
              <Terminal size={12} />
              <span>SYSTEM BOOT LOGS</span>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div className="space-y-1.5 min-h-[170px] max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-950">
            {terminalLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-cyan-500/40 shrink-0">[{index + 1}]</span>
                <span className={index === logs.length - 1 ? 'text-amber-400 font-bold' : 'text-zinc-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enter Button Action */}
        <div className="w-full flex flex-col items-center gap-4">
          {showButton ? (
            <Link 
              href="/chat"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Button shine animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
              
              Conectarse al Middleware
            </Link>
          ) : (
            <div className="h-[46px] flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Compliance Warning */}
          <div className="max-w-xs flex gap-2.5 items-start bg-red-950/15 border border-red-900/25 p-3 rounded-lg text-[10px] text-red-400/80 leading-normal text-left font-mono">
            <AlertTriangle size={14} className="shrink-0 text-red-500 mt-0.5" />
            <span>
              <strong>DECRETO 409-C:</strong> El uso del middleware es mandatorio. La evasión o manipulación del software se penaliza con la pérdida de 400 puntos de crédito social.
            </span>
          </div>
        </div>

      </main>

      {/* Footer credits */}
      <footer className="absolute bottom-6 text-[10px] text-[#8696a0]/50 font-mono tracking-wider">
        MELLOW MIDDLEWARE INC. &copy; {new Date().getFullYear()} // BLACK MIRROR INSPIRATION
      </footer>
    </div>
  );
}
