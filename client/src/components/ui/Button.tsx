import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    
    // High-contrast, sleek minimalist buttons
    const variants = {
      default: "bg-white text-black hover:bg-zinc-200 transition-colors duration-200 cursor-pointer font-medium tracking-tight border-none shadow-sm",
      outline: "border border-white/10 bg-transparent hover:bg-white/[0.04] text-text-secondary hover:text-white transition-colors duration-200 cursor-pointer font-medium tracking-tight",
      ghost: "hover:bg-white/[0.04] text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer font-medium tracking-tight",
      destructive: "bg-rose-600 text-white hover:bg-rose-500 transition-colors duration-200 cursor-pointer tracking-tight font-medium shadow-sm",
    };
    
    const sizes = {
      default: "h-11 px-6 py-2.5 rounded-lg text-sm",
      sm: "h-9 rounded-md px-4 text-xs",
      lg: "h-14 rounded-xl px-8 text-base",
      icon: "h-11 w-11 rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
