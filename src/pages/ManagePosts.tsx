import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalHeader, ModalFooter } from '@/components/ui/modal';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import DataTable, { Column } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/useDataTable';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Building2,
  Users,
  Target,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Briefcase,
  History
} from 'lucide-react';
import { Post, PostFormData, PostFilters, MDA, OrgUnit, SystemRole } from '@/types/post';
import { apiService } from '@/services/api';
import { toast } from '@/utils/toast';
import PageHeader from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';

const ManagePosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState<PostFilters>({
    search: '',
    mda: '',
    orgUnit: '',
    status: '',
    isOccupied: '',
    gradeLevel: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sortField, setSortField] = useState<keyof Post>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive' | 'warning' | 'success';
  } | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    name: '',
    description: '',
    gradeLevel: '',
    orgUnitId: '',
    status: 'active',
    roleId: ''
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  // Filter posts based on filters
  const filteredPosts = React.useMemo(() => {
    let filtered = posts;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(post => 
        post.name.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.orgUnitName?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(post => post.status === filters.status);
    }
    
    if (filters.isOccupied) {
      const isOccupied = filters.isOccupied === 'occupied';
      filtered = filtered.filter(post => post.isOccupied === isOccupied);
    }
    
    if (filters.gradeLevel) {
      filtered = filtered.filter(post => post.gradeLevel === filters.gradeLevel);
    }
    
    return filtered;
  }, [posts, filters]);

  // Use the data table hook
  const {
    filteredData: searchFilteredPosts,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    currentData,
    handleSort: dataTableHandleSort,
    sortField: dataTableSortField,
    sortDirection: dataTableSortDirection
  } = useDataTable({
    data: filteredPosts,
    searchFields: ['name', 'description', 'orgUnitName'],
    initialPageSize: 10
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Helper function to get role permissions
  const getRolePermissions = (roleId: string) => {
    const role = roles.find(r => String(r.id) === String(roleId));
    const permissions = role?.permissions || [];
    return permissions;
  };

  // Define columns for DataTable
  const columns: Column<Post>[] = [
    {
      key: 'name',
      title: 'Post Name',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {record.name}
          </div>
          {record.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs" title={record.description}>
              {record.description}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'orgUnitName',
      title: 'Organizational Unit',
      dataIndex: 'orgUnitName',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
          {value}
        </div>
      )
    },
    {
      key: 'gradeLevel',
      title: 'Grade Level',
      dataIndex: 'gradeLevel',
      render: (value) => value || 'N/A'
    },
    {
      key: 'roleId',
      title: 'Assigned Role',
      dataIndex: 'roleId',
      render: (value, record) => {
        if (!value) {
          return <span className="text-gray-400 italic">No role assigned</span>;
        }
        return (
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-blue-500 mr-2" />
            <div>
              <div className="font-medium">{record.roleName || 'Unknown Role'}</div>
              <div className="text-xs text-gray-500">
                {getRolePermissions(String(value)).length} permissions
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'isOccupied',
      title: 'Occupancy',
      dataIndex: 'isOccupied',
      sortable: true,
      render: (value, record) => (
        <div>
          {getOccupancyBadge(value)}
          {value && record.assignedOfficerName && (
            <div className="text-xs text-gray-500 mt-1">
              {record.assignedOfficerName}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPost(record)}
            className="h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-700"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/post-occupancy?postId=${String(record.id)}`)}
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
            title="View Assignment History"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditPost(record)}
            className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
            title="Edit Post"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(String(record.id))}
            className={`h-8 w-8 p-0 ${
              record.status === 'active' 
                ? 'hover:bg-red-100 hover:text-red-700' 
                : 'hover:bg-emerald-100 hover:text-emerald-700'
            }`}
            title={record.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {record.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </Button>
        </div>
      )
    }
  ];

  // Mock data
  const [mdas] = useState<MDA[]>([
    { id: '1', name: 'TETFund', code: 'TETFUND', status: 'active' },
    { id: '2', name: 'Ministry of Education', code: 'MOE', status: 'active' },
    { id: '3', name: 'Ministry of Health', code: 'MOH', status: 'active' }
  ]);

  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string; type: 'DEPT' | 'DIV' | 'BRANCH' }>>([]);
  const [orgUnitsLoading, setOrgUnitsLoading] = useState(false);

  const [systemRoles] = useState<SystemRole[]>([
    { id: '1', name: 'Reviewer', description: 'Can review documents', permissions: ['read', 'review'], status: 'active' },
    { id: '2', name: 'Approver', description: 'Can approve documents', permissions: ['read', 'review', 'approve'], status: 'active' },
    { id: '3', name: 'Admin', description: 'Full administrative access', permissions: ['read', 'write', 'delete', 'admin'], status: 'active' }
  ]);


  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load posts
        const postsRes = await apiService.getPosts();
        if (postsRes.success && postsRes.data) {
          setPosts(postsRes.data);
        } else {
          const errorMessage = postsRes.error?.message || 'Failed to load posts';
          toast.error('Posts Loading Failed', errorMessage);
          console.error('Posts API error:', postsRes.error);
        }

        // Load org units (flat list) - fetch by types explicitly
        try {
          setOrgUnitsLoading(true);
          const [depts, divs, branches] = await Promise.all([
            apiService.getOrganizationalUnits({ type: 'DEPT', pageSize: 1000, sortBy: 'name', sortOrder: 'asc' } as any),
            apiService.getOrganizationalUnits({ type: 'DIV', pageSize: 1000, sortBy: 'name', sortOrder: 'asc' } as any),
            apiService.getOrganizationalUnits({ type: 'BRANCH', pageSize: 1000, sortBy: 'name', sortOrder: 'asc' } as any),
          ]);
          const collect = (res: any) => (res?.data?.units || []).map((u: any) => ({ id: String(u.id), name: u.name, type: (u.type || '').toUpperCase() }));
          const combined = [...collect(depts), ...collect(divs), ...collect(branches)];
          setOrgUnits(combined);
        } catch (e) {
          console.warn('Failed to load organizational units', e);
        } finally {
          setOrgUnitsLoading(false);
        }

        // Load roles
        const rolesRes = await apiService.getRoles();
        if (rolesRes.success && rolesRes.data) {
          // Load detailed role information with permissions for each role
          const rolesWithPermissions = await Promise.all(
            rolesRes.data.map(async (role: any) => {
              try {
                const roleDetailRes = await apiService.getRole(role.id);
                if (roleDetailRes.success && roleDetailRes.data) {
                  return roleDetailRes.data;
                }
                return role; // Fallback to basic role info
              } catch (error) {
                console.error(`Failed to load details for role ${role.id}:`, error);
                return role; // Fallback to basic role info
              }
            })
          );
          setRoles(rolesWithPermissions);
        } else {
          const errorMessage = rolesRes.error?.message || 'Failed to load roles';
          toast.error('Roles Loading Failed', errorMessage);
          console.error('Roles API error:', rolesRes.error);
        }
      } catch (error: any) {
        console.error('API error:', error);
        let errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        
        if (error instanceof Error) {
          if (error.message.includes('Network error')) {
            errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network request failed. Please check your internet connection.';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast.error('Connection Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Ensure org units are loaded when opening create/edit modal (in case initial load was skipped)
  useEffect(() => {
    const loadIfNeeded = async () => {
      if ((showCreateModal || showEditModal) && orgUnits.length === 0 && !orgUnitsLoading) {
        try {
          setOrgUnitsLoading(true);
          const [depts, divs, branches] = await Promise.all([
            apiService.getOrganizationalUnits({ type: 'DEPT', pageSize: 1000, sortBy: 'name', sortOrder: 'asc' } as any),
            apiService.getOrganizationalUnits({ type: 'DIV', pageSize: 1000, sortBy: 'name', sortOrder: 'asc' } as any),
            apiService.getOrganizationalUnits({ type: 'BRANCH', pageSize: 1000, sortBy: 'name', sortOrder: 'asc' } as any),
          ]);
          const collect = (res: any) => (res?.data?.units || []).map((u: any) => ({ id: String(u.id), name: u.name, type: (u.type || '').toUpperCase() }));
          const combined = [...collect(depts), ...collect(divs), ...collect(branches)];
          setOrgUnits(combined);
        } catch (e) {
          console.warn('Failed to load organizational units (modal open)', e);
        } finally {
          setOrgUnitsLoading(false);
        }
      }
    };
    loadIfNeeded();
  }, [showCreateModal, showEditModal, orgUnits.length, orgUnitsLoading]);


  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Post name is required');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await apiService.createPost(formData);
      if (res.success && res.data) {
        // If a role is assigned, assign it to the post
        if (formData.roleId) {
          await apiService.assignRoleToPost(String(res.data.id), { roleId: formData.roleId });
        }
        
        // Refresh posts list
        const postsRes = await apiService.getPosts();
        if (postsRes.success && postsRes.data) {
          setPosts(postsRes.data);
        }
        
        toast.success('Post created successfully');
    setShowCreateModal(false);
    setFormData({
      name: '',
      description: '',
      gradeLevel: '',
      orgUnitId: '',
      status: 'active',
          roleId: ''
        });
      } else {
        toast.error('Failed to create post');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setFormData({
      name: post.name,
      description: post.description || '',
      gradeLevel: post.gradeLevel || '',
      orgUnitId: String(post.orgUnitId),
      status: post.status,
      roleId: post.roleId ? String(post.roleId) : ''
    });
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPost) return;
    if (!formData.name.trim()) {
      toast.error('Post name is required');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiService.updatePost(String(selectedPost.id), formData);
      if (res.success && res.data) {
        // Handle role assignment/removal
        if (formData.roleId && formData.roleId !== selectedPost.roleId) {
          // Assign new role
          await apiService.assignRoleToPost(String(selectedPost.id), { roleId: formData.roleId });
        } else if (!formData.roleId && selectedPost.roleId) {
          // Remove existing role
          await apiService.removeRoleFromPost(String(selectedPost.id));
        }
        
        // Refresh posts list
        const postsRes = await apiService.getPosts();
        if (postsRes.success && postsRes.data) {
          setPosts(postsRes.data);
        }
        
        toast.success('Post updated successfully');
    setShowEditModal(false);
    setSelectedPost(null);
      } else {
        toast.error('Failed to update post');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setConfirmAction({
      title: 'Delete Post',
      message: `Are you sure you want to delete the post "${post.name}"? This action cannot be undone and will affect any officers assigned to this post.`,
      onConfirm: async () => {
        try {
          const res = await apiService.deletePost(postId);
          if (res.success) {
            // Refresh posts list
            const postsRes = await apiService.getPosts();
            if (postsRes.success && postsRes.data) {
              setPosts(postsRes.data);
            }
            toast.success('Post deleted successfully');
          } else {
            toast.error('Failed to delete post');
          }
        } catch (error: any) {
          toast.error(error?.message || 'Failed to delete post');
        } finally {
        setShowConfirmDialog(false);
        setConfirmAction(null);
        }
      },
      variant: 'destructive'
    });
    setShowConfirmDialog(true);
  };

  const handleToggleStatus = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, status: post.status === 'active' ? 'inactive' : 'active' }
          : post
      )
    );
  };


  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    );
  };

  const getOccupancyBadge = (isOccupied: boolean) => {
    return isOccupied ? (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Occupied</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Vacant</Badge>
    );
  };



  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader 
          title="Manage Posts" 
          subtitle="Create, modify, and manage posts"
          right={
            <>
              <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-6 py-2">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">Manage Posts</li>
            </ol>
          </nav>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={filters.isOccupied}
                onChange={(e) => setFilters({...filters, isOccupied: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Posts</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse flex items-center">
                    <div className="p-4 bg-slate-200 rounded-lg w-10 h-10" />
                    <div className="ml-3 flex-1">
                      <div className="h-3 bg-slate-200 rounded w-24 mb-2" />
                      <div className="h-6 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {posts.filter(p => p.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Occupied</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {posts.filter(p => p.isOccupied).length}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Vacant</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {posts.filter(p => !p.isOccupied).length}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Card className="overflow-hidden">
              {/* Table Header with Controls */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                      {filteredPosts.length} total
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="items-per-page" className="text-sm text-gray-600">
                      Show:
                    </Label>
                    <select
                      id="items-per-page"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors sticky left-0 z-20 bg-gray-50"
                        onClick={() => dataTableHandleSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Post Name</span>
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${dataTableSortField === 'name' && dataTableSortDirection === 'asc' ? 'text-primary' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 ${dataTableSortField === 'name' && dataTableSortDirection === 'desc' ? 'text-primary' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => dataTableHandleSort('orgUnitName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Organizational Unit</span>
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${dataTableSortField === 'orgUnitName' && dataTableSortDirection === 'asc' ? 'text-primary' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 ${dataTableSortField === 'orgUnitName' && dataTableSortDirection === 'desc' ? 'text-primary' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Grade Level
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Assigned Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Occupancy
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky right-0 z-20 bg-gray-50">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4" colSpan={7}>
                            <div className="animate-pulse h-4 bg-slate-200 rounded w-full" />
                          </td>
                        </tr>
                      ))
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
                            {posts.length === 0 ? (
                              <>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load posts</h3>
                                <p className="text-gray-500 mb-4">There was an error loading posts from the server.</p>
                                <Button 
                                  onClick={() => window.location.reload()} 
                                  variant="outline"
                                  className="mt-2"
                                >
                                  Retry
                                </Button>
                              </>
                            ) : (
                              <>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 sticky left-0 z-10 bg-white">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {post.name}
                              </div>
                              {post.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs" title={post.description}>
                                  {post.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                              {post.orgUnitName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {post.gradeLevel || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {post.roleId ? (
                              <div className="flex items-center">
                                <Shield className="w-4 h-4 text-blue-500 mr-2" />
                                <div>
                                  <div className="font-medium">{post.roleName || 'Unknown Role'}</div>
                                  <div className="text-xs text-gray-500">
                                    {getRolePermissions(post.roleId ? String(post.roleId) : '').length} permissions
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No role assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getOccupancyBadge(post.isOccupied)}
                            {post.isOccupied && post.assignedOfficerName && (
                              <div className="text-xs text-gray-500 mt-1">
                                {post.assignedOfficerName}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 z-10 bg-white">
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPost(post)}
                                className="h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-700"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/post-occupancy?postId=${String(post.id)}`)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                                title="View Assignment History"
                              >
                                <History className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPost(post)}
                                className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
                                title="Edit Post"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(String(post.id))}
                                className={`h-8 w-8 p-0 ${
                                  post.status === 'active' 
                                    ? 'hover:bg-red-100 hover:text-red-700' 
                                    : 'hover:bg-emerald-100 hover:text-emerald-700'
                                }`}
                                title={post.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {post.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(String(post.id))}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                title="Delete Post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-700">
                      <span>
                        Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                        <span className="font-semibold">{Math.min(endIndex, filteredPosts.length)}</span> of{' '}
                        <span className="font-semibold">{filteredPosts.length}</span> results
                      </span>
                    </div>
                    
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Create Post Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Post"
          description="Define a new organizational post with its attributes and requirements"
        >
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Post Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Director, Human Resource"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description / Responsibilities
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter post description and key responsibilities"
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="gradeLevel" className="text-sm font-medium text-gray-700 mb-2 block">
                  Grade Level
                </Label>
                <select
                  id="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Grade Level</option>
                  <option value="GL 08">GL 08</option>
                  <option value="GL 09">GL 09</option>
                  <option value="GL 10">GL 10</option>
                  <option value="GL 12">GL 12</option>
                  <option value="GL 13">GL 13</option>
                  <option value="GL 14">GL 14</option>
                  <option value="GL 15">GL 15</option>
                  <option value="GL 16">GL 16</option>
                  <option value="GL 17">GL 17</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="orgUnitId" className="text-sm font-medium text-gray-700 mb-2 block">
                Organizational Unit *
              </Label>
              <select
                id="orgUnitId"
                value={formData.orgUnitId}
                onChange={(e) => setFormData({...formData, orgUnitId: e.target.value})}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select Organizational Unit</option>
                {orgUnits.map(unit => {
                  let levelName = '';
                  if (unit.id === '1') levelName = 'Board of Trustees';
                  else if (unit.id === '2') levelName = 'Executive Secretary';
                  else if (unit.type === 'DEPT') levelName = 'Department';
                  else if (unit.type === 'DIV') levelName = 'Division';
                  else if (unit.type === 'BRANCH') levelName = 'Branch';
                  
                  return (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({levelName})
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <Label htmlFor="roleId" className="text-sm font-medium text-gray-700 mb-2 block">
                Assigned Role
              </Label>
              <select
                id="roleId"
                value={formData.roleId || ''}
                onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a role (optional)</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a role to assign to this post. The post will inherit all permissions from the selected role.
              </p>
            </div>
            
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                Create Post
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Edit Post Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Post"
          description="Update post information and attributes"
        >
          <form onSubmit={handleUpdatePost} className="space-y-6">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700 mb-2 block">
                Post Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Director, Human Resource"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description / Responsibilities
              </Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter post description and key responsibilities"
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-gradeLevel" className="text-sm font-medium text-gray-700 mb-2 block">
                  Grade Level
                </Label>
                <select
                  id="edit-gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Grade Level</option>
                  <option value="GL 08">GL 08</option>
                  <option value="GL 09">GL 09</option>
                  <option value="GL 10">GL 10</option>
                  <option value="GL 12">GL 12</option>
                  <option value="GL 13">GL 13</option>
                  <option value="GL 14">GL 14</option>
                  <option value="GL 15">GL 15</option>
                  <option value="GL 16">GL 16</option>
                  <option value="GL 17">GL 17</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </Label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-orgUnitId" className="text-sm font-medium text-gray-700 mb-2 block">
                Organizational Unit *
              </Label>
              <select
                id="edit-orgUnitId"
                value={formData.orgUnitId}
                onChange={(e) => setFormData({...formData, orgUnitId: e.target.value})}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select Organizational Unit</option>
                {orgUnits.map(unit => {
                  let levelName = '';
                  if (unit.id === '1') levelName = 'Board of Trustees';
                  else if (unit.id === '2') levelName = 'Executive Secretary';
                  else if (unit.type === 'DEPT') levelName = 'Department';
                  else if (unit.type === 'DIV') levelName = 'Division';
                  else if (unit.type === 'BRANCH') levelName = 'Branch';
                  
                  return (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({levelName})
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <Label htmlFor="roleId" className="text-sm font-medium text-gray-700 mb-2 block">
                Assigned Role
              </Label>
              <select
                id="roleId"
                value={formData.roleId || ''}
                onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a role (optional)</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a role to assign to this post. The post will inherit all permissions from the selected role.
              </p>
            </div>
            
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                Update Post
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Confirmation Dialog */}
        {confirmAction && (
          <ConfirmationDialog
            isOpen={showConfirmDialog}
            onClose={() => {
              setShowConfirmDialog(false);
              setConfirmAction(null);
            }}
            onConfirm={confirmAction.onConfirm}
            title={confirmAction.title}
            message={confirmAction.message}
            variant={confirmAction.variant}
            confirmText="Yes, Continue"
            cancelText="Cancel"
          />
        )}
      </div>
    </Layout>
  );
};

export default ManagePosts;
