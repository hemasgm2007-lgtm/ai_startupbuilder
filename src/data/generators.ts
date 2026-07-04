import type {
  Branding,
  BusinessModelSection,
  Competitor,
  ExecutiveSummary,
  FeatureSuggestions,
  FinancialForecast,
  InvestorPitch,
  MarketResearch,
  MarketingStrategy,
  NameSuggestion,
  Persona,
  PitchSlide,
  RiskAnalysis,
  RoadmapPhase,
  SwotAnalysis,
  WizardData,
} from '../types';

// ---------------------------------------------------------------------------
// Mock AI generation engine.
//
// Every function below takes the wizard inputs and returns realistic,
// deterministic-ish content. When a real AI API is wired in, these functions
// are the only thing that needs to change — the component layer consumes the
// typed return values and never touches the generation logic directly.
// ---------------------------------------------------------------------------

const AVATAR_SEED = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=33',
  'https://i.pravatar.cc/150?img=45',
  'https://i.pravatar.cc/150?img=51',
  'https://i.pravatar.cc/150?img=68',
];

function industryContext(industry: string): { trends: string[]; painPoints: string[]; size: string } {
  const map: Record<string, { trends: string[]; painPoints: string[]; size: string }> = {
    AI: {
      trends: [
        'Generative AI adoption doubling year-over-year',
        'Shift from model training to applied AI tooling',
        'Rising demand for domain-specific fine-tuned models',
        'Regulatory scrutiny increasing around AI safety',
      ],
      painPoints: [
        'High cost of compute for training and inference',
        'Shortage of ML talent in vertical domains',
        'Data privacy and governance concerns',
        'Difficulty proving ROI on AI investments',
      ],
      size: '$142B TAM',
    },
    Healthcare: {
      trends: [
        'Telehealth utilization stabilizing above pre-2020 levels',
        'Value-based care models expanding',
        'Wearables and remote monitoring going mainstream',
        'Interoperability mandates driving data exchange',
      ],
      painPoints: [
        'Fragmented patient data across providers',
        'Administrative burden eating clinician time',
        'Slow regulatory approval cycles',
        'Rising patient cost responsibility',
      ],
      size: '$4.3T TAM',
    },
    Cybersecurity: {
      trends: [
        'Zero-trust architecture becoming the default',
        'AI-driven threat detection on the rise',
        'Supply-chain attacks dominating headlines',
        'Cyber insurance market hardening',
      ],
      painPoints: [
        'Alert fatigue overwhelming SOC teams',
        'Legacy systems with unpatchable vulnerabilities',
        'Skills gap in cloud security',
        'Compliance overhead across multiple frameworks',
      ],
      size: '$202B TAM',
    },
    Education: {
      trends: [
        'Hybrid learning becoming permanent',
        'Micro-credentials gaining employer recognition',
        'AI tutoring personalizing learning paths',
        'Lifetime learning models replacing degrees',
      ],
      painPoints: [
        'Student engagement dropping in remote settings',
        'Outdated curriculum lagging industry needs',
        'Cost barriers for non-traditional learners',
        'Teacher burnout at record highs',
      ],
      size: '$370B TAM',
    },
    Finance: {
      trends: [
        'Embedded finance expanding into non-financial apps',
        'Real-time payments becoming standard',
        'Open banking unlocking new product categories',
        'Institutional adoption of digital assets',
      ],
      painPoints: [
        'Legacy core banking systems blocking innovation',
        'Regulatory complexity across jurisdictions',
        'Underbanked populations still underserved',
        'Fraud evolving faster than detection',
      ],
      size: '$1.5T TAM',
    },
    Agriculture: {
      trends: [
        'Precision agriculture driven by IoT and drones',
        'Climate-smart farming incentives expanding',
        'Vertical farming gaining urban traction',
        'Carbon credit markets maturing',
      ],
      painPoints: [
        'Unpredictable weather from climate change',
        'Rising input costs for fertilizer and fuel',
        'Labor shortages in rural areas',
        'Thin margins limiting technology investment',
      ],
      size: '$680B TAM',
    },
    'E-commerce': {
      trends: [
        'Social commerce shortening the path to purchase',
        'Headless commerce enabling custom experiences',
        'Sustainability becoming a purchase driver',
        'AI personalization lifting conversion rates',
      ],
      painPoints: [
        'Customer acquisition costs rising',
        'Cart abandonment above 70% industry-wide',
        'Returns logistics eroding margins',
        'Inventory forecasting inaccuracy',
      ],
      size: '$6.3T TAM',
    },
  };
  return map[industry] ?? map.AI;
}

