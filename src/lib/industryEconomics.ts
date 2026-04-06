// ============================================================
// INDUSTRY ECONOMICS — baseline financial models per industry
// Every number here is used in the calculation engine.
// Source: 2024-2026 industry research, SMB averages (US market)
// ============================================================

export interface IndustryModel {
  id: string;
  // Revenue
  avgRevenuePerTransaction: number;     // mid-point of typical range
  revenuePerTransactionRange: [number, number];
  customerLifetimeValue: number;
  avgCustomerAcquisitionCost: number;

  // Volume
  avgWeeklyVolume: number;              // appointments/jobs/transactions per week
  weeklyVolumeRange: [number, number];

  // Labor — two tiers for accurate automation ROI
  frontDeskHourlyRate: number;          // receptionist / basic admin hourly cost
  blendedStaffHourlyRate: number;       // weighted avg across all automatable roles (billing, coordinator, office mgr, etc.)

  // Loss metrics
  avgNoshowRate: number;                // 0-1, appointment-based industries
  avgLeadConversionRate: number;        // 0-1, what % of inquiries become customers
  avgMissedCallLeadLoss: number;        // 0-1, what % of missed calls are lost forever
  avgResponseTimeLeadDecay: number;     // 0-1, lead loss per hour of delayed response

  // Mix
  newCustomerRatio: number;             // 0-1, what % of monthly customers are new

  // Industry-specific multipliers
  repeatBookingValue: number;           // annual value of keeping one customer rebooking
  seasonalityFactor: number;            // 1.0 = no seasonality, 1.3 = 30% peak variance
}

