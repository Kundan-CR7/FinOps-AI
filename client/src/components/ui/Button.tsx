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
    
    // Using the exact Framer vibrant cyan/blue hex for the primary button
    const variants = {
      default: "bg-[#00B2FF] text-white hover:bg-[#009ce0] active:bg-[#008acc] transition-all cursor-pointer font-medium tracking-tight border-none",
      outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white active:bg-white/5 cursor-pointer font-medium tracking-tight",
      ghost: "hover:bg-white/10 text-zinc-300 active:bg-white/5 cursor-pointer font-medium tracking-tight",
      destructive: "bg-rose-500 text-white hover:bg-rose-400 active:bg-rose-600 cursor-pointer tracking-tight font-medium",
    };
    
    const sizes = {
      default: "h-11 px-6 py-2.5 rounded-full text-sm",
      sm: "h-9 rounded-full px-4 text-xs",
      lg: "h-14 rounded-full px-8 text-base",
      icon: "h-11 w-11 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00B2FF]/40 disabled:pointer-events-none disabled:opacity-50",
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