export function generateExecutiveSummary(data: WizardData): ExecutiveSummary {
  const name = data.startupName || 'Your Startup';
  return {
    overview: `${name} is a ${data.industry || 'technology'} company that ${data.idea || 'addresses a critical gap in the market'}. By combining a modern product experience with a focused go-to-market strategy, ${name} is positioned to capture meaningful share in a growing segment. The company targets ${data.targetAudience || 'forward-thinking customers'} and operates with a ${data.businessModels.join(', ') || 'subscription'} business model optimized for recurring revenue.`,
    mission: `To empower ${data.targetAudience || 'our customers'} by delivering a ${data.industry || 'technology'} solution that removes friction and unlocks measurable outcomes.`,
    vision: `To become the most trusted ${data.industry || 'technology'} platform in ${data.country || 'the world'}, recognized for innovation, reliability, and customer impact.`,
    valueProposition: `${name} uniquely combines deep ${data.industry || 'industry'} expertise with an intuitive product experience, delivering results in a fraction of the time and cost of legacy alternatives.`,
  };
}

export function generateBusinessModel(data: WizardData): BusinessModelSection {
  const models = data.businessModels.length ? data.businessModels : ['SaaS'];
  return {
    revenueModel: `${data.startupName || 'The company'} operates a ${models.join(' + ')} revenue model. Primary revenue comes from tiered subscription plans with annual billing discounts. Additional revenue streams include usage-based overages, premium add-ons, and a partner marketplace take-rate.`,
    pricingStrategy: `Pricing follows a value-based model with three tiers: Starter ($29/mo) for individuals, Pro ($99/mo) for growing teams, and Enterprise (custom) for organizations needing SSO, advanced security, and dedicated support. A 14-day free trial reduces activation friction, and annual plans offer a 20% discount to improve retention and cash flow.`,
    growthStrategy: `Growth is driven by a product-led motion with a viral referral loop, content-led SEO capturing high-intent search traffic, and a targeted outbound motion for enterprise accounts. Strategic partnerships with ${data.industry || 'industry'} platforms expand distribution, while a community program builds advocacy and reduces CAC over time.`,
  };
}

export function generateMarketResearch(data: WizardData): MarketResearch {
  const ctx = industryContext(data.industry || 'AI');
  return {
    marketSize: ctx.size,
    industryTrends: ctx.trends,
    customerPainPoints: ctx.painPoints,
    opportunities: [
      `Underserved ${data.targetAudience ? 'segment within ' + data.targetAudience : 'mid-market segment'} with no purpose-built solution`,
      'First-mover advantage in combining AI with vertical workflows',
      'Regulatory tailwinds favoring modern, compliant platforms',
      'Growing willingness to pay for outcomes over features',
    ],
  };
}

export function generateCompetitors(data: WizardData): Competitor[] {
  const industry = data.industry || 'AI';
  return [
    {
      name: 'MarketLeader Inc.',
      strengths: 'Strong brand recognition, large enterprise customer base, deep integrations ecosystem.',
      weaknesses: 'Legacy UI, slow release cadence, high pricing with opaque contracts.',
      opportunity: 'Win on UX and transparent pricing for mid-market buyers frustrated by complexity.',
    },
    {
      name: 'FastMover Labs',
      strengths: 'Modern product, strong viral growth, active community.',
      weaknesses: 'Limited enterprise features, no SOC 2 compliance, thin support team.',
      opportunity: 'Target enterprise-ready buyers who need security and compliance from day one.',
    },
    {
      name: 'VerticalCo',
      strengths: 'Deep domain expertise in ' + industry + ', strong customer relationships.',
      weaknesses: 'Narrow product scope, limited API, manual onboarding.',
      opportunity: 'Offer a broader platform with automation that replaces manual workflows.',
    },
    {
      name: 'OpenSource Alt',
      strengths: 'Free, extensible, large contributor base.',
      weaknesses: 'No managed hosting, requires technical staff, inconsistent UX.',
      opportunity: 'Provide a managed, polished experience for teams that lack engineering bandwidth.',
    },
  ];
}

