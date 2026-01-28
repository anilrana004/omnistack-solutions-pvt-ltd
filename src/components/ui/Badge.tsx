import { ReactNode, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  glass: 'bg-white/10 text-white/85 border border-white/15',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function Badge({
  children,
  className = '',
  variant = 'default',
  size = 'sm',
  ...props
}: BadgeProps) {
  const classes = [
    'inline-flex items-center font-medium rounded-full',
    badgeVariants[variant],
    badgeSizes[size],
    className,
  ].join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

// Specialized badge components
export function GlassBadge({ children, className = '', ...props }: Omit<BadgeProps, 'variant'>) {
  return (
    <Badge variant="glass" className={className} {...props}>
      {children}
    </Badge>
  );
}

export function StatusBadge({ 
  status,
  className = '',
  ...props
}: Omit<BadgeProps, 'variant' | 'children'> & { 
  status: 'published' | 'draft' | 'archived' | 'active' | 'inactive'
}) {
  const statusConfig = {
    published: { variant: 'success' as const, text: 'Published' },
    draft: { variant: 'warning' as const, text: 'Draft' },
    archived: { variant: 'default' as const, text: 'Archived' },
    active: { variant: 'success' as const, text: 'Active' },
    inactive: { variant: 'error' as const, text: 'Inactive' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.text}
    </Badge>
  );
}