import React from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  to,
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent-purple/50 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan text-white shadow-[0_4px_14px_rgba(139,92,246,0.2)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.35)]",
    secondary: "bg-white text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200 hover:bg-slate-50 hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  };
  
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg rounded-2xl",
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  // Wrap button in motion.div or motion.a for better hover interaction if desired,
  // but CSS transition-all and active:scale is already quite good.

  if (to) {
    return (
      <Link to={to} className={classes} ref={ref} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
