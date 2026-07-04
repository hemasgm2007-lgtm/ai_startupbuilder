import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface CollapsibleProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function Collapsible({ title, icon, children, defaultOpen = false, badge, actions }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 flex-1 text-left focus-ring rounded-lg"
          aria-expanded={open}
        >
          {icon && (
            <span className="shrink-0 rounded-lg bg-primary-500/10 text-primary-500 p-2">
              {icon}
            </span>
          )}
          <span className="flex items-center gap-2">
            <h3 className="text-base font-display font-semibold text-slate-900 dark:text-white">{title}</h3>
            {badge}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {actions && <div className="flex items-center gap-2 ml-2">{actions}</div>}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-slate-200/60 dark:border-slate-800">
              <div className="pt-5">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
