// ============================================================
// CALCULATION ENGINE
// Turns every answer into computed dollar amounts.
// No tiers. No arbitrary scores. Math from inputs.
// ============================================================

import type { UserAnswers, CalculatedMetrics, AutomationROI } from './types';
import { INDUSTRY_ECONOMICS, REVENUE_MULTIPLIERS, TEAM_ADMIN_HOURS } from './industryEconomics';

// ============================================================
// CORE CALCULATION — runs every answer through industry model
// ============================================================

export function calculateMetrics(answers: UserAnswers): CalculatedMetrics {
  const industry = answers.industry as string;
  const model = INDUSTRY_ECONOMICS[industry] || INDUSTRY_ECONOMICS.other;
  const revenueTier = answers.revenue as string;
  const teamSize = answers.team_size as string;

  const revMultiplier = REVENUE_MULTIPLIERS[revenueTier] || 1.0;
  const adminHoursPerWeek = TEAM_ADMIN_HOURS[teamSize] || 30;

  // ── Hourly labor cost ─────────────────────────────────
  // Use blended rate — automation replaces portions of multiple roles, not just front desk
  const hourlyLaborCost = model.blendedStaffHourlyRate;

  // ── Weekly hours lost to inefficiency ─────────────────
  // Base from their answer, adjusted by team size
  const hoursWastedMap: Record<string, number> = {
    few: 4, moderate: 10, significant: 22, heavy: 35, unknown: 15,
  };
  const baseHoursWasted = hoursWastedMap[answers.hours_wasted as string] || 15;

  // Multiply by inefficiency signals from other answers
  let inefficiencyMultiplier = 1.0;

  // No follow-up system = more wasted time chasing or losing leads
  const followUp = answers.follow_up as string;
  if (followUp === 'nothing') inefficiencyMultiplier += 0.30;
  else if (followUp === 'manual') inefficiencyMultiplier += 0.15;

  // Phone-only booking = more time per booking
  const booking = answers.booking_method as string;
  if (booking === 'phone') inefficiencyMultiplier += 0.20;
  else if (booking === 'mixed') inefficiencyMultiplier += 0.08;

  // No tools = everything is manual
  const tools = answers.current_tools as string[];
  if (Array.isArray(tools) && (tools.includes('none') || tools.length === 0)) {
    inefficiencyMultiplier += 0.25;
  }

  // Industry-specific conditional answers
  const reminders = answers.appointment_reminders as string;
  if (reminders === 'none') inefficiencyMultiplier += 0.15;
  else if (reminders === 'manual') inefficiencyMultiplier += 0.08;

  const estimateMethod = answers.estimate_method as string;
  if (estimateMethod === 'verbal') inefficiencyMultiplier += 0.20;
  else if (estimateMethod === 'spreadsheet') inefficiencyMultiplier += 0.10;

  const dispatch = answers.job_dispatch as string;
  if (dispatch === 'myself') inefficiencyMultiplier += 0.20;
  else if (dispatch === 'phone') inefficiencyMultiplier += 0.10;

  const docTime = answers.doc_time as string;
  if (docTime === 'over_15h') inefficiencyMultiplier += 0.25;
  else if (docTime === '5_15h') inefficiencyMultiplier += 0.10;

  const catalog = answers.catalog_management as string;
  if (catalog === 'manual') inefficiencyMultiplier += 0.15;

  const tenantHandling = answers.tenant_handling as string;
  if (tenantHandling === 'phone_only') inefficiencyMultiplier += 0.15;

  const weeklyHoursLost = Math.round(baseHoursWasted * inefficiencyMultiplier);

  // ── Annual cost of inefficiency ───────────────────────
  const annualInefficiencyCost = Math.round(weeklyHoursLost * hourlyLaborCost * 52);

  // ── Estimated leads lost per month ────────────────────
  const adjustedWeeklyVolume = Math.round(model.avgWeeklyVolume * revMultiplier);
  const monthlyInquiries = adjustedWeeklyVolume * 4.33;
  const currentConversion = model.avgLeadConversionRate;

  let leadLossRate = 0;

  // After-hours gap
  const afterHours = answers.after_hours as string;
  if (afterHours === 'voicemail') leadLossRate += 0.25;
  else if (afterHours === 'form') leadLossRate += 0.12;

  // Slow follow-up
  if (followUp === 'nothing') leadLossRate += 0.30;
  else if (followUp === 'manual') leadLossRate += 0.15;

  // Missed calls from booking method
  if (booking === 'phone') leadLossRate += model.avgMissedCallLeadLoss * 0.30;

  // Lost customers confirmation
  const lostCustomers = answers.lost_customers as string;
  if (lostCustomers === 'yes_definitely') leadLossRate += 0.15;
  else if (lostCustomers === 'probably') leadLossRate += 0.08;

  // Cap at 70% — even the worst business doesn't lose every lead
  leadLossRate = Math.min(leadLossRate, 0.70);

  const newLeadsPerMonth = monthlyInquiries * model.newCustomerRatio;
  const estimatedLeadsLostPerMonth = Math.round(newLeadsPerMonth * leadLossRate);

  // ── No-show revenue lost per year ─────────────────────
  let noshowRevenueLostPerYear = 0;

  if (model.avgNoshowRate > 0) {
    // Use their actual no-show rate if they answered
    const noshowRateMap: Record<string, number> = {
      over_20: 0.25,
      '10_20': 0.15,
      under_10: 0.07,
      not_sure: model.avgNoshowRate,
    };
    const actualNoshowRate = noshowRateMap[answers.noshow_rate as string] || model.avgNoshowRate;

    // Use their appointment volume if they answered
    const apptVolMap: Record<string, number> = {
      low: 15, moderate: 35, high: 75, very_high: 125,
    };
    const weeklyAppointments = apptVolMap[answers.appointment_volume as string] || adjustedWeeklyVolume;

    noshowRevenueLostPerYear = Math.round(
      weeklyAppointments * actualNoshowRate * model.avgRevenuePerTransaction * 52
    );
  }

  // ── Total recoverable per year ────────────────────────
  // Lost leads × CLV + inefficiency cost + no-show losses
  const leadRecoveryValue = estimatedLeadsLostPerMonth * model.customerLifetimeValue * 0.30; // assume automation recovers 30%
  const annualLeadRecovery = Math.round(leadRecoveryValue * 12);
  const noshowRecovery = Math.round(noshowRevenueLostPerYear * 0.50); // reminders typically recover 50%
  const inefficiencyRecovery = Math.round(annualInefficiencyCost * 0.60); // automation typically saves 60%

  const totalRecoverablePerYear = annualLeadRecovery + noshowRecovery + inefficiencyRecovery;

  // ── Automation coverage ───────────────────────────────
  // How much of their pain can be addressed by automation
  const painPoints = (answers.biggest_pain as string[]) || [];
  const aiExperience = answers.ai_experience as string;
  const techComfort = typeof answers.tech_comfort === 'number' ? answers.tech_comfort : 5;

  let coverageBase = 0.55; // baseline: automation can address ~55% of typical SMB operational waste

  // More pain points identified = more coverage opportunities
  coverageBase += Math.min(painPoints.length * 0.05, 0.20);

  // Higher tech comfort = more they can actually implement
  if (techComfort >= 7) coverageBase += 0.10;
  else if (techComfort <= 3) coverageBase -= 0.10;

  // AI experience shifts what's realistic
  if (aiExperience === 'advanced') coverageBase += 0.10;
  else if (aiExperience === 'none') coverageBase -= 0.08;

  // Goal alignment
  const goal = answers.primary_goal as string;
  if (goal === 'reduce_costs' || goal === 'free_time') coverageBase += 0.05;

  const automationCoveragePercent = Math.round(Math.min(Math.max(coverageBase, 0.30), 0.85) * 100);

  return {
    frontDeskHourlyRate: model.frontDeskHourlyRate,
    hourlyLaborCost,
    weeklyHoursLost,
    annualInefficiencyCost,
    estimatedLeadsLostPerMonth,
    noshowRevenueLostPerYear,
    totalRecoverablePerYear,
    automationCoveragePercent,
  };
}

