import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  X
} from 'lucide-react';

// Types
interface ReportData {
  performance: any;
  development: any;
  goals: any;
  contracts: any[];
  reviews: any[];
  appraisals: any[];
}

interface FilterOptions {
  period: string;
  year: string;
  month: string;
  status: string;
  category: string;
  department: string;
  searchTerm: string;
}

const OfficerReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'Q1 2024',
    year: '2024',
    month: 'All',
    status: 'All',
    category: 'All',
    department: 'All',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [reportData] = useState<ReportData>({
    performance: {
      overallScore: 87,
      trend: '+5%',
      objectives: [
        { name: 'Research Excellence', score: 90, target: 85, status: 'Exceeded' },
        { name: 'Team Collaboration', score: 85, target: 80, status: 'Met' },
        { name: 'Professional Development', score: 75, target: 80, status: 'Below Target' },
        { name: 'Project Delivery', score: 88, target: 85, status: 'Exceeded' }
      ],
      competencies: [
        { name: 'Generic', rating: 4.2, trend: '+0.3', weight: 35 },
        { name: 'Functional', rating: 4.5, trend: '+0.1', weight: 35 },
        { name: 'Ethics', rating: 4.8, trend: '+0.2', weight: 30 }
      ],
      achievements: [
        {
          id: 1,
          title: 'Research Paper Published',
          description: 'Published paper in top-tier journal',
          date: '2024-01-15',
          impact: 'High',
          category: 'Research'
        },
        {
          id: 2,
          title: 'Team Project Completed',
          description: 'Led successful completion of major project',
          date: '2024-01-20',
          impact: 'Medium',
          category: 'Leadership'
        },
        {
          id: 3,
          title: 'Training Course Completed',
          description: 'Completed advanced technical training',
          date: '2024-02-01',
          impact: 'Medium',
          category: 'Development'
        }
      ]
    },
    development: {
      coursesCompleted: 3,
      hoursSpent: 45,
      certifications: 1,
      skillsImproved: 5,
      activities: [
        {
          id: 1,
          title: 'Advanced Project Management',
          type: 'Course',
          duration: '16 hours',
          status: 'Completed',
          date: '2024-01-10',
          provider: 'TETFund Training Center'
        },
        {
          id: 2,
          title: 'Communication Skills Workshop',
          type: 'Workshop',
          duration: '8 hours',
          status: 'Completed',
          date: '2024-01-25',
          provider: 'External Consultant'
        },
        {
          id: 3,
          title: 'Technical Certification',
          type: 'Certification',
          duration: '40 hours',
          status: 'In Progress',
          date: '2024-02-01',
          provider: 'Professional Body'
        }
      ]
    },
    goals: {
      currentGoals: 4,
      completedGoals: 2,
      overdueGoals: 1,
      upcomingGoals: 3,
      goalDetails: [
        {
          id: 1,
          title: 'Complete Research Project',
          category: 'Research',
          priority: 'High',
          dueDate: '2024-03-15',
          progress: 75,
          status: 'In Progress'
        },
        {
          id: 2,
          title: 'Lead Team Meeting',
          category: 'Leadership',
          priority: 'Medium',
          dueDate: '2024-02-20',
          progress: 100,
          status: 'Completed'
        },
        {
          id: 3,
          title: 'Complete Training Course',
          category: 'Development',
          priority: 'High',
          dueDate: '2024-01-31',
          progress: 0,
          status: 'Overdue'
        },
        {
          id: 4,
          title: 'Submit Performance Report',
          category: 'Administrative',
          priority: 'High',
          dueDate: '2024-03-01',
          progress: 50,
          status: 'In Progress'
        }
      ]
    },
    contracts: [
      {
        id: 'PC-2024-001',
        year: '2024',
        status: 'Approved',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        kpis: 3,
        competencies: 3,
        overallScore: 87,
        submittedDate: '2024-01-15',
        approvedDate: '2024-01-20'
      },
      {
        id: 'PC-2023-001',
        year: '2023',
        status: 'Approved',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        kpis: 4,
        competencies: 3,
        overallScore: 82,
        submittedDate: '2023-01-10',
        approvedDate: '2023-01-15'
      }
    ],
    reviews: [
      {
        id: 'PR-2024-01',
        month: 'January',
        year: '2024',
        status: 'Approved',
        tasks: 3,
        competencies: 3,
        overallScore: 4.2,
        submittedDate: '2024-02-01',
        approvedDate: '2024-02-05'
      },
      {
        id: 'PR-2024-02',
        month: 'February',
        year: '2024',
        status: 'Under Review',
        tasks: 3,
        competencies: 3,
        overallScore: 4.1,
        submittedDate: '2024-03-01',
        approvedDate: null
      }
    ],
    appraisals: [
      {
        id: 'PA-2023',
        year: '2023',
        status: 'Completed',
        overallScore: 4.0,
        submittedDate: '2024-01-15',
        completedDate: '2024-02-15',
        supervisor: 'Dr. John Smith'
      }
    ]
  });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = { ...reportData };
    
    // Filter by year
    if (filters.year !== 'All') {
      filtered.contracts = filtered.contracts.filter(item => item.year === filters.year);
      filtered.reviews = filtered.reviews.filter(item => item.year === filters.year);
      filtered.appraisals = filtered.appraisals.filter(item => item.year === filters.year);
    }
    
    // Filter by status
    if (filters.status !== 'All') {
      filtered.contracts = filtered.contracts.filter(item => item.status === filters.status);
      filtered.reviews = filtered.reviews.filter(item => item.status === filters.status);
      filtered.appraisals = filtered.appraisals.filter(item => item.status === filters.status);
    }
    
    // Search functionality
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered.contracts = filtered.contracts.filter(item => 
        item.id.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
      filtered.reviews = filtered.reviews.filter(item => 
        item.id.toLowerCase().includes(searchLower) ||
        item.month.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
      filtered.appraisals = filtered.appraisals.filter(item => 
        item.id.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        item.supervisor.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [reportData, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'In Progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'Overdue': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'Exceeded': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'Met': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'Below Target': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'Approved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'Under Review': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'Draft': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Overdue': return <AlertCircle className="w-4 h-4" />;
      case 'Exceeded': return <Award className="w-4 h-4" />;
      case 'Met': return <CheckCircle className="w-4 h-4" />;
      case 'Below Target': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownloadReport = async (format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download the actual report
      const reportName = `Performance_Report_${filters.year}_${filters.period.replace(' ', '_')}.${format}`;
      
      // Create a mock download
      const element = document.createElement('a');
      const file = new Blob(['Mock report content'], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = reportName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success(`${format.toUpperCase()} report downloaded successfully`);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = (type: 'all' | 'contracts' | 'reviews' | 'appraisals') => {
    const data = type === 'all' ? filteredData : { [type]: filteredData[type] };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const element = document.createElement('a');
    element.href = URL.createObjectURL(dataBlob);
    element.download = `Performance_Data_${type}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success("Data exported successfully");
  };

  const handlePrintReport = () => {
    window.print();
  };

  const clearFilters = () => {
    setFilters({
      period: 'Q1 2024',
      year: '2024',
      month: 'All',
      status: 'All',
      category: 'All',
      department: 'All',
      searchTerm: ''
    });
  };

  // New comprehensive report sections
  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-base card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Overall Performance</p>
                <p className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mt-2">{reportData.performance.overallScore}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                  <p className="text-body-small font-medium text-emerald-600 dark:text-emerald-400">{reportData.performance.trend} from last period</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <BarChart3 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Active Contracts</p>
                <p className="text-4xl font-bold text-blue-800 dark:text-blue-200 mt-2">{filteredData.contracts.length}</p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                  <p className="text-body-small font-medium text-blue-600 dark:text-blue-400">Current year</p>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Monthly Reviews</p>
                <p className="text-4xl font-bold text-purple-800 dark:text-purple-200 mt-2">{filteredData.reviews.length}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-1" />
                  <p className="text-body-small font-medium text-purple-600 dark:text-purple-400">This year</p>
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Appraisals</p>
                <p className="text-4xl font-bold text-orange-800 dark:text-orange-200 mt-2">{filteredData.appraisals.length}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-1" />
                  <p className="text-body-small font-medium text-orange-600 dark:text-orange-400">Completed</p>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-base">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>Recent Activity</span>
          </CardTitle>
          <p className="text-body-small text-muted-foreground mt-1">Latest updates across your performance management activities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Contract', action: 'Approved', item: 'PC-2024-001', date: '2024-01-20', status: 'Approved', time: '2 days ago' },
              { type: 'Review', action: 'Submitted', item: 'PR-2024-02', date: '2024-03-01', status: 'Under Review', time: '1 week ago' },
              { type: 'Appraisal', action: 'Completed', item: 'PA-2023', date: '2024-02-15', status: 'Completed', time: '2 weeks ago' },
              { type: 'Contract', action: 'Submitted', item: 'PC-2024-001', date: '2024-01-15', status: 'Approved', time: '1 month ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    activity.type === 'Contract' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'Review' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    {activity.type === 'Contract' && <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'Review' && <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    {activity.type === 'Appraisal' && <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.type} {activity.action}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.item}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(activity.status)} px-3 py-1 font-medium`}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContractsReport = () => (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-slate-800 dark:text-slate-100">Performance Contracts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Contract ID</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Year</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">KPIs</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Score</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Submitted</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Approved</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.contracts.map((contract) => (
                  <TableRow key={contract.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{contract.id}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{contract.year}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(contract.status)} px-3 py-1 font-medium`}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{contract.kpis}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 font-semibold">{contract.overallScore}%</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">{contract.submittedDate}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">{contract.approvedDate || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Download className="w-4 h-4" />
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
    </div>
  );

  const renderReviewsReport = () => (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-slate-800 dark:text-slate-100">Monthly Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Review ID</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Month/Year</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Tasks</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Score</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Submitted</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Approved</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.reviews.map((review) => (
                  <TableRow key={review.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{review.id}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{review.month} {review.year}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(review.status)} px-3 py-1 font-medium`}>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{review.tasks}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 font-semibold">{review.overallScore}/5</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">{review.submittedDate}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">{review.approvedDate || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Download className="w-4 h-4" />
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
    </div>
  );

  const renderPIPReport = () => (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 shadow-lg">
              <AlertCircle className="w-16 h-16 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Performance Improvement Plan</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-lg text-lg leading-relaxed">
                This feature is currently under development. Performance Improvement Plans will be available soon to help track and manage performance improvement initiatives.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5" />
              <span>Coming Soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppraisalsReport = () => (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-slate-800 dark:text-slate-100">Performance Appraisals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Appraisal ID</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Year</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Score</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Supervisor</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Submitted</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Completed</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.appraisals.map((appraisal) => (
                  <TableRow key={appraisal.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{appraisal.id}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{appraisal.year}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(appraisal.status)} px-3 py-1 font-medium`}>
                        {appraisal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 font-semibold">{appraisal.overallScore}/5</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{appraisal.supervisor}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">{appraisal.submittedDate}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">{appraisal.completedDate || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Download className="w-4 h-4" />
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
    </div>
  );

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{reportData.performance.overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
                <div className="text-xs text-green-600 mt-1">{reportData.performance.trend} from last period</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {reportData.performance.objectives.filter(obj => obj.status === 'Exceeded').length}
                </div>
                <div className="text-sm text-muted-foreground">Objectives Exceeded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {Math.round(reportData.performance.competencies.reduce((acc, comp) => acc + comp.rating, 0) / reportData.performance.competencies.length * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Competency Rating</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Objectives Performance */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Objectives Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.performance.objectives.map((objective, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{objective.name}</h3>
                      <p className="text-sm text-muted-foreground">Target: {objective.target}%</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-semibold">{objective.score}%</div>
                        <div className="text-sm text-muted-foreground">Achieved</div>
                      </div>
                      <Badge className={getStatusColor(objective.status)}>
                        {getStatusIcon(objective.status)}
                        <span className="ml-1">{objective.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <Progress value={objective.score} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competencies */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Competencies Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.performance.competencies.map((competency, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{competency.name}</h3>
                      <p className="text-sm text-muted-foreground">Trend: {competency.trend}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold">{competency.rating}/5</div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(competency.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Key Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.performance.achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">{achievement.date}</span>
                        <span className="text-xs text-muted-foreground">{achievement.category}</span>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(achievement.impact)}>
                      {achievement.impact} Impact
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDevelopmentReport = () => (
    <div className="space-y-6">
      {/* Development Overview */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Development Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.development.coursesCompleted}</div>
                <div className="text-sm text-muted-foreground">Courses Completed</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.development.hoursSpent}</div>
                <div className="text-sm text-muted-foreground">Hours Spent</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.development.certifications}</div>
                <div className="text-sm text-muted-foreground">Certifications</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{reportData.development.skillsImproved}</div>
                <div className="text-sm text-muted-foreground">Skills Improved</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Development Activities */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Development Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.development.activities.map((activity) => (
                <div key={activity.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{activity.type} • {activity.duration}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.provider}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {getStatusIcon(activity.status)}
                      <span className="ml-1">{activity.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderGoalsReport = () => (
    <div className="space-y-6">
      {/* Goals Overview */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goals Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.goals.currentGoals}</div>
                <div className="text-sm text-muted-foreground">Current Goals</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.goals.completedGoals}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{reportData.goals.overdueGoals}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.goals.upcomingGoals}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Details */}
      <Card className="dark-mode-card dark-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goals Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.goals.goalDetails.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{goal.category} • Due: {goal.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                      <Badge className={getStatusColor(goal.status)}>
                        {getStatusIcon(goal.status)}
                        <span className="ml-1">{goal.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
  return (
    <Layout>
        <div className="page-container">
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonForm />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <PageHeader
          title="Performance Analytics Dashboard"
          subtitle="Comprehensive insights and analytics for your performance data, contracts, reviews, and appraisals"
          right={
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="focus-visible">
                    <FileDown className="w-4 h-4 mr-2" />
                Export Data
              </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('all')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('contracts')}
                    >
                <FileText className="w-4 h-4 mr-2" />
                      Export Contracts
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('reviews')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Export Reviews
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('appraisals')}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Export Appraisals
              </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="dark-mode-hover">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleDownloadReport('pdf')}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                      Generate PDF Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleDownloadReport('excel')}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                      Generate Excel Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleDownloadReport('csv')}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                      Generate CSV Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handlePrintReport}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-1">
          <nav className="text-body-small text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/officer-dashboard" className="hover:text-foreground transition-colors duration-200">Dashboard</a>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-semibold">Reports</li>
            </ol>
          </nav>
        </div>

        {/* Enhanced Filters */}
        <Card className="card-base">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Data Filters</h3>
                <p className="text-body-small text-muted-foreground mt-1">Refine your data view with advanced filtering options</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="focus-visible"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Advanced
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="focus-visible"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-body-small font-semibold text-foreground">Search & Filter</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search across all data..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10 h-11 focus-visible"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-body-small font-semibold text-foreground">Year</Label>
                <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger className="h-11 focus-visible">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-body-small font-semibold text-foreground">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="h-11 focus-visible">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                </div>

            {showFilters && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Advanced Filters</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="period" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Period</Label>
                    <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger className="h-11 bg-white dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectItem value="Q1 2024" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Q1 2024</SelectItem>
                        <SelectItem value="Q4 2023" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Q4 2023</SelectItem>
                        <SelectItem value="Q3 2023" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Q3 2023</SelectItem>
                        <SelectItem value="Q2 2023" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Q2 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Month</Label>
                    <Select value={filters.month} onValueChange={(value) => setFilters(prev => ({ ...prev, month: value }))}>
                      <SelectTrigger className="h-11 bg-white dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400">
                        <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectItem value="All" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">All Months</SelectItem>
                        <SelectItem value="January" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">January</SelectItem>
                        <SelectItem value="February" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">February</SelectItem>
                        <SelectItem value="March" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">March</SelectItem>
                        <SelectItem value="April" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">April</SelectItem>
                        <SelectItem value="May" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">May</SelectItem>
                        <SelectItem value="June" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">June</SelectItem>
                        <SelectItem value="July" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">July</SelectItem>
                        <SelectItem value="August" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">August</SelectItem>
                        <SelectItem value="September" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">September</SelectItem>
                        <SelectItem value="October" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">October</SelectItem>
                        <SelectItem value="November" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">November</SelectItem>
                        <SelectItem value="December" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">December</SelectItem>
                  </SelectContent>
                </Select>
            </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="h-11 bg-white dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectItem value="All" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">All Categories</SelectItem>
                        <SelectItem value="Performance" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Performance</SelectItem>
                        <SelectItem value="Development" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Development</SelectItem>
                        <SelectItem value="Goals" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Goals</SelectItem>
                        <SelectItem value="Contracts" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Contracts</SelectItem>
                        <SelectItem value="Reviews" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Reviews</SelectItem>
                        <SelectItem value="Appraisals" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Appraisals</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>
            </div>
            )}
          </CardContent>
        </Card>

        {/* Main Report Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-2 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl">
            <TabsList className="grid w-full grid-cols-5 bg-transparent h-12">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="contracts" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Contracts
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="appraisals" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <Award className="w-4 h-4 mr-2" />
                Appraisals
              </TabsTrigger>
              <TabsTrigger 
                value="pip" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                PIP
              </TabsTrigger>
              <TabsTrigger 
                value="staff-appraisal" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Staff Appraisal Report
              </TabsTrigger>
              <TabsTrigger 
                value="department-summary" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Department Summary
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <StaggeredChildren>
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </StaggeredChildren>
            ) : (
              renderOverviewReport()
            )}
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            {isLoading ? (
              <StaggeredChildren>
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </StaggeredChildren>
            ) : (
              renderContractsReport()
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {isLoading ? (
              <StaggeredChildren>
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </StaggeredChildren>
            ) : (
              renderReviewsReport()
            )}
          </TabsContent>

          <TabsContent value="appraisals" className="space-y-6">
            {isLoading ? (
              <StaggeredChildren>
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </StaggeredChildren>
            ) : (
              renderAppraisalsReport()
            )}
          </TabsContent>

          <TabsContent value="pip" className="space-y-6">
            {isLoading ? (
              <StaggeredChildren>
                {[...Array(2)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </StaggeredChildren>
            ) : (
              renderPIPReport()
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OfficerReport;
