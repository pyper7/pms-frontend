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
  MapPin,
  TrendingDown,
  Minus
} from 'lucide-react';

// Types
interface DepartmentObjective {
  id: string;
  title: string;
  description: string;
  target: string;
  unit: string;
  weight: number;
  currentProgress: number;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  responsibleOfficer: string;
  deadline: string;
  kpis: {
    id: string;
    title: string;
    target: string;
    achievement: number;
    weight: number;
  }[];
}

interface DepartmentPerformance {
  departmentName: string;
  totalObjectives: number;
  completedObjectives: number;
  onTrackObjectives: number;
  atRiskObjectives: number;
  behindObjectives: number;
  overallProgress: number;
  averageScore: number;
  totalStaff: number;
  performanceDistribution: {
    excellent: number;
    good: number;
    satisfactory: number;
    needsImprovement: number;
    unsatisfactory: number;
  };
  topPerformers: {
    name: string;
    position: string;
    score: number;
  }[];
  areasForImprovement: string[];
  recentAchievements: {
    title: string;
    description: string;
    date: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
}

const DepartmentSummaryReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('Research & Development');
  const [selectedObjective, setSelectedObjective] = useState<DepartmentObjective | null>(null);
  const [showObjectiveDetails, setShowObjectiveDetails] = useState(false);

  // Mock data
  const departmentObjectives: DepartmentObjective[] = [
    {
      id: '1',
      title: 'Research Excellence',
      description: 'Maintain high-quality research output and publications',
      target: '15',
      unit: 'Publications',
      weight: 30,
      currentProgress: 85,
      status: 'On Track',
      responsibleOfficer: 'Dr. Sarah Johnson',
      deadline: '2024-12-31',
      kpis: [
        { id: '1', title: 'Journal Publications', target: '10', achievement: 8, weight: 60 },
        { id: '2', title: 'Conference Papers', target: '5', achievement: 4, weight: 40 }
      ]
    },
    {
      id: '2',
      title: 'Project Delivery',
      description: 'Complete all assigned projects within timeline and budget',
      target: '100',
      unit: 'Percentage',
      weight: 25,
      currentProgress: 92,
      status: 'On Track',
      responsibleOfficer: 'Mr. Michael Adebayo',
      deadline: '2024-11-30',
      kpis: [
        { id: '1', title: 'Project Completion Rate', target: '95%', achievement: 92, weight: 70 },
        { id: '2', title: 'Budget Adherence', target: '98%', achievement: 95, weight: 30 }
      ]
    },
    {
      id: '3',
      title: 'Staff Development',
      description: 'Enhance staff skills through training and development programs',
      target: '80',
      unit: 'Percentage',
      weight: 20,
      currentProgress: 65,
      status: 'At Risk',
      responsibleOfficer: 'Dr. Fatima Ibrahim',
      deadline: '2024-10-31',
      kpis: [
        { id: '1', title: 'Training Completion', target: '90%', achievement: 65, weight: 50 },
        { id: '2', title: 'Skill Assessment', target: '85%', achievement: 70, weight: 50 }
      ]
    },
    {
      id: '4',
      title: 'Innovation & Technology',
      description: 'Implement innovative solutions and technology adoption',
      target: '5',
      unit: 'Initiatives',
      weight: 15,
      currentProgress: 40,
      status: 'Behind',
      responsibleOfficer: 'Mr. James Okonkwo',
      deadline: '2024-12-15',
      kpis: [
        { id: '1', title: 'Technology Adoption', target: '3', achievement: 1, weight: 60 },
        { id: '2', title: 'Process Improvements', target: '2', achievement: 1, weight: 40 }
      ]
    },
    {
      id: '5',
      title: 'Stakeholder Engagement',
      description: 'Maintain strong relationships with external partners and stakeholders',
      target: '95',
      unit: 'Percentage',
      weight: 10,
      currentProgress: 100,
      status: 'Completed',
      responsibleOfficer: 'Ms. Grace Okafor',
      deadline: '2024-09-30',
      kpis: [
        { id: '1', title: 'Partner Satisfaction', target: '95%', achievement: 98, weight: 70 },
        { id: '2', title: 'Meeting Attendance', target: '90%', achievement: 95, weight: 30 }
      ]
    }
  ];

