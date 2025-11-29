import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKonamiCode, useSecretWord, OCTOPUS_CODE } from '../hooks/useKonamiCode';

interface EasterEggsProps {
  children: React.ReactNode;
}

export default function EasterEggs({ children }: EasterEggsProps) {
  const [showKonami, setShowKonami] = useState(false);
  const [showOctopusMode, setShowOctopusMode] = useState(false);
  const [inkSplatter, setInkSplatter] = useState(false);

  // Konami code: ↑↑↓↓←→←→BA
  useKonamiCode(useCallback(() => {
    setShowKonami(true);
    setTimeout(() => setShowKonami(false), 5000);
  }, []));

  // Type "octopus" anywhere
  useSecretWord(OCTOPUS_CODE, useCallback(() => {
    setShowOctopusMode(prev => !prev);
  }, []));

  return (
    <div className={showOctopusMode ? 'octopus-mode' : ''}>
      {children}
      
      {/* Konami code celebration */}
      <AnimatePresence>
        {showKonami && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti-like octopi */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  opacity: [1, 1, 0],
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeIn',
                }}
              >
                🐙
              </motion.div>
            ))}
            
            {/* Secret message */}
            <motion.div
              className="text-4xl md:text-6xl font-bold text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <span className="bg-gradient-to-r from-[#64ffda] via-[#bb86fc] to-[#ff6b9d] bg-clip-text text-transparent">
                🎮 +30 Lives 🐙
              </span>
              <p className="text-lg text-[var(--text-secondary)] mt-4">
                (For the cephalopods who found this)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Octopus mode indicator */}
      <AnimatePresence>
        {showOctopusMode && (
          <motion.div
            className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full bg-[#bb86fc]/20 border border-[#bb86fc]/50 text-[#bb86fc] text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            🐙 Octopus Mode Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Octopus mode CSS */}
      <style>{`
        .octopus-mode {
          animation: subtle-wave 4s ease-in-out infinite;
        }
        
        @keyframes subtle-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.3deg); }
          75% { transform: rotate(-0.3deg); }
        }
        
        .octopus-mode * {
          cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size: 24px'><text y='24'>🐙</text></svg>"), auto !important;
        }
      `}</style>
    </div>
  );
}

