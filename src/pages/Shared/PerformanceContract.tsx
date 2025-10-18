import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StandardModal from '@/components/ui/standard-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/utils/toast';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';
import { 
  FileText, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  X,
  Eye,
  Download,
  History,
  XCircle,
  TrendingUp,
  BarChart3,
  Award,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  Send,
  Plus,
  Trash2
} from 'lucide-react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';

// Type definitions
interface WorkPlanTask {
  id: string;
  title: string;
  target: string;
  unitOfMeasurement: string;
  weight: number;
  startDate: string;
  endDate: string;
}

interface KPI {
  id: number;
  keyResultArea: string;
  objective: string;
  target: string;
  unitOfMeasurement: string;
  weight: number;
  startDate: string;
  endDate: string;
  hasWorkPlan: boolean;
  workPlanTasks: WorkPlanTask[];
}

interface Competency {
  id: number;
  category: string;
  description: string;
}

interface Process {
  id: number;
  area: string;
  target: string;
}

interface Acknowledgements {
  termsAccepted: boolean;
  timelineAccepted: boolean;
  reviewProcessAccepted: boolean;
  supervisorReview: boolean;
  followUp: boolean;
}

interface ContractData {
  kpis: KPI[];
  competencies: Competency[];
  processes: Process[];
  acknowledgements: Acknowledgements;
}

interface Employee {
  surname: string;
  firstname: string;
  othername: string;
  ippisNo: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  gradeLevel: string;
  supervisor: {
    name: string;
    email: string;
    position: string;
  };
}

