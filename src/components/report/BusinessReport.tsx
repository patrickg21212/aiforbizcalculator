import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ReportData } from '../../lib/types';
import { AutomationCard } from './AutomationCard';

interface Props {
  report: ReportData;
  onRestart: () => void;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${fmt(n)}`;
}

function MetricCard({ value, label, sublabel, dark }: { value: string; label: string; sublabel?: string; dark?: boolean }) {
  return (
    <div style={{
      background: dark ? 'var(--color-accent)' : 'var(--color-bg-card)',
      color: dark ? '#f0efeb' : 'var(--color-text-primary)',
      border: dark ? 'none' : '1px solid var(--color-border-strong)',
      borderRadius: 'var(--radius-lg)',
      padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 20px)',
      textAlign: 'center',
      boxShadow: dark ? 'var(--shadow-elevated)' : 'var(--shadow-card)',
    }}>
      <div style={{
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        fontWeight: 700,
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 'clamp(0.82rem, 2vw, 0.9rem)',
        fontWeight: 600,
        marginTop: 8,
        color: dark ? 'rgba(240,239,235,0.9)' : 'var(--color-text-primary)',
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{
          fontSize: 'clamp(0.75rem, 1.8vw, 0.82rem)',
          marginTop: 4,
          fontWeight: 400,
          color: dark ? 'rgba(240,239,235,0.65)' : 'var(--color-text-secondary)',
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

function SectionDivider({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '48px 0 20px' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-md)',
        background: 'var(--color-accent)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
      }}>
        {icon}
      </div>
      <h2 style={{
        fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 700, margin: 0,
        fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em',
      }}>
        {title}
      </h2>
    </div>
  );
}

export function BusinessReport({ report, onRestart }: Props) {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const m = report.metrics;

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
          industry: report.industry,
          industryLabel: report.industryLabel,
          teamSize: report.teamSize,
          annualInefficiencyCost: m.annualInefficiencyCost,
          totalRecoverable: m.totalRecoverablePerYear,
          topAutomations: report.automations.slice(0, 3).map(a => a.name),
        }),
      });
      if (!res.ok) throw new Error();
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  const goalLabels: Record<string, string> = {
    grow_revenue: 'Grow revenue', reduce_costs: 'Reduce costs',
    better_cx: 'Improve CX', scale: 'Scale without hiring', free_time: 'Free up time',
  };
  const teamLabels: Record<string, string> = {
    solo: '1 person', small: '2-5 people', medium: '6-20 people', large: '21-50 people', enterprise: '50+ people',
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
            background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-xl)', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)',
            marginBottom: 24, boxShadow: 'var(--shadow-elevated)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg-base)', border: '1px solid var(--color-border-strong)',
              fontSize: 'clamp(0.78rem, 2vw, 0.85rem)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 20,
            }}
          >
            {report.industryLabel} &middot; {teamLabels[report.teamSize]} &middot; {goalLabels[report.answers.primary_goal as string] || ''}
          </motion.div>

          <motion.h1
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 700, margin: '0 0 14px',
              fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your AI Automation Report
          </motion.h1>

          <motion.p
            style={{
              fontSize: 'clamp(0.9rem, 2.2vw, 1rem)', color: 'var(--color-text-secondary)',
              margin: '0 0 24px', lineHeight: 1.65, fontWeight: 400, maxWidth: 600,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Every number below was calculated from the {Object.keys(report.answers).length} data points you provided.
            These are estimates based on industry benchmarks for {report.industryLabel.toLowerCase()} businesses your size.
          </motion.p>
        </motion.div>

        {/* ── THE BIG NUMBERS ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}
        >
          <MetricCard
            value={fmtDollar(m.totalRecoverablePerYear)}
            label="Estimated Recoverable Value"
            sublabel="per year with automation"
            dark
          />
          <MetricCard
            value={fmtDollar(m.annualInefficiencyCost)}
            label="Annual Inefficiency Cost"
            sublabel={`${m.weeklyHoursLost} hrs/week at $${m.hourlyLaborCost}/hr blended staff cost`}
            dark
          />
        </motion.div>

        {/* Labor cost context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>How we calculated staff cost:</strong>{' '}
            Front desk at ${m.frontDeskHourlyRate}/hr, blended with billing, coordination, and management roles
            your team handles at ${m.hourlyLaborCost}/hr weighted average. AI automates tasks across all these roles, not just reception.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}
        >
          <MetricCard
            value={`~${m.estimatedLeadsLostPerMonth}`}
            label="Leads Lost / Month"
            sublabel="slow response + no follow-up"
          />
          {m.noshowRevenueLostPerYear > 0 && (
            <MetricCard
              value={fmtDollar(m.noshowRevenueLostPerYear)}
              label="No-Show Revenue Loss"
              sublabel="per year"
            />
          )}
          <MetricCard
            value={`${m.automationCoveragePercent}%`}
            label="Automation Coverage"
            sublabel="of issues addressable"
          />
        </motion.div>

        {/* ── AUTOMATION RECOMMENDATIONS ────────────────────── */}
        <SectionDivider icon="⚡" title="Recommended Automations" />
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: 'clamp(0.88rem, 2vw, 0.95rem)',
          marginBottom: 20, lineHeight: 1.65, fontWeight: 400,
        }}>
          Ranked by relevance to your {report.industryLabel.toLowerCase()} business. Each card shows estimated ROI
          calculated from your industry's economics and your specific answers.
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="section-dark"
              style={{
                borderRadius: 'var(--radius-lg)', padding: 'clamp(16px, 3vw, 24px)', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(240, 239, 235, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0,
              }}>
                🧠
              </div>
              <div>
                <p style={{ fontSize: 'clamp(0.88rem, 2vw, 0.95rem)', fontWeight: 600, color: '#f0efeb', margin: '0 0 4px' }}>
                  Beyond Automation: AI Agents
                </p>
                <p style={{ fontSize: 'clamp(0.82rem, 1.8vw, 0.88rem)', color: '#c8c8c8', margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
                  These are not simple workflows. AI agents make decisions, handle nuance, and work autonomously on your behalf.
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {report.roadmap.map((phase, phaseIdx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + phaseIdx * 0.12 }}
              style={{
                background: 'var(--color-bg-card)', border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-lg)', padding: 'clamp(16px, 3vw, 24px)', position: 'relative',
                overflow: 'hidden', boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                background: 'var(--color-accent)', opacity: 1 - phaseIdx * 0.25,
                borderRadius: '4px 0 0 4px',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--color-accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-inverse)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  {phase.phase}
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 700, margin: 0, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
                    {phase.label}
                  </h3>
                  <span style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.88rem)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {phase.timeframe}
                  </span>
                </div>
                <div style={{
                  textAlign: 'center', flexShrink: 0,
                  background: 'var(--color-accent)', color: '#f0efeb',
                  borderRadius: 'var(--radius-md)', padding: '8px 14px',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Monthly ROI</div>
                  <div style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                    +${fmt(phase.phaseMonthlySavings - phase.phaseMonthlyCost)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {phase.items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                    background: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-default)', flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
                    <span style={{ fontSize: 'clamp(0.88rem, 2vw, 0.95rem)', fontWeight: 600, flex: 1, minWidth: 120, color: 'var(--color-text-primary)' }}>{item.name}</span>
                    <span style={{ fontSize: 'clamp(0.78rem, 1.8vw, 0.85rem)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      {item.roi.paybackDays < 60 ? `${item.roi.paybackDays}d payback` : item.monthlyCost}
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
            background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-xl)', padding: 'clamp(24px, 4vw, 36px) clamp(16px, 3vw, 28px)', textAlign: 'center',
            marginTop: 48, boxShadow: 'var(--shadow-elevated)',
          }}
        >
          {emailStatus === 'sent' ? (
            <>
              <p style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 0, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text-primary)' }}>
                Check your inbox.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Sent to {email}</p>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 700, margin: '0 0 8px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                Get This Report in Your Inbox
              </h3>
              <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: 'var(--color-text-secondary)', margin: '0 0 20px', fontWeight: 400 }}>
                Save your personalized report with all calculations. No spam.
              </p>
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap' }}>
                <input
                  type="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)} required disabled={emailStatus === 'sending'}
                  style={{
                    flex: 1, minWidth: 200, padding: '14px 18px', borderRadius: 'var(--radius-full)',
                    background: 'var(--color-bg-base)', border: '1px solid var(--color-border-strong)',
                    color: 'var(--color-text-primary)', fontSize: '0.95rem', outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <button type="submit" className="btn-primary" disabled={emailStatus === 'sending'} style={{ whiteSpace: 'nowrap', padding: '14px 28px' }}>
                  {emailStatus === 'sending' ? 'Sending...' : 'Send Report'}
                </button>
              </form>
              {emailStatus === 'error' && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-red)', marginTop: 8 }}>Something went wrong. Try again.</p>
              )}
            </>
          )}
        </motion.div>

        {/* ── CTA: BOOK AUDIT ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="section-dark"
          style={{
            borderRadius: 'var(--radius-xl)', padding: 'clamp(28px, 5vw, 48px) clamp(16px, 4vw, 32px)',
            textAlign: 'center', marginTop: 24,
          }}
        >
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 700, margin: '0 0 12px', color: '#f0efeb',
            fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em',
          }}>
            Want Help Implementing This?
          </h3>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#c8c8c8', margin: '0 0 28px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65, fontWeight: 400 }}>
            Book a free 30-minute AI Operations Audit with Epiphany Dynamics. We will review your report together and map the fastest path forward.
          </p>
          <a
            href="https://epiphanydynamics.ai/book"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '16px 40px', background: '#f0efeb', color: '#050505',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '1.05rem',
              border: 'none', borderRadius: 'var(--radius-full)', textDecoration: 'none', cursor: 'pointer',
            }}
          >
            Book Your Free AI Audit
          </a>
          <p style={{ fontSize: '0.85rem', color: '#a0a0a0', marginTop: 14 }}>No obligation. No sales pitch.</p>
        </motion.div>

        {/* ── RETAKE & FOOTER ──────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '36px 0 48px' }}>
          <button onClick={onRestart} className="btn-secondary" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>Recalculate</button>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 16 }}>
            Built by{' '}
            <a href="https://epiphanydynamics.ai" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Epiphany Dynamics
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
