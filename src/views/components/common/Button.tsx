import React from 'react';
import { cn } from '../../../core/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  isLoading,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container sun-shadow',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-outline-variant/30',
    outline: 'border border-outline text-primary hover:bg-surface-container',
    whatsapp: 'bg-whatsapp text-white hover:brightness-110 sun-shadow',
    ghost: 'bg-transparent text-primary hover:bg-surface-container',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-headline font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100',
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};
