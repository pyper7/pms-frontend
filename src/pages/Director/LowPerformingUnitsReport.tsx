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
import { Textarea } from '@/components/ui/textarea';
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
  MapPin,
  TrendingDown,
  Minus,
  AlertTriangle,
  UserX,
  Flag,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Types
interface LowPerformingStaff {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  overallScore: number;
  performanceLevel: 'Needs Improvement' | 'Unsatisfactory';
  kpiScore: number;
  competencyScore: number;
  processScore: number;
  contractStatus: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  reviewStatus: 'Pending' | 'In Progress' | 'Completed';
  appraisalStatus: 'Not Started' | 'In Progress' | 'Completed';
  lastAppraisal: string;
  nextAppraisal: string;
  performanceIssues: string[];
  improvementPlan: {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
    priority: 'High' | 'Medium' | 'Low';
  }[];
  supervisorComments: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  monthsUnderperforming: number;
}

interface PerformanceTrend {
  month: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

interface ImprovementAction {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
}

const LowPerformingUnitsReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<LowPerformingStaff | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showImprovementDialog, setShowImprovementDialog] = useState(false);
  const [improvementComment, setImprovementComment] = useState('');

  // Mock data
  const lowPerformingStaff: LowPerformingStaff[] = [
    {
      id: '1',
      name: 'Mr. James Okonkwo',
      position: 'Administrative Officer',
      department: 'Administration',
      email: 'james.okonkwo@tetfund.gov.ng',
      phone: '+234 804 567 8901',
      location: 'Enugu',
      overallScore: 45.2,
      performanceLevel: 'Unsatisfactory',
      kpiScore: 40,
      competencyScore: 50,
      processScore: 45,
      contractStatus: 'Pending',
      reviewStatus: 'Pending',
      appraisalStatus: 'Not Started',
      lastAppraisal: '2023-09-05',
      nextAppraisal: '2024-09-05',
      performanceIssues: [
        'Consistently missing deadlines',
        'Poor communication with team members',
        'Lack of initiative in problem-solving',
        'Inadequate technical skills for role'
      ],
      improvementPlan: [
        {
          id: '1',
          title: 'Time Management Training',
          description: 'Complete time management and productivity course',
          targetDate: '2024-03-31',
          status: 'In Progress',
          priority: 'High'
        },
        {
          id: '2',
          title: 'Communication Skills Workshop',
          description: 'Attend communication and teamwork workshop',
          targetDate: '2024-04-15',
          status: 'Not Started',
          priority: 'High'
        },
        {
          id: '3',
          title: 'Technical Skills Assessment',
          description: 'Complete technical skills evaluation and training',
          targetDate: '2024-05-30',
          status: 'Not Started',
          priority: 'Medium'
        }
      ],
      supervisorComments: 'James has been struggling with basic administrative tasks and requires immediate intervention. His performance has been declining over the past 6 months.',
      riskLevel: 'High',
      monthsUnderperforming: 6
    },
    {
      id: '2',
      name: 'Ms. Grace Okafor',
      position: 'Finance Officer',
      department: 'Finance',
      email: 'grace.okafor@tetfund.gov.ng',
      phone: '+234 805 678 9012',
      location: 'Port Harcourt',
      overallScore: 58.7,
      performanceLevel: 'Needs Improvement',
      kpiScore: 60,
      competencyScore: 55,
      processScore: 61,
      contractStatus: 'Approved',
      reviewStatus: 'In Progress',
      appraisalStatus: 'In Progress',
      lastAppraisal: '2023-08-15',
      nextAppraisal: '2024-08-15',
      performanceIssues: [
        'Inconsistent accuracy in financial reports',
        'Delayed processing of payment requests',
        'Limited understanding of new financial systems'
      ],
      improvementPlan: [
        {
          id: '1',
          title: 'Financial Systems Training',
          description: 'Complete advanced training on new financial management system',
          targetDate: '2024-04-30',
          status: 'In Progress',
          priority: 'High'
        },
        {
          id: '2',
          title: 'Accuracy Improvement Program',
          description: 'Work with senior finance officer on accuracy improvement',
          targetDate: '2024-05-15',
          status: 'Not Started',
          priority: 'Medium'
        }
      ],
      supervisorComments: 'Grace shows potential but needs focused support in financial accuracy and system proficiency.',
      riskLevel: 'Medium',
      monthsUnderperforming: 3
    },
    {
      id: '3',
      name: 'Mr. David Adebayo',
      position: 'Research Assistant',
      department: 'Research & Development',
      email: 'david.adebayo@tetfund.gov.ng',
      phone: '+234 806 789 0123',
      location: 'Lagos',
      overallScore: 52.1,
      performanceLevel: 'Needs Improvement',
      kpiScore: 55,
      competencyScore: 48,
      processScore: 53,
      contractStatus: 'Approved',
      reviewStatus: 'Pending',
      appraisalStatus: 'Not Started',
      lastAppraisal: '2023-07-20',
      nextAppraisal: '2024-07-20',
      performanceIssues: [
        'Inadequate research methodology knowledge',
        'Poor data analysis skills',
        'Lack of attention to detail in reports',
        'Inconsistent work quality'
      ],
      improvementPlan: [
        {
          id: '1',
          title: 'Research Methodology Course',
          description: 'Complete comprehensive research methodology training',
          targetDate: '2024-04-20',
          status: 'Not Started',
          priority: 'High'
        },
        {
          id: '2',
          title: 'Data Analysis Workshop',
          description: 'Attend data analysis and statistical methods workshop',
          targetDate: '2024-05-10',
          status: 'Not Started',
          priority: 'High'
        },
        {
          id: '3',
          title: 'Mentorship Program',
          description: 'Pair with senior researcher for guidance and support',
          targetDate: '2024-03-15',
          status: 'In Progress',
          priority: 'Medium'
        }
      ],
      supervisorComments: 'David requires comprehensive training in research fundamentals and data analysis to meet role expectations.',
      riskLevel: 'High',
      monthsUnderperforming: 4
    }
  ];

  const improvementActions: ImprovementAction[] = [
    {
      id: '1',
      title: 'Performance Improvement Plan (PIP)',
      description: 'Develop comprehensive PIP for James Okonkwo',
      assignedTo: 'HR Manager',
      dueDate: '2024-03-15',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: '2',
      title: 'Skills Assessment Program',
      description: 'Conduct skills assessment for all low-performing staff',
      assignedTo: 'Training Coordinator',
      dueDate: '2024-03-30',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: '3',
      title: 'Mentorship Program Launch',
      description: 'Pair low performers with high-performing mentors',
      assignedTo: 'Department Head',
      dueDate: '2024-04-01',
      status: 'Pending',
      priority: 'Medium'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'Unsatisfactory': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Needs Improvement': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredStaff = lowPerformingStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
    const matchesRiskLevel = selectedRiskLevel === 'all' || staff.riskLevel === selectedRiskLevel;
    return matchesSearch && matchesDepartment && matchesRiskLevel;
  });

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting low-performing units report as ${format.toUpperCase()}...`);
    // Implementation would go here
  };

  const handleViewDetails = (staff: LowPerformingStaff) => {
    setSelectedStaff(staff);
    setShowDetails(true);
  };

  const handleCreateImprovementPlan = (staff: LowPerformingStaff) => {
    setSelectedStaff(staff);
    setShowImprovementDialog(true);
  };

  const handleSubmitImprovementComment = () => {
    if (improvementComment.trim()) {
      toast.success('Improvement comment submitted successfully');
      setImprovementComment('');
      setShowImprovementDialog(false);
    } else {
      toast.error('Please enter a comment before submitting');
    }
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
            title="Low-Performing Units Report"
            subtitle="Identify and track staff members requiring performance improvement intervention"
            breadcrumbs={[
              { label: 'Director Dashboard', href: '/director/dashboard' },
              { label: 'Report & Analytics', href: '/director/reports' },
              { label: 'Low-Performing Units Report' }
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Research & Development">Research & Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 dark:text-white">Risk Level</Label>
                <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                  <SelectTrigger className="bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="High">High Risk</SelectItem>
                    <SelectItem value="Medium">Medium Risk</SelectItem>
                    <SelectItem value="Low">Low Risk</SelectItem>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Low Performers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowPerformingStaff.length}</p>
                </div>
                <UserX className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">High Risk Cases</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lowPerformingStaff.filter(s => s.riskLevel === 'High').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Improvement Plans</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lowPerformingStaff.reduce((sum, staff) => sum + staff.improvementPlan.length, 0)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Months Underperforming</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(lowPerformingStaff.reduce((sum, staff) => sum + staff.monthsUnderperforming, 0) / lowPerformingStaff.length).toFixed(1)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Performing Staff Table */}
        <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              Low-Performing Staff Overview
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
                    <TableHead className="text-gray-900 dark:text-white">Risk Level</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Months Underperforming</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-400 dark:to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                        <Badge className={getRiskColor(staff.riskLevel)}>
                          {staff.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {staff.monthsUnderperforming} months
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateImprovementPlan(staff)}
                          >
                            <Target className="w-4 h-4 mr-1" />
                            PIP
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

        {/* Improvement Actions */}
        <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Flag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Improvement Actions & Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvementActions.map((action) => (
                <div key={action.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{action.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{action.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                      <Badge className={getStatusColor(action.status)}>
                        {action.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Assigned to: {action.assignedTo}</span>
                    <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Performance Details - {selectedStaff?.name}
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

                {/* Performance Issues */}
                <Card className="bg-gray-50 dark:bg-gray-700/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Identified Performance Issues</h4>
                    <div className="space-y-2">
                      {selectedStaff.performanceIssues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 dark:bg-red-900/10 rounded">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Improvement Plan */}
                <Card className="bg-gray-50 dark:bg-gray-700/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Improvement Plan</h4>
                    <div className="space-y-3">
                      {selectedStaff.improvementPlan.map((plan) => (
                        <div key={plan.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">{plan.title}</h5>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(plan.priority)}>
                                {plan.priority}
                              </Badge>
                              <Badge className={getStatusColor(plan.status)}>
                                {plan.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{plan.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Target Date: {new Date(plan.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Supervisor Comments */}
                <Card className="bg-gray-50 dark:bg-gray-700/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Supervisor Comments</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedStaff.supervisorComments}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Improvement Plan Dialog */}
        <Dialog open={showImprovementDialog} onOpenChange={setShowImprovementDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Create Improvement Plan - {selectedStaff?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-900 dark:text-white">Improvement Comments & Recommendations</Label>
                <Textarea
                  placeholder="Enter specific improvement recommendations and action items..."
                  value={improvementComment}
                  onChange={(e) => setImprovementComment(e.target.value)}
                  className="mt-2 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowImprovementDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitImprovementComment}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default LowPerformingUnitsReport;
