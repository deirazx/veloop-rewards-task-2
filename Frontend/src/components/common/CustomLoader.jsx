import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  'Preparing active rewards...',
  'Fetching verification rules...',
  'Unlocking reward pool...'
];

export default function CustomLoader({ size = 'default', text }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const displayMessage = text || messages[msgIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      {/* Animated Coin & Gift Glow SVG */}
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Pulsing Ambient Halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent-purple/40 to-reward-gold/30 blur-xl"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Orbit Ring */}
        <motion.svg
          className="absolute w-24 h-24 text-accent-purple/40"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
        </motion.svg>

        {/* Counter Orbit Particle */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-reward-gold shadow-[0_0_12px_#F59E0B]"
          animate={{
            rotate: -360,
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            transformOrigin: "48px 48px"
          }}
        />

        {/* Central 3D Gift Box / Vault Coin Icon */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotateY: [0, 180, 360]
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A2234] via-deep-card to-[#0d121c] border border-accent-purple/50 flex items-center justify-center shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
        >
          {/* Custom SVG Gift Box with Ribbon & Star Sparkle */}
          <svg
            className="w-9 h-9 text-reward-gold filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Box Base */}
            <path d="M3 10h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" fill="#1E273A" fillOpacity="0.8" />
            {/* Box Lid */}
            <path d="M2 6a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v4H2V6z" fill="#2A344D" />
            {/* Vertical Ribbon */}
            <path d="M12 5v17" stroke="#F59E0B" strokeWidth="2.2" />
            {/* Horizontal Ribbon on Lid */}
            <path d="M2 10h20" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Ribbon Bow */}
            <path d="M12 5c-1.8-2.2-4.5-2.2-4.5 0s4.5 1 4.5 1" stroke="#F59E0B" strokeWidth="1.8" />
            <path d="M12 5c1.8-2.2 4.5-2.2 4.5 0s-4.5 1-4.5 1" stroke="#F59E0B" strokeWidth="1.8" />
            {/* Sparkle Center */}
            <circle cx="12" cy="14" r="1.5" fill="#F59E0B" />
          </svg>
        </motion.div>
      </div>

      {/* Dynamic Animated Copy with Shimmer */}
      <div className="h-8 mt-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={displayMessage}
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-xs md:text-sm font-medium tracking-wide text-slate-300 flex items-center gap-2"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-reward-gold animate-ping" />
            <span className="bg-gradient-to-r from-slate-100 via-purple-200 to-amber-200 bg-clip-text text-transparent">
              {displayMessage}
            </span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
