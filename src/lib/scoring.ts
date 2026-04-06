import type { UserAnswers, ScoredAutomation, RoadmapPhase, ReportData } from './types';
import { AUTOMATIONS } from './automations';
import { INDUSTRY_LABELS } from './questions';
import { calculateMetrics, calculateAutomationROI } from './calculator';

// ============================================================
// Resolve match reasons — tell the user WHY this was recommended
// ============================================================

function getMatchReasons(auto: typeof AUTOMATIONS[0], answers: UserAnswers): string[] {
  const reasons: string[] = [];
  const industry = answers.industry as string;
  const painPoints = (answers.biggest_pain as string[]) || [];
  const goal = answers.primary_goal as string;

  if (auto.industries.length > 0 && auto.industries.includes(industry)) {
    reasons.push(`Matched to ${INDUSTRY_LABELS[industry] || industry} businesses`);
  }

  const painLabels: Record<string, string> = {
    answering_questions: 'repetitive customer questions',
    scheduling: 'scheduling and no-shows',
    lead_followup: 'cold lead follow-up',
    data_entry: 'manual data entry',
    content_creation: 'content creation',
    onboarding: 'onboarding',
    reviews: 'review management',
    invoicing: 'invoicing and collections',
    reporting: 'reporting',
    hiring: 'hiring and staffing',
  };
  for (const p of auto.painPoints.filter(p => painPoints.includes(p))) {
    reasons.push(`You flagged ${painLabels[p] || p} as a pain point`);
  }

  const goalLabels: Record<string, string> = {
    grow_revenue: 'growing revenue', reduce_costs: 'reducing costs',
    better_cx: 'improving customer experience', scale: 'scaling without hiring',
    free_time: 'freeing up your time',
  };
  const goalBoosts: Record<string, string[]> = {
    grow_revenue: ['lead_scoring', 'crm_automation', 'retargeting_automation', 'ai_receptionist'],
    reduce_costs: ['workflow_automation', 'document_ai', 'invoice_automation', 'content_engine'],
    better_cx: ['ai_chat_widget', 'customer_support_ai', 'smart_scheduling', 'sms_automation'],
    scale: ['hiring_automation', 'training_ai', 'workflow_automation', 'ai_receptionist'],
    free_time: ['ai_receptionist', 'smart_scheduling', 'workflow_automation', 'content_engine'],
  };
  if (goalBoosts[goal]?.includes(auto.id)) {
    reasons.push(`Aligns with your goal of ${goalLabels[goal] || goal}`);
  }

  // Conditional-answer reasons
  const noshowRate = answers.noshow_rate as string;
  if ((noshowRate === 'over_20' || noshowRate === '10_20') && ['waitlist_ai', 'sms_automation', 'smart_scheduling'].includes(auto.id)) {
    reasons.push('Your no-show rate indicates significant recoverable revenue');
  }
  if ((['none', 'manual'].includes(answers.appointment_reminders as string)) && ['sms_automation', 'smart_scheduling'].includes(auto.id)) {
    reasons.push('You have no automated appointment reminders');
  }
  if ((['verbal', 'spreadsheet'].includes(answers.estimate_method as string)) && auto.id === 'proposal_generator') {
    reasons.push('Your current estimating process is manual');
  }
  if ((['myself', 'phone'].includes(answers.job_dispatch as string)) && auto.id === 'dispatch_optimization') {
    reasons.push('Your job dispatch is manual, limiting capacity');
  }
  if ((['over_15h', '5_15h'].includes(answers.doc_time as string)) && ['document_ai', 'legal_doc_automation'].includes(auto.id)) {
    reasons.push('Your team spends significant time on document processing');
  }
  if ((['voicemail', 'form'].includes(answers.after_hours as string)) && ['ai_receptionist', 'ai_chat_widget'].includes(auto.id)) {
    reasons.push('You have no after-hours engagement system');
  }
  if ((['nothing', 'manual'].includes(answers.follow_up as string)) && ['email_nurture', 'crm_automation', 'lead_scoring'].includes(auto.id)) {
    reasons.push('You have no automated follow-up system');
  }

  return reasons;
}

// ============================================================
// MATCH & RANK AUTOMATIONS
// ============================================================

