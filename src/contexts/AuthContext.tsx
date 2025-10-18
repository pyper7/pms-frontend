import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiService } from "../services/api";
import { toast } from "../utils/toast";

export type UserRole = "HR_ADMIN" | "DIRECTOR" | "ASSISTANT_DIRECTOR" | "OFFICER";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
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
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed && parsed.role) setUser(parsed);
      }
    } catch {}
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const loadingToast = toast.loading('Signing you in...', 'Please wait while we authenticate your credentials');
    
    try {
      const response = await apiService.login({ EmailOrStaffId: email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.dismiss(loadingToast);
        toast.success('Welcome back!', `Successfully signed in as ${response.data.user.name}`);
        return { success: true };
      } else {
        toast.dismiss(loadingToast);
        const errorMessage = response.error?.message || 'Invalid credentials. Please check your email and password.';
        toast.error('Login Failed', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      let errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Cannot connect to the server. Please ensure the backend is running and try again.';
        } else if (error.message.includes('Authentication failed')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Validation error')) {
          errorMessage = 'Please check your email and password format and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error('Login Error', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await apiService.logout();
      toast.success('Signed out successfully', 'You have been logged out of your account');
    } catch (error) {
      let errorMessage = 'You have been signed out locally, but there was an issue with the server';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'You have been signed out locally. Server connection was lost.';
        } else if (error.message.includes('Authentication failed')) {
          errorMessage = 'You have been signed out locally. Your session may have expired.';
        } else {
          errorMessage = `You have been signed out locally. ${error.message}`;
        }
      }
      
      toast.warning('Logout Warning', errorMessage);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login,
    logout,
    setRole: (role: UserRole) => {
      setUser(prev => {
        const next = prev ? { ...prev, role } : { 
          id: "1", 
          name: "User", 
          role,
          email: "",
          department: "",
          position: "",
          ippisNo: ""
        };
        try { localStorage.setItem("auth_user", JSON.stringify(next)); } catch {}
        return next;
      });
    },
    updateUser: (partial: Partial<AuthUser>) => {
      setUser(prev => {
        const base = prev ?? { 
          id: "1", 
          name: "User", 
          role: "OFFICER" as UserRole,
          email: "",
          department: "",
          position: "",
          ippisNo: ""
        };
        const next = { ...base, ...partial };
        try { localStorage.setItem("auth_user", JSON.stringify(next)); } catch {}
        return next;
      });
    },
    isLoading,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


