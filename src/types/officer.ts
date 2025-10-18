export interface Officer {
  id: string;
  ippis: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  division?: string;
  branch?: string;
  post?: string;
  cadre?: string;
  status: 'active' | 'inactive';
  dateCreated: string;
  lastLogin?: string;
  profilePicture?: string;
  organizationalUnit?: {
    department: string;
    division: string;
    branch: string;
  };
}

export interface OfficerFormData {
  ippis: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  division?: string;
  branch?: string;
  post?: string;
  cadre?: string;
  gradeLevel?: string;
  status: 'active' | 'inactive';
}

export interface BulkUploadResult {
  success: number;
  errors: number;
  duplicates: number;
  invalid: number;
  details: {
    successful: Officer[];
    errors: Array<{
      row: number;
      data: any;
      error: string;
    }>;
    duplicates: Array<{
      row: number;
      data: any;
      staffId: string;
    }>;
  };
}

export interface OfficerFilters {
  search: string;
  department: string;
  division: string;
  branch: string;
  post: string;
  cadre: string;
  status: string;
}

export interface OfficerListResponse {
  officers: Officer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
