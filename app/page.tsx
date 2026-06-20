'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import MellowLogo from '../components/chat/MellowLogo';

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Read saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('mellow_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Simulate loading progress bar
  useEffect(() => {
    const intervals = [
      { delay: 100, target: 15 },
      { delay: 400, target: 35 },
      { delay: 800, target: 65 },
      { delay: 1200, target: 85 },
      { delay: 1500, target: 100 },
    ];

    intervals.forEach(({ delay, target }) => {
      setTimeout(() => {
        setProgress(target);
      }, delay);
    });

    // Redirect to chat page after loading is finished
    const redirectTimeout = setTimeout(() => {
      router.push('/chat');
    }, 1800);

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-between py-12 select-none transition-colors duration-150 ${
      isDarkMode ? 'bg-[#111b21] text-[#e9edef]' : 'bg-[#f0f2f5] text-[#111b21]'
    }`}>
      {/* Spacer to push logo to center */}
      <div />

      {/* Center: WhatsApp Brand Logo and Progress Bar */}
      <div className="flex flex-col items-center">
        {/* Custom Mellow Brand App Icon */}
        <MellowLogo 
          size={60} 
          className={isDarkMode ? 'text-[#8696a0]' : 'text-[#aebac1]'} 
        />

        {/* Progress Bar Container */}
        <div className={`w-[360px] h-[3px] rounded-full overflow-hidden mt-12 transition-colors ${
          isDarkMode ? 'bg-[#222d34]' : 'bg-[#e9edef]'
        }`}>
          <div 
            className="h-full bg-[#00a884] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom: WhatsApp text and encrypted statement */}
      <div className="flex flex-col items-center space-y-1.5 font-sans">
        <h2 className={`text-[15px] font-medium tracking-wide ${
          isDarkMode ? 'text-[#e9edef]' : 'text-[#54656f]'
        }`}>
          Mellow
        </h2>
        <div className={`flex items-center gap-1.5 text-[11px] ${
          isDarkMode ? 'text-[#8696a0]' : 'text-[#667781]'
        }`}>
          <Lock size={12} className="shrink-0" />
          <span>Cifrado de extremo a extremo</span>
        </div>
      </div>
    </div>
  );
}
