import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Target, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Download,
  Send,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp
} from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';

interface SuperviseeInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  avatar?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  manager: string;
  startDate: string;
}

interface KPI {
  id: string;
  keyResultArea: string;
  objective: string;
  target: string;
  unitOfMeasurement: string;
  weight: number;
  startDate: string;
  endDate: string;
  officerProgress?: number;
  supervisorComments?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
}

interface Competency {
  id: string;
  category: string;
  name: string;
  description: string;
  officerRating?: number;
  supervisorRating?: number;
  supervisorComments?: string;
}

interface Process {
  id: string;
  name: string;
  description: string;
  frequency: string;
  responsible: string;
  status: 'Active' | 'Inactive' | 'Under Review';
}

const DirectorSuperviseePerformanceContract: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for supervisee
  const supervisee: SuperviseeInfo = {
    id: id || '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Research Analyst',
    department: 'Research & Development',
    location: 'New York, NY',
    status: 'Active',
    manager: 'Dr. Michael Director',
    startDate: '2022-01-15'
  };

  // Mock performance contract data
  const [contractData, setContractData] = useState({
    kpis: [
      {
        id: '1',
        keyResultArea: 'Research Excellence',
        objective: 'Complete 3 major research projects with published outcomes',
        target: '3',
        unitOfMeasurement: 'Projects',
        weight: 30,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        officerProgress: 60,
        supervisorComments: 'Good progress on Project Alpha. Need to accelerate Project Beta.',
        status: 'Under Review' as const
      },
      {
        id: '2',
        keyResultArea: 'Publication Impact',
        objective: 'Publish 5 peer-reviewed papers in top-tier journals',
        target: '5',
        unitOfMeasurement: 'Papers',
        weight: 25,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        officerProgress: 40,
        supervisorComments: 'Two papers submitted, awaiting review.',
        status: 'Under Review' as const
      },
      {
        id: '3',
        keyResultArea: 'Team Collaboration',
        objective: 'Lead 2 cross-functional research initiatives',
        target: '2',
        unitOfMeasurement: 'Initiatives',
        weight: 20,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        officerProgress: 50,
        supervisorComments: 'Excellent leadership on Initiative A. Initiative B needs more focus.',
        status: 'Under Review' as const
      }
    ] as KPI[],
    competencies: [
      {
        id: '1',
        category: 'Generic',
        name: 'Communication',
        description: 'Ability to communicate effectively with team members and stakeholders',
        officerRating: 4,
        supervisorRating: 4,
        supervisorComments: 'Strong communication skills demonstrated in recent presentations.'
      },
      {
        id: '2',
        category: 'Functional',
        name: 'Research Methodology',
        description: 'Proficiency in research design, data collection, and analysis',
        officerRating: 5,
        supervisorRating: 4,
        supervisorComments: 'Excellent technical skills, but could improve in statistical analysis.'
      },
      {
        id: '3',
        category: 'Ethics',
        name: 'Professional Integrity',
        description: 'Adherence to ethical standards and professional conduct',
        officerRating: 5,
        supervisorRating: 5,
        supervisorComments: 'Exemplary professional conduct and ethical standards.'
      }
    ] as Competency[],
    processes: [
      {
        id: '1',
        name: 'Punctuality/Attendance',
        description: 'Maintain 95% attendance rate and punctuality',
        frequency: 'Daily',
        responsible: 'Dr. Sarah Johnson',
        status: 'Active'
      },
      {
        id: '2',
        name: 'Work Turn Around Time',
        description: 'Complete tasks within agreed timelines',
        frequency: 'Ongoing',
        responsible: 'Dr. Sarah Johnson',
        status: 'Active'
      },
      {
        id: '3',
        name: 'Innovation on the Job',
        description: 'Implement process improvements and innovative solutions',
        frequency: 'Ongoing',
        responsible: 'Dr. Sarah Johnson',
        status: 'Active'
      }
    ] as Process[],
    acknowledgements: {
      officer: true,
      supervisor: false
    },
    status: 'Under Review' as const,
    submittedDate: '2024-01-15',
    lastModified: '2024-01-20'
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'Submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Update KPI supervisor comments
  const updateKPIComments = (kpiId: string, comments: string) => {
    setContractData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === kpiId ? { ...kpi, supervisorComments: comments } : kpi
      )
    }));
  };

  // Update competency supervisor rating and comments
  const updateCompetencyRating = (compId: string, rating: number, comments: string) => {
    setContractData(prev => ({
      ...prev,
      competencies: prev.competencies.map(comp => 
        comp.id === compId ? { ...comp, supervisorRating: rating, supervisorComments: comments } : comp
      )
    }));
  };

  // Approve contract
  const approveContract = () => {
    setContractData(prev => ({
      ...prev,
      status: 'Approved',
      acknowledgements: { ...prev.acknowledgements, supervisor: true }
    }));
  };

  // Reject contract
  const rejectContract = () => {
    setContractData(prev => ({
      ...prev,
      status: 'Rejected'
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonForm />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        {/* Header */}
        <div className="card-base">
          <PageHeader
            title={`Performance Contract - ${supervisee.name}`}
            subtitle="Review and manage performance contract for supervisee"
            breadcrumbs={[
              { label: 'Director Dashboard', href: '/director/dashboard' },
              { label: 'Supervisee Contracts', href: '/director/supervisee/performance-contract' },
              { label: supervisee.name }
            ]}
            right={
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(contractData.status)}>
                  {contractData.status}
                </Badge>
                <Button variant="outline" asChild className="focus-visible">
                  <Link to="/director/supervisee/performance-contract">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                  </Link>
                </Button>
              </div>
            }
          />
        </div>


        {/* Supervisee Info */}
        <Card className="card-base">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={supervisee.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white text-lg">
                  {supervisee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {supervisee.name}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {supervisee.position}
                    </p>
                    <p className="text-body-small text-muted-foreground">
                      {supervisee.department} • {supervisee.location}
                    </p>
                  </div>
                  <Badge className={getStatusColor(supervisee.status)}>
                    {supervisee.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{supervisee.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{supervisee.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 mr-2" />
                    <span>Manager: {supervisee.manager}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contract Review Progress</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'overview' ? 'Step 1 of 4' : 
                 activeTab === 'kpis' ? 'Step 2 of 4' :
                 activeTab === 'competencies' ? 'Step 3 of 4' : 'Step 4 of 4'}
              </span>
            </div>
            <Progress 
              value={activeTab === 'overview' ? 25 : 
                     activeTab === 'kpis' ? 50 :
                     activeTab === 'competencies' ? 75 : 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Contract Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              KPIs & Tasks (70%)
            </TabsTrigger>
            <TabsTrigger value="competencies" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <Award className="w-4 h-4" />
              Competencies (20%)
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4" />
              Processes (10%)
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contract Overview</h3>
              <Button 
                onClick={() => setActiveTab('kpis')}
                variant="outline"
                className="flex items-center gap-2"
              >
                Next: KPIs & Tasks
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Contract Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                      <Badge className={getStatusColor(contractData.status)}>
                        {contractData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Submitted</span>
                      <span className="text-sm font-medium">
                        {new Date(contractData.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Last Modified</span>
                      <span className="text-sm font-medium">
                        {new Date(contractData.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">KPIs</span>
                      <span className="text-sm font-medium">{contractData.kpis.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Competencies</span>
                      <span className="text-sm font-medium">{contractData.competencies.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Processes</span>
                      <span className="text-sm font-medium">{contractData.processes.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Acknowledgements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Officer</span>
                      <Badge className={contractData.acknowledgements.officer ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                        {contractData.acknowledgements.officer ? 'Signed' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Supervisor</span>
                      <Badge className={contractData.acknowledgements.supervisor ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                        {contractData.acknowledgements.supervisor ? 'Signed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            {contractData.status === 'Under Review' && (
              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Review Actions
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Review the contract details and provide your decision with reasons
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Decision</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="decision" 
                              value="approve" 
                              className="text-green-600"
                            />
                            <span className="text-sm">Approve Contract</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="decision" 
                              value="reject" 
                              className="text-red-600"
                            />
                            <span className="text-sm">Request Changes</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Reason/Comments</Label>
                        <Textarea
                          placeholder="Provide detailed feedback and reasons for your decision..."
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 pt-4">
                        <Button variant="outline" onClick={rejectContract}>
                          <X className="w-4 h-4 mr-2" />
                          Submit Decision
                        </Button>
                        <Button onClick={approveContract}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Decision
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">KPIs & Tasks (70%)</h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('overview')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous: Overview
                </Button>
                <Button 
                  onClick={() => setActiveTab('competencies')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next: Competencies
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {contractData.kpis.map((kpi) => (
              <Card key={kpi.id} className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{kpi.keyResultArea}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {kpi.objective}
                      </p>
                    </div>
                    <Badge className={getStatusColor(kpi.status)}>
                      {kpi.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Target</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {kpi.target} {kpi.unitOfMeasurement}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Weight</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {kpi.weight}%
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Start Date</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(kpi.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">End Date</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(kpi.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Competencies (20%)</h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('kpis')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous: KPIs & Tasks
                </Button>
                <Button 
                  onClick={() => setActiveTab('processes')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next: Processes
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {contractData.competencies.map((comp) => (
              <Card key={comp.id} className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{comp.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {comp.description}
                      </p>
                    </div>
                    <Badge variant="outline">{comp.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {comp.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processes (10%)</h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('competencies')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous: Competencies
                </Button>
                <Button 
                  onClick={() => setActiveTab('overview')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next: Overview
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {contractData.processes.map((process) => (
              <Card key={process.id} className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg">{process.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {process.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Frequency</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {process.frequency}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation */}
        <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setActiveTab('overview')}
                  variant={activeTab === 'overview' ? 'default' : 'outline'}
                  size="sm"
                >
                  Overview
                </Button>
                <Button 
                  onClick={() => setActiveTab('kpis')}
                  variant={activeTab === 'kpis' ? 'default' : 'outline'}
                  size="sm"
                >
                  KPIs & Tasks (70%)
                </Button>
                <Button 
                  onClick={() => setActiveTab('competencies')}
                  variant={activeTab === 'competencies' ? 'default' : 'outline'}
                  size="sm"
                >
                  Competencies (20%)
                </Button>
                <Button 
                  onClick={() => setActiveTab('processes')}
                  variant={activeTab === 'processes' ? 'default' : 'outline'}
                  size="sm"
                >
                  Processes (10%)
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {activeTab !== 'overview' && (
                  <Button 
                    onClick={() => {
                      const tabs = ['overview', 'kpis', 'competencies', 'processes'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                {activeTab !== 'processes' && (
                  <Button 
                    onClick={() => {
                      const tabs = ['overview', 'kpis', 'competencies', 'processes'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                {activeTab === 'processes' && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DirectorSuperviseePerformanceContract;