export function generateSwot(data: WizardData): SwotAnalysis {
  return {
    strengths: {
      title: 'Strengths',
      items: [
        'AI-native architecture enabling rapid iteration',
        'Focused team with deep ' + (data.industry || 'industry') + ' expertise',
        'Lean cost structure with strong unit economics',
        'Differentiated UX reducing time-to-value',
      ],
    },
    weaknesses: {
      title: 'Weaknesses',
      items: [
        'Limited brand awareness in early stage',
        'Dependency on third-party AI model providers',
        'Small sales team constraining outbound capacity',
        'Narrow geographic footprint initially',
      ],
    },
    opportunities: {
      title: 'Opportunities',
      items: [
        'Expanding ' + (data.industry || 'industry') + ' market with growing budgets',
        'Strategic partnerships with complementary platforms',
        'Upsell motion into enterprise tiers',
        'International expansion in year two',
      ],
    },
    threats: {
      title: 'Threats',
      items: [
        'Well-funded incumbents launching competing AI features',
        'Rapid shifts in underlying AI model economics',
        'Regulatory changes increasing compliance cost',
        'Macroeconomic pressure slowing enterprise purchasing',
      ],
    },
  };
}

export function generatePersonas(data: WizardData): Persona[] {
  const audience = data.targetAudience || 'professionals';
  return [
    {
      id: 'p1',
      name: 'Alex Chen',
      avatarUrl: AVATAR_SEED[0],
      age: 32,
      profession: `Product Manager at a mid-size ${data.industry || 'tech'} company`,
      goals: [
        'Ship features faster without sacrificing quality',
        'Demonstrate measurable ROI to leadership',
        'Reduce time spent on manual reporting',
      ],
      challenges: [
        'Tools are fragmented and don\'t integrate',
        'Budget approval cycles are slow',
        'Limited engineering bandwidth for custom work',
      ],
      buyingBehavior: `Researches thoroughly, prefers free trials, influenced by peer reviews and case studies from ${audience}.`,
    },
    {
      id: 'p2',
      name: 'Priya Sharma',
      avatarUrl: AVATAR_SEED[1],
      age: 41,
      profession: `VP of Operations at an enterprise ${data.industry || 'technology'} firm`,
      goals: [
        'Standardize tooling across teams',
        'Improve security and compliance posture',
        'Drive operational efficiency at scale',
      ],
      challenges: [
        'Legacy systems are hard to replace',
        'Stakeholder alignment takes months',
        'Vendor lock-in concerns',
      ],
      buyingBehavior: 'Long evaluation cycles, requires security review, values dedicated support and SLAs.',
    },
    {
      id: 'p3',
      name: 'Marcus Johnson',
      avatarUrl: AVATAR_SEED[2],
      age: 27,
      profession: `Founder of an early-stage ${data.industry || 'startup'}`,
      goals: [
        'Get to market quickly with limited resources',
        'Validate product-market fit',
        'Keep burn rate low',
      ],
      challenges: [
        'Limited budget for premium tools',
        'Wearing many hats, little time for evaluation',
        'Needs solutions that scale with growth',
      ],
      buyingBehavior: 'Self-serve preference, price-sensitive, highly influenced by onboarding experience and community.',
    },
  ];
}

