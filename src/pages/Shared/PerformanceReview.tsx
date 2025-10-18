import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
import StandardModal from '@/components/ui/standard-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/utils/toast';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock,
  Award,
  FileText,
  History,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Save,
  Send,
  Download,
  AlertCircle,
  TrendingUp,
  BarChart3,
  User,
  Building,
  Plus,
  Trash2,
  Printer,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Edit,
  X
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  officerScore: number; // 1-5 scale
  supervisorScore: number; // 1-5 scale
  officerComment: string;
  supervisorComment: string;
  weight: number; // Percentage weight of this task
}

interface Competency {
  id: string;
  category: string;
  description: string;
  officerRating: number; // 1-5 scale
  supervisorRating: number; // 1-5 scale
  officerComment: string;
  supervisorComment: string;
  weight: number; // Percentage weight of this competency
}

interface EmployeeInfo {
  surname: string;
  firstName: string;
  otherNames: string;
  ippisNo: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  supervisor: {
    name: string;
    email: string;
    position: string;
  };
}

interface MonthlyReview {
  id: string;
  month: string;
  year: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedAt?: string;
  reviewedAt?: string;
  employee: EmployeeInfo;
  tasks: Task[];
  competencies: Competency[];
  overallScore: number;
  supervisorFeedback: string;
  officerFeedback: string;
  improvementAreas: string;
  strengths: string;
  nextMonthGoals: string;
  trainingNeeds: string;
  createdAt: string;
  updatedAt: string;
}