interface Contract {
  id: string;
  year: string;
  status: string;
  startDate: string;
  endDate: string;
  employee: Employee;
  kpiData?: KPI[];
  competencyData?: Competency[];
  operationData?: Process[];
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

const PerformanceContract: React.FC = () => {
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

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedYear, setSelectedYear] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Progressive form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contractStatus, setContractStatus] = useState<'Draft' | 'Pending Approval' | 'Approved' | 'Rejected'>('Draft');
  const [contractData, setContractData] = useState<ContractData>({
    kpis: [
      {
        id: 1,
        keyResultArea: 'Project Delivery',
        objective: 'Complete assigned projects within timeline and budget',
        target: '100% completion rate',
        unitOfMeasurement: 'Percentage',
        weight: 40,
        startDate: '',
        endDate: '',
        hasWorkPlan: false,
        workPlanTasks: []
      },
      {
        id: 2,
        keyResultArea: 'Quality Assurance',
        objective: 'Maintain high quality standards in all deliverables',
        target: '95% quality score',
        unitOfMeasurement: 'Percentage',
        weight: 30,
        startDate: '',
        endDate: '',
        hasWorkPlan: false,
        workPlanTasks: []
      },
      {
        id: 3,
        keyResultArea: 'Team Collaboration',
        objective: 'Work effectively with team members and stakeholders',
        target: '90% satisfaction rate',
        unitOfMeasurement: 'Percentage',
        weight: 30,
        startDate: '',
        endDate: '',
        hasWorkPlan: false,
        workPlanTasks: []
      }
    ],
    competencies: [
      {
        id: 1,
        category: 'Generic Competencies',
        description: 'Communication Skills - Ability to communicate effectively with team members and stakeholders'
      },
      {
        id: 2,
        category: 'Generic Competencies',
        description: 'Problem Solving - Analytical thinking and creative problem-solving abilities'
      },
      {
        id: 3,
        category: 'Functional Competencies',
        description: 'Technical Skills - Proficiency in relevant technical tools and methodologies'
      },
      {
        id: 4,
        category: 'Ethics and Values',
        description: 'Integrity and Professionalism - Maintaining high ethical standards and professional conduct'
      }
    ],
    processes: [
      {
        id: 1,
        area: 'Punctuality/Attendance',
        target: 'Maintain 95% attendance rate and punctuality'
      },
      {
        id: 2,
        area: 'Work Turn Around Time',
        target: 'Complete tasks within agreed timelines'
      },
      {
        id: 3,
        area: 'Innovation on the Job',
        target: 'Implement process improvements and innovative solutions'
      }
    ],
    acknowledgements: {
      termsAccepted: false,
      timelineAccepted: false,
      reviewProcessAccepted: false,
      supervisorReview: false,
      followUp: false
    }
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);
  const [historicalContracts, setHistoricalContracts] = useState<Contract[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showHistoricalDialog, setShowHistoricalDialog] = useState(false);

  // Step definitions
  const steps = [
    { id: 1, title: 'KPIs & Tasks', description: 'Set timelines for your key performance indicators', percentage: 0 },
    { id: 2, title: 'Competencies', description: 'Review required competencies and skills', percentage: 0 },
    { id: 3, title: 'Processes & Operations', description: 'Define operational processes and procedures', percentage: 0 },
    { id: 4, title: 'Review & Submit', description: 'Review and submit your performance contract', percentage: 0 }
  ];

  // Mock data for current contract
  const [currentContract] = useState<Contract>({
    id: 'PC-2024-001',
    year: '2024',
    status: 'Draft',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    employee: {
      surname: 'Fasasi',
      firstname: 'Sulaimon',
      othername: 'Adebayo',
      ippisNo: 'TET001',
      email: 'sulaimon.fasasi@tetfund.gov.ng',
      phone: '+234-801-234-5678',
      department: 'Information Technology',
      position: 'Software Developer',
      gradeLevel: 'GL 08',
      supervisor: {
        name: 'Dr. John Smith',
        email: 'john.smith@tetfund.gov.ng',
        position: 'Head of IT Department'
      }
    },
    kpiData: contractData.kpis,
    competencyData: contractData.competencies,
    operationData: contractData.processes,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  });

  // Mock historical contracts data
  const mockHistoricalContracts: Contract[] = [
    {
      id: 'PC-2023-001',
      year: '2023',
      status: 'Approved',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      employee: {
        surname: 'Fasasi',
        firstname: 'Sulaimon',
        othername: 'Adebayo',
        ippisNo: 'TET001',
        email: 'sulaimon.fasasi@tetfund.gov.ng',
        phone: '+234-801-234-5678',
        department: 'Information Technology',
        position: 'Software Developer',
        gradeLevel: 'GL 08',
        supervisor: {
          name: 'Dr. John Smith',
          email: 'john.smith@tetfund.gov.ng',
          position: 'Head of IT Department'
        }
      },
      kpiData: [
        {
          id: 1,
          keyResultArea: 'Project Delivery',
          objective: 'Complete assigned projects within timeline and budget',
          target: '100% completion rate',
          unitOfMeasurement: 'Percentage',
          weight: 40,
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          hasWorkPlan: false,
          workPlanTasks: []
        }
      ],
      competencyData: contractData.competencies,
      operationData: contractData.processes,
      createdAt: '2023-01-15',
      approvedAt: '2023-01-20',
      approvedBy: 'Dr. John Smith'
    },
    {
      id: 'PC-2022-001',
      year: '2022',
      status: 'Approved',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
      employee: {
        surname: 'Fasasi',
        firstname: 'Sulaimon',
        othername: 'Adebayo',
        ippisNo: 'TET001',
        email: 'sulaimon.fasasi@tetfund.gov.ng',
        phone: '+234-801-234-5678',
        department: 'Information Technology',
        position: 'Software Developer',
        gradeLevel: 'GL 08',
        supervisor: {
          name: 'Dr. John Smith',
          email: 'john.smith@tetfund.gov.ng',
          position: 'Head of IT Department'
        }
      },
      kpiData: contractData.kpis.map(kpi => ({
        ...kpi,
        hasWorkPlan: false,
        workPlanTasks: []
      })),
      competencyData: contractData.competencies,
      operationData: contractData.processes,
      createdAt: '2022-01-15',
      approvedAt: '2022-01-20',
      approvedBy: 'Dr. John Smith'
    }
  ];

  // Years for historical contracts filter
  const historyYears = ['2024', '2023', '2022', '2021', '2020'];

  // Initialize historical contracts
  useEffect(() => {
    setHistoricalContracts(mockHistoricalContracts);
    setTotalPages(Math.ceil(mockHistoricalContracts.length / pageSize));
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('performance-contract-draft');
    if (savedDraft && !isSubmitted) {
      try {
        const parsedData = JSON.parse(savedDraft);
        setContractData(parsedData);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Auto-save functionality - optimized to prevent excessive re-renders
  useEffect(() => {
    if (!isEditing || isSubmitted) return;

    const interval = setInterval(() => {
      localStorage.setItem('performance-contract-draft', JSON.stringify(contractData));
      setLastSaved(new Date());
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [contractData, isEditing, isSubmitted]);

  // Helper functions for work plan management
  const toggleWorkPlan = (kpiId: number) => {
    setContractData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === kpiId 
          ? { 
              ...kpi, 
              hasWorkPlan: !kpi.hasWorkPlan,
              workPlanTasks: !kpi.hasWorkPlan ? [] : kpi.workPlanTasks
            }
          : kpi
      )
    }));
  };

  const addWorkPlanTask = (kpiId: number) => {
    const newTask: WorkPlanTask = {
      id: `task-${Date.now()}`,
      title: '',
      target: '',
      unitOfMeasurement: '',
      weight: 0,
      startDate: '',
      endDate: ''
    };

    setContractData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === kpiId 
          ? { ...kpi, workPlanTasks: [...kpi.workPlanTasks, newTask] }
          : kpi
      )
    }));
  };

  const removeWorkPlanTask = (kpiId: number, taskId: string) => {
    setContractData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === kpiId 
          ? { ...kpi, workPlanTasks: kpi.workPlanTasks.filter(task => task.id !== taskId) }
          : kpi
      )
    }));
  };

  const updateWorkPlanTask = (kpiId: number, taskId: string, field: keyof WorkPlanTask, value: string | number) => {
    setContractData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === kpiId 
          ? { 
              ...kpi, 
              workPlanTasks: kpi.workPlanTasks.map(task => 
                task.id === taskId 
                  ? { ...task, [field]: value }
                  : task
              )
            }
          : kpi
      )
    }));
  };

  const validateWorkPlanWeights = (kpi: KPI): boolean => {
    if (!kpi.hasWorkPlan || kpi.workPlanTasks.length === 0) return true;
    const totalWeight = kpi.workPlanTasks.reduce((sum, task) => sum + task.weight, 0);
    return totalWeight === kpi.weight;
  };

  const getWorkPlanWeightError = (kpi: KPI): string | null => {
    if (!kpi.hasWorkPlan || kpi.workPlanTasks.length === 0) return null;
    const totalWeight = kpi.workPlanTasks.reduce((sum, task) => sum + task.weight, 0);
    if (totalWeight !== kpi.weight) {
      return `Task weights (${totalWeight}%) must equal KPI weight (${kpi.weight}%)`;
    }
    return null;
  };

  // Date validation
  const validateKPIDates = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  };

  // Step validation - memoized for performance
  const validateStep = useCallback((step: number) => {
    switch (step) {
      case 1: // KPIs & Tasks
        return contractData.kpis.every(kpi => 
          kpi.startDate && kpi.endDate && validateKPIDates(kpi.startDate, kpi.endDate)
        );
      case 2: // Competencies
        return true; // No validation needed for competencies
      case 3: // Processes & Operations
        return true; // No validation needed for processes
      case 4: // Review & Submit
        return Object.values(contractData.acknowledgements).every(Boolean);
      default:
        return false;
    }
  }, [contractData]);

  // Step completion status - memoized
  const isStepCompleted = useCallback((stepId: number): boolean => {
    return validateStep(stepId);
  }, [validateStep]);

  // Step status calculation - memoized
  const getStepStatus = useCallback((stepId: number): 'completed' | 'current' | 'pending' | 'error' => {
    if (isStepCompleted(stepId)) {
      return 'completed';
    } else if (stepId === currentStep) {
      return 'current';
    } else if (stepId < currentStep) {
      return 'error'; // Previous step not completed
    } else {
      return 'pending';
    }
  }, [currentStep, isStepCompleted]);

  // Step navigation functions
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

  // Handle KPI date changes
  const handleKPIDateChange = useCallback((kpiId: number, field: 'startDate' | 'endDate', value: string) => {
    const updatedKPIs = contractData.kpis.map(kpi => {
      if (kpi.id === kpiId) {
        const updatedKpi = { ...kpi, [field]: value };
        
        // Validate dates
        if (updatedKpi.startDate && updatedKpi.endDate) {
          if (!validateKPIDates(updatedKpi.startDate, updatedKpi.endDate)) {
            setValidationErrors(prev => ({
              ...prev,
              [`kpi-${kpiId}-dates`]: 'End date must be after start date'
            }));
          } else {
            setValidationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[`kpi-${kpiId}-dates`];
              return newErrors;
            });
          }
        }
        
        return updatedKpi;
      }
      return kpi;
    });

    setContractData(prev => ({ ...prev, kpis: updatedKPIs }));
  }, [contractData.kpis]);

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending Approval':
        return <Clock className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Draft':
        return <Edit className="w-4 h-4" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Check if contract can be edited
  const canEditContract = () => {
    return contractStatus === 'Draft' || contractStatus === 'Rejected';
  };

  // Check if contract can be downloaded/printed
  const canDownloadContract = () => {
    return contractStatus === 'Approved' || contractStatus === 'Pending Approval';
  };

  // Function to move approved contract to historical
  const moveToHistorical = (contract: Contract) => {
    const historicalContract = {
      ...contract,
      kpiData: contractData.kpis,
      competencyData: contractData.competencies,
      operationData: contractData.processes,
      approvedAt: new Date().toISOString(),
      approvedBy: 'System'
    };
    setHistoricalContracts(prev => [historicalContract, ...prev]);
  };

  // Print/Download functionality
  const printContract = (contract: Contract) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Performance Contract - ${contract.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 25px; }
              .kpi-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; }
              .competency-item { margin-bottom: 10px; }
              .operation-item { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Performance Contract</h1>
              <p>Contract ID: ${contract.id}</p>
              <p>Year: ${contract.year}</p>
              <p>Status: ${contract.status}</p>
            </div>
            
            <div class="section">
              <h3>Employee Information</h3>
              <p><strong>Name:</strong> ${contract.employee.firstname} ${contract.employee.othername} ${contract.employee.surname}</p>
              <p><strong>IPPIS No:</strong> ${contract.employee.ippisNo}</p>
              <p><strong>Email:</strong> ${contract.employee.email}</p>
              <p><strong>Department:</strong> ${contract.employee.department}</p>
              <p><strong>Position:</strong> ${contract.employee.position}</p>
              <p><strong>Grade Level:</strong> ${contract.employee.gradeLevel}</p>
            </div>

            <div class="section">
              <h3>Key Performance Indicators</h3>
              ${contract.kpiData ? contract.kpiData.map((kpi: any) => `
                <div class="kpi-item">
                  <h4>${kpi.keyResultArea}</h4>
                  <p><strong>Objective:</strong> ${kpi.objective}</p>
                  <p><strong>Target:</strong> ${kpi.target}</p>
                  <p><strong>Weight:</strong> ${kpi.weight}%</p>
                  <p><strong>Start Date:</strong> ${kpi.startDate}</p>
                  <p><strong>End Date:</strong> ${kpi.endDate}</p>
                </div>
              `).join('') : 'No KPIs defined'}
            </div>

            <div class="section">
              <h3>Competencies</h3>
              ${contract.competencyData ? contract.competencyData.map((comp: any) => `
                <div class="competency-item">
                  <h4>${comp.category}</h4>
                  <p>${comp.description}</p>
                </div>
              `).join('') : 'No competencies defined'}
            </div>

            <div class="section">
              <h3>Operations</h3>
              ${contract.operationData ? contract.operationData.map((op: any) => `
                <div class="operation-item">
                  <h4>${op.area}</h4>
                  <p>${op.target}</p>
                </div>
              `).join('') : 'No operations defined'}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle contract submission
  const handleAcceptContract = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setContractStatus('Pending Approval');
      
      // Move to historical contracts
      moveToHistorical(currentContract);
      
      toast.success("Contract Submitted Successfully! 🎉");
    } catch (error) {
      toast.error("Failed to submit contract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter historical contracts
  const filteredHistoricalContracts = historicalContracts.filter(contract => 
    selectedYear === 'All' || contract.year === selectedYear
  );

  // Pagination
  const paginatedContracts = filteredHistoricalContracts.slice(
    (page - 1) * pageSize,
    page * pageSize
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
          title={`Performance Contract${isOfficer ? '' : isSuperviseeMode ? ' - Supervisee Review' : ` - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} View`}`}
          subtitle={
            isOfficer 
              ? "Define your performance objectives, create work plans, and set measurable targets for the performance period"
              : isSuperviseeMode
              ? "Review and manage performance contracts for your supervisees. Approve, provide feedback, or request modifications on submitted contracts."
              : `Review and manage performance contracts for your team members. ${isSupervisor ? 'Approve or provide feedback on submitted contracts.' : 'Monitor and track team performance objectives.'}`
          }
        />
        
        {/* Auto-save indicator */}
        {isEditing && lastSaved && (
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        </div>
          </div>
        )}

        {/* Contract Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-2 rounded-2xl shadow-lg border-2 border-border dark:border-slate-600 dark:bg-slate-800/60">
            <TabsTrigger value="current" className="gap-3 rounded-xl py-4 px-6 font-bold text-base">
              <FileText className="w-4 h-4" />
              <span>Current Contract</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-3 rounded-xl py-4 px-6 font-bold text-base">
              <History className="w-4 h-4" />
              <span>Historical Contracts</span>
            </TabsTrigger>
          </TabsList>

          {/* Current Contract Tab */}
          <TabsContent value="current" className="space-y-8">
            {!isSubmitted && (
              <>
                {/* Progress Indicator */}
                <Card className="card-base">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                          Contract Progress
                        </h2>
                        <p className="text-lead text-muted-foreground">
                          Complete each section to finish your performance contract
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
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-4 overflow-x-auto pb-2" role="progressbar" aria-label="Contract progress steps">
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
                    <Card>
                <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-emerald-600" />
                          </div>
                          Section 1: KPIs & Tasks
                  </CardTitle>
                        <p className="text-muted-foreground">Set start and end dates for your key performance indicators</p>
                </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {contractData.kpis.map((kpi) => (
                            <div key={kpi.id} className="bg-muted rounded-lg border-2 border-border p-6 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border-slate-700/60 dark:shadow-xl dark:shadow-slate-950/20 dark:backdrop-blur-sm hover:dark:shadow-slate-950/30 transition-all duration-300">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">{kpi.keyResultArea}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 dark:text-slate-300 dark:leading-relaxed">{kpi.objective}</p>
                                  <div className="mt-2 flex items-center gap-4">
                                    <Badge variant="secondary">Target: {kpi.target}</Badge>
                                    <Badge variant="outline">Weight: {kpi.weight}%</Badge>
                    </div>
                      </div>
                      </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <div className="relative">
                                    <Input
                                      type="date"
                                      value={kpi.startDate || ''}
                                      onChange={(e) => handleKPIDateChange(kpi.id, 'startDate', e.target.value)}
                                      disabled={!isEditing}
                                      className={`${validationErrors[`kpi-${kpi.id}-dates`] ? 'border-red-500' : ''} dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 dark:shadow-lg dark:shadow-slate-950/10`}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none dark:text-slate-400" />
                      </div>
                      </div>
                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <div className="relative">
                                    <Input
                                      type="date"
                                      value={kpi.endDate || ''}
                                      onChange={(e) => handleKPIDateChange(kpi.id, 'endDate', e.target.value)}
                                      disabled={!isEditing}
                                      className={`${validationErrors[`kpi-${kpi.id}-dates`] ? 'border-red-500' : ''} dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20 dark:shadow-lg dark:shadow-slate-950/10`}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none dark:text-slate-400" />
                      </div>
                      </div>
                              </div>
                              
                              {validationErrors[`kpi-${kpi.id}-dates`] && (
                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <div className="flex items-center">
                                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                                    <p className="text-sm text-red-600">{validationErrors[`kpi-${kpi.id}-dates`]}</p>
                      </div>
                    </div>
                  )}
                              
                              {/* Work Plan Toggle */}
                              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 dark:from-slate-800/60 dark:to-slate-700/40 dark:border-slate-600/40">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-blue-900 dark:text-blue-200">Work Plan (Optional)</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">Break this KPI into specific tasks for monthly review</p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant={kpi.hasWorkPlan ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleWorkPlan(kpi.id)}
                                    disabled={!isEditing}
                                    className="ml-4"
                                  >
                                    {kpi.hasWorkPlan ? 'Disable Work Plan' : 'Create Work Plan'}
                                  </Button>
            </div>

                                {kpi.hasWorkPlan && (
                                  <div className="space-y-4">
                                    {/* Work Plan Tasks */}
                                    <div className="space-y-3">
                                      {kpi.workPlanTasks.map((task, taskIndex) => (
                                        <div key={task.id} className="bg-white rounded-lg border border-blue-200 p-4 dark:bg-slate-800/80 dark:border-slate-600/60">
                                          <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-gray-900 dark:text-slate-100">Task {taskIndex + 1}</h5>
                                            {kpi.workPlanTasks.length > 1 && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeWorkPlanTask(kpi.id, task.id)}
                                                disabled={!isEditing}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            )}
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label>Task Title</Label>
                                              <Input
                                                value={task.title}
                                                onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'title', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Enter task title"
                                                className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Weight (%)</Label>
                                              <Input
                                                type="number"
                                                min="0"
                                                max={kpi.weight}
                                                value={task.weight || ''}
                                                onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'weight', parseInt(e.target.value) || 0)}
                                                disabled={!isEditing}
                                                placeholder="0"
                                                className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                              />
                                            </div>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="space-y-2">
                                              <Label>Unit of Measurement</Label>
                                              <Select
                                                value={task.unitOfMeasurement}
                                                onValueChange={(value) => {
                                                  updateWorkPlanTask(kpi.id, task.id, 'unitOfMeasurement', value);
                                                  // Clear target when unit changes
                                                  updateWorkPlanTask(kpi.id, task.id, 'target', '');
                                                }}
                                                disabled={!isEditing}
                                              >
                                                <SelectTrigger className="dark:bg-slate-700/80 dark:border-slate-600/60">
                                                  <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="Number">Number</SelectItem>
                                                  <SelectItem value="Percentage">Percentage (%)</SelectItem>
                                                  <SelectItem value="Date">Date</SelectItem>
                                                  <SelectItem value="Text">Text</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Target</Label>
                                              {task.unitOfMeasurement === 'Date' ? (
                                                <Input
                                                  type="date"
                                                  value={task.target}
                                                  onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'target', e.target.value)}
                                                  disabled={!isEditing}
                                                  className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                                />
                                              ) : task.unitOfMeasurement === 'Number' ? (
                                                <Input
                                                  type="number"
                                                  value={task.target}
                                                  onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'target', e.target.value)}
                                                  disabled={!isEditing}
                                                  placeholder="Enter number"
                                                  className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                                />
                                              ) : task.unitOfMeasurement === 'Percentage' ? (
                                                <div className="relative">
                                                  <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={task.target}
                                                    onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'target', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Enter percentage"
                                                    className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                                  />
                                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-slate-400">%</span>
                  </div>
                ) : (
                                                <Input
                                                  value={task.target}
                                                  onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'target', e.target.value)}
                                                  disabled={!isEditing}
                                                  placeholder="Enter target"
                                                  className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                                />
                                              )}
                              </div>
                              </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="space-y-2">
                                              <Label>Start Date</Label>
                                              <Input
                                                type="date"
                                                value={task.startDate}
                                                onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'startDate', e.target.value)}
                                                disabled={!isEditing}
                                                className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                              />
                              </div>
                                            <div className="space-y-2">
                                              <Label>End Date</Label>
                                              <Input
                                                type="date"
                                                value={task.endDate}
                                                onChange={(e) => updateWorkPlanTask(kpi.id, task.id, 'endDate', e.target.value)}
                                                disabled={!isEditing}
                                                className="dark:bg-slate-700/80 dark:border-slate-600/60"
                                              />
                              </div>
                                          </div>
                                        </div>
                        ))}
                  </div>
                                    
                                    {/* Add Task Button */}
                                    {isEditing && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addWorkPlanTask(kpi.id)}
                                        className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Task
                                      </Button>
                                    )}
                                    
                                    {/* Weight Validation */}
                                    {getWorkPlanWeightError(kpi) && (
                                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800/40">
                                        <div className="flex items-center">
                                          <AlertCircle className="w-4 h-4 text-red-600 mr-2 dark:text-red-400" />
                                          <p className="text-sm text-red-600 dark:text-red-400">{getWorkPlanWeightError(kpi)}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg dark:bg-slate-800/40 dark:border-slate-600/40">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  <strong>Note:</strong> These dates can be overridden by your supervisor during approval.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
              </CardContent>
            </Card>
                  )}

                  {currentStep === 2 && (
                    <Card>
              <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-blue-600" />
                          </div>
                          Section 2: Competencies
                </CardTitle>
                        <p className="text-muted-foreground">Review required competencies and skills for your role</p>
              </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {contractData.competencies.map((comp) => (
                            <div key={comp.id} className="bg-muted rounded-lg border-2 border-border p-6 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border-slate-700/60 dark:shadow-xl dark:shadow-slate-950/20 dark:backdrop-blur-sm hover:dark:shadow-slate-950/30 transition-all duration-300">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">{comp.category}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 dark:text-slate-300 dark:leading-relaxed">{comp.description}</p>
                  </div>
                      </div>
                      </div>
                          ))}
                  </div>
              </CardContent>
            </Card>
                  )}

                  {currentStep === 3 && (
                    <Card>
              <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                          Section 3: Processes & Operations
                </CardTitle>
                        <p className="text-muted-foreground">Define operational processes and procedures</p>
              </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {contractData.processes.map((op) => (
                            <div key={op.id} className="bg-muted rounded-lg border-2 border-border p-6 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border-slate-700/60 dark:shadow-xl dark:shadow-slate-950/20 dark:backdrop-blur-sm hover:dark:shadow-slate-950/30 transition-all duration-300">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">{op.area}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 dark:text-slate-300 dark:leading-relaxed">{op.target}</p>
                      </div>
                      </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
                  )}

                  {currentStep === 4 && (
                    <Card>
              <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          Section 4: Review & Submit
                </CardTitle>
                        <p className="text-muted-foreground">Review and submit your performance contract</p>
              </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Contract Summary */}
                        <div className="p-4 bg-muted rounded-lg dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60 dark:border dark:border-slate-700/60 dark:shadow-lg dark:shadow-slate-950/10">
                          <h3 className="text-lg font-semibold mb-4 dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">Contract Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-card rounded-lg dark:bg-gradient-to-br dark:from-slate-700/60 dark:to-slate-800/40 dark:border dark:border-slate-600/40 dark:shadow-lg dark:shadow-slate-950/10 hover:dark:shadow-slate-950/20 transition-all duration-300">
                              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 dark:drop-shadow-sm">{contractData.kpis.length}</div>
                              <div className="text-sm text-muted-foreground dark:text-slate-300 dark:tracking-wide">KPIs</div>
                  </div>
                            <div className="text-center p-4 bg-card rounded-lg dark:bg-gradient-to-br dark:from-slate-700/60 dark:to-slate-800/40 dark:border dark:border-slate-600/40 dark:shadow-lg dark:shadow-slate-950/10 hover:dark:shadow-slate-950/20 transition-all duration-300">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 dark:drop-shadow-sm">{contractData.competencies.length}</div>
                              <div className="text-sm text-muted-foreground dark:text-slate-300 dark:tracking-wide">Competencies</div>
                              </div>
                            <div className="text-center p-4 bg-card rounded-lg dark:bg-gradient-to-br dark:from-slate-700/60 dark:to-slate-800/40 dark:border dark:border-slate-600/40 dark:shadow-lg dark:shadow-slate-950/10 hover:dark:shadow-slate-950/20 transition-all duration-300">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 dark:drop-shadow-sm">{contractData.processes.length}</div>
                              <div className="text-sm text-muted-foreground dark:text-slate-300 dark:tracking-wide">Operations</div>
                              </div>
                              </div>
                              </div>

                        {/* Acknowledgements */}
                  <div className="space-y-4">
                          <h3 className="text-lg font-semibold dark:text-slate-100 dark:tracking-wide dark:drop-shadow-sm">Acknowledgements</h3>
                          <div className="text-sm text-muted-foreground dark:text-slate-300">
                            {Object.values(contractData.acknowledgements).filter(Boolean).length} of {Object.keys(contractData.acknowledgements).length} completed
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 dark:hover:bg-slate-700/50">
                              <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={contractData.acknowledgements.termsAccepted}
                                onChange={(e) => setContractData(prev => ({
                                  ...prev,
                                  acknowledgements: {
                                    ...prev.acknowledgements,
                                    termsAccepted: e.target.checked
                                  }
                                }))}
                                className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                              />
                              <label htmlFor="termsAccepted" className="text-sm font-medium leading-relaxed cursor-pointer dark:text-slate-200">
                                I have read and understood the terms and conditions of this performance contract.
                              </label>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 dark:hover:bg-slate-700/50">
                              <input
                                type="checkbox"
                                id="timelineAccepted"
                                checked={contractData.acknowledgements.timelineAccepted}
                                onChange={(e) => setContractData(prev => ({
                                  ...prev,
                                  acknowledgements: {
                                    ...prev.acknowledgements,
                                    timelineAccepted: e.target.checked
                                  }
                                }))}
                                className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                              />
                              <label htmlFor="timelineAccepted" className="text-sm font-medium leading-relaxed cursor-pointer dark:text-slate-200">
                                I agree to the timelines and deadlines set for my performance objectives.
                              </label>
                          </div>
                            
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 dark:hover:bg-slate-700/50">
                              <input
                                type="checkbox"
                                id="reviewProcessAccepted"
                                checked={contractData.acknowledgements.reviewProcessAccepted}
                                onChange={(e) => setContractData(prev => ({
                                  ...prev,
                                  acknowledgements: {
                                    ...prev.acknowledgements,
                                    reviewProcessAccepted: e.target.checked
                                  }
                                }))}
                                className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                              />
                              <label htmlFor="reviewProcessAccepted" className="text-sm font-medium leading-relaxed cursor-pointer dark:text-slate-200">
                                I understand the performance review process and evaluation criteria.
                              </label>
                        </div>
                            
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 dark:hover:bg-slate-700/50">
                              <input
                                type="checkbox"
                                id="supervisorReview"
                                checked={contractData.acknowledgements.supervisorReview}
                                onChange={(e) => setContractData(prev => ({
                                  ...prev,
                                  acknowledgements: {
                                    ...prev.acknowledgements,
                                    supervisorReview: e.target.checked
                                  }
                                }))}
                                className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                              />
                              <label htmlFor="supervisorReview" className="text-sm font-medium leading-relaxed cursor-pointer dark:text-slate-200">
                                I acknowledge that my supervisor will review and approve this performance contract.
                              </label>
                      </div>
                            
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 dark:hover:bg-slate-700/50">
                              <input
                                type="checkbox"
                                id="followUp"
                                checked={contractData.acknowledgements.followUp}
                                onChange={(e) => setContractData(prev => ({
                                  ...prev,
                                  acknowledgements: {
                                    ...prev.acknowledgements,
                                    followUp: e.target.checked
                                  }
                                }))}
                                className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                              />
                              <label htmlFor="followUp" className="text-sm font-medium leading-relaxed cursor-pointer dark:text-slate-200">
                                I agree to participate in regular follow-up meetings and progress reviews.
                              </label>
                  </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button 
                            onClick={handleAcceptContract}
                            disabled={!Object.values(contractData.acknowledgements).every(Boolean) || isSubmitting}
                            className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg rounded-lg dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 dark:shadow-emerald-500/30 dark:border dark:border-emerald-400/30 dark:backdrop-blur-sm"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Submitting for Approval...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5 mr-3" />
                                Submit for Approval
                              </>
                            )}
                          </Button>
                        </div>
              </CardContent>
            </Card>
                  )}
                </div>

                {/* Navigation */}
                <Card>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <Button 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:border-slate-600/60 dark:text-slate-200 dark:hover:bg-slate-700/80 dark:shadow-lg dark:shadow-slate-950/10 dark:backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      
                      <div className="text-xs sm:text-sm text-muted-foreground font-medium order-first sm:order-none dark:text-slate-400">
                        Step {currentStep} of {steps.length}
                    </div>
                      
                      <Button 
                        onClick={nextStep}
                        disabled={currentStep === steps.length}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 dark:shadow-emerald-500/30 dark:border dark:border-emerald-400/30 dark:backdrop-blur-sm"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                  </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Contract Status Pages */}
            {isSubmitted && (
              <div className="space-y-6">
                {/* Status Simulation Controls */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/95 dark:to-slate-800/90 dark:shadow-2xl dark:shadow-slate-950/30 dark:backdrop-blur-sm dark:border dark:border-slate-700/40">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <MessageSquare className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Demo Controls</h3>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs dark:bg-purple-900/30 dark:text-purple-300">
                        Testing
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button 
                        onClick={() => setContractStatus('Pending Approval')}
                        variant={contractStatus === 'Pending Approval' ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 text-xs ${
                          contractStatus === 'Pending Approval' 
                            ? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700' 
                            : 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30'
                        }`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Button>
                      <Button
                        onClick={() => setContractStatus('Approved')}
                        variant={contractStatus === 'Approved' ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 text-xs ${
                          contractStatus === 'Approved' 
                            ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700' 
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Button>
                      <Button
                        onClick={() => setContractStatus('Rejected')}
                        variant={contractStatus === 'Rejected' ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 text-xs ${
                          contractStatus === 'Rejected' 
                            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' 
                            : 'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/30'
                        }`}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Button>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false);
                          setContractStatus('Draft');
                        }}
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
              </CardContent>
            </Card>

                {/* Pending Approval Status */}
                {contractStatus === 'Pending Approval' && (
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/25 dark:shadow-2xl dark:shadow-amber-950/20 dark:backdrop-blur-sm dark:border dark:border-amber-800/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg dark:from-amber-500 dark:to-orange-600 dark:shadow-amber-500/30 dark:border dark:border-amber-400/30">
                            <Clock className="w-6 h-6 text-white dark:drop-shadow-sm" />
                  </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                            </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-100 dark:tracking-wide dark:drop-shadow-sm">Contract Pending Approval</h3>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="text-amber-700 text-sm mb-4 dark:text-amber-300">Your performance contract has been submitted and is awaiting supervisor review.</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-amber-600 dark:text-amber-400">Contract ID:</span>
                                <span className="font-semibold text-amber-800 dark:text-amber-200">{currentContract.id}</span>
                        </div>
                              <div className="flex justify-between">
                                <span className="text-amber-600 dark:text-amber-400">Submitted:</span>
                                <span className="font-semibold text-amber-800 dark:text-amber-200">{new Date().toLocaleDateString()}</span>
                      </div>
                  </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-amber-600 dark:text-amber-400">Reviewer:</span>
                                <span className="font-semibold text-amber-800 dark:text-amber-200 truncate">{currentContract.employee.supervisor.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-amber-600 dark:text-amber-400">Department:</span>
                                <span className="font-semibold text-amber-800 dark:text-amber-200 truncate">{currentContract.employee.department}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-amber-100/50 rounded-lg dark:bg-amber-900/20 dark:border dark:border-amber-800/30">
                            <p className="text-xs text-amber-700 font-medium mb-2 dark:text-amber-300">Next Steps:</p>
                            <ul className="text-xs text-amber-600 space-y-1 dark:text-amber-400">
                              <li>• Supervisor will review within 3-5 business days</li>
                              <li>• You'll receive email notification once reviewed</li>
                              <li>• Check Historical Contracts tab for updates</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Approved Status */}
                {contractStatus === 'Approved' && (
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
                            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-100 dark:tracking-wide dark:drop-shadow-sm">Contract Approved! 🎉</h3>
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          </div>
                          <p className="text-emerald-700 text-sm mb-4 dark:text-emerald-300">Congratulations! Your performance contract has been approved by your supervisor.</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-emerald-600 dark:text-emerald-400">Contract ID:</span>
                                <span className="font-semibold text-emerald-800 dark:text-emerald-200">{currentContract.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-emerald-600 dark:text-emerald-400">Approved:</span>
                                <span className="font-semibold text-emerald-800 dark:text-emerald-200">{new Date().toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-emerald-600 dark:text-emerald-400">Approved By:</span>
                                <span className="font-semibold text-emerald-800 dark:text-emerald-200 truncate">{currentContract.employee.supervisor.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-emerald-600 dark:text-emerald-400">Position:</span>
                                <span className="font-semibold text-emerald-800 dark:text-emerald-200 truncate">{currentContract.employee.supervisor.position}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-emerald-100/50 rounded-lg dark:bg-emerald-900/20 dark:border dark:border-emerald-800/30">
                            <p className="text-xs text-emerald-700 font-medium mb-2 dark:text-emerald-300">What's Next:</p>
                            <ul className="text-xs text-emerald-600 space-y-1 dark:text-emerald-400">
                              <li>• Contract is now active and ready for implementation</li>
                              <li>• Focus on achieving your KPIs and objectives</li>
                              <li>• Regular check-ins with supervisor recommended</li>
                            </ul>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                      <Button 
                              onClick={() => printContract(currentContract)}
                              size="sm"
                              className="h-8 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                            <Button
                              onClick={() => printContract(currentContract)}
                        variant="outline" 
                        size="sm" 
                              className="h-8 px-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                      >
                              <FileText className="w-3 h-3 mr-1" />
                              Print
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
                )}

                {/* Rejected Status */}
                {contractStatus === 'Rejected' && (
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/25 dark:shadow-2xl dark:shadow-red-950/20 dark:backdrop-blur-sm dark:border dark:border-red-800/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg dark:from-red-500 dark:to-rose-600 dark:shadow-red-500/30 dark:border dark:border-red-400/30">
                            <XCircle className="w-6 h-6 text-white dark:drop-shadow-sm" />
                      </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-red-800 dark:text-red-100 dark:tracking-wide dark:drop-shadow-sm">Contract Requires Revision</h3>
                            <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </Badge>
                          </div>
                          <p className="text-red-700 text-sm mb-4 dark:text-red-300">Your performance contract has been returned for modifications.</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-red-600 dark:text-red-400">Contract ID:</span>
                                <span className="font-semibold text-red-800 dark:text-red-200">{currentContract.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600 dark:text-red-400">Returned:</span>
                                <span className="font-semibold text-red-800 dark:text-red-200">{new Date().toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-red-600 dark:text-red-400">Reviewed By:</span>
                                <span className="font-semibold text-red-800 dark:text-red-200 truncate">{currentContract.employee.supervisor.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600 dark:text-red-400">Position:</span>
                                <span className="font-semibold text-red-800 dark:text-red-200 truncate">{currentContract.employee.supervisor.position}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-red-100/50 rounded-lg dark:bg-red-900/20 dark:border dark:border-red-800/30">
                            <p className="text-xs text-red-700 font-medium mb-2 dark:text-red-300">Areas that need attention:</p>
                            <ul className="text-xs text-red-600 space-y-1 dark:text-red-400">
                              <li>• Some KPIs may need more specific targets</li>
                              <li>• Consider adding more measurable outcomes</li>
                              <li>• Timeline adjustments may be required</li>
                            </ul>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => {
                                setIsSubmitted(false);
                                setContractStatus('Draft');
                              }}
                              size="sm"
                              className="h-8 px-4 bg-red-500 hover:bg-red-600 text-white text-xs dark:bg-red-600 dark:hover:bg-red-700"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Revise
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-4 border-red-300 text-red-700 hover:bg-red-50 text-xs dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/30"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Contact
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

          {/* Historical Contracts Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                    <CardTitle>Historical Performance Contracts</CardTitle>
                    <p className="text-muted-foreground">View your past performance contracts and their status</p>
                            </div>
                  <div className="flex items-center gap-4">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="All">All Years</SelectItem>
                        {historyYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                          </div>
                            </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <StaggeredChildren>
                    {[...Array(3)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </StaggeredChildren>
                ) : paginatedContracts.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedContracts.map((contract) => (
                      <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{contract.id}</h3>
                            <Badge className={getStatusColor(contract.status)}>
                                  <div className="flex items-center gap-1">
                              {getStatusIcon(contract.status)}
                                    {contract.status}
                                  </div>
                            </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <p><strong>Year:</strong> {contract.year}</p>
                                  <p><strong>Period:</strong> {contract.startDate} - {contract.endDate}</p>
                                </div>
                                <div>
                                  <p><strong>Created:</strong> {new Date(contract.createdAt).toLocaleDateString()}</p>
                                  {contract.approvedAt && (
                                    <p><strong>Approved:</strong> {new Date(contract.approvedAt).toLocaleDateString()}</p>
                                  )}
                                </div>
                                <div>
                                  <p><strong>KPIs:</strong> {contract.kpiData?.length || 0}</p>
                                  <p><strong>Competencies:</strong> {contract.competencyData?.length || 0}</p>
                                </div>
                              </div>
                    </div>
                    <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowHistoricalDialog(true);
                                }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                                View
                            </Button>
                              {canDownloadContract() && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                                  onClick={() => printContract(contract)}
                      >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                      </Button>
                              )}
                          </div>
                        </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredHistoricalContracts.length)} of {filteredHistoricalContracts.length} contracts
                  </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {page} of {totalPages}
                              </span>
                            <Button
                              variant="outline"
                              size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            >
                            Next
                            </Button>
                          </div>
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No historical contracts found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Historical Contract View Dialog */}
        <StandardModal
          isOpen={showHistoricalDialog}
          onClose={() => setShowHistoricalDialog(false)}
          title={`Performance Contract - ${selectedContract?.id}`}
          size="2xl"
        >
            {selectedContract && (
              <div className="space-y-6">
                {/* Contract Header */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                      <h3 className="font-semibold mb-2">Contract Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Contract ID:</strong> {selectedContract.id}</p>
                        <p><strong>Year:</strong> {selectedContract.year}</p>
                        <p><strong>Status:</strong> 
                          <Badge className={`ml-2 ${getStatusColor(selectedContract.status)}`}>
                            {selectedContract.status}
                          </Badge>
                        </p>
                        <p><strong>Period:</strong> {selectedContract.startDate} - {selectedContract.endDate}</p>
              </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Employee Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {selectedContract.employee.firstname} {selectedContract.employee.othername} {selectedContract.employee.surname}</p>
                        <p><strong>IPPIS No:</strong> {selectedContract.employee.ippisNo}</p>
                        <p><strong>Email:</strong> {selectedContract.employee.email}</p>
                        <p><strong>Department:</strong> {selectedContract.employee.department}</p>
                        <p><strong>Position:</strong> {selectedContract.employee.position}</p>
                        <p><strong>Grade Level:</strong> {selectedContract.employee.gradeLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPIs Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Key Performance Indicators
                  </h3>
                  <div className="space-y-3">
                    {selectedContract.kpiData?.map((kpi: any) => (
                      <Card key={kpi.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">{kpi.keyResultArea}</h4>
                              <p className="text-muted-foreground mb-3">{kpi.objective}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p><strong>Target:</strong> {kpi.target}</p>
                                  <p><strong>Unit:</strong> {kpi.unitOfMeasurement}</p>
                                </div>
                                <div>
                                  <p><strong>Weight:</strong> {kpi.weight}%</p>
                                </div>
                                <div>
                                  <p><strong>Start Date:</strong> {kpi.startDate}</p>
                                  <p><strong>End Date:</strong> {kpi.endDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Competencies Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Competencies
                  </h3>
                  <div className="space-y-3">
                    {selectedContract.competencyData?.map((comp: any) => (
                      <Card key={comp.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{comp.category}</h4>
                          <p className="text-muted-foreground">{comp.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Operations Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Operations & Processes
                  </h3>
                  <div className="space-y-3">
                    {selectedContract.operationData?.map((op: any) => (
                      <Card key={op.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{op.area}</h4>
                          <p className="text-muted-foreground">{op.target}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowHistoricalDialog(false)}
                  >
                    Close
                </Button>
                  <Button
                    onClick={() => printContract(selectedContract)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download/Print
                </Button>
              </div>
            </div>
            )}
        </StandardModal>
      </div>
    </Layout>
  );
};

export default PerformanceContract;