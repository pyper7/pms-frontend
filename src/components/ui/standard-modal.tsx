import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  className?: string;
}

interface StandardModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl'
};

export const StandardModalFooter: React.FC<StandardModalFooterProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex justify-end space-x-3 pt-6 border-t border-gray-200", className)}>
      {children}
    </div>
  );
};

export const StandardModal: React.FC<StandardModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'lg',
  showCloseButton = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the modal container is rendered before animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] p-4 transition-opacity duration-200">
      <div className="flex justify-end items-start h-full">
        <div className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto relative mt-4 transform transition-all duration-300 ease-out",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-4 opacity-0",
          sizeClasses[size],
          className
        )}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
                {description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardModal;