// Placeholder — will be populated with research data
export const INDUSTRY_ECONOMICS: Record<string, IndustryModel> = {
  // ── APPOINTMENT-BASED (Healthcare/Wellness) ────────────────
  medspa: {
    id: 'medspa',
    avgRevenuePerTransaction: 504,         // AmSpa 2024 avg per visit
    revenuePerTransactionRange: [200, 800],
    customerLifetimeValue: 6500,            // 3-5 year patient retention, repeat injectables
    avgCustomerAcquisitionCost: 250,
    avgWeeklyVolume: 55,
    weeklyVolumeRange: [30, 100],
    frontDeskHourlyRate: 18,                // receptionist / patient check-in
    blendedStaffHourlyRate: 22,             // incl. patient coordinator $24, billing $23, marketing $25
    avgNoshowRate: 0.23,                    // 23-34% industry range
    avgLeadConversionRate: 0.30,
    avgMissedCallLeadLoss: 0.85,            // 85% never call back
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.25,
    repeatBookingValue: 4500,
    seasonalityFactor: 1.15,
  },
  dental: {
    id: 'dental',
    avgRevenuePerTransaction: 300,          // Overjet 2025: avg per patient visit
    revenuePerTransactionRange: [150, 1200],
    customerLifetimeValue: 10000,           // Delmain: $10K+ over patient lifetime
    avgCustomerAcquisitionCost: 300,
    avgWeeklyVolume: 80,
    weeklyVolumeRange: [40, 120],
    frontDeskHourlyRate: 19,                // dental front office
    blendedStaffHourlyRate: 21,             // incl. insurance verification $19, treatment coordinator $23, billing $22
    avgNoshowRate: 0.15,                    // DoctorLogic: 15% avg
    avgLeadConversionRate: 0.40,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.20,
    repeatBookingValue: 1400,
    seasonalityFactor: 1.05,
  },
  chiropractic: {
    id: 'chiropractic',
    avgRevenuePerTransaction: 80,           // zHealth: $75-90 avg adjustment
    revenuePerTransactionRange: [65, 150],
    customerLifetimeValue: 2000,            // high frequency offsets low per-visit
    avgCustomerAcquisitionCost: 100,
    avgWeeklyVolume: 80,
    weeklyVolumeRange: [50, 150],
    frontDeskHourlyRate: 16,                // chiro front desk
    blendedStaffHourlyRate: 20,             // incl. billing/coding $22, office manager $25
    avgNoshowRate: 0.15,                    // 10-30% range, 15% median
    avgLeadConversionRate: 0.45,            // pain-motivated = higher conversion
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.25,
    repeatBookingValue: 3900,
    seasonalityFactor: 1.05,
  },
  veterinary: {
    id: 'veterinary',
    avgRevenuePerTransaction: 153,          // AVMA 2024: $153 avg invoice
    revenuePerTransactionRange: [100, 300],
    customerLifetimeValue: 5000,            // Covetrus: bonded client CLV
    avgCustomerAcquisitionCost: 100,        // $29-200 range
    avgWeeklyVolume: 120,
    weeklyVolumeRange: [80, 200],
    frontDeskHourlyRate: 17,                // vet clinic receptionist
    blendedStaffHourlyRate: 21,             // incl. vet tech admin $20, billing $20, office mgr $25
    avgNoshowRate: 0.11,                    // pre-pandemic baseline, trending higher
    avgLeadConversionRate: 0.45,            // high pet-owner motivation
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.12,
    newCustomerRatio: 0.20,
    repeatBookingValue: 622,                // AVMA: $622/yr per patient
    seasonalityFactor: 1.10,
  },
  optometry: {
    id: 'optometry',
    avgRevenuePerTransaction: 350,          // exam + eyewear avg
    revenuePerTransactionRange: [200, 550],
    customerLifetimeValue: 5000,            // $400/yr x 10+ years
    avgCustomerAcquisitionCost: 200,
    avgWeeklyVolume: 60,
    weeklyVolumeRange: [48, 80],
    frontDeskHourlyRate: 17,                // optometry front desk
    blendedStaffHourlyRate: 21,             // incl. insurance coordinator $21, billing $21, inventory mgr $25
    avgNoshowRate: 0.25,                    // highest of healthcare group
    avgLeadConversionRate: 0.40,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.20,
    repeatBookingValue: 400,                // annual exam model
    seasonalityFactor: 1.05,
  },
  mental_health: {
    id: 'mental_health',
    avgRevenuePerTransaction: 159,          // SimplePractice avg session rate
    revenuePerTransactionRange: [111, 250],
    customerLifetimeValue: 8000,            // recurring weekly x 1-3 years
    avgCustomerAcquisitionCost: 200,
    avgWeeklyVolume: 22,
    weeklyVolumeRange: [15, 35],
    frontDeskHourlyRate: 18,                // mental health practice front desk
    blendedStaffHourlyRate: 21,             // incl. billing/coding $23, intake coordinator $21, referral $19
    avgNoshowRate: 0.20,                    // 15-30% range, 20% median
    avgLeadConversionRate: 0.40,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.15,
    newCustomerRatio: 0.15,
    repeatBookingValue: 7200,
    seasonalityFactor: 1.10,
  },

  // ── APPOINTMENT-BASED (Beauty/Wellness) ────────────────────
  salon: {
    id: 'salon',
    avgRevenuePerTransaction: 55,           // Boulevard 10,800-salon dataset avg ticket
    revenuePerTransactionRange: [28, 120],
    customerLifetimeValue: 3000,            // 10-year LTV, 4.88 visits/yr
    avgCustomerAcquisitionCost: 35,         // referral-dominant, 81% via referral/Google
    avgWeeklyVolume: 116,                   // Census/FRED: ~5,700 visits/yr per salon
    weeklyVolumeRange: [40, 240],
    frontDeskHourlyRate: 16,                // salon receptionist (Indeed: $15.85)
    blendedStaffHourlyRate: 19,             // incl. booking coordinator $17, social media $21, salon mgr $21
    avgNoshowRate: 0.15,                    // 10-20% range, 15% typical
    avgLeadConversionRate: 0.60,            // Zenoti: 60-75% of answered calls convert
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.08,
    newCustomerRatio: 0.25,
    repeatBookingValue: 269,                // $55 x 4.88 visits/yr
    seasonalityFactor: 1.10,
  },
  fitness: {
    id: 'fitness',
    avgRevenuePerTransaction: 50,           // implied per-visit from memberships
    revenuePerTransactionRange: [15, 150],
    customerLifetimeValue: 517,             // industry standard avg LTV
    avgCustomerAcquisitionCost: 50,         // blended referral + digital
    avgWeeklyVolume: 150,                   // weekly attendees, small-medium studio
    weeklyVolumeRange: [60, 450],
    frontDeskHourlyRate: 15,                // gym front desk
    blendedStaffHourlyRate: 19,             // incl. membership coordinator $20, billing $21, scheduling $20
    avgNoshowRate: 0.20,                    // 20-35% without reminders
    avgLeadConversionRate: 0.45,            // Wodify 2024: 45.3% lead-to-member
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.08,
    newCustomerRatio: 0.08,                 // membership model: 92% returning
    repeatBookingValue: 600,                // $50/mo x 12
    seasonalityFactor: 1.30,
  },
  massage: {
    id: 'massage',
    avgRevenuePerTransaction: 95,           // ClinicSense 2024: ~$117 trending up
    revenuePerTransactionRange: [60, 150],
    customerLifetimeValue: 1500,            // 3-year at ~$500/yr
    avgCustomerAcquisitionCost: 50,         // referral-heavy, 81% via referral
    avgWeeklyVolume: 50,                    // small studio 2-4 tables
    weeklyVolumeRange: [20, 120],
    frontDeskHourlyRate: 16,                // spa/massage front desk
    blendedStaffHourlyRate: 18,             // incl. booking coordinator $18, billing $21
    avgNoshowRate: 0.12,                    // 8-18% range, cancellation rate 16.93%
    avgLeadConversionRate: 0.55,            // 40-70% inbound inquiry to booking
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.30,
    repeatBookingValue: 380,                // $95 x 4 visits/yr
    seasonalityFactor: 1.10,
  },
  tattoo: {
    id: 'tattoo',
    avgRevenuePerTransaction: 262,          // Bookedin 2025: North America avg session
    revenuePerTransactionRange: [80, 600],
    customerLifetimeValue: 1310,            // occasional client, 5-year
    avgCustomerAcquisitionCost: 30,         // Instagram/social portfolio-driven
    avgWeeklyVolume: 25,                    // small shop 1-2 artists
    weeklyVolumeRange: [15, 35],
    frontDeskHourlyRate: 15,                // tattoo shop front desk
    blendedStaffHourlyRate: 17,             // incl. booking/consultation coordinator $18
    avgNoshowRate: 0.15,                    // 10-25%, deposits reduce 50-80%
    avgLeadConversionRate: 0.40,            // 25-60% inquiry-to-booked
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.06,
    newCustomerRatio: 0.50,
    repeatBookingValue: 524,                // $262 x 2/yr
    seasonalityFactor: 1.10,
  },

  // ── FOOD & HOSPITALITY ────────────────────────────────────
  restaurant: {
    id: 'restaurant',
    avgRevenuePerTransaction: 35,           // casual dining per-person avg
    revenuePerTransactionRange: [12, 75],
    customerLifetimeValue: 1200,            // full-service: ~$1,200/yr repeat customer
    avgCustomerAcquisitionCost: 40,         // social/local marketing
    avgWeeklyVolume: 560,                   // 80 covers/day x 7 days, casual 50-100 seats
    weeklyVolumeRange: [280, 1400],
    frontDeskHourlyRate: 14,                // host/hostess
    blendedStaffHourlyRate: 19,             // incl. reservation mgr $22, scheduling mgr $22, inventory $18
    avgNoshowRate: 0.20,                    // Toast: 17% cancellation, 20% avg no-show
    avgLeadConversionRate: 0.12,            // discovery-to-reservation: 5-25%
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.05,
    newCustomerRatio: 0.70,                 // 70% of first-timers never return
    repeatBookingValue: 1200,
    seasonalityFactor: 1.20,
  },

  // ── FIELD SERVICE ─────────────────────────────────────────
  home_services: {
    id: 'home_services',
    avgRevenuePerTransaction: 350,
    revenuePerTransactionRange: [150, 800],
    customerLifetimeValue: 15000,
    avgCustomerAcquisitionCost: 280,
    avgWeeklyVolume: 25,
    weeklyVolumeRange: [15, 40],
    frontDeskHourlyRate: 18,                // office admin
    blendedStaffHourlyRate: 26,             // incl. dispatcher $22, estimator $40, billing $23
    avgNoshowRate: 0.05,
    avgLeadConversionRate: 0.18,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.25,
    newCustomerRatio: 0.45,
    repeatBookingValue: 1200,
    seasonalityFactor: 1.30,
  },
  cleaning: {
    id: 'cleaning',
    avgRevenuePerTransaction: 200,
    revenuePerTransactionRange: [100, 350],
    customerLifetimeValue: 3000,
    avgCustomerAcquisitionCost: 100,
    avgWeeklyVolume: 40,
    weeklyVolumeRange: [20, 60],
    frontDeskHourlyRate: 16,                // cleaning service office admin
    blendedStaffHourlyRate: 20,             // incl. scheduling coordinator $20, billing $22, quality $22
    avgNoshowRate: 0.05,
    avgLeadConversionRate: 0.40,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.12,
    newCustomerRatio: 0.45,
    repeatBookingValue: 4200,
    seasonalityFactor: 1.15,
  },
  auto: {
    id: 'auto',
    avgRevenuePerTransaction: 548,
    revenuePerTransactionRange: [150, 1500],
    customerLifetimeValue: 4000,
    avgCustomerAcquisitionCost: 100,
    avgWeeklyVolume: 40,
    weeklyVolumeRange: [30, 60],
    frontDeskHourlyRate: 17,                // auto repair receptionist
    blendedStaffHourlyRate: 22,             // incl. service writer $25, parts $20, billing $22, warranty $22
    avgNoshowRate: 0.15,
    avgLeadConversionRate: 0.65,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.35,
    repeatBookingValue: 1400,
    seasonalityFactor: 1.10,
  },
  construction: {
    id: 'construction',
    avgRevenuePerTransaction: 15000,
    revenuePerTransactionRange: [5000, 55000],
    customerLifetimeValue: 60000,
    avgCustomerAcquisitionCost: 800,
    avgWeeklyVolume: 3,
    weeklyVolumeRange: [2, 5],
    frontDeskHourlyRate: 18,                // construction office admin
    blendedStaffHourlyRate: 29,             // incl. project coordinator $35, estimator $38, billing $23
    avgNoshowRate: 0.03,
    avgLeadConversionRate: 0.15,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.25,
    newCustomerRatio: 0.65,
    repeatBookingValue: 30000,
    seasonalityFactor: 1.30,
  },
  landscaping: {
    id: 'landscaping',
    avgRevenuePerTransaction: 75,
    revenuePerTransactionRange: [35, 500],
    customerLifetimeValue: 4800,
    avgCustomerAcquisitionCost: 100,
    avgWeeklyVolume: 60,
    weeklyVolumeRange: [30, 90],
    frontDeskHourlyRate: 16,                // landscaping office admin
    blendedStaffHourlyRate: 23,             // incl. route coordinator $20, estimator $28, billing $22
    avgNoshowRate: 0.04,
    avgLeadConversionRate: 0.42,
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.12,
    newCustomerRatio: 0.35,
    repeatBookingValue: 4800,
    seasonalityFactor: 1.40,
  },

  // ── PROFESSIONAL SERVICES ─────────────────────────────────
  real_estate: {
    id: 'real_estate',
    avgRevenuePerTransaction: 11700,        // NAR 2024: median commission per side
    revenuePerTransactionRange: [5500, 25000],
    customerLifetimeValue: 30000,           // 3 transactions over 15-20 years
    avgCustomerAcquisitionCost: 1200,       // blended paid + organic
    avgWeeklyVolume: 2,
    weeklyVolumeRange: [1, 5],
    frontDeskHourlyRate: 18,                // RE admin assistant
    blendedStaffHourlyRate: 24,             // incl. transaction coordinator $24, marketing $25, CRM mgr $22
    avgNoshowRate: 0.10,
    avgLeadConversionRate: 0.015,           // 1-3.5% internet leads; 0.5-1.2% overall
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.25,         // 21x conversion drop at 5min vs 30min
    newCustomerRatio: 0.70,
    repeatBookingValue: 11700,
    seasonalityFactor: 1.25,
  },
  legal: {
    id: 'legal',
    avgRevenuePerTransaction: 8000,         // Clio: mid-range matter value
    revenuePerTransactionRange: [1500, 75000],
    customerLifetimeValue: 25000,           // business clients return for multiple matters
    avgCustomerAcquisitionCost: 3000,       // one of highest CAC industries
    avgWeeklyVolume: 5,
    weeklyVolumeRange: [3, 15],
    frontDeskHourlyRate: 18,                // law firm receptionist
    blendedStaffHourlyRate: 28,             // incl. paralegal $29, legal secretary $25, billing $30
    avgNoshowRate: 0.08,
    avgLeadConversionRate: 0.14,            // Hennessey 2024: 14% avg, 40-50% top firms
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.20,
    newCustomerRatio: 0.55,
    repeatBookingValue: 8000,
    seasonalityFactor: 1.05,
  },
  accounting: {
    id: 'accounting',
    avgRevenuePerTransaction: 5000,         // Financial Cents: ~$3,300-$5,000 per client avg
    revenuePerTransactionRange: [500, 15000],
    customerLifetimeValue: 25000,           // extremely sticky, 7-10+ year relationships
    avgCustomerAcquisitionCost: 750,
    avgWeeklyVolume: 10,
    weeklyVolumeRange: [5, 25],
    frontDeskHourlyRate: 18,                // accounting firm admin
    blendedStaffHourlyRate: 22,             // incl. bookkeeper $22, tax prep $20, client coordinator $24
    avgNoshowRate: 0.06,
    avgLeadConversionRate: 0.45,            // 30-60% inbound, 60-80% referral
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.20,                 // 80%+ revenue from existing clients
    repeatBookingValue: 5000,
    seasonalityFactor: 1.40,
  },
  insurance: {
    id: 'insurance',
    avgRevenuePerTransaction: 700,          // personal lines annual commission per household
    revenuePerTransactionRange: [300, 5000],
    customerLifetimeValue: 8000,            // $700/yr x 8-year retention at 84-90% renewal
    avgCustomerAcquisitionCost: 500,        // Focus Digital: $593 commercial avg
    avgWeeklyVolume: 8,
    weeklyVolumeRange: [3, 15],
    frontDeskHourlyRate: 18,                // insurance agency receptionist
    blendedStaffHourlyRate: 24,             // incl. licensed CSR $25, underwriting asst $23, claims $22
    avgNoshowRate: 0.06,
    avgLeadConversionRate: 0.20,            // 15-25% overall, 40-60% referral
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.25,         // 391% drop after 1 minute delay
    newCustomerRatio: 0.25,                 // 75% of revenue is renewals
    repeatBookingValue: 700,
    seasonalityFactor: 1.10,
  },
  financial: {
    id: 'financial',
    avgRevenuePerTransaction: 5000,         // $500K AUM x 1% fee
    revenuePerTransactionRange: [2500, 10500],
    customerLifetimeValue: 75000,           // 15-20 year relationships, Kitces data
    avgCustomerAcquisitionCost: 3800,       // Kitces 2023: median, 75% jump from 2021
    avgWeeklyVolume: 3,
    weeklyVolumeRange: [2, 8],
    frontDeskHourlyRate: 19,                // financial advisory admin
    blendedStaffHourlyRate: 33,             // incl. paraplanner $36, compliance $32, client service $29
    avgNoshowRate: 0.08,
    avgLeadConversionRate: 0.25,            // 20-35% overall
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.20,
    newCustomerRatio: 0.10,                 // 90% recurring AUM revenue
    repeatBookingValue: 5000,
    seasonalityFactor: 1.05,
  },
  consulting: {
    id: 'consulting',
    avgRevenuePerTransaction: 6000,         // SMB coaching: $2K-$15K; consulting $10K-$50K
    revenuePerTransactionRange: [2000, 25000],
    customerLifetimeValue: 25000,           // retainer clients drive high CLV
    avgCustomerAcquisitionCost: 410,        // HockeyStack benchmark
    avgWeeklyVolume: 4,
    weeklyVolumeRange: [2, 10],
    frontDeskHourlyRate: 19,                // consulting firm admin
    blendedStaffHourlyRate: 25,             // incl. project coordinator $28, research asst $22, billing $22
    avgNoshowRate: 0.05,
    avgLeadConversionRate: 0.30,            // 20-40% discovery call to close
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.15,
    newCustomerRatio: 0.50,
    repeatBookingValue: 12000,
    seasonalityFactor: 1.10,
  },

  // ── PROPERTY ──────────────────────────────────────────────
  property_mgmt: {
    id: 'property_mgmt',
    avgRevenuePerTransaction: 235,          // avg monthly per unit incl fees
    revenuePerTransactionRange: [150, 320],
    customerLifetimeValue: 15000,           // 3-5 year relationships, multi-unit portfolios
    avgCustomerAcquisitionCost: 400,
    avgWeeklyVolume: 8,                     // new properties/tenant interactions per week
    weeklyVolumeRange: [4, 20],
    frontDeskHourlyRate: 16,                // leasing office front desk
    blendedStaffHourlyRate: 20,             // incl. leasing agent $17, maintenance coord $18, bookkeeper $24, tenant relations $22
    avgNoshowRate: 0.08,
    avgLeadConversionRate: 0.03,            // very low — high-value leads
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.12,
    newCustomerRatio: 0.25,
    repeatBookingValue: 2400,
    seasonalityFactor: 1.10,
  },

  // ── RETAIL / ECOMMERCE ────────────────────────────────────
  ecommerce: {
    id: 'ecommerce',
    avgRevenuePerTransaction: 74,           // Triple Whale 2025 median AOV
    revenuePerTransactionRange: [45, 180],
    customerLifetimeValue: 250,             // low CLV, volume-driven
    avgCustomerAcquisitionCost: 70,         // avg across verticals
    avgWeeklyVolume: 150,                   // orders per week for SMB
    weeklyVolumeRange: [50, 400],
    frontDeskHourlyRate: 18,                // e-commerce CSR
    blendedStaffHourlyRate: 23,             // incl. CSR $19, inventory mgr $22, email marketing $28, fulfillment $22
    avgNoshowRate: 0.0,                     // n/a — cart abandonment is the metric
    avgLeadConversionRate: 0.02,            // 1.9-2% visitor-to-purchase
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.05,
    newCustomerRatio: 0.75,                 // 70-85% new customers
    repeatBookingValue: 300,
    seasonalityFactor: 1.35,
  },

  // ── CREATIVE / EVENTS ─────────────────────────────────────
  photography: {
    id: 'photography',
    avgRevenuePerTransaction: 2900,         // national avg wedding photography
    revenuePerTransactionRange: [300, 6000],
    customerLifetimeValue: 3500,
    avgCustomerAcquisitionCost: 150,        // referrals dominate (61% of bookings)
    avgWeeklyVolume: 3,
    weeklyVolumeRange: [1, 8],
    frontDeskHourlyRate: 16,                // studio assistant
    blendedStaffHourlyRate: 21,             // incl. client coordinator $22, editing asst $25, marketing $21
    avgNoshowRate: 0.05,
    avgLeadConversionRate: 0.30,            // 20-40% inquiry-to-booking
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.20,         // speed wins bookings in this industry
    newCustomerRatio: 0.65,
    repeatBookingValue: 2000,
    seasonalityFactor: 1.35,
  },
  event: {
    id: 'event',
    avgRevenuePerTransaction: 4500,         // blended wedding + corporate + private
    revenuePerTransactionRange: [800, 15000],
    customerLifetimeValue: 10000,           // corporate clients repeat monthly
    avgCustomerAcquisitionCost: 200,
    avgWeeklyVolume: 2,
    weeklyVolumeRange: [1, 5],
    frontDeskHourlyRate: 17,                // event planning admin
    blendedStaffHourlyRate: 28,             // incl. event coordinator $29, vendor mgr $35, billing $24
    avgNoshowRate: 0.03,
    avgLeadConversionRate: 0.30,            // 20-40% inquiry-to-booked
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.15,
    newCustomerRatio: 0.60,
    repeatBookingValue: 5000,
    seasonalityFactor: 1.40,
  },
  marketing_agency: {
    id: 'marketing_agency',
    avgRevenuePerTransaction: 3000,         // avg monthly retainer
    revenuePerTransactionRange: [1500, 6000],
    customerLifetimeValue: 168000,          // 56-month avg relationship at $3K/mo
    avgCustomerAcquisitionCost: 500,
    avgWeeklyVolume: 4,
    weeklyVolumeRange: [2, 8],
    frontDeskHourlyRate: 19,                // agency admin
    blendedStaffHourlyRate: 29,             // incl. project mgr $38, account coordinator $28, marketing $26, billing $24
    avgNoshowRate: 0.04,
    avgLeadConversionRate: 0.25,            // inbound qualified lead to client
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.12,
    newCustomerRatio: 0.30,
    repeatBookingValue: 36000,
    seasonalityFactor: 1.10,
  },

  // ── CHILDCARE / PET / FUNERAL ─────────────────────────────
  daycare: {
    id: 'daycare',
    avgRevenuePerTransaction: 320,          // Care.com 2025: $332/wk national avg
    revenuePerTransactionRange: [250, 400],
    customerLifetimeValue: 14000,           // 14-18 month avg enrollment at $320/wk
    avgCustomerAcquisitionCost: 150,        // referral-driven, 60%+ from word of mouth
    avgWeeklyVolume: 40,                    // enrolled children, small-medium center
    weeklyVolumeRange: [20, 75],
    frontDeskHourlyRate: 14,                // daycare front desk
    blendedStaffHourlyRate: 18,             // incl. enrollment coordinator $18, billing/compliance $22, parent comms $16
    avgNoshowRate: 0.05,                    // contract model — churn is bigger KPI
    avgLeadConversionRate: 0.35,            // high intent — parents touring are serious
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.10,
    newCustomerRatio: 0.30,
    repeatBookingValue: 16640,              // $320/wk x 52
    seasonalityFactor: 1.15,
  },
  pet: {
    id: 'pet',
    avgRevenuePerTransaction: 85,           // blended groom + boarding avg ticket
    revenuePerTransactionRange: [40, 135],
    customerLifetimeValue: 1350,            // $75/visit x 6/yr x 3 years
    avgCustomerAcquisitionCost: 65,         // referral-heavy, low paid CAC
    avgWeeklyVolume: 60,                    // 2-3 groomer salon
    weeklyVolumeRange: [35, 90],
    frontDeskHourlyRate: 14,                // pet facility front desk
    blendedStaffHourlyRate: 18,             // incl. grooming coordinator $18, billing $20, kennel mgr $18
    avgNoshowRate: 0.10,                    // 5-15% range
    avgLeadConversionRate: 0.50,            // high-intent local search
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.08,
    newCustomerRatio: 0.25,
    repeatBookingValue: 450,                // $75 x 6 visits/yr
    seasonalityFactor: 1.20,
  },
  funeral: {
    id: 'funeral',
    avgRevenuePerTransaction: 5200,         // blended burial + cremation at 62% cremation rate
    revenuePerTransactionRange: [1500, 12000],
    customerLifetimeValue: 9000,            // family relationship model, 2-4 cases over decades
    avgCustomerAcquisitionCost: 220,        // industry target per FinancialModelsLab
    avgWeeklyVolume: 2,                     // NFDA avg: 113 cases/yr = ~2.2/wk
    weeklyVolumeRange: [1, 4],
    frontDeskHourlyRate: 18,                // funeral home receptionist
    blendedStaffHourlyRate: 23,             // incl. arrangement coordinator $24, billing $21, aftercare $25
    avgNoshowRate: 0.03,                    // rare — manifests as service downgrades
    avgLeadConversionRate: 0.70,            // at-need = very high conversion
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.30,         // highest urgency of any industry
    newCustomerRatio: 0.35,                 // 65% from prior families/referrals
    repeatBookingValue: 0,
    seasonalityFactor: 1.05,
  },

  // ── FALLBACK ──────────────────────────────────────────────
  other: {
    id: 'other',
    avgRevenuePerTransaction: 250,          // Ruler Analytics composite midpoint
    revenuePerTransactionRange: [75, 800],
    customerLifetimeValue: 1500,            // Genesys Growth composite
    avgCustomerAcquisitionCost: 200,
    avgWeeklyVolume: 40,
    weeklyVolumeRange: [15, 100],
    frontDeskHourlyRate: 17,                // generic SMB receptionist
    blendedStaffHourlyRate: 22,             // weighted SMB average across automatable roles
    avgNoshowRate: 0.12,                    // general SMB: 5-25% range
    avgLeadConversionRate: 0.10,            // Ruler Analytics 2025: 2.7% avg across all
    avgMissedCallLeadLoss: 0.85,
    avgResponseTimeLeadDecay: 0.12,
    newCustomerRatio: 0.40,
    repeatBookingValue: 2400,
    seasonalityFactor: 1.15,
  },
};

// Revenue tier multipliers — adjusts volume/cost based on business size
export const REVENUE_MULTIPLIERS: Record<string, number> = {
  startup: 0.5,     // under $100K — below industry average volume
  growing: 0.8,     // $100-500K — approaching average
  established: 1.0, // $500K-$1M — industry average
  scaling: 1.5,     // $1-5M — above average
  mature: 2.5,      // $5M+ — well above average
};

// Team size multipliers — affects admin labor costs
export const TEAM_ADMIN_HOURS: Record<string, number> = {
  solo: 15,          // owner wears all hats, ~15h/week on admin
  small: 30,         // 2-5 people, shared admin
  medium: 60,        // 6-20 people, dedicated admin staff
  large: 100,        // 21-50, admin team
  enterprise: 160,   // 50+, full admin department
};
