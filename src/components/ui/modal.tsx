import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
  showSteps?: boolean;
  currentStep?: number;
  totalSteps?: number;
  steps?: string[];
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  className 
}) => {
  return (
    <div className={cn("flex items-center space-x-4 mb-6", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index + 1 <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium transition-colors",
                index + 1 <= currentStep
                  ? "text-primary"
                  : "text-gray-500"
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-0.5 mx-4 transition-colors",
                index + 1 < currentStep ? "bg-primary" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  onClose,
  showSteps = false,
  currentStep = 1,
  totalSteps = 1,
  steps = []
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
        {showSteps && steps.length > 0 && (
          <div className="mt-4">
            <StepIndicator steps={steps} currentStep={currentStep} />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex justify-end space-x-3 pt-6 border-t border-gray-200", className)}>
      {children}
    </div>
  );
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
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
          "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative mt-4 transform transition-all duration-300 ease-out",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-4 opacity-0",
          className
        )}>
          <div className="p-6">
            <ModalHeader
              title={title}
              description={description}
              onClose={onClose}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
