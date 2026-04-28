import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, id, ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {label}
                    </label>
                )}
                <input
                    id={id}
                    type={type}
                    className={cn(
                        'flex h-12 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary/50 dark:focus:ring-primary/10',
                        error && 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
