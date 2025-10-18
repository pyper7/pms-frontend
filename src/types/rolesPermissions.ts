// Roles & Permissions System Types

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentRoleId?: string; // For role hierarchy
  permissions: string[]; // Array of permission IDs
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: PermissionModule;
  action: PermissionAction;
  resource?: string; // Optional resource identifier
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface RoleHierarchy {
  id: string;
  parentRoleId: string;
  childRoleId: string;
  inheritsAll: boolean; // If true, inherits all parent permissions
  inheritedPermissions: string[]; // Specific permissions inherited
}

export interface PostRoleLink {
  id: string;
  postId: string;
  postName: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  assignedAt: Date;
  assignedBy: string;
}

export interface EffectivePermission {
  userId: string;
  permissions: string[];
  source: 'direct' | 'post' | 'inherited';
  postId?: string;
  roleId?: string;
  expiresAt?: Date; // For temporary overrides
}

export interface UserRoleOverride {
  id: string;
  userId: string;
  roleId: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  reason: string;
  isActive: boolean;
}

export interface PermissionAudit {
  id: string;
  userId: string;
  action: 'granted' | 'revoked' | 'modified';
  permissionId: string;
  roleId?: string;
  postId?: string;
  performedBy: string;
  performedAt: Date;
  reason?: string;
}

// Enums
export enum PermissionModule {
  PERFORMANCE_MANAGEMENT = 'performance_management',
  ORG_STRUCTURE = 'org_structure',
  APPRAISALS = 'appraisals',
  REPORTS_ANALYTICS = 'reports_analytics',
  SYSTEM_CONFIGURATION = 'system_configuration',
  USER_MANAGEMENT = 'user_management',
  POST_MANAGEMENT = 'post_management',
  KRA_KPI_MANAGEMENT = 'kra_kpi_management',
  WORKING_YEAR = 'working_year',
  APPRAISAL_SETTINGS = 'appraisal_settings'
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  OVERRIDE = 'override',
  EXPORT = 'export',
  IMPORT = 'import'
}

// Form Data Types
export interface RoleFormData {
  name: string;
  description: string;
  parentRoleId?: string;
  permissions: string[];
}


export interface PermissionAssignmentFormData {
  roleId: string;
  permissions: string[];
}

// Filter Types
export interface RoleFilters {
  search: string;
  isActive: boolean | null;
  module: PermissionModule | null;
}

export interface PermissionFilters {
  search: string;
  module: PermissionModule | null;
  action: PermissionAction | null;
}

// Response Types
export interface RoleListResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
}

export interface PermissionListResponse {
  permissions: Permission[];
  groups: PermissionGroup[];
  total: number;
}

export interface EffectivePermissionsResponse {
  userId: string;
  effectivePermissions: EffectivePermission[];
  directPermissions: string[];
  postBasedPermissions: string[];
  inheritedPermissions: string[];
}
