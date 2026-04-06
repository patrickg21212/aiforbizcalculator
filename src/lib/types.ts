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
}

export interface UserAnswers {
  [questionId: string]: string | string[] | number;
}

export type Phase = 'landing' | 'quiz' | 'calculating' | 'report';

// ============================================================
// Recommendation Engine Types
// ============================================================

export type ImpactLevel = 'high' | 'medium' | 'low';
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
  industries: string[];       // which industries this applies to (empty = all)
  painPoints: string[];       // which pain points trigger this
  minTeamSize?: string;       // minimum team size tag
  minBudget?: string;         // minimum budget tag
  isAgentic: boolean;         // true = AI agent, false = simple automation
}

export interface ReportData {
  score: number;
  tier: ScoreTier;
  industry: string;
  industryLabel: string;
  teamSize: string;
  automations: ScoredAutomation[];
  agenticFrameworks: ScoredAutomation[];
  roadmap: RoadmapPhase[];
  answers: UserAnswers;
}

export interface ScoredAutomation extends Automation {
  relevanceScore: number;
  priorityRank: number;
}

export interface ScoreTier {
  id: string;
  label: string;
  color: string;
  tagline: string;
  description: string;
}

export interface RoadmapPhase {
  phase: number;
  label: string;
  timeframe: string;
  items: ScoredAutomation[];
}
