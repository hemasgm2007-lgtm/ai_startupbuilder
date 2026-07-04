import type { ActivityItem, AdminMetrics, AppNotification, User } from '../types';

// ---------------------------------------------------------------------------
// Static mock data for landing page, dashboard, and admin views.
// ---------------------------------------------------------------------------

export const LANDING_FEATURES = [
  {
    icon: 'Sparkles',
    title: 'AI-Powered Generation',
    description: 'Turn a single idea into a complete, structured business plan in minutes — not weeks.',
  },
  {
    icon: 'LayoutDashboard',
    title: '14 Business Modules',
    description: 'Executive summary, financials, pitch deck, branding, and more — all interconnected.',
  },
  {
    icon: 'LineChart',
    title: 'Interactive Financials',
    description: 'Auto-generated revenue, expense, and profit projections with beautiful, editable charts.',
  },
  {
    icon: 'Presentation',
    title: 'Investor Pitch Decks',
    description: 'Generate a 10-slide pitch deck ready to present, with one-click export options.',
  },
  {
    icon: 'Users',
    title: 'Customer Personas',
    description: 'AI-crafted buyer personas with goals, challenges, and buying behavior insights.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Risk Analysis',
    description: 'Identify business, market, technical, and legal risks with AI-recommended mitigations.',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder, Lumen Health',
    avatar: 'https://i.pravatar.cc/150?img=47',
    quote: 'AI Startup Builder took me from a vague idea to an investor-ready plan in an afternoon. I closed my pre-seed round two weeks later.',
  },
  {
    name: 'David Okafor',
    role: 'CEO, AgriSense',
    avatar: 'https://i.pravatar.cc/150?img=15',
    quote: 'The financial forecasting alone is worth it. I finally have projections I can show investors without spending weeks in a spreadsheet.',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Co-founder, LearnLoop',
    avatar: 'https://i.pravatar.cc/150?img=32',
    quote: 'As a non-technical founder, the wizard made me feel like I had a whole strategy team. The pitch deck generator is genuinely impressive.',
  },
  {
    name: 'Elena Rossi',
    role: 'Product Lead, FinEdge',
    avatar: 'https://i.pravatar.cc/150?img=20',
    quote: 'We used it to validate three ideas in a weekend. The competitor analysis and SWOT saved us from a bad pivot. Essential for any early-stage team.',
  },
];

export const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'For founders exploring their first idea.',
    features: [
      '3 AI generations per month',
      '5 business modules',
      'PDF export',
      'Community support',
      '1 user',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'For serious founders building a real startup.',
    features: [
      'Unlimited AI generations',
      'All 14 business modules',
      'PDF, PowerPoint & Word export',
      'Pitch deck generator',
      'AI chat assistant',
      'Priority support',
      '3 users included',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For teams and organizations at scale.',
    features: [
      'Everything in Pro',
      'Unlimited users',
      'Custom AI model fine-tuning',
      'SSO & advanced security',
      'Dedicated success manager',
      'API access',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How does the AI generate my business plan?',
    answer: 'Our AI analyzes your idea, industry, target audience, and other inputs from the 7-step wizard, then generates each of the 14 business modules using a combination of large language models and structured templates tuned for startup planning.',
  },
  {
    question: 'Can I edit the generated content?',
    answer: 'Absolutely. Every section is fully editable. You can regenerate any module with a single click, or manually refine the content to match your voice and strategy.',
  },
  {
    question: 'What export formats are supported?',
    answer: 'Pro and Enterprise plans support PDF, PowerPoint, and Word document exports. Each export preserves the structure and formatting of your business plan.',
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Yes. All data is encrypted in transit and at rest. Enterprise plans include SSO, advanced access controls, and the option for data residency in specific regions.',
  },
  {
    question: 'Can I cancel or change my plan anytime?',
    answer: 'Yes, you can upgrade, downgrade, or cancel at any time from your dashboard. Changes take effect at the next billing cycle, and we offer prorated refunds for annual plans.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support and we\'ll refund your purchase, no questions asked.',
  },
  {
    question: 'Can I use this for an existing business, not just a startup?',
    answer: 'Yes. While the platform is optimized for new ventures, many users run existing businesses through the wizard to generate fresh strategic plans, pivot analysis, or investor materials.',
  },
];

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', type: 'create', description: 'Created startup project "Lumen Health"', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'a2', type: 'generate', description: 'Generated Financial Forecast module', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'a3', type: 'export', description: 'Exported business plan as PDF', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'a4', type: 'generate', description: 'Generated Pitch Deck slides', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'a5', type: 'update', description: 'Updated profile settings', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'a6', type: 'login', description: 'Signed in to dashboard', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
];

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Pitch deck ready', message: 'Your pitch deck for "Lumen Health" has been generated and is ready to review.', read: false, type: 'success' },
  { id: 'n2', title: 'New feature available', message: 'AI Chat Assistant is now live. Ask questions about your startup anytime.', read: false, type: 'info' },
  { id: 'n3', title: 'Usage at 80%', message: 'You\'ve used 80% of your monthly AI generation quota. Consider upgrading to Pro.', read: false, type: 'warning' },
  { id: 'n4', title: 'Export complete', message: 'Your PDF export is ready for download.', read: true, type: 'success' },
];

