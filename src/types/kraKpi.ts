export interface OrgUnitRef {
  id: string;
  name: string;
  type: 'Department' | 'Division' | 'Branch' | 'Section' | 'Unit';
}

export interface KRA {
  id: string;
  workingYearId: string;
  appraisalPeriodId: string;
  title: string;
  description?: string;
  weight: number; // 0-100 across KRAs per year/period should sum to 100
  objectives: Objective[];
  createdAt: string;
  updatedAt: string;
}

export interface Objective {
  id: string;
  kraId: string;
  title: string;
  description?: string;
  weight: number; // must sum to KRA weight across objectives
  assignedOrgUnits: OrgUnitRef[]; // or posts in future
  kpis: KPI[];
  assignedWeights?: ObjectiveUnitWeight[]; // distribution of objective weight across selected units
}

export type MeasurementType = 'Number' | 'Percentage' | 'Amount' | 'Days' | 'Hours' | 'Rating';

export interface KPI {
  id: string;
  objectiveId: string;
  name: string;
  description?: string;
  weight: number; // must sum to Objective weight across KPIs
  target: number;
  unit: string; // e.g., Projects, %
  measurementType: MeasurementType;
  dataSource?: string; // Evidence / source
}

export interface ObjectiveUnitWeight {
  unitId: string;
  scope: 'Department' | 'Division' | 'Branch';
  weight: number; // percentage portion of objective.weight
}

export interface KRAFormData {
  workingYearId: string;
  appraisalPeriodId: string;
  title: string;
  description?: string;
  weight: number;
}

export interface ObjectiveFormData {
  kraId: string;
  title: string;
  description?: string;
  weight: number;
  assignedOrgUnitIds: string[];
}

export interface KPIFormData {
  objectiveId: string;
  name: string;
  description?: string;
  weight: number;
  target: number;
  unit: string;
  measurementType: MeasurementType;
  dataSource?: string;
  assignedOrgUnitIds?: string[];
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

export const validateKRAWeights = (kras: KRA[]): ValidationResult => {
  const sum = kras.reduce((s, k) => s + (k.weight || 0), 0);
  if (sum !== 100) return { ok: false, message: `KRA weights must sum to 100% (current ${sum}%).` };
  return { ok: true };
};

export const validateObjectiveWeights = (kra: KRA): ValidationResult => {
  const sum = (kra.objectives || []).reduce((s, o) => s + (o.weight || 0), 0);
  if (sum !== kra.weight) return { ok: false, message: `Objective weights for "${kra.title}" must sum to its KRA weight (${kra.weight}%). Currently ${sum}%.` };
  return { ok: true };
};

export const validateKPIWeights = (objective: Objective): ValidationResult => {
  const sum = (objective.kpis || []).reduce((s, k) => s + (k.weight || 0), 0);
  if (sum !== objective.weight) return { ok: false, message: `KPI weights for "${objective.title}" must sum to its Objective weight (${objective.weight}%). Currently ${sum}%.` };
  return { ok: true };
};


