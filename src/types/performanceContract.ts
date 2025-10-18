export interface PerformanceContract {
  id: string;
  contractNumber: string; // Auto-generated contract number
  staffId: string;
  staffName: string;
  ippisNumber: string;
  department: string;
  post: string;
  gradeLevel: string;
  workingYearId: string;
  workingYearName: string;
  appraisalPeriodId: string;
  appraisalPeriodName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  currentStage: string; // Current workflow stage
  kras: KRA[];
  totalWeight: number; // Should equal 100%
  overallScore?: number; // Final performance score
  overallGrade?: string; // Final performance grade
  comments: string;
  attachments: ContractAttachment[];
  workflowHistory: WorkflowHistory[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface KRA {
  id: string;
  title: string;
  description: string;
  weight: number; // Percentage weight
  objectives: Objective[];
  totalObjectiveWeight: number; // Should equal KRA weight
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  weight: number; // Percentage of KRA weight
  kpis: KPI[];
  totalKPIWeight: number; // Should equal objective weight
  targetValue: string;
  actualValue?: string;
  achievement?: number; // Percentage achieved
  score?: number; // Calculated score
}

export interface KPI {
  id: string;
  title: string;
  description: string;
  weight: number; // Percentage of objective weight
  measurementUnit: string; // e.g., "Number", "Percentage", "Days", "Amount"
  targetValue: string;
  actualValue?: string;
  achievement?: number; // Percentage achieved
  score?: number; // Calculated score
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
}

export interface ContractAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface WorkflowHistory {
  id: string;
  stage: string;
  action: 'Created' | 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected' | 'Returned';
  comments: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  isCurrent: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  cadreId: string;
  cadreName: string;
  gradeLevel: string;
  isActive: boolean;
  kras: KRATemplate[];
  createdAt: string;
  createdBy: string;
}

export interface KRATemplate {
  id: string;
  title: string;
  description: string;
  weight: number;
  objectives: ObjectiveTemplate[];
}

export interface ObjectiveTemplate {
  id: string;
  title: string;
  description: string;
  weight: number;
  kpis: KPITemplate[];
}

export interface KPITemplate {
  id: string;
  title: string;
  description: string;
  weight: number;
  measurementUnit: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
}

export interface PerformanceContractFormData {
  staffId: string;
  workingYearId: string;
  appraisalPeriodId: string;
  startDate: string;
  endDate: string;
  kras: KRA[];
  comments: string;
}

export interface ContractFilters {
  search: string;
  status: 'All' | 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  cadre: string;
  gradeLevel: string;
  workingYear: string;
  department: string;
}

export interface ContractStats {
  totalContracts: number;
  draftContracts: number;
  submittedContracts: number;
  approvedContracts: number;
  completedContracts: number;
  averageScore: number;
}

// TETFund Standard KRAs
export const TETFUND_STANDARD_KRAS = [
  {
    id: '1',
    title: 'Core Duties and Responsibilities',
    description: 'Primary job functions and core responsibilities',
    weight: 25,
    objectives: [
      {
        id: '1',
        title: 'Efficient execution of assigned tasks',
        description: 'Complete assigned tasks within specified timeframes',
        weight: 50,
        kpis: [
          {
            id: '1',
            title: 'Task completion rate',
            description: 'Percentage of tasks completed on time',
            weight: 60,
            measurementUnit: 'Percentage',
            frequency: 'Monthly'
          },
          {
            id: '2',
            title: 'Quality of work output',
            description: 'Quality assessment of completed work',
            weight: 40,
            measurementUnit: 'Rating (1-5)',
            frequency: 'Monthly'
          }
        ]
      },
      {
        id: '2',
        title: 'Adherence to policies and procedures',
        description: 'Compliance with organizational policies and procedures',
        weight: 50,
        kpis: [
          {
            id: '3',
            title: 'Policy compliance rate',
            description: 'Percentage compliance with organizational policies',
            weight: 100,
            measurementUnit: 'Percentage',
            frequency: 'Quarterly'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Administrative Functions',
    description: 'Administrative duties and support functions',
    weight: 25,
    objectives: [
      {
        id: '3',
        title: 'Document management',
        description: 'Efficient handling and management of documents',
        weight: 40,
        kpis: [
          {
            id: '4',
            title: 'Document processing time',
            description: 'Average time to process documents',
            weight: 50,
            measurementUnit: 'Days',
            frequency: 'Monthly'
          },
          {
            id: '5',
            title: 'Document accuracy rate',
            description: 'Percentage of error-free documents',
            weight: 50,
            measurementUnit: 'Percentage',
            frequency: 'Monthly'
          }
        ]
      },
      {
        id: '4',
        title: 'Customer service',
        description: 'Quality of service provided to internal and external customers',
        weight: 60,
        kpis: [
          {
            id: '6',
            title: 'Customer satisfaction rating',
            description: 'Average customer satisfaction score',
            weight: 100,
            measurementUnit: 'Rating (1-5)',
            frequency: 'Quarterly'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Professional Development',
    description: 'Continuous learning and skill development',
    weight: 25,
    objectives: [
      {
        id: '5',
        title: 'Training and development participation',
        description: 'Active participation in training programs',
        weight: 50,
        kpis: [
          {
            id: '7',
            title: 'Training hours completed',
            description: 'Number of training hours completed',
            weight: 60,
            measurementUnit: 'Hours',
            frequency: 'Annually'
          },
          {
            id: '8',
            title: 'Certification obtained',
            description: 'Number of relevant certifications obtained',
            weight: 40,
            measurementUnit: 'Number',
            frequency: 'Annually'
          }
        ]
      },
      {
        id: '6',
        title: 'Knowledge sharing',
        description: 'Sharing knowledge and best practices with colleagues',
        weight: 50,
        kpis: [
          {
            id: '9',
            title: 'Knowledge sharing sessions',
            description: 'Number of knowledge sharing sessions conducted',
            weight: 100,
            measurementUnit: 'Number',
            frequency: 'Quarterly'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Special Assignments and Projects',
    description: 'Special projects and additional responsibilities',
    weight: 25,
    objectives: [
      {
        id: '7',
        title: 'Project completion',
        description: 'Successful completion of assigned projects',
        weight: 60,
        kpis: [
          {
            id: '10',
            title: 'Project completion rate',
            description: 'Percentage of projects completed on time',
            weight: 70,
            measurementUnit: 'Percentage',
            frequency: 'Quarterly'
          },
          {
            id: '11',
            title: 'Project quality rating',
            description: 'Quality assessment of completed projects',
            weight: 30,
            measurementUnit: 'Rating (1-5)',
            frequency: 'Quarterly'
          }
        ]
      },
      {
        id: '8',
        title: 'Innovation and improvement',
        description: 'Contributing to process improvements and innovations',
        weight: 40,
        kpis: [
          {
            id: '12',
            title: 'Improvement suggestions',
            description: 'Number of improvement suggestions implemented',
            weight: 100,
            measurementUnit: 'Number',
            frequency: 'Annually'
          }
        ]
      }
    ]
  }
];

// TETFund Grade Levels
export const TETFUND_GRADE_LEVELS = [
  'GL 01', 'GL 02', 'GL 03', 'GL 04', 'GL 05', 'GL 06', 'GL 07', 'GL 08',
  'GL 09', 'GL 10', 'GL 11', 'GL 12', 'GL 13', 'GL 14', 'GL 15', 'GL 16', 'GL 17'
];

// TETFund Cadres
export const TETFUND_CADRES = [
  { id: '1', name: 'Administrative', description: 'Administrative staff' },
  { id: '2', name: 'Professional', description: 'Professional staff' },
  { id: '3', name: 'Technical', description: 'Technical staff' },
  { id: '4', name: 'Executive', description: 'Executive staff' },
  { id: '5', name: 'Management', description: 'Management staff' }
];
