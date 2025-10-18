import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, CheckCircle, AlertCircle, List } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { KRA, Objective, KPI, validateKRAWeights, validateObjectiveWeights, validateKPIWeights } from '@/types/kraKpi';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { apiService } from '@/services/api';
import { toast } from '@/utils/toast';

const KraKpiManagement: React.FC = () => {
  // Mock org units
  const orgUnits = [
    { id: 'ou1', name: 'Research Department', type: 'Department' as const },
    { id: 'ou2', name: 'Grants Division', type: 'Division' as const },
    { id: 'ou3', name: 'Finance Department', type: 'Department' as const },
    { id: 'ou4', name: 'Projects Branch', type: 'Branch' as const },
  ];

  // Mock periods
  const periods = [ { id: 'ap1', name: '2024 Annual' } ];
  const years = ['2024', '2023', '2022'];

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPeriod, setSelectedPeriod] = useState('ap1');
  const [activeTab, setActiveTab] = useState<'manage' | 'list'>('manage');
  const [assignmentScope, setAssignmentScope] = useState<'Department' | 'Division' | 'Branch'>('Department');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [collapsedObjectives, setCollapsedObjectives] = useState<Record<string, boolean>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [kras, setKras] = useState<KRA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savingKra, setSavingKra] = useState<Record<string, boolean>>({});
  const [savingObjective, setSavingObjective] = useState<Record<string, boolean>>({});
  const [savingKpi, setSavingKpi] = useState<Record<string, boolean>>({});
  const [isValidatingServer, setIsValidatingServer] = useState<boolean>(false);

  // Derived
  const activeKras = useMemo(() => kras.filter(k => k.workingYearId === selectedYear && k.appraisalPeriodId === selectedPeriod), [kras, selectedYear, selectedPeriod]);

  const kraValidation = validateKRAWeights(activeKras);

  const addKra = async () => {
    try {
      const res = await apiService.createKra({
        workingYearId: selectedYear,
        appraisalPeriodId: selectedPeriod,
        title: 'New KRA',
        description: '',
        weight: 0,
        assignedOrgUnits: []
      });
      if (res.success && res.data) {
        const created = res.data as any;
        const newKra: KRA = {
          id: String(created.id),
          workingYearId: created.workingYearId || selectedYear,
          appraisalPeriodId: created.appraisalPeriodId || selectedPeriod,
          title: created.title || 'New KRA',
          description: created.description || '',
          weight: created.weight ?? 0,
          objectives: created.objectives || [],
          createdAt: created.createdAt || new Date().toISOString(),
          updatedAt: created.updatedAt || new Date().toISOString(),
        };
        setKras(prev => [...prev, newKra]);
        toast.success('KRA created');
      } else {
        toast.error('Failed to create KRA');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create KRA');
    }
  };

  const updateKra = async (kraId: string, updates: Partial<KRA>) => {
    setKras(prev => prev.map(k => k.id === kraId ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k));
    try {
      setSavingKra(prev => ({ ...prev, [kraId]: true }));
      await apiService.updateKra(kraId, {
        title: updates.title,
        description: updates.description,
        weight: updates.weight,
      });
    } catch (e) {
      // non-blocking; user feedback optional to avoid noise
    } finally {
      setSavingKra(prev => ({ ...prev, [kraId]: false }));
    }
  };

  const removeKra = async (kraId: string) => {
    try {
      setSavingKra(prev => ({ ...prev, [kraId]: true }));
      const res = await apiService.deleteKra(kraId);
      if (res.success) {
        setKras(prev => prev.filter(k => k.id !== kraId));
        toast.success('KRA deleted');
      } else {
        toast.error('Failed to delete KRA');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete KRA');
    } finally {
      setSavingKra(prev => ({ ...prev, [kraId]: false }));
    }
  };

  const addObjective = async (kraId: string) => {
    try {
      setSavingKra(prev => ({ ...prev, [kraId]: true }));
      const res = await apiService.createObjective(kraId, { title: 'New Objective', description: '', weight: 0, assignedOrgUnits: [] });
      if (res.success && res.data) {
        const created = res.data as any;
        setKras(prev => prev.map(k => k.id === kraId ? {
          ...k,
          objectives: [...(k.objectives || []), {
            id: String(created.id),
            kraId: kraId,
            title: created.title || 'New Objective',
            description: created.description || '',
            weight: created.weight ?? 0,
            assignedOrgUnits: created.assignedOrgUnits || [],
            assignedWeights: created.assignedWeights || [],
            kpis: created.kpis || [],
          }]
        } : k));
        toast.success('Objective added');
      } else {
        toast.error('Failed to add objective');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to add objective');
    } finally {
      setSavingKra(prev => ({ ...prev, [kraId]: false }));
    }
  };

  const updateObjective = async (kraId: string, objId: string, updates: Partial<Objective>) => {
    setKras(prev => prev.map(k => k.id === kraId ? {
      ...k,
      objectives: k.objectives.map(o => o.id === objId ? { ...o, ...updates } : o)
    } : k));
    try { await apiService.updateObjective(objId, {
      
      title: updates.title,
      description: updates.description,
      weight: updates.weight,
      assignedOrgUnits: updates.assignedOrgUnits as any,
      assignedWeights: updates.assignedWeights as any,
    }); } catch {} finally { setSavingObjective(prev => ({ ...prev, [objId]: false })); }
  };

  const removeObjective = async (kraId: string, objId: string) => {
    try {
      setSavingObjective(prev => ({ ...prev, [objId]: true }));
      const res = await apiService.deleteObjective(objId);
      if (res.success) {
        setKras(prev => prev.map(k => k.id === kraId ? { ...k, objectives: k.objectives.filter(o => o.id !== objId) } : k));
        toast.success('Objective removed');
      } else {
        toast.error('Failed to remove objective');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to remove objective');
    } finally { setSavingObjective(prev => ({ ...prev, [objId]: false })); }
  };

  const addKPI = async (kraId: string, objId: string) => {
    try {
      setSavingObjective(prev => ({ ...prev, [objId]: true }));
      const res = await apiService.createKpi(objId, { name: 'New KPI', description: '', weight: 0, target: 0, unit: '', measurementType: 'Number' });
      if (res.success && res.data) {
        const created = res.data as any;
        setKras(prev => prev.map(k => k.id === kraId ? {
          ...k,
          objectives: k.objectives.map(o => o.id === objId ? {
            ...o,
            kpis: [...o.kpis, {
              id: String(created.id),
              objectiveId: objId,
              name: created.name || 'New KPI',
              description: created.description || '',
              weight: created.weight ?? 0,
              target: created.target ?? 0,
              unit: created.unit || '',
              measurementType: created.measurementType || 'Number',
              dataSource: created.dataSource || '',
              assignedOrgUnits: o.assignedOrgUnits,
            }]
          } : o)
        } : k));
        toast.success('KPI added');
      } else {
        toast.error('Failed to add KPI');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to add KPI');
    } finally { setSavingObjective(prev => ({ ...prev, [objId]: false })); }
  };

  const updateKPI = async (kraId: string, objId: string, kpiId: string, updates: Partial<KPI>) => {
    setKras(prev => prev.map(k => k.id === kraId ? {
      ...k,
      objectives: k.objectives.map(o => o.id === objId ? {
        ...o,
        kpis: o.kpis.map(kk => kk.id === kpiId ? { ...kk, ...updates } : kk)
      } : o)
    } : k));
    try { 
      setSavingKpi(prev => ({ ...prev, [kpiId]: true }));
      await apiService.updateKpi(kpiId, {
      name: updates.name,
      description: updates.description,
      weight: updates.weight as any,
      target: updates.target as any,
      unit: updates.unit,
      measurementType: updates.measurementType as any,
      dataSource: updates.dataSource,
    }); 
    } catch {} finally { setSavingKpi(prev => ({ ...prev, [kpiId]: false })); }
  };

  const removeKPI = async (kraId: string, objId: string, kpiId: string) => {
    try {
      setSavingKpi(prev => ({ ...prev, [kpiId]: true }));
      const res = await apiService.deleteKpi(kpiId);
      if (res.success) {
        setKras(prev => prev.map(k => k.id === kraId ? {
          ...k,
          objectives: k.objectives.map(o => o.id === objId ? {
            ...o,
            kpis: o.kpis.filter(kk => kk.id !== kpiId)
          } : o)
        } : k));
        toast.success('KPI removed');
      } else {
        toast.error('Failed to remove KPI');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to remove KPI');
    } finally { setSavingKpi(prev => ({ ...prev, [kpiId]: false })); }
  };

  const handleSave = async () => {
    // Validate overall KRA weights
    const vKra = validateKRAWeights(activeKras);
    if (!vKra.ok) {
      setConfirmMessage(vKra.message);
      setShowConfirmDialog(true);
      return;
    }
    // Validate each KRA's objectives and KPIs
    for (const kra of activeKras) {
      const vObj = validateObjectiveWeights(kra);
      if (!vObj.ok) {
        setConfirmMessage(vObj.message);
        setShowConfirmDialog(true);
        return;
      }
      for (const obj of kra.objectives) {
        const vKpi = validateKPIWeights(obj);
        if (!vKpi.ok) {
          setConfirmMessage(vKpi.message);
          setShowConfirmDialog(true);
          return;
        }
      }
    }
    setIsSaving(true);
    setIsValidatingServer(true);
    try {
      // Server-side validation endpoints
      await apiService.validateKraWeights({ workingYearId: selectedYear, appraisalPeriodId: selectedPeriod });
      for (const kra of activeKras) {
        await apiService.updateKra(kra.id, { title: kra.title, description: kra.description, weight: kra.weight });
        for (const obj of kra.objectives) {
          await apiService.updateObjective(obj.id, {
            title: obj.title, description: obj.description, weight: obj.weight,
            assignedOrgUnits: obj.assignedOrgUnits as any, assignedWeights: obj.assignedWeights as any,
          });
          for (const kpi of obj.kpis) {
            await apiService.updateKpi(kpi.id, {
              name: kpi.name, description: kpi.description, weight: kpi.weight,
              target: kpi.target, unit: kpi.unit, measurementType: kpi.measurementType, dataSource: kpi.dataSource,
            });
          }
        }
      }
      setLastSavedAt(new Date().toLocaleTimeString());
      setConfirmMessage('KRA & KPI configuration saved successfully.');
      setShowConfirmDialog(true);
    } catch (e: any) {
      setConfirmMessage(e?.message || 'Failed to save configuration');
      setShowConfirmDialog(true);
    } finally {
      setIsSaving(false);
      setIsValidatingServer(false);
    }
  };

  // Load KRAs from API when year/period changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await apiService.listKras({ workingYearId: selectedYear, appraisalPeriodId: selectedPeriod, page: 1, limit: 100 });
        if (res.success && res.data) {
          const items = (res.data.items || []) as any[];
          const mapped: KRA[] = items.map((k: any) => ({
            id: String(k.id),
            workingYearId: String(k.workingYearId || selectedYear),
            appraisalPeriodId: String(k.appraisalPeriodId || selectedPeriod),
            title: k.title,
            description: k.description,
            weight: k.weight ?? 0,
            objectives: (k.objectives || []).map((o: any) => ({
              id: String(o.id),
              kraId: String(k.id),
              title: o.title,
              description: o.description,
              weight: o.weight ?? 0,
              assignedOrgUnits: o.assignedOrgUnits || [],
              assignedWeights: o.assignedWeights || [],
              kpis: (o.kpis || []).map((kp: any) => ({
                id: String(kp.id),
                objectiveId: String(o.id),
                name: kp.name,
                description: kp.description,
                weight: kp.weight ?? 0,
                target: kp.target ?? 0,
                unit: kp.unit || '',
                measurementType: kp.measurementType || 'Number',
                dataSource: kp.dataSource || '',
                assignedOrgUnits: o.assignedOrgUnits || [],
              })),
            })),
            createdAt: k.createdAt || new Date().toISOString(),
            updatedAt: k.updatedAt || new Date().toISOString(),
          }));
          setKras(mapped);
        } else {
          toast.error('Failed to load KRAs');
        }
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load KRAs');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedYear, selectedPeriod]);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="KRA Management"
          subtitle="Manage KRAs, Objectives and KPIs with weights and organizational unit assignments"
          right={
            <div className="flex items-center space-x-3">
              <Button 
                type="button" 
                variant={activeTab === 'list' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('list')}
              >
                <List className="w-4 h-4 mr-2" />Existing KRAs
              </Button>
              <Button 
                type="button" 
                variant={activeTab === 'manage' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('manage')}
              >
                <Edit className="w-4 h-4 mr-2" />Manage
              </Button>
              {activeTab === 'manage' && (
                <Button 
                  type="button" 
                  onClick={addKra} 
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />Add KRA
                </Button>
              )}
            </div>
          }
        />

        {/* Context Filters */}
        <Card className="dark-mode-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Year</Label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)} 
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                >
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Appraisal Period</Label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)} 
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                >
                  {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            {activeTab === 'manage' && (
              <div className="mt-4 flex justify-end">
                {kraValidation.ok ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" /> KRA weights valid
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-3 py-1">
                    <AlertCircle className="w-3 h-3 mr-1" /> {kraValidation.message}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {activeTab === 'manage' && (
        <div className="space-y-6">
          {isValidatingServer && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              Validating configuration with server...
            </div>
          )}
          {activeKras.map(kra => {
            const objValidation = validateObjectiveWeights(kra);
            return (
              <Card key={kra.id} className="dark-mode-card">
                <CardContent className="p-6 space-y-6">
                  {/* KRA Header */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">KRA Title</Label>
                        <Input 
                          value={kra.title} 
                          onChange={(e) => updateKra(kra.id, { title: e.target.value })}
                          className="h-11"
                          placeholder="Enter KRA title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Weight %</Label>
                        <Input 
                          type="number" 
                          value={kra.weight} 
                          onChange={(e) => updateKra(kra.id, { weight: parseInt(e.target.value) || 0 })}
                          className="h-11"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Description</Label>
                        <Input 
                          value={kra.description || ''} 
                          onChange={(e) => updateKra(kra.id, { description: e.target.value })}
                          className="h-11"
                          placeholder="Enter description"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => addObjective(kra.id)}
                        className="px-4 py-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />Add Objective
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2" 
                        onClick={() => removeKra(kra.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {!objValidation.ok && (
                    <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-yellow-700 dark:text-yellow-300">{objValidation.message}</span>
                    </div>
                  )}

                  {/* Objectives Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Objectives</h3>
                    {kra.objectives.map(obj => {
                      const kpiValidation = validateKPIWeights(obj);
                      const isCollapsed = !!collapsedObjectives[obj.id];
                      return (
                        <div key={obj.id} className="border border-border rounded-lg p-4 bg-card/50">
                          {/* Objective Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{obj.title || 'New Objective'}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{obj.weight}%</span>
                              <span className="text-muted-foreground">•</span>
                              <span>{obj.assignedOrgUnits?.length || 0} unit(s)</span>
                              <span className="text-muted-foreground">•</span>
                              <span>{obj.kpis.length} KPI(s)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={() => setCollapsedObjectives(prev => ({ ...prev, [obj.id]: !prev[obj.id] }))}>
                                {isCollapsed ? 'Expand' : 'Collapse'}
                              </Button>
                            </div>
                          </div>

                          {!isCollapsed && (
                          <>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                            <div>
                              <Label>Objective name</Label>
                              <Input value={obj.title} onChange={(e) => updateObjective(kra.id, obj.id, { title: e.target.value })} />
                            </div>
                            <div>
                              <Label>Weight %</Label>
                              <Input type="number" value={obj.weight} onChange={(e) => updateObjective(kra.id, obj.id, { weight: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div>
                              <Label>Assign to</Label>
                              <div className="flex gap-2 mb-2">
                                {(['Department','Division','Branch'] as const).map(t => (
                                  <Button key={t} type="button" variant={assignmentScope===t? 'default':'outline'} size="sm" onClick={() => setAssignmentScope(t)}>
                                    {t}
                                  </Button>
                                ))}
                              </div>
                              <select multiple value={obj.assignedOrgUnits.map(o => o.id)} onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions).map(o => o.value);
                                const pool = orgUnits.filter(u => u.type === assignmentScope);
                                const selected = pool.filter(u => values.includes(u.id));
                                const n = selected.length;
                                const base = n > 0 ? Math.floor((obj.weight || 0) / n) : 0;
                                const remainder = n > 0 ? (obj.weight || 0) - base * n : 0;
                                const weights = selected.map((u, idx) => ({ unitId: u.id, scope: u.type as any, weight: base + (idx < remainder ? 1 : 0) }));
                                updateObjective(kra.id, obj.id, { assignedOrgUnits: selected as any, assignedWeights: weights });
                              }} className="w-full p-2 border rounded-md h-24">
                                {orgUnits.filter(u => u.type === assignmentScope).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                              </select>
                            </div>
                            <div className="flex items-end gap-2">
                              <Button variant="outline" onClick={() => addKPI(kra.id, obj.id)}><Plus className="w-4 h-4 mr-2" />KPI</Button>
                              <Button variant="ghost" className="text-red-600" onClick={() => removeObjective(kra.id, obj.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label>Description</Label>
                            <Input value={obj.description || ''} onChange={(e) => updateObjective(kra.id, obj.id, { description: e.target.value })} placeholder="Short explanation of the objective" />
                          </div>
                          {!kpiValidation.ok && (
                            <div className="text-xs text-yellow-700 mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {kpiValidation.message}</div>
                          )}

                          {/* Assignment weights table */}
                          {obj.assignedOrgUnits.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <Label>Distribute Objective Weight ({obj.weight}%) across selected {assignmentScope.toLowerCase()}s</Label>
                                <div className="flex gap-2">
                                  <Button type="button" variant="outline" size="sm" onClick={() => {
                                    const n = obj.assignedOrgUnits.length;
                                    const base = n > 0 ? Math.floor((obj.weight || 0) / n) : 0;
                                    const remainder = n > 0 ? (obj.weight || 0) - base * n : 0;
                                    const newWeights = obj.assignedOrgUnits.map((u, idx) => ({ unitId: u.id, scope: u.type as any, weight: base + (idx < remainder ? 1 : 0) }));
                                    updateObjective(kra.id, obj.id, { assignedWeights: newWeights });
                                  }}>Auto split equally</Button>
                                </div>
                              </div>
                              <div className="mt-2 border rounded">
                                <div className="grid grid-cols-3 text-xs text-gray-500 px-3 py-2">
                                  <div>Unit</div>
                                  <div>Scope</div>
                                  <div>Weight (%)</div>
                                </div>
                                {obj.assignedOrgUnits.map((u) => {
                                  const current = (obj.assignedWeights || []).find(w => w.unitId === u.id);
                                  const w = current?.weight ?? 0;
                                  return (
                                    <div key={u.id} className="grid grid-cols-3 items-center px-3 py-2 border-t">
                                      <div className="text-sm">{u.name}</div>
                                      <div className="text-sm">{u.type}</div>
                                      <div>
                                        <Input type="number" value={w} onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0;
                                          const weights = [...(obj.assignedWeights || [])];
                                          const idx = weights.findIndex(x => x.unitId === u.id);
                                          if (idx >= 0) weights[idx] = { ...weights[idx], weight: val };
                                          else weights.push({ unitId: u.id, scope: u.type as any, weight: val });
                                          updateObjective(kra.id, obj.id, { assignedWeights: weights });
                                        }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                Total assigned: { (obj.assignedWeights || []).reduce((s,w)=> s + (w.weight||0), 0) }% of {obj.weight}%
                              </div>
                            </div>
                          )}

                          {/* KPIs */}
                          <div className="mt-3 space-y-2">
                            {obj.kpis.map(kpi => (
                              <div key={kpi.id} className="border rounded p-2 grid grid-cols-1 md:grid-cols-6 gap-2">
                                <div>
                                  <Label>Name</Label>
                                  <Input value={kpi.name} onChange={(e) => updateKPI(kra.id, obj.id, kpi.id, { name: e.target.value })} />
                                </div>
                                <div>
                                  <Label>Weight %</Label>
                                  <Input type="number" value={kpi.weight} onChange={(e) => updateKPI(kra.id, obj.id, kpi.id, { weight: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div>
                                  <Label>Target</Label>
                                  <Input type="number" value={kpi.target} onChange={(e) => updateKPI(kra.id, obj.id, kpi.id, { target: parseFloat(e.target.value) || 0 })} />
                                </div>
                                <div>
                                  <Label>Unit</Label>
                                  <Input value={kpi.unit} onChange={(e) => updateKPI(kra.id, obj.id, kpi.id, { unit: e.target.value })} />
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <select value={kpi.measurementType} onChange={(e) => updateKPI(kra.id, obj.id, kpi.id, { measurementType: e.target.value as any })} className="w-full p-2 border rounded">
                                    <option>Number</option>
                                    <option>Percentage</option>
                                    <option>Amount</option>
                                    <option>Days</option>
                                    <option>Hours</option>
                                    <option>Rating</option>
                                  </select>
                                </div>
                                <div>
                                  <Label>Data Source/Evidence</Label>
                                  <Input value={kpi.dataSource || ''} onChange={(e) => updateKPI(kra.id, obj.id, kpi.id, { dataSource: e.target.value })} />
                                </div>
                              </div>
                            ))}
                          </div>
                          </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {/* Save Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 p-6 bg-card/50 rounded-lg border border-border">
            {lastSavedAt && (
              <span className="text-sm text-muted-foreground">Last saved at {lastSavedAt}</span>
            )}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="px-6 py-2"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-primary hover:bg-primary/90 px-6 py-2" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'list' && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KRA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectives</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeKras.map(kra => (
                      <tr key={kra.id} className="align-top">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{kra.title}</div>
                          <div className="text-sm text-gray-500">{kra.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{kra.weight}%</td>
                        <td className="px-6 py-4">
                          {(() => {
                            const allUnits = kra.objectives.flatMap(o => o.assignedOrgUnits || []);
                            const unique = Array.from(new Map(allUnits.map(u => [u.id, u])).values());
                            if (unique.length === 0) return <span className="text-sm text-gray-400">No assignments</span>;
                            return (
                              <div className="flex flex-wrap gap-1">
                                {unique.map(u => (
                                  <Badge key={u.id} variant="outline" className="text-xs">{u.name}</Badge>
                                ))}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {kra.objectives.length === 0 && (
                              <div className="text-sm text-gray-400">No objectives yet</div>
                            )}
                            {kra.objectives.map(obj => (
                              <div key={obj.id} className="border rounded p-2">
                                <div className="flex justify-between">
                                  <div className="font-medium text-sm">{obj.title}</div>
                                  <div className="text-xs text-gray-500">{obj.weight}%</div>
                                </div>
                                <div className="text-xs text-gray-500">Units: {obj.assignedOrgUnits.map(u => u.name).join(', ')}</div>
                                <div className="mt-1 text-xs text-gray-600">KPIs: {obj.kpis.length}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={() => setShowConfirmDialog(false)}
          message={confirmMessage}
          title="Confirmation"
        />
      </div>
    </Layout>
  );
};

export default KraKpiManagement;
