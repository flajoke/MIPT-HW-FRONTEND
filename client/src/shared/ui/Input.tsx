import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-400',
      className,
    )}
    {...props}
  />
);