export function generateRoadmap(_data: WizardData): RoadmapPhase[] {
  return [
    {
      phase: 1,
      title: 'MVP',
      timeline: 'Months 1–3',
      features: [
        'Core onboarding flow',
        'Primary AI generation engine',
        'User accounts and project storage',
        'Basic export (PDF)',
      ],
      deliverables: ['Public beta launch', 'First 100 paying customers', 'Initial analytics pipeline'],
    },
    {
      phase: 2,
      title: 'Growth',
      timeline: 'Months 4–6',
      features: [
        'Team collaboration and sharing',
        'Advanced AI modules (pitch deck, branding)',
        'Integrations marketplace',
        'Mobile-responsive dashboard',
      ],
      deliverables: ['1,000 active users', 'SOC 2 Type I readiness', 'Self-serve onboarding live'],
    },
    {
      phase: 3,
      title: 'Scale',
      timeline: 'Months 7–9',
      features: [
        'Enterprise SSO and RBAC',
        'Custom AI model fine-tuning',
        'API for third-party developers',
        'Advanced analytics and reporting',
      ],
      deliverables: ['$100K MRR', 'First 10 enterprise accounts', 'International availability'],
    },
    {
      phase: 4,
      title: 'Expand',
      timeline: 'Months 10–12',
      features: [
        'Industry-specific template packs',
        'White-label and OEM offering',
        'AI chat assistant with memory',
        'Marketplace for community templates',
      ],
      deliverables: ['$500K MRR', 'Series A readiness', 'Partner program with 25 integrations'],
    },
  ];
}

export function generateFeatureSuggestions(_data: WizardData): FeatureSuggestions {
  return {
    mustHave: [
      { name: 'AI Business Plan Generator', description: 'One-click generation of a complete business plan from a single idea prompt.' },
      { name: 'Project Dashboard', description: 'Centralized view of all generated plans with edit and export options.' },
      { name: 'Export to PDF', description: 'Professional PDF export of any generated module for sharing with stakeholders.' },
      { name: 'User Authentication', description: 'Secure email/password auth with persistent project storage.' },
    ],
    niceToHave: [
      { name: 'Collaboration Mode', description: 'Real-time co-editing of business plans with team members and comments.' },
      { name: 'Pitch Deck Builder', description: 'Drag-and-drop slide builder with AI-suggested content per slide.' },
      { name: 'Custom Branding Kit', description: 'AI-generated logo concepts, color palettes, and typography pairings.' },
      { name: 'Investor CRM', description: 'Track investor conversations and share secure data rooms.' },
    ],
    future: [
      { name: 'AI Chat Assistant with Memory', description: 'Context-aware assistant that remembers your startup and prior conversations.' },
      { name: 'Live Market Data Integration', description: 'Pull real-time market sizing and competitor data from third-party sources.' },
      { name: 'Funding Matchmaking', description: 'Match startups with investors based on stage, sector, and traction.' },
      { name: 'Mobile Apps', description: 'Native iOS and Android apps for on-the-go plan editing and review.' },
    ],
  };
}

export function generateMarketingStrategy(_data: WizardData): MarketingStrategy {
  return {
    seo: [
      'Target long-tail keywords like "AI business plan generator" and "startup plan template"',
      'Publish 4 pillar articles per month on ' + (_data.industry || 'industry') + ' startup playbooks',
      'Build a programmatic SEO library of industry-specific plan templates',
      'Earn backlinks through free tools and a startup resources hub',
    ],
    socialMedia: [
      { platform: 'LinkedIn', tactics: 'Founder-led content, carousel posts on startup frameworks, and customer story features.' },
      { platform: 'X (Twitter)', tactics: 'Daily build-in-public threads and engagement with the startup community.' },
      { platform: 'YouTube', tactics: 'Long-form tutorials and interviews with founders who used the platform.' },
      { platform: 'TikTok', tactics: 'Short tips on startup fundamentals and behind-the-scenes product development.' },
    ],
    emailMarketing: 'Weekly newsletter with one actionable startup tip and a product highlight. Onboarding sequence of 5 emails over 14 days driving activation. Monthly product update email to active users.',
    contentStrategy: 'Mix of long-form guides (monthly), case studies (bi-weekly), comparison pages (ongoing), and a free template library updated weekly. Aim for 8 pieces per month across the funnel.',
    influencerMarketing: 'Partner with 6–8 startup-focused creators on YouTube and LinkedIn for sponsored deep-dive reviews. Affiliate program offering 30% recurring commission to drive word-of-mouth.',
    paidAdvertising: [
      { channel: 'Google Search Ads', budget: '$8K/mo' },
      { channel: 'LinkedIn Ads', budget: '$5K/mo' },
      { channel: 'Meta (Instagram/Facebook)', budget: '$3K/mo' },
      { channel: 'Retargeting', budget: '$2K/mo' },
    ],
  };
}

