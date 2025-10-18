export interface WorkingYear {
  id: string;
  name: string; // e.g., "2024", "2025"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  description?: string;
}

export interface WorkingYearFormData {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface WorkingYearFilters {
  search: string;
  status: 'All' | 'Active' | 'Inactive';
}

export interface WorkingYearListResponse {
  workingYears: WorkingYear[];
  total: number;
  page: number;
  limit: number;
}

export interface WorkingYearSwitchData {
  workingYearId: string;
  copyFromPrevious: boolean;
  copyKRAs: boolean;
  copyObjectives: boolean;
  copyKPIs: boolean;
}
