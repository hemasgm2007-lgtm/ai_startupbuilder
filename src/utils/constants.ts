import type { BusinessModel, Industry } from '../types';

// Static option lists used by the wizard and admin tables.
// Keeping them in one place makes it trivial to add new options later.

export const INDUSTRIES: Industry[] = [
  'AI',
  'Healthcare',
  'Cybersecurity',
  'Education',
  'Finance',
  'Agriculture',
  'E-commerce',
];

export const BUSINESS_MODELS: BusinessModel[] = [
  'SaaS',
  'Marketplace',
  'Subscription',
  'B2B',
  'B2C',
  'Enterprise',
];

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Japan',
  'Singapore',
  'South Korea',
  'India',
  'Brazil',
  'Mexico',
  'United Arab Emirates',
  'South Africa',
  'Nigeria',
  'Kenya',
];

export const BUDGET_RANGES = [
  { label: '< $10K', value: 5000 },
  { label: '$10K – $50K', value: 25000 },
  { label: '$50K – $100K', value: 75000 },
  { label: '$100K – $500K', value: 250000 },
  { label: '$500K – $1M', value: 750000 },
  { label: '$1M+', value: 1500000 },
];

export const AI_MODELS = [
  'GPT-4 Turbo',
  'Claude 3 Opus',
  'Gemini 1.5 Pro',
  'Llama 3 70B',
  'Mistral Large',
];

export const ACCENT_COLORS = [
  { name: 'Violet', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
];

export const STORAGE_KEYS = {
  AUTH: 'asb_auth',
  THEME: 'asb_theme',
  PROJECTS: 'asb_projects',
  WIZARD: 'asb_wizard',
  SETTINGS: 'asb_settings',
  CHAT: 'asb_chat',
} as const;