export function generateFinancialForecast(_data: WizardData): FinancialForecast {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let revenue = 5000;
  let expenses = 12000;
  const monthly = months.map((m, i) => {
    revenue = Math.round(revenue * (1.18 + (i % 3) * 0.04));
    expenses = Math.round(expenses * (1.08 + (i % 4) * 0.02));
    return { month: m, revenue, expenses, profit: revenue - expenses };
  });
  return {
    monthly,
    expenses: [
      { name: 'Engineering', value: 45000, color: '#6366f1' },
      { name: 'Marketing', value: 22000, color: '#3b82f6' },
      { name: 'Operations', value: 15000, color: '#06b6d4' },
      { name: 'G&A', value: 10000, color: '#8b5cf6' },
      { name: 'Infrastructure', value: 8000, color: '#ec4899' },
    ],
    breakEvenMonth: 'Month 9',
  };
}

export function generateRiskAnalysis(data: WizardData): RiskAnalysis {
  return {
    business: [
      { risk: 'Key-person dependency on founding team', mitigation: 'Document processes, hire second-layer leadership by month 6, and maintain a knowledge base.' },
      { risk: 'Cash runway shorter than planned', mitigation: 'Maintain 18-month runway buffer, secure bridge financing, and tie hiring to revenue milestones.' },
      { risk: 'Customer concentration in early accounts', mitigation: 'Diversify pipeline across segments and cap any single customer at 15% of revenue.' },
      { risk: 'Pricing pressure from competitors', mitigation: 'Compete on differentiated outcomes, bundle value, and avoid race-to-the-bottom discounting.' },
    ],
    market: [
      { risk: 'Market slowdown reducing enterprise budgets', mitigation: 'Offer a self-serve tier to capture smaller budgets and emphasize ROI in messaging.' },
      { risk: 'New entrant with aggressive funding', mitigation: 'Accelerate roadmap, lock in key partnerships, and build switching costs via integrations.' },
      { risk: 'Regulatory changes in ' + (data.industry || 'the industry'), mitigation: 'Engage compliance counsel early and design for configurable data residency.' },
      { risk: 'Customer preferences shifting to bundled suites', mitigation: 'Pursue strategic integrations and an open marketplace to remain the system of record.' },
    ],
    technical: [
      { risk: 'Dependency on third-party AI model providers', mitigation: 'Abstract the model layer, maintain multi-provider support, and fine-tune open models as a fallback.' },
      { risk: 'Scaling issues at high traffic', mitigation: 'Architect for horizontal scaling from day one and load-test before each major release.' },
      { risk: 'Security vulnerability in dependencies', mitigation: 'Automated dependency scanning, a responsible disclosure program, and rapid patch SLAs.' },
      { risk: 'Data loss or corruption', mitigation: 'Automated daily backups, point-in-time recovery, and multi-region replication for enterprise tier.' },
    ],
    legal: [
      { risk: 'GDPR / CCPA non-compliance', mitigation: 'Privacy-by-design architecture, DPO appointment, and regular data protection assessments.' },
      { risk: 'IP infringement claims on AI output', mitigation: 'License training data carefully, add indemnification clauses, and monitor output for similarity.' },
      { risk: 'Customer contract disputes', mitigation: 'Standardized MSA with clear SLAs, legal review of all redlines, and automated contract tracking.' },
      { risk: 'Employment misclassification risk', mitigation: 'Clear contractor agreements, jurisdiction-specific review, and payroll compliance audits.' },
    ],
    recommendations: [
      'Prioritize SOC 2 Type II in year one to unlock enterprise deals.',
      'Invest in a self-serve onboarding flow to reduce CAC and support load.',
      'Build a partner program early to compound distribution.',
      'Reserve 15% of budget for opportunistic growth experiments.',
    ],
  };
}

