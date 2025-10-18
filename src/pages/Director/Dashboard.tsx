import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from "recharts";
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';
import {
  Trophy,
  Target,
  Users,
  FileCheck,
  Bell,
  TrendingUp,
  ArrowRight,
  Calendar,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  FileText,
  PieChart,
  Activity,
  Eye,
  Download,
  Settings,
  RefreshCw,
  Star,
  TrendingDown,
  AlertTriangle,
  UserX,
  Flag,
  MessageSquare,
  Building,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Plus,
  Filter,
  Search,
  BookOpen,
  Target as TargetIcon,
  Users as UsersIcon,
  FileCheck as FileCheckIcon,
  BarChart3 as BarChart3Icon,
  TrendingUp as TrendingUpIcon,
  Award as AwardIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  UserCheck as UserCheckIcon,
  FileText as FileTextIcon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  Eye as EyeIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  RefreshCw as RefreshCwIcon,
  Star as StarIcon,
  TrendingDown as TrendingDownIcon,
  AlertTriangle as AlertTriangleIcon,
  UserX as UserXIcon,
  Flag as FlagIcon,
  MessageSquare as MessageSquareIcon,
  Building as BuildingIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  ChevronRight as ChevronRightIcon,
  Plus as PlusIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  BookOpen as BookOpenIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

const DirectorDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Enhanced KPI Summary with all features
  const kpiSummary = [
    { 
      label: "Department KRAs", 
      value: 18, 
      achieved: 12, 
      icon: Target, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
      trend: "+12%",
      trendUp: true
    },
    { 
      label: "Team Appraisals", 
      value: 42, 
      achieved: 28, 
      icon: Users, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-100 dark:bg-blue-900/20",
      trend: "+8%",
      trendUp: true
    },
    { 
      label: "Pending Approvals", 
      value: 7, 
      achieved: 0, 
      icon: FileCheck, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-100 dark:bg-amber-900/20",
      trend: "-3",
      trendUp: false
    },
    { 
      label: "Low Performers", 
      value: 3, 
      achieved: 0, 
      icon: UserX, 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-100 dark:bg-red-900/20",
      trend: "-1",
      trendUp: false
    },
  ];

  // Performance Management Overview
  const performanceOverview = [
    { 
      title: "Performance Contracts", 
      total: 45, 
      completed: 38, 
      pending: 7, 
      icon: FileText, 
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      href: "/director/supervisee/performance-contract"
    },
    { 
      title: "Performance Reviews", 
      total: 45, 
      completed: 32, 
      pending: 13, 
      icon: UserCheck, 
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/10",
      href: "/director/supervisee/performance-review"
    },
    { 
      title: "Appraisals", 
      total: 45, 
      completed: 28, 
      pending: 17, 
      icon: Award, 
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/10",
      href: "/director/supervisee/appraisal"
    },
  ];

  // Quick Actions
  const quickActions = [
    { 
      title: "Manage KRAs", 
      desc: "Department objectives & KPIs", 
      href: "/director/department-kras", 
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/10"
    },
    { 
      title: "Staff Reports", 
      desc: "Performance analytics", 
      href: "/director/reports/staff", 
      icon: BarChart3,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/10"
    },
    { 
      title: "Department Summary", 
      desc: "Department performance", 
      href: "/director/reports/department", 
      icon: PieChart,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/10"
    },
    { 
      title: "Low Performers", 
      desc: "Performance improvement", 
      href: "/director/reports/low-performing", 
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/10"
    },
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: "approval",
      title: "Performance Contract Approved",
      description: "Dr. Sarah Johnson's contract has been approved",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400"
    },
    {
      id: 2,
      type: "review",
      title: "Monthly Review Completed",
      description: "Mr. Michael Adebayo's review is ready for submission",
      time: "4 hours ago",
      icon: FileCheck,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 3,
      type: "alert",
      title: "Performance Issue Identified",
      description: "Mr. James Okonkwo requires performance improvement plan",
      time: "1 day ago",
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400"
    },
    {
      id: 4,
      type: "milestone",
      title: "Department KRA Updated",
      description: "Research Excellence objective progress updated to 85%",
      time: "2 days ago",
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  // Team Performance Data
  const teamPerformanceData = [
    { name: "Research & Development", completed: 12, pending: 3, overdue: 1, score: 87 },
    { name: "Administration", completed: 8, pending: 5, overdue: 2, score: 72 },
    { name: "Finance", completed: 10, pending: 2, overdue: 0, score: 91 },
    { name: "Human Resources", completed: 6, pending: 4, overdue: 1, score: 78 },
  ];

  // Department Objectives Progress
  const objectivesData = [
    { name: "Research Excellence", progress: 85, target: 100, status: "On Track" },
    { name: "Project Delivery", progress: 92, target: 100, status: "On Track" },
    { name: "Staff Development", progress: 65, target: 100, status: "At Risk" },
    { name: "Innovation & Technology", progress: 40, target: 100, status: "Behind" },
    { name: "Stakeholder Engagement", progress: 100, target: 100, status: "Completed" },
  ];

  const progress = Math.round((12 / 18) * 100);
  const objectivesChartData = [
    { name: "Achieved", value: 12, color: "#16a34a" },
    { name: "Remaining", value: 6, color: "#e5e7eb" },
  ];

  // Performance contracts analytics
  const contractsData = [
    { status: "Active", count: 24, color: "#2563eb" },
    { status: "Due Soon", count: 8, color: "#f59e0b" },
    { status: "Overdue", count: 3, color: "#dc2626" },
  ];

  // Personal analytics trend
  const personalTrend = [
    { month: "Apr", approvals: 6, turnaround: 3.2 },
    { month: "May", approvals: 7, turnaround: 3.0 },
    { month: "Jun", approvals: 5, turnaround: 2.8 },
    { month: "Jul", approvals: 8, turnaround: 2.6 },
    { month: "Aug", approvals: 9, turnaround: 2.4 },
    { month: "Sep", approvals: 11, turnaround: 2.2 },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonCard />
            </div>
            <div>
              <SkeletonCard />
            </div>
          </div>
          <div className="grid-stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        {/* Enhanced Header */}
        <div className="page-header">
          <PageHeader
            title="Director Dashboard"
            subtitle="Comprehensive overview of departmental performance, team management, and strategic objectives"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Director Dashboard' }
            ]}
            right={
              <div className="flex items-center gap-3">
                <Button variant="outline" asChild className="focus-visible">
                  <Link to="/director/department-kras">
                    <Target className="w-4 h-4 mr-2" />
                    Manage KRAs
                  </Link>
                </Button>
                <Button asChild className="focus-visible">
                  <Link to="/director/reports/staff">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
              </div>
            }
          />
        </div>

        {/* Enhanced KPI Summary */}
        <StaggeredChildren>
          <div className="grid-stats">
            {kpiSummary.map((kpi, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Card className="card-base card-hover group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-body-small text-muted-foreground mb-1">{kpi.label}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                          <div className="flex items-center gap-1">
                            {kpi.trendUp ? (
                              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                            )}
                            <span className={`text-body-small font-medium ${kpi.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {kpi.trend}
                            </span>
                          </div>
                        </div>
                        {kpi.achieved > 0 && (
                          <p className="text-caption text-muted-foreground mt-1">
                            {kpi.achieved} completed
                          </p>
                        )}
                      </div>
                      <div className={`p-3 rounded-full ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </StaggeredChildren>

        {/* Performance Management Overview */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Performance Management Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {performanceOverview.map((item, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <Link to={item.href} className="group">
                    <Card className="card-base card-hover group-hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg ${item.bg}`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">{item.completed}</p>
                            <p className="text-body-small text-muted-foreground">of {item.total}</p>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-2">
                            <Progress value={(item.completed / item.total) * 100} className="h-2" />
                          </div>
                          <span className="text-body-small font-medium text-muted-foreground">
                            {Math.round((item.completed / item.total) * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
                            {item.pending} pending
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <Link to={action.href} className="group">
                    <Card className="card-base card-hover group-hover:scale-105">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.bg}`}>
                            <action.icon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-body-small text-muted-foreground">{action.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Objectives Progress */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Department Objectives Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Achieved 12 of 18 objectives</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={objectivesChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={2}
                      >
                        {objectivesChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value as number} objectives`} />
                      <Legend verticalAlign="bottom" height={24} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance by Department */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Team Performance by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#16a34a" radius={[4,4,0,0]} />
                    <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4,4,0,0]} />
                    <Bar dataKey="overdue" name="Overdue" fill="#dc2626" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <FadeIn key={activity.id} delay={i * 100}>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className={`p-2 rounded-full ${activity.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10 dark:bg-opacity-20`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Objectives Status */}
          <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Department Objectives Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {objectivesData.map((objective, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{objective.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={
                            objective.status === 'Completed' ? 'text-green-600 dark:text-green-400' :
                            objective.status === 'On Track' ? 'text-blue-600 dark:text-blue-400' :
                            objective.status === 'At Risk' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }
                        >
                          {objective.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Contracts Analytics */}
        <Card className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Performance Contracts Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contractsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => [`${v}`, 'Contracts']} />
                  <Bar dataKey="count" name="Contracts">
                    {contractsData.map((c, i) => (
                      <Cell key={i} fill={c.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DirectorDashboardPage;


