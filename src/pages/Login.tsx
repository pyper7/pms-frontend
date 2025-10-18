import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff, ArrowLeft, Loader2, User, LogIn } from "lucide-react";
import { toast } from "@/utils/toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getRedirectPath = (role: string): string => {
    switch (role) {
      case 'HR_ADMIN':
        return '/dashboard';
      case 'ASSISTANT_DIRECTOR':
        return '/assistant-director-dashboard';
      case 'DIRECTOR':
        return '/director-dashboard';
      case 'OFFICER':
        return '/officer-dashboard';
      default:
        return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Validation Error", "Please enter both your email/staff ID and password");
      return;
    }

    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        // Get user role from localStorage to determine redirect
        const userStr = localStorage.getItem('auth_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const redirectPath = getRedirectPath(user.role);
          navigate(redirectPath);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      // Error handling is already done in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="min-h-screen flex">
        {/* Left side - Branding & Visual */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 dark:from-primary/10 dark:via-primary/20 dark:to-primary/30"></div>
          
        <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-16 w-24 h-24 bg-primary/15 rounded-full blur-2xl"></div>
            <div className="absolute bottom-32 left-32 w-28 h-28 bg-primary/10 rounded-full blur-2xl"></div>
        </div>
        
          <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
            <div className="max-w-lg">
              <div className="mb-8">
                <img 
                  src="/pms/tetfund-logo.jpg" 
                  alt="TETFund" 
                  className="h-16 w-auto object-contain mx-auto mb-6" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/favicon.ico"; }}
                />
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  TETFund PMS
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Performance Management System
                </p>
              </div>
              <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Welcome Back
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Track your performance, achieve your goals, and unlock your potential with our comprehensive performance management platform.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-900 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LogIn className="h-5 w-5 text-white" />
      </div>
          <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Sign In</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Access your account</p>
          </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
          <Link 
            to="/" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-8 group"
          >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
          </Link>

              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Please sign in to your account to continue
              </CardDescription>
            </CardHeader>
            
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email or Staff ID
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or staff ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                          className="h-12 text-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pr-12 text-lg"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                        </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link 
                    to="/forgot-password"
                        className="text-sm text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                        'Sign In'
                  )}
                </Button>
              </form>

                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;