export function generateInvestorPitch(data: WizardData): InvestorPitch {
  const name = data.startupName || 'Your Startup';
  return {
    elevatorPitch: `${name} is the AI-powered platform that helps founders turn a single idea into a complete, investor-ready business plan in minutes — replacing weeks of manual work with a delightful, guided experience.`,
    problem: 'Founders spend weeks assembling business plans, pitch decks, and financial models using fragmented tools. Most never finish, and those who do produce inconsistent, low-quality output that fails to impress investors.',
    solution: `${name} uses AI to generate a complete, structured business plan — executive summary, market research, financials, pitch deck, and more — from a single idea prompt, all editable and exportable in one place.`,
    marketOpportunity: `The global ${data.industry || 'technology'} market represents a ${industryContext(data.industry || 'AI').size} opportunity, with millions of new businesses formed each year and growing demand for AI-assisted tools.`,
    businessModel: 'Tiered SaaS subscriptions ($29–$99/mo) with an enterprise tier, plus usage-based overages and a partner marketplace take-rate. Gross margins above 80%.',
    traction: '1,200+ active users, $18K MRR growing 22% MoM, 14% trial-to-paid conversion, and 62% net revenue retention in the first six months.',
    financialHighlights: 'Projected $500K MRR by month 12, break-even by month 9, and a 3-year revenue target of $8M ARR with 85% gross margins.',
    fundingRequirement: 'Raising $1.5M seed to scale engineering, launch enterprise features, and grow marketing. 18-month runway with a clear path to Series A.',
  };
}

export function generatePitchSlides(data: WizardData): PitchSlide[] {
  const name = data.startupName || 'Your Startup';
  return [
    { id: 1, type: 'cover', title: name, content: `${data.idea || 'Your tagline here'}  ·  ${new Date().getFullYear()}` },
    { id: 2, type: 'problem', title: 'The Problem', content: 'Founders waste weeks on business plans using fragmented tools, producing inconsistent output that fails to impress investors.' },
    { id: 3, type: 'solution', title: 'The Solution', content: `${name} turns a single idea into a complete, investor-ready business plan in minutes with AI-guided generation.` },
    { id: 4, type: 'product', title: 'Product', content: 'A 7-step wizard, 14 AI-generated modules, interactive financials, a pitch deck builder, and one-click export.' },
    { id: 5, type: 'market', title: 'Market Opportunity', content: `${industryContext(data.industry || 'AI').size} addressable market with millions of new businesses formed annually.` },
    { id: 6, type: 'competition', title: 'Competitive Landscape', content: 'Unlike legacy tools, we combine AI generation, a guided wizard, and investor-ready output in one platform.' },
    { id: 7, type: 'revenue', title: 'Revenue Model', content: 'Tiered SaaS ($29–$99/mo) + enterprise + usage overages. 80%+ gross margins.' },
    { id: 8, type: 'gtm', title: 'Go-to-Market', content: 'Product-led growth with content SEO, founder-led social, and a targeted enterprise outbound motion.' },
    { id: 9, type: 'team', title: 'Team', content: 'Experienced founders with backgrounds in AI, product, and ' + (data.industry || 'industry') + '. Advisors from top-tier firms.' },
    { id: 10, type: 'ask', title: 'Investment Ask', content: 'Raising $1.5M seed for 18 months of runway. Targeting Series A at $500K MRR.' },
  ];
}

