import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ReportData } from '../../lib/types';
import { ScoreGauge } from './ScoreGauge';
import { AutomationCard } from './AutomationCard';

interface Props {
  report: ReportData;
  onRestart: () => void;
}

// SVG illustrations for report sections
function HeroIllustration({ color }: { color: string }) {
  return (
    <svg width="280" height="180" viewBox="0 0 280 180" fill="none" style={{ opacity: 0.9 }}>
      {/* Abstract circuit/network pattern representing AI */}
      <circle cx="140" cy="90" r="60" stroke={color} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.3" />
      <circle cx="140" cy="90" r="40" stroke={color} strokeWidth="1" strokeDasharray="3 5" opacity="0.2" />
      <circle cx="140" cy="90" r="80" stroke={color} strokeWidth="1" strokeDasharray="5 8" opacity="0.15" />
      {/* Nodes */}
      <circle cx="140" cy="30" r="4" fill={color} opacity="0.6" />
      <circle cx="200" cy="60" r="3" fill={color} opacity="0.5" />
      <circle cx="210" cy="110" r="4" fill={color} opacity="0.6" />
      <circle cx="170" cy="150" r="3" fill={color} opacity="0.4" />
      <circle cx="100" cy="140" r="4" fill={color} opacity="0.5" />
      <circle cx="80" cy="80" r="3" fill={color} opacity="0.6" />
      <circle cx="90" cy="45" r="3" fill={color} opacity="0.4" />
      {/* Connecting lines */}
      <line x1="140" y1="30" x2="200" y2="60" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="200" y1="60" x2="210" y2="110" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="210" y1="110" x2="170" y2="150" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="170" y1="150" x2="100" y2="140" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="100" y1="140" x2="80" y2="80" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="80" y1="80" x2="90" y2="45" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="90" y1="45" x2="140" y2="30" stroke={color} strokeWidth="1" opacity="0.2" />
      {/* Center pulse */}
      <circle cx="140" cy="90" r="8" fill={color} opacity="0.3" />
      <circle cx="140" cy="90" r="4" fill={color} opacity="0.6" />
    </svg>
  );
}

function RoadmapIllustration() {
  return (
    <svg width="100%" height="8" viewBox="0 0 400 8" fill="none" preserveAspectRatio="none">
      <rect width="400" height="8" rx="4" fill="var(--color-bg-elevated)" />
      <rect width="133" height="8" rx="4" fill="var(--color-brand-primary)" opacity="0.8" />
      <rect x="133" width="133" height="8" fill="var(--color-brand-accent)" opacity="0.5" />
      <rect x="266" width="134" height="8" rx="4" fill="var(--color-brand-warm)" opacity="0.3" />
    </svg>
  );
}

function SectionDivider({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '32px 0 16px',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
      }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
    </div>
  );
}

