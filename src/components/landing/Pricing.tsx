import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_TIERS } from '../../data/mockData';
import { Button } from '../common/Button';

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.highlighted
                  ? 'bg-gradient-to-b from-primary-500/10 to-secondary-500/5 border-2 border-primary-500/40 shadow-xl shadow-primary-500/10'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-medium shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">
                  ${tier.price}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">/{tier.period}</span>
              </div>
              <Button
                variant={tier.highlighted ? 'primary' : 'outline'}
                fullWidth
                className="mt-6"
                onClick={onGetStarted}
              >
                {tier.cta}
              </Button>
              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-success-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
