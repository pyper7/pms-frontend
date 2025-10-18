export interface Post {
  id: number | string;
  name: string;
  description?: string;
  gradeLevel?: string;
  mdaId?: string; // Optional since API doesn't return this
  mdaName?: string; // Optional since API doesn't return this
  orgUnitId: number | string;
  orgUnitName: string;
  orgUnitType: 'DEPT' | 'DIV' | 'BRANCH';
  status: 'active' | 'inactive';
  isOccupied: boolean;
  assignedOfficerId?: number | string | null;
  assignedOfficerName?: string | null;
  roleId?: number | string; // One-to-one relationship with role
  roleName?: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface PostFormData {
  name: string;
  description?: string;
  gradeLevel?: string;
  mdaId?: string; // Optional since API doesn't require this
  orgUnitId: string;
  status: 'active' | 'inactive';
  roleId?: string; // Changed from roles array to single roleId
}

export interface PostOccupancy {
  id: string;
  postId: string;
  postName: string;
  officerId: string;
  officerName: string;
  officerIppis: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

export interface PostOccupancyFormData {
  postId: string;
  officerId: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface PostFilters {
  search: string;
  mda: string;
  orgUnit: string;
  status: string;
  isOccupied: string;
  gradeLevel: string;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MDA {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
}

export interface OrgUnit {
  id: string;
  name: string;
  type: 'DEPT' | 'DIV' | 'BRANCH';
  mdaId: string;
  parentId?: string;
  status: 'active' | 'inactive';
}

export interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: 'active' | 'inactive';
}
