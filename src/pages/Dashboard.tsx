import React from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Calendar, 
  BarChart3, 
  Bell, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText,
  Plus,
  ArrowRight,
  UserCheck,
  UserX,
  Award,
  Activity,
  Settings,
  BellRing
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

export const Dashboard = () => {
  // Mock data for HR dashboard
  const hrMetrics = {
    totalOfficers: 1247,
    activeOfficers: 1189,
    pendingOnboarding: 23,
    vacantPosts: 15,
    activeAppraisals: 8,
    completedAppraisals: 1156,
    pendingReviews: 89,
    overdueTasks: 12,
    systemAlerts: 2
  };

  const recentActivities = [
    {
      id: 1,
      type: 'onboarding',
      title: 'New Officer Onboarded',
      description: 'John Doe completed onboarding process',
      time: '2 hours ago',
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'appraisal',
      title: 'Appraisal Period Started',
      description: '2024 Q4 Appraisal period is now active',
      time: '4 hours ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'post',
      title: 'New Post Created',
      description: 'Senior Research Officer position added',
      time: '6 hours ago',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Alert',
      description: 'Performance contract deadline approaching',
      time: '8 hours ago',
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Officer',
      description: 'Onboard new staff member',
      icon: Plus,
      href: '/manage-officers',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create Post',
      description: 'Define new organizational position',
      icon: Target,
      href: '/manage-posts',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Start Appraisal',
      description: 'Launch new appraisal period',
      icon: Calendar,
      href: '/appraisal-periods',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Manage KRAs',
      description: 'Configure performance indicators',
      icon: BarChart3,
      href: '/kra-kpi',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Set Permissions',
      description: 'Configure user roles and access',
      icon: Shield,
      href: '/roles-management',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
  ];

  const performanceStats = [
    {
      title: 'Appraisal Completion Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Average Performance Score',
      value: '87.5',
      change: '+1.8',
      trend: 'up',
      icon: Award,
      color: 'text-blue-600'
    },
    {
      title: 'Onboarding Time',
      value: '3.2 days',
      change: '-0.5 days',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '0.0%',
      trend: 'stable',
      icon: Activity,
      color: 'text-green-600'
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="HR Dashboard"
          subtitle="Welcome back! Here's what's happening in your organization."
          right={
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                System Healthy
              </Badge>
              <Button variant="outline" size="sm" className="dark-mode-hover">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          }
        />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Officers</p>
                  <p className="text-3xl font-bold text-foreground">{hrMetrics.totalOfficers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +5.2% from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Appraisals</p>
                  <p className="text-3xl font-bold text-foreground">{hrMetrics.activeAppraisals}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {hrMetrics.pendingReviews} pending reviews
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vacant Posts</p>
                  <p className="text-3xl font-bold text-foreground">{hrMetrics.vacantPosts}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    {hrMetrics.pendingOnboarding} pending onboarding
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Alerts</p>
                  <p className="text-3xl font-bold text-foreground">{hrMetrics.systemAlerts}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    <BellRing className="w-3 h-3 inline mr-1" />
                    {hrMetrics.systemAlerts} system alerts
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                      {stat.trend === 'down' && <TrendingUp className="w-3 h-3 inline mr-1 rotate-180" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.href}>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <action.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Activities
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Maintenance
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Important Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Performance Contract Deadline</p>
                      <p className="text-xs text-red-600">15 contracts due in 3 days</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">System Maintenance</p>
                      <p className="text-xs text-yellow-600">Scheduled for Sunday 2AM-4AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">New Feature Available</p>
                      <p className="text-xs text-blue-600">Enhanced reporting dashboard is ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};