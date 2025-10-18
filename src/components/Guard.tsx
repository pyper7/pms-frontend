// Permission Guard Component

import React from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessFeature } from '../utils/permissionGuards';

interface GuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  feature?: string;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const Guard: React.FC<GuardProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  feature,
  fallback = null,
  showFallback = false
}) => {
  let hasAccess = false;

  if (feature) {
    hasAccess = canAccessFeature(feature);
  } else if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return showFallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

// Higher-order component for permission-based rendering
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  permission: string | string[],
  requireAll = false
) => {
  return (props: P) => {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return null;
    }

    return <Component {...props} />;
  };
};

// Hook for permission checking
export const usePermission = (permission: string): boolean => {
  return hasPermission(permission);
};

export const usePermissions = (permissions: string[], requireAll = false): boolean => {
  return requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);
};

export const useFeatureAccess = (feature: string): boolean => {
  return canAccessFeature(feature);
};
