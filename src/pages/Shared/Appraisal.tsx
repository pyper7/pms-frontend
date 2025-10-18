import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/utils/toast';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';
import { useAutoSave } from '@/hooks/useAutoSave';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
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
  FileImage
} from 'lucide-react';

interface EmployeeInfo {
  surname: string;
  firstName: string;
  ippis: string;
  department: string;
  position: string;
  email: string;
  phone: string;
}

interface HistoricalAppraisal {
  id: string;
  period: string;
  quarter: string;
  year: number;
  overallScore: number;
  status: 'Completed' | 'In Progress' | 'Pending Review';
  submittedAt: string;
  reviewedAt?: string;
  employee: EmployeeInfo;
}

const Appraisal: React.FC = () => {
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('current');
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');
  const [page, setPage] = useState<number>(1);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState<HistoricalAppraisal | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [acknowledgements, setAcknowledgements] = useState({
    honest: false,
    supervisorReview: false,
    followUp: false,
    performanceManagement: false
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [validationSuccess, setValidationSuccess] = useState<{
    [key: string]: boolean;
  }>({});
  const [stepValidationErrors, setStepValidationErrors] = useState<{
    [step: number]: string[];
  }>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});


  const [historicalAppraisals, setHistoricalAppraisals] = useState<HistoricalAppraisal[]>([
    {
      id: "1",
      period: "Q1 2023",
      quarter: "Q1",
      year: 2023,
      overallScore: 85.5,
      status: "Completed",
      submittedAt: "2023-03-31",
      reviewedAt: "2023-04-15",
      employee: {
        surname: "Fasasi",
        firstName: "Sulaimon",
        ippis: "123456",
        department: "Information Technology",
        position: "Software Developer",
        email: "sulaimon.fasasi@tetfund.gov.ng",
        phone: "+234 803 000 0000"
      }
    },
    {
      id: "2",
      period: "Q2 2023",
      quarter: "Q2",
      year: 2023,
      overallScore: 78.2,
      status: "Completed",
      submittedAt: "2023-06-30",
      reviewedAt: "2023-07-10",
      employee: {
        surname: "Fasasi",
        firstName: "Sulaimon",
        ippis: "123456",
        department: "Information Technology",
        position: "Software Developer",
        email: "sulaimon.fasasi@tetfund.gov.ng",
        phone: "+234 803 000 0000"
      }
    },
    {
      id: "3",
      period: "Q3 2023",
      quarter: "Q3",
      year: 2023,
      overallScore: 92.1,
      status: "Completed",
      submittedAt: "2023-09-30",
      reviewedAt: "2023-10-05",
      employee: {
        surname: "Fasasi",
        firstName: "Sulaimon",
        ippis: "123456",
        department: "Information Technology",
        position: "Software Developer",
        email: "sulaimon.fasasi@tetfund.gov.ng",
        phone: "+234 803 000 0000"
      }
    },
    {
      id: "4",
      period: "Q4 2023",
      quarter: "Q4",
      year: 2023,
      overallScore: 88.7,
      status: "Completed",
      submittedAt: "2023-12-31",
      reviewedAt: "2024-01-08",
      employee: {
        surname: "Fasasi",
        firstName: "Sulaimon",
        ippis: "123456",
        department: "Information Technology",
        position: "Software Developer",
        email: "sulaimon.fasasi@tetfund.gov.ng",
        phone: "+234 803 000 0000"
      }
    }
  ]);

  const [appraisalData, setAppraisalData] = useState({
    period: "Q1 2024",
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    objectives: [
      {
        id: "1",
        title: "Software Development",
        description: "Develop and maintain web applications using modern technologies",
        target: 100,
        unit: "%",
        weight: 40,
        achievement: 85,
        evidence: "",
        challenges: ""
      },
      {
        id: "2",
        title: "Code Quality",
        description: "Maintain high code quality standards and documentation",
        target: 95,
        unit: "%",
        weight: 30,
        achievement: 85,
        evidence: "",
        challenges: ""
      },
      {
        id: "3",
        title: "Team Collaboration",
        description: "Work effectively with team members and stakeholders",
        target: 90,
        unit: "%",
        weight: 30,
        achievement: 85,
        evidence: "",
        challenges: ""
      }
    ],
    competencies: [
      {
        id: 1,
        category: 'Generic Competencies',
        description: 'Communication Skills',
        minScore: 3,
        maxScore: 5,
        score: 4
      },
      {
        id: 2,
        category: 'Generic Competencies',
        description: 'Problem Solving',
        minScore: 3,
        maxScore: 5,
        score: 4
      },
      {
        id: 3,
        category: 'Functional Competencies',
        description: 'Technical Skills',
        minScore: 4,
        maxScore: 5,
        score: 5
      },
      {
        id: 4,
        category: 'Ethics and Values',
        description: 'Integrity and Professionalism',
        minScore: 4,
        maxScore: 5,
        score: 0
      }
    ],
    operations: [
      {
        id: 1,
        area: 'Punctuality/Attendance',
        target: '95% attendance rate',
        minScore: 0,
        maxScore: 100,
        score: 85
      },
      {
        id: 2,
        area: 'Work Turn Around Time',
        target: 'Complete tasks within agreed timelines',
        minScore: 0,
        maxScore: 100,
        score: 90
      },
      {
        id: 3,
        area: 'Innovation on the Job',
        target: 'Implement process improvements',
        minScore: 0,
        maxScore: 100,
        score: 75
      }
    ],
    overallComments: "",
    strengths: "",
    areasForImprovement: "",
    nextPeriodGoals: ""
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-save functionality
  const autoSaveData = {
    currentStep,
    appraisalData,
    acknowledgements,
    isEditing
  };

  const handleAutoSave = async (data: typeof autoSaveData) => {
    try {
      setAutoSaveStatus('saving');
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      throw error;
    }
  };

  const { saveNow, hasUnsavedChanges, isSaving } = useAutoSave({
    data: autoSaveData,
    onSave: handleAutoSave,
    interval: 30000, // 30 seconds
    enabled: isEditing,
    onError: (error) => {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
    }
  });

  // Update auto-save status based on unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && !isSaving) {
      setAutoSaveStatus('unsaved');
    }
  }, [hasUnsavedChanges, isSaving]);

  // Step navigation - matching director format
  const steps = [
    { id: 1, title: "Employee's Tasks", percentage: 70 },
    { id: 2, title: "Competencies", percentage: 20 },
    { id: 3, title: "Operations & Processes", percentage: 10 },
    { id: 4, title: "Overall Assessment", percentage: 0 },
    { id: 5, title: "Confirmation & Acknowledgements", percentage: 0 }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Filter historical appraisals
  const availableYears = [...new Set(historicalAppraisals.map(app => app.year))].sort((a, b) => b - a);
  const availableQuarters = [...new Set(historicalAppraisals.map(app => app.quarter))].sort();

  const filteredAppraisals = historicalAppraisals.filter(app => 
    app.year === selectedYear && app.quarter === selectedQuarter
  );

  const pageSize = 6;
  const totalPages = Math.ceil(filteredAppraisals.length / pageSize);
  const paginatedAppraisals = filteredAppraisals.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewAppraisal = (appraisal: HistoricalAppraisal) => {
    setSelectedAppraisal(appraisal);
    setShowDetailDialog(true);
  };

  const updateObjective = (id: string, field: string, value: any) => {
    setAppraisalData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const calculateTaskScore = (objective: any) => {
    if (!objective.achievement || !objective.target) return 0;
    return Math.min((objective.achievement / objective.target) * 100, 100);
  };

  const calculateTasksSubtotal = () => {
    return appraisalData.objectives.reduce((total, objective) => {
      const score = calculateTaskScore(objective);
      return total + (score * objective.weight / 100);
    }, 0);
  };

  const updateCompetencyScore = (id: number, value: number) => {
    setAppraisalData(prev => ({
      ...prev,
      competencies: prev.competencies.map(comp => 
        comp.id === id 
          ? { 
              ...comp, 
              score: Math.min(Math.max(value, comp.minScore), comp.maxScore) 
            } 
          : comp
      )
    }));
  };

  const updateOperationsScore = (id: number, value: number) => {
    setAppraisalData(prev => ({
      ...prev,
      operations: prev.operations.map(op => 
        op.id === id 
          ? { 
              ...op, 
              score: Math.min(Math.max(value, op.minScore), op.maxScore) 
            } 
          : op
      )
    }));
  };

  const handleFileUpload = (objectiveId: string, file: File | null) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only image files (JPEG, PNG, GIF) or PDF files');
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setUploadedFiles(prev => ({
        ...prev,
        [objectiveId]: file
      }));
      
      // Update evidence field with file name
      setAppraisalData(prev => ({
        ...prev,
        objectives: prev.objectives.map(obj => 
          obj.id === objectiveId 
            ? { ...obj, evidence: file.name }
            : obj
        )
      }));
      
      toast.success('File uploaded successfully');
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [objectiveId]: null
      }));
      
      setAppraisalData(prev => ({
        ...prev,
        objectives: prev.objectives.map(obj => 
          obj.id === objectiveId 
            ? { ...obj, evidence: '' }
            : obj
        )
      }));
    }
  };

  const removeFile = (objectiveId: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [objectiveId]: null
    }));
    
    setAppraisalData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, evidence: '' }
          : obj
      )
    }));
    
    toast.success('File removed successfully');
  };

  const getGenericCompetenciesTotal = () => {
    return appraisalData.competencies
      .filter(comp => comp.category === 'Generic Competencies')
      .reduce((total, comp) => total + (comp.score || 0), 0);
  };

  const getFunctionalCompetenciesTotal = () => {
    return appraisalData.competencies
      .filter(comp => comp.category === 'Functional Competencies')
      .reduce((total, comp) => total + (comp.score || 0), 0);
  };

  const getEthicsCompetenciesTotal = () => {
    return appraisalData.competencies
      .filter(comp => comp.category === 'Ethics and Values')
      .reduce((total, comp) => total + (comp.score || 0), 0);
  };

  const getCompetenciesSubtotal = () => {
    return getGenericCompetenciesTotal() + getFunctionalCompetenciesTotal() + getEthicsCompetenciesTotal();
  };

  const getOperationsSubtotal = () => {
    return appraisalData.operations.reduce((total, op) => total + (op.score || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'In Progress': return Clock;
      case 'Pending Review': return AlertCircle;
      default: return Clock;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast.success("Edit mode enabled");
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Changes saved successfully");
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.info("Changes cancelled");
  };

  const handleSubmit = () => {
    if (!allAcknowledgementsSelected) {
      toast.error("Please complete all acknowledgements before submitting");
      return;
    }
    
    toast.success("Appraisal submitted successfully");
    setIsEditing(false);
  };

  const handleAcknowledgementChange = (key: string, checked: boolean) => {
    setAcknowledgements(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const allAcknowledgementsSelected = Object.values(acknowledgements).every(Boolean);

  // Step validation functions
  const validateStep1 = (): string[] => {
    const errors: string[] = [];
    
    appraisalData.objectives.forEach((objective, index) => {
      if (!objective.achievement || objective.achievement < 0 || objective.achievement > 100) {
        errors.push(`Task ${index + 1}: Target achieved must be between 0-100%`);
      }
      if (!objective.evidence || objective.evidence.trim() === '') {
        errors.push(`Task ${index + 1}: Evidence is required`);
      }
      if (!objective.challenges || objective.challenges.trim() === '') {
        errors.push(`Task ${index + 1}: Challenges faced is required`);
      }
    });
    
    return errors;
  };

  const validateStep2 = (): string[] => {
    const errors: string[] = [];
    
    appraisalData.competencies.forEach((competency, index) => {
      if (competency.score === undefined || competency.score === null || competency.score < competency.minScore || competency.score > competency.maxScore) {
        errors.push(`${competency.category}: Score must be between ${competency.minScore}-${competency.maxScore}`);
      }
    });
    
    return errors;
  };

  const validateStep3 = (): string[] => {
    const errors: string[] = [];
    
    appraisalData.operations.forEach((operation, index) => {
      if (operation.score === undefined || operation.score === null || operation.score < operation.minScore || operation.score > operation.maxScore) {
        errors.push(`${operation.area}: Score must be between ${operation.minScore}-${operation.maxScore}`);
      }
    });
    
    return errors;
  };

  const validateStep5 = (): string[] => {
    const errors: string[] = [];
    
    if (!appraisalData.overallComments || appraisalData.overallComments.trim() === '') {
      errors.push('Overall comments are required');
    }
    if (!appraisalData.strengths || appraisalData.strengths.trim() === '') {
      errors.push('Strengths are required');
    }
    if (!appraisalData.areasForImprovement || appraisalData.areasForImprovement.trim() === '') {
      errors.push('Areas for improvement are required');
    }
    if (!appraisalData.nextPeriodGoals || appraisalData.nextPeriodGoals.trim() === '') {
      errors.push('Next period goals are required');
    }
    
    // Check acknowledgements
    const requiredAcknowledgements = ['honest', 'supervisorReview', 'followUp', 'performanceManagement'];
    requiredAcknowledgements.forEach(ack => {
      if (!acknowledgements[ack as keyof typeof acknowledgements]) {
        errors.push(`Please acknowledge: ${ack.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    });
    
    return errors;
  };

  const validateCurrentStep = (): boolean => {
    let errors: string[] = [];
    
    switch (currentStep) {
      case 1:
        errors = validateStep1();
        break;
      case 2:
        errors = validateStep2();
        break;
      case 3:
        errors = validateStep3();
        break;
      case 5:
        errors = validateStep5();
        break;
      default:
        return true; // Steps 4 and 6 are display-only
    }
    
    setStepValidationErrors(prev => ({
      ...prev,
      [currentStep]: errors
    }));
    
    return errors.length === 0;
  };

  // Step completion status
  const isStepCompleted = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return appraisalData.objectives.every(obj => 
          obj.achievement !== undefined && obj.achievement !== null && 
          obj.achievement >= 0 && obj.achievement <= 100 &&
          obj.evidence && obj.evidence.trim() !== '' &&
          obj.challenges && obj.challenges.trim() !== ''
        );
      case 2:
        return appraisalData.competencies.every(comp => 
          comp.score !== undefined && comp.score !== null && 
          comp.score >= comp.minScore && comp.score <= comp.maxScore
        );
      case 3:
        return appraisalData.operations.every(op => 
          op.score !== undefined && op.score !== null && 
          op.score >= op.minScore && op.score <= op.maxScore
        );
      case 4:
        return true; // Display-only step
      case 5:
        return appraisalData.overallComments && appraisalData.overallComments.trim() !== '' &&
               appraisalData.strengths && appraisalData.strengths.trim() !== '' &&
               appraisalData.areasForImprovement && appraisalData.areasForImprovement.trim() !== '' &&
               appraisalData.nextPeriodGoals && appraisalData.nextPeriodGoals.trim() !== '' &&
               Object.values(acknowledgements).every(Boolean);
      default:
        return false;
    }
  };

  const getStepStatus = (stepId: number): 'completed' | 'current' | 'pending' | 'error' => {
    if (isStepCompleted(stepId)) {
      return 'completed';
    } else if (stepId === currentStep) {
      return 'current';
    } else if (stepId < currentStep) {
      return 'error'; // Previous step not completed
    } else {
      return 'pending';
    }
  };

  // Enhanced nextStep with validation
  const nextStepWithValidation = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        // Clear validation errors for the next step
        setStepValidationErrors(prev => ({
          ...prev,
          [currentStep + 1]: []
        }));
      }
    } else {
      // Show validation errors
      toast.error(`Please fix the errors before proceeding to the next step.`);
    }
  };

  // Enhanced prevStep
  const prevStepWithValidation = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear validation errors for the previous step
      setStepValidationErrors(prev => ({
        ...prev,
        [currentStep - 1]: []
      }));
    }
  };

  // Submit confirmation
  const handleSubmitConfirmation = () => {
    // Validate all steps before showing confirmation
    const allStepsValid = validateCurrentStep();
    if (allStepsValid) {
      setShowSubmitDialog(true);
    } else {
      toast.error('Please complete all required fields before submitting.');
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Appraisal submitted successfully!');
      setShowSubmitDialog(false);
      setIsEditing(false);
      
      // Reset form or navigate away
      setCurrentStep(1);
      setStepValidationErrors({});
    } catch (error) {
      toast.error('Failed to submit appraisal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation error display component
  const ValidationErrors = ({ step }: { step: number }) => {
    const errors = stepValidationErrors[step] || [];
    if (errors.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
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
          title={`Performance Appraisal${isOfficer ? '' : isSuperviseeMode ? ' - Supervisee Review' : ` - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} View`}`}
          subtitle={
            isOfficer 
              ? "Complete your quarterly performance evaluation"
              : isSuperviseeMode
              ? "Review and manage quarterly performance appraisals for your supervisees. Provide feedback, approve, or request modifications on submitted appraisals."
              : `Review and manage quarterly performance appraisals for your team members. ${isSupervisor ? 'Provide feedback and approve submitted appraisals.' : 'Monitor and track team performance evaluations.'}`
          }
          right={
            <div className="flex items-center gap-4">
              <AutoSaveIndicator 
                status={autoSaveStatus} 
                lastSaved={lastSaved}
              />
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel} className="focus-visible">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="focus-visible">
                    Save
                  </Button>
                </div>
              ) : (
                <Button onClick={handleEdit} className="focus-visible">
                  Edit
                </Button>
              )}
            </div>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 mt-8">
          <TabsList className="grid w-full grid-cols-2 p-2 rounded-2xl shadow-lg border-2 border-border">
            <TabsTrigger 
              value="current" 
              className="gap-3 rounded-xl py-4 px-6 font-bold text-base transition-all duration-300 hover:bg-accent hover:scale-105 data-[state=active]:scale-105 data-[state=active]:bg-card data-[state=active]:text-foreground text-foreground"
            >
              <Target className="w-5 h-5" />
              Current Appraisal
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="gap-3 rounded-xl py-4 px-6 font-bold text-base transition-all duration-300 hover:bg-accent hover:scale-105 data-[state=active]:scale-105 data-[state=active]:bg-card data-[state=active]:text-foreground text-foreground"
            >
              <History className="w-5 h-5" />
              Historical Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-8">

            {/* Progress Indicator */}
            <Card className="card-base">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                      Appraisal Progress
                    </h2>
                    <p className="text-lead text-muted-foreground">
                      Complete each section to finish your appraisal
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-4xl font-bold text-emerald-600 mb-1">
                      {currentStep}
                    </div>
                    <div className="text-body-small text-muted-foreground font-semibold">
                      of {steps.length} steps
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2 mb-4 overflow-x-auto pb-2" role="progressbar" aria-label="Appraisal progress steps">
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
            {currentStep === 1 && (
              <FadeIn>
                <Card className="bg-card border-border shadow-sm dark:bg-slate-800/70 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/40 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/40 dark:hover:ring-slate-600/60 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-muted to-muted/50 border-b border-border dark:from-slate-700/60 dark:to-slate-800/40 dark:border-slate-600 dark:shadow-sm">
                    <CardTitle className="text-foreground flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-emerald-600" />
                      </div>
                      Section 1: Employee's Tasks
                      <Badge className="ml-auto bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 shadow-sm">
                        70%
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2 dark:text-slate-300">Rate your performance on assigned tasks and KPIs for this quarter.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ValidationErrors step={1} />
                    <div className="space-y-4">
                      {appraisalData.objectives.map((objective, index) => (
                        <HoverScale key={objective.id}>
                          <div className="bg-muted rounded-lg border-2 border-border p-6 hover:shadow-lg hover:border-border/50 hover:bg-card dark:bg-slate-800/50 dark:border-slate-600 dark:shadow-lg dark:shadow-slate-900/30 dark:hover:shadow-xl dark:hover:shadow-slate-900/40 dark:hover:bg-slate-800/70 dark:hover:border-slate-500 dark:ring-1 dark:ring-slate-700/20 dark:hover:ring-slate-600/30 transition-all duration-300 transform hover:scale-[1.02] group">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground mb-3 tracking-tight">{objective.title}</h3>
                                <p className="text-base text-foreground/80 mb-4 font-medium leading-relaxed">{objective.description}</p>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                                  <div className="p-4 rounded-lg border-2 border-border shadow-sm group-hover:shadow-md transition-all duration-200 dark:bg-slate-800/40 dark:border-slate-600 dark:shadow-slate-900/30 dark:group-hover:shadow-slate-900/40 dark:group-hover:bg-slate-800/60 dark:group-hover:border-slate-500 dark:ring-1 dark:ring-slate-700/10 dark:group-hover:ring-slate-600/20">
                                    <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider group-hover:text-foreground dark:text-slate-300 dark:group-hover:text-slate-100">Target</div>
                                    <div className="text-lg font-bold text-foreground mt-2 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">{objective.target} {objective.unit}</div>
                                  </div>
                                  <div className="p-4 rounded-lg border-2 border-border shadow-sm group-hover:shadow-md transition-all duration-200 dark:bg-slate-800/40 dark:border-slate-600 dark:shadow-slate-900/30 dark:group-hover:shadow-slate-900/40 dark:group-hover:bg-slate-800/60 dark:group-hover:border-slate-500 dark:ring-1 dark:ring-slate-700/10 dark:group-hover:ring-slate-600/20">
                                    <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider group-hover:text-foreground dark:text-slate-300 dark:group-hover:text-slate-100">Weight</div>
                                    <div className="text-lg font-bold text-foreground mt-2 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">{objective.weight}%</div>
                                  </div>
                                  <div className="p-4 rounded-lg border-2 border-border shadow-sm group-hover:shadow-md transition-all duration-200 dark:bg-slate-800/40 dark:border-slate-600 dark:shadow-slate-900/30 dark:group-hover:shadow-slate-900/40 dark:group-hover:bg-slate-800/60 dark:group-hover:border-slate-500 dark:ring-1 dark:ring-slate-700/10 dark:group-hover:ring-slate-600/20">
                                    <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider group-hover:text-foreground dark:text-slate-300 dark:group-hover:text-slate-100">Achieved</div>
                                    <div className="text-lg font-bold text-foreground mt-2 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">{objective.achievement || 0}%</div>
                                  </div>
                                  <div className="p-4 rounded-lg border-2 border-border shadow-sm group-hover:shadow-md transition-all duration-200 dark:bg-slate-800/40 dark:border-slate-600 dark:shadow-slate-900/30 dark:group-hover:shadow-slate-900/40 dark:group-hover:bg-slate-800/60 dark:group-hover:border-slate-500 dark:ring-1 dark:ring-slate-700/10 dark:group-hover:ring-slate-600/20">
                                    <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider group-hover:text-foreground dark:text-slate-300 dark:group-hover:text-slate-100">Score</div>
                                    <div className="text-lg font-bold text-foreground mt-2 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">{calculateTaskScore(objective).toFixed(1)}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="sm:col-span-2 lg:col-span-1">
                                <Label htmlFor={`achievement-${objective.id}`} className="text-sm sm:text-base text-foreground/80 font-bold mb-2 block">
                                  Target Achieved
                                </Label>
                                <Input
                                  id={`achievement-${objective.id}`}
                                  type="number"
                                  value={objective.achievement || ''}
                                  onChange={(e) => updateObjective(objective.id, 'achievement', parseFloat(e.target.value))}
                                  disabled={!isEditing}
                                  className={`transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                                    objective.achievement !== undefined && objective.achievement !== null && 
                                    (objective.achievement < 0 || objective.achievement > 100)
                                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                      : objective.achievement !== undefined && objective.achievement !== null
                                      ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                      : ''
                                  }`}
                                  placeholder="Enter percentage achieved"
                                  aria-label={`Target achieved for ${objective.title}`}
                                  aria-describedby={`achievement-help-${objective.id}`}
                                  min="0"
                                  max="100"
                                />
                                <div id={`achievement-help-${objective.id}`} className="text-xs text-muted-foreground mt-1">
                                  Enter a value between 0 and 100
                                </div>
                              </div>
                              <div className="sm:col-span-1">
                                <Label htmlFor={`evidence-${objective.id}`} className="text-sm sm:text-base text-foreground/80 font-bold mb-2 block">
                                  Evidence
                                </Label>
                                
                                {/* File Upload Area */}
                                <div className="space-y-3">
                                  {/* File Input */}
                                  <div className="relative">
                                    <input
                                      id={`evidence-${objective.id}`}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.gif,.pdf"
                                      onChange={(e) => handleFileUpload(objective.id, e.target.files?.[0] || null)}
                                      disabled={!isEditing}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`evidence-${objective.id}`}
                                      className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                        uploadedFiles[objective.id] 
                                          ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                                          : 'border-border bg-muted dark:bg-slate-800/50 dark:border-slate-600 dark:text-slate-200 hover:bg-muted/80'
                                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      <div className="flex flex-col items-center space-y-2">
                                        {uploadedFiles[objective.id] ? (
                                          <>
                                            <FileImage className="w-8 h-8 text-green-600" />
                                            <span className="text-sm font-medium text-green-700">
                                              {uploadedFiles[objective.id]?.name}
                                            </span>
                                            <span className="text-xs text-green-600">
                                              Click to change file
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-8 h-8 text-muted-foreground" />
                                            <span className="text-sm font-medium text-foreground/80">
                                              Upload Evidence
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              JPG, PNG, GIF, or PDF (max 10MB)
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </label>
                                  </div>

                                  {/* File Preview and Actions */}
                                  {uploadedFiles[objective.id] && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                      <div className="flex items-center space-x-2">
                                        {uploadedFiles[objective.id]?.type.startsWith('image/') ? (
                                          <Image className="w-5 h-5 text-green-600" />
                                        ) : (
                                          <File className="w-5 h-5 text-green-600" />
                                        )}
                                        <span className="text-sm font-medium text-green-800">
                                          {uploadedFiles[objective.id]?.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          ({(uploadedFiles[objective.id]?.size || 0 / 1024 / 1024).toFixed(1)} MB)
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFile(objective.id)}
                                        disabled={!isEditing}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}

                                  {/* Fallback Text Input for Manual Entry */}
                                  <div className="mt-2">
                                    <Input
                                      value={objective.evidence || ''}
                                      onChange={(e) => updateObjective(objective.id, 'evidence', e.target.value)}
                                      disabled={!isEditing}
                                      className={`transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                                        objective.evidence !== undefined && objective.evidence.trim() === ''
                                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                          : objective.evidence !== undefined && objective.evidence.trim() !== ''
                                          ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                          : ''
                                      }`}
                                      placeholder="Or enter evidence description manually"
                                      aria-label={`Evidence description for ${objective.title}`}
                                      aria-describedby={`evidence-help-${objective.id}`}
                                    />
                                    <div id={`evidence-help-${objective.id}`} className="text-xs text-muted-foreground mt-1">
                                      Upload file above or provide supporting documentation description
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="sm:col-span-2 lg:col-span-1">
                                <Label htmlFor={`challenges-${objective.id}`} className="text-sm sm:text-base text-foreground/80 font-bold mb-2 block">
                                  Challenges Faced
                                </Label>
                                <Textarea
                                  id={`challenges-${objective.id}`}
                                  value={objective.challenges || ''}
                                  onChange={(e) => updateObjective(objective.id, 'challenges', e.target.value)}
                                  disabled={!isEditing}
                                  className={`transition-all duration-200 focus:scale-[1.02] focus:shadow-lg resize-none ${
                                    objective.challenges !== undefined && objective.challenges.trim() === ''
                                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                      : objective.challenges !== undefined && objective.challenges.trim() !== ''
                                      ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                      : ''
                                  }`}
                                  rows={2}
                                  placeholder="Describe any challenges encountered"
                                  aria-label={`Challenges faced for ${objective.title}`}
                                  aria-describedby={`challenges-help-${objective.id}`}
                                />
                                <div id={`challenges-help-${objective.id}`} className="text-xs text-muted-foreground mt-1">
                                  Describe any obstacles or difficulties encountered
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-base text-foreground/80 font-bold dark:text-slate-300">Calculated Score</div>
                                  <div className="text-2xl font-bold text-emerald-600 mt-1 animate-pulse dark:text-emerald-400">
                                    {calculateTaskScore(objective).toFixed(1)}%
                                  </div>
                                </div>
                                <div>
                                  <div className="text-base text-foreground/80 font-bold dark:text-slate-300">Weighted Score</div>
                                  <div className="text-2xl font-bold text-emerald-600 mt-1 animate-pulse dark:text-emerald-400">
                                    {((calculateTaskScore(objective) * objective.weight) / 100).toFixed(1)}%
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-sm font-bold px-3 py-1 shadow-sm group-hover:scale-105 dark:border-slate-600 dark:text-slate-200 dark:bg-slate-800/50">
                                  {objective.weight}% weight
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </HoverScale>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-base text-foreground/80 font-bold">Tasks Subtotal (70%)</div>
                          <div className="text-3xl font-bold text-emerald-800 mt-1">
                            {calculateTasksSubtotal().toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {currentStep === 2 && (
              <FadeIn>
                <Card className="bg-card border-border shadow-sm dark:bg-slate-800/70 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/40 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/40 dark:hover:ring-slate-600/60 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-muted to-muted/50 border-b border-border dark:from-slate-700/60 dark:to-slate-800/40 dark:border-slate-600 dark:shadow-sm">
                    <CardTitle className="text-foreground flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      Section 2: Competencies
                      <Badge className="ml-auto bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 shadow-sm">
                        20%
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">Rate your competencies across different categories.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <ValidationErrors step={2} />
                    {/* Generic Competencies Table */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-600" />
                        Generic Competencies
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b-2 border-border">
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200 dark:text-slate-300">Description</th>
                              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200 dark:text-slate-300">Min</th>
                              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200 dark:text-slate-300">Max</th>
                              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200 dark:text-slate-300">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appraisalData.competencies
                              .filter(comp => comp.category === 'Generic Competencies')
                              .map((competency) => (
                                <tr key={competency.id} className="border-b border-border/50 hover:bg-muted/50 dark:border-slate-600/50 dark:hover:bg-slate-800/40 dark:hover:border-slate-500/50 transition-colors">
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-muted-foreground text-xs sm:text-sm dark:text-slate-300">{competency.description}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{competency.minScore}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{competency.maxScore}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                    <div className="flex justify-center">
                                      <Input
                                        type="number"
                                        min={competency.minScore}
                                        max={competency.maxScore}
                                        value={competency.score || ''}
                                        onChange={(e) => updateCompetencyScore(competency.id, parseFloat(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-20 text-center transition-all duration-200 focus:scale-105 focus:shadow-lg dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 ${
                                          competency.score !== undefined && competency.score !== null && 
                                          (competency.score < competency.minScore || competency.score > competency.maxScore)
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                            : competency.score !== undefined && competency.score !== null
                                            ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                            : ''
                                        }`}
                                        placeholder="0"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm">
                        <div className="text-center">
                          <div className="text-base text-foreground/80 font-bold">Generic Competencies Total</div>
                          <div className="text-2xl font-bold text-blue-800 mt-1">
                            {getGenericCompetenciesTotal().toFixed(1)}/10
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Functional Competencies Table */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Functional Competencies
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b-2 border-border">
                              <th className="text-left py-3 px-4 font-semibold text-foreground/80">Description</th>
                              <th className="text-center py-3 px-4 font-semibold text-foreground/80">Min Score</th>
                              <th className="text-center py-3 px-4 font-semibold text-foreground/80">Max Score</th>
                              <th className="text-center py-3 px-4 font-semibold text-foreground/80">Your Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appraisalData.competencies
                              .filter(comp => comp.category === 'Functional Competencies')
                              .map((competency) => (
                                <tr key={competency.id} className="border-b border-border/50 hover:bg-muted/50 dark:border-slate-600/50 dark:hover:bg-slate-800/40 dark:hover:border-slate-500/50 transition-colors">
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-muted-foreground text-xs sm:text-sm dark:text-slate-300">{competency.description}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{competency.minScore}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{competency.maxScore}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                    <div className="flex justify-center">
                                      <Input
                                        type="number"
                                        min={competency.minScore}
                                        max={competency.maxScore}
                                        value={competency.score || ''}
                                        onChange={(e) => updateCompetencyScore(competency.id, parseFloat(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-20 text-center transition-all duration-200 focus:scale-105 focus:shadow-lg dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 ${
                                          competency.score !== undefined && competency.score !== null && 
                                          (competency.score < competency.minScore || competency.score > competency.maxScore)
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                            : competency.score !== undefined && competency.score !== null
                                            ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                            : ''
                                        }`}
                                        placeholder="0"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm">
                        <div className="text-center">
                          <div className="text-base text-foreground/80 font-bold">Functional Competencies Total</div>
                          <div className="text-2xl font-bold text-blue-800 mt-1">
                            {getFunctionalCompetenciesTotal().toFixed(1)}/5
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ethics and Values Table */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Ethics and Values
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b-2 border-border">
                              <th className="text-left py-3 px-4 font-semibold text-foreground/80">Description</th>
                              <th className="text-center py-3 px-4 font-semibold text-foreground/80">Min Score</th>
                              <th className="text-center py-3 px-4 font-semibold text-foreground/80">Max Score</th>
                              <th className="text-center py-3 px-4 font-semibold text-foreground/80">Your Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appraisalData.competencies
                              .filter(comp => comp.category === 'Ethics and Values')
                              .map((competency) => (
                                <tr key={competency.id} className="border-b border-border/50 hover:bg-muted/50 dark:border-slate-600/50 dark:hover:bg-slate-800/40 dark:hover:border-slate-500/50 transition-colors">
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-muted-foreground text-xs sm:text-sm dark:text-slate-300">{competency.description}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{competency.minScore}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{competency.maxScore}</td>
                                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                    <div className="flex justify-center">
                                      <Input
                                        type="number"
                                        min={competency.minScore}
                                        max={competency.maxScore}
                                        value={competency.score || ''}
                                        onChange={(e) => updateCompetencyScore(competency.id, parseFloat(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-20 text-center transition-all duration-200 focus:scale-105 focus:shadow-lg dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 ${
                                          competency.score !== undefined && competency.score !== null && 
                                          (competency.score < competency.minScore || competency.score > competency.maxScore)
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                            : competency.score !== undefined && competency.score !== null
                                            ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                            : ''
                                        }`}
                                        placeholder="0"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm">
                        <div className="text-center">
                          <div className="text-base text-foreground/80 font-bold">Ethics and Values Total</div>
                          <div className="text-2xl font-bold text-blue-800 mt-1">
                            {getEthicsCompetenciesTotal().toFixed(1)}/5
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overall Competencies Subtotal */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-base text-foreground/80 font-bold">Overall Competencies Subtotal (20%)</div>
                          <div className="text-3xl font-bold text-blue-800 mt-1">
                            {getCompetenciesSubtotal().toFixed(1)}/20
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {currentStep === 3 && (
              <FadeIn>
                <Card className="bg-card border-border shadow-sm dark:bg-slate-800/70 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/40 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/40 dark:hover:ring-slate-600/60 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-muted to-muted/50 border-b border-border dark:from-slate-700/60 dark:to-slate-800/40 dark:border-slate-600 dark:shadow-sm">
                    <CardTitle className="text-foreground flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      Section 3: Operations & Processes
                      <Badge className="ml-auto bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 shadow-sm">
                        10%
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">Rate your performance on operational processes.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ValidationErrors step={3} />
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b-2 border-border">
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">Area</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">Target</th>
                            <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">Min</th>
                            <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">Max</th>
                            <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appraisalData.operations.map((operation) => (
                            <tr key={operation.id} className="border-b border-border/50 hover:bg-muted/50 dark:border-slate-600/50 dark:hover:bg-slate-800/40 dark:hover:border-slate-500/50 transition-colors">
                              <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm">{operation.area}</td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 text-muted-foreground text-xs sm:text-sm dark:text-slate-300">{operation.target}</td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{operation.minScore}</td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold text-foreground/80 text-xs sm:text-sm dark:text-slate-200">{operation.maxScore}</td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                <div className="flex justify-center">
                                  <Input
                                    type="number"
                                    min={operation.minScore}
                                    max={operation.maxScore}
                                    value={operation.score || ''}
                                    onChange={(e) => updateOperationsScore(operation.id, parseFloat(e.target.value))}
                                    disabled={!isEditing}
                                    className={`w-20 text-center transition-all duration-200 focus:scale-105 focus:shadow-lg dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 ${
                                      operation.score !== undefined && operation.score !== null && 
                                      (operation.score < operation.minScore || operation.score > operation.maxScore)
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200'
                                        : operation.score !== undefined && operation.score !== null
                                        ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200'
                                        : ''
                                    }`}
                                    placeholder="0"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Operations Subtotal */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-base text-foreground/80 font-bold">Operations Subtotal (10%)</div>
                          <div className="text-3xl font-bold text-purple-800 mt-1">
                            {getOperationsSubtotal().toFixed(1)}/300
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {currentStep === 4 && (
              <FadeIn>
                <Card className="bg-card border-border shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-orange-200">
                    <CardTitle className="text-foreground flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                        <PieChart className="w-6 h-6 text-white" />
                      </div>
                      Section 4: Overall Assessment
                      <Badge className="ml-auto bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1 shadow-sm">
                        Summary
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">Comprehensive performance analysis and scoring breakdown</p>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    {/* Debug Information - Remove in production */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                      <div className="font-semibold text-yellow-800 mb-2">Debug Scores:</div>
                      <div>Tasks: {calculateTasksSubtotal().toFixed(1)}%</div>
                      <div>Competencies: {getCompetenciesSubtotal().toFixed(1)}/20</div>
                      <div>Operations: {getOperationsSubtotal().toFixed(1)}/300</div>
                      <div>Total: {((calculateTasksSubtotal() * 0.7) + (getCompetenciesSubtotal() * 0.2) + (getOperationsSubtotal() * 0.1)).toFixed(1)}%</div>
                    </div>
                    
                    {/* Performance Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Tasks Score Card */}
                      <HoverScale>
                        <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                          <div className="absolute top-4 right-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <Target className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-100 mb-1">Employee's Tasks</h3>
                              <div className="text-3xl font-bold">{calculateTasksSubtotal().toFixed(1)}%</div>
                              <div className="text-emerald-100 text-sm">Performance Score</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-emerald-100">Weight: 70%</div>
                              <div className="text-sm font-semibold">High Impact</div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min(calculateTasksSubtotal(), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </HoverScale>

                      {/* Competencies Score Card */}
                      <HoverScale>
                        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                          <div className="absolute top-4 right-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <Award className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-100 mb-1">Competencies</h3>
                              <div className="text-3xl font-bold">{getCompetenciesSubtotal().toFixed(1)}/20</div>
                              <div className="text-blue-100 text-sm">Skill Assessment</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-blue-100">Weight: 20%</div>
                              <div className="text-sm font-semibold">Core Skills</div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                                style={{ width: `${(getCompetenciesSubtotal() / 20) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </HoverScale>

                      {/* Operations Score Card */}
                      <HoverScale>
                        <div className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                          <div className="absolute top-4 right-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <BarChart3 className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-100 mb-1">Operations</h3>
                              <div className="text-3xl font-bold">{getOperationsSubtotal().toFixed(1)}/300</div>
                              <div className="text-purple-100 text-sm">Process Excellence</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-purple-100">Weight: 10%</div>
                              <div className="text-sm font-semibold">Efficiency</div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min((getOperationsSubtotal() / 300) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </HoverScale>
                    </div>

                    {/* Performance Analytics */}
                    <div className="bg-gradient-to-r from-muted to-muted/50 rounded-2xl p-6 border border-border dark:from-slate-800/70 dark:to-slate-900/50 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/50 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/30">
                      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-muted-foreground" />
                        Performance Analytics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-emerald-600">{calculateTasksSubtotal().toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Task Performance</div>
                          <div className="text-xs text-muted-foreground mt-1">70% weight</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{getCompetenciesSubtotal().toFixed(1)}/20</div>
                          <div className="text-sm text-muted-foreground">Competency Score</div>
                          <div className="text-xs text-muted-foreground mt-1">20% weight</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-purple-600">{getOperationsSubtotal().toFixed(1)}/300</div>
                          <div className="text-sm text-muted-foreground">Operations Score</div>
                          <div className="text-xs text-muted-foreground mt-1">10% weight</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-muted-foreground">
                            {appraisalData.objectives.length + appraisalData.competencies.length + appraisalData.operations.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Items</div>
                          <div className="text-xs text-muted-foreground mt-1">Assessed</div>
                        </div>
                      </div>
                    </div>

                    {/* Grand Total - Enhanced */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-2xl blur-sm opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-8 text-white shadow-2xl dark:shadow-slate-900/60 dark:border dark:border-slate-600/40 dark:ring-2 dark:ring-slate-700/30">
                        <div className="text-center space-y-4">
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <PieChart className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Overall Performance Score</h2>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-6xl font-bold bg-gradient-to-r from-white to-slate-200 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                              {((calculateTasksSubtotal() * 0.7) + (getCompetenciesSubtotal() * 0.2) + (getOperationsSubtotal() * 0.1)).toFixed(1)}%
                            </div>
                            <div className="text-slate-300 dark:text-slate-400 dark:text-slate-500 text-lg">Weighted Composite Score</div>
                          </div>

                          {/* Performance Rating */}
                          <div className="mt-6">
                            {(() => {
                              const totalScore = (calculateTasksSubtotal() * 0.7) + (getCompetenciesSubtotal() * 0.2) + (getOperationsSubtotal() * 0.1);
                              let rating = '';
                              let color = '';
                              let description = '';
                              
                              if (totalScore >= 90) {
                                rating = 'Outstanding';
                                color = 'text-green-400';
                                description = 'Exceptional performance across all areas';
                              } else if (totalScore >= 80) {
                                rating = 'Excellent';
                                color = 'text-blue-400';
                                description = 'Strong performance with room for growth';
                              } else if (totalScore >= 70) {
                                rating = 'Good';
                                color = 'text-yellow-400';
                                description = 'Solid performance meeting expectations';
                              } else if (totalScore >= 60) {
                                rating = 'Satisfactory';
                                color = 'text-orange-400';
                                description = 'Meets basic requirements';
                              } else {
                                rating = 'Needs Improvement';
                                color = 'text-red-400';
                                description = 'Areas for development identified';
                              }
                              
                              return (
                                <div className="space-y-2">
                                  <div className={`text-2xl font-bold ${color}`}>{rating}</div>
                                  <div className="text-slate-400 dark:text-slate-500 text-sm">{description}</div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Progress Ring */}
                          <div className="mt-8 flex justify-center">
                            <div className="relative w-32 h-32">
                              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  stroke="rgba(255,255,255,0.1)"
                                  strokeWidth="8"
                                  fill="none"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  stroke="url(#gradient)"
                                  strokeWidth="8"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 40}`}
                                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - ((calculateTasksSubtotal() * 0.7) + (getCompetenciesSubtotal() * 0.2) + (getOperationsSubtotal() * 0.1)) / 100)}`}
                                  className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-lg font-bold">
                                    {((calculateTasksSubtotal() * 0.7) + (getCompetenciesSubtotal() * 0.2) + (getOperationsSubtotal() * 0.1)).toFixed(0)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {currentStep === 5 && (
              <FadeIn>
                <Card className="bg-card border-border shadow-sm dark:bg-slate-800/70 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/40 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/40 dark:hover:ring-slate-600/60 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-muted to-muted/50 border-b border-border dark:from-slate-700/60 dark:to-slate-800/40 dark:border-slate-600 dark:shadow-sm">
                    <CardTitle className="text-foreground flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      Section 5: Confirmation & Acknowledgements
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">Review and confirm your appraisal submission.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ValidationErrors step={5} />
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base text-foreground/80 font-bold mb-2 block">
                            Overall Comments
                          </Label>
                          <Textarea
                            value={appraisalData.overallComments}
                            onChange={(e) => setAppraisalData(prev => ({ ...prev, overallComments: e.target.value }))}
                            disabled={!isEditing}
                            className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg resize-none dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 dark:placeholder-slate-400"
                            rows={4}
                            placeholder="Provide your overall comments about your performance this quarter"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-base text-foreground/80 font-bold mb-2 block">
                            Strengths
                          </Label>
                          <Textarea
                            value={appraisalData.strengths}
                            onChange={(e) => setAppraisalData(prev => ({ ...prev, strengths: e.target.value }))}
                            disabled={!isEditing}
                            className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg resize-none dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 dark:placeholder-slate-400"
                            rows={3}
                            placeholder="Describe your key strengths and achievements"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-base text-foreground/80 font-bold mb-2 block">
                            Areas for Improvement
                          </Label>
                          <Textarea
                            value={appraisalData.areasForImprovement}
                            onChange={(e) => setAppraisalData(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                            disabled={!isEditing}
                            className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg resize-none dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 dark:placeholder-slate-400"
                            rows={3}
                            placeholder="Identify areas where you can improve"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-base text-foreground/80 font-bold mb-2 block">
                            Next Period Goals
                          </Label>
                          <Textarea
                            value={appraisalData.nextPeriodGoals}
                            onChange={(e) => setAppraisalData(prev => ({ ...prev, nextPeriodGoals: e.target.value }))}
                            disabled={!isEditing}
                            className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg resize-none dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:focus:bg-slate-800/80 dark:focus:border-slate-500 dark:focus:ring-2 dark:focus:ring-slate-500/20 dark:placeholder-slate-400"
                            rows={3}
                            placeholder="Set goals for the next period"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Acknowledgements</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="honest"
                            checked={acknowledgements.honest}
                            onChange={(e) => handleAcknowledgementChange('honest', e.target.checked)}
                            disabled={!isEditing}
                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-emerald-600 dark:checked:border-emerald-600"
                          />
                          <label htmlFor="honest" className="text-sm text-foreground/80">
                            I confirm that the information provided in this appraisal is accurate and truthful to the best of my knowledge.
                          </label>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="supervisorReview"
                            checked={acknowledgements.supervisorReview}
                            onChange={(e) => handleAcknowledgementChange('supervisorReview', e.target.checked)}
                            disabled={!isEditing}
                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-emerald-600 dark:checked:border-emerald-600"
                          />
                          <label htmlFor="supervisorReview" className="text-sm text-foreground/80">
                            I understand that my supervisor will review this appraisal and may provide additional feedback.
                          </label>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="followUp"
                            checked={acknowledgements.followUp}
                            onChange={(e) => handleAcknowledgementChange('followUp', e.target.checked)}
                            disabled={!isEditing}
                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-emerald-600 dark:checked:border-emerald-600"
                          />
                          <label htmlFor="followUp" className="text-sm text-foreground/80">
                            I agree to participate in follow-up discussions and development planning based on this appraisal.
                          </label>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="performanceManagement"
                            checked={acknowledgements.performanceManagement}
                            onChange={(e) => handleAcknowledgementChange('performanceManagement', e.target.checked)}
                            disabled={!isEditing}
                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-emerald-600 dark:checked:border-emerald-600"
                          />
                          <label htmlFor="performanceManagement" className="text-sm text-foreground/80">
                            I understand that this appraisal is part of the organization's performance management process.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-sm">
                      <div className="text-center">
                        <Button
                          onClick={handleSubmitConfirmation}
                          disabled={!allAcknowledgementsSelected || !isEditing}
                          className="px-8 py-4 text-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Submit Appraisal
                        </Button>
                        {!allAcknowledgementsSelected && (
                          <p className="text-sm text-red-600 mt-2">Please complete all acknowledgements before submitting</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {/* Navigation Buttons */}
            <Card className="bg-gradient-to-r from-muted to-muted/50 border-border dark:from-slate-800/70 dark:to-slate-900/50 dark:border-slate-600 dark:shadow-2xl dark:shadow-slate-900/40 dark:backdrop-blur-sm dark:ring-1 dark:ring-slate-700/30">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={prevStepWithValidation}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium border-border hover:bg-muted hover:border-border/80 text-foreground/80 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:border-slate-600 dark:hover:bg-slate-700/60 dark:hover:border-slate-500 dark:text-slate-200 dark:hover:shadow-slate-900/40 dark:focus:ring-2 dark:focus:ring-slate-500/20"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium order-first sm:order-none">
                    Step {currentStep} of {steps.length}
                  </div>
                  
                  <Button 
                    onClick={nextStepWithValidation}
                    disabled={currentStep === steps.length}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Historical Quarterly Appraisals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="year-select">Year</Label>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="quarter-select">Quarter</Label>
                    <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableQuarters.map(quarter => (
                          <SelectItem key={quarter} value={quarter}>
                            {quarter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading ? (
                  <StaggeredChildren>
                    {[...Array(6)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </StaggeredChildren>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAppraisals.map((appraisal) => (
                      <HoverScale key={appraisal.id}>
                        <Card 
                          className="cursor-pointer border-2 hover:border-border hover:shadow-xl hover:scale-105 transition-all duration-300 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:shadow-slate-900/40 dark:bg-slate-800/50 dark:hover:bg-slate-800/70 dark:ring-1 dark:ring-slate-700/20 dark:hover:ring-slate-600/30"
                          onClick={() => handleViewAppraisal(appraisal)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <Badge className={getStatusColor(appraisal.status)}>
                                {appraisal.status}
                              </Badge>
                              <div className="text-2xl font-bold text-emerald-600">
                                {appraisal.overallScore}%
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{appraisal.period}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Submitted: {new Date(appraisal.submittedAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Overall Score</span>
                              <span className="text-lg font-bold text-emerald-600">{appraisal.overallScore}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverScale>
                    ))}
                  </div>
                )}

                {filteredAppraisals.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-700/30">
                      <History className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground/80 mb-3">No Historical Appraisals Found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      No appraisals are available for the selected year and quarter. 
                      This could mean no appraisals have been completed yet or they're from a different period.
                    </p>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Try adjusting your filters:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedYear(2023)}
                          className="text-xs"
                        >
                          Check 2023
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedYear(2022)}
                          className="text-xs"
                        >
                          Check 2022
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuarter('Q2')}
                          className="text-xs"
                        >
                          Check Q2
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuarter('Q3')}
                          className="text-xs"
                        >
                          Check Q3
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 sm:px-4 py-2 text-sm font-medium border-border hover:bg-muted hover:border-border/80 text-foreground/80 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:border-slate-600 dark:hover:bg-slate-700/60 dark:hover:border-slate-500 dark:text-slate-200 dark:hover:shadow-slate-900/40 dark:focus:ring-2 dark:focus:ring-slate-500/20"
                    >
                      <ChevronLeft className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    
                    <span className="text-sm text-muted-foreground px-4">
                      Page {page} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 sm:px-4 py-2 text-sm font-medium border-border hover:bg-muted hover:border-border/80 text-foreground/80 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:border-slate-600 dark:hover:bg-slate-700/60 dark:hover:border-slate-500 dark:text-slate-200 dark:hover:shadow-slate-900/40 dark:focus:ring-2 dark:focus:ring-slate-500/20"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4 sm:ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Confirmation Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Confirm Appraisal Submission
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to submit your appraisal? Once submitted, you won't be able to make changes.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Important:</strong> Please ensure all information is accurate and complete before submitting.
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Appraisal'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Historical Appraisal Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Appraisal Details - {selectedAppraisal?.period}
              </DialogTitle>
            </DialogHeader>
            {selectedAppraisal && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg dark:bg-slate-800/50 dark:ring-1 dark:ring-slate-700/30">
                    <div className="text-sm text-muted-foreground">Period</div>
                    <div className="font-semibold">{selectedAppraisal.period}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg dark:bg-slate-800/50 dark:ring-1 dark:ring-slate-700/30">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-semibold">{selectedAppraisal.status}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg dark:bg-slate-800/50 dark:ring-1 dark:ring-slate-700/30">
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                    <div className="text-2xl font-bold text-green-600">{selectedAppraisal.overallScore}%</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-muted-foreground">Detailed appraisal content would be displayed here...</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Appraisal;