export function BusinessReport({ report, onRestart }: Props) {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setEmailStatus('sending');
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          score: report.score,
          tier: report.tier.id,
          industry: report.industry,
          industryLabel: report.industryLabel,
          teamSize: report.teamSize,
          topAutomations: report.automations.slice(0, 3).map(a => a.name),
        }),
      });
      if (!res.ok) throw new Error();
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '100dvh', paddingTop: 80 }}
    >
      <div className="container" style={{ maxWidth: 800, padding: '0 20px' }}>

        {/* ── REPORT HEADER ────────────────────────────────── */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(135deg, ${report.tier.color}10, transparent)`,
            border: `1px solid ${report.tier.color}25`,
            borderRadius: 'var(--radius-xl)',
            padding: '40px 32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 40,
          }}
        >
          {/* Background illustration */}
          <div style={{ position: 'absolute', top: 0, right: -20, opacity: 0.5, pointerEvents: 'none' }}>
            <HeroIllustration color={report.tier.color} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: 20,
              }}
            >
              📊 Your AI Business Report
            </motion.div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <ScoreGauge score={report.score} color={report.tier.color} />
            </div>

            <motion.h1
              style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px', color: report.tier.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {report.tier.label}
            </motion.h1>

            <motion.p
              style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 12px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {report.tier.tagline}
            </motion.p>

            <motion.p
              style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {report.tier.description}
            </motion.p>

            {/* Industry badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg-elevated)',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
                marginTop: 16,
              }}
            >
              Industry: <strong style={{ color: 'var(--color-text-primary)' }}>{report.industryLabel}</strong>
            </motion.div>
          </div>
        </motion.div>

        {/* ── QUICK STATS ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
              {report.automations.length + report.agenticFrameworks.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Recommendations
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-accent)' }}>
              {report.automations.filter(a => a.complexity === 'easy').length + report.agenticFrameworks.filter(a => a.complexity === 'easy').length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Quick Wins
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-warm)' }}>
              {report.roadmap.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Phases
            </div>
          </div>
        </motion.div>

        {/* ── AUTOMATION RECOMMENDATIONS ────────────────────── */}
        <SectionDivider icon="⚡" title="Recommended Automations" />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.6 }}>
          These are the specific automations that will have the biggest impact on your {report.industryLabel.toLowerCase()} business, ranked by relevance to your situation.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {report.automations.map((auto, i) => (
            <AutomationCard key={auto.id} automation={auto} index={i} />
          ))}
        </div>

        {/* ── AGENTIC FRAMEWORKS ────────────────────────────── */}
        {report.agenticFrameworks.length > 0 && (
          <>
            <SectionDivider icon="🤖" title="AI Agent Opportunities" />

            {/* Visual banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.04))',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}>
                🧠
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
                  Beyond Automation: AI Agents
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  These aren't just workflows that run on triggers. AI agents make decisions, handle nuance, and work autonomously. They're the next level after basic automation.
                </p>
              </div>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {report.agenticFrameworks.map((auto, i) => (
                <AutomationCard key={auto.id} automation={auto} index={i} />
              ))}
            </div>
          </>
        )}

        {/* ── IMPLEMENTATION ROADMAP ───────────────────────── */}
        <SectionDivider icon="🗺️" title="Your Implementation Roadmap" />

        <div style={{ marginBottom: 24 }}>
          <RoadmapIllustration />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {report.roadmap.map((phase, phaseIdx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + phaseIdx * 0.15 }}
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Phase indicator bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: phaseIdx === 0 ? 'var(--color-brand-primary)' : phaseIdx === 1 ? 'var(--color-brand-accent)' : 'var(--color-brand-warm)',
                borderRadius: '4px 0 0 4px',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: phaseIdx === 0 ? 'rgba(59,130,246,0.15)' : phaseIdx === 1 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: phaseIdx === 0 ? 'var(--color-brand-primary)' : phaseIdx === 1 ? 'var(--color-brand-accent)' : 'var(--color-brand-warm)',
                }}>
                  {phase.phase}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                    {phase.label}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {phase.timeframe}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {phase.items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: 'var(--color-bg-elevated)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {item.name}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                    }}>
                      {item.monthlyCost}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── EMAIL CAPTURE ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.04))',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 28px',
            textAlign: 'center',
            marginTop: 40,
          }}
        >
          {emailStatus === 'sent' ? (
            <>
              <span style={{ fontSize: 40 }}>✅</span>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: 8, color: 'var(--color-text-primary)' }}>
                Check your inbox!
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                We've sent your full report to {email}
              </p>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--color-text-primary)' }}>
                Get This Report Sent to Your Inbox
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '0 0 20px' }}>
                Save your personalized report as a reference. No spam, just your results.
              </p>
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto' }}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={emailStatus === 'sending'}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn-primary" disabled={emailStatus === 'sending'} style={{ whiteSpace: 'nowrap' }}>
                  {emailStatus === 'sending' ? 'Sending...' : 'Send Report'}
                </button>
              </form>
              {emailStatus === 'error' && (
                <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: 8 }}>Something went wrong. Try again.</p>
              )}
            </>
          )}
        </motion.div>

        {/* ── CTA: BOOK AUDIT ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 28px',
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            margin: '0 auto 16px',
          }}>
            🎯
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--color-text-primary)' }}>
            Want Help Implementing This?
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: '0 0 20px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Book a free 30-minute AI Operations Audit with Epiphany Dynamics. We'll review your report together, prioritize the top 3 moves, and map a timeline specific to your business.
          </p>
          <a
            href="https://epiphanydynamics.ai/book"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: '1.05rem', padding: '14px 36px' }}
          >
            Book Your Free AI Audit
          </a>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 10 }}>
            No obligation. No sales pitch. Just an actionable plan.
          </p>
        </motion.div>

        {/* ── RETAKE & FOOTER ──────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '32px 0 48px' }}>
          <button
            onClick={onRestart}
            className="btn-secondary"
          >
            Retake Assessment
          </button>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 16 }}>
            Built by{' '}
            <a
              href="https://epiphanydynamics.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-brand-primary)', textDecoration: 'none' }}
            >
              Epiphany Dynamics
            </a>
            {' '}&middot; AI Automation for Modern Business
          </p>
        </div>
      </div>
    </motion.div>
  );
}
