const API_BASE_URL = 'https://localhost:44366/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

interface LoginRequest {
  EmailOrStaffId: string;
  password: string;
}

// Shape used by the app after normalization
interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: 'HR_ADMIN' | 'DIRECTOR' | 'ASSISTANT_DIRECTOR' | 'OFFICER';
    name: string;
    department: string;
    position: string;
    ippisNo: string;
    phone?: string;
    designation?: string;
    posts?: string[];
    orgUnit?: string;
    cadre?: string;
    gradeLevel?: string;
    lastLoginDate?: string;
  };
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

// Raw backend response shape
interface BackendLoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: number;
      email: string;
      name: string;
      role: string; // e.g. "HR", "DIRECTOR", etc.
      post?: string; // maps to position
      staffId?: string; // maps to ippisNo
      phoneNumber?: string; // maps to phone
      designation?: string;
      posts?: string[];
      orgUnit?: string;
      cadre?: string;
      gradeLevel?: string;
      lastLoginDate?: string;
    };
    token: string;
    refreshToken?: string;
    expiresIn: number;
  };
  errorCode?: string | null;
  errors?: any;
}

interface User {
  id: string;
  email: string;
  role: 'HR_ADMIN' | 'DIRECTOR' | 'ASSISTANT_DIRECTOR' | 'OFFICER';
  name: string;
  department: string;
  position: string;
  ippisNo: string;
  phone?: string;
  designation?: string;
}

// Role management types
export interface Role {
  id: number | string;
  name: string;
  description?: string;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions?: Array<{ id: number | string; name: string; code?: string; description?: string }>;
}

export interface RoleInput {
  name: string;
  description?: string;
}

export interface AssignPermissionsInput {
  permissionIds: Array<number | string>;
}

export interface AssignPermissionsByNameInput {
  permissionNames: Array<string>;
}

