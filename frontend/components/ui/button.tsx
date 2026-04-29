import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'link' | 'clay';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'md', isLoading, children, disabled, ...props },
    ref,
  ) => {
    const variants = {
      default:
        'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 border-0',
      outline:
        'border-2 border-slate-200 dark:border-slate-600 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
      link: 'text-primary underline-offset-4 hover:underline bg-transparent shadow-none',
      clay: 'clay-button',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs rounded-xl',
      md: 'h-11 px-6 py-2 rounded-2xl',
      lg: 'h-14 px-10 text-lg rounded-[1.25rem]',
      icon: 'h-10 w-10 rounded-xl',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cubic-bezier(0.34, 1.56)',
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button };
