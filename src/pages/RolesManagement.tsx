// Roles Management Page

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Layout from '../components/Layout';
import PageHeader from '@/components/PageHeader';
import ConfirmationDialog from '../components/ui/confirmation-dialog';
import { Role as ApiRole } from '@/services/api';
import apiService from '@/services/api';
import { RoleFormData, RoleFilters, Permission, PermissionModule } from '../types/rolesPermissions';
import { toast } from '@/utils/toast';

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [filters, setFilters] = useState<RoleFilters>({
    search: '',
    isActive: null,
    module: null
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ApiRole | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: []
  });

  // Load roles and permissions from API
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Load roles
        const rolesRes = await apiService.getRoles();
        if (rolesRes.success && rolesRes.data) {
          setRoles(rolesRes.data);
        } else {
          toast.error('Failed to load roles');
        }

        // Load permissions (try grouped first, fallback to regular)
        setPermissionsLoading(true);
        let permissionsRes;
        try {
          permissionsRes = await apiService.getPermissionsGrouped();
        } catch (e) {
          try {
            permissionsRes = await apiService.getPermissions();
          } catch (e2) {
            permissionsRes = { success: false, data: null };
          }
        } finally {
          setPermissionsLoading(false);
        }

        if (permissionsRes.success && permissionsRes.data) {
          let apiPermissions: Permission[] = [];
          
          if (Array.isArray(permissionsRes.data)) {
            // Regular permissions endpoint response
            apiPermissions = permissionsRes.data.map(perm => {
              // Try to parse module and action from permission name/code
              const parts = (perm.code || perm.name || '').split(':');
              const moduleName = parts[0] || 'USER_MANAGEMENT';
              const action = parts[1] || 'read';
              
              return {
                id: perm.id.toString(),
                name: perm.name,
                description: perm.description || '',
                module: mapModuleName(moduleName),
                action: action as any
              };
            });
          } else if (typeof permissionsRes.data === 'object' && permissionsRes.data !== null) {
            // Grouped permissions endpoint response - use permissionsByModule
            const data = permissionsRes.data as any;
            if (data.permissionsByModule) {
              apiPermissions = Object.entries(data.permissionsByModule).flatMap(([moduleName, perms]) => {
                // Ensure perms is an array
                if (!Array.isArray(perms)) {
                  console.warn(`Module ${moduleName} permissions is not an array:`, perms);
                  return [];
                }
                
                return perms.map(perm => {
                  // Parse action from permission name (e.g., "user_management:create" -> "create")
                  const parts = perm.name.split(':');
                  const action = parts[1] || 'read';
                  
                  return {
                    id: perm.id.toString(),
                    name: perm.name,
                    description: perm.description || '',
                    module: mapModuleName(moduleName),
                    action: action as any
                  };
                });
              });
            } else {
              // Fallback to flat permissions array if permissionsByModule doesn't exist
              const flatPermissions = data.permissions || [];
              apiPermissions = flatPermissions.map(perm => {
                const parts = perm.name.split(':');
                const moduleName = parts[0] || 'user_management';
                const action = parts[1] || 'read';
                
                return {
                  id: perm.id.toString(),
                  name: perm.name,
                  description: perm.description || '',
                  module: mapModuleName(moduleName),
                  action: action as any
                };
              });
            }
          } else {
            console.error('Unexpected permissions data structure:', permissionsRes.data);
            throw new Error('Invalid permissions data structure');
          }
          
          setPermissions(apiPermissions);
        } else {
          // Fallback to mock permissions if API fails
    const mockPermissions: Permission[] = [
      // Performance Management
      { id: 'perf_mgmt:create', name: 'Create Performance Contract', description: 'Create new performance contracts', module: PermissionModule.PERFORMANCE_MANAGEMENT, action: 'create' as any },
      { id: 'perf_mgmt:read', name: 'View Performance Contracts', description: 'View performance contracts', module: PermissionModule.PERFORMANCE_MANAGEMENT, action: 'read' as any },
      { id: 'perf_mgmt:update', name: 'Update Performance Contract', description: 'Update performance contracts', module: PermissionModule.PERFORMANCE_MANAGEMENT, action: 'update' as any },
      { id: 'perf_mgmt:delete', name: 'Delete Performance Contract', description: 'Delete performance contracts', module: PermissionModule.PERFORMANCE_MANAGEMENT, action: 'delete' as any },
      
      // User Management
      { id: 'user_mgmt:create', name: 'Create User', description: 'Create new users', module: PermissionModule.USER_MANAGEMENT, action: 'create' as any },
      { id: 'user_mgmt:read', name: 'View Users', description: 'View user information', module: PermissionModule.USER_MANAGEMENT, action: 'read' as any },
      { id: 'user_mgmt:update', name: 'Update User', description: 'Update user information', module: PermissionModule.USER_MANAGEMENT, action: 'update' as any },
      { id: 'user_mgmt:delete', name: 'Delete User', description: 'Delete users', module: PermissionModule.USER_MANAGEMENT, action: 'delete' as any },
      
      // Appraisals
      { id: 'appraisals:create', name: 'Create Appraisal', description: 'Create new appraisals', module: PermissionModule.APPRAISALS, action: 'create' as any },
      { id: 'appraisals:read', name: 'View Appraisals', description: 'View appraisal data', module: PermissionModule.APPRAISALS, action: 'read' as any },
      { id: 'appraisals:update', name: 'Update Appraisal', description: 'Update appraisal data', module: PermissionModule.APPRAISALS, action: 'update' as any },
      { id: 'appraisals:approve', name: 'Approve Appraisal', description: 'Approve appraisals', module: PermissionModule.APPRAISALS, action: 'approve' as any },
      
      // Reports
      { id: 'reports:read', name: 'View Reports', description: 'Access reporting features', module: PermissionModule.REPORTS_ANALYTICS, action: 'read' as any },
      { id: 'reports:export', name: 'Export Reports', description: 'Export report data', module: PermissionModule.REPORTS_ANALYTICS, action: 'export' as any }
    ];
    setPermissions(mockPermissions);
        }
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredRoles = roles.filter(role => {
    const desc = (role.description || '').toLowerCase();
    const matchesSearch = role.name.toLowerCase().includes(filters.search.toLowerCase()) || desc.includes(filters.search.toLowerCase());
    const rolePerms = (role.permissions || []).map(p => (typeof p === 'string' ? p : p.name || ''));
    const matchesModule = filters.module === null || rolePerms.some(perm => perm.startsWith(`${filters.module}:`));
    return matchesSearch && matchesModule;
  });

  const handleCreateRole = async () => {
    if (!formData.name.trim()) { toast.error('Role name is required'); return; }
    setIsSaving(true);
    try {
      const res = await apiService.createRole({ name: formData.name.trim(), description: formData.description?.trim() });
      if (res.success && res.data) {
        const created = res.data;
        if (formData.permissions && formData.permissions.length > 0) {
          // Get permission names from the selected permission IDs
          if (!permissions || permissions.length === 0) {
            console.error('No permissions available for role creation');
            toast.error('No permissions available. Please refresh the page.');
            return;
          }
          
          const selectedPermissions = permissions.filter(perm => 
            formData.permissions.includes(perm.id.toString())
          );
          const permissionNames = selectedPermissions.map(perm => perm.name);
          
          await apiService.assignPermissionsToRoleByName(created.id, { 
            permissionNames: permissionNames 
          });
        }
        const list = await apiService.getRoles();
        if (list.success && list.data) setRoles(list.data);
        toast.success('Role created successfully');
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        toast.error('Failed to create role');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;
    if (!formData.name.trim()) { toast.error('Role name is required'); return; }
    setIsSaving(true);
    
    
    try {
      // First update the role basic info
      const res = await apiService.updateRole(selectedRole.id, { 
        name: formData.name.trim(), 
        description: formData.description?.trim() 
      });
      
      if (res.success && res.data) {
        // Then assign permissions to the role by name
        // Get permission names from the selected permission IDs
        if (!permissions || permissions.length === 0) {
          toast.error('No permissions available. Please refresh the page.');
          return;
        }
        
        const selectedPermissions = permissions.filter(perm => 
          formData.permissions.includes(perm.id.toString())
        );
        
        const permissionNames = selectedPermissions.map(perm => perm.name);
        
        const permissionRes = await apiService.assignPermissionsToRoleByName(res.data.id, { 
          permissionNames: permissionNames
        });
        
        
        if (permissionRes.success) {
          // Refresh the roles list
          const list = await apiService.getRoles();
          if (list.success && list.data) setRoles(list.data);
          toast.success('Role updated successfully');
          setIsEditModalOpen(false);
          setSelectedRole(null);
          resetForm();
        } else {
          toast.error('Failed to assign permissions to role');
        }
      } else {
        toast.error('Failed to update role');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      const res = await apiService.deleteRole(selectedRole.id);
      if (res.success) {
    setRoles(roles.filter(role => role.id !== selectedRole.id));
        toast.success('Role deleted');
      } else {
        toast.error('Failed to delete role');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete role');
    } finally {
      setIsSaving(false);
    setIsDeleteDialogOpen(false);
    setSelectedRole(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const openEditModal = async (role: ApiRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    
    try {
      // Fetch the full role details with permissions
      const res = await apiService.getRole(role.id);
      if (res.success && res.data) {
        const roleWithPermissions = res.data;
        
        // Extract permission names properly (API returns permission names, not IDs)
        let permissionNames: string[] = [];
        
        // Check if permissions exist and are in different possible formats
        if (roleWithPermissions.permissions) {
          if (Array.isArray(roleWithPermissions.permissions)) {
            permissionNames = roleWithPermissions.permissions.map(p => {
              if (typeof p === 'string') {
                return p;
              } else if (typeof p === 'object' && p && 'name' in p) {
                return (p as any).name;
              }
              return '';
            }).filter(name => name !== '');
          } else if (typeof roleWithPermissions.permissions === 'object') {
            // If permissions is an object, try to extract names from it
            permissionNames = Object.values(roleWithPermissions.permissions).map(p => {
              if (typeof p === 'string') {
                return p;
              } else if (typeof p === 'object' && p && 'name' in p) {
                return (p as any).name;
              }
              return '';
            }).filter(name => name !== '');
          }
        }
        
        // If no permissions found in the role data, try to get them from the existing role object
        if (permissionNames.length === 0 && role.permissions) {
          if (Array.isArray(role.permissions)) {
            permissionNames = role.permissions.map(p => {
              if (typeof p === 'string') {
                return p;
              } else if (typeof p === 'object' && p.name) {
                return p.name;
              }
              return '';
            }).filter(name => name !== '');
          }
        }
        
        // Convert permission names to IDs for form data
        const permissionIds = permissionNames.map(name => {
          const perm = permissions.find(p => p.name === name);
          return perm ? perm.id.toString() : '';
        }).filter(id => id !== '');
        
        setFormData({
          name: roleWithPermissions.name,
          description: roleWithPermissions.description || '',
          permissions: permissionIds
        });
        
        setIsEditModalOpen(true);
      } else {
        toast.error('Failed to load role details');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load role details');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (role: ApiRole) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const mapModuleName = (moduleName: string): PermissionModule => {
    const moduleMap: Record<string, PermissionModule> = {
      // Direct matches
      'user_management': PermissionModule.USER_MANAGEMENT,
      'performance_management': PermissionModule.PERFORMANCE_MANAGEMENT,
      'post_management': PermissionModule.POST_MANAGEMENT,
      'department_management': PermissionModule.ORG_STRUCTURE,
      'reports': PermissionModule.REPORTS_ANALYTICS,
      'role_management': PermissionModule.USER_MANAGEMENT, // Map to closest match
      'system_admin': PermissionModule.SYSTEM_CONFIGURATION,
      
      // Map new modules to closest existing ones
      'audit': PermissionModule.SYSTEM_CONFIGURATION,
      'dashboard': PermissionModule.USER_MANAGEMENT,
      'data': PermissionModule.SYSTEM_CONFIGURATION,
      'integration': PermissionModule.SYSTEM_CONFIGURATION,
      'profile': PermissionModule.USER_MANAGEMENT,
      'security': PermissionModule.SYSTEM_CONFIGURATION,
      'workflow': PermissionModule.USER_MANAGEMENT,
      
      // Legacy mappings for backward compatibility
      'USER_MANAGEMENT': PermissionModule.USER_MANAGEMENT,
      'PERFORMANCE_MANAGEMENT': PermissionModule.PERFORMANCE_MANAGEMENT,
      'APPRAISALS': PermissionModule.APPRAISALS,
      'REPORTS_ANALYTICS': PermissionModule.REPORTS_ANALYTICS,
      'ORG_STRUCTURE': PermissionModule.ORG_STRUCTURE,
      'SYSTEM_CONFIGURATION': PermissionModule.SYSTEM_CONFIGURATION,
      'POST_MANAGEMENT': PermissionModule.POST_MANAGEMENT,
      'KRA_KPI_MANAGEMENT': PermissionModule.KRA_KPI_MANAGEMENT,
      'WORKING_YEAR': PermissionModule.WORKING_YEAR,
      'APPRAISAL_SETTINGS': PermissionModule.APPRAISAL_SETTINGS
    };
    
    return moduleMap[moduleName.toLowerCase()] || moduleMap[moduleName.toUpperCase()] || PermissionModule.USER_MANAGEMENT;
  };

  const getModulePermissions = (module: PermissionModule) => {
    return permissions.filter(perm => perm.module === module);
  };

  // Get unique modules from actual permissions data
  const getUniqueModules = () => {
    const moduleSet = new Set(permissions.map(perm => perm.module));
    return Array.from(moduleSet);
  };

  // Format module name for display
  const formatModuleName = (module: PermissionModule) => {
    const moduleDisplayNames: Record<PermissionModule, string> = {
      [PermissionModule.PERFORMANCE_MANAGEMENT]: 'Performance Management',
      [PermissionModule.ORG_STRUCTURE]: 'Department Management',
      [PermissionModule.APPRAISALS]: 'Appraisals',
      [PermissionModule.REPORTS_ANALYTICS]: 'Reports & Analytics',
      [PermissionModule.SYSTEM_CONFIGURATION]: 'System Administration',
      [PermissionModule.USER_MANAGEMENT]: 'User Management',
      [PermissionModule.POST_MANAGEMENT]: 'Post Management',
      [PermissionModule.KRA_KPI_MANAGEMENT]: 'KRA & KPI Management',
      [PermissionModule.WORKING_YEAR]: 'Working Year',
      [PermissionModule.APPRAISAL_SETTINGS]: 'Appraisal Settings'
    };
    
    return moduleDisplayNames[module] || module.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const groupedPermissions = getUniqueModules()
    .map(module => ({
      module,
      permissions: getModulePermissions(module)
    }))
    .filter(group => group.permissions.length > 0); // Only show modules with permissions


  // Handle select all for a module
  const handleSelectAllForModule = (module: PermissionModule, modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map(p => p.id.toString());
    const allSelected = modulePermissionIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all permissions in this module
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(id => !modulePermissionIds.includes(id))
      });
    } else {
      // Select all permissions in this module
      const newPermissions = [...new Set([...formData.permissions, ...modulePermissionIds])];
      setFormData({
        ...formData,
        permissions: newPermissions
      });
    }
  };

  // Check if all permissions in a module are selected
  const isAllSelectedForModule = (modulePermissions: Permission[]) => {
    if (modulePermissions.length === 0) return false;
    const modulePermissionIds = modulePermissions.map(p => p.id.toString());
    return modulePermissionIds.every(id => formData.permissions.includes(id));
  };

  // Handle select all permissions globally
  const handleSelectAll = () => {
    const allPermissionIds = permissions.map(p => p.id.toString());
    const allSelected = allPermissionIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all permissions
      setFormData({
        ...formData,
        permissions: []
      });
    } else {
      // Select all permissions
      setFormData({
        ...formData,
        permissions: allPermissionIds
      });
    }
  };

  // Check if all permissions are selected globally
  const isAllSelected = () => {
    if (permissions.length === 0) return false;
    const allPermissionIds = permissions.map(p => p.id.toString());
    return allPermissionIds.every(id => formData.permissions.includes(id));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Roles Management"
          subtitle="Manage user roles and permissions"
          right={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : roles.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Roles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : roles.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {permissionsLoading ? '...' : permissions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <EyeOff className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive Roles</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search roles..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.isActive === null ? 'all' : filters.isActive.toString()}
                  onValueChange={(value) => setFilters({ 
                    ...filters, 
                    isActive: value === 'all' ? null : value === 'true' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="module">Module</Label>
                <Select
                  value={filters.module || 'all'}
                  onValueChange={(value) => setFilters({ 
                    ...filters, 
                    module: value === 'all' ? null : value as PermissionModule 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {Object.values(PermissionModule).map(module => (
                      <SelectItem key={module} value={module}>
                        {module.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Roles ({filteredRoles.length})</CardTitle>
            <CardDescription>Manage system roles and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && <div className="text-sm text-muted-foreground">Loading roles...</div>}
              {!isLoading && filteredRoles.map((role) => (
                <div key={role.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{role.name}</h3>
                      </div>
                      <p className="text-gray-600 mt-1">{role.description || ''}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(role.permissions || []).slice(0, 3).map((permission, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {typeof permission === 'string' ? permission : (permission.name || permission.code || permission.id)}
                          </Badge>
                        ))}
                        {(role.permissions || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(role.permissions || []).length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(role)}
                        disabled={isLoading}
                        className="text-blue-600"
                        title="Edit Role"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(role)}
                          className="text-red-600"
                        title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-slide-down absolute top-4 right-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {isCreateModalOpen ? 'Create New Role' : 'Edit Role'}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  {isLoading && isEditModalOpen && (
                    <div className="text-center py-4">
                      <div className="text-sm text-muted-foreground">Loading role details...</div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter role name"
                      disabled={isLoading && isEditModalOpen}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter role description"
                      disabled={isLoading && isEditModalOpen}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Label>Permissions</Label>
                        <span className="text-xs text-gray-500">
                          ({formData.permissions.length} of {permissions.length} selected)
                        </span>
                      </div>
                      <label className="flex items-center space-x-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={isAllSelected()}
                          onChange={handleSelectAll}
                          disabled={permissionsLoading || (isLoading && isEditModalOpen)}
                          className="rounded"
                        />
                        <span>Select All Permissions</span>
                      </label>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                      {permissionsLoading ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Loading permissions...
                        </div>
                      ) : permissions.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          No permissions available. Please refresh the page.
                        </div>
                      ) : (
                        groupedPermissions.map(({ module, permissions: modulePermissions }) => (
                        <div key={module} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-gray-700">
                              {formatModuleName(module)}
                            </h4>
                            <label className="flex items-center space-x-2 text-xs text-gray-600">
                              <input
                                type="checkbox"
                                checked={isAllSelectedForModule(modulePermissions)}
                                onChange={() => handleSelectAllForModule(module, modulePermissions)}
                                disabled={isLoading && isEditModalOpen}
                                className="rounded"
                              />
                              <span>Select All</span>
                            </label>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {modulePermissions.map((permission) => {
                              const isChecked = formData.permissions.includes(permission.id.toString());
                              
                              return (
                                <label key={permission.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      console.log(`Toggling permission ${permission.name}: ${e.target.checked}`);
                                      if (e.target.checked) {
                                        setFormData({
                                          ...formData,
                                          permissions: [...formData.permissions, permission.id.toString()]
                                        });
                                      } else {
                                        setFormData({
                                          ...formData,
                                          permissions: formData.permissions.filter(p => p !== permission.id.toString())
                                        });
                                      }
                                    }}
                                    disabled={isLoading && isEditModalOpen}
                                    className="rounded"
                                  />
                                  <span className="text-sm">{permission.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsEditModalOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={isCreateModalOpen ? handleCreateRole : handleEditRole}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (isCreateModalOpen ? 'Creating...' : 'Updating...') : (isCreateModalOpen ? 'Create Role' : 'Update Role')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteRole}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </Layout>
  );
};

export default RolesManagement;