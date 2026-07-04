import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Toast, ToastType } from '../types';
import { uid } from '../utils/helpers';

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = uid();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast],
  );

  const value = useMemo<ToastContextValue>(() => ({ toasts, showToast, dismissToast }), [toasts, showToast, dismissToast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
