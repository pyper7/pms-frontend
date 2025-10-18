import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/utils/toast';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock,
  Award,
  FileText,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  Upload,
  X,
  Save,
  Send,
  Download,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  File,
  Image,
  FileImage,
  User,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface EmployeeInfo {
  surname: string;
  firstName: string;
  ippis: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  location: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  target: number | string;
  unit: string;
  weight: number;
  officerAchievement: number | string;
  officerEvidence: string;
  officerChallenges: string;
  supervisorAchievement?: number | string;
  supervisorComments?: string;
  useOfficerScore: boolean;
}

interface Competency {
  id: number;
  category: string;
  description: string;
  minScore: number;
  maxScore: number;
  officerScore: number;
  supervisorScore?: number;
  useOfficerScore: boolean;
}

interface Process {
  id: number;
  area: string;
  target: string;
  minScore: number;
  maxScore: number;
  officerScore: number;
  supervisorScore?: number;
  useOfficerScore: boolean;
}

interface AppraisalData {
  id: string;
  period: string;
  status: 'Draft' | 'Under Review' | 'Completed' | 'Rejected';
  startDate: string;
  endDate: string;
  submittedDate: string;
  lastModified: string;
  employee: EmployeeInfo;
  tasks: Task[];
  competencies: Competency[];
  processes: Process[];
  overallScore: number;
  supervisorComments: string;
  acknowledgements: {
    officer: boolean;
    supervisor: boolean;
  };
}

