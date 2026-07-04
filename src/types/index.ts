// Core domain types for the AI Startup Builder platform.
// These interfaces model the data that flows between the mock API layer,
// the React contexts, and the UI components. They are intentionally shaped
// so a real backend/AI API can replace the mock generators without changing
// the component contracts.

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export type UserRole = 'user' | 'admin';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  subscription: SubscriptionTier;
  bio: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

export type Industry =
  | 'AI'
  | 'Healthcare'
  | 'Cybersecurity'
  | 'Education'
  | 'Finance'
  | 'Agriculture'
  | 'E-commerce';

export type BusinessModel =
  | 'SaaS'
  | 'Marketplace'
  | 'Subscription'
  | 'B2B'
  | 'B2C'
  | 'Enterprise';

export interface WizardData {
  startupName: string;
  idea: string;
  industry: Industry | '';
  targetAudience: string;
  budget: number;
  country: string;
  businessModels: BusinessModel[];
}

// ---------------------------------------------------------------------------
// Startup project (persisted)
// ---------------------------------------------------------------------------

export type ProjectStatus = 'draft' | 'published';

export interface StartupProject {
  id: string;
  name: string;
  industry: Industry | string;
  createdAt: string;
  status: ProjectStatus;
  wizardData: WizardData;
}

// ---------------------------------------------------------------------------
// AI generated modules
// ---------------------------------------------------------------------------

export interface ExecutiveSummary {
  overview: string;
  mission: string;
  vision: string;
  valueProposition: string;
}

export interface BusinessModelSection {
  revenueModel: string;
  pricingStrategy: string;
  growthStrategy: string;
}

export interface MarketResearch {
  marketSize: string;
  industryTrends: string[];
  customerPainPoints: string[];
  opportunities: string[];
}

export interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
  opportunity: string;
}

export interface SwotQuadrant {
  title: string;
  items: string[];
}

export interface SwotAnalysis {
  strengths: SwotQuadrant;
  weaknesses: SwotQuadrant;
  opportunities: SwotQuadrant;
  threats: SwotQuadrant;
}

export interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  age: number;
  profession: string;
  goals: string[];
  challenges: string[];
  buyingBehavior: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  timeline: string;
  features: string[];
  deliverables: string[];
}

export interface FeatureSuggestion {
  name: string;
  description: string;
}

export interface FeatureSuggestions {
  mustHave: FeatureSuggestion[];
  niceToHave: FeatureSuggestion[];
  future: FeatureSuggestion[];
}

export interface MarketingStrategy {
  seo: string[];
  socialMedia: { platform: string; tactics: string }[];
  emailMarketing: string;
  contentStrategy: string;
  influencerMarketing: string;
  paidAdvertising: { channel: string; budget: string }[];
}

export interface FinancialPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface FinancialForecast {
  monthly: FinancialPoint[];
  expenses: ExpenseBreakdown[];
  breakEvenMonth: string;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
}

export interface RiskAnalysis {
  business: RiskItem[];
  market: RiskItem[];
  technical: RiskItem[];
  legal: RiskItem[];
  recommendations: string[];
}

export interface InvestorPitch {
  elevatorPitch: string;
  problem: string;
  solution: string;
  marketOpportunity: string;
  businessModel: string;
  traction: string;
  financialHighlights: string;
  fundingRequirement: string;
}

export interface PitchSlide {
  id: number;
  title: string;
  content: string;
  type: 'cover' | 'problem' | 'solution' | 'product' | 'market' | 'competition' | 'revenue' | 'gtm' | 'team' | 'ask';
}

export interface Branding {
  slogan: string;
  logoConcept: string;
  colors: { name: string; hex: string }[];
  typography: { heading: string; body: string; pairing: string }[];
  personality: string;
}

export interface NameSuggestion {
  name: string;
  domainStatus: 'available' | 'taken' | 'checking';
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Activity & notifications
// ---------------------------------------------------------------------------

export interface ActivityItem {
  id: string;
  type: 'create' | 'generate' | 'export' | 'update' | 'login';
  description: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalAiRequests: number;
  mrr: { month: string; value: number }[];
  subscriptionBreakdown: { name: string; value: number; color: string }[];
  recentSignups: { id: string; name: string; email: string; date: string; tier: SubscriptionTier }[];
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface UserSettings {
  name: string;
  email: string;
  bio: string;
  accentColor: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  productUpdates: boolean;
  marketingEmails: boolean;
  aiUsageLimit: number;
  defaultModel: string;
  creativityLevel: number;
}
