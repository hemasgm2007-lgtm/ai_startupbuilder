import { motion } from 'framer-motion';
import {
  Sparkles, LayoutDashboard, LineChart, Presentation, Users, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { LANDING_FEATURES } from '../../data/mockData';

const iconMap: Record<string, LucideIcon> = {
  Sparkles, LayoutDashboard, LineChart, Presentation, Users, ShieldCheck,
};

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Everything you need to launch
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From idea to investor-ready in one platform. No spreadsheets, no consultants, no weeks of work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANDING_FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 card-hover"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 transition-all duration-300" />
                <div className="relative">
                  <div className="inline-flex rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 p-3 text-primary-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
