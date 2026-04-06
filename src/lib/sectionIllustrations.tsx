// ============================================================
// Per-question illustrations for the calculator flow.
// Unique DALL-E generated image for every question.
// ============================================================

const questionImages: Record<string, string> = {
  industry: '/images/q-industry.png',
  team_size: '/images/q-team_size.png',
  revenue: '/images/q-revenue.png',
  appointment_reminders: '/images/q-appointment_reminders.png',
  noshow_rate: '/images/q-noshow_rate.png',
  estimate_method: '/images/q-estimate_method.png',
  job_dispatch: '/images/q-job_dispatch.png',
  doc_time: '/images/q-doc_time.png',
  catalog_management: '/images/q-catalog_management.png',
  tenant_handling: '/images/q-tenant_handling.png',
  booking_method: '/images/q-booking_method.png',
  follow_up: '/images/q-follow_up.png',
  after_hours: '/images/q-after_hours.png',
  current_tools: '/images/q-current_tools.png',
  biggest_pain: '/images/q-biggest_pain.png',
  lead_volume: '/images/q-lead_volume.png',
  appointment_volume: '/images/q-appointment_volume.png',
  hours_wasted: '/images/q-hours_wasted.png',
  lost_customers: '/images/q-lost_customers.png',
  ai_experience: '/images/q-ai_experience.png',
  tech_comfort: '/images/q-tech_comfort.png',
  ai_trust: '/images/q-ai_trust.png',
  primary_goal: '/images/q-primary_goal.png',
  budget: '/images/q-budget.png',
  timeline: '/images/q-timeline.png',
};

export function QuestionImage({ questionId }: { questionId: string }) {
  const src = questionImages[questionId];
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      style={{
        width: '100%',
        maxWidth: 280,
        height: 'auto',
        borderRadius: 'var(--radius-lg)',
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
}
