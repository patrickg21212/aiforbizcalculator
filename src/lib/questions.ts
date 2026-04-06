import type { Question, UserAnswers } from './types';

// ============================================================
// Industry clusters for conditional questions
// ============================================================

const APPOINTMENT_INDUSTRIES = new Set([
  'medspa', 'dental', 'chiropractic', 'veterinary', 'optometry',
  'mental_health', 'salon', 'fitness', 'massage', 'tattoo', 'pet',
]);

const FIELD_SERVICE_INDUSTRIES = new Set([
  'home_services', 'cleaning', 'landscaping', 'construction', 'auto',
]);

const PROFESSIONAL_INDUSTRIES = new Set([
  'legal', 'accounting', 'insurance', 'financial', 'consulting', 'marketing_agency',
]);

const RETAIL_INDUSTRIES = new Set(['ecommerce', 'restaurant']);

const PROPERTY_INDUSTRIES = new Set(['real_estate', 'property_mgmt']);

// ============================================================
// QUESTIONS — with conditional branching
// Each user sees 16 base + 2-4 conditional based on their path.
// Every conditional question directly feeds the scoring engine.
// ============================================================

export const QUESTIONS: Question[] = [
  // ============================================================
  // SECTION 1: Business Profile
  // ============================================================
  {
    id: 'industry',
    section: 'Business Profile',
    question: 'What type of business do you run?',
    subtitle: 'We tailor every recommendation to your industry.',
    type: 'single',
    options: [
      { value: 'medspa', label: 'Med Spa / Aesthetics', icon: '💆' },
      { value: 'dental', label: 'Dental Practice', icon: '🦷' },
      { value: 'chiropractic', label: 'Chiropractic / Physical Therapy', icon: '🦴' },
      { value: 'veterinary', label: 'Veterinary Clinic', icon: '🐾' },
      { value: 'optometry', label: 'Optometry / Eye Care', icon: '👁️' },
      { value: 'mental_health', label: 'Therapy / Mental Health Practice', icon: '🧠' },
      { value: 'salon', label: 'Salon / Barbershop / Beauty', icon: '✂️' },
      { value: 'fitness', label: 'Fitness / Gym / Yoga Studio', icon: '🏋️' },
      { value: 'massage', label: 'Massage Therapy / Spa', icon: '🧖' },
      { value: 'restaurant', label: 'Restaurant / Cafe / Bar', icon: '🍽️' },
      { value: 'home_services', label: 'Home Services (HVAC, Plumbing, Electric)', icon: '🔧' },
      { value: 'cleaning', label: 'Cleaning / Janitorial Service', icon: '🧹' },
      { value: 'auto', label: 'Auto Repair / Detailing', icon: '🚗' },
      { value: 'real_estate', label: 'Real Estate Agency', icon: '🏠' },
      { value: 'legal', label: 'Law Firm / Legal Services', icon: '⚖️' },
      { value: 'accounting', label: 'Accounting / Tax / Bookkeeping', icon: '📊' },
      { value: 'insurance', label: 'Insurance Agency', icon: '🛡️' },
      { value: 'financial', label: 'Financial Advisor / Wealth Management', icon: '💰' },
      { value: 'consulting', label: 'Consulting / Coaching', icon: '📋' },
      { value: 'property_mgmt', label: 'Property Management', icon: '🏢' },
      { value: 'ecommerce', label: 'E-Commerce / Online Retail', icon: '🛒' },
      { value: 'photography', label: 'Photography / Videography', icon: '📸' },
      { value: 'event', label: 'Event Planning / Catering', icon: '🎉' },
      { value: 'daycare', label: 'Daycare / Childcare / Tutoring', icon: '👶' },
      { value: 'pet', label: 'Pet Grooming / Boarding', icon: '🐕' },
      { value: 'funeral', label: 'Funeral Home / Memorial Services', icon: '🕊️' },
      { value: 'tattoo', label: 'Tattoo / Piercing Studio', icon: '🎨' },
      { value: 'construction', label: 'Construction / Contracting', icon: '🏗️' },
      { value: 'landscaping', label: 'Landscaping / Lawn Care', icon: '🌿' },
      { value: 'marketing_agency', label: 'Marketing / Creative Agency', icon: '📢' },
      { value: 'other', label: 'Other / Not Listed', icon: '🏪' },
    ],
  },

  {
    id: 'team_size',
    section: 'Business Profile',
    question: 'How many people work in your business?',
    subtitle: 'Including yourself, full-time and part-time.',
    type: 'single',
    options: [
      { value: 'solo', label: 'Just me', icon: '👤' },
      { value: 'small', label: '2 to 5 people', icon: '👥' },
      { value: 'medium', label: '6 to 20 people', icon: '🏢' },
      { value: 'large', label: '21 to 50 people', icon: '🏬' },
      { value: 'enterprise', label: '50+ people', icon: '🌐' },
    ],
  },

  {
    id: 'revenue',
    section: 'Business Profile',
    question: 'What is your approximate annual revenue?',
    subtitle: 'This helps us recommend solutions that fit your budget.',
    type: 'single',
    options: [
      { value: 'startup', label: 'Under $100K', icon: '🌱' },
      { value: 'growing', label: '$100K to $500K', icon: '📈' },
      { value: 'established', label: '$500K to $1M', icon: '💼' },
      { value: 'scaling', label: '$1M to $5M', icon: '🚀' },
      { value: 'mature', label: '$5M+', icon: '🏆' },
    ],
  },

  // ── Conditional: Appointment-based industries ─────────────
  {
    id: 'appointment_reminders',
    section: 'Your Operations',
    question: 'How do you currently handle appointment reminders?',
    subtitle: 'This directly impacts our scheduling automation recommendations.',
    type: 'single',
    showWhen: (a: UserAnswers) => APPOINTMENT_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'none', label: 'We don\'t send reminders', score: 0 },
      { value: 'manual', label: 'Someone calls or texts manually', score: 3 },
      { value: 'auto_basic', label: 'Our booking system sends basic reminders', score: 7 },
      { value: 'multi_channel', label: 'Multi-channel automated (text, email, phone)', score: 10 },
    ],
  },
  {
    id: 'noshow_rate',
    section: 'Your Operations',
    question: 'What\'s your typical no-show or last-minute cancellation rate?',
    type: 'single',
    showWhen: (a: UserAnswers) => APPOINTMENT_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'over_20', label: 'Over 20% — it\'s a real problem', score: 0 },
      { value: '10_20', label: '10-20%', score: 3 },
      { value: 'under_10', label: 'Under 10%', score: 7 },
      { value: 'not_sure', label: 'Not sure, we don\'t track it', score: 4 },
    ],
  },

  // ── Conditional: Field service industries ──────────────────
  {
    id: 'estimate_method',
    section: 'Your Operations',
    question: 'How do you create estimates or proposals for jobs?',
    subtitle: 'This helps us match the right sales tools to your workflow.',
    type: 'single',
    showWhen: (a: UserAnswers) => FIELD_SERVICE_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'verbal', label: 'Verbal or ballpark estimates on-site', score: 0 },
      { value: 'spreadsheet', label: 'Handwritten or basic spreadsheet', score: 3 },
      { value: 'template', label: 'Template-based but still manual', score: 6 },
      { value: 'software', label: 'Software generates them automatically', score: 9 },
    ],
  },
  {
    id: 'job_dispatch',
    section: 'Your Operations',
    question: 'How are jobs assigned to your crew or technicians?',
    type: 'single',
    showWhen: (a: UserAnswers) => FIELD_SERVICE_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'myself', label: 'I handle everything myself', score: 0 },
      { value: 'phone', label: 'Phone calls and texts to the team', score: 3 },
      { value: 'calendar', label: 'Shared calendar or whiteboard', score: 5 },
      { value: 'software', label: 'Dispatch software with routing', score: 9 },
    ],
  },

  // ── Conditional: Professional services ─────────────────────
  {
    id: 'doc_time',
    section: 'Your Operations',
    question: 'How much time per week does your team spend on client documents?',
    subtitle: 'Contracts, reports, proposals, filings, letters, etc.',
    type: 'single',
    showWhen: (a: UserAnswers) => PROFESSIONAL_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'over_15h', label: 'Over 15 hours — it\'s a bottleneck', score: 0 },
      { value: '5_15h', label: '5-15 hours', score: 3 },
      { value: 'under_5h', label: 'Under 5 hours', score: 7 },
      { value: 'templates', label: 'We have templates that speed this up', score: 9 },
    ],
  },

  // ── Conditional: Retail / Restaurant ───────────────────────
  {
    id: 'catalog_management',
    section: 'Your Operations',
    question: 'How do you manage your product listings or menu?',
    type: 'single',
    showWhen: (a: UserAnswers) => RETAIL_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'manual', label: 'Manually updated one at a time', score: 0 },
      { value: 'spreadsheet', label: 'Spreadsheet imports', score: 3 },
      { value: 'platform', label: 'POS or platform manages most of it', score: 7 },
    ],
  },

  // ── Conditional: Property ──────────────────────────────────
  {
    id: 'tenant_handling',
    section: 'Your Operations',
    question: 'How do you handle tenant or client requests?',
    subtitle: 'Maintenance requests, questions, showings, etc.',
    type: 'single',
    showWhen: (a: UserAnswers) => PROPERTY_INDUSTRIES.has(a.industry as string),
    options: [
      { value: 'phone_only', label: 'Phone calls and voicemail', score: 0 },
      { value: 'email_forms', label: 'Email or online forms', score: 3 },
      { value: 'portal', label: 'Tenant/client portal', score: 7 },
      { value: 'automated', label: 'Automated system with routing and tracking', score: 9 },
    ],
  },

  // ============================================================
  // SECTION 2: Current Operations
  // ============================================================
  {
    id: 'booking_method',
    section: 'Current Operations',
    question: 'How do customers typically book or engage with you?',
    type: 'single',
    options: [
      { value: 'phone', label: 'Phone calls only', score: 0 },
      { value: 'website_form', label: 'Website form or email', score: 3 },
      { value: 'online_booking', label: 'Online booking system', score: 8 },
      { value: 'mixed', label: 'Mix of phone, online, and walk-ins', score: 5 },
      { value: 'marketplace', label: 'Through a marketplace or platform', score: 6 },
    ],
  },

  {
    id: 'follow_up',
    section: 'Current Operations',
    question: 'How do you follow up with leads who don\'t convert right away?',
    type: 'single',
    options: [
      { value: 'nothing', label: 'We don\'t really follow up', score: 0 },
      { value: 'manual', label: 'Someone calls or emails them manually', score: 3 },
      { value: 'basic_email', label: 'Basic email sequences or newsletters', score: 6 },
      { value: 'crm', label: 'CRM with automated follow-up workflows', score: 10 },
    ],
  },

  {
    id: 'after_hours',
    section: 'Current Operations',
    question: 'What happens when someone contacts you outside business hours?',
    type: 'single',
    options: [
      { value: 'voicemail', label: 'They get a voicemail or nothing', score: 0 },
      { value: 'form', label: 'They can leave a message or fill a form', score: 3 },
      { value: 'answering_service', label: 'Answering service takes messages', score: 5 },
      { value: 'chatbot', label: 'Chatbot or automated system handles it', score: 9 },
      { value: 'na', label: 'Not applicable to my business', score: 5 },
    ],
  },

  {
    id: 'current_tools',
    section: 'Current Operations',
    question: 'Which tools are you currently using?',
    subtitle: 'Select all that apply.',
    type: 'multi',
    maxSelections: 8,
    options: [
      { value: 'google_workspace', label: 'Google Workspace (Gmail, Calendar, Docs)' },
      { value: 'microsoft', label: 'Microsoft 365 (Outlook, Teams)' },
      { value: 'crm', label: 'CRM (HubSpot, Salesforce, etc.)' },
      { value: 'booking_software', label: 'Booking/Scheduling software' },
      { value: 'accounting', label: 'Accounting software (QuickBooks, Xero)' },
      { value: 'social_media', label: 'Social media management tools' },
      { value: 'email_marketing', label: 'Email marketing (Mailchimp, etc.)' },
      { value: 'pos', label: 'POS / Payment system' },
      { value: 'project_mgmt', label: 'Project management (Asana, Trello)' },
      { value: 'none', label: 'Not really using any tools' },
    ],
  },

  // ============================================================
  // SECTION 3: Pain Points
  // ============================================================
  {
    id: 'biggest_pain',
    section: 'Pain Points',
    question: 'What\'s eating the most time in your business right now?',
    subtitle: 'Pick up to 3.',
    type: 'multi',
    maxSelections: 3,
    options: [
      { value: 'answering_questions', label: 'Answering the same questions from leads/clients' },
      { value: 'scheduling', label: 'Scheduling, rescheduling, and no-shows' },
      { value: 'lead_followup', label: 'Following up with leads who go cold' },
      { value: 'data_entry', label: 'Manual data entry or paperwork' },
      { value: 'content_creation', label: 'Social media and content creation' },
      { value: 'onboarding', label: 'Onboarding new clients or employees' },
      { value: 'reviews', label: 'Managing online reviews and reputation' },
      { value: 'invoicing', label: 'Invoicing, billing, and collections' },
      { value: 'reporting', label: 'Reporting and tracking performance' },
      { value: 'hiring', label: 'Finding and managing staff' },
    ],
  },

  // ── Conditional: Pain-specific follow-ups ──────────────────
  {
    id: 'lead_volume',
    section: 'Pain Points',
    question: 'How many new leads or inquiries come in per month?',
    subtitle: 'This helps us estimate the ROI of lead management automation.',
    type: 'single',
    showWhen: (a: UserAnswers) => {
      const pains = a.biggest_pain;
      return Array.isArray(pains) && pains.includes('lead_followup');
    },
    options: [
      { value: 'low', label: 'Under 20', score: 2 },
      { value: 'moderate', label: '20 to 50', score: 5 },
      { value: 'high', label: '50 to 100', score: 8 },
      { value: 'very_high', label: 'Over 100', score: 12 },
    ],
  },
  {
    id: 'appointment_volume',
    section: 'Pain Points',
    question: 'Roughly how many appointments per week does your business handle?',
    subtitle: 'Higher volume means higher automation impact.',
    type: 'single',
    showWhen: (a: UserAnswers) => {
      const pains = a.biggest_pain;
      return Array.isArray(pains) && pains.includes('scheduling');
    },
    options: [
      { value: 'low', label: 'Under 20', score: 2 },
      { value: 'moderate', label: '20 to 50', score: 5 },
      { value: 'high', label: '50 to 100', score: 8 },
      { value: 'very_high', label: 'Over 100', score: 12 },
    ],
  },

  {
    id: 'hours_wasted',
    section: 'Pain Points',
    question: 'How many hours per week does your team spend on repetitive tasks?',
    type: 'single',
    options: [
      { value: 'few', label: 'Under 5 hours', score: 2 },
      { value: 'moderate', label: '5 to 15 hours', score: 6 },
      { value: 'significant', label: '15 to 30 hours', score: 10 },
      { value: 'heavy', label: '30+ hours', score: 15 },
      { value: 'unknown', label: 'Honestly, I have no idea', score: 8 },
    ],
  },

  {
    id: 'lost_customers',
    section: 'Pain Points',
    question: 'Have you lost customers because of slow response times?',
    type: 'single',
    options: [
      { value: 'yes_definitely', label: 'Yes, definitely', score: 10 },
      { value: 'probably', label: 'Probably, but hard to measure', score: 7 },
      { value: 'not_sure', label: 'Not sure', score: 4 },
      { value: 'no', label: 'No, we respond quickly', score: 1 },
    ],
  },

  // ============================================================
  // SECTION 4: AI Readiness
  // ============================================================
  {
    id: 'ai_experience',
    section: 'AI Readiness',
    question: 'How would you describe your current use of AI?',
    type: 'single',
    options: [
      { value: 'none', label: 'Never used AI in my business', score: 0 },
      { value: 'casual', label: 'I use ChatGPT or similar occasionally', score: 5 },
      { value: 'moderate', label: 'A few AI tools integrated into our workflow', score: 15 },
      { value: 'advanced', label: 'AI is deeply embedded in how we operate', score: 25 },
    ],
  },

  {
    id: 'tech_comfort',
    section: 'AI Readiness',
    question: 'How comfortable is your team with new technology?',
    type: 'scale',
    scale: { min: 1, max: 10, minLabel: 'We struggle with tech', maxLabel: 'We love trying new tools' },
  },

  {
    id: 'ai_trust',
    section: 'AI Readiness',
    question: 'Would you trust AI to handle a customer interaction without human oversight?',
    type: 'single',
    options: [
      { value: 'never', label: 'No way, a human needs to be involved every time', score: 0 },
      { value: 'simple', label: 'For simple things like confirming appointments', score: 5 },
      { value: 'routine', label: 'Yes, for most routine interactions', score: 12 },
      { value: 'fully', label: 'Absolutely, if it\'s trained on my business', score: 20 },
    ],
  },

  // ============================================================
  // SECTION 5: Goals & Budget
  // ============================================================
  {
    id: 'primary_goal',
    section: 'Goals',
    question: 'What\'s your #1 business goal for the next 12 months?',
    type: 'single',
    options: [
      { value: 'grow_revenue', label: 'Grow revenue significantly', icon: '📈' },
      { value: 'reduce_costs', label: 'Reduce operating costs', icon: '💸' },
      { value: 'better_cx', label: 'Improve customer experience', icon: '⭐' },
      { value: 'scale', label: 'Scale without hiring more people', icon: '🚀' },
      { value: 'free_time', label: 'Free up my personal time', icon: '⏰' },
    ],
  },

  {
    id: 'timeline',
    section: 'Goals',
    question: 'If you found the right solution, how quickly would you move?',
    type: 'single',
    options: [
      { value: 'research', label: 'I\'d want to research and think it over', score: 1 },
      { value: 'weeks', label: 'A few weeks after seeing a demo', score: 4 },
      { value: 'fast', label: 'Within a week if it looks right', score: 9 },
      { value: 'yesterday', label: 'I\'d start tomorrow', score: 14 },
    ],
  },
];

export const SECTIONS = [...new Set(QUESTIONS.map(q => q.section))];

export const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
  QUESTIONS.find(q => q.id === 'industry')!.options!.map(o => [o.value, o.label])
);
