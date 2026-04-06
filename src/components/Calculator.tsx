import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Phase, UserAnswers, ReportData } from '../lib/types';
import { QUESTIONS } from '../lib/questions';
import { generateReport } from '../lib/scoring';
import { QuestionCard } from './quiz/QuestionCard';
import { BusinessReport } from './report/BusinessReport';

export default function Calculator() {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [history, setHistory] = useState<number[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[currentIndex];

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnswer = useCallback((questionId: string, value: string | string[] | number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= QUESTIONS.length) {
      // All questions answered, generate report
      setPhase('calculating');
      scrollToTop();

      // Simulate brief analysis time for UX feel
      setTimeout(() => {
        const reportData = generateReport(newAnswers);
        setReport(reportData);
        setPhase('report');
        scrollToTop();
      }, 2500);
    } else {
      setHistory(prev => [...prev, currentIndex]);
      setCurrentIndex(nextIndex);
    }
  }, [answers, currentIndex]);

  const handleBack = useCallback(() => {
    if (history.length === 0) return;
    const prevIndex = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prevIndex);
  }, [history]);

  const handleRestart = useCallback(() => {
    setPhase('quiz');
    setCurrentIndex(0);
    setAnswers({});
    setHistory([]);
    setReport(null);
    scrollToTop();
  }, []);

  return (
    <div ref={topRef}>
      <AnimatePresence mode="wait">
        {phase === 'quiz' && currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={QUESTIONS.length}
            onAnswer={handleAnswer}
            onBack={handleBack}
            canGoBack={history.length > 0}
          />
        )}

        {phase === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              minHeight: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              paddingTop: 80,
            }}
          >
            {/* Animated loader */}
            <motion.div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid var(--color-bg-elevated)',
                borderTopColor: 'var(--color-brand-primary)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: 'center' }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                Analyzing your business...
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Cross-referencing your answers against 35+ proven automations
              </p>
            </motion.div>

            {/* Fake progress steps */}
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, minWidth: 260 }}
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.6 } } }}
            >
              {[
                'Mapping industry patterns',
                'Scoring AI readiness',
                'Matching automations',
                'Building your roadmap',
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.6, type: 'spring' }}
                    style={{ color: 'var(--color-brand-accent)' }}
                  >
                    ✓
                  </motion.span>
                  {step}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {phase === 'report' && report && (
          <BusinessReport
            key="report"
            report={report}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
