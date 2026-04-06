import type { UserAnswers, ScoreTier, ScoredAutomation, RoadmapPhase, ReportData } from './types';
import { AUTOMATIONS } from './automations';
import { INDUSTRY_LABELS } from './questions';

// ============================================================
// SCORE TIERS
// ============================================================

const TIERS: ScoreTier[] = [
  {
    id: 'ai_leader',
    label: 'AI Leader',
    color: '#10b981',
    tagline: 'Your business is already ahead of the curve.',
    description: 'You have strong systems, openness to AI, and the infrastructure to implement advanced automation fast. The biggest wins for you are in optimization, agentic frameworks, and scaling what already works.',
  },
  {
    id: 'ai_ready',
    label: 'AI Ready',
    color: '#3b82f6',
    tagline: 'You have the foundation. Now it\'s time to build.',
    description: 'Your business has the tools and mindset to adopt AI effectively. You\'re past the starting line and ready for targeted automations that deliver measurable ROI quickly.',
  },
  {
    id: 'ai_curious',
    label: 'AI Curious',
    color: '#f59e0b',
    tagline: 'You see the potential. The roadmap starts here.',
    description: 'You know AI matters but haven\'t fully committed yet. That\'s actually an advantage: you can skip the mistakes early adopters made and go straight to what\'s proven to work in your industry.',
  },
  {
    id: 'ai_starter',
    label: 'AI Starter',
    color: '#8b5cf6',
    tagline: 'You\'re starting at exactly the right time.',
    description: 'Starting fresh means no bad implementations to undo. The tools available today are better, cheaper, and more proven than even a year ago. A few focused moves will have an outsized impact.',
  },
];

// ============================================================
// CALCULATE SCORE (0-100)
// ============================================================

export function calculateScore(answers: UserAnswers): number {
  let raw = 0;

  // Scored questions contribute directly
  const scoredQuestions = ['booking_method', 'follow_up', 'after_hours', 'ai_experience', 'ai_trust', 'budget', 'timeline', 'hours_wasted', 'lost_customers'];

  for (const qId of scoredQuestions) {
    const val = answers[qId];
    if (val === undefined) continue;

    // Questions with score-per-option are stored via the question data
    // We reconstruct scores here since we need to be self-contained
    const scoreMap: Record<string, Record<string, number>> = {
      booking_method: { phone: 0, website_form: 3, online_booking: 8, mixed: 5, marketplace: 6 },
      follow_up: { nothing: 0, manual: 3, basic_email: 6, crm: 10 },
      after_hours: { voicemail: 0, form: 3, answering_service: 5, chatbot: 9, na: 5 },
      ai_experience: { none: 0, casual: 5, moderate: 15, advanced: 25 },
      ai_trust: { never: 0, simple: 5, routine: 12, fully: 20 },
      budget: { free: 1, low: 4, moderate: 8, serious: 14, whatever: 18 },
      timeline: { research: 1, weeks: 4, fast: 9, yesterday: 14 },
      hours_wasted: { few: 2, moderate: 6, significant: 10, heavy: 15, unknown: 8 },
      lost_customers: { yes_definitely: 10, probably: 7, not_sure: 4, no: 1 },
    };

    const qMap = scoreMap[qId];
    if (qMap && typeof val === 'string' && val in qMap) {
      raw += qMap[val];
    }
  }

  // Tech comfort scale (1-10) contributes up to 10 points
  const techComfort = answers.tech_comfort;
  if (typeof techComfort === 'number') {
    raw += techComfort;
  }

  // Tools count contributes (more tools = more ready)
  const tools = answers.current_tools;
  if (Array.isArray(tools)) {
    const realTools = tools.filter(t => t !== 'none');
    raw += Math.min(realTools.length * 2, 12);
  }

  // Pain points count (more awareness = higher score)
  const pains = answers.biggest_pain;
  if (Array.isArray(pains)) {
    raw += Math.min(pains.length * 2, 6);
  }

  // Max theoretical raw ~ 140. Normalize to 0-100
  const normalized = Math.round(Math.min(100, (raw / 130) * 100));
  return Math.max(5, normalized); // minimum 5 so nobody gets a zero
}

// ============================================================
// GET TIER FROM SCORE
// ============================================================

export function getTier(score: number): ScoreTier {
  if (score >= 75) return TIERS[0]; // AI Leader
  if (score >= 50) return TIERS[1]; // AI Ready
  if (score >= 25) return TIERS[2]; // AI Curious
  return TIERS[3]; // AI Starter
}

