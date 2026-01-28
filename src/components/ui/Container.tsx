import { ReactNode, HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  center?: boolean;
}

const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
};

export default function Container({
  children,
  className = '',
  size = 'xl',
  padding = true,
  center = true,
  ...props
}: ContainerProps) {
  const classes = [
    containerSizes[size],
    center ? 'mx-auto' : '',
    padding ? 'px-4 sm:px-6 lg:px-8' : '',
    className,
  ].join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// Specialized container components
export function SectionContainer({ 
  children, 
  className = '',
  ...props 
}: Omit<ContainerProps, 'size'>) {
  return (
    <Container size="xl" className={`py-20 ${className}`} {...props}>
      {children}
    </Container>
  );
}

export function ContentContainer({ 
  children, 
  className = '',
  ...props 
}: Omit<ContainerProps, 'size'>) {
  return (
    <Container size="lg" className={className} {...props}>
      {children}
    </Container>
  );
}