export function generateBranding(data: WizardData): Branding {
  const name = data.startupName || 'Your Startup';
  return {
    slogan: `${name} — from idea to investor-ready in minutes.`,
    logoConcept: 'A minimalist wordmark with a subtle gradient accent on the first letter, conveying motion and intelligence. The mark works in full color and monochrome.',
    colors: [
      { name: 'Primary', hex: '#6366f1' },
      { name: 'Secondary', hex: '#3b82f6' },
      { name: 'Accent', hex: '#06b6d4' },
      { name: 'Dark', hex: '#0f172a' },
      { name: 'Light', hex: '#f8fafc' },
      { name: 'Success', hex: '#22c55e' },
    ],
    typography: [
      { heading: 'Plus Jakarta Sans', body: 'Inter', pairing: 'Modern and friendly — great for SaaS' },
      { heading: 'Satoshi', body: 'Inter', pairing: 'Geometric and confident — ideal for tech brands' },
      { heading: 'Cabinet Grotesk', body: 'Inter', pairing: 'Distinctive and editorial — for bold brands' },
    ],
    personality: 'Innovative, trustworthy, and approachable. The brand speaks with clarity and confidence, avoiding hype while conveying genuine expertise. It feels like a knowledgeable co-founder, not a corporate vendor.',
  };
}

export function generateNames(data: WizardData): NameSuggestion[] {
  const base = (data.startupName || 'Startup').replace(/[^a-zA-Z]/g, '');
  const suffixes = ['ly', 'ify', 'hub', 'lab', 'base', 'flow', 'kit', 'os', 'ai', 'io', 'forge', 'loop', 'nest', 'pulse', 'spark', 'wave', 'zen', 'nova', 'orbit', 'shift'];
  const prefixes = ['get', 'go', 'my', 'the', 'try', 'use', 'with', 'build', 'make', 'start'];
  const names = new Set<string>();
  // deterministic-ish generation from the base name
  suffixes.forEach((s, i) => {
    names.add((base.toLowerCase() + s).slice(0, 12));
    names.add((prefixes[i % prefixes.length] + base.toLowerCase()).slice(0, 14));
  });
  names.add(base.toLowerCase() + '.ai');
  names.add('try' + base.toLowerCase());
  names.add(base.toLowerCase() + 'hq');
  return Array.from(names).slice(0, 20).map((name) => ({
    name,
    domainStatus: Math.random() > 0.5 ? 'available' : 'taken',
  }));
}

// ---------------------------------------------------------------------------
// Chat assistant mock responses
// ---------------------------------------------------------------------------

export function generateChatResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('market') || q.includes('marketing')) {
    return 'For marketing, I recommend a product-led growth motion supported by content SEO, founder-led social media, and a referral program. Start with one channel, measure CAC and activation, then expand. Would you like a channel-by-channel budget breakdown?';
  }
  if (q.includes('finance') || q.includes('financial') || q.includes('revenue')) {
    return 'Financially, aim for 18 months of runway, track MRR and burn rate weekly, and model three scenarios (base, upside, downside). Price for value with annual discounts to improve cash flow. I can generate a 12-month forecast if you share your current numbers.';
  }
  if (q.includes('product') || q.includes('feature') || q.includes('mvp')) {
    return 'For your MVP, focus on the single workflow that delivers the most value with the least code. Ship in 8–12 weeks, talk to 20 users weekly, and cut any feature that isn\'t on the critical path to activation.';
  }
  if (q.includes('hir') || q.includes('team') || q.includes('recruit')) {
    return 'For hiring, your first 10 people define your culture. Prioritize generalists who can wear multiple hats, hire slowly with a paid trial project, and write a clear candidate scorecard before you start interviewing.';
  }
  if (q.includes('growth') || q.includes('scale')) {
    return 'To scale growth, identify your one true growth loop (viral, content, sales, or paid), instrument it relentlessly, and remove friction at every step of the funnel. Most startups fail to scale because they add channels before fixing activation.';
  }
  if (q.includes('invest') || q.includes('fund') || q.includes('raise')) {
    return 'For fundraising, target investors who have backed companies in your space, build relationships before you need money, and prepare a crisp 10-slide deck plus a financial model. Raise on momentum, not desperation — ideally when you have 6+ months of runway left.';
  }
  return 'Great question. Based on your startup context, I\'d recommend starting with a clear hypothesis, testing it with the smallest possible experiment, and doubling down on what works. Tell me more about your specific situation and I can give you a more tailored recommendation.';
}
