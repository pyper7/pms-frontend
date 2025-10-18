import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'button' | 'table' | 'form' | 'chart';
  animate?: boolean;
  children?: React.ReactNode;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', animate = true, children, ...props }, ref) => {
    const baseClasses = 'bg-slate-200 rounded';
    const animateClasses = animate ? 'animate-pulse' : '';
    
    const variantClasses = {
      default: 'h-4 w-full',
      card: 'h-32 w-full',
      text: 'h-4 w-3/4',
      button: 'h-10 w-24',
      table: 'h-12 w-full',
      form: 'h-10 w-full',
      chart: 'h-64 w-full'
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          animateClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Specialized skeleton components
export const SkeletonCard = ({ className, ...props }: Omit<SkeletonProps, 'variant'>) => (
  <div className={cn('p-6 border border-slate-200 rounded-lg', className)}>
    <Skeleton variant="text" className="h-6 w-1/2 mb-4" {...props} />
    <Skeleton variant="text" className="h-4 w-3/4 mb-2" {...props} />
    <Skeleton variant="text" className="h-4 w-1/2" {...props} />
  </div>
);

export const SkeletonTable = ({ rows = 5, className, ...props }: Omit<SkeletonProps, 'variant'> & { rows?: number }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton variant="text" className="h-4 w-1/4" {...props} />
        <Skeleton variant="text" className="h-4 w-1/4" {...props} />
        <Skeleton variant="text" className="h-4 w-1/4" {...props} />
        <Skeleton variant="text" className="h-4 w-1/4" {...props} />
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ fields = 3, className, ...props }: Omit<SkeletonProps, 'variant'> & { fields?: number }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton variant="text" className="h-4 w-1/4" {...props} />
        <Skeleton variant="form" className="h-10 w-full" {...props} />
      </div>
    ))}
  </div>
);

export const SkeletonChart = ({ className, ...props }: Omit<SkeletonProps, 'variant'>) => (
  <div className={cn('p-6 border border-slate-200 rounded-lg', className)}>
    <Skeleton variant="text" className="h-6 w-1/3 mb-4" {...props} />
    <Skeleton variant="chart" className="h-64 w-full" {...props} />
  </div>
);

export const SkeletonStats = ({ className, ...props }: Omit<SkeletonProps, 'variant'>) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-6 border border-slate-200 rounded-lg">
        <Skeleton variant="text" className="h-4 w-1/2 mb-2" {...props} />
        <Skeleton variant="text" className="h-8 w-3/4 mb-2" {...props} />
        <Skeleton variant="text" className="h-3 w-1/3" {...props} />
      </div>
    ))}
  </div>
);

export const SkeletonProgress = ({ className, ...props }: Omit<SkeletonProps, 'variant'>) => (
  <div className={cn('space-y-2', className)}>
    <Skeleton variant="text" className="h-4 w-1/4" {...props} />
    <Skeleton variant="default" className="h-2 w-full" {...props} />
    <Skeleton variant="text" className="h-3 w-1/6" {...props} />
  </div>
);

export default Skeleton;
