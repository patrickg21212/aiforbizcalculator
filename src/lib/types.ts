// ============================================================
// AI FOR BIZ CALCULATOR — Types
// ============================================================

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
  score?: number;
}

export interface Question {
  id: string;
  section: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multi' | 'scale';
  options?: QuestionOption[];
  maxSelections?: number;
  scale?: { min: number; max: number; minLabel: string; maxLabel: string };
  showWhen?: (answers: UserAnswers) => boolean;
}

export interface UserAnswers {
  [questionId: string]: string | string[] | number;
}

export type Phase = 'landing' | 'quiz' | 'calculating' | 'report';

// ============================================================
// Recommendation Engine Types
// ============================================================

export type Complexity = 'easy' | 'medium' | 'advanced';
export type AutomationCategory = 'communication' | 'scheduling' | 'marketing' | 'operations' | 'analytics' | 'sales' | 'support' | 'hr';

export interface Automation {
  id: string;
  name: string;
  category: AutomationCategory;
  description: string;
  impact: string;
  estimatedSavings: string;
  complexity: Complexity;
  monthlyCost: string;
  icon: string;
  industries: string[];
  painPoints: string[];
  minTeamSize?: string;
  minBudget?: string;
  isAgentic: boolean;
}

// ── Calculated outputs ───────────────────────────────────

export interface CalculatedMetrics {
  frontDeskHourlyRate: number;             // basic reception/admin rate
  hourlyLaborCost: number;                 // blended rate across all automatable roles
  weeklyHoursLost: number;
  annualInefficiencyCost: number;
  estimatedLeadsLostPerMonth: number;
  noshowRevenueLostPerYear: number;
  totalRecoverablePerYear: number;
  automationCoveragePercent: number;
}

export interface AutomationROI {
  monthlyCostLow: number;
  monthlyCostHigh: number;
  monthlySavingsEstimate: number;
  paybackDays: number;
  annualNetSavings: number;
}

export interface ScoredAutomation extends Automation {
  relevanceScore: number;
  priorityRank: number;
  matchReasons: string[];
  roi: AutomationROI;
}

export interface RoadmapPhase {
  phase: number;
  label: string;
  timeframe: string;
  items: ScoredAutomation[];
  phaseMonthlyCost: number;
  phaseMonthlySavings: number;
}

export interface ReportData {
  industry: string;
  industryLabel: string;
  teamSize: string;
  metrics: CalculatedMetrics;
  automations: ScoredAutomation[];
  agenticFrameworks: ScoredAutomation[];
  roadmap: RoadmapPhase[];
  answers: UserAnswers;
}
