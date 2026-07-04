import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const baseFieldClasses =
  'w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${baseFieldClasses} ${leftIcon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} py-2.5 text-sm ${
              error ? 'border-error-400 dark:border-error-500' : 'border-slate-300 dark:border-slate-700'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-error-500 dark:text-error-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`${baseFieldClasses} px-4 py-3 text-sm resize-y min-h-[100px] ${
            error ? 'border-error-400 dark:border-error-500' : 'border-slate-300 dark:border-slate-700'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-error-500 dark:text-error-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = '', id, children, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`${baseFieldClasses} px-4 py-2.5 text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1rem_center] pr-10 ${
            error ? 'border-error-400 dark:border-error-500' : 'border-slate-300 dark:border-slate-700'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="mt-1.5 text-xs text-error-500 dark:text-error-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = 'Select';
