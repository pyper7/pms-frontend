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
import { toast } from '@/utils/toast';
import { 
  FileCheck, 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Star,
  MessageSquare,
  User,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

const OfficerReview: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selfAssessment, setSelfAssessment] = useState({
    overallScore: 0,
    comments: '',
    strengths: '',
    areasForImprovement: '',
    nextPeriodGoals: ''
  });

  const [reviews] = useState([
    {
      id: 1,
      period: "Q4 2023",
      status: "Completed",
      reviewer: "Dr. Sarah Johnson",
      reviewerRole: "Director",
      submittedDate: "2024-01-15",
      overallScore: 87,
      objectives: [
        {
          id: 1,
          title: "Research Excellence",
          target: "Complete 2 research projects",
          achievement: "Completed 2 research projects with 1 published",
          score: 90,
          weight: 30,
          comments: "Excellent work on research projects. The published paper shows high quality work."
        },
        {
          id: 2,
          title: "Team Collaboration",
          target: "Participate in 8 team meetings",
          achievement: "Participated in all 8 scheduled meetings plus 2 additional ones",
          score: 95,
          weight: 20,
          comments: "Outstanding collaboration skills. Always prepared and contributes meaningfully."
        },
        {
          id: 3,
          title: "Professional Development",
          target: "Complete 3 training courses",
          achievement: "Completed 2 training courses, 1 in progress",
          score: 70,
          weight: 25,
          comments: "Good progress on professional development. Consider completing the third course."
        },
        {
          id: 4,
          title: "Project Delivery",
          target: "Complete 4 project deliverables",
          achievement: "Completed 3 deliverables, 1 delayed due to external factors",
          score: 75,
          weight: 25,
          comments: "Good project delivery overall. The delay was due to external factors beyond control."
        }
      ],
      competencies: [
        {
          name: "Communication",
          rating: 4,
          comments: "Clear and effective communication in all interactions."
        },
        {
          name: "Problem Solving",
          rating: 5,
          comments: "Excellent problem-solving abilities. Consistently finds innovative solutions."
        },
        {
          name: "Leadership",
          rating: 3,
          comments: "Shows potential for leadership. Consider taking on more leadership opportunities."
        },
        {
          name: "Technical Skills",
          rating: 4,
          comments: "Strong technical skills. Keeps up with latest developments in the field."
        }
      ],
      overallComments: "Overall excellent performance this quarter. Shows strong technical skills and problem-solving abilities. Areas for improvement include taking on more leadership roles and completing professional development goals. Continue the good work.",
      strengths: [
        "Excellent research capabilities",
        "Strong problem-solving skills",
        "Great team collaboration",
        "Reliable and consistent performance"
      ],
      areasForImprovement: [
        "Take on more leadership opportunities",
        "Complete all professional development goals",
        "Improve time management for project delivery"
      ],
      nextPeriodGoals: [
        "Lead a cross-functional project",
        "Complete remaining training course",
        "Mentor junior team members"
      ]
    },
    {
      id: 2,
      period: "Q3 2023",
      status: "Completed",
      reviewer: "Dr. Michael Brown",
      reviewerRole: "Director",
      submittedDate: "2023-10-15",
      overallScore: 82,
      objectives: [
        {
          id: 1,
          title: "Research Excellence",
          target: "Complete 1 research project",
          achievement: "Completed 1 research project",
          score: 85,
          weight: 30,
          comments: "Good research work. Project delivered on time."
        },
        {
          id: 2,
          title: "Team Collaboration",
          target: "Participate in 6 team meetings",
          achievement: "Participated in 5 team meetings",
          score: 80,
          weight: 20,
          comments: "Good participation in team activities."
        }
      ],
      competencies: [
        {
          name: "Communication",
          rating: 4,
          comments: "Good communication skills."
        },
        {
          name: "Problem Solving",
          rating: 4,
          comments: "Strong problem-solving abilities."
        }
      ],
      overallComments: "Good performance overall. Room for improvement in meeting attendance.",
      strengths: ["Strong technical skills", "Good work quality"],
      areasForImprovement: ["Improve meeting attendance", "Better time management"],
      nextPeriodGoals: ["Attend all team meetings", "Improve project planning"]
    }
  ]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleSubmitSelfAssessment = () => {
    toast.success("Self-assessment submitted successfully");
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Performance Reviews"
          subtitle="View your performance reviews and submit self-assessments"
          right={
            <Button className="dark-mode-hover">
              <FileCheck className="w-4 h-4 mr-2" />
              Submit Self-Assessment
            </Button>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-1">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/officer-dashboard" className="hover:text-gray-700">Dashboard</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">Review</li>
            </ol>
          </nav>
        </div>

        {/* Self-Assessment Form */}
        <Card className="dark-mode-card dark-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Self-Assessment Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-20 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-20 bg-slate-200 rounded" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="overall-score">Overall Self-Score (0-100)</Label>
                  <Input
                    id="overall-score"
                    type="number"
                    min="0"
                    max="100"
                    value={selfAssessment.overallScore}
                    onChange={(e) => setSelfAssessment(prev => ({ ...prev, overallScore: Number(e.target.value) }))}
                    placeholder="Enter your overall performance score"
                  />
                </div>
                <div>
                  <Label htmlFor="comments">Overall Comments</Label>
                  <Textarea
                    id="comments"
                    value={selfAssessment.comments}
                    onChange={(e) => setSelfAssessment(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Describe your overall performance this period..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="strengths">Strengths</Label>
                  <Textarea
                    id="strengths"
                    value={selfAssessment.strengths}
                    onChange={(e) => setSelfAssessment(prev => ({ ...prev, strengths: e.target.value }))}
                    placeholder="List your key strengths and achievements..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="improvements">Areas for Improvement</Label>
                  <Textarea
                    id="improvements"
                    value={selfAssessment.areasForImprovement}
                    onChange={(e) => setSelfAssessment(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                    placeholder="Identify areas where you can improve..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="goals">Next Period Goals</Label>
                  <Textarea
                    id="goals"
                    value={selfAssessment.nextPeriodGoals}
                    onChange={(e) => setSelfAssessment(prev => ({ ...prev, nextPeriodGoals: e.target.value }))}
                    placeholder="Set your goals for the next period..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSubmitSelfAssessment} className="dark-mode-hover">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Submit Self-Assessment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review History */}
        <Card className="dark-mode-card dark-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Review History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
                    <div className="h-6 bg-slate-200 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{review.period} Review</h3>
                        <p className="text-sm text-muted-foreground">
                          Reviewed by {review.reviewer} ({review.reviewerRole})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {review.submittedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{review.overallScore}%</div>
                          <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>
                        <Badge className={getStatusColor(review.status)}>
                          {getStatusIcon(review.status)}
                          <span className="ml-1">{review.status}</span>
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Details Modal */}
        {selectedReview && (
          <Card className="dark-mode-card dark-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  {selectedReview.period} Review Details
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedReview(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Review Summary */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Review Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Reviewed by {selectedReview.reviewer} ({selectedReview.reviewerRole})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{selectedReview.overallScore}%</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objectives Performance
                </h3>
                <div className="space-y-4">
                  {selectedReview.objectives.map((objective: any) => (
                    <div key={objective.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{objective.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{objective.score}%</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <Label className="text-muted-foreground">Target</Label>
                          <p className="font-medium">{objective.target}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Achievement</Label>
                          <p className="font-medium">{objective.achievement}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{objective.score}%</span>
                        </div>
                        <Progress value={objective.score} className="h-2" />
                      </div>
                      <div className="mt-3">
                        <Label className="text-sm text-muted-foreground">Reviewer Comments</Label>
                        <p className="text-sm mt-1">{objective.comments}</p>
                      </div>
                    </div>
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
                  {selectedReview.competencies.map((comp: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{comp.name}</h4>
                          <p className="text-sm text-muted-foreground">{comp.comments}</p>
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Comments */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Overall Comments</h3>
                <Card className="dark-mode-card dark-shadow">
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{selectedReview.overallComments}</p>
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
                        {selectedReview.strengths.map((strength: string, index: number) => (
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
                        {selectedReview.areasForImprovement.map((area: string, index: number) => (
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
                      {selectedReview.nextPeriodGoals.map((goal: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default OfficerReview;
