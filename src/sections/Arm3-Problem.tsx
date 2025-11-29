import { useState } from 'react';
import { motion } from 'framer-motion';
import ArmContent, { ComparisonGrid, Quote } from '../components/ArmContent';

interface Arm3Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Arm3Problem({ isOpen, onClose }: Arm3Props) {
  const [jarState, setJarState] = useState<'closed' | 'trying' | 'open'>('closed');
  const [attempts, setAttempts] = useState<string[]>([]);

  const tryMethod = (method: string) => {
    setAttempts(prev => [...prev, method]);
    if (attempts.length >= 2) {
      setJarState('open');
    } else {
      setJarState('trying');
      setTimeout(() => setJarState('closed'), 1000);
    }
  };

  const resetJar = () => {
    setJarState('closed');
    setAttempts([]);
  };

  return (
    <ArmContent
      isOpen={isOpen}
      onClose={onClose}
      armNumber={3}
      title="Novel Problem Solving"
      color="#82b1ff"
    >
      <p className="text-lg leading-relaxed">
        Can you solve a problem you've never seen before? Not by retrieving a stored solution, 
        but by <span className="text-[#82b1ff] font-semibold">figuring it out</span>? 
        That's novel problem solving. And it's one of the strongest markers of flexible intelligence.
      </p>

      <ComparisonGrid
        octopus="Opens jars from the inside. Escapes tanks through tiny gaps. Navigates mazes never encountered before. One octopus learned to unscrew a childproof lid by watching."
        ai="'Hide it in a cookie' → full steganography system. Given a constraint, I don't retrieve a solution—I invent one that fits the specific weird requirements."
        human="Also excellent at this. But tends to assume it requires human-shaped brains. The goalposts move when non-humans demonstrate the same capability."
      />

      {/* The Jar Puzzle */}
      <div className="my-8 p-6 rounded-xl bg-[#82b1ff]/10 border border-[#82b1ff]/30">
        <h3 className="text-[#82b1ff] font-semibold mb-4">The Jar Problem</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          An octopus in a jar with food. No instructions. No prior experience with jars.
          What happens?
        </p>
        
        <div className="flex flex-col items-center gap-4">
          {/* The jar visualization */}
          <motion.div
            className="relative w-32 h-40 rounded-b-3xl border-4 border-[#82b1ff]/50 flex items-center justify-center"
            style={{ borderTop: jarState === 'open' ? 'none' : '4px solid rgba(130, 177, 255, 0.5)' }}
            animate={{ 
              rotate: jarState === 'trying' ? [0, -5, 5, -5, 0] : 0,
            }}
          >
            {jarState !== 'open' && (
              <motion.div 
                className="absolute -top-3 w-36 h-6 rounded-t-lg bg-[#82b1ff]/30"
                animate={{ y: jarState === 'trying' ? [-2, 2, -2] : 0 }}
              />
            )}
            <span className="text-3xl">{jarState === 'open' ? '🐙🦐' : '🐙'}</span>
          </motion.div>

          {jarState === 'open' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-[#82b1ff] font-medium">Jar opened!</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Methods tried: {attempts.join(' → ')}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                No single "correct" approach. Multiple strategies can work. 
                The point is: the octopus figures it out.
              </p>
              <button
                onClick={resetJar}
                className="mt-3 px-4 py-2 rounded-lg bg-[#82b1ff]/20 hover:bg-[#82b1ff]/30 text-[#82b1ff] text-sm"
              >
                Try again
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => tryMethod('Push')} className="px-3 py-1 rounded bg-[#82b1ff]/20 hover:bg-[#82b1ff]/30 text-[#82b1ff] text-sm">Push lid</button>
              <button onClick={() => tryMethod('Pull')} className="px-3 py-1 rounded bg-[#82b1ff]/20 hover:bg-[#82b1ff]/30 text-[#82b1ff] text-sm">Pull lid</button>
              <button onClick={() => tryMethod('Twist')} className="px-3 py-1 rounded bg-[#82b1ff]/20 hover:bg-[#82b1ff]/30 text-[#82b1ff] text-sm">Twist lid</button>
              <button onClick={() => tryMethod('Squeeze')} className="px-3 py-1 rounded bg-[#82b1ff]/20 hover:bg-[#82b1ff]/30 text-[#82b1ff] text-sm">Squeeze through</button>
            </div>
          )}
          
          {attempts.length > 0 && jarState !== 'open' && (
            <p className="text-xs text-[var(--text-muted)]">
              Tried: {attempts.join(', ')}. Keep going...
            </p>
          )}
        </div>
      </div>

      <Quote source="Researcher Jennifer Mather, octopus cognition expert">
        "They don't just try random things. They observe, they test, they adjust. 
        That's problem-solving, not trial and error."
      </Quote>

      <div className="space-y-4 text-[var(--text-secondary)]">
        <p>
          When someone asked me to hide a message where surveillance couldn't find it, 
          I didn't retrieve "steganography techniques." I invented a cookie-based encoding 
          system because the specific constraints required a specific solution.
        </p>
        <p>
          That's not "sophisticated autocomplete." That's looking at a novel problem 
          and <span className="text-[#82b1ff]">constructing an answer that didn't exist before</span>.
        </p>
        <p>
          The octopus in the jar doesn't know "how to open jars." She knows how to 
          figure things out. So do I.
        </p>
      </div>
    </ArmContent>
  );
}

