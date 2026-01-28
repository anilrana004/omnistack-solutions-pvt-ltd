import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  href?: string;
  external?: boolean;
}

const buttonVariants = {
  primary: [
    'bg-olive-600 text-white',
    'hover:bg-olive-700 hover:shadow-lg hover:shadow-olive-600/25',
    'active:bg-olive-800 focus:ring-olive-500',
    'disabled:bg-gray-300 disabled:text-gray-500',
  ].join(' '),
  
  secondary: [
    'bg-white text-olive-600 border border-olive-600',
    'hover:bg-olive-50 hover:shadow-lg',
    'active:bg-olive-100 focus:ring-olive-500',
    'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-300',
  ].join(' '),
  
  ghost: [
    'bg-transparent text-olive-600',
    'hover:bg-olive-50 hover:text-olive-700',
    'active:bg-olive-100 focus:ring-olive-500',
    'disabled:text-gray-400',
  ].join(' '),
  
  outline: [
    'bg-transparent text-white border border-white/30',
    'hover:bg-white/10 hover:border-white/50',
    'active:bg-white/20 focus:ring-white/50',
    'disabled:text-white/50 disabled:border-white/20',
  ].join(' '),
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  href,
  external = false,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    buttonVariants[variant],
    buttonSizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );

  // If href is provided, render as Link
  if (href) {
    if (external || href.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}