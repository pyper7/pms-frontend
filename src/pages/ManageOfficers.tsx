import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalHeader, ModalFooter } from '@/components/ui/modal';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
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
  Filter, 
  Download, 
  Upload,
  Users,
  UserPlus,
  FileSpreadsheet,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Key,
  Mail,
  Phone,
  Building2,
  Network,
  Target,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { Officer, OfficerFormData, OfficerFilters, BulkUploadResult } from '@/types/officer';
import { apiService } from '@/services/api';
import { toast } from '@/utils/toast';
import PageHeader from '@/components/PageHeader';
import DataTable, { Column } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/useDataTable';

const ManageOfficers: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>([]);
  const [filters, setFilters] = useState<OfficerFilters>({
    search: '',
    department: '',
    division: '',
    branch: '',
    post: '',
    cadre: '',
    status: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive' | 'warning' | 'success';
  } | null>(null);
  const [formData, setFormData] = useState<OfficerFormData>({
    ippis: '',
    firstName: '',
    lastName: '',
    email: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    newThisMonth: 0
  });

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load officers
        const officersRes = await apiService.getOfficers({
          page: 1,
          limit: 1000, // Load all officers for now
          search: filters.search,
          department: filters.department,
          status: filters.status
        });
        
        if (officersRes.success && officersRes.data) {
          setOfficers(officersRes.data);
        } else {
          const errorMessage = officersRes.error?.message || 'Failed to load officers';
          toast.error('Officers Loading Failed', errorMessage);
          console.error('Officers API error:', officersRes.error);
          
          // Add fallback empty array to prevent blank page
          setOfficers([]);
        }

        // Load statistics
        const statsRes = await apiService.getOfficerStatistics();
        if (statsRes.success && statsRes.data) {
          setStatistics(statsRes.data);
        } else {
          console.error('Statistics API error:', statsRes.error);
          // Keep default statistics if API fails
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

  // Filter and sort officers
  useEffect(() => {
    let filtered = officers;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(officer => 
        officer.firstName.toLowerCase().includes(searchTerm) ||
        officer.lastName.toLowerCase().includes(searchTerm) ||
        officer.email.toLowerCase().includes(searchTerm) ||
        officer.ippis.includes(searchTerm)
      );
    }

    if (filters.department) {
      filtered = filtered.filter(officer => officer.department === filters.department);
    }

    if (filters.division) {
      filtered = filtered.filter(officer => officer.division === filters.division);
    }

    if (filters.branch) {
      filtered = filtered.filter(officer => officer.branch === filters.branch);
    }

    if (filters.post) {
      filtered = filtered.filter(officer => officer.post === filters.post);
    }

    if (filters.cadre) {
      filtered = filtered.filter(officer => officer.cadre === filters.cadre);
    }

    if (filters.status) {
      filtered = filtered.filter(officer => officer.status === filters.status);
    }


    setFilteredOfficers(filtered);
  }, [officers, filters]);

  // Use the data table hook
  const {
    filteredData: searchFilteredOfficers,
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
    data: filteredOfficers,
    searchFields: [], // No search fields
    initialPageSize: 10
  });

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ippis.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await apiService.createOfficer({
        staffId: formData.ippis,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        department: formData.department,
        position: formData.post,
        gradeLevel: formData.gradeLevel
      });

      if (response.success && response.data) {
        setOfficers(prev => [...prev, response.data!]);
        toast.success('Officer created successfully');
    setShowCreateModal(false);
    setFormData({
      ippis: '',
      firstName: '',
      lastName: '',
      email: '',
      status: 'active'
    });
      } else {
        const errorMessage = response.error?.message || 'Failed to create officer';
        toast.error('Creation Failed', errorMessage);
        console.error('Create officer API error:', response.error);
      }
    } catch (error: any) {
      console.error('Create officer error:', error);
      let errorMessage = 'Unable to create officer. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network request failed. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error('Creation Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async (file: File) => {
    try {
      const response = await apiService.bulkCreateOfficers(file);
      
      if (response.success && response.data) {
        setUploadResult(response.data);
        toast.success(`Bulk upload completed: ${response.data.success} successful, ${response.data.errors} errors`);
        
        // Reload officers if there were successful uploads
        if (response.data.success > 0) {
          const officersRes = await apiService.getOfficers({
            page: 1,
            limit: 1000
          });
          
          if (officersRes.success && officersRes.data) {
            setOfficers(officersRes.data);
          }
        }
      } else {
        const errorMessage = response.error?.message || 'Failed to upload file';
        toast.error('Upload Failed', errorMessage);
        console.error('Bulk upload API error:', response.error);
      }
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      let errorMessage = 'Unable to upload file. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network request failed. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error('Upload Error', errorMessage);
    }
  };

  const handleDownloadTemplate = () => {
    // Create sample data for the template with only required fields
    const templateData = [
      {
        'Staff ID': 'TET001',
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@tetfund.gov.ng'
      },
      {
        'Staff ID': 'TET002',
        'First Name': 'Jane',
        'Last Name': 'Smith',
        'Email': 'jane.smith@tetfund.gov.ng'
      }
    ];

    // Convert to CSV format
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'officers_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template downloaded successfully');
  };

  const handleToggleStatus = async (officerId: string) => {
    try {
      const response = await apiService.toggleOfficerStatus(officerId);
      
      if (response.success && response.data) {
    setOfficers(prev => 
      prev.map(officer => 
            officer.id === officerId ? response.data! : officer
          )
        );
        toast.success('Officer status updated successfully');
      } else {
        const errorMessage = response.error?.message || 'Failed to update officer status';
        toast.error('Status Update Failed', errorMessage);
        console.error('Toggle status API error:', response.error);
      }
    } catch (error: any) {
      console.error('Toggle status error:', error);
      let errorMessage = 'Unable to update officer status. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network request failed. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error('Status Update Error', errorMessage);
    }
  };

  const handleResetPassword = (officerId: string) => {
    const officer = officers.find(o => o.id === officerId);
    if (!officer) return;

    setConfirmAction({
      title: 'Reset Password',
      message: `Are you sure you want to reset the password for ${officer.firstName} ${officer.lastName}? A password reset email will be sent to their registered email address.`,
      onConfirm: async () => {
        try {
          const response = await apiService.resetOfficerPassword(officerId);
          
          if (response.success) {
        setConfirmAction({
          title: 'Password Reset Sent',
          message: `Password reset email has been sent successfully to ${officer.firstName} ${officer.lastName} at ${officer.email}.`,
          onConfirm: () => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          },
          variant: 'success'
        });
            toast.success('Password reset email sent successfully');
          } else {
            const errorMessage = response.error?.message || 'Failed to send password reset email';
            toast.error('Password Reset Failed', errorMessage);
            console.error('Reset password API error:', response.error);
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }
        } catch (error: any) {
          console.error('Reset password error:', error);
          let errorMessage = 'Unable to send password reset email. Please try again.';
          
          if (error instanceof Error) {
            if (error.message.includes('Network error')) {
              errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
            } else if (error.message.includes('Failed to fetch')) {
              errorMessage = 'Network request failed. Please check your internet connection.';
            } else {
              errorMessage = error.message;
            }
          }
          
          toast.error('Password Reset Error', errorMessage);
          setShowConfirmDialog(false);
          setConfirmAction(null);
        }
      },
      variant: 'warning'
    });
    setShowConfirmDialog(true);
  };

  const handleResendCredentials = (officerId: string) => {
    const officer = officers.find(o => o.id === officerId);
    if (!officer) return;

    setConfirmAction({
      title: 'Resend Credentials',
      message: `Are you sure you want to resend login credentials to ${officer.firstName} ${officer.lastName}? New credentials will be sent to their registered email address.`,
      onConfirm: async () => {
        try {
          const response = await apiService.resendOfficerCredentials(officerId);
          
          if (response.success) {
        setConfirmAction({
          title: 'Credentials Sent',
          message: `Login credentials have been resent successfully to ${officer.firstName} ${officer.lastName} at ${officer.email}.`,
          onConfirm: () => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          },
          variant: 'success'
        });
            toast.success('Login credentials sent successfully');
          } else {
            const errorMessage = response.error?.message || 'Failed to send login credentials';
            toast.error('Credentials Send Failed', errorMessage);
            console.error('Resend credentials API error:', response.error);
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }
        } catch (error: any) {
          console.error('Resend credentials error:', error);
          let errorMessage = 'Unable to send login credentials. Please try again.';
          
          if (error instanceof Error) {
            if (error.message.includes('Network error')) {
              errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
            } else if (error.message.includes('Failed to fetch')) {
              errorMessage = 'Network request failed. Please check your internet connection.';
            } else {
              errorMessage = error.message;
            }
          }
          
          toast.error('Credentials Send Error', errorMessage);
          setShowConfirmDialog(false);
          setConfirmAction(null);
        }
      },
      variant: 'success'
    });
    setShowConfirmDialog(true);
  };


  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    );
  };

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Define columns for DataTable
  const columns: Column<Officer>[] = [
    {
      key: 'officer',
      title: 'Officer',
      dataIndex: 'firstName',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">
                {record.firstName[0]}{record.lastName[0]}
              </span>
            </div>
          </div>
          <div className="ml-4 min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-sm text-gray-500 truncate">{record.email}</div>
            {record.phone && (
              <div className="text-xs text-gray-400 flex items-center mt-1">
                <Phone className="w-3 h-3 mr-1" />
                {record.phone}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'ippis',
      title: 'Staff ID',
      dataIndex: 'ippis',
      sortable: true,
      render: (value) => (
        <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
          {value}
        </div>
      )
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="text-sm text-gray-900 max-w-xs truncate" title={value}>
            {value}
          </div>
          {record.division && (
            <div className="text-xs text-gray-500 truncate" title={record.division}>
              {record.division}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'post',
      title: 'Post',
      dataIndex: 'post',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          {record.cadre && (
            <div className="text-xs text-gray-500">{record.cadre}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-500">
          {value ? (
            <div>
              <div>{new Date(value).toLocaleDateString()}</div>
              <div className="text-xs text-gray-400">
                {new Date(value).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <span className="text-gray-400 italic">Never</span>
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
            onClick={() => setSelectedOfficer(record)}
            className="h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-700"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleResetPassword(record.id)}
            className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
            title="Reset Password"
          >
            <Key className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleResendCredentials(record.id)}
            className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-700"
            title="Resend Credentials"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(record.id)}
            className={`h-8 w-8 p-0 ${
              record.status === 'active' 
                ? 'hover:bg-red-100 hover:text-red-700' 
                : 'hover:bg-emerald-100 hover:text-emerald-700'
            }`}
            title={record.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {getStatusIcon(record.status)}
          </Button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Manage Officers"
          subtitle="Manage officer profiles, onboarding, and access"
          right={
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBulkUploadModal(true)}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Officer
              </Button>
            </>
          }
        />

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All Departments</option>
                <option value="Human Resource & Gen. Admin">Human Resource & Gen. Admin</option>
                <option value="Finance & Investment">Finance & Investment</option>
                <option value="Research & Development">Research & Development</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
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
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Officers</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{statistics.active}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.inactive}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.newThisMonth}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Officers List */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Card className="overflow-hidden">
              {/* Table Header with Controls */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">Officers</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                      {searchFilteredOfficers.length} total
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
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DataTable */}
              <DataTable
                data={currentData}
                columns={columns}
                loading={isLoading}
                pagination={{
                  currentPage,
                  totalPages,
                  pageSize,
                  onPageChange: setCurrentPage,
                  onPageSizeChange: setPageSize,
                  totalItems: searchFilteredOfficers.length
                }}
                emptyState={{
                  icon: <Users className="w-12 h-12 text-gray-400" />,
                  title: "No officers found",
                  description: "Try adjusting your filter criteria."
                }}
              />
            </Card>
          </div>
        </div>
      
      {/* Create Officer Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Officer"
        description="Enter officer details to create a new profile"
      >
          <form onSubmit={handleCreateOfficer} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ippis" className="text-sm font-medium text-gray-700 mb-2 block">
                  Staff ID *
                </Label>
                <Input
                  id="ippis"
                  value={formData.ippis}
                  onChange={(e) => setFormData({...formData, ippis: e.target.value})}
                  placeholder="Enter Staff ID"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="Enter first name"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Enter last name"
                  required
                  className="w-full"
                />
              </div>
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
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Officer'
                )}
              </Button>
            </ModalFooter>
          </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        title="Bulk Upload Officers"
        description="Upload multiple officers using Excel or CSV file"
      >
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Officer Data
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Upload Excel or CSV file with officer data
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Required columns: Staff ID, First Name, Last Name, Email
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  className="px-6"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBulkUpload(file);
                }}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="px-6"
              >
                Choose File
              </Button>
              </div>
            </div>
            
            {uploadResult && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Upload Results</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Successful: {uploadResult.success}
                  </div>
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-2" />
                    Errors: {uploadResult.errors}
                  </div>
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Duplicates: {uploadResult.duplicates}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Invalid: {uploadResult.invalid}
                  </div>
                </div>
              </div>
            )}
            
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setShowBulkUploadModal(false)}
                className="px-6"
              >
                Close
              </Button>
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                Upload File
              </Button>
        </ModalFooter>
      </div>
      </Modal>

      {/* View Officer Modal */}
      <Modal
        isOpen={!!selectedOfficer}
        onClose={() => setSelectedOfficer(null)}
        title="Officer Details"
      >
        <ModalHeader
          title="Officer Details"
          description="View detailed information about the officer"
          onClose={() => setSelectedOfficer(null)}
        />
        {selectedOfficer && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.firstName} {selectedOfficer.lastName}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Staff ID
                </Label>
                <div className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.ippis}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email
                </Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.email}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone
                </Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.phone || 'Not provided'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Department
                </Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.department || 'Not assigned'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Post
                </Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.post || 'Not assigned'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </Label>
                <div className="flex items-center">
                  <Badge 
                    variant={selectedOfficer.status === 'active' ? 'default' : 'secondary'}
                    className={selectedOfficer.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {selectedOfficer.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Last Login
                </Label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {selectedOfficer.lastLogin ? (
                    <div>
                      <div>{new Date(selectedOfficer.lastLogin).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(selectedOfficer.lastLogin).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    'Never'
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(selectedOfficer.division || selectedOfficer.branch || selectedOfficer.cadre) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  {selectedOfficer.division && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Division
                      </Label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedOfficer.division}
                      </div>
                    </div>
                  )}
                  {selectedOfficer.branch && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Branch
                      </Label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedOfficer.branch}
                      </div>
                    </div>
                  )}
                  {selectedOfficer.cadre && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Cadre
                      </Label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedOfficer.cadre}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedOfficer(null)}
          >
            Close
          </Button>
        </ModalFooter>
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

export default ManageOfficers;
