import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StandardModal, { StandardModalFooter } from '@/components/ui/standard-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/utils/toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Settings, 
  Target, 
  Users, 
  Calendar, 
  Bell, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  FileText,
  Briefcase,
  Cog
} from 'lucide-react';

interface Competency {
  id: string;
  name: string;
  category: 'GENERIC' | 'FUNCTIONAL' | 'ETHICS';
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Process {
  id: string;
  name: string;
  description: string;
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppraisalPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface ScoringWeight {
  id: string;
  section: 'KPI_TASKS' | 'COMPETENCIES' | 'PROCESSES';
  weight: number;
  description: string;
}

const AppraisalSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('competencies');
  const [isLoading, setIsLoading] = useState(true);
  
  // Competencies state
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [showCompetencyDialog, setShowCompetencyDialog] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<Competency | null>(null);
  const [competencyForm, setCompetencyForm] = useState({
    name: '',
    category: 'GENERIC' as 'GENERIC' | 'FUNCTIONAL' | 'ETHICS',
    description: ''
  });
  
  // Pagination and filtering state
  const [competencyPage, setCompetencyPage] = useState(1);
  const [competencyPageSize] = useState(6);
  const [competencySearch, setCompetencySearch] = useState('');
  const [competencyCategoryFilter, setCompetencyCategoryFilter] = useState<'ALL' | 'GENERIC' | 'FUNCTIONAL' | 'ETHICS'>('ALL');

  // Processes state
  const [processes, setProcesses] = useState<Process[]>([]);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [processForm, setProcessForm] = useState({
    name: '',
    description: '',
    weight: 10
  });

  // Appraisal periods state
  const [periods, setPeriods] = useState<AppraisalPeriod[]>([]);
  const [showPeriodDialog, setShowPeriodDialog] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<AppraisalPeriod | null>(null);
  const [periodForm, setPeriodForm] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  // Scoring weights state
  const [scoringWeights, setScoringWeights] = useState<ScoringWeight[]>([
    { id: '1', section: 'KPI_TASKS', weight: 70, description: 'Key Performance Indicators and Tasks' },
    { id: '2', section: 'COMPETENCIES', weight: 20, description: 'Core Competencies Assessment' },
    { id: '3', section: 'PROCESSES', weight: 10, description: 'Processes and Operations' }
  ]);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    contractReminders: true,
    reviewReminders: true,
    appraisalDeadlines: true,
    reminderDays: 7,
    emailNotifications: true,
    systemNotifications: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load competencies
      const competenciesData: Competency[] = [
        // Generic Competencies
        {
          id: '1',
          name: 'Communication Skills',
          category: 'GENERIC',
          description: 'Ability to communicate effectively with colleagues, stakeholders, and clients',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Leadership',
          category: 'GENERIC',
          description: 'Ability to lead and motivate team members',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '3',
          name: 'Teamwork',
          category: 'GENERIC',
          description: 'Ability to work effectively in a team environment',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '4',
          name: 'Problem Solving',
          category: 'GENERIC',
          description: 'Ability to analyze problems and develop effective solutions',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '5',
          name: 'Time Management',
          category: 'GENERIC',
          description: 'Ability to manage time effectively and meet deadlines',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '6',
          name: 'Adaptability',
          category: 'GENERIC',
          description: 'Ability to adapt to changing circumstances and new challenges',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        // Functional Competencies
        {
          id: '7',
          name: 'Technical Expertise',
          category: 'FUNCTIONAL',
          description: 'Proficiency in job-specific technical skills',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '8',
          name: 'Project Management',
          category: 'FUNCTIONAL',
          description: 'Ability to plan, execute, and monitor projects effectively',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '9',
          name: 'Data Analysis',
          category: 'FUNCTIONAL',
          description: 'Ability to analyze data and draw meaningful insights',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '10',
          name: 'Financial Management',
          category: 'FUNCTIONAL',
          description: 'Understanding of financial principles and budget management',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '11',
          name: 'Strategic Planning',
          category: 'FUNCTIONAL',
          description: 'Ability to develop and implement strategic plans',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '12',
          name: 'Quality Assurance',
          category: 'FUNCTIONAL',
          description: 'Knowledge of quality standards and assurance processes',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        // Ethics Competencies
        {
          id: '13',
          name: 'Integrity',
          category: 'ETHICS',
          description: 'Demonstrates honesty and ethical behavior in all activities',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '14',
          name: 'Confidentiality',
          category: 'ETHICS',
          description: 'Maintains confidentiality of sensitive information',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '15',
          name: 'Professional Conduct',
          category: 'ETHICS',
          description: 'Maintains professional standards and conduct',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '16',
          name: 'Accountability',
          category: 'ETHICS',
          description: 'Takes responsibility for actions and decisions',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '17',
          name: 'Transparency',
          category: 'ETHICS',
          description: 'Maintains transparency in all dealings and communications',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '18',
          name: 'Fairness',
          category: 'ETHICS',
          description: 'Treats all individuals fairly and without bias',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        }
      ];

      // Load processes
      const processesData: Process[] = [
        {
          id: '1',
          name: 'Punctuality/Attendance',
          description: 'Maintain 95% attendance rate and punctuality',
          weight: 10,
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Work Turn Around Time',
          description: 'Complete tasks within agreed timelines',
          weight: 10,
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '3',
          name: 'Innovation on the Job',
          description: 'Implement process improvements and innovative solutions',
          weight: 10,
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        }
      ];

      // Load periods
      const periodsData: AppraisalPeriod[] = [
        {
          id: '1',
          name: 'Q1 2025',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          isActive: true,
          createdAt: '2024-12-01'
        },
        {
          id: '2',
          name: 'Q2 2025',
          startDate: '2025-04-01',
          endDate: '2025-06-30',
          isActive: false,
          createdAt: '2024-12-01'
        }
      ];

      setCompetencies(competenciesData);
      setProcesses(processesData);
      setPeriods(periodsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load settings data');
    } finally {
      setIsLoading(false);
    }
  };

  // Competency management functions
  const handleSaveCompetency = () => {
    if (!competencyForm.name.trim()) {
      toast.error('Competency name is required');
      return;
    }

    const competencyData = {
      ...competencyForm,
      id: editingCompetency?.id || Date.now().toString(),
      isActive: true,
      createdAt: editingCompetency?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingCompetency) {
      setCompetencies(prev => prev.map(c => c.id === editingCompetency.id ? competencyData : c));
      toast.success('Competency updated successfully');
    } else {
      setCompetencies(prev => [...prev, competencyData]);
      toast.success('Competency created successfully');
    }

    setShowCompetencyDialog(false);
    setEditingCompetency(null);
    setCompetencyForm({ name: '', category: 'GENERIC', description: '' });
  };

  const handleEditCompetency = (competency: Competency) => {
    setEditingCompetency(competency);
    setCompetencyForm({
      name: competency.name,
      category: competency.category,
      description: competency.description
    });
    setShowCompetencyDialog(true);
  };

  const handleDeleteCompetency = (id: string) => {
    setCompetencies(prev => prev.filter(c => c.id !== id));
    toast.success('Competency deleted successfully');
  };

  const toggleCompetencyStatus = (id: string) => {
    setCompetencies(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  // Process management functions
  const handleSaveProcess = () => {
    if (!processForm.name.trim()) {
      toast.error('Process name is required');
      return;
    }

    const processData = {
      ...processForm,
      id: editingProcess?.id || Date.now().toString(),
      isActive: true,
      createdAt: editingProcess?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingProcess) {
      setProcesses(prev => prev.map(p => p.id === editingProcess.id ? processData : p));
      toast.success('Process updated successfully');
    } else {
      setProcesses(prev => [...prev, processData]);
      toast.success('Process created successfully');
    }

    setShowProcessDialog(false);
    setEditingProcess(null);
    setProcessForm({ name: '', description: '', weight: 10 });
  };

  const handleEditProcess = (process: Process) => {
    setEditingProcess(process);
    setProcessForm({
      name: process.name,
      description: process.description,
      weight: process.weight
    });
    setShowProcessDialog(true);
  };

  const handleDeleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    toast.success('Process deleted successfully');
  };

  // Period management functions
  const handleSavePeriod = () => {
    if (!periodForm.name.trim() || !periodForm.startDate || !periodForm.endDate) {
      toast.error('All fields are required');
      return;
    }

    const periodData = {
      ...periodForm,
      id: editingPeriod?.id || Date.now().toString(),
      isActive: true,
      createdAt: editingPeriod?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingPeriod) {
      setPeriods(prev => prev.map(p => p.id === editingPeriod.id ? periodData : p));
      toast.success('Period updated successfully');
    } else {
      setPeriods(prev => [...prev, periodData]);
      toast.success('Period created successfully');
    }

    setShowPeriodDialog(false);
    setEditingPeriod(null);
    setPeriodForm({ name: '', startDate: '', endDate: '' });
  };

  const handleEditPeriod = (period: AppraisalPeriod) => {
    setEditingPeriod(period);
    setPeriodForm({
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate
    });
    setShowPeriodDialog(true);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
    toast.success('Period deleted successfully');
  };

  const togglePeriodStatus = (id: string) => {
    setPeriods(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  // Scoring weights management
  const handleUpdateScoringWeight = (id: string, weight: number) => {
    setScoringWeights(prev => prev.map(sw => 
      sw.id === id ? { ...sw, weight } : sw
    ));
    toast.success('Scoring weight updated successfully');
  };

  // Notification settings management
  const handleUpdateNotificationSetting = (key: string, value: boolean | number) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Notification setting updated successfully');
  };

  // Competency filtering and pagination logic
  const filteredCompetencies = useMemo(() => {
    console.log('Filtering competencies:', {
      total: competencies.length,
      search: competencySearch,
      categoryFilter: competencyCategoryFilter,
      competencies: competencies.map(c => ({ name: c.name, category: c.category }))
    });
    
    const filtered = competencies.filter(competency => {
      const matchesSearch = competency.name.toLowerCase().includes(competencySearch.toLowerCase()) ||
                           competency.description.toLowerCase().includes(competencySearch.toLowerCase());
      const matchesCategory = competencyCategoryFilter === 'ALL' || competency.category === competencyCategoryFilter;
      console.log(`Competency ${competency.name}: search=${matchesSearch}, category=${matchesCategory}`);
      return matchesSearch && matchesCategory;
    });
    
    console.log('Filtered result:', filtered.length);
    return filtered;
  }, [competencies, competencySearch, competencyCategoryFilter]);

  const paginatedCompetencies = useMemo(() => {
    const startIndex = (competencyPage - 1) * competencyPageSize;
    const endIndex = startIndex + competencyPageSize;
    return filteredCompetencies.slice(startIndex, endIndex);
  }, [filteredCompetencies, competencyPage, competencyPageSize]);

  const totalCompetencyPages = Math.ceil(filteredCompetencies.length / competencyPageSize);

  const handleCompetencyPageChange = (page: number) => {
    console.log('Changing competency page from', competencyPage, 'to', page);
    setCompetencyPage(page);
  };

  const handleCompetencySearch = (search: string) => {
    setCompetencySearch(search);
    setCompetencyPage(1); // Reset to first page when searching
  };

  const handleCompetencyCategoryFilter = (category: 'ALL' | 'GENERIC' | 'FUNCTIONAL' | 'ETHICS') => {
    setCompetencyCategoryFilter(category);
    setCompetencyPage(1); // Reset to first page when filtering
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Appraisal Settings"
          subtitle="Configure competencies, processes, periods, and other appraisal settings"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Appraisal Settings' }
          ]}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 p-2 rounded-2xl shadow-lg border-2 border-border">
            <TabsTrigger value="competencies" className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground">
              <Target className="w-4 h-4 mr-2" />
              Competencies
            </TabsTrigger>
            <TabsTrigger value="processes" className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground">
              <Briefcase className="w-4 h-4 mr-2" />
              Processes
            </TabsTrigger>
            <TabsTrigger value="periods" className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Periods
            </TabsTrigger>
            <TabsTrigger value="scoring" className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Scoring
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-foreground py-3 font-semibold transition-all duration-200 hover:bg-accent/50 text-foreground">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            <Card className="card-base">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Competencies Management</CardTitle>
                <Button 
                  onClick={() => {
                    setEditingCompetency(null);
                    setCompetencyForm({ name: '', category: 'GENERIC', description: '' });
                    setShowCompetencyDialog(true);
                  }} 
                  className="focus-visible"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Competency
                </Button>
              </CardHeader>
              <CardContent>
                {/* Search and Filter Controls */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="competency-search" className="text-body-small font-semibold text-foreground mb-2 block">Search Competencies</Label>
                      <Input
                        id="competency-search"
                        placeholder="Search by name or description..."
                        value={competencySearch}
                        onChange={(e) => handleCompetencySearch(e.target.value)}
                        className="focus-visible"
                      />
                    </div>
                    <div className="sm:w-48">
                      <Label htmlFor="competency-category-filter" className="text-body-small font-semibold text-foreground mb-2 block">Filter by Category</Label>
                      <Select
                        value={competencyCategoryFilter}
                        onValueChange={(value: 'ALL' | 'GENERIC' | 'FUNCTIONAL' | 'ETHICS') => 
                          handleCompetencyCategoryFilter(value)
                        }
                      >
                        <SelectTrigger className="focus-visible">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Categories</SelectItem>
                          <SelectItem value="GENERIC">Generic</SelectItem>
                          <SelectItem value="FUNCTIONAL">Functional</SelectItem>
                          <SelectItem value="ETHICS">Ethics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Results Summary */}
                  <div className="flex items-center justify-between text-body-small text-muted-foreground">
                    <span>
                      Showing {paginatedCompetencies.length} of {filteredCompetencies.length} competencies
                    </span>
                    <span>
                      Page {competencyPage} of {totalCompetencyPages}
                    </span>
                  </div>
                  
                  {/* Debug Info */}
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    Debug: Total competencies: {competencies.length}, Filtered: {filteredCompetencies.length}, 
                    Page size: {competencyPageSize}, Current page: {competencyPage}, 
                    Total pages: {totalCompetencyPages}
                  </div>
                </div>

                {/* Competencies List */}
                <div className="space-y-4">
                  {paginatedCompetencies.map((competency) => (
                    <div key={competency.id} className="card-base p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{competency.name}</h3>
                            <Badge className={competency.category === 'GENERIC' ? 'badge-info' : competency.category === 'FUNCTIONAL' ? 'badge-success' : 'badge-warning'}>
                              {competency.category}
                            </Badge>
                            <Badge className={competency.isActive ? 'badge-success' : 'badge-error'}>
                              {competency.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{competency.description}</p>
                          <div className="flex items-center gap-4 text-body-small text-muted-foreground">
                            <span>Created: {competency.createdAt}</span>
                            <span>Updated: {competency.updatedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCompetency(competency)}
                            className="focus-visible"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCompetencyStatus(competency.id)}
                            className="focus-visible"
                          >
                            {competency.isActive ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCompetency(competency.id)}
                            className="focus-visible text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination Controls */}
                  {totalCompetencyPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCompetencyPageChange(competencyPage - 1)}
                        disabled={competencyPage === 1}
                        className="focus-visible"
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {(() => {
                          const pages = [];
                          const maxVisiblePages = 5;
                          let startPage = Math.max(1, competencyPage - Math.floor(maxVisiblePages / 2));
                          let endPage = Math.min(totalCompetencyPages, startPage + maxVisiblePages - 1);
                          
                          // Adjust start page if we're near the end
                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }
                          
                          // Add first page and ellipsis if needed
                          if (startPage > 1) {
                            pages.push(
                              <Button
                                key={1}
                                variant={competencyPage === 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleCompetencyPageChange(1)}
                                className="focus-visible w-8 h-8 p-0"
                              >
                                1
                              </Button>
                            );
                            if (startPage > 2) {
                              pages.push(
                                <span key="ellipsis1" className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              );
                            }
                          }
                          
                          // Add visible pages
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={competencyPage === i ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleCompetencyPageChange(i)}
                                className="focus-visible w-8 h-8 p-0"
                              >
                                {i}
                              </Button>
                            );
                          }
                          
                          // Add last page and ellipsis if needed
                          if (endPage < totalCompetencyPages) {
                            if (endPage < totalCompetencyPages - 1) {
                              pages.push(
                                <span key="ellipsis2" className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              );
                            }
                            pages.push(
                              <Button
                                key={totalCompetencyPages}
                                variant={competencyPage === totalCompetencyPages ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleCompetencyPageChange(totalCompetencyPages)}
                                className="focus-visible w-8 h-8 p-0"
                              >
                                {totalCompetencyPages}
                              </Button>
                            );
                          }
                          
                          return pages;
                        })()}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCompetencyPageChange(competencyPage + 1)}
                        disabled={competencyPage === totalCompetencyPages}
                        className="focus-visible"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <Card className="card-base">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Processes & Operations Management</CardTitle>
                <Button 
                  onClick={() => {
                    setEditingProcess(null);
                    setProcessForm({ name: '', description: '', weight: 10 });
                    setShowProcessDialog(true);
                  }} 
                  className="focus-visible"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Process
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processes.map((process) => (
                    <div key={process.id} className="card-base p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{process.name}</h3>
                            <Badge className="badge-info">{process.weight}% Weight</Badge>
                            <Badge className={process.isActive ? 'badge-success' : 'badge-error'}>
                              {process.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{process.description}</p>
                          <div className="flex items-center gap-4 text-body-small text-muted-foreground">
                            <span>Created: {process.createdAt}</span>
                            <span>Updated: {process.updatedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProcess(process)}
                            className="focus-visible"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProcess(process.id)}
                            className="focus-visible text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Periods Tab */}
          <TabsContent value="periods" className="space-y-6">
            <Card className="card-base">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Appraisal Periods Management</CardTitle>
                <Button 
                  onClick={() => {
                    setEditingPeriod(null);
                    setPeriodForm({ name: '', startDate: '', endDate: '' });
                    setShowPeriodDialog(true);
                  }} 
                  className="focus-visible"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Period
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {periods.map((period) => (
                    <div key={period.id} className="card-base p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{period.name}</h3>
                            <Badge className={period.isActive ? 'badge-success' : 'badge-error'}>
                              {period.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-body-small text-muted-foreground mb-2">
                            <span>Start: {period.startDate}</span>
                            <span>End: {period.endDate}</span>
                          </div>
                          <div className="text-body-small text-muted-foreground">
                            Created: {period.createdAt}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPeriod(period)}
                            className="focus-visible"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePeriodStatus(period.id)}
                            className="focus-visible"
                          >
                            {period.isActive ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePeriod(period.id)}
                            className="focus-visible text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scoring Tab */}
          <TabsContent value="scoring" className="space-y-6">
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="text-foreground">Scoring Weights Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoringWeights.map((weight) => (
                    <div key={weight.id} className="card-base p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {weight.section.replace('_', ' & ')}
                          </h3>
                          <p className="text-muted-foreground">{weight.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`weight-${weight.id}`} className="text-body-small font-semibold text-foreground">
                              Weight:
                            </Label>
                            <Input
                              id={`weight-${weight.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={weight.weight}
                              onChange={(e) => handleUpdateScoringWeight(weight.id, parseInt(e.target.value) || 0)}
                              className="w-20 focus-visible"
                            />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="card-base p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-body-small font-semibold text-foreground">Total Weight:</span>
                      <span className="text-lg font-bold text-foreground">
                        {scoringWeights.reduce((sum, w) => sum + w.weight, 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="text-foreground">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Reminder Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="contract-reminders" className="text-body-small font-semibold text-foreground">
                            Contract Reminders
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Send reminders for contract deadlines
                          </p>
                        </div>
                        <Switch
                          id="contract-reminders"
                          checked={notificationSettings.contractReminders}
                          onCheckedChange={(checked) => handleUpdateNotificationSetting('contractReminders', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="review-reminders" className="text-body-small font-semibold text-foreground">
                            Review Reminders
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Send reminders for monthly reviews
                          </p>
                        </div>
                        <Switch
                          id="review-reminders"
                          checked={notificationSettings.reviewReminders}
                          onCheckedChange={(checked) => handleUpdateNotificationSetting('reviewReminders', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="appraisal-deadlines" className="text-body-small font-semibold text-foreground">
                            Appraisal Deadlines
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Send reminders for appraisal deadlines
                          </p>
                        </div>
                        <Switch
                          id="appraisal-deadlines"
                          checked={notificationSettings.appraisalDeadlines}
                          onCheckedChange={(checked) => handleUpdateNotificationSetting('appraisalDeadlines', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Notification Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="text-body-small font-semibold text-foreground">
                            Email Notifications
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Send notifications via email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleUpdateNotificationSetting('emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-notifications" className="text-body-small font-semibold text-foreground">
                            System Notifications
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Show notifications in the system
                          </p>
                        </div>
                        <Switch
                          id="system-notifications"
                          checked={notificationSettings.systemNotifications}
                          onCheckedChange={(checked) => handleUpdateNotificationSetting('systemNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Timing Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reminder-days" className="text-body-small font-semibold text-foreground">
                          Reminder Days Before Deadline
                        </Label>
                        <p className="text-body-small text-muted-foreground">
                          How many days before deadline to send reminders
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="reminder-days"
                          type="number"
                          min="1"
                          max="30"
                          value={notificationSettings.reminderDays}
                          onChange={(e) => handleUpdateNotificationSetting('reminderDays', parseInt(e.target.value) || 7)}
                          className="w-20 focus-visible"
                        />
                        <span className="text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Competency Modal */}
      <StandardModal
        isOpen={showCompetencyDialog}
        onClose={() => setShowCompetencyDialog(false)}
        title={editingCompetency ? 'Edit Competency' : 'Add New Competency'}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="competency-name" className="text-body-small font-semibold text-foreground">Name</Label>
            <Input
              id="competency-name"
              value={competencyForm.name}
              onChange={(e) => setCompetencyForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter competency name"
              className="focus-visible"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="competency-category" className="text-body-small font-semibold text-foreground">Category</Label>
            <Select
              value={competencyForm.category}
              onValueChange={(value: 'GENERIC' | 'FUNCTIONAL' | 'ETHICS') => 
                setCompetencyForm(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="focus-visible">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERIC">Generic</SelectItem>
                <SelectItem value="FUNCTIONAL">Functional</SelectItem>
                <SelectItem value="ETHICS">Ethics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="competency-description" className="text-body-small font-semibold text-foreground">Description</Label>
            <Textarea
              id="competency-description"
              value={competencyForm.description}
              onChange={(e) => setCompetencyForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter competency description"
              className="focus-visible"
            />
          </div>
          <StandardModalFooter>
            <Button variant="outline" onClick={() => setShowCompetencyDialog(false)} className="focus-visible">
              Cancel
            </Button>
            <Button onClick={handleSaveCompetency} className="focus-visible">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </StandardModalFooter>
        </div>
      </StandardModal>

      {/* Process Modal */}
      <StandardModal
        isOpen={showProcessDialog}
        onClose={() => setShowProcessDialog(false)}
        title={editingProcess ? 'Edit Process' : 'Add New Process'}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="process-name" className="text-body-small font-semibold text-foreground">Name</Label>
            <Input
              id="process-name"
              value={processForm.name}
              onChange={(e) => setProcessForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter process name"
              className="focus-visible"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-description" className="text-body-small font-semibold text-foreground">Description</Label>
            <Textarea
              id="process-description"
              value={processForm.description}
              onChange={(e) => setProcessForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter process description"
              className="focus-visible"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-weight" className="text-body-small font-semibold text-foreground">Weight (%)</Label>
            <Input
              id="process-weight"
              type="number"
              min="1"
              max="100"
              value={processForm.weight}
              onChange={(e) => setProcessForm(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
              className="focus-visible"
            />
          </div>
          <StandardModalFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)} className="focus-visible">
              Cancel
            </Button>
            <Button onClick={handleSaveProcess} className="focus-visible">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </StandardModalFooter>
        </div>
      </StandardModal>

      {/* Period Modal */}
      <StandardModal
        isOpen={showPeriodDialog}
        onClose={() => setShowPeriodDialog(false)}
        title={editingPeriod ? 'Edit Period' : 'Add New Period'}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period-name" className="text-body-small font-semibold text-foreground">Name</Label>
            <Input
              id="period-name"
              value={periodForm.name}
              onChange={(e) => setPeriodForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Q1 2025"
              className="focus-visible"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period-start" className="text-body-small font-semibold text-foreground">Start Date</Label>
              <Input
                id="period-start"
                type="date"
                value={periodForm.startDate}
                onChange={(e) => setPeriodForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="focus-visible"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period-end" className="text-body-small font-semibold text-foreground">End Date</Label>
              <Input
                id="period-end"
                type="date"
                value={periodForm.endDate}
                onChange={(e) => setPeriodForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="focus-visible"
              />
            </div>
          </div>
          <StandardModalFooter>
            <Button variant="outline" onClick={() => setShowPeriodDialog(false)} className="focus-visible">
              Cancel
            </Button>
            <Button onClick={handleSavePeriod} className="focus-visible">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </StandardModalFooter>
        </div>
      </StandardModal>
    </Layout>
  );
};

export default AppraisalSettings;