export const SAMPLE_USER: User = {
  id: 'u1',
  name: 'Alex Morgan',
  email: 'alex@lumenhealth.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=33',
  role: 'admin',
  subscription: 'pro',
  bio: 'Building the future of healthcare. Founder of Lumen Health.',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
};

export const SAMPLE_PROJECTS = [
  {
    id: 'proj1',
    name: 'Lumen Health',
    industry: 'Healthcare',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'published' as const,
    wizardData: {
      startupName: 'Lumen Health',
      idea: 'AI-powered remote patient monitoring for chronic conditions.',
      industry: 'Healthcare' as const,
      targetAudience: 'Health systems and value-based care providers',
      budget: 250000,
      country: 'United States',
      businessModels: ['SaaS', 'B2B'],
    },
  },
  {
    id: 'proj2',
    name: 'AgriSense',
    industry: 'Agriculture',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: 'draft' as const,
    wizardData: {
      startupName: 'AgriSense',
      idea: 'IoT sensors and AI for precision irrigation.',
      industry: 'Agriculture' as const,
      targetAudience: 'Mid-size row crop farmers',
      budget: 75000,
      country: 'Australia',
      businessModels: ['SaaS', 'Subscription'],
    },
  },
  {
    id: 'proj3',
    name: 'LearnLoop',
    industry: 'Education',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    status: 'published' as const,
    wizardData: {
      startupName: 'LearnLoop',
      idea: 'AI tutoring that adapts to each student\'s learning style.',
      industry: 'Education' as const,
      targetAudience: 'K-12 schools and parents',
      budget: 50000,
      country: 'Canada',
      businessModels: ['B2C', 'Subscription'],
    },
  },
];

export const ADMIN_METRICS: AdminMetrics = {
  totalUsers: 12480,
  activeUsers: 4320,
  totalAiRequests: 89500,
  mrr: [
    { month: 'Jan', value: 18000 },
    { month: 'Feb', value: 24000 },
    { month: 'Mar', value: 31000 },
    { month: 'Apr', value: 38000 },
    { month: 'May', value: 47000 },
    { month: 'Jun', value: 56000 },
    { month: 'Jul', value: 68000 },
    { month: 'Aug', value: 79000 },
    { month: 'Sep', value: 92000 },
    { month: 'Oct', value: 108000 },
    { month: 'Nov', value: 124000 },
    { month: 'Dec', value: 142000 },
  ],
  subscriptionBreakdown: [
    { name: 'Free', value: 8200, color: '#94a3b8' },
    { name: 'Pro', value: 3600, color: '#6366f1' },
    { name: 'Enterprise', value: 680, color: '#3b82f6' },
  ],
  recentSignups: [
    { id: 's1', name: 'Jordan Lee', email: 'jordan@finch.io', date: '2026-07-03', tier: 'pro' },
    { id: 's2', name: 'Maya Patel', email: 'maya@brightlabs.com', date: '2026-07-03', tier: 'free' },
    { id: 's3', name: 'Tom Becker', email: 'tom@securenet.co', date: '2026-07-02', tier: 'enterprise' },
    { id: 's4', name: 'Lina Garcia', email: 'lina@shopwise.app', date: '2026-07-02', tier: 'pro' },
    { id: 's5', name: 'Kenji Watanabe', email: 'kenji@edupath.jp', date: '2026-07-01', tier: 'free' },
    { id: 's6', name: 'Aisha Khan', email: 'aisha@agritech.pk', date: '2026-07-01', tier: 'pro' },
    { id: 's7', name: 'Carlos Mendes', email: 'carlos@fintechbr.com', date: '2026-06-30', tier: 'free' },
  ],
};