// Post Management Interfaces
export interface Post {
  id: string;
  name: string;
  description?: string;
  gradeLevel?: string;
  mdaId: string;
  mdaName: string;
  orgUnitId: string;
  orgUnitName: string;
  orgUnitType: 'DEPT' | 'DIV' | 'BRANCH';
  status: 'active' | 'inactive';
  isOccupied: boolean;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  roleId?: string; // One-to-one relationship with role
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

export interface AssignRoleToPostInput {
  roleId: string;
}

// Import types from other files
import { PostOccupancy as PostOccupancyType, PostOccupancyFormData } from '@/types/post';
import { Officer as OfficerType } from '@/types/officer';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };


    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== '') {
            data = JSON.parse(responseText);
          } else {
            data = { success: false, error: { message: 'Empty response' } };
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          data = { success: false, error: { message: 'Invalid JSON response' } };
        }
      } else {
        data = { success: false, error: { message: 'Invalid response format' } };
      }

      if (!response.ok) {
        // Handle different HTTP status codes with user-friendly messages
        let errorMessage = data.error?.message || 'Request failed';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input and try again.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please check your credentials.';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 422:
            errorMessage = 'Validation error. Please check your input and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            if (data.error?.message) {
              errorMessage = data.error.message;
            } else {
              errorMessage = `Request failed with status ${response.status}`;
            }
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Handle CORS and network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the API is running.');
      }
      
      throw error;
    }
  }

  // KRA/KPI Management
  async listKras(params: {
    workingYearId: string;
    appraisalPeriodId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    q?: string;
  }): Promise<ApiResponse<{ items: any[]; pagination?: any }>> {
    const qp = new URLSearchParams();
    qp.append('workingYearId', params.workingYearId);
    qp.append('appraisalPeriodId', params.appraisalPeriodId);
    if (params.page) qp.append('page', String(params.page));
    if (params.limit) qp.append('limit', String(params.limit));
    if (params.sortBy) qp.append('sortBy', params.sortBy);
    if (params.sortOrder) qp.append('sortOrder', params.sortOrder);
    if (params.q) qp.append('q', params.q);
    const qs = qp.toString();
    return this.request<{ items: any[]; pagination?: any }>(`/kras${qs ? `?${qs}` : ''}`);
  }

  async getKra(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/kras/${id}`);
  }

  async createKra(payload: {
    workingYearId: string;
    appraisalPeriodId: string;
    title: string;
    description?: string;
    weight: number;
    assignedOrgUnits?: Array<{ id: string; type: 'DEPT' | 'DIV' | 'BRANCH' }>
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/kras', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateKra(id: string, payload: Partial<{
    title: string;
    description?: string;
    weight: number;
    assignedOrgUnits?: Array<{ id: string; type: 'DEPT' | 'DIV' | 'BRANCH' }>
  }>): Promise<ApiResponse<any>> {
    return this.request<any>(`/kras/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteKra(id: string, force = false): Promise<ApiResponse<any>> {
    return this.request<any>(`/kras/${id}?force=${force ? 'true' : 'false'}`, { method: 'DELETE' });
  }

  // Objectives
  async createObjective(kraId: string, payload: {
    title: string;
    description?: string;
    weight: number;
    assignedOrgUnits?: Array<{ id: string; type: 'DEPT' | 'DIV' | 'BRANCH' }>;
    assignedWeights?: Array<{ unitId: string; scope: 'DEPT' | 'DIV' | 'BRANCH'; weight: number }>
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/kras/${kraId}/objectives`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async getObjective(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/objectives/${id}`);
  }

  async updateObjective(id: string, payload: Partial<{
    title: string;
    description?: string;
    weight: number;
    assignedOrgUnits?: Array<{ id: string; type: 'DEPT' | 'DIV' | 'BRANCH' }>;
    assignedWeights?: Array<{ unitId: string; scope: 'DEPT' | 'DIV' | 'BRANCH'; weight: number }>
  }>): Promise<ApiResponse<any>> {
    return this.request<any>(`/objectives/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteObjective(id: string, force = false): Promise<ApiResponse<any>> {
    return this.request<any>(`/objectives/${id}?force=${force ? 'true' : 'false'}`, { method: 'DELETE' });
  }

  // KPIs
  async createKpi(objectiveId: string, payload: {
    name: string;
    description?: string;
    weight: number;
    target: number;
    unit: string;
    measurementType: 'Number' | 'Percentage' | 'Amount' | 'Days' | 'Hours' | 'Rating';
    dataSource?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/objectives/${objectiveId}/kpis`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async getKpi(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/kpis/${id}`);
  }

  async updateKpi(id: string, payload: Partial<{
    name: string;
    description?: string;
    weight: number;
    target: number;
    unit: string;
    measurementType: 'Number' | 'Percentage' | 'Amount' | 'Days' | 'Hours' | 'Rating';
    dataSource?: string;
  }>): Promise<ApiResponse<any>> {
    return this.request<any>(`/kpis/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteKpi(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/kpis/${id}`, { method: 'DELETE' });
  }

  // Validation endpoints
  async validateKraWeights(params: { workingYearId: string; appraisalPeriodId: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/kras/validate-weights', { method: 'POST', body: JSON.stringify(params) });
  }

  async validateObjectiveWeights(params: { kraId: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/objectives/validate-weights', { method: 'POST', body: JSON.stringify(params) });
  }

  async validateKpiWeights(params: { objectiveId: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/kpis/validate-weights', { method: 'POST', body: JSON.stringify(params) });
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<BackendLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      const backendUser = response.data.user;

      const normalizedRole = (() => {
        const topLevelRole = (response as any)?.data?.role;
        const roleStr = ((topLevelRole ?? backendUser.role ?? backendUser.post) || '').toUpperCase();
        if (roleStr === 'AGENCY ADMIN' || roleStr === 'HR ADMIN' || roleStr === 'HR') return 'HR_ADMIN';
        if (roleStr === 'ASSISTANT DIRECTOR') return 'ASSISTANT_DIRECTOR';
        if (roleStr === 'DEPUTY DIRECTOR' || roleStr === 'DIRECTOR') return 'DIRECTOR';
        if (roleStr === 'OFFICER' || roleStr === 'STAFF' || roleStr === 'USER') return 'OFFICER';
        return 'OFFICER';
      })() as 'HR_ADMIN' | 'DIRECTOR' | 'ASSISTANT_DIRECTOR' | 'OFFICER';

      const normalizedUser: LoginResponse['user'] = {
        id: String(backendUser.id),
        email: backendUser.email,
        role: normalizedRole,
        name: backendUser.name,
        department: backendUser.orgUnit || '',
        position: backendUser.post || '',
        ippisNo: backendUser.staffId || '',
        phone: backendUser.phoneNumber,
        designation: backendUser.designation,
        posts: backendUser.posts,
        orgUnit: backendUser.orgUnit,
        cadre: backendUser.cadre,
        gradeLevel: backendUser.gradeLevel,
        lastLoginDate: backendUser.lastLoginDate,
      };

      const mapped: ApiResponse<LoginResponse> = {
        success: true,
        data: {
          user: normalizedUser,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        },
      };

      this.token = mapped.data.token;
      localStorage.setItem('auth_token', mapped.data.token);
      if (mapped.data.refreshToken) {
        localStorage.setItem('refresh_token', mapped.data.refreshToken);
      }
      localStorage.setItem('auth_user', JSON.stringify(mapped.data.user));

      return mapped;
    }

    return response as unknown as ApiResponse<LoginResponse>;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    if (response.success) {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<User & {
    orgUnit?: string;
    cadre?: string;
    gradeLevel?: string;
    roles?: string[];
    lastLoginDate?: string;
  }>> {
    type BackendProfile = {
      success: boolean;
      data?: {
        id: number;
        email: string;
        name: string;
        role: string;
        post?: string;
        staffId?: string;
        phoneNumber?: string;
        designation?: string;
        roles?: string[];
        orgUnit?: string;
        cadre?: string;
        gradeLevel?: string;
        lastLoginDate?: string;
      };
    };

    const response = await this.request<BackendProfile>('/auth/profile');

    if (response.success && response.data?.data) {
      const p = response.data.data;
      const normalizedRole = (() => {
        const r = (p.role || p.post || '').toUpperCase();
        if (r === 'HR' || r === 'HR_ADMIN') return 'HR_ADMIN';
        if (r === 'ASSISTANT DIRECTOR' || r === 'DEPUTY DIRECTOR' || r === 'DIRECTOR') return 'DIRECTOR';
        if (r === 'OFFICER' || r === 'STAFF' || r === 'USER') return 'OFFICER';
        return 'OFFICER';
      })() as 'HR_ADMIN' | 'DIRECTOR' | 'ASSISTANT_DIRECTOR' | 'OFFICER';

      const mappedUser: User & {
        orgUnit?: string;
        cadre?: string;
        gradeLevel?: string;
        roles?: string[];
        lastLoginDate?: string;
      } = {
        id: String(p.id),
        email: p.email,
        role: normalizedRole,
        name: p.name,
        department: p.orgUnit || '',
        position: p.post || '',
        ippisNo: p.staffId || '',
        phone: p.phoneNumber,
        designation: p.designation,
        orgUnit: p.orgUnit,
        cadre: p.cadre,
        gradeLevel: p.gradeLevel,
        roles: p.roles,
        lastLoginDate: p.lastLoginDate,
      };

      return { success: true, data: mappedUser };
    }

    return response as unknown as ApiResponse<User>;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ token: string; expiresIn: number }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  // StaffId validation for signup
  async validateStaffId(staffId: string): Promise<ApiResponse<{
    staffId: string;
    name: string;
    email: string;
    department: string;
    position: string;
  }>> {
    return this.request<{
      staffId: string;
      name: string;
      email: string;
      department: string;
      position: string;
    }>('/auth/validate-staff-id', {
      method: 'POST',
      body: JSON.stringify({ staffId }),
    });
  }

  // Signup: Password setup
  async setPassword(staffId: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/auth/set-password`, {
      method: 'POST',
      body: JSON.stringify({ staffId, password })
    });
  }

  // Org structure for signup
  async getDepartments(params?: { q?: string; page?: number; pageSize?: number; sortBy?: string; sortOrder?: string }): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    const qp = new URLSearchParams();
    qp.append('type', 'DEPT');
    if (params?.q) qp.append('q', params.q);
    if (params?.page) qp.append('page', String(params.page));
    if (params?.pageSize) qp.append('pageSize', String(params.pageSize));
    if (params?.sortBy) qp.append('sortBy', params.sortBy);
    if (params?.sortOrder) qp.append('sortOrder', params.sortOrder);
    const qs = qp.toString();
    type BackendUnits = { success: boolean; data?: { units?: Array<{ id: number | string; name: string }> } };
    const res = await this.request<BackendUnits>(`/organizational-units${qs ? `?${qs}` : ''}`);
    if (res.success && (res as any).data?.units) {
      const mapped = (res as any).data.units.map((u: any) => ({ id: String(u.id), name: u.name }));
      return { success: true, data: mapped } as ApiResponse<Array<{ id: string; name: string }>>;
    }
    return res as unknown as ApiResponse<Array<{ id: string; name: string }>>;
  }

  async getDivisions(departmentId: string, params?: { q?: string; page?: number; pageSize?: number; sortBy?: string; sortOrder?: string }): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    const qp = new URLSearchParams();
    qp.append('type', 'DIV');
    qp.append('parentId', departmentId);
    if (params?.q) qp.append('q', params.q);
    if (params?.page) qp.append('page', String(params.page));
    if (params?.pageSize) qp.append('pageSize', String(params.pageSize));
    if (params?.sortBy) qp.append('sortBy', params.sortBy);
    if (params?.sortOrder) qp.append('sortOrder', params.sortOrder);
    const qs = qp.toString();
    type BackendUnits = { success: boolean; data?: { units?: Array<{ id: number | string; name: string }> } };
    const res = await this.request<BackendUnits>(`/organizational-units${qs ? `?${qs}` : ''}`);
    if (res.success && (res as any).data?.units) {
      const mapped = (res as any).data.units.map((u: any) => ({ id: String(u.id), name: u.name }));
      return { success: true, data: mapped } as ApiResponse<Array<{ id: string; name: string }>>;
    }
    return res as unknown as ApiResponse<Array<{ id: string; name: string }>>;
  }

  async getBranches(divisionId: string, params?: { q?: string; page?: number; pageSize?: number; sortBy?: string; sortOrder?: string }): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    const qp = new URLSearchParams();
    qp.append('type', 'BRANCH');
    qp.append('parentId', divisionId);
    if (params?.q) qp.append('q', params.q);
    if (params?.page) qp.append('page', String(params.page));
    if (params?.pageSize) qp.append('pageSize', String(params.pageSize));
    if (params?.sortBy) qp.append('sortBy', params.sortBy);
    if (params?.sortOrder) qp.append('sortOrder', params.sortOrder);
    const qs = qp.toString();
    type BackendUnits = { success: boolean; data?: { units?: Array<{ id: number | string; name: string }> } };
    const res = await this.request<BackendUnits>(`/organizational-units${qs ? `?${qs}` : ''}`);
    if (res.success && (res as any).data?.units) {
      const mapped = (res as any).data.units.map((u: any) => ({ id: String(u.id), name: u.name }));
      return { success: true, data: mapped } as ApiResponse<Array<{ id: string; name: string }>>;
    }
    return res as unknown as ApiResponse<Array<{ id: string; name: string }>>;
  }

  // Posts under a specific organizational unit (DEPT/DIV/BRANCH)
  async getPostsForUnit(unitId: string, params?: { q?: string; page?: number; pageSize?: number }): Promise<ApiResponse<Array<{ id: string; name: string; description?: string; gradeLevel?: string; occupied?: boolean }>>> {
    const qp = new URLSearchParams();
    if (params?.q) qp.append('q', params.q);
    if (params?.page) qp.append('page', String(params.page));
    if (params?.pageSize) qp.append('pageSize', String(params.pageSize));
    const qs = qp.toString();

    type BackendPosts = { success: boolean; data?: any };
    const res = await this.request<BackendPosts>(`/organizational-units/${unitId}/posts${qs ? `?${qs}` : ''}`);
    if (res.success) {
      const raw = (Array.isArray((res as any).data) ? (res as any).data : (res as any).data?.posts || (res as any).data?.items || []) as any[];
      const mapped = raw.map((p: any) => ({
        id: String(p.id ?? p.postId ?? ''),
        name: p.name ?? p.postName ?? '',
        description: p.description ?? p.summary ?? '',
        gradeLevel: p.gradeLevel ?? p.level ?? undefined,
        occupied: typeof p.occupied === 'boolean' ? p.occupied : (typeof p.isOccupied === 'boolean' ? p.isOccupied : false)
      }));
      return { success: true, data: mapped } as ApiResponse<Array<{ id: string; name: string; description?: string; gradeLevel?: string; occupied?: boolean }>>;
    }
    return res as unknown as ApiResponse<Array<{ id: string; name: string; description?: string; gradeLevel?: string; occupied?: boolean }>>;
  }

  // Posts by scope
  async getPostsByScope(params: { departmentId?: string; divisionId?: string; branchId?: string; q?: string; page?: number; pageSize?: number }): Promise<ApiResponse<Array<{ id: string; name: string; description?: string; gradeLevel?: string; occupied?: boolean }>>> {
    const qp = new URLSearchParams();
    if (params.departmentId) qp.append('departmentId', params.departmentId);
    if (params.divisionId) qp.append('divisionId', params.divisionId);
    if (params.branchId) qp.append('branchId', params.branchId);
    if (params.q) qp.append('q', params.q);
    if (params.page) qp.append('page', String(params.page));
    if (params.pageSize) qp.append('pageSize', String(params.pageSize));
    const qs = qp.toString();
    type BackendPosts = {
      success: boolean;
      data?: any;
    };
    const res = await this.request<BackendPosts>(`/org/posts${qs ? `?${qs}` : ''}`);
    if (res.success) {
      // Accept array in data, or data.posts array, or data.items
      const raw = (Array.isArray((res as any).data) ? (res as any).data
                  : (res as any).data?.posts || (res as any).data?.items || []) as any[];
      const mapped = raw.map((p: any) => ({
        id: String(p.id ?? p.postId ?? ''),
        name: p.name ?? p.postName ?? '',
        description: p.description ?? p.summary ?? '',
        gradeLevel: p.gradeLevel ?? p.level ?? undefined,
        occupied: (typeof p.occupied === 'boolean' ? p.occupied : (typeof p.isOccupied === 'boolean' ? p.isOccupied : false))
      }));
      return { success: true, data: mapped } as ApiResponse<Array<{ id: string; name: string; description?: string; gradeLevel?: string; occupied?: boolean }>>;
    }
    return res as unknown as ApiResponse<Array<{ id: string; name: string; description?: string; gradeLevel?: string; occupied?: boolean }>>;
  }

  // Reserve and confirm onboarding
  async reservePost(payload: { staffId: string; postId: string; departmentId: string; divisionId?: string; branchId?: string }): Promise<ApiResponse<{ reservationId: string; expiresAt: string }>> {
    return this.request<{ reservationId: string; expiresAt: string }>(`/posts/check-and-reserve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async confirmOnboarding(payload: { staffId: string; departmentId: string; divisionId?: string; branchId?: string; postId: string; reservationId: string }): Promise<ApiResponse<{ userId: string; assignedPost: { id: string; name: string } }>> {
    return this.request<{ userId: string; assignedPost: { id: string; name: string } }>(`/auth/onboard/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Role Management
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return this.request<Role[]>('/roles', { method: 'GET' });
  }

  async getRole(id: string | number): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}`, { method: 'GET' });
  }

  async createRole(payload: RoleInput): Promise<ApiResponse<Role>> {
    return this.request<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateRole(id: string | number, payload: RoleInput): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteRole(id: string | number): Promise<ApiResponse<null>> {
    return this.request<null>(`/roles/${id}`, { method: 'DELETE' });
  }

  async assignPermissionsToRole(id: string | number, payload: AssignPermissionsInput): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}/permissions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async assignPermissionsToRoleByName(id: string | number, payload: AssignPermissionsByNameInput): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}/permissions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getPermissions(): Promise<ApiResponse<Array<{ id: string; name: string; code?: string; description?: string }>>> {
    return this.request<Array<{ id: string; name: string; code?: string; description?: string }>>('/permissions');
  }

  async getPermissionsGrouped(): Promise<ApiResponse<Record<string, Array<{ id: string; name: string; code?: string; description?: string }>>>> {
    return this.request<Record<string, Array<{ id: string; name: string; code?: string; description?: string }>>>('/permissions/grouped');
  }

  async getPermissionsByModule(module: string): Promise<ApiResponse<Array<{ id: string; name: string; code?: string; description?: string }>>> {
    return this.request<Array<{ id: string; name: string; code?: string; description?: string }>>(`/permissions/module/${module}`);
  }

  async getPermission(id: string): Promise<ApiResponse<{ id: string; name: string; code?: string; description?: string }>> {
    return this.request<{ id: string; name: string; code?: string; description?: string }>(`/permissions/${id}`);
  }

  // Helper method to get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!localStorage.getItem('auth_user');
  }

  // Helper method to get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Post Management methods
  async getPosts(): Promise<ApiResponse<Post[]>> {
    const response = await this.request<{
      posts: any[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
      };
    }>('/posts');
    
    if (response.success && response.data) {
      // Convert API response to match frontend Post interface
      const convertedPosts: Post[] = response.data.posts.map((post: any) => ({
        ...post,
        id: String(post.id),
        orgUnitId: String(post.orgUnitId),
        assignedOfficerId: post.assignedOfficerId ? String(post.assignedOfficerId) : null,
        roleId: post.roleId ? String(post.roleId) : undefined,
        mdaId: post.mdaId || undefined,
        mdaName: post.mdaName || undefined
      }));
      
      return {
        success: true,
        data: convertedPosts
      };
    }
    
    return response as ApiResponse<Post[]>;
  }

  async getPost(id: string): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: PostFormData): Promise<ApiResponse<Post>> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: Partial<PostFormData>): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id: string): Promise<ApiResponse> {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async assignRoleToPost(postId: string, roleData: AssignRoleToPostInput): Promise<ApiResponse> {
    return this.request(`/posts/${postId}/role`, {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async removeRoleFromPost(postId: string): Promise<ApiResponse> {
    return this.request(`/posts/${postId}/role`, {
      method: 'DELETE',
    });
  }

  // Post Occupancy methods
  async getPostOccupancies(): Promise<ApiResponse<PostOccupancyType[]>> {
    const response = await this.request<{
      occupancies: any[]; // Use any[] for raw response to allow flexible mapping
      pagination: { /* ... */ };
    }>('/post-occupancies');

    if (response.success && response.data) {
      const convertedOccupancies: PostOccupancyType[] = response.data.occupancies.map((occupancy: any) => ({
        ...occupancy,
        id: String(occupancy.id),
        postId: String(occupancy.postId || ''),
        officerId: String(occupancy.officerId),
        officerIppis: occupancy.staffId || occupancy.officerIppis || '',
        startDate: occupancy.startDate,
        endDate: occupancy.endDate,
        isActive: occupancy.isActive,
        notes: occupancy.notes,
        postName: occupancy.postName,
        officerName: occupancy.officerName,
        dateCreated: occupancy.dateCreated,
        lastUpdated: occupancy.lastUpdated
      }));
      return { success: true, data: convertedOccupancies };
    }
    return response as ApiResponse<PostOccupancyType[]>;
  }

  async getPostOccupancy(id: string): Promise<ApiResponse<PostOccupancyType>> {
    return this.request<PostOccupancyType>(`/post-occupancies/${id}`);
  }

  async createPostOccupancy(occupancyData: PostOccupancyFormData): Promise<ApiResponse<PostOccupancyType>> {
    return this.request<PostOccupancyType>('/post-occupancies', {
      method: 'POST',
      body: JSON.stringify(occupancyData),
    });
  }

  async updatePostOccupancy(id: string, occupancyData: Partial<PostOccupancyFormData>): Promise<ApiResponse<PostOccupancyType>> {
    return this.request<PostOccupancyType>(`/post-occupancies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(occupancyData),
    });
  }

  async deletePostOccupancy(id: string): Promise<ApiResponse> {
    return this.request(`/post-occupancies/${id}`, {
      method: 'DELETE',
    });
  }

  async endPostOccupancy(id: string, endData: { endDate: string; notes?: string }): Promise<ApiResponse<PostOccupancyType>> {
    return this.request<PostOccupancyType>(`/post-occupancies/${id}/end`, {
      method: 'PUT',
      body: JSON.stringify(endData),
    });
  }

  async getPostOccupancyStatistics(params?: {
    mdaId?: string;
    postId?: string;
    officerId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/post-occupancies/statistics${queryString ? `?${queryString}` : ''}`);
  }

  async exportPostOccupancies(params?: {
    format?: string;
    mdaId?: string;
    postId?: string;
    officerId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/post-occupancies/export${queryString ? `?${queryString}` : ''}`);
  }

  async bulkCreatePostOccupancies(occupancies: PostOccupancyFormData[]): Promise<ApiResponse<any>> {
    return this.request('/post-occupancies/bulk', {
      method: 'POST',
      body: JSON.stringify({ occupancies }),
    });
  }

  async getPostOccupancyHistory(postId: string): Promise<ApiResponse<PostOccupancyType[]>> {
    return this.request<PostOccupancyType[]>(`/posts/${postId}/occupancy-history`);
  }

  // Officer methods
  async getOfficers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    gradeLevel?: string;
    status?: string;
    position?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<OfficerType[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    const response = await this.request<{
      officers: any[]; // Use any[] for raw response to allow flexible mapping
      pagination: { total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrevious: boolean };
    }>(`/officers${queryString ? `?${queryString}` : ''}`);

    if (response.success && response.data) {
      const convertedOfficers: OfficerType[] = response.data.officers.map((officer: any) => {
        const converted = {
          id: String(officer.id),
          ippis: officer.staffId || officer.ippis || '',
          firstName: officer.firstName || '',
          lastName: officer.lastName || '',
          email: officer.email || '',
          phone: officer.phoneNumber || officer.phone,
          department: officer.department || '',
          division: officer.division || '',
          branch: officer.branch || '',
          post: officer.currentPost?.name || officer.position || officer.post || '',
          cadre: officer.cadre || '',
          status: officer.status || 'active',
          dateCreated: officer.dateCreated || new Date().toISOString(),
          lastLogin: officer.lastLogin || officer.lastLoginDate
        };
          return converted;
      });
      return { success: true, data: convertedOfficers };
    }
    return response as ApiResponse<OfficerType[]>;
  }

  async getOfficer(id: string): Promise<ApiResponse<OfficerType>> {
    return this.request<OfficerType>(`/officers/${id}`);
  }

  async createOfficer(officerData: {
    staffId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    department?: string;
    position?: string;
    gradeLevel?: string;
    dateOfBirth?: string;
    dateOfEmployment?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  }): Promise<ApiResponse<OfficerType>> {
    return this.request<OfficerType>('/officers', {
      method: 'POST',
      body: JSON.stringify(officerData)
    });
  }

  async updateOfficer(id: string, officerData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    department?: string;
    position?: string;
    gradeLevel?: string;
    dateOfBirth?: string;
    dateOfEmployment?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  }): Promise<ApiResponse<OfficerType>> {
    return this.request<OfficerType>(`/officers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(officerData)
    });
  }

  async deleteOfficer(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/officers/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleOfficerStatus(id: string): Promise<ApiResponse<OfficerType>> {
    return this.request<OfficerType>(`/officers/${id}/toggle-status`, {
      method: 'PATCH'
    });
  }

  async resetOfficerPassword(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/officers/${id}/reset-password`, {
      method: 'POST'
    });
  }

  async resendOfficerCredentials(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/officers/${id}/resend-credentials`, {
      method: 'POST'
    });
  }

  async getOfficerStatistics(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    newThisMonth: number;
    byDepartment: { [key: string]: number };
    byGradeLevel: { [key: string]: number };
  }>> {
    const response = await this.request<{
      totalOfficers: number;
      activeOfficers: number;
      inactiveOfficers: number;
      byDepartment: Record<string, number>;
      byGradeLevel: Record<string, number>;
      byStatus: Record<string, number>;
      averageAge: number;
      averageYearsOfService: number;
      newHiresThisYear: number;
      retirementsThisYear: number;
    }>('/officers/statistics');

    if (response.success && response.data) {
      // Map the API response to our expected format
      const mappedData = {
        total: response.data.totalOfficers,
        active: response.data.activeOfficers,
        inactive: response.data.inactiveOfficers,
        suspended: response.data.byStatus?.suspended || 0,
        newThisMonth: response.data.newHiresThisYear, // Using newHiresThisYear as closest match
        byDepartment: response.data.byDepartment || {},
        byGradeLevel: response.data.byGradeLevel || {}
      };
      return { success: true, data: mappedData };
    }
    return response as ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      suspended: number;
      newThisMonth: number;
      byDepartment: { [key: string]: number };
      byGradeLevel: { [key: string]: number };
    }>;
  }

  async exportOfficers(format: 'excel' | 'csv' | 'pdf' = 'excel'): Promise<ApiResponse<Blob>> {
    return this.request<Blob>(`/officers/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Accept': format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
                 format === 'csv' ? 'text/csv' : 'application/pdf'
      }
    });
  }


  async bulkCreateOfficers(file: File): Promise<ApiResponse<{
    success: number;
    errors: number;
    duplicates: number;
    invalid: number;
    details: {
      successful: any[];
      errors: Array<{ row: number; data: any; error: string }>;
      duplicates: Array<{ row: number; data: any; staffId: string }>;
    };
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/officers/bulk', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async bulkUpdateOfficers(updates: Array<{
    id: string;
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      department?: string;
      position?: string;
      gradeLevel?: string;
      status?: string;
    };
  }>): Promise<ApiResponse<{
    success: number;
    errors: number;
    details: {
      successful: any[];
      errors: Array<{ id: string; error: string }>;
    };
  }>> {
    return this.request('/officers/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ updates })
    });
  }

  async bulkDeleteOfficers(ids: string[]): Promise<ApiResponse<{
    success: number;
    errors: number;
    details: {
      successful: string[];
      errors: Array<{ id: string; error: string }>;
    };
  }>> {
    return this.request('/officers/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids })
    });
  }

  // Officer Qualifications
  async getOfficerQualifications(officerId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/officers/${officerId}/qualifications`);
  }

  async addOfficerQualification(officerId: string, qualification: {
    institution: string;
    degree: string;
    field: string;
    year: string;
    grade?: string;
    certificateNumber?: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/officers/${officerId}/qualifications`, {
      method: 'POST',
      body: JSON.stringify(qualification)
    });
  }

  async updateOfficerQualification(officerId: string, qualificationId: string, qualification: {
    institution?: string;
    degree?: string;
    field?: string;
    year?: string;
    grade?: string;
    certificateNumber?: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/officers/${officerId}/qualifications/${qualificationId}`, {
      method: 'PUT',
      body: JSON.stringify(qualification)
    });
  }

  async deleteOfficerQualification(officerId: string, qualificationId: string): Promise<ApiResponse<void>> {
    return this.request(`/officers/${officerId}/qualifications/${qualificationId}`, {
      method: 'DELETE'
    });
  }

  // Officer Work History
  async getOfficerWorkHistory(officerId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/officers/${officerId}/work-history`);
  }

  async addOfficerWorkHistory(officerId: string, workHistory: {
    organization: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrent?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request(`/officers/${officerId}/work-history`, {
      method: 'POST',
      body: JSON.stringify(workHistory)
    });
  }

  async updateOfficerWorkHistory(officerId: string, workHistoryId: string, workHistory: {
    organization?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    isCurrent?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request(`/officers/${officerId}/work-history/${workHistoryId}`, {
      method: 'PUT',
      body: JSON.stringify(workHistory)
    });
  }

  async deleteOfficerWorkHistory(officerId: string, workHistoryId: string): Promise<ApiResponse<void>> {
    return this.request(`/officers/${officerId}/work-history/${workHistoryId}`, {
      method: 'DELETE'
    });
  }

  // Organizational Unit methods
  async getOrganizationalUnits(params?: {
    search?: string;
    type?: string;
    parentId?: string;
    mdaId?: string;
    status?: string;
    level?: number;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/organizational-units${queryString ? `?${queryString}` : ''}`);
  }

  async getOrganizationalUnit(id: string): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}`);
  }

  async createOrganizationalUnit(unitData: {
    name: string;
    type: string;
    description?: string;
    parentId?: string;
    mdaId: string;
    order?: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/organizational-units', {
      method: 'POST',
      body: JSON.stringify(unitData),
    });
  }

  async updateOrganizationalUnit(id: string, unitData: {
    name?: string;
    description?: string;
    order?: number;
  }): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(unitData),
    });
  }

  async deleteOrganizationalUnit(id: string, force?: boolean): Promise<ApiResponse<any>> {
    const queryParams = force ? '?force=true' : '';
    return this.request(`/organizational-units/${id}${queryParams}`, {
      method: 'DELETE',
    });
  }

  async getOrganizationalTree(params?: {
    mdaId?: string;
    includeInactive?: boolean;
    maxDepth?: number;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/organizational-units/tree${queryString ? `?${queryString}` : ''}`);
  }

  async getUnitChildren(id: string): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}/children`);
  }

  async moveOrganizationalUnit(id: string, moveData: {
    newParentId: string;
    newOrder: number;
  }): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}/move`, {
      method: 'PUT',
      body: JSON.stringify(moveData),
    });
  }

  async assignHeadOfUnit(id: string, headData: {
    staffId: string;
    position: string;
    effectiveDate: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}/head`, {
      method: 'POST',
      body: JSON.stringify(headData),
    });
  }

  async removeHeadOfUnit(id: string, removeData: {
    effectiveDate: string;
    reason?: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}/head`, {
      method: 'DELETE',
      body: JSON.stringify(removeData),
    });
  }

  async getHeadOfUnitHistory(id: string): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}/head/history`);
  }

  async getOrganizationalUnitStatistics(params?: {
    mdaId?: string;
    type?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/organizational-units/statistics${queryString ? `?${queryString}` : ''}`);
  }

  async getUnitMetrics(id: string): Promise<ApiResponse<any>> {
    return this.request(`/organizational-units/${id}/metrics`);
  }

  async bulkCreateOrganizationalUnits(units: any[]): Promise<ApiResponse<any>> {
    return this.request('/organizational-units/bulk', {
      method: 'POST',
      body: JSON.stringify({ units }),
    });
  }

  async bulkUpdateOrganizationalUnits(updates: any[]): Promise<ApiResponse<any>> {
    return this.request('/organizational-units/bulk', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  async exportOrganizationalUnits(params: {
    format: string;
    mdaId?: string;
    type?: string;
    includeInactive?: boolean;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return this.request(`/organizational-units/export?${queryString}`);
  }

  async exportOrganizationalTree(params: {
    format: string;
    mdaId?: string;
    maxDepth?: number;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return this.request(`/organizational-units/tree/export?${queryString}`);
  }

  async validateOrganizationalUnit(unitData: {
    name: string;
    type: string;
    parentId?: string;
    mdaId: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/organizational-units/validate', {
      method: 'POST',
      body: JSON.stringify(unitData),
    });
  }

  async checkUnitNameAvailability(params: {
    name: string;
    parentId?: string;
    excludeId?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return this.request(`/organizational-units/check-name?${queryString}`);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
