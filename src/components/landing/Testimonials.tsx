import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/mockData';

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Loved by founders worldwide
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Join thousands of entrepreneurs who turned ideas into action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 card-hover"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-500/20" />
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-500/20"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                "{t.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
