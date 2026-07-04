import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import type { ToastType } from '../../types';

const iconMap: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<ToastType, string> = {
  success: 'text-success-500 bg-success-500/10',
  error: 'text-error-500 bg-error-500/10',
  warning: 'text-warning-500 bg-warning-500/10',
  info: 'text-primary-500 bg-primary-500/10',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="glass-strong rounded-xl shadow-xl p-4 flex items-start gap-3 pointer-events-auto"
            >
              <span className={`shrink-0 rounded-lg p-1.5 ${colorMap[toast.type]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-200 flex-1 pt-0.5">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
