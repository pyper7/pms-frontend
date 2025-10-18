import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAutoSave } from '@/hooks/useAutoSave';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
import { LoadingButton, FadeIn, HoverScale } from '@/components/MicroInteractions';
import { 
  Target, 
  Award, 
  CheckCircle, 
  Clock,
  User,
  Building,
  Save,
  AlertCircle
} from 'lucide-react';

interface AppraisalFormProps {
  employeeId?: string; // For HR/Director appraising others
  isSelfAppraisal?: boolean;
  period?: string;
  onSave?: (data: any) => Promise<void>;
  onSubmit?: (data: any) => Promise<void>;
  initialData?: any;
}

interface Task {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  weight: number;
  achievement?: number;
  evidence?: string;
  challenges?: string;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  score?: number;
  achievement?: string;
}

interface AppraisalData {
  period: string;
  status: string;
  tasks: Task[];
  competencies: {
    generic: Competency[];
    functional: Competency[];
    ethics: Competency[];
  };
  operations: {
    turnAroundTime: number;
    innovation: number;
    punctuality: number;
  };
  overallComments?: string;
  strengths?: string;
  areasForImprovement?: string;
  nextPeriodGoals?: string;
}

const AppraisalForm: React.FC<AppraisalFormProps> = ({
  employeeId,
  isSelfAppraisal = true,
  period = "Q1 2024",
  onSave,
  onSubmit,
  initialData
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  
  const [appraisalData, setAppraisalData] = useState<AppraisalData>(initialData || {
    period,
    status: "In Progress",
    tasks: [],
    competencies: {
      generic: [],
      functional: [],
      ethics: []
    },
    operations: {
      turnAroundTime: 0,
      innovation: 0,
      punctuality: 0
    }
  });

  const [acknowledgements, setAcknowledgements] = useState({
    honest: false,
    supervisorReview: false,
    followUp: false,
    performanceManagement: false
  });

  // Auto-save functionality
  const autoSaveData = {
    currentStep,
    appraisalData,
    acknowledgements,
    isEditing
  };

  const handleAutoSave = async (data: typeof autoSaveData) => {
    try {
      setAutoSaveStatus('saving');
      if (onSave) {
        await onSave(data);
      } else {
        // Default save behavior
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      throw error;
    }
  };

  const { saveNow, hasUnsavedChanges, isSaving } = useAutoSave({
    data: autoSaveData,
    onSave: handleAutoSave,
    interval: 30000,
    enabled: isEditing,
    onError: (error) => {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
    }
  });

  // Load tasks based on user role and employee
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        // This is where you'll integrate with your backend API
        // The API call will depend on the user's role and the employee being appraised
        const tasks = await loadTasksForRole(user?.role, employeeId);
        setAppraisalData(prev => ({ ...prev, tasks }));
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user?.role, employeeId]);

  // Mock function - replace with actual API call
  const loadTasksForRole = async (role: string | undefined, empId?: string): Promise<Task[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return different tasks based on role
    switch (role) {
      case 'HR_ADMIN':
        return [
          {
            id: '1',
            title: 'HR Policy Implementation',
            description: 'Implement new HR policies across the organization',
            target: 100,
            unit: '%',
            weight: 30
          },
          {
            id: '2',
            title: 'Employee Relations Management',
            description: 'Handle employee relations and conflict resolution',
            target: 95,
            unit: '%',
            weight: 25
          }
        ];
      case 'DIRECTOR':
        return [
          {
            id: '1',
            title: 'Department Performance Management',
            description: 'Oversee department performance and strategic goals',
            target: 90,
            unit: '%',
            weight: 40
          },
          {
            id: '2',
            title: 'Team Leadership',
            description: 'Lead and mentor team members',
            target: 85,
            unit: '%',
            weight: 30
          }
        ];
      case 'ASSISTANT_DIRECTOR':
        return [
          {
            id: '1',
            title: 'Division Operations Management',
            description: 'Manage daily operations of the division',
            target: 95,
            unit: '%',
            weight: 35
          },
          {
            id: '2',
            title: 'Process Improvement',
            description: 'Identify and implement process improvements',
            target: 80,
            unit: '%',
            weight: 25
          }
        ];
      case 'OFFICER':
      default:
        return [
          {
            id: '1',
            title: 'Task Completion',
            description: 'Complete assigned tasks within deadlines',
            target: 100,
            unit: '%',
            weight: 40
          },
          {
            id: '2',
            title: 'Quality Standards',
            description: 'Maintain high quality standards in work output',
            target: 95,
            unit: '%',
            weight: 30
          }
        ];
    }
  };

  const steps = [
    { id: 1, title: "Tasks & KPIs", percentage: 70 },
    { id: 2, title: "Competencies", percentage: 20 },
    { id: 3, title: "Operations & Processes", percentage: 10 },
    { id: 4, title: "Overall Assessment", percentage: 0 },
    { id: 5, title: "Confirmation & Acknowledgements", percentage: 0 }
  ];

  const updateTask = (taskId: string, field: keyof Task, value: any) => {
    setAppraisalData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }));
  };

  const calculateTaskScore = (task: Task) => {
    if (!task.achievement || !task.target) return 0;
    return Math.min((task.achievement / task.target) * 100, 100);
  };

  const calculateTasksSubtotal = () => {
    return appraisalData.tasks.reduce((total, task) => {
      const score = calculateTaskScore(task);
      return total + (score * task.weight / 100);
    }, 0);
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(appraisalData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Auto-save indicator */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {isSelfAppraisal ? 'Self Appraisal' : 'Performance Appraisal'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mt-2">
            {appraisalData.period} • {appraisalData.status}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AutoSaveIndicator 
            status={autoSaveStatus} 
            lastSaved={lastSaved}
          />
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Step 1: Tasks & KPIs */}
      {currentStep === 1 && (
        <FadeIn>
          <Card>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                Section 1: Tasks & KPIs
                <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200">
                  70%
                </Badge>
              </CardTitle>
              <p className="text-slate-600 mt-2">Define your key result areas, objectives, and performance indicators for this quarter.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appraisalData.tasks.map((task) => (
                  <HoverScale key={task.id}>
                    <Card className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-xl text-slate-900 mb-3 tracking-tight">{task.title}</h3>
                          <p className="text-base text-slate-700 mb-4 leading-relaxed">{task.description}</p>
                          <div className="flex gap-4 sm:gap-6 mb-6">
                            <div className="p-4 rounded-lg border-2 border-slate-200 shadow-sm">
                              <div className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Target</div>
                              <div className="text-lg font-semibold text-slate-900 mt-2">{task.target} {task.unit}</div>
                            </div>
                            <div className="p-4 rounded-lg border-2 border-slate-200 shadow-sm">
                              <div className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Weight</div>
                              <div className="text-lg font-semibold text-slate-900 mt-2">{task.weight}%</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`achievement-${task.id}`} className="text-base text-slate-700 font-semibold mb-2 block">
                              Target Achieved
                            </Label>
                            <Input
                              id={`achievement-${task.id}`}
                              type="number"
                              value={task.achievement || ''}
                              onChange={(e) => updateTask(task.id, 'achievement', parseFloat(e.target.value))}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`evidence-${task.id}`} className="text-base text-slate-700 font-semibold mb-2 block">
                              Evidence
                            </Label>
                            <Input
                              id={`evidence-${task.id}`}
                              value={task.evidence || ''}
                              onChange={(e) => updateTask(task.id, 'evidence', e.target.value)}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`challenges-${task.id}`} className="text-base text-slate-700 font-semibold mb-2 block">
                              Challenges Faced
                            </Label>
                            <Textarea
                              id={`challenges-${task.id}`}
                              value={task.challenges || ''}
                              onChange={(e) => updateTask(task.id, 'challenges', e.target.value)}
                              disabled={!isEditing}
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-base text-slate-700 font-semibold">Calculated Score</div>
                            <div className="text-2xl font-semibold text-emerald-600 mt-1 animate-pulse">
                              {calculateTaskScore(task).toFixed(1)}%
                            </div>
                          </div>
                          <Badge variant="outline" className="text-sm font-bold px-3 py-1 shadow-sm">
                            {task.weight}% weight
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </HoverScale>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-base text-slate-700 font-semibold">Tasks Subtotal (70%)</div>
                    <div className="text-3xl font-semibold text-emerald-800 mt-1">
                      {calculateTasksSubtotal().toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 text-base font-medium"
        >
          Previous
        </Button>
        
        <div className="text-sm text-slate-600 font-medium">
          Step {currentStep} of {steps.length}
        </div>
        
        <Button 
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          className="px-6 py-3 text-base font-medium bg-emerald-600 hover:bg-emerald-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AppraisalForm;
