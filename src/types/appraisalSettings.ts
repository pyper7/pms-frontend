export interface AppraisalSettings {
  id: string;
  workingYearId: string;
  workingYearName: string;
  appraisalPeriodId: string;
  appraisalPeriodName: string;
  appraisalType: 'Annual' | 'Bi-Annual' | 'Quarterly' | 'Custom';
  scope: 'All Cadres' | 'Cadre Specific';
  cadreSpecificSettings?: CadreSpecificSetting[];
  workflowConfig: WorkflowConfig;
  gradingScale: GradingScale[];
  weightDistribution: WeightDistribution;
  contractTemplateId?: string;
  contractTemplateName?: string;
  submissionDeadline: string;
  reminderConfig: ReminderConfig;
  reportingConfig: ReportingConfig;
  accessControl: AccessControl;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CadreSpecificSetting {
  cadreId: string;
  cadreName: string;
  workflowConfig: WorkflowConfig;
  gradingScale: GradingScale[];
  weightDistribution: WeightDistribution;
}

export interface WorkflowConfig {
  steps: WorkflowStep[];
  allowRevisions: boolean;
  revisionLimit?: number;
  autoAdvance: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  type: 'Self-Appraisal' | 'Supervisor' | 'Director' | 'HOS' | 'HR' | 'Custom';
  applicableTo: 'All' | 'Specific Cadres' | 'Specific Posts';
  cadreIds?: string[];
  postIds?: string[];
  isRequired: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canReject: boolean;
  deadline: string; // ISO date string
  reminderDays: number[];
}

export interface GradingScale {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
  color: string;
  isDefault?: boolean;
}

export interface WeightDistribution {
  kraWeightRule: 'Sum to 100%' | 'Equal Distribution' | 'Custom';
  objectiveWeightRule: 'Sum to KRA Weight' | 'Equal Distribution' | 'Custom';
  kpiWeightRule: 'Sum to Objective Weight' | 'Equal Distribution' | 'Custom';
  enforceValidation: boolean;
  allowOverride: boolean;
}

export interface ReminderConfig {
  enabled: boolean;
  reminderDays: number[]; // e.g., [7, 2, 1] for 7 days, 2 days, 1 day before
  escalationDays: number; // e.g., 3 days after deadline
  emailEnabled: boolean;
  smsEnabled: boolean;
  escalationEnabled: boolean;
}

export interface ReportingConfig {
  defaultView: 'By Cadre' | 'By Post' | 'By Department' | 'By Individual';
  displayMode: 'Numeric Only' | 'Grading Only' | 'Both';
  includeComments: boolean;
  includeAttachments: boolean;
  allowExport: boolean;
  exportFormats: ('PDF' | 'Excel' | 'CSV')[];
}

export interface AccessControl {
  canView: string[]; // User roles that can view
  canEdit: string[]; // User roles that can edit
  canApprove: string[]; // User roles that can approve
  canReject: string[]; // User roles that can reject
  canOverride: string[]; // User roles that can override
  lockAfterSubmission: boolean;
  lockAfterDeadline: boolean;
}

export interface AppraisalSettingsFormData {
  workingYearId: string;
  appraisalPeriodId: string;
  appraisalType: 'Annual' | 'Bi-Annual' | 'Quarterly' | 'Custom';
  scope: 'All Cadres' | 'Cadre Specific';
  workflowConfig: WorkflowConfig;
  gradingScale: GradingScale[];
  weightDistribution: WeightDistribution;
  contractTemplateId?: string;
  submissionDeadline: string;
  reminderConfig: ReminderConfig;
  reportingConfig: ReportingConfig;
  accessControl: AccessControl;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  templateType: 'Document' | 'System Form';
  fileUrl?: string;
  formConfig?: any; // JSON configuration for system forms
  isActive: boolean;
  createdAt: string;
}

export interface Cadre {
  id: string;
  name: string;
  level: string;
  description?: string;
}

export interface Post {
  id: string;
  name: string;
  cadreId: string;
  level: string;
  description?: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
