import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalHeader, ModalFooter } from '@/components/ui/modal';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import DataTable, { Column } from '@/components/ui/data-table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  Plus, 
  Download, 
  Users,
  Briefcase,
  Calendar,
  UserCheck,
  UserX,
  History,
  ArrowLeft,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  XCircle
} from 'lucide-react';
import { PostOccupancy as PostOccupancyType, PostOccupancyFormData, Post } from '@/types/post';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { useDataTable } from '@/hooks/useDataTable';

const PostOccupancy: React.FC = () => {
  const navigate = useNavigate();
  const [occupancies, setOccupancies] = useState<PostOccupancyType[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedOccupancy, setSelectedOccupancy] = useState<PostOccupancyType | null>(null);
  const [selectedPostForHistory, setSelectedPostForHistory] = useState<Post | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive' | 'warning' | 'success';
  } | null>(null);
  const [formData, setFormData] = useState<PostOccupancyFormData>({
    postId: '',
    officerId: '',
    notes: ''
  });
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Filter occupancies based on status
  const filteredOccupancies = React.useMemo(() => {
    let filtered = occupancies;
    
    if (statusFilter) {
      filtered = filtered.filter(occupancy => {
        if (statusFilter === 'active') return occupancy.isActive;
        if (statusFilter === 'inactive') return !occupancy.isActive;
        return true;
      });
    }
    
    return filtered;
  }, [occupancies, statusFilter]);

  // Use the data table hook
  const {
    filteredData: searchFilteredOccupancies,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    currentData,
    handleSort,
    sortField,
    sortDirection
  } = useDataTable({
    data: filteredOccupancies,
    searchFields: ['postName', 'officerName'],
    initialPageSize: 10
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

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
          toast.error('Posts Loading Failed', {
            description: errorMessage
          });
          console.error('Posts API error:', postsRes.error);
        }

        // Load occupancies
        const occupanciesRes = await apiService.getPostOccupancies();
        if (occupanciesRes.success && occupanciesRes.data) {
          setOccupancies(occupanciesRes.data);
        } else {
          const errorMessage = occupanciesRes.error?.message || 'Failed to load post occupancies';
          toast.error('Occupancies Loading Failed', {
            description: errorMessage
          });
          console.error('Occupancies API error:', occupanciesRes.error);
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
        
        toast.error('Connection Error', {
          description: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Load officers without posts when assign modal opens
  useEffect(() => {
    if (showAssignModal && officers.length === 0) {
      loadOfficersWithoutPosts();
    }
  }, [showAssignModal]);

  const loadOfficersWithoutPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getOfficers({ 
        status: 'active',
        limit: 1000,
        sortBy: 'firstName',
        sortOrder: 'asc'
      });
      
      if (response.success && response.data) {
        // Filter officers who don't have a current post assigned
        const officersWithoutPosts = response.data.filter(officer => !officer.post || officer.post === '');
        setOfficers(officersWithoutPosts);
      }
    } catch (error) {
      console.error('Error loading officers:', error);
      toast.error('Failed to load officers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignOfficer = () => {
    if (!formData.postId || !selectedOfficer) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const post = posts.find(p => p.id === formData.postId);
    
    if (!post) {
      toast.error('Invalid post selection');
      return;
    }

      setConfirmAction({
      title: 'Assign Officer to Post',
      message: `Are you sure you want to assign ${selectedOfficer.firstName} ${selectedOfficer.lastName} (${selectedOfficer.ippis}) to ${post.name}?`,
      onConfirm: async () => {
        try {
          setIsSaving(true);
          const startDateIso = new Date().toISOString();
          const res = await apiService.createPostOccupancy({
            ...formData,
            officerId: selectedOfficer.id,
            startDate: startDateIso
          });
          if (res.success && res.data) {
            // Refresh data
            const occupanciesRes = await apiService.getPostOccupancies();
            if (occupanciesRes.success && occupanciesRes.data) {
              setOccupancies(occupanciesRes.data);
            }
            
            // Update post occupancy status
            const postsRes = await apiService.getPosts();
            if (postsRes.success && postsRes.data) {
              setPosts(postsRes.data);
            }
            
            toast.success('Officer assigned successfully');
            setShowAssignModal(false);
            setShowConfirmDialog(false);
            setFormData({ postId: '', officerId: '', notes: '' });
            setSelectedOfficer(null);
          } else {
            toast.error('Failed to assign officer');
          }
        } catch (error: any) {
          toast.error(error?.message || 'Failed to assign officer');
        } finally {
          setIsSaving(false);
        }
      },
      variant: 'default'
    });
    setShowConfirmDialog(true);
  };

  const handleEndAssignment = (occupancyId: string) => {
    setConfirmAction({
      title: 'End Assignment',
      message: 'Are you sure you want to end this assignment? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setIsSaving(true);
          const res = await apiService.endPostOccupancy(occupancyId, {
            endDate: new Date().toISOString().split('T')[0],
            notes: 'Assignment ended by admin'
          });
          
          if (res.success) {
            // Refresh data
            const occupanciesRes = await apiService.getPostOccupancies();
            if (occupanciesRes.success && occupanciesRes.data) {
              setOccupancies(occupanciesRes.data);
            }
            
            // Update post occupancy status
            const postsRes = await apiService.getPosts();
            if (postsRes.success && postsRes.data) {
              setPosts(postsRes.data);
            }
            
            toast.success('Assignment ended successfully');
          } else {
            toast.error('Failed to end assignment');
          }
        } catch (error: any) {
          toast.error(error?.message || 'Failed to end assignment');
        } finally {
          setIsSaving(false);
        }
      },
      variant: 'destructive'
    });
    setShowConfirmDialog(true);
  };

  const handleViewHistory = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
    setSelectedPostForHistory(post);
    setShowHistoryModal(true);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Ended</Badge>
    );
  };

  // Define table columns
  const columns: Column<PostOccupancyType>[] = [
    {
      key: 'postName',
      title: 'Post',
      dataIndex: 'postName',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'officerName',
      title: 'Officer',
      dataIndex: 'officerName',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{record.officerIppis}</div>
          </div>
        </div>
      )
    },
    {
      key: 'assignmentPeriod',
      title: 'Assignment Period',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <div>{new Date(record.startDate).toLocaleDateString()}</div>
            {record.endDate && (
              <div className="text-gray-500">
                to {new Date(record.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      sortable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'notes',
      title: 'Notes',
      dataIndex: 'notes',
      render: (value) => <span className="text-sm text-gray-900">{value || 'No notes'}</span>
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewHistory(String(record.postId))}
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
            title="View History"
          >
            <History className="w-4 h-4" />
          </Button>
          {record.isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEndAssignment(String(record.id))}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
              title="End Assignment"
            >
              <UserX className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];


  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Breadcrumbs */}
        <div className="px-6 py-2">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <a href="/manage-posts" className="hover:text-gray-700">Manage Posts</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">Post Occupancy</li>
            </ol>
          </nav>
        </div>

        {/* Header */}
        <PageHeader 
          title="Post Occupancy Management" 
          subtitle="Manage officer assignments to posts"
          right={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/manage-posts')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => setShowAssignModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Assign Officer
              </Button>
            </>
          }
        />

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search occupancies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                      <Users className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Occupancies</p>
                      <p className="text-2xl font-bold text-gray-900">{occupancies.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {occupancies.filter(o => o.isActive).length}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <UserX className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Ended Assignments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {occupancies.filter(o => !o.isActive).length}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Available Posts</p>
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

        {/* Occupancies List */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Card className="overflow-hidden">
              {/* Table Header with Controls */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">Post Occupancies</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                      {searchFilteredOccupancies.length} total
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
                        onClick={() => handleSort('postName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Post Name</span>
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${sortField === 'postName' && sortDirection === 'asc' ? 'text-primary' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 ${sortField === 'postName' && sortDirection === 'desc' ? 'text-primary' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('officerName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Officer</span>
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${sortField === 'officerName' && sortDirection === 'asc' ? 'text-primary' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 ${sortField === 'officerName' && sortDirection === 'desc' ? 'text-primary' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Assignment Period
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Notes
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
                          <td className="px-6 py-4" colSpan={6}>
                            <div className="animate-pulse h-4 bg-slate-200 rounded w-full" />
                          </td>
                        </tr>
                      ))
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
                            {occupancies.length === 0 ? (
                              <>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load occupancies</h3>
                                <p className="text-gray-500 mb-4">There was an error loading occupancies from the server.</p>
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
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No occupancies found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((occupancy) => (
                        <tr key={occupancy.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 sticky left-0 z-10 bg-white">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {occupancy.postName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium">{occupancy.officerName}</div>
                                <div className="text-xs text-gray-500">{occupancy.officerIppis}</div>
                                </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium">
                                  {new Date(occupancy.startDate).toLocaleDateString()}
                                </div>
                                {occupancy.endDate && (
                                  <div className="text-xs text-gray-500">
                                    to {new Date(occupancy.endDate).toLocaleDateString()}
                                </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(occupancy.isActive)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                            <div className="truncate" title={occupancy.notes || 'No notes'}>
                              {occupancy.notes || 'No notes'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 z-10 bg-white">
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewHistory(String(occupancy.postId))}
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                                title="View History"
                              >
                                <History className="w-4 h-4" />
                              </Button>
                              {occupancy.isActive && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEndAssignment(String(occupancy.id))}
                                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                  title="End Assignment"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-700">
                      <span>
                        Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                        <span className="font-semibold">{Math.min(endIndex, searchFilteredOccupancies.length)}</span> of{' '}
                        <span className="font-semibold">{searchFilteredOccupancies.length}</span> results
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

        {/* Assign Officer Modal */}
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Officer to Post"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="postId">Select Post</Label>
              <select
                id="postId"
                value={formData.postId}
                onChange={(e) => setFormData({ ...formData, postId: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a post</option>
                {posts.filter(p => !p.isOccupied).map(post => (
                  <option key={post.id} value={post.id}>
                    {post.name} - {post.orgUnitName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="officerSelect">Select Officer</Label>
              <select
                id="officerSelect"
                value={selectedOfficer?.id || ''}
                onChange={(e) => {
                  const officer = officers.find(o => o.id === e.target.value);
                  setSelectedOfficer(officer || null);
                }}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an officer</option>
                {officers.map(officer => (
                  <option key={officer.id} value={officer.id}>
                    {officer.firstName} {officer.lastName} ({officer.ippis})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add any notes about this assignment..."
              />
            </div>
            </div>
            
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setShowAssignModal(false)}
              disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
              onClick={handleAssignOfficer}
              disabled={isSaving || !formData.postId || !selectedOfficer}
            >
              {isSaving ? 'Assigning...' : 'Assign Officer'}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title={confirmAction?.title || ''}
          message={confirmAction?.message || ''}
          onConfirm={confirmAction?.onConfirm || (() => {})}
          variant={confirmAction?.variant || 'default'}
        />
      </div>
    </Layout>
  );
};

export default PostOccupancy;