import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  color: string;
}

export function ScoreGauge({ score, color }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: 180, height: 180 }}>
      <svg width="180" height="180" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="var(--color-bg-elevated)"
          strokeWidth="8"
        />
        {/* Animated progress arc */}
        <motion.circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          transform="rotate(-90 60 60)"
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      {/* Score number */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {animatedScore}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          out of 100
        </span>
      </motion.div>
    </div>
  );
}
