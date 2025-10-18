export enum UserRole {
  HR = 'HR',
  DIRECTOR = 'DIRECTOR',
  OFFICER = 'OFFICER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  post?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Predefined login credentials for different roles
export const LOGIN_CREDENTIALS = {
  HR: {
    email: 'hr@tetfund.gov.ng',
    password: 'hr123',
    user: {
      id: '1',
      email: 'hr@tetfund.gov.ng',
      name: 'HR Admin',
      role: UserRole.HR,
      department: 'Human Resources',
      post: 'HR Administrator',
      isActive: true
    }
  },
  DIRECTOR: {
    email: 'director@tetfund.gov.ng',
    password: 'director123',
    user: {
      id: '2',
      email: 'director@tetfund.gov.ng',
      name: 'Dr. Sarah Johnson',
      role: UserRole.DIRECTOR,
      department: 'Research & Development',
      post: 'Director of Research',
      isActive: true
    }
  },
  OFFICER: {
    email: 'officer@tetfund.gov.ng',
    password: 'officer123',
    user: {
      id: '3',
      email: 'officer@tetfund.gov.ng',
      name: 'John Doe',
      role: UserRole.OFFICER,
      department: 'Research & Development',
      post: 'Research Officer',
      isActive: true
    }
  }
};

export const ROLE_PERMISSIONS = {
  [UserRole.HR]: [
    'manage_officers',
    'manage_posts',
    'post_occupancy',
    'appraisal_settings',
    'kra_management',
    'roles_permissions',
    'view_dashboard',
    'view_reports'
  ],
  [UserRole.DIRECTOR]: [
    'view_dashboard',
    'view_reports',
    'review_appraisals',
    'approve_documents',
    'view_team_performance',
    'manage_team_kras',
  ],
  [UserRole.OFFICER]: [
    'view_dashboard',
    'view_own_profile',
    'submit_appraisals',
    'view_own_performance',
  ]
};

