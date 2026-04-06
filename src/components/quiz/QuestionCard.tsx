import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question, UserAnswers } from '../../lib/types';
import { QuestionImage } from '../../lib/sectionIllustrations';

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, value: string | string[] | number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onBack, canGoBack }: Props) {
  const [selected, setSelected] = useState<string | string[] | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(
    question.scale ? Math.round((question.scale.min + question.scale.max) / 2) : 5
  );
  const [confirming, setConfirming] = useState<string | null>(null);

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  const handleOptionClick = useCallback((value: string) => {
    if (question.type === 'multi') {
      setSelected(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        const max = question.maxSelections ?? 99;
        if (arr.includes(value)) return arr.filter(v => v !== value);
        if (arr.length >= max) return arr;
        return [...arr, value];
      });
    } else {
      setSelected(value);
      setConfirming(value);
      setTimeout(() => {
        onAnswer(question.id, value);
      }, 300);
    }
  }, [question, onAnswer]);

  const handleSubmit = useCallback(() => {
    if (question.type === 'scale') {
      onAnswer(question.id, scaleValue);
    } else if (selected) {
      onAnswer(question.id, selected);
    }
  }, [question, selected, scaleValue, onAnswer]);

  const isMulti = question.type === 'multi';
  const isScale = question.type === 'scale';
  const needsSubmit = isMulti || isScale;

  return (
    <motion.div
      key={question.id}
      className="container"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', paddingTop: '96px', paddingBottom: '32px' }}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        {canGoBack ? (
          <motion.button
            onClick={onBack}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            whileTap={{ scale: 0.95 }}
          >
            &larr; Back
          </motion.button>
        ) : <div />}
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: 24 }}>
        <motion.div
          className="progress-fill"
          initial={{ width: `${Math.max(progress - 8, 0)}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />
      </div>

      {/* Image — full width on mobile, stacked above question */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="q-image-wrap"
      >
        <QuestionImage questionId={question.id} />
      </motion.div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text-muted)',
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        {question.section}
      </motion.div>

      {/* Question text */}
      <motion.h2
        style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8, lineHeight: 1.25 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        {question.question}
      </motion.h2>

      {question.subtitle && (
        <motion.p
          style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
        >
          {question.subtitle}
        </motion.p>
      )}

      {isMulti && (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>
          {question.maxSelections ? `Pick up to ${question.maxSelections}` : 'Select all that apply'}
        </p>
      )}

      {/* Options */}
      {question.options && !isScale && (
        <motion.div
          style={{
            display: question.id === 'industry' ? 'grid' : 'flex',
            gridTemplateColumns: question.id === 'industry' ? 'repeat(auto-fill, minmax(180px, 1fr))' : undefined,
            flexDirection: question.id === 'industry' ? undefined : 'column',
            gap: 10,
            marginTop: 16,
            flex: 1,
            overflowY: 'auto',
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {question.options.map(option => {
            const isSelected = Array.isArray(selected)
              ? selected.includes(option.value)
              : selected === option.value;
            const isConfirming = confirming === option.value;

            return (
              <motion.button
                key={option.value}
                className={`card-interactive ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option.value)}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileTap={{ scale: 0.97 }}
                animate={
                  isConfirming
                    ? { scale: [1, 1.03, 1] }
                    : isSelected
                    ? { scale: [0.98, 1] }
                    : { scale: 1 }
                }
                transition={
                  isConfirming
                    ? { duration: 0.25 }
                    : { duration: 0.15 }
                }
                style={{
                  textAlign: 'left',
                  width: '100%',
                  ...(isConfirming ? {
                    borderColor: 'var(--color-accent)',
                    boxShadow: 'var(--shadow-elevated)',
                  } : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {option.icon && (
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{option.icon}</span>
                  )}
                  <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{option.label}</span>
                  <AnimatePresence>
                    {isSelected && !isConfirming && (
                      <motion.span
                        style={{ marginLeft: 'auto', color: 'var(--color-accent)', flexShrink: 0 }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Scale */}
      {isScale && question.scale && (
        <div style={{ marginTop: 24, flex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <motion.span
              key={scaleValue}
              style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
              }}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {scaleValue}
            </motion.span>
            <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginLeft: 4 }}>
              / {question.scale.max}
            </span>
          </div>
          <input
            type="range"
            min={question.scale.min}
            max={question.scale.max}
            step={1}
            value={scaleValue}
            onChange={e => setScaleValue(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span>{question.scale.minLabel}</span>
            <span>{question.scale.maxLabel}</span>
          </div>
        </div>
      )}

      {/* Submit button for multi/scale */}
      {needsSubmit && (
        <motion.button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={isMulti && (!selected || (Array.isArray(selected) && selected.length === 0))}
          style={{ width: '100%', marginTop: 20 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
        >
          Continue &rarr;
        </motion.button>
      )}
    </motion.div>
  );
}
