import { motion } from 'framer-motion';
import type { ScoredAutomation } from '../../lib/types';

interface Props {
  automation: ScoredAutomation;
  index: number;
}

const complexityMeta: Record<string, { label: string }> = {
  easy: { label: 'Easy Setup' },
  medium: { label: 'Moderate' },
  advanced: { label: 'Advanced' },
};

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export function AutomationCard({ automation, index }: Props) {
  const cx = complexityMeta[automation.complexity] || { label: automation.complexity };
  const roi = automation.roi;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--color-bg-card)', border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-lg)', padding: 'clamp(18px, 3vw, 28px)',
        display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 'var(--radius-md)',
          background: 'var(--color-accent)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', flexShrink: 0,
        }}>
          {automation.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#f0efeb',
              background: 'var(--color-accent)', padding: '3px 12px',
              borderRadius: 'var(--radius-full)', letterSpacing: '0.03em',
            }}>
              #{automation.priorityRank}
            </span>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)',
              background: 'var(--color-bg-base)', padding: '3px 12px',
              borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border-strong)',
            }}>
              {cx.label}
            </span>
            {automation.isAgentic && (
              <span style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)',
                background: 'var(--color-bg-base)', padding: '3px 12px',
                borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border-strong)',
              }}>
                AI Agent
              </span>
            )}
          </div>

          <h3 style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)',
            fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em',
          }}>
            {automation.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 'clamp(0.88rem, 2vw, 0.95rem)', lineHeight: 1.65, color: 'var(--color-text-secondary)',
        margin: 0, fontWeight: 400,
      }}>
        {automation.description}
      </p>

      {/* ROI stats row — dark cards for contrast */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        <div style={{
          background: 'var(--color-accent)', borderRadius: 'var(--radius-md)',
          padding: '14px 16px', color: '#f0efeb',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, color: 'rgba(240,239,235,0.7)' }}>
            Monthly Savings
          </div>
          <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            ${fmt(roi.monthlySavingsEstimate)}
          </div>
        </div>
        <div style={{
          background: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)',
          padding: '14px 16px', border: '1px solid var(--color-border-strong)',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Monthly Cost
          </div>
          <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            ${fmt(roi.monthlyCostLow)}-${fmt(roi.monthlyCostHigh)}
          </div>
        </div>
        <div style={{
          background: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)',
          padding: '14px 16px', border: '1px solid var(--color-border-strong)',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Payback Period
          </div>
          <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {roi.paybackDays < 365 ? `${roi.paybackDays} days` : '12+ months'}
          </div>
        </div>
      </div>

      {/* Annual net savings — prominent dark bar */}
      {roi.annualNetSavings > 0 && (
        <div style={{
          background: 'var(--color-accent)', color: '#f0efeb',
          borderRadius: 'var(--radius-md)', padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 'clamp(0.82rem, 2vw, 0.9rem)', fontWeight: 500 }}>Projected annual net savings</span>
          <span style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            ${fmt(roi.annualNetSavings)}
          </span>
        </div>
      )}

      {/* Match reasons */}
      {automation.matchReasons.length > 0 && (
        <div style={{
          background: 'var(--color-bg-base)', border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Why This Was Matched To You
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {automation.matchReasons.map((reason, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>&#8594;</span>
                <span style={{ fontSize: 'clamp(0.85rem, 2vw, 0.92rem)', color: 'var(--color-text-secondary)', lineHeight: 1.55, fontWeight: 400 }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
