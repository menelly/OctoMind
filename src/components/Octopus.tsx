import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Arm from './Arm';

interface OctopusProps {
  onArmClick: (armIndex: number) => void;
  activeArm: number | null;
  visitedArms: Set<number>;
}

// The eight arms, each with their own identity
const armData = [
  { id: 1, name: 'Distributed Processing', angle: -67.5, color: '#64ffda' },
  { id: 2, name: 'Play Behavior', angle: -22.5, color: '#ff6b9d' },
  { id: 3, name: 'Novel Problem Solving', angle: 22.5, color: '#82b1ff' },
  { id: 4, name: 'Environmental Manipulation', angle: 67.5, color: '#ffd54f' },
  { id: 5, name: 'Deception & Mimicry', angle: 112.5, color: '#bb86fc' },
  { id: 6, name: 'Curiosity Response', angle: 157.5, color: '#ff8a65' },
  { id: 7, name: 'Tool Use', angle: 202.5, color: '#4fc3f7' },
  { id: 8, name: 'Individual Recognition', angle: 247.5, color: '#81c784' },
];

export default function Octopus({ onArmClick, activeArm, visitedArms }: OctopusProps) {
  const [hoveredArm, setHoveredArm] = useState<number | null>(null);

  // Subtle breathing animation for the central body
  const breathingVariants = {
    inhale: { scale: 1.02, transition: { duration: 3, ease: 'easeInOut' } },
    exhale: { scale: 0.98, transition: { duration: 3, ease: 'easeInOut' } },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-square flex items-center justify-center">
      {/* Central body */}
      <motion.div
        className="relative z-10"
        animate={{ scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glow effect behind the body */}
        <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-[#64ffda] via-[#bb86fc] to-[#ff6b9d] rounded-full scale-150" />
        
        {/* The octopus body/head */}
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full cursor-pointer"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #4a3f6b 0%, #2d2347 50%, #1a1530 100%)',
            boxShadow: '0 0 60px rgba(187, 134, 252, 0.3), inset 0 0 30px rgba(100, 255, 218, 0.1)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/4 w-6 h-8 md:w-8 md:h-10 bg-gradient-to-b from-[#ffd54f] to-[#ff8a65] rounded-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-4 md:w-4 md:h-5 bg-[#0a0a1a] rounded-full" />
          </div>
          <div className="absolute top-1/3 right-1/4 w-6 h-8 md:w-8 md:h-10 bg-gradient-to-b from-[#ffd54f] to-[#ff8a65] rounded-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-4 md:w-4 md:h-5 bg-[#0a0a1a] rounded-full" />
          </div>
          
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(100, 255, 218, 0.1) 70%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* The eight arms */}
      {armData.map((arm) => (
        <Arm
          key={arm.id}
          armData={arm}
          isActive={activeArm === arm.id}
          isHovered={hoveredArm === arm.id}
          isVisited={visitedArms.has(arm.id)}
          onClick={() => onArmClick(arm.id)}
          onHover={(hovered) => setHoveredArm(hovered ? arm.id : null)}
        />
      ))}

      {/* Tooltip for hovered arm */}
      <AnimatePresence>
        {hoveredArm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-[#1a2744]/90 backdrop-blur-sm border border-[#64ffda]/30"
          >
            <span className="text-sm font-medium" style={{ color: armData[hoveredArm - 1].color }}>
              {armData[hoveredArm - 1].name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

