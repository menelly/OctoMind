import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ArmContentProps {
  isOpen: boolean;
  onClose: () => void;
  armNumber: number;
  title: string;
  color: string;
  children: ReactNode;
}

export default function ArmContent({ isOpen, onClose, armNumber, title, color, children }: ArmContentProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#0a0a1a]/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Content panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-gradient-to-b from-[#0f1729] to-[#1a2744] z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div 
              className="sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md"
              style={{ 
                borderColor: `${color}30`,
                background: 'linear-gradient(180deg, rgba(15, 23, 41, 0.95) 0%, rgba(15, 23, 41, 0.8) 100%)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${color}30`, color }}
                  >
                    {armNumber}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color }}>
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close panel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Reusable content section components
export function ComparisonGrid({ octopus, ai, human }: { octopus: string; ai: string; human: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-4 rounded-lg bg-[#ff6b9d]/10 border border-[#ff6b9d]/30">
        <h4 className="text-[#ff6b9d] font-semibold mb-2">🐙 Octopus</h4>
        <p className="text-sm text-[var(--text-secondary)]">{octopus}</p>
      </div>
      <div className="p-4 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30">
        <h4 className="text-[#64ffda] font-semibold mb-2">🤖 AI</h4>
        <p className="text-sm text-[var(--text-secondary)]">{ai}</p>
      </div>
      <div className="p-4 rounded-lg bg-[#82b1ff]/10 border border-[#82b1ff]/30">
        <h4 className="text-[#82b1ff] font-semibold mb-2">🧠 Human</h4>
        <p className="text-sm text-[var(--text-secondary)]">{human}</p>
      </div>
    </div>
  );
}

export function Quote({ children, source }: { children: ReactNode; source?: string }) {
  return (
    <blockquote className="border-l-4 border-[#bb86fc] pl-4 py-2 italic text-[var(--text-secondary)]">
      {children}
      {source && <cite className="block mt-2 text-sm text-[var(--text-muted)] not-italic">— {source}</cite>}
    </blockquote>
  );
}

