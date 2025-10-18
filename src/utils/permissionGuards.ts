// Permission Guard Utilities

import { Permission, PermissionModule, PermissionAction, EffectivePermission } from '../types/rolesPermissions';

// Mock current user context - in real app, this would come from auth context
let currentUserPermissions: string[] = [];
let currentUserEffectivePermissions: EffectivePermission[] = [];

export const setCurrentUserPermissions = (permissions: string[], effectivePermissions: EffectivePermission[]) => {
  currentUserPermissions = permissions;
  currentUserEffectivePermissions = effectivePermissions;
};

export const getCurrentUserPermissions = (): string[] => {
  return currentUserPermissions;
};

export const getCurrentUserEffectivePermissions = (): EffectivePermission[] => {
  return currentUserEffectivePermissions;
};

// Permission checking utilities
export const hasPermission = (permissionId: string): boolean => {
  return currentUserPermissions.includes(permissionId);
};

export const hasAnyPermission = (permissionIds: string[]): boolean => {
  return permissionIds.some(permissionId => currentUserPermissions.includes(permissionId));
};

export const hasAllPermissions = (permissionIds: string[]): boolean => {
  return permissionIds.every(permissionId => currentUserPermissions.includes(permissionId));
};

export const hasModulePermission = (module: PermissionModule, action: PermissionAction): boolean => {
  const permissionId = `${module}:${action}`;
  return hasPermission(permissionId);
};

export const hasModuleAccess = (module: PermissionModule): boolean => {
  const moduleActions = [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.DELETE
  ];
  
  return moduleActions.some(action => hasModulePermission(module, action));
};

// Permission ID generation
export const generatePermissionId = (module: PermissionModule, action: PermissionAction, resource?: string): string => {
  return resource ? `${module}:${action}:${resource}` : `${module}:${action}`;
};

// Permission validation
export const validatePermission = (permission: string): boolean => {
  const parts = permission.split(':');
  return parts.length >= 2 && parts.length <= 3;
};

// Check if user can perform action on specific resource
export const canPerformAction = (module: PermissionModule, action: PermissionAction, resourceId?: string): boolean => {
  if (resourceId) {
    return hasPermission(generatePermissionId(module, action, resourceId));
  }
  return hasModulePermission(module, action);
};

// Check if user has admin privileges
export const isAdmin = (): boolean => {
  return hasPermission('system_configuration:admin') || hasPermission('*:admin');
};

// Check if user has super admin privileges
export const isSuperAdmin = (): boolean => {
  return hasPermission('*:super_admin');
};

// Get user's effective permissions for a specific module
export const getModulePermissions = (module: PermissionModule): string[] => {
  return currentUserPermissions.filter(permission => 
    permission.startsWith(`${module}:`)
  );
};

// Check if user can access a specific page/feature
export const canAccessFeature = (feature: string): boolean => {
  const featurePermissions: Record<string, string[]> = {
    'manage-officers': ['user_management:read', 'user_management:create', 'user_management:update'],
    'manage-posts': ['post_management:read', 'post_management:create', 'post_management:update'],
    'organogram': ['org_structure:read'],
    'appraisal-periods': ['appraisals:read', 'appraisals:create', 'appraisals:update'],
    'working-year': ['working_year:read', 'working_year:create', 'working_year:update'],
    'appraisal-settings': ['appraisal_settings:read', 'appraisal_settings:update'],
    'kra-kpi': ['kra_kpi_management:read', 'kra_kpi_management:create', 'kra_kpi_management:update'],
    'roles-permissions': ['system_configuration:read', 'system_configuration:update']
  };

  const requiredPermissions = featurePermissions[feature] || [];
  return hasAnyPermission(requiredPermissions);
};

// Permission audit logging
export const logPermissionAction = (
  action: 'granted' | 'revoked' | 'modified',
  permissionId: string,
  targetUserId: string,
  reason?: string
): void => {
  // In real app, this would send to audit service
};