export function getRecommendations(answers: UserAnswers): ScoredAutomation[] {
  const industry = answers.industry as string;
  const teamSize = answers.team_size as string;
  const painPoints = (answers.biggest_pain as string[]) || [];
  const goal = answers.primary_goal as string;

  return AUTOMATIONS.map(auto => {
    let relevance = 0;

    if (auto.industries.length === 0) relevance += 10;
    else if (auto.industries.includes(industry)) relevance += 25;
    else relevance -= 20;

    relevance += auto.painPoints.filter(p => painPoints.includes(p)).length * 20;

    if (auto.minTeamSize) {
      const sizeOrder = ['solo', 'small', 'medium', 'large', 'enterprise'];
      if (sizeOrder.indexOf(teamSize) < sizeOrder.indexOf(auto.minTeamSize)) relevance -= 15;
    }

    const goalBoosts: Record<string, string[]> = {
      grow_revenue: ['lead_scoring', 'crm_automation', 'retargeting_automation', 'ai_receptionist'],
      reduce_costs: ['workflow_automation', 'document_ai', 'invoice_automation', 'content_engine'],
      better_cx: ['ai_chat_widget', 'customer_support_ai', 'smart_scheduling', 'sms_automation'],
      scale: ['hiring_automation', 'training_ai', 'workflow_automation', 'ai_receptionist'],
      free_time: ['ai_receptionist', 'smart_scheduling', 'workflow_automation', 'content_engine'],
    };
    if (goalBoosts[goal]?.includes(auto.id)) relevance += 15;

    const techComfort = typeof answers.tech_comfort === 'number' ? answers.tech_comfort : 5;
    if (auto.complexity === 'easy') relevance += 5;
    if (auto.complexity === 'advanced' && techComfort < 4) relevance -= 10;

    // All conditional answer boosts
    const noshowRate = answers.noshow_rate as string;
    if (['over_20', '10_20'].includes(noshowRate) && ['waitlist_ai', 'sms_automation', 'smart_scheduling'].includes(auto.id))
      relevance += noshowRate === 'over_20' ? 25 : 15;

    if (['none', 'manual'].includes(answers.appointment_reminders as string) && ['sms_automation', 'smart_scheduling'].includes(auto.id))
      relevance += 15;

    if (['verbal', 'spreadsheet'].includes(answers.estimate_method as string) && auto.id === 'proposal_generator')
      relevance += 25;

    if (['myself', 'phone'].includes(answers.job_dispatch as string) && auto.id === 'dispatch_optimization')
      relevance += 25;

    const docTime = answers.doc_time as string;
    if (['over_15h', '5_15h'].includes(docTime) && ['document_ai', 'legal_doc_automation'].includes(auto.id))
      relevance += docTime === 'over_15h' ? 25 : 15;

    if (['manual', 'spreadsheet'].includes(answers.catalog_management as string) && ['ecommerce_product_ai', 'menu_optimization', 'inventory_ai'].includes(auto.id))
      relevance += 20;

    if (['phone_only', 'email_forms'].includes(answers.tenant_handling as string) && ['property_maintenance', 'ai_receptionist'].includes(auto.id))
      relevance += 20;

    const leadVol = answers.lead_volume as string;
    if (['high', 'very_high'].includes(leadVol) && ['lead_scoring', 'crm_automation', 'email_nurture', 'ai_chat_widget'].includes(auto.id))
      relevance += leadVol === 'very_high' ? 20 : 12;

    const apptVol = answers.appointment_volume as string;
    if (['high', 'very_high'].includes(apptVol) && ['smart_scheduling', 'waitlist_ai', 'sms_automation'].includes(auto.id))
      relevance += apptVol === 'very_high' ? 20 : 12;

    if (['voicemail', 'form'].includes(answers.after_hours as string) && ['ai_receptionist', 'ai_chat_widget'].includes(auto.id))
      relevance += 15;

    if (['nothing', 'manual'].includes(answers.follow_up as string) && ['email_nurture', 'crm_automation', 'lead_scoring'].includes(auto.id))
      relevance += 15;

    const matchReasons = getMatchReasons(auto, answers);
    const roi = calculateAutomationROI(auto.monthlyCost, auto.estimatedSavings, answers);

    return { ...auto, relevanceScore: relevance, priorityRank: 0, matchReasons, roi };
  })
    .filter(a => a.relevanceScore > 0 && a.matchReasons.length > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map((a, i) => ({ ...a, priorityRank: i + 1 }));
}

// ============================================================
// BUILD ROADMAP — with cost/savings per phase
// ============================================================

export function buildRoadmap(recommendations: ScoredAutomation[]): RoadmapPhase[] {
  const easy = recommendations.filter(r => r.complexity === 'easy').slice(0, 3);
  const medium = recommendations.filter(r => r.complexity === 'medium').slice(0, 3);
  const advanced = recommendations.filter(r => r.complexity === 'advanced').slice(0, 2);

  const phases: RoadmapPhase[] = [];

  const sumCost = (items: ScoredAutomation[]) => items.reduce((s, i) => s + Math.round((i.roi.monthlyCostLow + i.roi.monthlyCostHigh) / 2), 0);
  const sumSavings = (items: ScoredAutomation[]) => items.reduce((s, i) => s + i.roi.monthlySavingsEstimate, 0);

  if (easy.length > 0) {
    phases.push({ phase: 1, label: 'Quick Wins', timeframe: 'Week 1-2', items: easy, phaseMonthlyCost: sumCost(easy), phaseMonthlySavings: sumSavings(easy) });
  }
  if (medium.length > 0) {
    phases.push({ phase: 2, label: 'Core Systems', timeframe: 'Month 1-2', items: medium, phaseMonthlyCost: sumCost(medium), phaseMonthlySavings: sumSavings(medium) });
  }
  if (advanced.length > 0) {
    phases.push({ phase: 3, label: 'Advanced Optimization', timeframe: 'Month 3-6', items: advanced, phaseMonthlyCost: sumCost(advanced), phaseMonthlySavings: sumSavings(advanced) });
  }

  return phases;
}

// ============================================================
// GENERATE FULL REPORT
// ============================================================

export function generateReport(answers: UserAnswers): ReportData {
  const industry = answers.industry as string;
  const metrics = calculateMetrics(answers);
  const allRecs = getRecommendations(answers);
  const automations = allRecs.filter(r => !r.isAgentic).slice(0, 6);
  const agenticFrameworks = allRecs.filter(r => r.isAgentic).slice(0, 4);
  const roadmap = buildRoadmap(allRecs.slice(0, 8));

  return {
    industry,
    industryLabel: INDUSTRY_LABELS[industry] || industry,
    teamSize: answers.team_size as string,
    metrics,
    automations,
    agenticFrameworks,
    roadmap,
    answers,
  };
}