  const departmentPerformance: DepartmentPerformance = {
    departmentName: 'Research & Development',
    totalObjectives: 5,
    completedObjectives: 1,
    onTrackObjectives: 2,
    atRiskObjectives: 1,
    behindObjectives: 1,
    overallProgress: 76.4,
    averageScore: 85.9,
    totalStaff: 12,
    performanceDistribution: {
      excellent: 3,
      good: 5,
      satisfactory: 3,
      needsImprovement: 1,
      unsatisfactory: 0
    },
    topPerformers: [
      { name: 'Dr. Sarah Johnson', position: 'Senior Research Officer', score: 95.2 },
      { name: 'Dr. Fatima Ibrahim', position: 'Research Fellow', score: 92.1 },
      { name: 'Mr. Michael Adebayo', position: 'Project Manager', score: 88.7 }
    ],
    areasForImprovement: [
      'Technology adoption and digital transformation',
      'Staff training completion rates',
      'Innovation initiative implementation',
      'Cross-departmental collaboration'
    ],
    recentAchievements: [
      {
        title: 'Major Research Grant Awarded',
        description: 'Successfully secured $500,000 research grant from international funding body',
        date: '2024-01-15',
        impact: 'High'
      },
      {
        title: 'Technology Platform Launched',
        description: 'Deployed new project management system improving efficiency by 30%',
        date: '2024-02-01',
        impact: 'Medium'
      },
      {
        title: 'Staff Training Program Completed',
        description: 'Completed advanced research methodology training for 8 staff members',
        date: '2024-02-10',
        impact: 'Medium'
      }
    ]
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'On Track': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Behind': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting department summary report as ${format.toUpperCase()}...`);
    // Implementation would go here
  };

  const handleViewObjective = (objective: DepartmentObjective) => {
    setSelectedObjective(objective);
    setShowObjectiveDetails(true);
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
            title="Department Summary Report"
            subtitle="Comprehensive performance analysis of department objectives and staff performance"
            breadcrumbs={[
              { label: 'Director Dashboard', href: '/director/dashboard' },
              { label: 'Report & Analytics', href: '/director/reports' },
              { label: 'Department Summary Report' }
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
              Filters & Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="Research & Development">Research & Development</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{departmentPerformance.overallProgress}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <Progress value={departmentPerformance.overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{departmentPerformance.averageScore}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{departmentPerformance.totalStaff}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Objectives Status</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {departmentPerformance.completedObjectives}/{departmentPerformance.totalObjectives}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectives Overview */}
        <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Department Objectives Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900 dark:text-white">Objective</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Target</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Progress</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Responsible Officer</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Deadline</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentObjectives.map((objective) => (
                    <TableRow key={objective.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{objective.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{objective.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {objective.target} {objective.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={objective.currentProgress} className="w-20 h-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{objective.currentProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(objective.status)}>
                          {objective.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{objective.responsibleOfficer}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {new Date(objective.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewObjective(objective)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Distribution */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Staff Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Excellent</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(departmentPerformance.performanceDistribution.excellent / departmentPerformance.totalStaff) * 100} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {departmentPerformance.performanceDistribution.excellent}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Good</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(departmentPerformance.performanceDistribution.good / departmentPerformance.totalStaff) * 100} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {departmentPerformance.performanceDistribution.good}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Satisfactory</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(departmentPerformance.performanceDistribution.satisfactory / departmentPerformance.totalStaff) * 100} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {departmentPerformance.performanceDistribution.satisfactory}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Needs Improvement</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(departmentPerformance.performanceDistribution.needsImprovement / departmentPerformance.totalStaff) * 100} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {departmentPerformance.performanceDistribution.needsImprovement}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{performer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{performer.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{performer.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements & Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Achievements */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.recentAchievements.map((achievement, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                      <Badge className={getImpactColor(achievement.impact)}>
                        {achievement.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentPerformance.areasForImprovement.map((area, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{area}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objective Details Dialog */}
        <Dialog open={showObjectiveDetails} onOpenChange={setShowObjectiveDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Objective Details - {selectedObjective?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedObjective && (
              <div className="space-y-6">
                {/* Objective Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Objective Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">Description:</span>
                          <p className="text-gray-900 dark:text-white">{selectedObjective.description}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">Target:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{selectedObjective.target} {selectedObjective.unit}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">Weight:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{selectedObjective.weight}%</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">Responsible Officer:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{selectedObjective.responsibleOfficer}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">Deadline:</span>
                          <span className="text-gray-900 dark:text-white ml-2">
                            {new Date(selectedObjective.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 dark:bg-gray-700/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Progress & Status</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Current Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedObjective.currentProgress}%</span>
                          </div>
                          <Progress value={selectedObjective.currentProgress} className="h-3" />
                        </div>
                        <div className="text-center">
                          <Badge className={getStatusColor(selectedObjective.status)}>
                            {selectedObjective.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* KPIs */}
                <Card className="bg-gray-50 dark:bg-gray-700/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Performance Indicators</h4>
                    <div className="space-y-3">
                      {selectedObjective.kpis.map((kpi) => (
                        <div key={kpi.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">{kpi.title}</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{kpi.weight}% weight</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={kpi.achievement} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{kpi.achievement}%</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Target: {kpi.target}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DepartmentSummaryReport;
