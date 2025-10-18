import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  success = false,
  error = false,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500': !loading && !success && !error,
          'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500': success || showSuccess,
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': error || showError,
          'bg-slate-300 text-slate-500 cursor-not-allowed': disabled,
          'opacity-75 cursor-not-allowed': loading,
        },
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {success && <CheckCircle className="w-4 h-4" />}
      {error && <AlertCircle className="w-4 h-4" />}
      {children}
    </button>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 300,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        {
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        },
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 300,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    left: { from: '-translate-x-8', to: 'translate-x-0' },
    right: { from: 'translate-x-8', to: 'translate-x-0' },
    up: { from: 'translate-y-8', to: 'translate-y-0' },
    down: { from: '-translate-y-8', to: 'translate-y-0' },
  };

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        {
          [`opacity-0 ${directionClasses[direction].from}`]: !isVisible,
          [`opacity-100 ${directionClasses[direction].to}`]: isVisible,
        },
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface PulseProps {
  children: React.ReactNode;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({ children, className }) => (
  <div className={cn('animate-pulse', className)}>
    {children}
  </div>
);

interface ShakeProps {
  children: React.ReactNode;
  shake?: boolean;
  className?: string;
}

export const Shake: React.FC<ShakeProps> = ({ children, shake = false, className }) => (
  <div
    className={cn(
      'transition-transform duration-150',
      {
        'animate-bounce': shake,
      },
      className
    )}
  >
    {children}
  </div>
);

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({ 
  children, 
  scale = 1.05, 
  className 
}) => (
  <div
    className={cn(
      'transition-transform duration-200 ease-in-out hover:scale-105',
      className
    )}
    style={{ '--hover-scale': scale } as React.CSSProperties}
  >
    {children}
  </div>
);

interface StaggeredChildrenProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  staggerDelay = 100,
  className
}) => (
  <div className={className}>
    {React.Children.map(children, (child, index) => (
      <FadeIn key={index} delay={index * staggerDelay}>
        {child}
      </FadeIn>
    ))}
  </div>
);
