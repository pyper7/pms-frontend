import React from 'react';
import { CheckCircle, Clock, AlertCircle, Save } from 'lucide-react';

interface AutoSaveIndicatorProps {
  status: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date;
  className?: string;
}

export function AutoSaveIndicator({ 
  status, 
  lastSaved, 
  className = '' 
}: AutoSaveIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: CheckCircle,
          text: 'All changes saved',
          textColor: 'text-green-600',
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'saving':
        return {
          icon: Clock,
          text: 'Saving...',
          textColor: 'text-blue-600',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save failed',
          textColor: 'text-red-600',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'unsaved':
        return {
          icon: Save,
          text: 'Unsaved changes',
          textColor: 'text-amber-600',
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      default:
        return {
          icon: Save,
          text: 'Unknown status',
          textColor: 'text-gray-600',
          iconColor: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${config.bgColor} ${config.borderColor} ${className}`}>
      <Icon className={`w-4 h-4 ${config.iconColor} ${status === 'saving' ? 'animate-spin' : ''}`} />
      <span className={config.textColor}>
        {config.text}
      </span>
      {lastSaved && status === 'saved' && (
        <span className="text-xs text-gray-500 ml-1">
          ({formatLastSaved(lastSaved)})
        </span>
      )}
    </div>
  );
}

export default AutoSaveIndicator;