const SuperviseeAppraisal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showEvidenceDialog, setShowEvidenceDialog] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Mock data - in real app, this would come from API
  const [appraisalData, setAppraisalData] = useState<AppraisalData>({
    id: id || '1',
    period: 'Q1 2024',
    status: 'Under Review',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    submittedDate: '2024-03-25',
    lastModified: '2024-03-25',
    employee: {
      surname: 'Johnson',
      firstName: 'Sarah',
      ippis: '123456',
      department: 'Information Technology',
      position: 'Senior Software Developer',
      email: 'sarah.johnson@tetfund.gov.ng',
      phone: '+234 803 000 0000',
      location: 'Abuja, Nigeria'
    },
    tasks: [
      {
        id: '1',
        title: 'Software Development',
        description: 'Develop and maintain web applications using modern technologies',
        target: 100,
        unit: 'Percentage',
        weight: 40,
        officerAchievement: 85,
        officerEvidence: 'Completed 3 major features, delivered 2 bug fixes, maintained 95% code coverage',
        officerChallenges: 'Faced integration issues with third-party APIs, had to refactor legacy code',
        supervisorAchievement: 0,
        supervisorComments: '',
        useOfficerScore: true
      },
      {
        id: '2',
        title: 'Code Quality',
        description: 'Maintain high code quality standards and documentation',
        target: 95,
        unit: 'Percentage',
        weight: 30,
        officerAchievement: 90,
        officerEvidence: 'All code reviews passed, documentation updated, unit tests written',
        officerChallenges: 'Time constraints affected documentation quality in some areas',
        supervisorAchievement: 0,
        supervisorComments: '',
        useOfficerScore: true
      },
      {
        id: '3',
        title: 'Project Delivery',
        description: 'Complete project milestones within specified timeline',
        target: '2024-03-31',
        unit: 'Date',
        weight: 30,
        officerAchievement: '2024-03-25',
        officerEvidence: 'Project completed 6 days ahead of schedule, all deliverables met',
        officerChallenges: 'Initial scope changes required additional development time',
        supervisorAchievement: '',
        supervisorComments: '',
        useOfficerScore: true
      }
    ],
    competencies: [
      {
        id: 1,
        category: 'Generic Competencies',
        description: 'Communication Skills',
        minScore: 3,
        maxScore: 5,
        officerScore: 4,
        supervisorScore: 0,
        useOfficerScore: true
      },
      {
        id: 2,
        category: 'Generic Competencies',
        description: 'Problem Solving',
        minScore: 3,
        maxScore: 5,
        officerScore: 4,
        supervisorScore: 0,
        useOfficerScore: true
      },
      {
        id: 3,
        category: 'Functional Competencies',
        description: 'Technical Skills',
        minScore: 4,
        maxScore: 5,
        officerScore: 5,
        supervisorScore: 0,
        useOfficerScore: true
      },
      {
        id: 4,
        category: 'Ethics and Values',
        description: 'Integrity and Professionalism',
        minScore: 4,
        maxScore: 5,
        officerScore: 4,
        supervisorScore: 0,
        useOfficerScore: true
      }
    ],
    processes: [
      {
        id: 1,
        area: 'Punctuality/Attendance',
        target: '95% attendance rate',
        minScore: 0,
        maxScore: 100,
        officerScore: 95,
        supervisorScore: 0,
        useOfficerScore: true
      },
      {
        id: 2,
        area: 'Work Turn Around Time',
        target: 'Complete tasks within agreed timelines',
        minScore: 0,
        maxScore: 100,
        officerScore: 90,
        supervisorScore: 0,
        useOfficerScore: true
      },
      {
        id: 3,
        area: 'Innovation on the Job',
        target: 'Implement process improvements and innovative solutions',
        minScore: 0,
        maxScore: 100,
        officerScore: 85,
        supervisorScore: 0,
        useOfficerScore: true
      }
    ],
    overallScore: 0,
    supervisorComments: '',
    acknowledgements: {
      officer: true,
      supervisor: false
    }
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getInputType = (unit: string) => {
    switch (unit.toLowerCase()) {
      case 'percentage':
      case '%':
        return 'number';
      case 'number':
      case 'count':
      case 'quantity':
        return 'number';
      case 'date':
        return 'date';
      case 'text':
      case 'description':
        return 'text';
      default:
        return 'text';
    }
  };

  const getDisplayValue = (value: number | string, unit: string) => {
    if (unit.toLowerCase() === 'date') {
      return typeof value === 'string' ? value : new Date(value).toISOString().split('T')[0];
    }
    return value;
  };

  const formatDisplayValue = (value: number | string, unit: string) => {
    if (unit.toLowerCase() === 'date') {
      return typeof value === 'string' ? new Date(value).toLocaleDateString() : new Date(value).toLocaleDateString();
    }
    return `${value} ${unit === 'Percentage' ? '%' : unit}`;
  };

  const updateTaskScore = (taskId: string, field: 'supervisorAchievement' | 'supervisorComments' | 'useOfficerScore', value: any) => {
    setAppraisalData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId 
          ? { ...task, [field]: value }
          : task
      )
    }));
  };

  const updateCompetencyScore = (competencyId: number, field: 'supervisorScore' | 'useOfficerScore', value: any) => {
    setAppraisalData(prev => ({
      ...prev,
      competencies: prev.competencies.map(comp => 
        comp.id === competencyId 
          ? { ...comp, [field]: value }
          : comp
      )
    }));
  };

  const updateProcessScore = (processId: number, field: 'supervisorScore' | 'useOfficerScore', value: any) => {
    setAppraisalData(prev => ({
      ...prev,
      processes: prev.processes.map(proc => 
        proc.id === processId 
          ? { ...proc, [field]: value }
          : proc
      )
    }));
  };

  const calculateWeightedScore = (item: Task | Competency | Process, weight: number) => {
    let score = 0;
    
    if (item.useOfficerScore) {
      if ('officerAchievement' in item) {
        // For tasks, handle different data types
        const achievement = item.officerAchievement;
        if (typeof achievement === 'number') {
          score = achievement;
        } else if (typeof achievement === 'string' && item.unit.toLowerCase() === 'date') {
          // For date achievements, calculate percentage based on target date
          const targetDate = new Date(item.target as string);
          const achievementDate = new Date(achievement);
          const diffTime = targetDate.getTime() - achievementDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // If completed before or on target date, give 100%, otherwise reduce based on delay
          score = diffDays >= 0 ? 100 : Math.max(0, 100 + (diffDays * 5)); // 5% penalty per day late
        } else {
          score = parseFloat(achievement as string) || 0;
        }
      } else {
        score = (item as Competency | Process).officerScore;
      }
    } else {
      if ('supervisorAchievement' in item) {
        const achievement = item.supervisorAchievement;
        if (typeof achievement === 'number') {
          score = achievement;
        } else if (typeof achievement === 'string' && item.unit.toLowerCase() === 'date') {
          // For date achievements, calculate percentage based on target date
          const targetDate = new Date(item.target as string);
          const achievementDate = new Date(achievement);
          const diffTime = targetDate.getTime() - achievementDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          score = diffDays >= 0 ? 100 : Math.max(0, 100 + (diffDays * 5));
        } else {
          score = parseFloat(achievement as string) || 0;
        }
      } else {
        score = (item as Competency | Process).supervisorScore || 0;
      }
    }
    
    return (score * weight) / 100;
  };

  const calculateOverallScore = () => {
    const taskScore = appraisalData.tasks.reduce((sum, task) => 
      sum + calculateWeightedScore(task, task.weight), 0
    );
    
    const competencyScore = appraisalData.competencies.reduce((sum, comp) => 
      sum + calculateWeightedScore(comp, 20), 0
    );
    
    const processScore = appraisalData.processes.reduce((sum, proc) => 
      sum + calculateWeightedScore(proc, 10), 0
    );
    
    return taskScore + competencyScore + processScore;
  };

  const handleSubmitAppraisal = () => {
    const overallScore = calculateOverallScore();
    setAppraisalData(prev => ({ ...prev, overallScore }));
    
    toast({
      title: "Appraisal Submitted",
      description: "The appraisal has been successfully submitted for final review.",
      type: "success"
    });
  };

  const openEvidenceDialog = (task: Task) => {
    setSelectedTask(task);
    setShowEvidenceDialog(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
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
      <div className="page-container">
        {/* Page Header */}
        <div className="card-base">
          <PageHeader
            title={`Performance Appraisal - ${appraisalData.employee.firstName} ${appraisalData.employee.surname}`}
            subtitle={`Review and evaluate performance for ${appraisalData.period}`}
            breadcrumbs={[
              { label: 'Director Dashboard', href: '/director/dashboard' },
              { label: 'Supervisee Appraisals', href: '/director/supervisee/appraisal' },
              { label: `${appraisalData.employee.firstName} ${appraisalData.employee.surname}` }
            ]}
            right={
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(appraisalData.status)}>
                  {appraisalData.status}
                </Badge>
                <Button variant="outline" asChild className="focus-visible">
                  <Link to="/director/supervisee/appraisal">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                  </Link>
                </Button>
              </div>
            }
          />
        </div>

        {/* Employee Profile */}
        <Card className="card-base border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30">
                {appraisalData.employee.firstName[0]}{appraisalData.employee.surname[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {appraisalData.employee.firstName} {appraisalData.employee.surname}
                    </h3>
                    <p className="text-muted-foreground">{appraisalData.employee.position}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(appraisalData.status)}>
                      {appraisalData.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-body-small text-muted-foreground">Overall Score</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {calculateOverallScore().toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-body-small text-muted-foreground">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span>{appraisalData.employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-body-small text-muted-foreground">
                    <Mail className="w-4 h-4 text-green-500" />
                    <span>{appraisalData.employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-body-small text-muted-foreground">
                    <Phone className="w-4 h-4 text-purple-500" />
                    <span>{appraisalData.employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-body-small text-muted-foreground">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{appraisalData.employee.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Appraisal Progress</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {activeTab === 'overview' ? 'Step 1 of 4' : 
                 activeTab === 'tasks' ? 'Step 2 of 4' :
                 activeTab === 'competencies' ? 'Step 3 of 4' : 'Step 4 of 4'}
              </span>
            </div>
            <Progress 
              value={activeTab === 'overview' ? 25 : 
                     activeTab === 'tasks' ? 50 :
                     activeTab === 'competencies' ? 75 : 100} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
          </CardContent>
        </Card>

        {/* Appraisal Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              Tasks (70%)
            </TabsTrigger>
            <TabsTrigger value="competencies" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <Award className="w-4 h-4" />
              Competencies (20%)
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4" />
              Processes (10%)
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Appraisal Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                      <Badge className={getStatusColor(appraisalData.status)}>
                        {appraisalData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Period</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{appraisalData.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Submitted</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(appraisalData.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Last Modified</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(appraisalData.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Score Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Overall Score</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {calculateOverallScore().toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tasks Score</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {appraisalData.tasks.reduce((sum, task) => 
                          sum + calculateWeightedScore(task, task.weight), 0
                        ).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Competencies</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {appraisalData.competencies.reduce((sum, comp) => 
                          sum + calculateWeightedScore(comp, 20), 0
                        ).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Processes</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {appraisalData.processes.reduce((sum, proc) => 
                          sum + calculateWeightedScore(proc, 10), 0
                        ).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Acknowledgements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Officer</span>
                      <Badge className={appraisalData.acknowledgements.officer ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                        {appraisalData.acknowledgements.officer ? 'Signed' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Supervisor</span>
                      <Badge className={appraisalData.acknowledgements.supervisor ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                        {appraisalData.acknowledgements.supervisor ? 'Signed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Comments */}
            <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Overall Supervisor Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Provide your overall assessment and recommendations..."
                  value={appraisalData.supervisorComments}
                  onChange={(e) => setAppraisalData(prev => ({ ...prev, supervisorComments: e.target.value }))}
                  className="min-h-[120px] bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button onClick={handleSubmitAppraisal} className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Submit Appraisal
              </Button>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks & KPIs (70%)</h3>
              <Button 
                onClick={() => setActiveTab('competencies')}
                variant="outline"
                className="flex items-center gap-2"
              >
                Next: Competencies
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {appraisalData.tasks.map((task) => (
              <Card key={task.id} className="dark-mode-card dark-shadow hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center ring-1 ring-blue-200 dark:ring-blue-800">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-lg text-gray-900 dark:text-white">{task.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {task.weight}% Weight
                      </Badge>
                      <Badge variant={task.useOfficerScore ? "default" : "outline"} className="text-xs">
                        {task.useOfficerScore ? 'Officer Score' : 'Supervisor Score'}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Target</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {formatDisplayValue(task.target, task.unit)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Officer Achievement</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {formatDisplayValue(task.officerAchievement, task.unit)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Evidence</Label>
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-300">
                        {task.officerEvidence}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => openEvidenceDialog(task)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Evidence
                      </Button>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Challenges</Label>
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-300">
                        {task.officerChallenges}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={task.useOfficerScore}
                          onChange={(e) => updateTaskScore(task.id, 'useOfficerScore', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Use Officer Score</span>
                      </label>
                    </div>

                    {!task.useOfficerScore && (
                      <div>
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">Supervisor Achievement</Label>
                        <Input
                          type={getInputType(task.unit)}
                          min={task.unit.toLowerCase() === 'date' ? undefined : '0'}
                          max={task.unit.toLowerCase() === 'date' ? undefined : '100'}
                          value={getDisplayValue(task.supervisorAchievement || '', task.unit)}
                          onChange={(e) => {
                            const value = task.unit.toLowerCase() === 'date' ? e.target.value : 
                                         task.unit.toLowerCase() === 'percentage' || task.unit.toLowerCase() === 'number' ? 
                                         (parseInt(e.target.value) || 0) : e.target.value;
                            updateTaskScore(task.id, 'supervisorAchievement', value);
                          }}
                          className="mt-1 w-32 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}

                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">Supervisor Comments</Label>
                      <Textarea
                        placeholder="Add your comments and feedback..."
                        value={task.supervisorComments || ''}
                        onChange={(e) => updateTaskScore(task.id, 'supervisorComments', e.target.value)}
                        className="mt-1 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        rows={3}
                      />
                    </div>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Weighted Score:</strong> {calculateWeightedScore(task, task.weight).toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Competencies (20%)</h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('tasks')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous: Tasks
                </Button>
                <Button 
                  onClick={() => setActiveTab('processes')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next: Processes
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {appraisalData.competencies.map((competency) => (
              <Card key={competency.id} className="dark-mode-card dark-shadow hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-lg">{competency.description}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {competency.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Officer Score</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {competency.officerScore} / {competency.maxScore}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Score Range</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {competency.minScore} - {competency.maxScore}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={competency.useOfficerScore}
                          onChange={(e) => updateCompetencyScore(competency.id, 'useOfficerScore', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Use Officer Score</span>
                      </label>
                    </div>

                    {!competency.useOfficerScore && (
                      <div>
                        <Label className="text-sm font-medium">Supervisor Score</Label>
                        <Select
                          value={competency.supervisorScore?.toString() || ''}
                          onValueChange={(value) => updateCompetencyScore(competency.id, 'supervisorScore', parseInt(value))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select score" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: competency.maxScore - competency.minScore + 1 }, (_, i) => {
                              const score = competency.minScore + i;
                              return (
                                <SelectItem key={score} value={score.toString()}>
                                  {score}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    )}


                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Weighted Score:</strong> {calculateWeightedScore(competency, 20).toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processes (10%)</h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('competencies')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous: Competencies
                </Button>
                <Button 
                  onClick={() => setActiveTab('overview')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next: Overview
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {appraisalData.processes.map((process) => (
              <Card key={process.id} className="dark-mode-card dark-shadow hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-lg">{process.area}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Process</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Target</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{process.target}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Officer Score</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {process.officerScore} / {process.maxScore}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Score Range</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {process.minScore} - {process.maxScore}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={process.useOfficerScore}
                          onChange={(e) => updateProcessScore(process.id, 'useOfficerScore', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Use Officer Score</span>
                      </label>
                    </div>

                    {!process.useOfficerScore && (
                      <div>
                        <Label className="text-sm font-medium">Supervisor Score</Label>
                        <Input
                          type="number"
                          min={process.minScore}
                          max={process.maxScore}
                          value={process.supervisorScore || ''}
                          onChange={(e) => updateProcessScore(process.id, 'supervisorScore', parseInt(e.target.value) || 0)}
                          className="mt-1 w-32"
                        />
                      </div>
                    )}


                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Weighted Score:</strong> {calculateWeightedScore(process, 10).toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation */}
        <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('overview')}
                  variant={activeTab === 'overview' ? 'default' : 'outline'}
                  size="sm"
                  className={activeTab === 'overview' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                >
                  Overview
                </Button>
                <Button 
                  onClick={() => setActiveTab('tasks')}
                  variant={activeTab === 'tasks' ? 'default' : 'outline'}
                  size="sm"
                  className={activeTab === 'tasks' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                >
                  Tasks (70%)
                </Button>
                <Button 
                  onClick={() => setActiveTab('competencies')}
                  variant={activeTab === 'competencies' ? 'default' : 'outline'}
                  size="sm"
                  className={activeTab === 'competencies' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                >
                  Competencies (20%)
                </Button>
                <Button 
                  onClick={() => setActiveTab('processes')}
                  variant={activeTab === 'processes' ? 'default' : 'outline'}
                  size="sm"
                  className={activeTab === 'processes' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                >
                  Processes (10%)
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {activeTab !== 'overview' && (
                  <Button 
                    onClick={() => {
                      const tabs = ['overview', 'tasks', 'competencies', 'processes'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                {activeTab !== 'processes' && (
                  <Button 
                    onClick={() => {
                      const tabs = ['overview', 'tasks', 'competencies', 'processes'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                {activeTab === 'processes' && (
                  <Button 
                    onClick={handleSubmitAppraisal}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 flex items-center gap-1"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                    Submit Appraisal
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Dialog */}
        <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Evidence Details - {selectedTask?.title}</DialogTitle>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Evidence Provided</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                    {selectedTask.officerEvidence}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Challenges Faced</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                    {selectedTask.officerChallenges}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowEvidenceDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default SuperviseeAppraisal;
