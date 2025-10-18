import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/utils/toast';
import { 
  User, 
  FileText, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Award,
  TrendingUp,
  MessageSquare,
  BookOpen,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  // Mock data for Officer dashboard
  const officerMetrics = {
    currentKRA: 4,
    completedObjectives: 12,
    pendingTasks: 3,
    performanceScore: 87,
    daysToDeadline: 15,
    systemAlerts: 2
  };

  const myKRAs = [
    { id: 1, title: 'Research Excellence', weight: 30, progress: 85, status: 'on-track' },
    { id: 2, title: 'Publication & Innovation', weight: 25, progress: 92, status: 'excellent' },
    { id: 3, title: 'Collaboration & Networking', weight: 20, progress: 78, status: 'needs-improvement' },
    { id: 4, title: 'Professional Development', weight: 25, progress: 95, status: 'excellent' }
  ];

  const recentActivities = [
    { id: 1, title: 'Submitted Q1 Self-Assessment', date: '2024-01-15', type: 'submission', status: 'completed' },
    { id: 2, title: 'Research Paper Published', date: '2024-01-12', type: 'achievement', status: 'completed' },
    { id: 3, title: 'Team Meeting Attended', date: '2024-01-10', type: 'meeting', status: 'completed' },
    { id: 4, title: 'Performance Review Due', date: '2024-02-01', type: 'deadline', status: 'pending' },
    { id: 5, title: 'Training Course Completed', date: '2024-01-08', type: 'development', status: 'completed' }
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Q1 Performance Review', date: '2024-02-01', priority: 'high' },
    { id: 2, title: 'Research Proposal Submission', date: '2024-02-15', priority: 'medium' },
    { id: 3, title: 'Team Presentation', date: '2024-02-20', priority: 'low' },
    { id: 4, title: 'Annual Appraisal', date: '2024-03-01', priority: 'high' }
  ];

  const systemAlerts = [
    { id: 1, title: 'System Alert', message: 'Performance contract deadline approaching', time: '2 hours ago', type: 'warning' },
    { id: 2, title: 'Maintenance Notice', message: 'Scheduled system maintenance tonight', time: '1 day ago', type: 'info' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'on-track': return 'text-blue-600 dark:text-blue-400';
      case 'needs-improvement': return 'text-yellow-600 dark:text-yellow-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'on-track': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    toast.success(`Switched to ${period} period`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="My Dashboard"
          subtitle={`Welcome back, ${user?.name}`}
          right={
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">
                <User className="w-3 h-3 mr-1" />
                Officer Access
              </Badge>
              <Button variant="outline" size="sm" className="dark-mode-hover" onClick={() => handlePeriodChange(selectedPeriod)}>
                <Calendar className="w-4 h-4 mr-2" />
                {selectedPeriod}
              </Button>
            </div>
          }
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current KRAs</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.currentKRA}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <Target className="w-3 h-3 inline mr-1" />
                    Active objectives
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.performanceScore}%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +5% this quarter
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Objectives</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.completedObjectives}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    This quarter
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.pendingTasks}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Requires attention
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Days to Deadline</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.daysToDeadline}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Next review
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Alerts</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.systemAlerts}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    Unread messages
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My KRAs */}
          <Card className="dark-mode-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                My Key Result Areas (KRAs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myKRAs.map((kra) => (
                  <div key={kra.id} className="p-4 bg-card/50 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-foreground">{kra.title}</h3>
                      <Badge className={getStatusBadge(kra.status)}>
                        {kra.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{kra.progress}%</span>
                      </div>
                      <Progress value={kra.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Weight: {kra.weight}%</span>
                        <span>{kra.progress >= 90 ? 'Excellent' : kra.progress >= 80 ? 'Good' : 'Needs Improvement'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="dark-mode-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === 'submission' && <FileText className="w-4 h-4 text-primary" />}
                        {activity.type === 'achievement' && <Award className="w-4 h-4 text-primary" />}
                        {activity.type === 'meeting' && <MessageSquare className="w-4 h-4 text-primary" />}
                        {activity.type === 'deadline' && <Clock className="w-4 h-4 text-primary" />}
                        {activity.type === 'development' && <BookOpen className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="dark-mode-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">Due: {deadline.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${getPriorityColor(deadline.priority)} border-current`}
                      >
                        {deadline.priority}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="dark-mode-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-card/50 rounded-lg border border-border/50">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{alert.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="dark-mode-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Submit Self-Assessment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                View My KRAs
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Training Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};