// ============================================================
// MATCH & RANK AUTOMATIONS
// ============================================================

export function getRecommendations(answers: UserAnswers): ScoredAutomation[] {
  const industry = answers.industry as string;
  const teamSize = answers.team_size as string;
  const budget = answers.budget as string;
  const painPoints = (answers.biggest_pain as string[]) || [];
  const goal = answers.primary_goal as string;

  return AUTOMATIONS.map(auto => {
    let relevance = 0;

    // Industry match (big boost for industry-specific, baseline for universal)
    if (auto.industries.length === 0) {
      relevance += 10; // universal
    } else if (auto.industries.includes(industry)) {
      relevance += 25; // industry-specific match
    } else {
      relevance -= 20; // not for this industry
    }

    // Pain point match (biggest signal)
    const painOverlap = auto.painPoints.filter(p => painPoints.includes(p));
    relevance += painOverlap.length * 20;

    // Team size filter
    if (auto.minTeamSize) {
      const sizeOrder = ['solo', 'small', 'medium', 'large', 'enterprise'];
      const minIdx = sizeOrder.indexOf(auto.minTeamSize);
      const actualIdx = sizeOrder.indexOf(teamSize);
      if (actualIdx < minIdx) relevance -= 15;
    }

    // Budget fit
    if (auto.minBudget === 'moderate' && ['free', 'low'].includes(budget)) {
      relevance -= 10;
    }

    // Goal alignment bonus
    const goalBoosts: Record<string, string[]> = {
      grow_revenue: ['lead_scoring', 'crm_automation', 'retargeting_automation', 'ai_receptionist'],
      reduce_costs: ['workflow_automation', 'document_ai', 'invoice_automation', 'content_engine'],
      better_cx: ['ai_chat_widget', 'customer_support_ai', 'smart_scheduling', 'sms_automation'],
      scale: ['hiring_automation', 'training_ai', 'workflow_automation', 'ai_receptionist'],
      free_time: ['ai_receptionist', 'smart_scheduling', 'workflow_automation', 'content_engine'],
    };
    if (goalBoosts[goal]?.includes(auto.id)) {
      relevance += 15;
    }

    // Complexity match — lower complexity gets slight boost for less technical users
    const techComfort = typeof answers.tech_comfort === 'number' ? answers.tech_comfort : 5;
    if (auto.complexity === 'easy') relevance += 5;
    if (auto.complexity === 'advanced' && techComfort < 4) relevance -= 10;

    return { ...auto, relevanceScore: relevance, priorityRank: 0 };
  })
    .filter(a => a.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map((a, i) => ({ ...a, priorityRank: i + 1 }));
}

// ============================================================
// BUILD ROADMAP
// ============================================================

export function buildRoadmap(recommendations: ScoredAutomation[]): RoadmapPhase[] {
  const easy = recommendations.filter(r => r.complexity === 'easy').slice(0, 3);
  const medium = recommendations.filter(r => r.complexity === 'medium').slice(0, 3);
  const advanced = recommendations.filter(r => r.complexity === 'advanced').slice(0, 2);

  const phases: RoadmapPhase[] = [];

  if (easy.length > 0) {
    phases.push({
      phase: 1,
      label: 'Quick Wins',
      timeframe: 'Week 1-2',
      items: easy,
    });
  }

  if (medium.length > 0) {
    phases.push({
      phase: 2,
      label: 'Core Systems',
      timeframe: 'Month 1-2',
      items: medium,
    });
  }

  if (advanced.length > 0) {
    phases.push({
      phase: 3,
      label: 'Advanced Optimization',
      timeframe: 'Month 3-6',
      items: advanced,
    });
  }

  return phases;
}

// ============================================================
// GENERATE FULL REPORT
// ============================================================

export function generateReport(answers: UserAnswers): ReportData {
  const score = calculateScore(answers);
  const tier = getTier(score);
  const industry = answers.industry as string;
  const allRecs = getRecommendations(answers);
  const automations = allRecs.filter(r => !r.isAgentic).slice(0, 6);
  const agenticFrameworks = allRecs.filter(r => r.isAgentic).slice(0, 4);
  const roadmap = buildRoadmap(allRecs.slice(0, 8));

  return {
    score,
    tier,
    industry,
    industryLabel: INDUSTRY_LABELS[industry] || industry,
    teamSize: answers.team_size as string,
    automations,
    agenticFrameworks,
    roadmap,
    answers,
  };
}
