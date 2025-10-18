import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  FileCheck, 
  Target, 
  BarChart3, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Award,
  Activity,
  Bell,
  ArrowRight,
  Eye,
  Download,
  Plus,
  User,
  Star,
  PieChart,
  LineChart,
  Settings,
  RefreshCw,
  BellRing,
  CheckCircle2,
  XCircle,
  Timer,
  BookOpen,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';

export const OfficerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for officer dashboard
  const officerMetrics = {
    performanceScore: 87.5,
    contractsCompleted: 2,
    reviewsCompleted: 8,
    appraisalsCompleted: 1,
    pendingTasks: 3,
    upcomingDeadlines: 2,
    notifications: 5,
    achievements: 12
  };

  const performanceData = {
    currentContract: {
      id: 'PC-2024-001',
      status: 'Approved',
      progress: 75,
      kpis: 4,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      nextReview: '2024-02-15'
    },
    monthlyReviews: [
      { month: 'January', score: 4.2, status: 'Completed' },
      { month: 'February', score: 4.1, status: 'Completed' },
      { month: 'March', score: 4.3, status: 'Completed' },
      { month: 'April', score: 4.0, status: 'Under Review' },
      { month: 'May', score: null, status: 'Pending' }
    ],
    competencies: {
      generic: 4.2,
      functional: 4.1,
      ethics: 4.5
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'contract',
      title: 'Performance Contract Approved',
      description: 'Your 2024 performance contract has been approved by supervisor',
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 2,
      type: 'review',
      title: 'Monthly Review Submitted',
      description: 'March 2024 performance review submitted for supervisor approval',
      time: '1 day ago',
      icon: FileCheck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Upcoming Deadline',
      description: 'April monthly review due in 3 days',
      time: '2 days ago',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'Completed 5 consecutive monthly reviews',
      time: '3 days ago',
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  const quickActions = [
    {
      title: 'Performance Contract',
      description: 'View and manage your performance contract',
      icon: FileText,
      href: '/officer/performance-contract',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Monthly Review',
      description: 'Submit your monthly performance review',
      icon: FileCheck,
      href: '/officer/performance-review',
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Appraisal',
      description: 'Complete your annual performance appraisal',
      icon: Target,
      href: '/officer/appraisal',
      color: 'bg-purple-500 hover:bg-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Reports & Analytics',
      description: 'View your performance reports and analytics',
      icon: BarChart3,
      href: '/officer/report',
      color: 'bg-orange-500 hover:bg-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'April Monthly Review',
      type: 'review',
      dueDate: '2024-04-30',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Q2 Performance Contract Update',
      type: 'contract',
      dueDate: '2024-05-15',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Competency Assessment',
      type: 'assessment',
      dueDate: '2024-06-01',
      priority: 'low',
      status: 'pending'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Consistent Performer',
      description: 'Maintained 4.0+ rating for 6 months',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 2,
      title: 'Early Bird',
      description: 'Submitted reviews 2 days early',
      icon: Zap,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 3,
      title: 'Goal Crusher',
      description: 'Exceeded 3 KPIs this quarter',
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Under Review': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'Pending': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'Approved': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      <div className="page-container bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        {/* Header */}
        <PageHeader
          title="Performance Dashboard"
          subtitle={`Welcome back! Here's your performance overview for ${formatDate(currentTime)}`}
          right={
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-body-small text-muted-foreground">Current Time</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatTime(currentTime)}
                </div>
              </div>
              <Badge variant="outline" className="badge-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Active
              </Badge>
            </div>
          }
        />

        {/* Key Metrics Grid */}
        <div className="grid-stats">
          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Performance Score</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.performanceScore}%</p>
                  <p className="text-caption text-green-600 dark:text-green-400 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +2.1% from last month
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-full shadow-lg">
                  <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Active Contract</p>
                  <p className="text-3xl font-bold text-foreground">{performanceData.currentContract.progress}%</p>
                  <p className="text-caption text-blue-600 dark:text-blue-400 mt-1 font-medium">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Next review: {performanceData.currentContract.nextReview}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-full shadow-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Reviews Completed</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.reviewsCompleted}</p>
                  <p className="text-caption text-purple-600 dark:text-purple-400 mt-1 font-medium">
                    <FileCheck className="w-3 h-3 inline mr-1" />
                    {officerMetrics.pendingTasks} pending tasks
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full shadow-lg">
                  <FileCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-base card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-muted-foreground">Achievements</p>
                  <p className="text-3xl font-bold text-foreground">{officerMetrics.achievements}</p>
                  <p className="text-caption text-orange-600 dark:text-orange-400 mt-1 font-medium">
                    <Star className="w-3 h-3 inline mr-1" />
                    {officerMetrics.notifications} new notifications
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-full shadow-lg">
                  <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="card-base">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg shadow-md">
                    <Zap className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </div>
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <StaggeredChildren>
                    {[...Array(4)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </StaggeredChildren>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                    <Link key={index} to={action.href}>
                      <div className="p-6 border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group card-base hover:bg-accent/5">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl shadow-md ${action.iconBg}`}>
                            <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-body-small text-muted-foreground mt-1">{action.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div>
            <Card className="card-base">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-lg shadow-md">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Contract Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body-small font-medium text-foreground">Contract Progress</span>
                    <span className="text-body-small text-muted-foreground font-semibold">{performanceData.currentContract.progress}%</span>
                  </div>
                  <Progress value={performanceData.currentContract.progress} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Competency Scores */}
                <div className="space-y-3">
                  <h4 className="text-body-small font-semibold text-foreground">Competency Scores</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-caption text-muted-foreground">Generic</span>
                      <span className="text-caption font-medium text-foreground">{performanceData.competencies.generic}/5</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-caption text-muted-foreground">Functional</span>
                      <span className="text-caption font-medium text-foreground">{performanceData.competencies.functional}/5</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-caption text-muted-foreground">Ethics</span>
                      <span className="text-caption font-medium text-foreground">{performanceData.competencies.ethics}/5</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Reviews */}
                <div>
                  <h4 className="text-body-small font-semibold text-foreground mb-3">Recent Reviews</h4>
                  <div className="space-y-2">
                    {performanceData.monthlyReviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <span className="text-caption text-muted-foreground font-medium">{review.month}</span>
                        <div className="flex items-center gap-2">
                          {review.score && (
                            <span className="text-caption font-medium text-foreground">{review.score}/5</span>
                          )}
                          <Badge className={`text-xs px-2 py-1 font-medium ${getStatusColor(review.status)}`}>
                            {review.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-600 shadow-xl dark:shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg shadow-md">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-slate-800 dark:text-slate-100">Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                    <div className={`p-2 rounded-full shadow-sm ${activity.bgColor}`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{activity.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                <Button variant="outline" size="sm" className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200">
                  View All Activities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-600 shadow-xl dark:shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-lg shadow-md">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-slate-800 dark:text-slate-100">Upcoming Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs px-2 py-1 font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                <Button variant="outline" size="sm" className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200">
                  View All Tasks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-600 shadow-xl dark:shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-lg shadow-md">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-slate-800 dark:text-slate-100">Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg dark:hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 bg-slate-50/50 dark:bg-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg shadow-sm ${achievement.bgColor}`}>
                      <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{achievement.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OfficerDashboard;
