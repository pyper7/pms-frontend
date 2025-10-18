import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/utils/toast';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target,
  Star,
  FileText,
  User,
  TrendingUp,
  Award,
  BookOpen,
  Plus,
  Edit,
  Save,
  X,
  Eye
} from 'lucide-react';

const OfficerPIP: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPIP, setSelectedPIP] = useState<any>(null);
  const [pipData] = useState([
    {
      id: 1,
      title: "Communication Skills Improvement",
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      priority: "High",
      description: "Improve verbal and written communication skills to enhance team collaboration and project delivery",
      objectives: [
        {
          id: 1,
          title: "Complete Communication Workshop",
          description: "Attend a 2-day communication skills workshop",
          target: "Complete workshop by March 1, 2024",
          progress: 75,
          status: "In Progress",
          evidence: "Workshop registration confirmed",
          dueDate: "2024-03-01"
        },
        {
          id: 2,
          title: "Practice Presentation Skills",
          description: "Deliver 3 presentations to team members",
          target: "Complete 3 presentations",
          progress: 33,
          status: "In Progress",
          evidence: "1 presentation completed",
          dueDate: "2024-03-15"
        },
        {
          id: 3,
          title: "Improve Written Reports",
          description: "Enhance quality of written project reports",
          target: "Submit 5 improved reports",
          progress: 40,
          status: "In Progress",
          evidence: "2 reports submitted with feedback",
          dueDate: "2024-04-01"
        }
      ],
      support: [
        {
          id: 1,
          type: "Mentor",
          description: "Assigned mentor: Dr. Sarah Johnson",
          status: "Active",
          contact: "sarah.johnson@tetfund.gov.ng"
        },
        {
          id: 2,
          type: "Training",
          description: "Communication skills training program",
          status: "Scheduled",
          contact: "training@tetfund.gov.ng"
        },
        {
          id: 3,
          type: "Resources",
          description: "Access to communication resources and templates",
          status: "Available",
          contact: "resources@tetfund.gov.ng"
        }
      ],
      milestones: [
        {
          id: 1,
          title: "Workshop Completion",
          dueDate: "2024-03-01",
          status: "In Progress",
          description: "Complete communication skills workshop"
        },
        {
          id: 2,
          title: "First Presentation",
          dueDate: "2024-02-15",
          status: "Completed",
          description: "Deliver first presentation to team"
        },
        {
          id: 3,
          title: "Mid-term Review",
          dueDate: "2024-03-15",
          status: "Pending",
          description: "Review progress with supervisor"
        },
        {
          id: 4,
          title: "Final Assessment",
          dueDate: "2024-04-15",
          status: "Pending",
          description: "Complete final assessment and evaluation"
        }
      ],
      supervisor: "Dr. Michael Brown",
      supervisorEmail: "michael.brown@tetfund.gov.ng",
      lastReview: "2024-02-01",
      nextReview: "2024-03-01"
    },
    {
      id: 2,
      title: "Project Management Enhancement",
      status: "Completed",
      startDate: "2023-10-01",
      endDate: "2024-01-01",
      priority: "Medium",
      description: "Improve project management skills and delivery timelines",
      objectives: [
        {
          id: 1,
          title: "Complete PMP Certification",
          description: "Obtain Project Management Professional certification",
          target: "Complete certification by December 2023",
          progress: 100,
          status: "Completed",
          evidence: "PMP certificate obtained",
          dueDate: "2023-12-15"
        },
        {
          id: 2,
          title: "Implement Project Tracking",
          description: "Use project management tools for better tracking",
          target: "Implement tools for all active projects",
          progress: 100,
          status: "Completed",
          evidence: "All projects now using tracking tools",
          dueDate: "2023-11-30"
        }
      ],
      support: [
        {
          id: 1,
          type: "Training",
          description: "PMP certification training program",
          status: "Completed",
          contact: "training@tetfund.gov.ng"
        }
      ],
      milestones: [
        {
          id: 1,
          title: "Training Completion",
          dueDate: "2023-11-15",
          status: "Completed",
          description: "Complete PMP training program"
        },
        {
          id: 2,
          title: "Certification Obtained",
          dueDate: "2023-12-15",
          status: "Completed",
          description: "Obtain PMP certification"
        }
      ],
      supervisor: "Dr. Sarah Johnson",
      supervisorEmail: "sarah.johnson@tetfund.gov.ng",
      lastReview: "2024-01-01",
      nextReview: "N/A"
    }
  ]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Active': return 'badge-info';
      case 'In Progress': return 'badge-info';
      case 'Pending': return 'badge-warning';
      case 'Overdue': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Active': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Pending': return <AlertCircle className="w-4 h-4" />;
      case 'Overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'badge-error';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const handleViewDetails = (pip: any) => {
    setSelectedPIP(pip);
  };

  const handleCloseDetails = () => {
    setSelectedPIP(null);
  };

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Performance Improvement Plans"
          subtitle="Track your performance improvement plans and development activities"
          right={
            <Button className="focus-visible">
              <Plus className="w-4 h-4 mr-2" />
              Request PIP
            </Button>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-1">
          <nav className="text-body-small text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/officer-dashboard" className="hover:text-foreground">Dashboard</a>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium">PIP</li>
            </ol>
          </nav>
        </div>

        {/* PIP Summary */}
        <div className="grid-stats">
          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Active PIPs</p>
                  <p className="text-3xl font-bold text-foreground">
                    {pipData.filter(pip => pip.status === 'Active').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Completed PIPs</p>
                  <p className="text-3xl font-bold text-foreground">
                    {pipData.filter(pip => pip.status === 'Completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Total Objectives</p>
                  <p className="text-2xl font-bold text-foreground">
                    {pipData.reduce((acc, pip) => acc + pip.objectives.length, 0)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Avg. Progress</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(
                      pipData.reduce((acc, pip) => {
                        const avgProgress = pip.objectives.reduce((objAcc, obj) => objAcc + obj.progress, 0) / pip.objectives.length;
                        return acc + avgProgress;
                      }, 0) / pipData.length
                    )}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PIP List */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="w-5 h-5" />
              Performance Improvement Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3 mb-3" />
                    <div className="h-6 bg-slate-200 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {pipData.map((pip) => (
                  <div key={pip.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{pip.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{pip.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-muted-foreground">
                            Period: {pip.startDate} - {pip.endDate}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Supervisor: {pip.supervisor}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(pip.priority)}>
                          {pip.priority}
                        </Badge>
                        <Badge className={getStatusColor(pip.status)}>
                          {getStatusIcon(pip.status)}
                          <span className="ml-1">{pip.status}</span>
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(pip)}
                          className="focus-visible"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-body-small text-muted-foreground">Objectives</div>
                        <div className="font-semibold text-foreground">{pip.objectives.length}</div>
                      </div>
                      <div>
                        <div className="text-body-small text-muted-foreground">Completed</div>
                        <div className="font-semibold text-foreground">
                          {pip.objectives.filter(obj => obj.status === 'Completed').length}
                        </div>
                      </div>
                      <div>
                        <div className="text-body-small text-muted-foreground">Avg. Progress</div>
                        <div className="font-semibold text-foreground">
                          {Math.round(pip.objectives.reduce((acc, obj) => acc + obj.progress, 0) / pip.objectives.length)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PIP Details Modal */}
        {selectedPIP && (
          <Card className="dark-mode-card dark-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {selectedPIP.title} - Details
                </CardTitle>
                <Button variant="outline" onClick={handleCloseDetails}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIP Overview */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">PIP Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPIP.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getPriorityColor(selectedPIP.priority)}>
                        {selectedPIP.priority} Priority
                      </Badge>
                      <Badge className={getStatusColor(selectedPIP.status)}>
                        {getStatusIcon(selectedPIP.status)}
                        <span className="ml-1">{selectedPIP.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Supervisor</h3>
                    <p className="text-sm text-muted-foreground">{selectedPIP.supervisor}</p>
                    <p className="text-xs text-muted-foreground">{selectedPIP.supervisorEmail}</p>
                    <div className="mt-2 text-sm">
                      <p>Last Review: {selectedPIP.lastReview}</p>
                      <p>Next Review: {selectedPIP.nextReview}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Improvement Objectives
                </h3>
                <div className="space-y-4">
                  {selectedPIP.objectives.map((objective: any) => (
                    <div key={objective.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{objective.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(objective.status)}>
                            {getStatusIcon(objective.status)}
                            <span className="ml-1">{objective.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <Label className="text-sm text-muted-foreground">Target</Label>
                          <p className="font-medium">{objective.target}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Evidence</Label>
                          <p className="font-medium">{objective.evidence}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Due: {objective.dueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Support Resources
                </h3>
                <div className="space-y-3">
                  {selectedPIP.support.map((support: any) => (
                    <div key={support.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{support.type}</h4>
                          <p className="text-sm text-muted-foreground">{support.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{support.contact}</p>
                        </div>
                        <Badge className={getStatusColor(support.status)}>
                          {getStatusIcon(support.status)}
                          <span className="ml-1">{support.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Milestones
                </h3>
                <div className="space-y-3">
                  {selectedPIP.milestones.map((milestone: any) => (
                    <div key={milestone.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Due: {milestone.dueDate}</p>
                        </div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {getStatusIcon(milestone.status)}
                          <span className="ml-1">{milestone.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default OfficerPIP;
