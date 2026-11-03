import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/shared/lib/cn';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const variants: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  danger: 'bg-red-500/90 text-white hover:bg-red-400',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5',
};

export const Button = ({ children, className, variant = 'secondary', ...props }: PropsWithChildren<Props>) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
