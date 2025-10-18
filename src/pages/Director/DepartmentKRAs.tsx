import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Split, Target, BarChart3, TrendingUp, Calendar, Users, CheckCircle, AlertCircle, Clock, Plus, Edit, Trash2, Eye, Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/utils/toast";
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStats } from '@/components/SkeletonLoader';
import { LoadingButton, FadeIn, SlideIn, HoverScale, StaggeredChildren } from '@/components/MicroInteractions';

const DirectorDepartmentKRAs: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Mock data: objectives assigned to the department
  const department = "Research & Development";
  const [activeTab, setActiveTab] = useState("overview");
  
  // Enhanced objectives data with more details
  const objectives = [
    { 
      id: "obj-1", 
      title: "Fund research & publish outcomes", 
      description: "Secure funding for research projects and ensure publication of research outcomes",
      status: "On Track",
      priority: "High",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      kpis: [
        { id: "kpi-1", name: "Projects funded", target: 20, weight: 25, progress: 12, unit: "projects" },
        { id: "kpi-2", name: "Papers published", target: 10, weight: 15, progress: 6, unit: "papers" },
        { id: "kpi-3", name: "Research grants secured", target: 5, weight: 20, progress: 3, unit: "grants" },
      ]
    },
    { 
      id: "obj-2", 
      title: "Strengthen industry collaboration", 
      description: "Build strategic partnerships with industry leaders and academic institutions",
      status: "At Risk",
      priority: "Medium",
      startDate: "2024-02-01",
      endDate: "2024-11-30",
      kpis: [
        { id: "kpi-4", name: "Partnerships signed", target: 5, weight: 30, progress: 2, unit: "partnerships" },
        { id: "kpi-5", name: "MoUs executed", target: 3, weight: 10, progress: 1, unit: "MoUs" },
        { id: "kpi-6", name: "Industry workshops", target: 8, weight: 15, progress: 4, unit: "workshops" },
      ]
    },
    { 
      id: "obj-3", 
      title: "Enhance research infrastructure", 
      description: "Upgrade research facilities and equipment to support cutting-edge research",
      status: "Completed",
      priority: "High",
      startDate: "2024-01-15",
      endDate: "2024-10-15",
      kpis: [
        { id: "kpi-7", name: "Equipment upgraded", target: 15, weight: 40, progress: 15, unit: "items" },
        { id: "kpi-8", name: "Facilities renovated", target: 3, weight: 25, progress: 3, unit: "facilities" },
      ]
    },
  ];

  // Department analytics
  const departmentStats = {
    totalObjectives: objectives.length,
    completedObjectives: objectives.filter(obj => obj.status === "Completed").length,
    onTrackObjectives: objectives.filter(obj => obj.status === "On Track").length,
    atRiskObjectives: objectives.filter(obj => obj.status === "At Risk").length,
    overallProgress: 78,
    totalKPIs: objectives.reduce((sum, obj) => sum + obj.kpis.length, 0),
    completedKPIs: objectives.reduce((sum, obj) => 
      sum + obj.kpis.filter(kpi => kpi.progress >= kpi.target).length, 0
    ),
  };

  // Recent activities
  const recentActivities = [
    { id: 1, type: "objective", action: "Objective completed", title: "Enhance research infrastructure", time: "2 hours ago", icon: CheckCircle },
    { id: 2, type: "kpi", action: "KPI updated", title: "Projects funded: 12/20", time: "1 day ago", icon: TrendingUp },
    { id: 3, type: "assignment", action: "New assignment", title: "Industry collaboration KPI assigned", time: "3 days ago", icon: Users },
    { id: 4, type: "alert", action: "At risk objective", title: "Strengthen industry collaboration", time: "1 week ago", icon: AlertCircle },
  ];
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
  const selectedObjective = objectives.find(o => o.id === selectedObjectiveId) ?? null;
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);
  const kpis = selectedObjective?.kpis ?? [];
  const selectedKpi = kpis.find(k => k.id === selectedKpiId) ?? (kpis.length ? kpis[0] : null);
  const [divisionAlloc, setDivisionAlloc] = useState<Record<string, { target?: number; weight?: number }>>({});
  const [branchAlloc, setBranchAlloc] = useState<Record<string, { target?: number; weight?: number }>>({});
  const [postAlloc, setPostAlloc] = useState<Record<string, { target?: number; weight?: number }>>({});
  const [assignDivisionsOnly, setAssignDivisionsOnly] = useState<boolean>(true);
  const objectiveWeight = selectedObjective ? selectedObjective.kpis.reduce((s, k) => s + k.weight, 0) : 0;
  const totalAssignedWeight =
    Object.values(divisionAlloc).reduce((s, v) => s + (v.weight || 0), 0) +
    Object.values(branchAlloc).reduce((s, v) => s + (v.weight || 0), 0) +
    Object.values(postAlloc).reduce((s, v) => s + (v.weight || 0), 0);
  const overweight = totalAssignedWeight > objectiveWeight;
  const totalAssignedTarget =
    Object.values(divisionAlloc).reduce((s, v) => s + (v.target || 0), 0) +
    Object.values(branchAlloc).reduce((s, v) => s + (v.target || 0), 0) +
    Object.values(postAlloc).reduce((s, v) => s + (v.target || 0), 0);

  const autoDistribute = () => {
    if (!selectedKpi) return;
    const kpiTarget = selectedKpi.target;
    const grants = Math.ceil(kpiTarget * 0.75);
    const innov = Math.floor(kpiTarget * 0.25);
    const nextDiv: Record<string, { target: number; weight: number }> = {
      grants: { target: grants, weight:  Math.round((selectedKpi.weight ?? 0) * 0.75) || 0 },
      innovation: { target: innov, weight: Math.round((selectedKpi.weight ?? 0) * 0.25) || 0 },
    };
    const nextBranch: Record<string, { target: number; weight: number }> = {
      a: { target: Math.ceil(grants * 0.53), weight: Math.round((nextDiv.grants.weight) * 0.53) },
      b: { target: Math.floor(grants * 0.47), weight: Math.round((nextDiv.grants.weight) * 0.47) },
      c: { target: innov, weight: nextDiv.innovation.weight },
    };
    setDivisionAlloc(nextDiv);
    setBranchAlloc(nextBranch);
    // leave postAlloc manual since posts depend on occupancy
  };

  const divisions = [
    { id: "grants", name: "Research Grants Division" },
    { id: "innovation", name: "Innovation Division" },
  ];

  const branchesByDivision: Record<string, { id: string; name: string }[]> = {
    grants: [
      { id: "a", name: "Grants Branch A" },
      { id: "b", name: "Grants Branch B" },
    ],
    innovation: [
      { id: "c", name: "Innovation Branch" },
    ],
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Department KRA"
          subtitle={`View all Key Result Areas assigned to ${department}. Click to drill into cascade and assignments.`}
          right={
            selectedObjective ? (
              <Button variant="outline" onClick={() => setSelectedObjectiveId(null)}>
                Back to objectives
              </Button>
            ) : (
              <Button variant="outline" className="dark-mode-hover">
                <Target className="w-4 h-4 mr-2" />
                Manage KRAs
              </Button>
            )
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
              <li className="text-gray-700 font-medium">Department KRA</li>
            </ol>
          </nav>
        </div>

        {/* List view when nothing selected */}
        {!selectedObjective && (
          <Card className="dark-mode-card dark-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" /> {department} — Assigned KRAs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border rounded-lg p-4 animate-pulse">
                        <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                        <div className="h-3 bg-slate-200 rounded w-16 mb-1" />
                        <div className="space-y-1 mb-2">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="h-3 bg-slate-200 rounded w-16" />
                          <div className="h-6 bg-slate-200 rounded w-20" />
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="h-3 bg-slate-200 rounded w-24" />
                          <div className="h-8 bg-slate-200 rounded w-24" />
                        </div>
                      </div>
                    ))
                  : objectives.map(obj => {
                  const totalTarget = obj.kpis.reduce((s, k) => s + k.target, 0);
                  const totalProgress = obj.kpis.reduce((s, k) => s + k.progress, 0);
                  const totalWeight = obj.kpis.reduce((s, k) => s + k.weight, 0);
                  return (
                  <div key={obj.id} className="border rounded-lg p-4 hover:shadow transition-shadow">
                    <div className="text-sm text-muted-foreground">KRA</div>
                    <div className="font-medium text-foreground mb-2">{obj.title}</div>
                    <div className="text-xs text-muted-foreground mb-1">KPIs</div>
                    <ul className="text-xs list-disc pl-5 space-y-1 mb-2">
                      {obj.kpis.slice(0,2).map(k => (
                        <li key={k.id}>{k.name} (Target {k.target})</li>
                      ))}
                      {obj.kpis.length > 2 && <li>+{obj.kpis.length - 2} more…</li>}
                    </ul>
                    <div className="flex items-center justify-between text-sm">
                      <span>Target: <span className="font-medium">{totalTarget}</span></span>
                      <Badge variant="outline">Weight: {totalWeight}%</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">Progress: {totalProgress}/{totalTarget}</div>
                      <Button size="sm" onClick={() => setSelectedObjectiveId(obj.id)}>View details</Button>
                    </div>
                  </div>
                );})}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detail view when selected */}
        {selectedObjective && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Objective Summary */}
            <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" /> {department} — KRA Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">KRA</div>
                    <div className="text-base font-medium">Research & Development</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">KRA</div>
                    <div className="text-base font-medium">{selectedObjective.title}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Select KPI</div>
                    <Select value={selectedKpi?.id ?? undefined} onValueChange={(v) => setSelectedKpiId(v)}>
                      <SelectTrigger className="w-full md:w-[320px]"><SelectValue placeholder="Choose KPI" /></SelectTrigger>
                      <SelectContent>
                        {kpis.map(k => (
                          <SelectItem key={k.id} value={k.id}>{k.name} (Target {k.target}, Weight {k.weight}%)</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Assignment mode */}
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Assignment mode</div>
                    <div className="text-muted-foreground">{assignDivisionsOnly ? 'Assign to divisions only (no branches/staff)' : 'Cascade to branches and posts'}</div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={assignDivisionsOnly} onChange={(e) => setAssignDivisionsOnly(e.target.checked)} />
                    <span>Divisions only</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Assign to Divisions (per selected KPI) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Split className="w-5 h-5 text-blue-600" /> Assign to Divisions — {selectedKpi?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {divisions.map((div) => (
                    <div key={div.id} className="border rounded-lg p-4">
                      <div className="text-sm font-medium text-foreground mb-2">{div.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">Assign target to this division</div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Target"
                          defaultValue={div.id === 'grants' ? Math.ceil((selectedKpi?.target ?? 0) * 0.75) : Math.floor((selectedKpi?.target ?? 0) * 0.25)}
                          onChange={(e) => setDivisionAlloc(prev => ({ ...prev, [div.id]: { ...prev[div.id], target: Number(e.target.value) } }))}
                        />
                        <Input
                          type="number"
                          min={0}
                          placeholder="Weight %"
                          className="w-28"
                          onChange={(e) => setDivisionAlloc(prev => ({ ...prev, [div.id]: { ...prev[div.id], weight: Number(e.target.value) } }))}
                        />
                        <Button variant="outline" size="sm">Assign</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Tip: Ensure the sum equals {selectedKpi?.target}.</div>
              </CardContent>
            </Card>

            {!assignDivisionsOnly && (
              <Card>
                <CardHeader>
                  <CardTitle>Division to Branch Cascade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {divisions.map((div) => (
                    <div key={div.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{div.name}</div>
                        <Badge variant="outline">Target: {div.id === 'grants' ? Math.ceil((selectedKpi?.target ?? 0) * 0.75) : Math.floor((selectedKpi?.target ?? 0) * 0.25)}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {branchesByDivision[div.id].map((b, idx) => (
                          <div key={b.id} className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-2">{b.name}</div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min={0}
                                placeholder="Target"
                                defaultValue={div.id === 'grants' ? (idx === 0 ? Math.ceil((selectedKpi?.target ?? 0) * 0.75 * 0.53) : Math.floor((selectedKpi?.target ?? 0) * 0.75 * 0.47)) : (selectedKpi?.target ?? 0) * 0.25}
                                onChange={(e) => setBranchAlloc(prev => ({ ...prev, [b.id]: { ...prev[b.id], target: Number(e.target.value) } }))}
                              />
                              <Input
                                type="number"
                                min={0}
                                placeholder="Weight %"
                                className="w-28"
                                onChange={(e) => setBranchAlloc(prev => ({ ...prev, [b.id]: { ...prev[b.id], weight: Number(e.target.value) } }))}
                              />
                              <Button variant="outline" size="sm">Assign</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {!assignDivisionsOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Assign to Posts/Staff</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Grants Officer Post</div>
                    <div className="text-xs text-muted-foreground mb-2">Post is held by the assigned staff; no selection needed.</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Target"
                        defaultValue={5}
                        onChange={(e) => setPostAlloc(prev => ({ ...prev, ['post-grants-officer']: { ...prev['post-grants-officer'], target: Number(e.target.value) } }))}
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="Weight %"
                        className="w-28"
                        onChange={(e) => setPostAlloc(prev => ({ ...prev, ['post-grants-officer']: { ...prev['post-grants-officer'], weight: Number(e.target.value) } }))}
                      />
                      <Button variant="outline" size="sm">Assign</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Senior Research Analyst Post</div>
                    <div className="text-xs text-muted-foreground mb-2">Post is held by the assigned staff; no selection needed.</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Target"
                        defaultValue={2}
                        onChange={(e) => setPostAlloc(prev => ({ ...prev, ['post-senior-analyst']: { ...prev['post-senior-analyst'], target: Number(e.target.value) } }))}
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="Weight %"
                        className="w-28"
                        onChange={(e) => setPostAlloc(prev => ({ ...prev, ['post-senior-analyst']: { ...prev['post-senior-analyst'], weight: Number(e.target.value) } }))}
                      />
                      <Button variant="outline" size="sm">Assign</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}
            </div>

            {/* Right sticky summary */}
            <div className="xl:col-span-1 xl:sticky xl:top-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Objective weight</span>
                    <span className="font-medium">{objectiveWeight}%</span>
                  </div>
                  <div className={`flex items-center justify-between ${overweight ? 'text-red-600' : ''}`}>
                    <span className="text-muted-foreground">Assigned weight</span>
                    <span className="font-medium">{totalAssignedWeight}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">KPI target</span>
                    <span className="font-medium">{selectedKpi?.target ?? 0}</span>
                  </div>
                  <div className={`flex items-center justify-between ${selectedKpi && totalAssignedTarget > selectedKpi.target ? 'text-red-600' : ''}`}>
                    <span className="text-muted-foreground">Assigned target</span>
                    <span className="font-medium">{totalAssignedTarget}</span>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button size="sm" disabled={overweight || !selectedObjective}>Submit Configuration</Button>
                  </div>
                  <div className="text-xs text-muted-foreground">Note: Submit once after verifying weights and targets.</div>
                  <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                    <div>5) Staff acknowledge assigned KPIs (logged).</div>
                    <div>6) Bottom-up progress roll-up to Director view.</div>
                    <div>7) Director endorses and triggers reminders.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DirectorDepartmentKRAs;


