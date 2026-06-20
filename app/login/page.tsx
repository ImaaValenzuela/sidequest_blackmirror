'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('mellow_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Monitor auth state to redirect to chat if already logged in
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/chat');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const initRecaptcha = () => {
    if (recaptchaVerifierRef.current || !auth) return;
    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, proceed with phone auth
        },
        'expired-callback': () => {
          setError('El reCAPTCHA ha expirado. Por favor, reintenta.');
        }
      });
    } catch (err: any) {
      console.error('Error initializing Recaptcha:', err);
      setError('Error de inicialización de seguridad.');
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.startsWith('+')) {
      setError('El número debe incluir código de país (ej. +5491155551234)');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      if (!auth) {
        throw new Error('Servicio de autenticación no disponible.');
      }
      initRecaptcha();
      
      const appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        throw new Error('Verificador de seguridad no listo.');
      }
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      confirmationResultRef.current = confirmation;
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al enviar código de verificación. Verifica el formato del número.');
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const confirmationResult = confirmationResultRef.current;
      if (!confirmationResult) {
        throw new Error('Sesión de verificación expirada. Vuelve a solicitar el código.');
      }
      
      await confirmationResult.confirm(verificationCode);
      // Auth listener handles redirect
    } catch (err: any) {
      console.error(err);
      setError('Código incorrecto o inválido.');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-center relative font-sans transition-colors duration-150 ${
      isDarkMode ? 'bg-[#0c1317] text-[#e9edef]' : 'bg-[#eae6df] text-[#111b21]'
    }`}>
      {/* Top Banner (WhatsApp Brand styling) */}
      <div className={`absolute top-0 left-0 right-0 h-[220px] -z-10 transition-colors ${
        isDarkMode ? 'bg-[#005c4b]' : 'bg-[#00a884]'
      }`} />

      {/* invisible recaptcha anchor */}
      <div id="recaptcha-container"></div>

      {/* Main card */}
      <div className={`w-[440px] max-w-full p-8 rounded-xl shadow-2xl transition-colors border ${
        isDarkMode ? 'bg-[#222e35] border-[#2f3b43]' : 'bg-[#ffffff] border-zinc-200'
      }`}>
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3.5 ${
            isDarkMode ? 'bg-[#2a3942] text-cyan-400' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <MessageSquare size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Middleware Mellow</h1>
          <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
            Portal de Verificación de Convivencia
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex gap-2 items-center">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[11.5px] font-semibold tracking-wider font-mono ${
                isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
              }`}>
                NÚMERO DE TELÉFONO (CON CÓDIGO DE PAÍS)
              </label>
              <input
                type="tel"
                placeholder="+54 9 11 5555-1234"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full border-none outline-none rounded-lg text-sm px-3.5 py-2.5 focus:ring-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:ring-cyan-500' 
                    : 'bg-[#f0f2f5] text-[#111b21] placeholder-[#667781] focus:ring-[#00a884]'
                }`}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all select-none ${
                loading || !phoneNumber
                  ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-[#00a884] text-[#111b21] hover:bg-[#00bfa5] active:scale-[0.99] cursor-pointer'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#111b21] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Enviar Código OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[11.5px] font-semibold tracking-wider font-mono ${
                isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
              }`}>
                CÓDIGO DE VERIFICACIÓN (6 DÍGITOS)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`w-full border-none outline-none rounded-lg text-center font-mono tracking-widest text-lg px-3.5 py-2 focus:ring-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:ring-cyan-500' 
                    : 'bg-[#f0f2f5] text-[#111b21] placeholder-[#667781] focus:ring-[#00a884]'
                }`}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all select-none ${
                loading || verificationCode.length !== 6
                  ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-[#00a884] text-[#111b21] hover:bg-[#00bfa5] active:scale-[0.99] cursor-pointer'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#111b21] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Verificar Código'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className={`w-full text-center text-xs font-semibold uppercase tracking-wider hover:underline py-1.5 ${
                isDarkMode ? 'text-cyan-400' : 'text-[#00a884]'
              }`}
              disabled={loading}
            >
              Atrás
            </button>
          </form>
        )}
      </div>

      {/* Dystopian Footer note */}
      <div className={`mt-6 text-[10.5px] font-mono text-center flex items-center gap-1.5 ${
        isDarkMode ? 'text-zinc-600' : 'text-zinc-500'
      }`}>
        <ShieldCheck size={13} />
        <span>Mellow Middleware v2.1 • Cifrado de Estado</span>
      </div>
    </div>
  );
}
