import React from 'react';
import { cn } from '../../../core/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden sun-shadow transition-all',
        onClick && 'cursor-pointer hover:border-primary/20',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