// ============================================================
// PER-AUTOMATION ROI — compute payback for each recommendation
// ============================================================

export function calculateAutomationROI(
  monthlyCostStr: string,
  estimatedSavingsStr: string,
  answers: UserAnswers,
): AutomationROI {
  const model = INDUSTRY_ECONOMICS[answers.industry as string] || INDUSTRY_ECONOMICS.other;
  const hourlyRate = model.blendedStaffHourlyRate;
  const revMultiplier = REVENUE_MULTIPLIERS[answers.revenue as string] || 1.0;

  // Parse monthly cost range from string like "$50-$200/mo"
  const costMatch = monthlyCostStr.match(/\$(\d[\d,]*)/g);
  const monthlyCostLow = costMatch?.[0] ? parseInt(costMatch[0].replace(/[$,]/g, '')) : 50;
  const monthlyCostHigh = costMatch?.[1] ? parseInt(costMatch[1].replace(/[$,]/g, '')) : monthlyCostLow * 2;
  const avgMonthlyCost = (monthlyCostLow + monthlyCostHigh) / 2;

  // Parse hours saved from string like "8-12 hours/week"
  const hoursMatch = estimatedSavingsStr.match(/(\d+)[-–](\d+)\s*hours?/i);
  const revenueMatch = estimatedSavingsStr.match(/\$(\d[\d,]*)/g);

  let monthlySavingsEstimate: number;

  if (hoursMatch) {
    const avgHoursSaved = (parseInt(hoursMatch[1]) + parseInt(hoursMatch[2])) / 2;
    monthlySavingsEstimate = Math.round(avgHoursSaved * hourlyRate * 4.33 * revMultiplier);
  } else if (revenueMatch) {
    const low = parseInt(revenueMatch[0].replace(/[$,]/g, ''));
    const high = revenueMatch[1] ? parseInt(revenueMatch[1].replace(/[$,]/g, '')) : low;
    monthlySavingsEstimate = Math.round(((low + high) / 2) * revMultiplier);
  } else {
    // Fallback: assume saves 3x its cost
    monthlySavingsEstimate = Math.round(avgMonthlyCost * 3);
  }

  const netMonthlySavings = monthlySavingsEstimate - avgMonthlyCost;
  const paybackDays = netMonthlySavings > 0
    ? Math.round((avgMonthlyCost / netMonthlySavings) * 30)
    : 999;
  const annualNetSavings = Math.round(netMonthlySavings * 12);

  return {
    monthlyCostLow,
    monthlyCostHigh,
    monthlySavingsEstimate,
    paybackDays: Math.max(1, paybackDays),
    annualNetSavings: Math.max(0, annualNetSavings),
  };
}
