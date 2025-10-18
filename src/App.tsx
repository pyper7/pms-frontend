import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Organogram from "./pages/Organogram";
import ManageOfficers from "./pages/ManageOfficers";
import ManagePosts from "./pages/ManagePosts";
import PostOccupancy from "./pages/PostOccupancy";
import AppraisalSettings from "./pages/HR/AppraisalSettings";
import KraKpiManagement from "./pages/KraKpiManagement";
import RolesManagement from "./pages/RolesManagement";
import Access from "./pages/Access";
import NotFound from "./pages/NotFound";
import DirectorDashboardPage from "./pages/Director/Dashboard";
import AssistantDirectorDashboard from "./pages/AssistantDirector/Dashboard";
import DirectorMyAppraisal from "./pages/Director/MyAppraisal";
import DirectorTeamAppraisals from "./pages/Director/TeamAppraisals";
import DirectorDepartmentKRAs from "./pages/Director/DepartmentKRAs";
import DirectorPerformanceContracts from "./pages/Director/PerformanceContracts";
import TeamPerformanceContracts from "./pages/Director/TeamPerformanceContracts";
import DirectorSuperviseeList from "./pages/Director/SuperviseeList";
import DirectorSuperviseePerformanceContract from "./pages/Director/SuperviseePerformanceContract";
import DirectorSuperviseePerformanceReview from "./pages/Director/SuperviseePerformanceReview";
import DirectorSuperviseeAppraisal from "./pages/Director/SuperviseeAppraisal";
import DirectorStaffAppraisalReport from "./pages/Director/StaffAppraisalReport";
import DirectorDepartmentSummaryReport from "./pages/Director/DepartmentSummaryReport";
import DirectorLowPerformingUnitsReport from "./pages/Director/LowPerformingUnitsReport";
import AssistantDirectorMyAppraisal from "./pages/AssistantDirector/MyAppraisal";
import HRMyAppraisal from "./pages/HR/MyAppraisal";
import { OfficerDashboard } from "./pages/Officer/OfficerDashboard";
import OfficerReview from "./pages/Officer/Review";
import OfficerPIP from "./pages/Officer/PIP";
import OfficerReport from "./pages/Officer/Report";
// Shared pages for all roles
import PerformanceContract from "./pages/Shared/PerformanceContract";
import PerformanceReview from "./pages/Shared/PerformanceReview";
import Appraisal from "./pages/Shared/Appraisal";
import Profile from "./pages/Profile";
import IdleTimeout from "./components/IdleTimeout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <IdleTimeout />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/hr" element={<Login />} />
          <Route path="/login/director" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Director Routes */}
          <Route path="/director-dashboard" element={<DirectorDashboardPage />} />
          <Route path="/assistant-director-dashboard" element={<AssistantDirectorDashboard />} />
          <Route path="/director/my-appraisal" element={<DirectorMyAppraisal />} />
          <Route path="/director/team-appraisals" element={<DirectorTeamAppraisals />} />
          <Route path="/director/department-kras" element={<DirectorDepartmentKRAs />} />
          <Route path="/director/performance-contracts" element={<DirectorPerformanceContracts />} />
          <Route path="/director/team-performance-contracts" element={<TeamPerformanceContracts />} />
          <Route path="/assistant-director/my-appraisal" element={<AssistantDirectorMyAppraisal />} />
          <Route path="/hr/my-appraisal" element={<HRMyAppraisal />} />
          {/* Officer Routes */}
          <Route path="/officer-dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/performance-contract" element={<PerformanceContract />} />
          <Route path="/officer/performance-review" element={<PerformanceReview />} />
          <Route path="/officer/review" element={<OfficerReview />} />
          <Route path="/officer/appraisal" element={<Appraisal />} />
          <Route path="/officer/pip" element={<OfficerPIP />} />
          <Route path="/officer/report" element={<OfficerReport />} />
          
          {/* Supervisor Routes */}
          <Route path="/supervisor/performance-contract" element={<PerformanceContract />} />
          <Route path="/supervisor/performance-review" element={<PerformanceReview />} />
          <Route path="/supervisor/appraisal" element={<Appraisal />} />
          
          {/* Director Routes for Performance Management */}
          <Route path="/director/performance-contract" element={<PerformanceContract />} />
          <Route path="/director/performance-review" element={<PerformanceReview />} />
          <Route path="/director/appraisal" element={<Appraisal />} />
          
          {/* Director Routes for Supervisee Management */}
          <Route path="/director/supervisee/performance-contract" element={<DirectorSuperviseeList />} />
          <Route path="/director/supervisee/performance-contract/:id" element={<DirectorSuperviseePerformanceContract />} />
          <Route path="/director/supervisee/performance-review" element={<DirectorSuperviseeList />} />
          <Route path="/director/supervisee/performance-review/:id" element={<DirectorSuperviseePerformanceReview />} />
          <Route path="/director/supervisee/appraisal" element={<DirectorSuperviseeList />} />
          <Route path="/director/supervisee/appraisal/:id" element={<DirectorSuperviseeAppraisal />} />
          
          {/* Director Routes for Reports & Analytics */}
          <Route path="/director/reports/staff" element={<DirectorStaffAppraisalReport />} />
          <Route path="/director/reports/department" element={<DirectorDepartmentSummaryReport />} />
          <Route path="/director/reports/low-performing" element={<DirectorLowPerformingUnitsReport />} />
          
          {/* Assistant Director Routes for Performance Management */}
          <Route path="/assistant-director/performance-contract" element={<PerformanceContract />} />
          <Route path="/assistant-director/performance-review" element={<PerformanceReview />} />
          <Route path="/assistant-director/appraisal" element={<Appraisal />} />
          
          {/* Assistant Director Routes for Supervisee Management */}
          <Route path="/assistant-director/supervisee/performance-contract" element={<DirectorSuperviseeList />} />
          <Route path="/assistant-director/supervisee/performance-contract/:id" element={<DirectorSuperviseePerformanceContract />} />
          <Route path="/assistant-director/supervisee/performance-review" element={<DirectorSuperviseeList />} />
          <Route path="/assistant-director/supervisee/performance-review/:id" element={<DirectorSuperviseePerformanceReview />} />
          <Route path="/assistant-director/supervisee/appraisal" element={<DirectorSuperviseeList />} />
          <Route path="/assistant-director/supervisee/appraisal/:id" element={<DirectorSuperviseeAppraisal />} />
          
          {/* HR Routes for Performance Management */}
          <Route path="/hr/performance-contract" element={<PerformanceContract />} />
          <Route path="/hr/performance-review" element={<PerformanceReview />} />
          <Route path="/hr/appraisal" element={<Appraisal />} />
          <Route path="/organogram" element={<Organogram />} />
          <Route path="/manage-officers" element={<ManageOfficers />} />
          <Route path="/manage-posts" element={<ManagePosts />} />
          <Route path="/post-occupancy" element={<PostOccupancy />} />
          <Route path="/appraisal-settings" element={<AppraisalSettings />} />
          <Route path="/kra-kpi" element={<KraKpiManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roles-management" element={<RolesManagement />} />
          <Route path="/access" element={<Access />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
