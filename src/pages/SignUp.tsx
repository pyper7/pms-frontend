import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff, ArrowLeft, CheckCircle, Mail, User, ArrowRight, Building2, Network, Target, Search } from "lucide-react";
import { toast } from "@/utils/toast";
import { apiService } from "@/services/api";

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: StaffId validation, 2: Password setup, 3: Department selection, 4: Division selection, 5: Branch selection, 6: Post selection, 7: Review, 8: Success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    staffId: "",
    name: "",
    email: "",
    department: "",
    position: "",
    password: "",
    confirmPassword: "",
    organizationId: "",
    organizationName: "",
    departmentId: "",
    departmentName: "",
    divisionId: "",
    divisionName: "",
    branchId: "",
    branchName: "",
    
    postId: "",
    postName: "",
    // Post requirements to determine which steps to show
    postRequiresDivision: false,
    postRequiresBranch: false,
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingOrg, setLoadingOrg] = useState<{depts?: boolean; divs?: boolean; brs?: boolean; posts?: boolean}>({});
  const [reservationId, setReservationId] = useState<string>('');
  const [postSearchTerm, setPostSearchTerm] = useState('');

  // Available posts loaded from backend
  const availablePosts = posts;

  // Filter posts based on search term within available posts
  const filteredPosts = availablePosts.filter(post =>
    post.name.toLowerCase().includes(postSearchTerm.toLowerCase()) ||
    (post.description || '').toLowerCase().includes(postSearchTerm.toLowerCase()) ||
    (post.gradeLevel || '').toLowerCase().includes(postSearchTerm.toLowerCase())
  );

  // Validate StaffId format
  const validateStaffIdFormat = (staffId: string) => {
    if (!/^[A-Za-z0-9]{6,10}$/.test(staffId)) {
      return { isValid: false, message: "StaffId must be 6-10 alphanumeric characters" };
    }
    return { isValid: true, message: "" };
  };

  // Validate email format
  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    return { isValid: true, message: "" };
  };

  // Validate password strength
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    return { isValid: true, message: "" };
  };

  // Ensure divisions are loaded when user reaches Step 4 and a department is already selected
  useEffect(() => {
    const loadDivisionsIfNeeded = async () => {
      if (step === 4 && formData.departmentId && divisions.length === 0 && !loadingOrg.divs) {
        try {
          setLoadingOrg(prev => ({ ...prev, divs: true }));
          const res = await apiService.getDivisions(formData.departmentId);
          if (res.success && Array.isArray(res.data)) setDivisions(res.data);
        } finally {
          setLoadingOrg(prev => ({ ...prev, divs: false }));
        }
      }
    };
    loadDivisionsIfNeeded();
  }, [step, formData.departmentId]);

  // Ensure branches are loaded when user reaches Step 5 and a division is selected
  useEffect(() => {
    const loadBranchesIfNeeded = async () => {
      if (step === 5 && formData.divisionId && branches.length === 0 && !loadingOrg.brs) {
        try {
          setLoadingOrg(prev => ({ ...prev, brs: true }));
          const res = await apiService.getBranches(formData.divisionId);
          if (res.success && Array.isArray(res.data)) setBranches(res.data);
        } finally {
          setLoadingOrg(prev => ({ ...prev, brs: false }));
        }
      }
    };
    loadBranchesIfNeeded();
  }, [step, formData.divisionId]);

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Verify Your Identity";
      case 2: return "Set Your Password";
      case 3: return "Select Your Department";
      case 4: return "Select Division (if applicable)";
      case 5: return "Select Branch (if applicable)";
      case 6: return "Select Your Post/Designation";
      case 7: return "Review & Confirm";
      case 8: return "Welcome to TETFund PMS!";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Enter your StaffId to verify your identity and begin the registration process.";
      case 2: return "Create a secure password for your account. Make sure it's strong and memorable.";
      case 3: return "Select your Department from the dropdown list. This is mandatory - every staff belongs to a Department.";
      case 4: return "If your post is at Division level, select a Division under your Department. Otherwise, this step will be skipped.";
      case 5: return "If your post is at Branch level, select a Branch under your Division. Otherwise, this step will be skipped.";
      case 6: return "Select your specific Post/Designation from the available posts in your organizational hierarchy.";
      case 7: return "Review your organizational assignment and confirm your profile setup before submission.";
      case 8: return "Your account has been successfully created!";
      default: return "";
    }
  };

  const handleStaffIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate StaffId format
    const formatValidation = validateStaffIdFormat(formData.staffId);
    if (!formatValidation.isValid) {
      setValidationError(formatValidation.message);
      toast.error("Validation Error", formatValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.validateStaffId(formData.staffId);
    
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
          department: response.data.department,
          position: response.data.position
        }));
        setStep(2);
        toast.success("Identity Verified", `Welcome, ${response.data.name}!`);
      } else {
        toast.error("Validation Failed", "Invalid StaffId or user already registered");
      }
    } catch (error: any) {
      console.error('StaffId validation error:', error);
      toast.error("Network Error", "Unable to verify StaffId. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setValidationError(passwordValidation.message);
      toast.error("Password Error", passwordValidation.message);
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      toast.error("Password Error", "Passwords do not match");
      return;
    }

    // First, set password for this StaffId
    try {
      setIsLoading(true);
      const setPwdRes = await apiService.setPassword(formData.staffId, formData.password);
      if (!setPwdRes.success) {
        throw new Error(setPwdRes.error?.message || 'Failed to set password');
      }
      toast.success('Password Set', 'Your password has been successfully set!');

      // Load departments from backend before moving on
      try {
        setLoadingOrg(prev => ({ ...prev, depts: true }));
        const res = await apiService.getDepartments();
        if (res.success && Array.isArray(res.data)) setDepartments(res.data);
      } finally {
        setLoadingOrg(prev => ({ ...prev, depts: false }));
      }
      setStep(3);
    } catch (err: any) {
      toast.error('Password Error', err?.message || 'Unable to set password');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepartmentSelect = async (deptId: string, deptName: string) => {
    setFormData(prev => ({
      ...prev,
      departmentId: deptId,
      departmentName: deptName,
      // Clear all sub-levels when department changes
      divisionId: '',
      divisionName: '',
      branchId: '',
      branchName: '',
      postId: '',
      postName: ''
    }));
    setReservationId('');
    // Reset post search term when scope changes
    setPostSearchTerm('');
    // Load divisions and department-scope posts, then decide next step based on fresh posts
    try {
      setLoadingOrg(prev => ({ ...prev, divs: true, posts: true }));
      const [divRes, postRes] = await Promise.all([
        apiService.getDivisions(deptId),
        apiService.getPostsForUnit(deptId)
      ]);
      if (divRes.success && Array.isArray(divRes.data)) setDivisions(divRes.data);
      const newPosts = (postRes.success && Array.isArray(postRes.data)) ? postRes.data : [];
      setPosts(newPosts);
      if (newPosts.length > 0) {
        setStep(6);
        toast.success("Department Selected", `Selected ${deptName} - Posts available directly under department`);
      } else {
        setStep(4);
        toast.success("Department Selected", `Selected ${deptName} - Checking division requirements`);
      }
    } finally {
      setLoadingOrg(prev => ({ ...prev, divs: false, posts: false }));
    }
  };

  const handleDivisionSelect = async (divId: string, divName: string) => {
    setFormData(prev => ({
      ...prev,
      divisionId: divId,
      divisionName: divName,
      // Clear sub-levels when division changes
      branchId: '',
      branchName: '',
      postId: '',
      postName: ''
    }));
    setReservationId('');
    // Reset post search term when scope changes
    setPostSearchTerm('');
    // Load branches and division-scope posts
    try {
      setLoadingOrg(prev => ({ ...prev, brs: true, posts: true }));
      const [brRes, postRes] = await Promise.all([
        apiService.getBranches(divId),
        apiService.getPostsForUnit(divId)
      ]);
      if (brRes.success && Array.isArray(brRes.data)) setBranches(brRes.data);
      if (postRes.success && Array.isArray(postRes.data)) setPosts(postRes.data);
    } finally {
      setLoadingOrg(prev => ({ ...prev, brs: false, posts: false }));
    }
    
    if (posts.length > 0 || availablePosts.length > 0) {
      // Posts exist directly under division, go to post selection (Step 6)
      setStep(6);
      toast.success("Division Selected", `Selected ${divName} - Posts available directly under division`);
    } else {
      // Need to check branch level
      setStep(5);
      toast.success("Division Selected", `Selected ${divName} - Checking branch requirements`);
    }
  };

  const handleBranchSelect = async (branchId: string, branchName: string) => {
    setFormData(prev => ({
      ...prev,
      branchId: branchId,
      branchName: branchName,
      // Clear sub-levels when branch changes
      postId: '',
      postName: ''
    }));
    setReservationId('');
    // Reset post search term when scope changes
    setPostSearchTerm('');
    // Load branch-scope posts
    try {
      setLoadingOrg(prev => ({ ...prev, posts: true }));
      const postRes = await apiService.getPostsForUnit(branchId);
      if (postRes.success && Array.isArray(postRes.data)) setPosts(postRes.data);
    } finally {
      setLoadingOrg(prev => ({ ...prev, posts: false }));
    }
    
    if (posts.length > 0 || availablePosts.length > 0) {
      // Posts exist directly under branch, skip to post selection
      setStep(6);
      toast.success("Branch Selected", `Selected ${branchName} - Posts available directly under branch`);
    } else {
      // No posts under branch; still proceed to post selection with empty set
      setStep(6);
      toast.success("Branch Selected", `Selected ${branchName} - Proceeding to post selection`);
    }
  };

  // Section selection removed as Branch is the last stage

  const handleDivisionBranchSelect = async (unitId: string, unitName: string, type: 'division' | 'branch') => {
    const updates: any = {};
    if (type === 'division') {
      updates.divisionId = unitId;
      updates.divisionName = unitName;
      // Clear branch selection when division changes
      updates.branchId = '';
      updates.branchName = '';
    } else if (type === 'branch') {
      updates.branchId = unitId;
      updates.branchName = unitName;
    }
    
    setFormData(prev => ({ ...prev, ...updates }));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} Selected`, `Selected ${unitName}`);
  };

  const handlePostSelect = async (postId: string, postName: string) => {
    try {
      setIsLoading(true);
      // Reserve the post to avoid race conditions
      const reserveRes = await apiService.reservePost({
        staffId: formData.staffId,
        postId,
        departmentId: formData.departmentId,
        ...(formData.divisionId ? { divisionId: formData.divisionId } : {}),
        ...(formData.branchId ? { branchId: formData.branchId } : {}),
      });
      if (!reserveRes.success || !reserveRes.data?.reservationId) {
        throw new Error(reserveRes.error?.message || 'Unable to reserve post');
      }
      setReservationId(reserveRes.data.reservationId);
      setFormData(prev => ({ 
        ...prev, 
        postId: postId, 
        postName: postName 
      }));
      setPostSearchTerm('');
      setStep(7);
      toast.success("Post Reserved", `Reserved ${postName} - Review and confirm`);
    } catch (e: any) {
      toast.error('Reservation Failed', e?.message || 'Unable to reserve the selected post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async () => {
    try {
      setIsLoading(true);
      const confirmRes = await apiService.confirmOnboarding({
        staffId: formData.staffId,
        departmentId: formData.departmentId,
        divisionId: formData.divisionId || undefined,
        branchId: formData.branchId || undefined,
        postId: formData.postId,
        reservationId: reservationId,
      });
      if (!confirmRes.success) {
        throw new Error(confirmRes.error?.message || 'Unable to complete onboarding');
      }
      setStep(8);
      toast.success("Registration Complete", "Your account has been successfully created!");
    } catch (e: any) {
      toast.error('Confirmation Failed', e?.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Success page (after confirmation)
  if (step === 8) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="min-h-screen flex">
          {/* Left side - Success Visual */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
              <div className="max-w-lg">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Account Created!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Welcome to TETFund Performance Management System. Your account is ready to use.
              </p>
            </div>
          </div>
        </div>

          {/* Right side - Success Details */}
          <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-900 min-h-screen">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
            <img 
              src="/pms/tetfund-logo.jpg" 
              alt="TETFund" 
                  className="h-8 w-auto object-contain" 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/favicon.ico"; }}
            />
            <div>
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">TETFund PMS</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Account Onboarded Successfully</p>
            </div>
            </div>
              <ThemeToggle />
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-md">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                      Welcome {formData.name}!
                  </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Your account has been successfully onboarded.
                  </CardDescription>
                </CardHeader>
                
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Your account is ready. Proceed to login to access your dashboard.
                    </p>
                  </div>

                  <Link to="/login">
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg">
                      Go to Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="min-h-screen flex">
            {/* Left side - Branding & Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 dark:from-primary/10 dark:via-primary/20 dark:to-primary/30">
              </div>
              
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
                    </div>
                  <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Welcome to Excellence
                </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Streamline your performance management with our comprehensive platform designed for organizational excellence and professional growth.
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
                    <User className="h-5 w-5 text-white" />
              </div>
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Account Setup</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Complete your registration</p>
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
                            <span className="text-lg font-semibold text-primary">{step}</span>
                          </div>
                          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{getStepTitle()}</CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">{getStepDescription()}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                        {/* Step Indicator */}
                          <div className="flex items-center justify-center space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNumber) => (
                              <div key={stepNumber} className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                                  step >= stepNumber 
                                    ? 'bg-primary text-white' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}>
                                  {stepNumber}
                                </div>
                                {stepNumber < 8 && (
                                  <div className={`w-6 h-0.5 mx-1 transition-all duration-200 ${
                                    step > stepNumber ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                                  }`} />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Step 1: StaffId Validation */}
                        {step === 1 && (
                            <div className="space-y-6">
                              <form onSubmit={handleStaffIdSubmit} className="space-y-6">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="staffId" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    StaffId
                            </Label>
                            <Input
                                    id="staffId"
                              type="text"
                                    value={formData.staffId}
                                    onChange={(e) => {
                                      setFormData(prev => ({ ...prev, staffId: e.target.value }));
                                      setValidationError("");
                                    }}
                                    placeholder="Enter your StaffId"
                                    className={`h-12 text-lg ${validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={isLoading}
                                  />
                                  {validationError && (
                                    <p className="text-sm text-red-600 mt-1">{validationError}</p>
                                  )}
                                </div>
                          </div>
                          
                            <Button 
                              type="submit" 
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg"
                                disabled={!formData.staffId || isLoading}
                            >
                                {isLoading ? "Verifying..." : "Verify Identity"}
                            </Button>
                          </form>

                            <div className="text-center">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link 
                                  to="/login" 
                                  className="text-primary hover:underline font-medium transition-colors"
                                >
                                  Sign in
                                </Link>
                              </p>
                            </div>
                            </div>
                          )}

                          {/* Step 2: Password Setup */}
                        {step === 2 && (
                            <div className="space-y-6">
                              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Password
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id="password"
                                      type={showPassword ? "text" : "password"}
                                      value={formData.password}
                                      onChange={(e) => {
                                        setFormData(prev => ({ ...prev, password: e.target.value }));
                                        setValidationError("");
                                      }}
                                      placeholder="Create a strong password"
                                      className={`h-12 text-lg pr-10 ${validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
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
                        
                                <div>
                                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Confirm Password
                          </Label>
                                  <div className="relative">
                          <Input
                                      id="confirmPassword"
                                      type={showConfirmPassword ? "text" : "password"}
                                      value={formData.confirmPassword}
                                      onChange={(e) => {
                                        setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                                        setValidationError("");
                                      }}
                                      placeholder="Confirm your password"
                                      className={`h-12 text-lg pr-10 ${validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                          </div>
                        </div>
                        
                                {validationError && (
                                  <p className="text-sm text-red-600">{validationError}</p>
                                )}
                            </div>

                            <div className="flex space-x-3">
                              <Button 
                                type="button"
                                variant="outline"
                                onClick={goBack}
                                  className="flex-1 h-12"
                              >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                              </Button>
                              <Button 
                                type="submit" 
                                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                              >
                                Continue
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </form>

                            <div className="text-center">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link 
                                  to="/login" 
                                  className="text-primary hover:underline font-medium transition-colors"
                                >
                                  Sign in
                                </Link>
                              </p>
                            </div>
                            </div>
                          )}

                          {/* Step 3: Department Selection */}
                        {step === 3 && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Select Your Department
                              </Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Select your Department from the dropdown list. This is mandatory - every staff belongs to a Department.
                                </p>
                                
                                <select
                                  value={formData.departmentId}
                                  onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    const deptName = selectedOption.text;
                                    handleDepartmentSelect(e.target.value, deptName);
                                  }}
                                  className="w-full h-12 px-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                  <option value="">Select your department...</option>
                                  {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </option>
                                  ))}
                                </select>
                                {loadingOrg.depts && <p className="text-sm text-slate-500">Loading departments...</p>}
                                
                                {formData.departmentId && (
                                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <Building2 className="h-5 w-5 text-primary" />
                                      <div>
                                        <p className="text-sm font-medium text-primary">Selected Department</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{formData.departmentName}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                        </div>
                        
                            <div className="flex space-x-3">
                              <Button 
                                type="button"
                                variant="outline"
                                onClick={goBack}
                                  className="flex-1 h-12"
                              >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                              </Button>
                              <Button 
                                  type="button"
                                  onClick={() => setStep(4)}
                                  disabled={!formData.departmentId}
                                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
                                >
                                  Continue
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Already have an account?{" "}
                                  <Link 
                                    to="/login" 
                                    className="text-primary hover:underline font-medium transition-colors"
                                  >
                                    Sign in
                                  </Link>
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Step 4: Division Selection */}
                        {step === 4 && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Select Division (if applicable)
                              </Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  If your post is at Division level, select a Division under your Department. Otherwise, this step will be skipped.
                                </p>
                                
                                <select
                                  value={formData.divisionId}
                                  onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    const divName = selectedOption.text;
                                    handleDivisionSelect(e.target.value, divName);
                                  }}
                                  className="w-full h-12 px-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                  <option value="">Select division (if applicable)...</option>
                                  {divisions.map((div) => (
                                    <option key={div.id} value={div.id}>
                                      {div.name}
                                    </option>
                                  ))}
                                </select>
                                {loadingOrg.divs && <p className="text-sm text-slate-500">Loading divisions...</p>}
                                
                                {formData.divisionId && (
                                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <Network className="h-5 w-5 text-primary" />
                                      <div>
                                        <p className="text-sm font-medium text-primary">Selected Division</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{formData.divisionName}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-3">
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={goBack}
                                  className="flex-1 h-12"
                                >
                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                  Back
                                </Button>
                                <Button 
                                  type="button"
                                  onClick={() => setStep(5)}
                                  disabled={!formData.divisionId}
                                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
                                >
                                  Continue
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Already have an account?{" "}
                                  <Link 
                                    to="/login" 
                                    className="text-primary hover:underline font-medium transition-colors"
                                  >
                                    Sign in
                                  </Link>
                              </p>
                            </div>
                            </div>
                          )}

                          {/* Step 5: Branch Selection */}
                          {step === 5 && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Select Branch (if applicable)
                              </Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  If your post is at Branch level, select a Branch under your Division. Otherwise, this step will be skipped.
                                </p>
                                
                                <select
                                  value={formData.branchId}
                                  onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    const branchName = selectedOption.text;
                                    handleBranchSelect(e.target.value, branchName);
                                  }}
                                  className="w-full h-12 px-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                  <option value="">Select branch (if applicable)...</option>
                                  {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                      {branch.name}
                                    </option>
                                  ))}
                                </select>
                                {loadingOrg.brs && <p className="text-sm text-slate-500">Loading branches...</p>}
                                
                                {formData.branchId && (
                                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <Target className="h-5 w-5 text-primary" />
                                      <div>
                                        <p className="text-sm font-medium text-primary">Selected Branch</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{formData.branchName}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-3">
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={goBack}
                                  className="flex-1 h-12"
                                >
                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                  Back
                                </Button>
                                <Button 
                                  type="button"
                                  onClick={() => setStep(6)}
                                  disabled={!formData.branchId}
                                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
                                >
                                  Continue
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Already have an account?{" "}
                                  <Link 
                                    to="/login" 
                                    className="text-primary hover:underline font-medium transition-colors"
                                  >
                                    Sign in
                                  </Link>
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Step 6: Post Selection */}
                          {step === 6 && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                {/* Context: current selection and quick change CTA */}
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between">
                                  <div className="text-sm text-slate-700 dark:text-slate-300">
                                    {formData.branchId ? (
                                      <>
                                        Viewing posts in <span className="font-medium">Branch</span>: {formData.branchName}
                                      </>
                                    ) : formData.divisionId ? (
                                      <>
                                        Viewing posts in <span className="font-medium">Division</span>: {formData.divisionName}
                                      </>
                                    ) : (
                                      <>
                                        Viewing posts in <span className="font-medium">Department</span>: {formData.departmentName}
                                      </>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    {formData.branchId && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(5)}
                                        className="h-9"
                                      >
                                        Change Branch
                                      </Button>
                                    )}
                                    {!formData.branchId && formData.divisionId && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(5)}
                                        className="h-9"
                                      >
                                        Select Branch
                                      </Button>
                                    )}
                                    {!formData.divisionId && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(4)}
                                        className="h-9"
                                      >
                                        Select Division
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Select Your Post/Position
                                </Label>
                                
                              <div className="relative">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="Search for a post/position..."
                                      value={postSearchTerm}
                                      onChange={(e) => setPostSearchTerm(e.target.value)}
                                      className="w-full h-12 px-4 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                </div>
                                
                                <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                                  {filteredPosts.length > 0 ? (
                                    filteredPosts.map((post) => (
                                      <button
                                              key={post.id}
                                              onClick={() => handlePostSelect(post.id, post.name)}
                                              disabled={post.occupied === true}
                                              className={`w-full p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition-all duration-200 text-left group ${post.occupied ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            >
                                              <div className="flex items-start space-x-3">
                                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                  <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                  <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">{post.name}</h3>
                                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{post.description}</p>
                                                  {(post.gradeLevel || post.level) && (
                                                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                                      {post.gradeLevel || post.level}
                                                    </span>
                                                  )}
                                                  {post.occupied && (
                                                    <span className="inline-block mt-2 ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                                                      Occupied
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                      </button>
                                    ))
                                  ) : (
                                  <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                      <p>No posts found matching "{postSearchTerm}"</p>
                                  </div>
                                  )}
                                </div>

                                {(formData.departmentId && !formData.divisionId) && (
                                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-amber-800 dark:text-amber-200">
                                        Can't find your post under the Department?
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, postId: '', postName: '' }));
                                          setStep(4);
                                        }}
                                        className="h-10"
                                      >
                                        Select Division Instead
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {formData.divisionId && !formData.branchId && (
                                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-amber-800 dark:text-amber-200">
                                        Can't find your post under the Division?
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, postId: '', postName: '' }));
                                          setStep(5);
                                        }}
                                        className="h-10"
                                      >
                                        Select Branch Instead
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {formData.postId && (
                                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <User className="h-5 w-5 text-primary" />
                                      <div>
                                        <p className="text-sm font-medium text-primary">Selected Post</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{formData.postName}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>                      

                            <div className="flex space-x-3">
                              <Button 
                                type="button"
                                variant="outline"
                                onClick={goBack}
                                  className="flex-1 h-12"
                              >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                              </Button>
                              <Button 
                                  type="button"
                                  onClick={() => setStep(7)}
                                  disabled={!formData.postId}
                                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
                                >
                                  Continue to Confirmation
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link 
                                  to="/login" 
                                  className="text-primary hover:underline font-medium transition-colors"
                                >
                                  Sign in
                                </Link>
                              </p>
                            </div>

                              </div>
                          </div>
                          )}

                          {/* Step 7: Confirmation & Profile Setup */}
                          {step === 7 && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Review Your Organizational Assignment
                                </Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Please review your organizational assignment details before confirming your profile setup.
                                </p>
                                
                                <div className="space-y-4">
                                  {/* Organizational Hierarchy Display */}
                                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                                    <h4 className="font-medium text-slate-900 dark:text-white flex items-center">
                                      <Building2 className="h-4 w-4 mr-2 text-primary" />
                                      Your Organizational Assignment
                                    </h4>
                                    
                                    <div className="space-y-2">
                                      {/* Department */}
                                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-700 rounded border">
                                        <Building2 className="h-4 w-4 text-slate-500" />
                                        <div>
                                          <p className="text-sm font-medium text-slate-900 dark:text-white">Department</p>
                                          <p className="text-sm text-slate-600 dark:text-slate-400">{formData.departmentName}</p>
                                        </div>
                                      </div>
                                      
                                      {/* Division (if selected) */}
                                      {formData.divisionId && (
                                        <div className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-700 rounded border ml-4">
                                          <Network className="h-4 w-4 text-slate-500" />
                                          <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Division</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{formData.divisionName}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Branch (if selected) */}
                                      {formData.branchId && (
                                        <div className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-700 rounded border ml-8">
                                          <Target className="h-4 w-4 text-slate-500" />
                                          <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Branch</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{formData.branchName}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* No Section level (removed) */}
                                      {/* No Section level (removed) */}
                                      
                                      {/* Post */}
                                      <div className="flex items-center space-x-3 p-2 bg-primary/10 border border-primary/20 rounded">
                                        <User className="h-4 w-4 text-primary" />
                                        <div>
                                          <p className="text-sm font-medium text-primary">Your Post</p>
                                          <p className="text-sm text-slate-700 dark:text-slate-300">{formData.postName}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Staff Information */}
                                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                                    <h4 className="font-medium text-slate-900 dark:text-white flex items-center">
                                      <User className="h-4 w-4 mr-2 text-primary" />
                                      Staff Information
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Staff ID</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.staffId}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Full Name</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.email}</p>
                                      </div>
                                      
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex space-x-3">
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={goBack}
                                  className="flex-1 h-12"
                                >
                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                  Back
                                </Button>
                                <Button 
                                  type="button"
                                  onClick={handleConfirmation}
                                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirm & Complete Registration
                                </Button>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                          Already have an account?{" "}
                          <Link 
                            to="/login" 
                            className="text-primary hover:underline font-medium transition-colors"
                          >
                            Sign in
                          </Link>
                        </p>
                              </div>
                            </div>
                          )}

                    </CardContent>
                  </Card>
              </div>
            </div>
          
          
            </div>
        </div>
      </div>
  );
};
export default SignUp;