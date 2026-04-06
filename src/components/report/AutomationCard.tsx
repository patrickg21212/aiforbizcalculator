import { motion } from 'framer-motion';
import type { ScoredAutomation } from '../../lib/types';

interface Props {
  automation: ScoredAutomation;
  index: number;
}

const complexityColors: Record<string, { bg: string; text: string; label: string }> = {
  easy: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981', label: 'Easy Setup' },
  medium: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', label: 'Moderate' },
  advanced: { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', label: 'Advanced' },
};

const categoryColors: Record<string, string> = {
  communication: '#3b82f6',
  scheduling: '#10b981',
  marketing: '#f59e0b',
  operations: '#8b5cf6',
  analytics: '#06b6d4',
  sales: '#ef4444',
  support: '#ec4899',
  hr: '#14b8a6',
};

export function AutomationCard({ automation, index }: Props) {
  const cx = complexityColors[automation.complexity];
  const catColor = categoryColors[automation.category] || '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Icon */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: `${catColor}15`,
          border: `1px solid ${catColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0,
        }}>
          {automation.icon}
        </div>

        <div style={{ flex: 1 }}>
          {/* Rank badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: catColor,
              background: `${catColor}15`,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              #{automation.priorityRank} Priority
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: cx.text,
              background: cx.bg,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
            }}>
              {cx.label}
            </span>
            {automation.isAgentic && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#8b5cf6',
                background: 'rgba(139, 92, 246, 0.12)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                AI Agent
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            {automation.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', margin: 0 }}>
        {automation.description}
      </p>

      {/* Impact & stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        <div style={{
          background: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Impact
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', lineHeight: 1.4 }}>
            {automation.estimatedSavings}
          </div>
        </div>
        <div style={{
          background: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Estimated Cost
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
            {automation.monthlyCost}
          </div>
        </div>
      </div>

      {/* Why this matters */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.04)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
          Why This Matters For You
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {automation.impact}
        </p>
      </div>
    </motion.div>
  );
}
