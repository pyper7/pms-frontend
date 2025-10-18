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
  ChevronRight
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

const DirectorSuperviseePerformanceReview: React.FC = () => {
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

  // Mock performance review data
  const [reviewData, setReviewData] = useState({
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
        supervisorComments: '',
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
        supervisorComments: '',
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
        supervisorComments: '',
        status: 'Under Review' as const
      }
    ] as KPI[],
    acknowledgements: {
      officer: true,
      supervisor: false
    },
    status: 'Under Review' as const,
    submittedDate: '2024-01-15',
    lastModified: '2024-01-20',
    reviewMonth: 'January 2024'
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
    setReviewData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === kpiId ? { ...kpi, supervisorComments: comments } : kpi
      )
    }));
  };

  // Approve review
  const approveReview = () => {
    setReviewData(prev => ({
      ...prev,
      status: 'Approved',
      acknowledgements: { ...prev.acknowledgements, supervisor: true }
    }));
  };

  // Reject review
  const rejectReview = () => {
    setReviewData(prev => ({
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
            title={`Performance Review - ${supervisee.name}`}
            subtitle={`Review monthly performance evaluation for supervisee - ${reviewData.reviewMonth}`}
            breadcrumbs={[
              { label: 'Director Dashboard', href: '/director/dashboard' },
              { label: 'Supervisee Reviews', href: '/director/supervisee/performance-review' },
              { label: supervisee.name }
            ]}
            right={
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(reviewData.status)}>
                  {reviewData.status}
                </Badge>
                <Button variant="outline" asChild className="focus-visible">
                  <Link to="/director/supervisee/performance-review">
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {supervisee.name}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {supervisee.position}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Review Progress</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {activeTab === 'overview' ? 'Step 1 of 3' : 
                 activeTab === 'kpis' ? 'Step 2 of 3' : 'Step 3 of 3'}
              </span>
            </div>
            <Progress 
              value={activeTab === 'overview' ? 33 : 
                     activeTab === 'kpis' ? 67 : 100} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
          </CardContent>
        </Card>

        {/* Review Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              KPIs & Tasks
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4" />
              Supervisor Comments
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Overview</h3>
              <Button 
                onClick={() => setActiveTab('kpis')}
                variant="outline"
                className="flex items-center gap-2"
              >
                Next: KPIs & Tasks
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Review Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                      <Badge className={getStatusColor(reviewData.status)}>
                        {reviewData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Review Month</span>
                      <span className="text-sm font-medium">
                        {reviewData.reviewMonth}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Submitted</span>
                      <span className="text-sm font-medium">
                        {new Date(reviewData.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Last Modified</span>
                      <span className="text-sm font-medium">
                        {new Date(reviewData.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">KPIs & Tasks</h3>
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
                  onClick={() => setActiveTab('comments')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next: Supervisor Comments
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {reviewData.kpis.map((kpi) => (
              <Card key={kpi.id} className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{kpi.keyResultArea}</CardTitle>
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
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">Target</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {kpi.target} {kpi.unitOfMeasurement}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">Weight</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {kpi.weight}%
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">Start Date</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(kpi.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">End Date</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(kpi.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Officer Comments</Label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      This is a sample officer comment about their progress on this KPI. The officer has provided detailed feedback on their achievements and challenges.
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Supervisor Comments</Label>
                    <Textarea
                      placeholder="Add your comments and feedback..."
                      value={kpi.supervisorComments || ''}
                      onChange={(e) => updateKPIComments(kpi.id, e.target.value)}
                      className="mt-1 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Supervisor Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supervisor Comments</h3>
              <Button 
                onClick={() => setActiveTab('kpis')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous: KPIs & Tasks
              </Button>
            </div>
            <Card className="dark-mode-card dark-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Overall Performance Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Strengths</Label>
                  <Textarea
                    placeholder="Highlight the officer's key strengths and achievements..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Areas for Improvement</Label>
                  <Textarea
                    placeholder="Identify areas where the officer can improve..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Recommendations</Label>
                  <Textarea
                    placeholder="Provide recommendations for future development..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Overall Rating</Label>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select overall rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (5)</SelectItem>
                      <SelectItem value="good">Good (4)</SelectItem>
                      <SelectItem value="satisfactory">Satisfactory (3)</SelectItem>
                      <SelectItem value="needs-improvement">Needs Improvement (2)</SelectItem>
                      <SelectItem value="unsatisfactory">Unsatisfactory (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation */}
        <Card className="dark-mode-card dark-shadow">
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
                  KPIs & Tasks
                </Button>
                <Button 
                  onClick={() => setActiveTab('comments')}
                  variant={activeTab === 'comments' ? 'default' : 'outline'}
                  size="sm"
                >
                  Supervisor Comments
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {activeTab !== 'overview' && (
                  <Button 
                    onClick={() => {
                      const tabs = ['overview', 'kpis', 'comments'];
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
                {activeTab !== 'comments' && (
                  <Button 
                    onClick={() => {
                      const tabs = ['overview', 'kpis', 'comments'];
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
                {activeTab === 'comments' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                    Submit Review
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DirectorSuperviseePerformanceReview;
