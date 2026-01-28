import { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'outlined' | 'elevated';
  clickable?: boolean;
  hover?: boolean;
}

const cardVariants = {
  default: 'bg-white shadow-sm border border-gray-200',
  glass: 'omni-glass-card',
  outlined: 'bg-transparent border border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  clickable = false,
  hover = true,
  ...props
}: CardProps) {
  const baseClasses = [
    'rounded-xl',
    cardVariants[variant],
    clickable ? 'cursor-pointer' : '',
    hover && clickable ? '[@media(hover:hover)]:hover:-translate-y-1 transition-transform duration-200' : '',
    className,
  ].join(' ');

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

// Specialized card components
export function GlassCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="glass" className={className} {...props}>
      {children}
    </Card>
  );
}

export function ClickableCard({ children, className = '', ...props }: Omit<CardProps, 'clickable'>) {
  return (
    <Card clickable className={`card-clickable ${className}`} {...props}>
      {children}
    </Card>
  );
}