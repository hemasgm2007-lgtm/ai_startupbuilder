import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Building2, Check, DollarSign, Globe2, Lightbulb,
  Loader2, Rocket, Sparkles, Target, Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useWizard, createProjectFromWizard } from '../context/WizardContext';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { BUDGET_RANGES, BUSINESS_MODELS, COUNTRIES, INDUSTRIES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import type { BusinessModel, Industry } from '../types';

interface WizardPageProps {
  onNavigate: (path: string) => void;
}

const STEPS = [
  { title: 'Startup Name', icon: Building2, description: 'What will you call your startup?' },
  { title: 'Your Idea', icon: Lightbulb, description: 'Describe your startup idea in your own words.' },
  { title: 'Industry', icon: Rocket, description: 'Which industry does your startup operate in?' },
  { title: 'Target Audience', icon: Target, description: 'Who are you building this for?' },
  { title: 'Budget', icon: DollarSign, description: 'How much capital do you have to start?' },
  { title: 'Country', icon: Globe2, description: 'Where will you launch first?' },
  { title: 'Business Model', icon: Users, description: 'How will your startup make money?' },
];

const LOADING_MESSAGES = [
  'Analyzing your idea...',
  'Researching the market...',
  'Identifying competitors...',
  'Generating financial projections...',
  'Creating customer personas...',
  'Building your pitch deck...',
  'Finalizing your business plan...',
];

export function WizardPage({ onNavigate }: WizardPageProps) {
  const { data, step, setStep, nextStep, prevStep, updateData, addProject, setCurrentProjectId } = useWizard();
  const { showToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [loadMsgIndex, setLoadMsgIndex] = useState(0);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return data.startupName.trim().length > 0;
      case 1: return data.idea.trim().length > 10;
      case 2: return !!data.industry;
      case 3: return data.targetAudience.trim().length > 5;
      case 4: return data.budget > 0;
      case 5: return !!data.country;
      case 6: return data.businessModels.length > 0;
      default: return false;
    }
  }, [step, data]);

  const handleGenerate = async () => {
    setGenerating(true);
    setLoadMsgIndex(0);
    // Cycle through loading messages
    const interval = setInterval(() => {
      setLoadMsgIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 400);
    await new Promise((r) => setTimeout(r, 2800));
    clearInterval(interval);
    const project = createProjectFromWizard(data);
    const saved = await addProject(project);
    if (saved) {
      setCurrentProjectId(saved.id);
      setGenerating(false);
      showToast('success', 'Your business plan is ready!');
      onNavigate('/results');
    } else {
      setGenerating(false);
      showToast('error', 'Failed to save project. Please try again.');
    }
  };

  const toggleBusinessModel = (model: BusinessModel) => {
    updateData({
      businessModels: data.businessModels.includes(model)
        ? data.businessModels.filter((m) => m !== model)
        : [...data.businessModels, model],
    });
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  if (generating) {
    return <LoadingScreen message={LOADING_MESSAGES[loadMsgIndex]} progress={(loadMsgIndex + 1) / LOADING_MESSAGES.length * 100} name={data.startupName} />;
  }

  return (
    <DashboardLayout onNavigate={onNavigate} currentPath="/wizard">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              Create Your Startup
            </h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Step indicators */}
          <div className="mt-4 hidden sm:flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={i}
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 text-xs ${i < step ? 'cursor-pointer' : 'cursor-default'} ${active ? 'text-primary-600 dark:text-primary-400' : done ? 'text-success-500' : 'text-slate-400'}`}
                >
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    active ? 'bg-primary-500 text-white' :
                    done ? 'bg-success-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="hidden lg:inline">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex rounded-xl bg-primary-500/10 p-3 text-primary-500">
                {(() => { const Icon = STEPS[step].icon; return <Icon className="h-6 w-6" />; })()}
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                  {STEPS[step].title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{STEPS[step].description}</p>
              </div>
            </div>

            {step === 0 && (
              <Input
                label="Startup name"
                placeholder="e.g. Lumen Health"
                value={data.startupName}
                onChange={(e) => updateData({ startupName: e.target.value })}
                autoFocus
                maxLength={50}
                hint="This will be used throughout your generated business plan."
              />
            )}

            {step === 1 && (
              <Textarea
                label="Describe your idea"
                placeholder="e.g. An AI-powered platform that helps chronic disease patients track symptoms and share data with their care team in real time..."
                value={data.idea}
                onChange={(e) => updateData({ idea: e.target.value })}
                rows={6}
                autoFocus
                hint="The more detail you provide, the better the AI output will be."
              />
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select an industry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INDUSTRIES.map((industry) => {
                    const active = data.industry === industry;
                    return (
                      <button
                        key={industry}
                        onClick={() => updateData({ industry: industry as Industry })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{industry}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <Textarea
                label="Who is your target audience?"
                placeholder="e.g. Health systems and value-based care providers serving chronic disease patients in the US..."
                value={data.targetAudience}
                onChange={(e) => updateData({ targetAudience: e.target.value })}
                rows={5}
                autoFocus
                hint="Be specific — this shapes your customer personas and marketing strategy."
              />
            )}

            {step === 4 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  What's your starting budget?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_RANGES.map((range) => {
                    const active = data.budget === range.value;
                    return (
                      <button
                        key={range.value}
                        onClick={() => updateData({ budget: range.value })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="block text-sm font-medium">{range.label}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">{formatCurrency(range.value)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Select your launch country
                </label>
                <button
                  onClick={() => setCountryOpen((o) => !o)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-left text-slate-900 dark:text-slate-100 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  {data.country || 'Search countries...'}
                  <Globe2 className="h-4 w-4 text-slate-400" />
                </button>
                {countryOpen && (
                  <div className="absolute z-20 mt-1 w-full glass-strong rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-800 max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-slate-200/60 dark:border-slate-800">
                      <input
                        autoFocus
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => {
                            updateData({ country });
                            setCountryOpen(false);
                            setCountrySearch('');
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select one or more business models
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUSINESS_MODELS.map((model) => {
                    const active = data.businessModels.includes(model);
                    return (
                      <button
                        key={model}
                        onClick={() => toggleBusinessModel(model)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                          active
                            ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{model}</span>
                        {active && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? onNavigate('/dashboard') : prevStep())}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {step === 0 ? 'Cancel' : 'Previous'}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={nextStep} disabled={!canProceed} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={!canProceed}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generate Business Plan
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function LoadingScreen({ message, progress, name }: { message: string; progress: number; name: string }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-flex mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-2xl animate-pulse-slow" />
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display font-bold text-slate-900 dark:text-white"
        >
          Building {name}...
        </motion.h2>

        <div className="mt-6 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-4 text-sm text-slate-500 dark:text-slate-400"
          >
            {message}
          </motion.p>
        </AnimatePresence>

        <div className="mt-8 space-y-2 text-left">
          {LOADING_MESSAGES.map((msg, i) => {
            const done = i < Math.round(progress / (100 / LOADING_MESSAGES.length));
            const active = i === Math.round(progress / (100 / LOADING_MESSAGES.length));
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                {done ? (
                  <Check className="h-4 w-4 text-success-500" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                )}
                <span className={done ? 'text-slate-400 line-through' : active ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                  {msg}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
