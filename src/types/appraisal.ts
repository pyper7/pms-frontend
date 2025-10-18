export interface AppraisalPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  frequency: 'Annual' | 'Bi-Annual' | 'Quarterly' | 'Ad-Hoc';
  applicableMDAs: 'Service-wide' | 'Specific';
  specificMDAIds?: string[];
  workingYearId: string; // Link to working year
  workingYearName: string; // Display name for working year
  isActive: boolean;
  isArchived: boolean;
  deadlines: {
    selfAssessment: string;
    supervisorReview: string;
    reviewerApproval: string;
    hosApproval: string;
  };
  workflow: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  applicableTo: 'All' | 'Specific Cadres';
  cadreIds?: string[];
  postIds?: string[];
  isRequired: boolean;
  canSkip: boolean;
}

export interface AppraisalPeriodFormData {
  name: string;
  startDate: string;
  endDate: string;
  frequency: 'Annual' | 'Bi-Annual' | 'Quarterly' | 'Ad-Hoc';
  applicableMDAs: 'Service-wide' | 'Specific';
  specificMDAIds: string[];
  workingYearId: string;
  deadlines: {
    selfAssessment: string;
    supervisorReview: string;
    reviewerApproval: string;
    hosApproval: string;
  };
  workflow: WorkflowStep[];
}

export interface AppraisalPeriodFilters {
  search: string;
  frequency: string;
  status: 'All' | 'Active' | 'Inactive' | 'Archived';
  mda: string;
}

export interface AppraisalPeriodListResponse {
  periods: AppraisalPeriod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  mdaId: string;
  level: string;
}
