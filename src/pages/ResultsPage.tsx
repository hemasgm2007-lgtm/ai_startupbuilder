import { motion } from 'framer-motion';
import {
  AlertTriangle, BarChart3, Briefcase, Building2, Check, Copy, DollarSign,
  FileText, Globe2, Lightbulb, Palette, Presentation, RefreshCw,
  Rocket, Shield, Sparkles, Target, TrendingUp, Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useWizard } from '../context/WizardContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Collapsible } from '../components/common/Collapsible';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ExpenseChart, ExpensesBarChart, ProfitChart, RevenueChart } from '../components/results/Charts';
import {
  generateBranding, generateBusinessModel, generateCompetitors, generateExecutiveSummary,
  generateFeatureSuggestions, generateFinancialForecast, generateInvestorPitch,
  generateMarketResearch, generateMarketingStrategy, generateNames, generatePersonas,
  generatePitchSlides, generateRiskAnalysis, generateRoadmap, generateSwot,
} from '../data/generators';
import { copyToClipboard, formatCurrency } from '../utils/helpers';

interface ResultsPageProps {
  onNavigate: (path: string) => void;
}

export function ResultsPage({ onNavigate }: ResultsPageProps) {
  const { projects, currentProjectId } = useWizard();
  const { showToast } = useToast();
  const [activeSlide, setActiveSlide] = useState(0);

  const project = projects.find((p) => p.id === currentProjectId) ?? projects[0];
  const data = project?.wizardData;

  // Generate all modules once, memoized on the wizard data.
  const modules = useMemo(() => {
    if (!data) return null;
    return {
      executive: generateExecutiveSummary(data),
      business: generateBusinessModel(data),
      market: generateMarketResearch(data),
      competitors: generateCompetitors(data),
      swot: generateSwot(data),
      personas: generatePersonas(data),
      roadmap: generateRoadmap(data),
      features: generateFeatureSuggestions(data),
      marketing: generateMarketingStrategy(data),
      financial: generateFinancialForecast(data),
      risk: generateRiskAnalysis(data),
      pitch: generateInvestorPitch(data),
      slides: generatePitchSlides(data),
      branding: generateBranding(data),
      names: generateNames(data),
    };
  }, [data]);

  if (!project || !data || !modules) {
    return (
      <DashboardLayout onNavigate={onNavigate} currentPath="/results">
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">No project found. Create one to get started.</p>
          <Button className="mt-4" onClick={() => onNavigate('/wizard')}>Create Startup</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleExport = (format: string) => {
    showToast('success', `${format} export initiated. You'll receive a download link shortly.`);
  };

  const handleRegenerate = (section: string) => {
    showToast('info', `Regenerating ${section}...`);
  };

  const handleCopyName = async (name: string) => {
    const ok = await copyToClipboard(name);
    showToast(ok ? 'success' : 'error', ok ? `Copied "${name}" to clipboard.` : 'Failed to copy.');
  };

  const slides = modules.slides;

  return (
    <DashboardLayout onNavigate={onNavigate} currentPath="/results">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-6 sm:p-8 text-white"
        >
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium text-white/80">AI-Generated Business Plan</span>
            </div>
            <h1 className="text-3xl font-display font-bold">{project.name}</h1>
            <p className="mt-2 text-white/80 max-w-2xl">{data.idea}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium">{data.industry}</span>
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium">{data.country}</span>
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium">{data.businessModels.join(', ')}</span>
            </div>
          </div>
        </motion.div>

        {/* Export buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Export:</span>
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} leftIcon={<FileText className="h-4 w-4" />}>PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('PowerPoint')} leftIcon={<Presentation className="h-4 w-4" />}>PowerPoint</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Word')} leftIcon={<FileText className="h-4 w-4" />}>Word</Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/dashboard')}>Back to dashboard</Button>
        </div>

        {/* Executive Summary */}
        <Collapsible title="Executive Summary" icon={<Briefcase className="h-5 w-5" />} defaultOpen actions={<RegenerateButton onClick={() => handleRegenerate('Executive Summary')} />}>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Overview</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{modules.executive.overview}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <InfoBox label="Mission" content={modules.executive.mission} />
              <InfoBox label="Vision" content={modules.executive.vision} />
              <InfoBox label="Value Proposition" content={modules.executive.valueProposition} />
            </div>
          </div>
        </Collapsible>

        {/* Business Model */}
        <Collapsible title="Business Model" icon={<DollarSign className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Business Model')} />}>
          <div className="space-y-4">
            <InfoBox label="Revenue Model" content={modules.business.revenueModel} />
            <InfoBox label="Pricing Strategy" content={modules.business.pricingStrategy} />
            <InfoBox label="Growth Strategy" content={modules.business.growthStrategy} />
          </div>
        </Collapsible>

        {/* Market Research */}
        <Collapsible title="Market Research" icon={<TrendingUp className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Market Research')} />}>
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-lg font-display font-bold">{modules.market.marketSize}</span>
              <span className="text-sm text-slate-500">TAM</span>
            </div>
            <BulletList title="Industry Trends" items={modules.market.industryTrends} />
            <BulletList title="Customer Pain Points" items={modules.market.customerPainPoints} />
            <BulletList title="Opportunities" items={modules.market.opportunities} />
          </div>
        </Collapsible>

        {/* Competitor Analysis */}
        <Collapsible title="Competitor Analysis" icon={<Building2 className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Competitor Analysis')} />}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Competitor</th>
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Strengths</th>
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Weaknesses</th>
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {modules.competitors.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="px-2 py-3 font-medium text-slate-900 dark:text-white">{c.name}</td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-400">{c.strengths}</td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-400">{c.weaknesses}</td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-400">{c.opportunity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Collapsible>

        {/* SWOT Analysis */}
        <Collapsible title="SWOT Analysis" icon={<Target className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('SWOT Analysis')} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SwotCard title="Strengths" items={modules.swot.strengths.items} color="success" />
            <SwotCard title="Weaknesses" items={modules.swot.weaknesses.items} color="error" />
            <SwotCard title="Opportunities" items={modules.swot.opportunities.items} color="primary" />
            <SwotCard title="Threats" items={modules.swot.threats.items} color="warning" />
          </div>
        </Collapsible>

        {/* Customer Personas */}
        <Collapsible title="Customer Personas" icon={<Users className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Customer Personas')} />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.personas.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={p.avatarUrl} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.age} · {p.profession}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Goals</p>
                    <ul className="space-y-1">
                      {p.goals.map((g, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                          <Check className="h-3 w-3 text-success-500 mt-0.5 shrink-0" />{g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Challenges</p>
                    <ul className="space-y-1">
                      {p.challenges.map((c, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-warning-500 mt-0.5 shrink-0" />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Buying Behavior</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{p.buyingBehavior}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapsible>

        {/* Product Roadmap */}
        <Collapsible title="Product Roadmap" icon={<Rocket className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Product Roadmap')} />}>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 ml-5 hidden sm:block" />
            <div className="space-y-4">
              {modules.roadmap.map((phase) => (
                <div key={phase.phase} className="relative sm:pl-16">
                  <div className="hidden sm:flex absolute left-0 top-1 h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white items-center justify-center text-sm font-bold">
                    {phase.phase}
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{phase.title}</h4>
                      <Badge variant="primary">{phase.timeline}</Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Key Features</p>
                        <ul className="space-y-1">
                          {phase.features.map((f, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                              <Check className="h-3.5 w-3.5 text-primary-500 mt-0.5 shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Deliverables</p>
                        <ul className="space-y-1">
                          {phase.deliverables.map((d, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                              <Target className="h-3.5 w-3.5 text-success-500 mt-0.5 shrink-0" />{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Collapsible>

        {/* Feature Suggestions */}
        <Collapsible title="Feature Suggestions" icon={<Lightbulb className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Feature Suggestions')} />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureColumn title="Must Have" features={modules.features.mustHave} color="error" />
            <FeatureColumn title="Nice to Have" features={modules.features.niceToHave} color="primary" />
            <FeatureColumn title="Future" features={modules.features.future} color="accent" />
          </div>
        </Collapsible>

        {/* Marketing Strategy */}
        <Collapsible title="Marketing Strategy" icon={<TrendingUp className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Marketing Strategy')} />}>
          <div className="space-y-5">
            <BulletList title="SEO Strategy" items={modules.marketing.seo} />
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Social Media</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {modules.marketing.socialMedia.map((s) => (
                  <div key={s.platform} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{s.platform}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.tactics}</p>
                  </div>
                ))}
              </div>
            </div>
            <InfoBox label="Email Marketing" content={modules.marketing.emailMarketing} />
            <InfoBox label="Content Strategy" content={modules.marketing.contentStrategy} />
            <InfoBox label="Influencer Marketing" content={modules.marketing.influencerMarketing} />
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Paid Advertising</h4>
              <div className="flex flex-wrap gap-2">
                {modules.marketing.paidAdvertising.map((ad) => (
                  <div key={ad.channel} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">{ad.channel}</span>
                    <span className="text-slate-500 ml-2">{ad.budget}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Collapsible>

        {/* Financial Forecast */}
        <Collapsible title="Financial Forecast" icon={<BarChart3 className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Financial Forecast')} />}>
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Revenue Projection (12 months)">
                <RevenueChart data={modules.financial.monthly} />
              </ChartCard>
              <ChartCard title="Expenses Breakdown">
                <ExpenseChart data={modules.financial.expenses} />
              </ChartCard>
              <ChartCard title="Profit Trajectory (12 months)">
                <ProfitChart data={modules.financial.monthly} />
              </ChartCard>
              <ChartCard title="Expenses by Category">
                <ExpensesBarChart data={modules.financial.expenses} />
              </ChartCard>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success-500/10 text-success-600 dark:text-success-400">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">Break-even point: {modules.financial.breakEvenMonth}</span>
            </div>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-2">Month</th>
                    <th className="text-right font-semibold text-slate-700 dark:text-slate-300 px-2 py-2">Revenue</th>
                    <th className="text-right font-semibold text-slate-700 dark:text-slate-300 px-2 py-2">Expenses</th>
                    <th className="text-right font-semibold text-slate-700 dark:text-slate-300 px-2 py-2">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.financial.monthly.map((m) => (
                    <tr key={m.month} className="border-b border-slate-100 dark:border-slate-800/50">
                      <td className="px-2 py-2 font-medium text-slate-900 dark:text-white">{m.month}</td>
                      <td className="px-2 py-2 text-right text-slate-600 dark:text-slate-400">{formatCurrency(m.revenue)}</td>
                      <td className="px-2 py-2 text-right text-slate-600 dark:text-slate-400">{formatCurrency(m.expenses)}</td>
                      <td className={`px-2 py-2 text-right font-medium ${m.profit >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-500'}`}>
                        {formatCurrency(m.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Collapsible>

        {/* Risk Analysis */}
        <Collapsible title="Risk Analysis" icon={<Shield className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Risk Analysis')} />}>
          <div className="space-y-5">
            <RiskColumn title="Business Risks" risks={modules.risk.business} />
            <RiskColumn title="Market Risks" risks={modules.risk.market} />
            <RiskColumn title="Technical Risks" risks={modules.risk.technical} />
            <RiskColumn title="Legal Risks" risks={modules.risk.legal} />
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">AI Recommendations</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {modules.risk.recommendations.map((r, i) => (
                  <div key={i} className="rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 p-3 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Collapsible>

        {/* Investor Pitch */}
        <Collapsible title="Investor Pitch" icon={<Presentation className="h-5 w-5" />} defaultOpen actions={<RegenerateButton onClick={() => handleRegenerate('Investor Pitch')} />}>
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 p-5">
              <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                "{modules.pitch.elevatorPitch}"
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoBox label="Problem" content={modules.pitch.problem} />
              <InfoBox label="Solution" content={modules.pitch.solution} />
              <InfoBox label="Market Opportunity" content={modules.pitch.marketOpportunity} />
              <InfoBox label="Business Model" content={modules.pitch.businessModel} />
              <InfoBox label="Traction" content={modules.pitch.traction} />
              <InfoBox label="Financial Highlights" content={modules.pitch.financialHighlights} />
            </div>
            <InfoBox label="Funding Requirement" content={modules.pitch.fundingRequirement} />
          </div>
        </Collapsible>

        {/* Pitch Deck */}
        <Collapsible title="Pitch Deck Generator" icon={<Presentation className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Pitch Deck')} />}>
          <div className="space-y-4">
            {/* Slide preview */}
            <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary-500/20 blur-3xl" />
              <div className="relative">
                <p className="text-xs text-white/60 mb-2">Slide {slides[activeSlide].id} / 10</p>
                <h3 className="text-2xl font-display font-bold mb-3">{slides[activeSlide].title}</h3>
                <p className="text-sm text-white/80 max-w-lg leading-relaxed">{slides[activeSlide].content}</p>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(i)}
                  className={`aspect-video rounded-lg p-2 text-left text-xs transition-all ${
                    i === activeSlide
                      ? 'bg-primary-500/20 border-2 border-primary-500'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-slate-400 mb-0.5">{slide.id}</span>
                  <span className="block text-slate-700 dark:text-slate-300 font-medium truncate">{slide.title}</span>
                </button>
              ))}
            </div>
          </div>
        </Collapsible>

        {/* Branding */}
        <Collapsible title="Branding" icon={<Palette className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Branding')} />}>
          <div className="space-y-5">
            <InfoBox label="Slogan" content={modules.branding.slogan} />
            <InfoBox label="Logo Concept" content={modules.branding.logoConcept} />
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Brand Colors</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {modules.branding.colors.map((c) => (
                  <div key={c.hex} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="h-16" style={{ background: c.hex }} />
                    <div className="p-2">
                      <p className="text-xs font-medium text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{c.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Typography</h4>
              <div className="space-y-2">
                {modules.branding.typography.map((t, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{t.heading} + {t.body}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.pairing}</p>
                  </div>
                ))}
              </div>
            </div>
            <InfoBox label="Brand Personality" content={modules.branding.personality} />
          </div>
        </Collapsible>

        {/* Name Generator */}
        <Collapsible title="Name Generator" icon={<Globe2 className="h-5 w-5" />} actions={<RegenerateButton onClick={() => handleRegenerate('Name Generator')} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.names.map((n) => (
              <div key={n.name} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{n.name}</p>
                  <Badge variant={n.domainStatus === 'available' ? 'success' : 'error'} className="mt-1">
                    {n.domainStatus === 'available' ? '.com available' : '.com taken'}
                  </Badge>
                </div>
                <button
                  onClick={() => handleCopyName(n.name)}
                  className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
                  aria-label="Copy name"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
}

// --- Helper components ---

function RegenerateButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
      Regenerate
    </Button>
  );
}

function InfoBox({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</h4>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{content}</p>
    </div>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SwotCard({ title, items, color }: { title: string; items: string[]; color: 'success' | 'error' | 'primary' | 'warning' }) {
  const colorMap = {
    success: 'border-success-500/30 bg-success-500/5',
    error: 'border-error-500/30 bg-error-500/5',
    primary: 'border-primary-500/30 bg-primary-500/5',
    warning: 'border-warning-500/30 bg-warning-500/5',
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureColumn({ title, features, color }: { title: string; features: { name: string; description: string }[]; color: 'error' | 'primary' | 'accent' }) {
  const colorMap = {
    error: 'text-error-500 bg-error-500/10',
    primary: 'text-primary-500 bg-primary-500/10',
    accent: 'text-accent-500 bg-accent-500/10',
  };
  return (
    <div>
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${colorMap[color]}`}>
        {title}
      </div>
      <div className="space-y-2">
        {features.map((f) => (
          <div key={f.name} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{f.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskColumn({ title, risks }: { title: string; risks: { risk: string; mitigation: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{title}</h4>
      <div className="space-y-2">
        {risks.map((r, i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{r.risk}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-medium text-success-600 dark:text-success-400">Mitigation:</span> {r.mitigation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h4>
      {children}
    </div>
  );
}
