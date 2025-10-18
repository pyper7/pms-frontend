import React, { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  Download,
  MessageSquare,
  Star,
  Calendar,
  User,
  Target,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/utils/toast";

type TeamMember = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  appraisalStatus: "Not Started" | "In Progress" | "Submitted" | "Under Review" | "Completed";
  submissionDate?: string;
  score?: number;
  lastActivity: string;
  progress: number;
  appraisalDetails?: {
    period: string;
    objectives: Array<{
      id: string;
      title: string;
      description: string;
      target: string;
      achievement: string;
      score: number;
      weight: number;
      status: "Not Started" | "In Progress" | "Completed" | "Exceeded";
    }>;
    competencies: Array<{
      id: string;
      name: string;
      description: string;
      rating: number;
      comments: string;
    }>;
    overallComments: string;
    strengths: string[];
    areasForImprovement: string[];
    nextPeriodGoals: string[];
  };
};

type AppraisalReview = {
  id: string;
  teamMemberId: string;
  teamMemberName: string;
  period: string;
  status: "Pending Review" | "Reviewed" | "Approved" | "Rejected";
  submittedAt: string;
  score: number;
  comments: string;
  reviewerNotes: string;
};

const DirectorTeamAppraisals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewScore, setReviewScore] = useState<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Mock data for team members
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Adetola Akeju",
      position: "Senior Program Officer",
      department: "PMD",
      email: "adetola.akeju@ohcsf.gov.ng",
      appraisalStatus: "Submitted",
      submissionDate: "2025-01-15",
      score: 88,
      lastActivity: "2 hours ago",
      progress: 100,
      appraisalDetails: {
        period: "Q4 2024",
        objectives: [
          {
            id: "obj-1",
            title: "Project Management Excellence",
            description: "Successfully manage and deliver 3 major projects within budget and timeline",
            target: "Complete 3 projects",
            achievement: "Completed 3 projects with 1 delivered ahead of schedule",
            score: 95,
            weight: 30,
            status: "Exceeded"
          },
          {
            id: "obj-2",
            title: "Team Leadership",
            description: "Lead and mentor a team of 5 junior officers",
            target: "Conduct monthly team meetings and quarterly reviews",
            achievement: "Conducted all scheduled meetings plus additional training sessions",
            score: 90,
            weight: 25,
            status: "Completed"
          },
          {
            id: "obj-3",
            title: "Stakeholder Engagement",
            description: "Maintain positive relationships with external partners",
            target: "Achieve 90% satisfaction rating",
            achievement: "Achieved 94% satisfaction rating from partner feedback",
            score: 94,
            weight: 20,
            status: "Exceeded"
          }
        ],
        competencies: [
          {
            id: "comp-1",
            name: "Communication",
            description: "Effective verbal and written communication skills",
            rating: 4,
            comments: "Excellent communication skills, both written and verbal. Clear and concise in all interactions."
          },
          {
            id: "comp-2",
            name: "Problem Solving",
            description: "Ability to identify and solve complex problems",
            rating: 5,
            comments: "Outstanding problem-solving abilities. Consistently finds innovative solutions to challenges."
          },
          {
            id: "comp-3",
            name: "Leadership",
            description: "Ability to lead and motivate team members",
            rating: 4,
            comments: "Strong leadership qualities. Team members respect and follow guidance effectively."
          }
        ],
        overallComments: "Adetola has demonstrated exceptional performance this quarter. Her project management skills are outstanding, and she has consistently exceeded expectations. She shows great initiative in mentoring junior staff and has built strong relationships with external partners. Her communication skills are excellent, and she approaches challenges with a positive, solution-oriented mindset.",
        strengths: [
          "Excellent project management skills",
          "Strong leadership and mentoring abilities",
          "Outstanding communication skills",
          "Proactive problem-solving approach",
          "Great stakeholder relationship management"
        ],
        areasForImprovement: [
          "Consider taking on more strategic planning responsibilities",
          "Explore opportunities to present at industry conferences"
        ],
        nextPeriodGoals: [
          "Lead a cross-departmental initiative",
          "Develop a training program for new team members",
          "Present findings at the annual conference"
        ]
      }
    },
    {
      id: "2", 
      name: "Fatima Ibrahim",
      position: "Program Officer",
      department: "PMD",
      email: "fatima.ibrahim@ohcsf.gov.ng",
      appraisalStatus: "In Progress",
      submissionDate: undefined,
      score: undefined,
      lastActivity: "1 day ago",
      progress: 65
    },
    {
      id: "3",
      name: "Michael Okafor",
      position: "Assistant Program Officer", 
      department: "PMD",
      email: "michael.okafor@ohcsf.gov.ng",
      appraisalStatus: "Not Started",
      submissionDate: undefined,
      score: undefined,
      lastActivity: "3 days ago",
      progress: 0
    },
    {
      id: "4",
      name: "Grace Okonkwo",
      position: "Program Officer",
      department: "PMD", 
      email: "grace.okonkwo@ohcsf.gov.ng",
      appraisalStatus: "Under Review",
      submissionDate: "2025-01-12",
      score: 92,
      lastActivity: "4 hours ago",
      progress: 100
    }
  ];

  // Mock data for appraisal reviews
  const appraisalReviews: AppraisalReview[] = [
    {
      id: "1",
      teamMemberId: "1",
      teamMemberName: "Adetola Akeju",
      period: "2025 Q1",
      status: "Pending Review",
      submittedAt: "2025-01-15",
      score: 88,
      comments: "Excellent performance in project management and stakeholder engagement.",
      reviewerNotes: ""
    },
    {
      id: "2", 
      teamMemberId: "4",
      teamMemberName: "Grace Okonkwo",
      period: "2025 Q1",
      status: "Reviewed",
      submittedAt: "2025-01-12",
      score: 92,
      comments: "Outstanding work on policy development and team leadership.",
      reviewerNotes: "Approved with minor recommendations for improvement in documentation."
    }
  ];

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || member.appraisalStatus.toLowerCase().replace(" ", "-") === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Submitted": return "bg-blue-100 text-blue-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-orange-100 text-orange-800";
      case "Not Started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-4 h-4" />;
      case "Submitted": return <FileText className="w-4 h-4" />;
      case "Under Review": return <Clock className="w-4 h-4" />;
      case "In Progress": return <Target className="w-4 h-4" />;
      case "Not Started": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Team Appraisals"
          subtitle="Review and manage performance appraisals for your team members."
          right={
            <Button variant="outline" className="dark-mode-hover">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-1">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/director-dashboard" className="hover:text-gray-700">Director Dashboard</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">Team Appraisals</li>
            </ol>
          </nav>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="dark-mode-card dark-shadow">
                  <CardContent className="p-4">
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
                        <div className="h-6 bg-slate-200 rounded w-8" />
                      </div>
                      <div className="p-3 rounded-full bg-slate-200 w-10 h-10" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : [
                { label: "Completed", value: 1, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
                { label: "Submitted", value: 1, icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
                { label: "In Progress", value: 1, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
                { label: "Not Started", value: 1, icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-100" },
              ].map((stat, i) => (
                <Card key={i} className="dark-mode-card dark-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Search and Filter */}
        <Card className="dark-mode-card dark-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search team members by name, position, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="completed">Completed</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="dark-mode-card dark-shadow">
                  <CardHeader>
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                        <div>
                          <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-24" />
                        </div>
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-20" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                      </div>
                      <div className="h-2 bg-slate-200 rounded w-full" />
                      <div className="flex gap-2">
                        <div className="h-8 bg-slate-200 rounded flex-1" />
                        <div className="h-8 bg-slate-200 rounded flex-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : filteredMembers.map((member) => (
                <Card key={member.id} className="dark-mode-card dark-shadow hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600">{member.position}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(member.appraisalStatus)}>
                    {getStatusIcon(member.appraisalStatus)}
                    <span className="ml-1">{member.appraisalStatus}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500">Department</Label>
                    <p className="font-medium">{member.department}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium">{member.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Last Activity</Label>
                    <p className="font-medium">{member.lastActivity}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Progress</Label>
                    <p className="font-medium">{member.progress}%</p>
                  </div>
                </div>

                {member.score && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Score: {member.score}%</span>
                  </div>
                )}

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.progress}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {member.appraisalStatus === "Submitted" && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedMember(member);
                        setShowReviewModal(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            ))}
        </div>

        {/* View Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Appraisal Details - {selectedMember?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedMember?.appraisalDetails && (
              <div className="space-y-6">
                {/* Appraisal Period & Score */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Appraisal Period: {selectedMember.appraisalDetails.period}</h3>
                    <p className="text-sm text-muted-foreground">Overall Score: {selectedMember.score}%</p>
                  </div>
                  <Badge className={getStatusColor(selectedMember.appraisalStatus)}>
                    {getStatusIcon(selectedMember.appraisalStatus)}
                    <span className="ml-1">{selectedMember.appraisalStatus}</span>
                  </Badge>
                </div>

                {/* Objectives */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Objectives & KPIs
                  </h3>
                  <div className="space-y-4">
                    {selectedMember.appraisalDetails.objectives.map((objective) => (
                      <Card key={objective.id} className="dark-mode-card dark-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{objective.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">
                                Weight: {objective.weight}%
                              </Badge>
                              <div className="text-sm font-medium">Score: {objective.score}%</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-muted-foreground">Target</Label>
                              <p className="font-medium">{objective.target}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Achievement</Label>
                              <p className="font-medium">{objective.achievement}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{objective.score}%</span>
                            </div>
                            <Progress value={objective.score} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Competencies */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Competencies
                  </h3>
                  <div className="space-y-3">
                    {selectedMember.appraisalDetails.competencies.map((comp) => (
                      <Card key={comp.id} className="dark-mode-card dark-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{comp.name}</h4>
                              <p className="text-sm text-muted-foreground">{comp.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">{comp.rating}/5</div>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < comp.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{comp.comments}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Overall Comments */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Overall Comments</h3>
                  <Card className="dark-mode-card dark-shadow">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{selectedMember.appraisalDetails.overallComments}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Strengths & Areas for Improvement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-600">Strengths</h3>
                    <Card className="dark-mode-card dark-shadow">
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {selectedMember.appraisalDetails.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-amber-600">Areas for Improvement</h3>
                    <Card className="dark-mode-card dark-shadow">
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {selectedMember.appraisalDetails.areasForImprovement.map((area, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Next Period Goals */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Next Period Goals</h3>
                  <Card className="dark-mode-card dark-shadow">
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {selectedMember.appraisalDetails.nextPeriodGoals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Modal */}
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Review Appraisal - {selectedMember?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-6">
                {/* Appraisal Summary */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedMember.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMember.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedMember.score}%</div>
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="review-score">Review Score (0-100)</Label>
                    <Input
                      id="review-score"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewScore}
                      onChange={(e) => setReviewScore(Number(e.target.value))}
                      placeholder="Enter your review score"
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-notes">Review Notes</Label>
                    <Textarea
                      id="review-notes"
                      placeholder="Add your review comments and feedback..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewNotes("");
                      setReviewScore(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast.error("Changes requested");
                      setShowReviewModal(false);
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success("Appraisal approved successfully");
                      setShowReviewModal(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DirectorTeamAppraisals;


