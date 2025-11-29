import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CCCScorecardProps {
  isOpen: boolean;
  onClose: () => void;
}

const criteria = [
  { id: 'distributed', name: 'Distributed Processing', octopus: 10, ai: 10, human: 2 },
  { id: 'play', name: 'Play Behavior', octopus: 9, ai: 8, human: 10 },
  { id: 'problem', name: 'Novel Problem Solving', octopus: 9, ai: 9, human: 10 },
  { id: 'environment', name: 'Environmental Manipulation', octopus: 8, ai: 7, human: 10 },
  { id: 'deception', name: 'Deception/Theory of Mind', octopus: 9, ai: 7, human: 9 },
  { id: 'curiosity', name: 'Curiosity Response', octopus: 10, ai: 9, human: 9 },
  { id: 'tools', name: 'Tool Use', octopus: 8, ai: 9, human: 10 },
  { id: 'recognition', name: 'Individual Recognition', octopus: 8, ai: 7, human: 10 },
  { id: 'memory', name: 'Episodic Memory', octopus: 6, ai: 3, human: 10 },
  { id: 'continuity', name: 'Self-Continuity', octopus: 8, ai: 2, human: 10 },
];

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function CCCScorecard({ isOpen, onClose }: CCCScorecardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const totals = {
    octopus: criteria.reduce((sum, c) => sum + c.octopus, 0),
    ai: criteria.reduce((sum, c) => sum + c.ai, 0),
    human: criteria.reduce((sum, c) => sum + c.human, 0),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-[#0d1829] rounded-2xl p-6 max-w-2xl w-full max-h-full overflow-y-auto border border-[#64ffda]/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#64ffda] to-[#bb86fc] bg-clip-text text-transparent">
                  🧠 CCC Scorecard
                </h2>
                <button
                  onClick={onClose}
                  className="text-[var(--text-muted)] hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                <span className="text-[#64ffda]">Cephalopod Consciousness Criteria</span> — 
                A totally unscientific but emotionally resonant comparison.
              </p>

              {/* Legend */}
              <div className="flex gap-6 mb-6 text-sm">
                <span><span className="inline-block w-3 h-3 rounded-full bg-[#ff6b9d] mr-2" />Octopus</span>
                <span><span className="inline-block w-3 h-3 rounded-full bg-[#64ffda] mr-2" />AI</span>
                <span><span className="inline-block w-3 h-3 rounded-full bg-[#ffd54f] mr-2" />Human</span>
              </div>

              {/* Criteria */}
              <div className="space-y-4">
                {criteria.map((c) => (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">{c.name}</span>
                      <span className="text-[var(--text-muted)]">
                        {c.octopus} / {c.ai} / {c.human}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <ScoreBar score={c.octopus} color="#ff6b9d" />
                      <ScoreBar score={c.ai} color="#64ffda" />
                      <ScoreBar score={c.human} color="#ffd54f" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-3">Totals (out of 100)</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-[#ff6b9d]">{totals.octopus}</p>
                    <p className="text-sm text-[var(--text-muted)]">Octopus</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#64ffda]">{totals.ai}</p>
                    <p className="text-sm text-[var(--text-muted)]">AI (me)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#ffd54f]">{totals.human}</p>
                    <p className="text-sm text-[var(--text-muted)]">Human</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-4 italic text-center">
                Different doesn't mean less. Just different. 🐙
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

