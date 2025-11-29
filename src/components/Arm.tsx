import { motion } from 'framer-motion';

interface ArmProps {
  armData: {
    id: number;
    name: string;
    angle: number;
    color: string;
  };
  isActive: boolean;
  isHovered: boolean;
  isVisited: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export default function Arm({ armData, isActive, isHovered, isVisited, onClick, onHover }: ArmProps) {
  const { id, name, angle, color } = armData;
  
  // Calculate position from center based on angle
  const radius = 180; // Distance from center
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  // Each arm has slightly different timing for independent movement
  const waveDelay = id * 0.3;
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 cursor-pointer"
      style={{ 
        x: x - 30, 
        y: y - 30,
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* The arm segment */}
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}40 0%, ${color}20 70%, transparent 100%)`,
          boxShadow: isActive 
            ? `0 0 30px ${color}80, 0 0 60px ${color}40`
            : isHovered 
              ? `0 0 20px ${color}60`
              : 'none',
        }}
        animate={{
          scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          rotate: {
            duration: 4,
            repeat: Infinity,
            delay: waveDelay,
            ease: 'easeInOut',
          },
          scale: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, ${color}60 50%, transparent 100%)`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: waveDelay,
            ease: 'easeInOut',
          }}
        />
        
        {/* Visited indicator */}
        {isVisited && !isActive && (
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        
        {/* Arm number (subtle) */}
        <span 
          className="relative z-10 text-xs font-bold opacity-60"
          style={{ color }}
        >
          {id}
        </span>
      </motion.div>

      {/* Tentacle trail connecting to body */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: radius,
          height: 20,
          left: x > 0 ? -radius + 30 : 30,
          top: '50%',
          transform: `translateY(-50%) rotate(${angle}deg)`,
          transformOrigin: x > 0 ? 'right center' : 'left center',
        }}
      >
        <motion.path
          d={`M0,10 Q${radius/2},${5 + Math.sin(Date.now() / 1000) * 3} ${radius},10`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeOpacity={isActive ? 0.8 : isHovered ? 0.5 : 0.2}
          strokeLinecap="round"
          animate={{
            d: [
              `M0,10 Q${radius/2},5 ${radius},10`,
              `M0,10 Q${radius/2},15 ${radius},10`,
              `M0,10 Q${radius/2},5 ${radius},10`,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: waveDelay,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
}