const PerformanceReview: React.FC = () => {
  const location = useLocation();
  
  // Detect user role from URL path
  const getUserRole = () => {
    const path = location.pathname;
    if (path.includes('/officer/')) return 'officer';
    if (path.includes('/supervisor/')) return 'supervisor';
    if (path.includes('/director/supervisee/')) return 'supervisee-director';
    if (path.includes('/assistant-director/supervisee/')) return 'supervisee-assistant-director';
    if (path.includes('/director/')) return 'director';
    if (path.includes('/assistant-director/')) return 'assistant-director';
    if (path.includes('/hr/')) return 'hr';
    return 'officer'; // default
  };

  const userRole = getUserRole();
  const isOfficer = userRole === 'officer';
  const isSupervisor = userRole === 'supervisor';
  const isDirector = userRole === 'director';
  const isAssistantDirector = userRole === 'assistant-director';
  const isHR = userRole === 'hr';
  const isSuperviseeDirector = userRole === 'supervisee-director';
  const isSuperviseeAssistantDirector = userRole === 'supervisee-assistant-director';
  const isSuperviseeMode = isSuperviseeDirector || isSuperviseeAssistantDirector;

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'>('Draft');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<MonthlyReview | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Pagination and filtering
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);

  // Steps definition
  const steps = [
    { id: 1, title: 'Tasks & Objectives', description: 'Review and evaluate monthly tasks', percentage: 0 },
    { id: 2, title: 'Competencies', description: 'Assess core competencies and skills', percentage: 0 },
    { id: 3, title: 'Feedback & Goals', description: 'Provide feedback and set next month goals', percentage: 0 },
    { id: 4, title: 'Review & Submit', description: 'Review and submit monthly performance review', percentage: 0 }
  ];

  // Current review data
  const [reviewData, setReviewData] = useState({
    tasks: [
      {
        id: '1',
        title: 'Complete monthly project deliverables',
        description: 'Deliver all assigned project components within timeline',
        startDate: '2024-01-01',
        dueDate: '2024-01-31',
        status: 'Completed' as const,
        officerScore: 4,
        supervisorScore: 0,
        officerComment: 'Successfully completed all deliverables ahead of schedule',
        supervisorComment: '',
        weight: 40
      },
      {
        id: '2',
        title: 'Team collaboration and support',
        description: 'Provide support to team members and collaborate effectively',
        startDate: '2024-01-01',
        dueDate: '2024-01-31',
        status: 'Completed' as const,
        officerScore: 5,
        supervisorScore: 0,
        officerComment: 'Actively supported team members and contributed to team success',
        supervisorComment: '',
        weight: 30
      },
      {
        id: '3',
        title: 'Process improvement initiatives',
        description: 'Identify and implement process improvements',
        startDate: '2024-01-01',
        dueDate: '2024-01-31',
        status: 'In Progress' as const,
        officerScore: 3,
        supervisorScore: 0,
        officerComment: 'Working on identifying improvement opportunities',
        supervisorComment: '',
        weight: 30
      }
    ],
    competencies: [
      {
        id: '1',
        category: 'Generic',
        description: 'General competencies including communication, teamwork, and problem-solving skills',
        officerRating: 4,
        supervisorRating: 0,
        officerComment: 'Demonstrates good general competencies in daily work',
        supervisorComment: '',
        weight: 35
      },
      {
        id: '2',
        category: 'Functional',
        description: 'Job-specific technical skills and expertise required for role performance',
        officerRating: 4,
        supervisorRating: 0,
        officerComment: 'Strong functional competencies in technical areas',
        supervisorComment: '',
        weight: 35
      },
      {
        id: '3',
        category: 'Ethics',
        description: 'Professional ethics, integrity, and adherence to organizational values',
        officerRating: 5,
        supervisorRating: 0,
        officerComment: 'Maintains high ethical standards and professional integrity',
        supervisorComment: '',
        weight: 30
      }
    ],
    supervisorFeedback: '',
    officerFeedback: '',
    improvementAreas: '',
    strengths: '',
    nextMonthGoals: '',
    trainingNeeds: ''
  });

  // Mock historical reviews data
  const [reviewHistory] = useState<MonthlyReview[]>(
    Array.from({ length: 12 }).map((_, idx) => {
      const year = 2024;
      const month = idx + 1;
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const id = `${year}-${String(month).padStart(2, '0')}`;
      const statuses = ['Approved', 'Under Review', 'Submitted', 'Rejected'] as const;
      const status = statuses[idx % 4];
      
      return {
        id,
        month: monthNames[month - 1],
        year,
        status,
        submittedAt: status !== 'Approved' ? new Date().toISOString() : undefined,
        reviewedAt: status === 'Approved' ? new Date().toISOString() : undefined,
        employee: {
          surname: 'Fasasi',
          firstName: 'Sulaimon',
          otherNames: 'Adebayo',
          ippisNo: 'TET001',
          department: 'Information Technology',
          position: 'Software Developer',
          email: 'sulaimon.fasasi@tetfund.gov.ng',
          phone: '+234-801-234-5678',
          supervisor: {
            name: 'Dr. John Smith',
            email: 'john.smith@tetfund.gov.ng',
            position: 'Head of IT Department'
          }
        },
        tasks: [],
        competencies: [],
        overallScore: 4.2,
        supervisorFeedback: 'Excellent performance this month. Keep up the great work!',
        officerFeedback: 'I am satisfied with my performance and look forward to next month\'s challenges.',
        improvementAreas: 'Continue developing leadership skills and advanced technical expertise.',
        strengths: 'Strong technical skills, excellent communication, and proactive approach.',
        nextMonthGoals: 'Take on more complex projects and mentor junior team members.',
        trainingNeeds: 'Advanced React development and project management training.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    })
  );

  // Employee Info
  const [employee] = useState<EmployeeInfo>({
    surname: 'Fasasi',
    firstName: 'Sulaimon',
    otherNames: 'Adebayo',
    ippisNo: 'TET001',
    department: 'Information Technology',
    position: 'Software Developer',
    email: 'sulaimon.fasasi@tetfund.gov.ng',
    phone: '+234-801-234-5678',
    supervisor: {
      name: 'Dr. John Smith',
      email: 'john.smith@tetfund.gov.ng',
      position: 'Head of IT Department'
    }
  });

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && !isSubmitted) {
      const autoSave = setInterval(() => {
        setLastSaved(new Date());
        // Here you would save to localStorage or API
        localStorage.setItem('performanceReview', JSON.stringify(reviewData));
      }, 2000);
      return () => clearInterval(autoSave);
    }
  }, [reviewData, isEditing, isSubmitted]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('performanceReview');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setReviewData(parsedData);
      } catch (error) {
        console.error('Error loading saved review data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Helper functions
  const getStepStatus = (stepId: number): 'completed' | 'current' | 'pending' | 'error' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  // Step completion status
  const isStepCompleted = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return reviewData.tasks.every(task => 
          task.officerScore !== undefined && task.officerScore !== null && 
          task.officerScore >= 1 && task.officerScore <= 5 &&
          task.officerComment && task.officerComment.trim() !== ''
        );
      case 2:
        return reviewData.competencies.every(comp => 
          comp.officerComment && comp.officerComment.trim() !== ''
        );
      case 3:
        return reviewData.strengths && reviewData.strengths.trim() !== '' &&
               reviewData.improvementAreas && reviewData.improvementAreas.trim() !== '' &&
               reviewData.trainingNeeds && reviewData.trainingNeeds.trim() !== '' &&
               reviewData.nextMonthGoals && reviewData.nextMonthGoals.trim() !== '';
      case 4:
        return reviewData.officerFeedback && reviewData.officerFeedback.trim() !== '';
      default:
        return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'Submitted': return <Send className="w-4 h-4" />;
      case 'Rejected': return <X className="w-4 h-4" />;
      case 'Draft': return <Edit className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const canEditReview = () => {
    return reviewStatus === 'Draft' || reviewStatus === 'Rejected';
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      clearValidationErrors();
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please complete all required fields before proceeding');
    }
  };

  const prevStep = () => {
    clearValidationErrors();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTask = useCallback((taskId: string, field: keyof Task, value: any) => {
    setReviewData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }));
  }, []);

  const updateCompetency = useCallback((compId: string, field: keyof Competency, value: any) => {
    setReviewData(prev => ({
      ...prev,
      competencies: prev.competencies.map(comp => 
        comp.id === compId ? { ...comp, [field]: value } : comp
      )
    }));
  }, []);

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};
    
    switch (step) {
      case 1: // Tasks & Objectives
        if (reviewData.tasks.length === 0) {
          errors.tasks = 'At least one task is required';
        }
        reviewData.tasks.forEach((task, index) => {
          if (!task.title.trim()) {
            errors[`task-${index}-title`] = 'Task title is required';
          }
          if (!task.description.trim()) {
            errors[`task-${index}-description`] = 'Task description is required';
          }
          if (task.officerScore === 0) {
            errors[`task-${index}-score`] = 'Please rate this task';
          }
        });
        break;
        
      case 2: // Competencies
        reviewData.competencies.forEach((comp, index) => {
          if (comp.officerRating === 0) {
            errors[`comp-${index}-rating`] = 'Please rate this competency';
          }
        });
        break;
        
      case 3: // Feedback & Goals
        if (!reviewData.officerFeedback.trim()) {
          errors.officerFeedback = 'Your feedback is required';
        }
        if (!reviewData.nextMonthGoals.trim()) {
          errors.nextMonthGoals = 'Next month goals are required';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };


  // Filter and pagination logic
  const availableYears = useMemo(() => 
    Array.from(new Set(reviewHistory.map(r => r.year))).sort((a, b) => b - a), 
    [reviewHistory]
  );
  
  const availableMonths = useMemo(() => 
    Array.from(new Set(reviewHistory.map(r => r.month))).sort(), 
    [reviewHistory]
  );
  
  const monthNames = useMemo(() => 
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 
    []
  );
  
  const filteredReviews = useMemo(() => 
    reviewHistory.filter(review => {
      const yearMatch = selectedYear === 'All' || review.year.toString() === selectedYear;
      const monthMatch = selectedMonth === 'All' || review.month === selectedMonth;
      return yearMatch && monthMatch;
    }), 
    [reviewHistory, selectedYear, selectedMonth]
  );
  
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredReviews.length / pageSize)), 
    [filteredReviews.length, pageSize]
  );
  
  const pageReviews = useMemo(() => 
    filteredReviews.slice((page - 1) * pageSize, page * pageSize), 
    [filteredReviews, page, pageSize]
  );

  // Calculate overall score
  const calculateOverallScore = useMemo(() => {
    const taskScore = reviewData.tasks.reduce((sum, task) => sum + (task.officerScore * task.weight), 0) / 100;
    const competencyScore = reviewData.competencies.reduce((sum, comp) => sum + (comp.officerRating * comp.weight), 0) / 100;
    return Math.round((taskScore + competencyScore) * 10) / 10;
  }, [reviewData.tasks, reviewData.competencies]);

  const handleSubmit = async () => {
    // Validation
    const hasTasks = reviewData.tasks.some(task => task.title && task.description);
    const hasCompetencies = reviewData.competencies.some(comp => comp.officerRating > 0);
    
    if (!hasTasks && !hasCompetencies) {
      toast.error('Please complete at least one task or competency evaluation before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would call the backend API to submit review
      // await apiService.submitReview({ ...reviewData });
      
      toast.success('Monthly performance review submitted successfully');
      setIsSubmitted(true);
      setReviewStatus('Submitted');
      
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => {
    setReviewStatus('Approved');
    toast.success('Review approved successfully');
  };

  const handleReject = () => {
    setReviewStatus('Rejected');
    toast.error('Review rejected - please revise and resubmit');
  };

  const handleViewReview = (review: MonthlyReview) => {
    setSelectedReview(review);
    setShowDetailDialog(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement download functionality
    toast.success('Review downloaded successfully');
  };

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
          title={`Monthly Performance Review${isOfficer ? '' : isSuperviseeMode ? ' - Supervisee Review' : ` - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} View`}`}
          subtitle={
            isOfficer 
              ? "Complete your monthly performance evaluation with supervisor feedback"
              : isSuperviseeMode
              ? "Review and manage monthly performance evaluations for your supervisees. Provide feedback, approve, or request modifications on submitted reviews."
              : `Review and manage monthly performance evaluations for your team members. ${isSupervisor ? 'Provide feedback and approve submitted reviews.' : 'Monitor and track team performance progress.'}`
          }
          right={
            <div className="flex items-center gap-3">
              {lastSaved && (
                <AutoSaveIndicator lastSaved={lastSaved} status="saved" />
              )}
              <Button 
                variant="outline" 
                onClick={handlePrint} 
                className="focus-visible"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              {!isSubmitted && canEditReview() && (
              <Button 
                onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="focus-visible"
              >
                  <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              )}
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
              <li className="text-foreground font-semibold">Monthly Performance Review</li>
            </ol>
          </nav>
        </div>

        {/* Tabs: Current vs Historical Reviews */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'current' | 'history')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-2 rounded-2xl shadow-lg border-2 border-border">
            <TabsTrigger 
              value="current" 
              className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground"
            >
              <FileText className="w-4 h-4" />
              <span>Current Review</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground"
            >
              <History className="w-4 h-4" />
              <span>Historical Reviews</span>
            </TabsTrigger>
          </TabsList>

          {/* Historical Reviews Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="card-base">
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <History className="w-5 h-5" />
                  Historical Monthly Reviews
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-body-small text-muted-foreground">Year</Label>
                    <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setPage(1); }}>
                      <SelectTrigger className="w-[120px] focus-visible">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-body-small text-muted-foreground">Month</Label>
                    <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v); setPage(1); }}>
                      <SelectTrigger className="w-[140px] focus-visible">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {availableMonths.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === 1} 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="text-sm text-muted-foreground min-w-[80px] text-center px-3">
                      Page {page} of {totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === totalPages} 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 disabled:opacity-50"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-10 bg-slate-200 rounded" />))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pageReviews.map((r) => (
                    <div key={r.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{r.month} {r.year}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(r.status)}`}>{r.status}</span>
                          </div>
                          {r.submittedAt && (
                            <div className="text-xs text-muted-foreground">
                              Submitted: {new Date(r.submittedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewReview(r)}
                          className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700"
                          aria-label={`View details for ${r.month} ${r.year} review`}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pageReviews.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No reviews found for the selected filters.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          </TabsContent>

          {/* Current Review Tab */}
          <TabsContent value="current" className="space-y-6">
            {!isSubmitted && (
              <>
                {/* Progress Indicator */}
                <Card className="bg-gradient-to-r from-card to-muted border-border dark:from-slate-800/70 dark:to-slate-900/50 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/50 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                          Review Progress
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                          Complete each section to finish your monthly performance review
                        </p>
                    </div>
                      <div className="text-center sm:text-right">
                        <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
                          {currentStep}
                        </div>
                        <div className="text-sm sm:text-base text-muted-foreground font-semibold">
                          of {steps.length} steps
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-4 overflow-x-auto pb-2" role="progressbar" aria-label="Review progress steps">
                      {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        return (
                          <div key={step.id} className="flex items-center flex-shrink-0">
                            <button
                              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                status === 'completed'
                                  ? 'bg-emerald-600 text-white scale-110 hover:scale-125 shadow-lg'
                                  : status === 'current'
                                  ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600 scale-110 hover:scale-125 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-500 dark:hover:bg-emerald-900/40'
                                  : status === 'error'
                                  ? 'bg-red-100 text-red-600 border-2 border-red-600 scale-110 hover:scale-125 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500 dark:hover:bg-red-900/40'
                                  : 'bg-muted text-muted-foreground hover:scale-110 hover:shadow-lg dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700/80 dark:hover:text-slate-100 dark:hover:shadow-slate-900/40 dark:hover:border-slate-500'
                              }`}
                              aria-label={`Step ${step.id}: ${step.title} - ${status === 'completed' ? 'Completed' 
                                 : status === 'current' ? 'In Progress'
                                 : status === 'error' ? 'Incomplete'
                                 : 'Pending'}`}
                              tabIndex={0}
                            >
                              {status === 'completed' ? (
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" aria-hidden="true" />
                              ) : status === 'error' ? (
                                <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" aria-hidden="true" />
                              ) : (
                                <span aria-hidden="true" className="text-xs sm:text-sm">{step.id}</span>
                              )}
                            </button>
                            <div className="ml-1 sm:ml-2 min-w-0">
                              <div className={`text-xs sm:text-sm font-bold leading-tight ${
                                status === 'completed' ? 'text-emerald-800' 
                                : status === 'current' ? 'text-emerald-600'
                                : status === 'error' ? 'text-red-600'
                                : 'text-muted-foreground'
                              }`}>
                                <span className="hidden md:inline">{step.title}</span>
                                <span className="md:hidden">Step {step.id}</span>
                      </div>
                              <div className="text-xs text-muted-foreground hidden sm:block">
                                {status === 'completed' ? 'Completed' 
                                 : status === 'current' ? 'In Progress'
                                 : status === 'error' ? 'Incomplete'
                                 : 'Pending'}
                      </div>
                              {step.percentage > 0 && (
                                <div className="text-xs text-muted-foreground hidden sm:block">{step.percentage}%</div>
                              )}
                      </div>
                            {index < steps.length - 1 && (
                              <div className={`w-4 sm:w-6 md:w-8 h-0.5 mx-1 sm:mx-2 hidden sm:block ${
                                status === 'completed' ? 'bg-emerald-600' 
                                : status === 'error' ? 'bg-red-300'
                                : 'bg-muted dark:bg-slate-700/50'
                              }`} />
                            )}
                      </div>
                        );
                      })}
                      </div>

                    <div className="bg-muted rounded-full h-3 shadow-inner dark:bg-slate-800/70 dark:shadow-slate-900/60 dark:border dark:border-slate-700/50">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                        style={{ width: `${(steps.filter(step => isStepCompleted(step.id)).length / steps.length) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                      </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Progress: {steps.filter(step => isStepCompleted(step.id)).length} of {steps.length} steps completed</span>
                      <span>{Math.round((steps.filter(step => isStepCompleted(step.id)).length / steps.length) * 100)}% Complete</span>
                    </div>
                </CardContent>
              </Card>

                {/* Step Content */}
                <div className="mt-8">
                  {/* Step 1: Tasks & Objectives */}
                  {currentStep === 1 && (
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-2 border-border shadow-xl dark:from-slate-800/90 dark:to-slate-700/50 dark:border-slate-600/50 dark:shadow-2xl dark:shadow-slate-900/20">
                <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          Tasks & Objectives
                  </CardTitle>
                        <p className="text-muted-foreground dark:text-slate-300">Evaluate your monthly tasks and performance objectives</p>
                </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {reviewData.tasks.map((task) => (
                            <div key={task.id} className="bg-muted rounded-lg border-2 border-border p-6 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border-slate-700/60 dark:shadow-xl dark:shadow-slate-950/20 dark:backdrop-blur-sm hover:dark:shadow-slate-950/30 transition-all duration-300">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold dark:text-slate-100">Task {reviewData.tasks.indexOf(task) + 1}</h3>
                    </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Task</Label>
                                  <div className="mt-1 p-2 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-foreground dark:text-slate-100 font-medium">
                                    {task.title}
                      </div>
                      </div>
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Weight (%)</Label>
                                  <div className="mt-1 p-2 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-foreground dark:text-slate-100">
                                    {task.weight}%
                      </div>
                      </div>
                      </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Start Date</Label>
                                  <div className="mt-1 p-2 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-foreground dark:text-slate-100">
                                    {task.startDate}
                      </div>
                    </div>
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">End Date</Label>
                                  <div className="mt-1 p-2 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-foreground dark:text-slate-100">
                                    {task.dueDate}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Your Comment</Label>
                                  <Textarea
                                    value={task.officerComment}
                                    onChange={(e) => updateTask(task.id, 'officerComment', e.target.value)}
                                    disabled={!canEditReview()}
                                    className="mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                                    rows={2}
                                    placeholder="Describe your performance on this task..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Supervisor Comment</Label>
                                  <div className="mt-1 p-2 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-muted-foreground dark:text-slate-400 min-h-[60px]">
                                    {task.supervisorComment || 'Pending supervisor feedback'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                        </div>
                </CardContent>
              </Card>
                  )}

                  {/* Step 2: Competencies */}
                  {currentStep === 2 && (
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-2 border-border shadow-xl dark:from-slate-800/90 dark:to-slate-700/50 dark:border-slate-600/50 dark:shadow-2xl dark:shadow-slate-900/20">
              <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          Competencies Assessment
                        </CardTitle>
                        <p className="text-muted-foreground dark:text-slate-300">Evaluate your core competencies and skills</p>
              </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {reviewData.competencies.map((comp) => (
                            <div key={comp.id} className="bg-muted rounded-lg border-2 border-border p-6 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border-slate-700/60 dark:shadow-xl dark:shadow-slate-950/20 dark:backdrop-blur-sm hover:dark:shadow-slate-950/30 transition-all duration-300">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">{comp.category}</h3>
                                <p className="text-sm text-muted-foreground mt-1 dark:text-slate-300 dark:leading-relaxed">{comp.description}</p>
                              </div>


                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Your Comment</Label>
                                  <Textarea
                                    value={comp.officerComment}
                                    onChange={(e) => updateCompetency(comp.id, 'officerComment', e.target.value)}
                                    disabled={!canEditReview()}
                                    className="mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                                    rows={2}
                                    placeholder="Describe your competency level..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium dark:text-slate-300">Supervisor Comment</Label>
                                  <div className="mt-1 p-2 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-muted-foreground dark:text-slate-400 min-h-[60px]">
                                    {comp.supervisorComment || 'Pending supervisor feedback'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
            </div>
          </CardContent>
        </Card>
                  )}

                  {/* Step 3: Feedback & Goals */}
                  {currentStep === 3 && (
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-2 border-border shadow-xl dark:from-slate-800/90 dark:to-slate-700/50 dark:border-slate-600/50 dark:shadow-2xl dark:shadow-slate-900/20">
          <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          Feedback & Goals
                        </CardTitle>
                        <p className="text-muted-foreground dark:text-slate-300">Provide feedback and set goals for next month</p>
          </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                            <Label className="text-sm font-medium dark:text-slate-300">Your Feedback *</Label>
                            <Textarea
                              value={reviewData.officerFeedback}
                              onChange={(e) => setReviewData(prev => ({ ...prev, officerFeedback: e.target.value }))}
                              disabled={!canEditReview()}
                              className={`mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 ${
                                validationErrors.officerFeedback ? 'border-red-500' : ''
                              }`}
                              rows={4}
                              placeholder="Share your thoughts on this month's performance..."
                            />
                            {validationErrors.officerFeedback && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors.officerFeedback}</p>
                            )}
            </div>
            <div>
                            <Label className="text-sm font-medium dark:text-slate-300">Supervisor Feedback</Label>
                            <div className="mt-1 p-3 bg-muted dark:bg-slate-700/50 rounded-md text-sm text-muted-foreground dark:text-slate-400 min-h-[100px]">
                              {reviewData.supervisorFeedback || 'Pending supervisor feedback'}
            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                            <Label className="text-sm font-medium dark:text-slate-300">Strengths</Label>
                            <Textarea
                              value={reviewData.strengths}
                              onChange={(e) => setReviewData(prev => ({ ...prev, strengths: e.target.value }))}
                              disabled={!canEditReview()}
                              className="mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                              rows={3}
                              placeholder="What are your key strengths this month?"
                            />
            </div>
            <div>
                            <Label className="text-sm font-medium dark:text-slate-300">Areas for Improvement</Label>
                            <Textarea
                              value={reviewData.improvementAreas}
                              onChange={(e) => setReviewData(prev => ({ ...prev, improvementAreas: e.target.value }))}
                              disabled={!canEditReview()}
                              className="mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                              rows={3}
                              placeholder="What areas would you like to improve?"
                            />
            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                            <Label className="text-sm font-medium dark:text-slate-300">Next Month Goals *</Label>
                            <Textarea
                              value={reviewData.nextMonthGoals}
                              onChange={(e) => setReviewData(prev => ({ ...prev, nextMonthGoals: e.target.value }))}
                              disabled={!canEditReview()}
                              className={`mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 ${
                                validationErrors.nextMonthGoals ? 'border-red-500' : ''
                              }`}
                              rows={3}
                              placeholder="What are your goals for next month?"
                            />
                            {validationErrors.nextMonthGoals && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors.nextMonthGoals}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-medium dark:text-slate-300">Training Needs</Label>
                            <Textarea
                              value={reviewData.trainingNeeds}
                              onChange={(e) => setReviewData(prev => ({ ...prev, trainingNeeds: e.target.value }))}
                              disabled={!canEditReview()}
                              className="mt-1 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                              rows={3}
                              placeholder="What training do you need?"
                            />
                          </div>
            </div>
          </CardContent>
        </Card>
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-2 border-border shadow-xl dark:from-slate-800/90 dark:to-slate-700/50 dark:border-slate-600/50 dark:shadow-2xl dark:shadow-slate-900/20">
          <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          Review & Submit
                        </CardTitle>
                        <p className="text-muted-foreground dark:text-slate-300">Review your monthly performance evaluation and submit</p>
          </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Overall Score */}
                        <div className="p-4 bg-muted rounded-lg dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border dark:border-slate-700/60 dark:shadow-lg dark:shadow-slate-950/10">
                          <h3 className="text-lg font-semibold mb-4 dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">Overall Performance Score</h3>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-300 dark:drop-shadow-sm">
                              {calculateOverallScore}/5.0
                            </div>
                            <div className="text-sm text-muted-foreground dark:text-slate-300 mt-2">
                              Based on your task and competency evaluations
                            </div>
                          </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-card rounded-lg dark:bg-gradient-to-br dark:from-slate-700/60 dark:to-slate-800/40 dark:border dark:border-slate-600/40 dark:shadow-lg dark:shadow-slate-950/10 hover:dark:shadow-slate-950/20 transition-all duration-300">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 dark:drop-shadow-sm">{reviewData.tasks.length}</div>
                            <div className="text-sm text-muted-foreground dark:text-slate-300 dark:tracking-wide">Tasks Evaluated</div>
                          </div>
                          <div className="text-center p-4 bg-card rounded-lg dark:bg-gradient-to-br dark:from-slate-700/60 dark:to-slate-800/40 dark:border dark:border-slate-600/40 dark:shadow-lg dark:shadow-slate-950/10 hover:dark:shadow-slate-950/20 transition-all duration-300">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 dark:drop-shadow-sm">{reviewData.competencies.length}</div>
                            <div className="text-sm text-muted-foreground dark:text-slate-300 dark:tracking-wide">Competencies</div>
                          </div>
                          <div className="text-center p-4 bg-card rounded-lg dark:bg-gradient-to-br dark:from-slate-700/60 dark:to-slate-800/40 dark:border dark:border-slate-600/40 dark:shadow-lg dark:shadow-slate-950/10 hover:dark:shadow-slate-950/20 transition-all duration-300">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 dark:drop-shadow-sm">{new Date().toLocaleDateString('en-US', { month: 'long' })}</div>
                            <div className="text-sm text-muted-foreground dark:text-slate-300 dark:tracking-wide">Review Period</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between flex-wrap gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:border-slate-600/60 dark:text-slate-200 dark:hover:bg-slate-700/80 dark:shadow-lg dark:shadow-slate-950/10 dark:backdrop-blur-sm"
                      aria-label="Go to previous step"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={nextStep}
                      disabled={currentStep === steps.length}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 dark:shadow-emerald-500/30 dark:border dark:border-emerald-400/30 dark:backdrop-blur-sm"
                      aria-label="Go to next step"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Submitted Status Page */}
            {isSubmitted && (
              <div className="space-y-6">
                {/* Status Cards */}
                {reviewStatus === 'Submitted' && (
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/25 dark:shadow-2xl dark:shadow-blue-950/20 dark:backdrop-blur-sm dark:border dark:border-blue-800/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg dark:from-blue-500 dark:to-indigo-600 dark:shadow-blue-500/30 dark:border dark:border-blue-400/30">
                            <Send className="w-6 h-6 text-white dark:drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-100 dark:tracking-wide dark:drop-shadow-sm">Review Submitted Successfully</h3>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700">
                              <Send className="w-3 h-3 mr-1" />
                              Submitted
                            </Badge>
                          </div>
                          <p className="text-blue-700 dark:text-blue-200 mb-4">
                            Your monthly performance review has been submitted and is now under supervisor review.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                              <span className="font-medium dark:text-slate-300">Overall Score:</span>
                              <span className="ml-2 text-emerald-600 dark:text-emerald-300 font-bold">{calculateOverallScore}/5.0</span>
            </div>
            <div>
                              <span className="font-medium dark:text-slate-300">Submitted:</span>
                              <span className="ml-2 dark:text-slate-300">{new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
            </div>
          </CardContent>
        </Card>
                )}

                {reviewStatus === 'Approved' && (
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/25 dark:shadow-2xl dark:shadow-emerald-950/20 dark:backdrop-blur-sm dark:border dark:border-emerald-800/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg dark:from-emerald-500 dark:to-green-600 dark:shadow-emerald-500/30 dark:border dark:border-emerald-400/30">
                            <CheckCircle className="w-6 h-6 text-white dark:drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-100 dark:tracking-wide dark:drop-shadow-sm">Review Approved! 🎉</h3>
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          </div>
                          <p className="text-emerald-700 dark:text-emerald-200 mb-4">
                            Congratulations! Your monthly performance review has been approved by your supervisor.
                          </p>
                          
                          <div className="flex gap-3">
                            <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button onClick={handlePrint} variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20">
                              <Printer className="w-4 h-4 mr-2" />
                              Print
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {reviewStatus === 'Rejected' && (
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/25 dark:shadow-2xl dark:shadow-red-950/20 dark:backdrop-blur-sm dark:border dark:border-red-800/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg dark:from-red-500 dark:to-rose-600 dark:shadow-red-500/30 dark:border dark:border-red-400/30">
                            <X className="w-6 h-6 text-white dark:drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-red-800 dark:text-red-100 dark:tracking-wide dark:drop-shadow-sm">Review Requires Revision</h3>
                            <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700">
                              <X className="w-3 h-3 mr-1" />
                              Rejected
                            </Badge>
                          </div>
                          <p className="text-red-700 dark:text-red-200 mb-4">
                            Your supervisor has provided feedback. Please review and revise your performance review.
                          </p>
                          
                          <div className="flex gap-3">
                            <Button onClick={() => { setIsSubmitted(false); setReviewStatus('Draft'); }} className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600">
                              <Edit className="w-4 h-4 mr-2" />
                              Revise Review
                            </Button>
                            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact Supervisor
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Historical Review Detail Dialog */}
        <StandardModal
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          title={`${selectedReview?.month} ${selectedReview?.year} Performance Review`}
          size="2xl"
        >
            
            {selectedReview && (
              <div className="space-y-6">
                {/* Employee and Supervisor Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Employee Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <Label className="text-slate-600 font-medium">Surname</Label>
                          <p className="font-medium">{selectedReview.employee.surname}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-600 font-medium">First Name</Label>
                          <p className="font-medium">{selectedReview.employee.firstName}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-600 font-medium">Other Names</Label>
                          <p className="font-medium">{selectedReview.employee.otherNames}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-600 font-medium">IPPIS Number</Label>
                          <p className="font-medium">{selectedReview.employee.ippisNo}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-600 font-medium">Email</Label>
                          <p className="font-medium">-</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-600 font-medium">Phone</Label>
                          <p className="font-medium">-</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-slate-600 font-medium">Department</Label>
                          <p className="font-medium">{selectedReview.employee.department}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800 flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Supervisor Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <Label className="text-blue-600 font-medium">Name</Label>
                          <p className="font-medium">{selectedReview.employee.supervisor.name || '-'}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-blue-600 font-medium">Position</Label>
                          <p className="font-medium">{selectedReview.employee.supervisor.position || '-'}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-blue-600 font-medium">Email</Label>
                          <p className="font-medium">{selectedReview.employee.supervisor.email || '-'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Review Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm font-medium">Overall Score</Label>
                        <p className="mt-1 text-2xl font-bold text-emerald-600">{selectedReview.overallScore}/5.0</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <p className="mt-1">
                          <Badge className={getStatusColor(selectedReview.status)}>
                            {getStatusIcon(selectedReview.status)}
                            <span className="ml-1">{selectedReview.status}</span>
                          </Badge>
                        </p>
                    </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Strengths</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedReview.strengths || 'No notes provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Areas for Improvement</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedReview.improvementAreas || 'No notes provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Month Goals</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedReview.nextMonthGoals || 'No notes provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Training Needs</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedReview.trainingNeeds || 'No notes provided'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium">Officer's Feedback</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedReview.officerFeedback || 'No comment provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Supervisor's Feedback</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedReview.supervisorFeedback || 'No comment provided'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </StandardModal>
      </div>
    </Layout>
  );
};

export default PerformanceReview;


