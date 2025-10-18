import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/utils/toast';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Target,
  Star,
  FileText,
  User,
  TrendingUp,
  Award,
  BookOpen,
  Download,
  Eye,
  Filter,
  Search,
  FileDown,
  Printer,
  Calendar as CalendarIcon,
  Users,
  Activity,
  PieChart,
  LineChart,
  Settings,
  RefreshCw,
  ChevronDown,
  X,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Types
interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  lastAppraisal: string;
  nextAppraisal: string;
  overallScore: number;
  performanceLevel: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory';
  kpiScore: number;
  competencyScore: number;
  processScore: number;
  contractStatus: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  reviewStatus: 'Pending' | 'In Progress' | 'Completed';
  appraisalStatus: 'Not Started' | 'In Progress' | 'Completed';
}

interface DepartmentSummary {
  departmentName: string;
  totalStaff: number;
  averageScore: number;
  performanceDistribution: {
    excellent: number;
    good: number;
    satisfactory: number;
    needsImprovement: number;
    unsatisfactory: number;
  };
  completedAppraisals: number;
  pendingAppraisals: number;
  overdueAppraisals: number;
}

const StaffAppraisalReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data
  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      position: 'Senior Research Officer',
      department: 'Research & Development',
      email: 'sarah.johnson@tetfund.gov.ng',
      phone: '+234 801 234 5678',
      location: 'Abuja',
      status: 'Active',
      lastAppraisal: '2023-12-15',
      nextAppraisal: '2024-12-15',
      overallScore: 87.5,
      performanceLevel: 'Excellent',
      kpiScore: 90,
      competencyScore: 85,
      processScore: 88,
      contractStatus: 'Approved',
      reviewStatus: 'Completed',
      appraisalStatus: 'Completed'
    },
    {
      id: '2',
      name: 'Mr. Michael Adebayo',
      position: 'Project Manager',
      department: 'Research & Development',
      email: 'michael.adebayo@tetfund.gov.ng',
      phone: '+234 802 345 6789',
      location: 'Lagos',
      status: 'Active',
      lastAppraisal: '2023-11-20',
      nextAppraisal: '2024-11-20',
      overallScore: 78.2,
      performanceLevel: 'Good',
      kpiScore: 80,
      competencyScore: 75,
      processScore: 80,
      contractStatus: 'Approved',
      reviewStatus: 'In Progress',
      appraisalStatus: 'In Progress'
    },
    {
      id: '3',
      name: 'Dr. Fatima Ibrahim',
      position: 'Research Fellow',
      department: 'Research & Development',
      email: 'fatima.ibrahim@tetfund.gov.ng',
      phone: '+234 803 456 7890',
      location: 'Kano',
      status: 'Active',
      lastAppraisal: '2023-10-10',
      nextAppraisal: '2024-10-10',
      overallScore: 92.1,
      performanceLevel: 'Excellent',
      kpiScore: 95,
      competencyScore: 90,
      processScore: 91,
      contractStatus: 'Approved',
      reviewStatus: 'Completed',
      appraisalStatus: 'Completed'
    },
    {
      id: '4',
      name: 'Mr. James Okonkwo',
      position: 'Administrative Officer',
      department: 'Administration',
      email: 'james.okonkwo@tetfund.gov.ng',
      phone: '+234 804 567 8901',
      location: 'Enugu',
      status: 'Active',
      lastAppraisal: '2023-09-05',
      nextAppraisal: '2024-09-05',
      overallScore: 65.8,
      performanceLevel: 'Satisfactory',
      kpiScore: 70,
      competencyScore: 60,
      processScore: 68,
      contractStatus: 'Pending',
      reviewStatus: 'Pending',
      appraisalStatus: 'Not Started'
    },
    {
      id: '5',
      name: 'Ms. Grace Okafor',
      position: 'Finance Officer',
      department: 'Finance',
      email: 'grace.okafor@tetfund.gov.ng',
      phone: '+234 805 678 9012',
      location: 'Port Harcourt',
      status: 'On Leave',
      lastAppraisal: '2023-08-15',
      nextAppraisal: '2024-08-15',
      overallScore: 72.3,
      performanceLevel: 'Good',
      kpiScore: 75,
      competencyScore: 70,
      processScore: 72,
      contractStatus: 'Approved',
      reviewStatus: 'Completed',
      appraisalStatus: 'Completed'
    }
  ];

  const departmentSummary: DepartmentSummary = {
    departmentName: 'Research & Development',
    totalStaff: 3,
    averageScore: 85.9,
    performanceDistribution: {
      excellent: 2,
      good: 1,
      satisfactory: 0,
      needsImprovement: 0,
      unsatisfactory: 0
    },
    completedAppraisals: 2,
    pendingAppraisals: 1,
    overdueAppraisals: 0
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Satisfactory': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Needs Improvement': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Unsatisfactory': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting staff appraisal report as ${format.toUpperCase()}...`);
    // Implementation would go here
  };

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonCard />
            </div>
            <div>
              <SkeletonCard />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <PageHeader
            title="Staff Appraisal Report"
            subtitle="Comprehensive performance evaluation report for all staff under your supervision"
            breadcrumbs={[
              { label: 'Director Dashboard', href: '/director/dashboard' },
              { label: 'Report & Analytics', href: '/director/reports' },
              { label: 'Staff Appraisal Report' }
            ]}
            right={
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExport('excel')}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button onClick={() => handleExport('csv')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            }
          />
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-gray-900 dark:text-white">Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 dark:text-white">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Research & Development">Research & Development</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 dark:text-white">Search Staff</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{staffMembers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {staffMembers.reduce((sum, staff) => sum + staff.overallScore, 0) / staffMembers.length}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed Appraisals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {staffMembers.filter(s => s.appraisalStatus === 'Completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Appraisals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {staffMembers.filter(s => s.appraisalStatus !== 'Completed').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Staff Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900 dark:text-white">Staff Member</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Position</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Department</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Overall Score</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Performance Level</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{staff.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{staff.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{staff.position}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{staff.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={staff.overallScore} className="w-20 h-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{staff.overallScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceColor(staff.performanceLevel)}>
                          {staff.performanceLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(staff.status)}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(staff)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Staff Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Staff Performance Details - {selectedStaff?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-6">
                {/* Staff Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{selectedStaff.position}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{selectedStaff.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{selectedStaff.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{selectedStaff.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{selectedStaff.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Scores</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">Overall Score</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.overallScore}%</span>
                          </div>
                          <Progress value={selectedStaff.overallScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">KPI Score</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.kpiScore}%</span>
                          </div>
                          <Progress value={selectedStaff.kpiScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">Competency Score</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.competencyScore}%</span>
                          </div>
                          <Progress value={selectedStaff.competencyScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">Process Score</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.processScore}%</span>
                          </div>
                          <Progress value={selectedStaff.processScore} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contract Status</h4>
                      <Badge className={selectedStaff.contractStatus === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}>
                        {selectedStaff.contractStatus}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Review Status</h4>
                      <Badge className={selectedStaff.reviewStatus === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'}>
                        {selectedStaff.reviewStatus}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Appraisal Status</h4>
                      <Badge className={selectedStaff.appraisalStatus === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'}>
                        {selectedStaff.appraisalStatus}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default StaffAppraisalReport;
