import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Calendar, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';

interface Supervisee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  avatar?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  lastActive: string;
  performanceScore: number;
  contractsCompleted: number;
  reviewsCompleted: number;
  appraisalsCompleted: number;
  nextReviewDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const DirectorSuperviseeList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const location = useLocation();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for supervisees
  const supervisees: Supervisee[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Research Analyst',
      department: 'Research & Development',
      location: 'New York, NY',
      status: 'Active',
      lastActive: '2 hours ago',
      performanceScore: 87,
      contractsCompleted: 2,
      reviewsCompleted: 8,
      appraisalsCompleted: 1,
      nextReviewDate: '2024-02-15',
      priority: 'High'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Research Officer',
      department: 'Research & Development',
      location: 'San Francisco, CA',
      status: 'Active',
      lastActive: '1 day ago',
      performanceScore: 92,
      contractsCompleted: 1,
      reviewsCompleted: 6,
      appraisalsCompleted: 1,
      nextReviewDate: '2024-02-20',
      priority: 'High'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      position: 'Junior Analyst',
      department: 'Research & Development',
      location: 'Austin, TX',
      status: 'On Leave',
      lastActive: '1 week ago',
      performanceScore: 78,
      contractsCompleted: 1,
      reviewsCompleted: 4,
      appraisalsCompleted: 0,
      nextReviewDate: '2024-03-01',
      priority: 'Medium'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      position: 'Research Specialist',
      department: 'Research & Development',
      location: 'Seattle, WA',
      status: 'Active',
      lastActive: '3 hours ago',
      performanceScore: 85,
      contractsCompleted: 2,
      reviewsCompleted: 7,
      appraisalsCompleted: 1,
      nextReviewDate: '2024-02-25',
      priority: 'Medium'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      position: 'Senior Research Officer',
      department: 'Research & Development',
      location: 'Boston, MA',
      status: 'Active',
      lastActive: '30 minutes ago',
      performanceScore: 94,
      contractsCompleted: 3,
      reviewsCompleted: 9,
      appraisalsCompleted: 2,
      nextReviewDate: '2024-02-10',
      priority: 'High'
    }
  ];

  // Get current page type from URL
  const getPageType = () => {
    const path = location.pathname;
    if (path.includes('/performance-contract')) return 'contract';
    if (path.includes('/performance-review')) return 'review';
    if (path.includes('/appraisal')) return 'appraisal';
    return 'contract';
  };

  const pageType = getPageType();
  const pageConfig = {
    contract: {
      title: 'Supervisee Performance Contracts',
      subtitle: 'Manage and review performance contracts for your team members',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      actionText: 'View Contract',
      actionHref: (id: string) => `/director/supervisee/performance-contract/${id}`
    },
    review: {
      title: 'Supervisee Performance Reviews',
      subtitle: 'Review monthly performance evaluations for your team members',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      actionText: 'View Review',
      actionHref: (id: string) => `/director/supervisee/performance-review/${id}`
    },
    appraisal: {
      title: 'Supervisee Appraisals',
      subtitle: 'Manage annual performance appraisals for your team members',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      actionText: 'View Appraisal',
      actionHref: (id: string) => `/director/supervisee/appraisal/${id}`
    }
  };

  const config = pageConfig[pageType];

  // Filter supervisees
  const filteredSupervisees = supervisees.filter(supervisee => {
    const matchesSearch = supervisee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || supervisee.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || supervisee.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Get performance score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title={config.title}
          subtitle={config.subtitle}
          right={
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {filteredSupervisees.length} supervisees
              </Badge>
              <Button variant="outline" size="sm">
                <config.icon className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-1">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/director-dashboard" className="hover:text-gray-700">Director Dashboard</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link to="/director/supervisee" className="hover:text-gray-700">Supervisee</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">
                {pageType === 'contract' ? 'Performance Contracts' : 
                 pageType === 'review' ? 'Performance Reviews' : 'Appraisals'}
              </li>
            </ol>
          </nav>
        </div>

        {/* Filters */}
        <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search supervisees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Supervisees List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupervisees.map((supervisee) => (
            <FadeIn key={supervisee.id}>
              <Card className="dark-mode-card dark-shadow hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={supervisee.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {supervisee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {supervisee.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {supervisee.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(supervisee.status)}>
                        {supervisee.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(supervisee.priority)}>
                        {supervisee.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{supervisee.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{supervisee.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{supervisee.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{supervisee.department}</span>
                    </div>
                  </div>


                  {/* Next Review/Contract/Appraisal */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {pageType === 'contract' ? 'Next Contract:' : 
                         pageType === 'review' ? 'Next Review:' : 'Next Appraisal:'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(supervisee.nextReviewDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button 
                      asChild 
                      className="w-full group-hover:bg-blue-600 transition-colors"
                      size="sm"
                    >
                      <Link to={config.actionHref(supervisee.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {config.actionText}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Empty State */}
        {filteredSupervisees.length === 0 && (
          <Card className="dark-mode-card dark-shadow bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No supervisees found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm || statusFilter !== 'All' || priorityFilter !== 'All'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No supervisees are currently assigned to you.'}
              </p>
              {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setPriorityFilter('All');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DirectorSuperviseeList;
