# KRA, Objective, and KPI Management API (v1)

This document specifies the REST API for managing KRAs (Key Result Areas), Objectives, and KPIs used by the PMS. It supports configuration, validations, assignments to Organizational Units, and reporting.

Base URL prefix: `/api/v1`

## Terminology
- **KRA**: A high-level result area for a period/year.
- **Objective**: A measurable objective under a KRA.
- **KPI**: A metric under an Objective.
- **OrgUnit**: Organizational unit (Department `DEPT`, Division `DIV`, Branch `BRANCH`).

## Conventions
- **Response envelope**:
```json
{
  "success": boolean,
  "message"?: string,
  "data"?: any,
  "errorCode"?: string | null,
  "errors"?: any
}
```
- **Timestamps** are ISO-8601 UTC strings.
- **IDs** are opaque strings.
- **Pagination**: `page`, `limit` (defaults: 1, 20). Sort: `sortBy`, `sortOrder` (asc|desc).
- **Auth**: Bearer JWT unless stated.

## Schemas

### KRA
```typescript
KRA {
  id: string;
  workingYearId: string;           // e.g. "2025"
  appraisalPeriodId: string;       // e.g. "annual-2025"
  title: string;
  description?: string;
  weight: number;                  // 0-100
  assignedOrgUnits?: OrgUnitRef[];
  objectives: Objective[];
  createdAt: string;               // ISO
  updatedAt: string;               // ISO
}

OrgUnitRef {
  id: string;                      // organizational-units id
  type: 'DEPT' | 'DIV' | 'BRANCH';
  name?: string;
}
```

### Objective
```typescript
Objective {
  id: string;
  kraId: string;                   // parent KRA id
  title: string;
  description?: string;
  weight: number;                  // objective share under KRA
  assignedOrgUnits?: OrgUnitRef[];
  assignedWeights?: Array<{
    unitId: string;                // OrgUnitRef.id
    scope: 'DEPT' | 'DIV' | 'BRANCH';
    weight: number;                // weight % portion of objective
  }>;
  kpis: KPI[];
}
```

### KPI
```typescript
KPI {
  id: string;
  objectiveId: string;             // parent Objective id
  name: string;
  description?: string;
  weight: number;                  // KPI share under Objective
  target: number;                  // numeric target
  unit: string;                    // e.g. "%", "days", "count"
  measurementType: 'Number' | 'Percentage' | 'Amount' | 'Days' | 'Hours' | 'Rating';
  dataSource?: string;             // evidence/source description
}
```

## Validation Rules
- **KRA weights**: Sum of all KRAs for a given (`workingYearId`,`appraisalPeriodId`) must equal 100.
- **Objective weights**: Within a KRA, sum of objective weights = KRA.weight.
- **KPI weights**: Within an Objective, sum of KPI weights = Objective.weight.
- **Assigned weights**: Sum of `assignedWeights.weight` = Objective.weight when distributing to OrgUnits.

Server validates on create/update; pre-check endpoints are also available.

---

## KRA Endpoints

### Create KRA
**POST** `/kras`
```json
{
  "workingYearId": "2025",
  "appraisalPeriodId": "annual-2025",
  "title": "Research & Development",
  "description": "Promote research excellence",
  "weight": 50,
  "assignedOrgUnits": [ { "id": "6", "type": "DEPT" } ]
}
```
**201**
```json
{ "success": true, "message": "KRA created", "data": KRA }
```
**Errors**: 400,401,403,409,500

### List KRAs
**GET** `/kras?workingYearId=2025&appraisalPeriodId=annual-2025&page=1&limit=50&sortBy=createdAt&sortOrder=desc&q=research`
```json
{
  "success": true,
  "data": {
    "items": KRA[],
    "pagination": { "total": number, "page": number, "limit": number, "totalPages": number, "hasNext": boolean, "hasPrevious": boolean }
  }
}
```

### Get KRA
**GET** `/kras/{id}` → `{ success: true, data: KRA }` (404 if not found)

### Update KRA
**PUT** `/kras/{id}` (partial allowed)
```json
{ "title": "R&D Excellence", "description": "Refined", "weight": 40, "assignedOrgUnits": [ { "id": "6", "type": "DEPT" } ] }
```
**200** `{ success: true, message: "KRA updated", "data": KRA }`

### Delete KRA
**DELETE** `/kras/{id}?force=false` → **200** `{ success: true, message: "KRA deleted" }`
- `force=true` deletes children (Objectives, KPIs); otherwise 409 if children exist.

---

## Objective Endpoints

### Create Objective
**POST** `/kras/{kraId}/objectives`
```json
{
  "title": "Improve grant success",
  "description": "",
  "weight": 25,
  "assignedOrgUnits": [{ "id": "14", "type": "DIV" }],
  "assignedWeights": [ { "unitId": "14", "scope": "DIV", "weight": 25 } ]
}
```
**201** `{ success: true, message: "Objective created", "data": Objective }`

### List Objectives for KRA
**GET** `/kras/{kraId}/objectives` → `{ success: true, data: Objective[] }`

### Get Objective
**GET** `/objectives/{id}` → `{ success: true, data: Objective }`

### Update Objective
**PUT** `/objectives/{id}` (partial)
```json
{ "title": "Enhance grant approvals", "weight": 20, "assignedWeights": [ { "unitId": "14", "scope": "DIV", "weight": 20 } ] }
```
**200** `{ success: true, message: "Objective updated", "data": Objective }`

### Delete Objective
**DELETE** `/objectives/{id}?force=false` → **200** `{ success: true, message: "Objective deleted" }`

---

## KPI Endpoints

### Create KPI
**POST** `/objectives/{objectiveId}/kpis`
```json
{ "name": "Approved grants", "description": "", "weight": 10, "target": 50, "unit": "count", "measurementType": "Number", "dataSource": "Grant registry" }
```
**201** `{ success: true, message: "KPI created", "data": KPI }`

### List KPIs
**GET** `/objectives/{objectiveId}/kpis` → `{ success: true, data: KPI[] }`

### Get KPI
**GET** `/kpis/{id}` → `{ success: true, data: KPI }`

### Update KPI
**PUT** `/kpis/{id}` (partial)
```json
{ "name": "Approved grants (federal)", "weight": 12, "target": 55 }
```
**200** `{ success: true, message: "KPI updated", "data": KPI }`

### Delete KPI
**DELETE** `/kpis/{id}` → **200** `{ success: true, message: "KPI deleted" }`

---

## Validation Endpoints

### Validate KRA Weights (period)
**POST** `/kras/validate-weights`
```json
{ "workingYearId": "2025", "appraisalPeriodId": "annual-2025" }
```
```json
{ "success": true, "data": { "ok": boolean, "message": string, "totalWeight": number, "details": Array<{ kraId: string; title: string; weight: number }> } }
```

### Validate Objective Weights (KRA)
**POST** `/objectives/validate-weights`
```json
{ "kraId": "..." }
```
```json
{ "success": true, "data": { "ok": boolean, "message": string, "kraWeight": number, "objectiveTotal": number, "details": Array<{ objectiveId: string; title: string; weight: number }> } }
```

### Validate KPI Weights (Objective)
**POST** `/kpis/validate-weights`
```json
{ "objectiveId": "..." }
```
```json
{ "success": true, "data": { "ok": boolean, "message": string, "objectiveWeight": number, "kpiTotal": number, "details": Array<{ kpiId: string; name: string; weight: number }> } }
```

### Validate Assigned Weights (Objective → OrgUnits)
**POST** `/objectives/validate-assigned-weights`
```json
{ "objectiveId": "..." }
```
```json
{ "success": true, "data": { "ok": boolean, "message": string, "objectiveWeight": number, "assignedTotal": number, "details": Array<{ unitId: string; scope: string; weight: number }> } }
```

---

## Assignment & Lookup

### Assign KRA to OrgUnits (bulk)
**POST** `/kras/{kraId}/assign`
```json
{ "units": [ { "id": "6", "type": "DEPT" }, { "id": "14", "type": "DIV" } ] }
```
**200** `{ success: true, message: "Assigned", "data": KRA }`

### Assign Objective Weights to Units (bulk)
**POST** `/objectives/{objectiveId}/assigned-weights`
```json
{ "weights": [ { "unitId": "14", "scope": "DIV", "weight": 10 }, { "unitId": "15", "scope": "DIV", "weight": 10 } ] }
```
**200** `{ success: true, message: "Assigned weights updated", "data": Objective }`

### Get KRAs by OrgUnit
**GET** `/organizational-units/{id}/kras?periodId=annual-2025&year=2025` → `{ success: true, "data": KRA[] }`

---

## Bulk Operations

### Export KRAs for a period
**GET** `/kras/export?workingYearId=2025&appraisalPeriodId=annual-2025&format=excel` → binary file (200)

### Import KRAs (and nested)
**POST** `/kras/import` (multipart form-data `file`)
```json
{ "success": true, "message": "Import accepted", "data": { "jobId": "..." } }
```

### Import Job Status
**GET** `/kras/import/{jobId}`
```json
{ "success": true, "data": { "status": "queued|running|completed|failed", "summary"?: { "created": number, "updated": number, "errors": number }, "errors"?: Array<{ row: number; error: string }> } }
```

---

## Errors and Codes
- `VALIDATION_ERROR`: Invalid or inconsistent weights
- `NOT_FOUND`: KRA/Objective/KPI not found
- `CONFLICT`: Duplicate entity or protected delete
- `PERMISSION_DENIED`: Missing permission
- `IMPORT_INVALID_FORMAT`: Invalid import file

**HTTP status**: 200,201,202,400,401,403,404,409,422,500

---

## Idempotency & Concurrency
- `Idempotency-Key` supported on create/import to avoid duplicates.
- Optional `If-Unmodified-Since` for optimistic concurrency.

---

## Security & Permissions (suggested)
- **View**: `kra.read`
- **Create/Update/Delete**: `kra.write`
- **Objective/KPI write**: `kra.objective.write`, `kra.kpi.write`
- **Assignments**: `kra.assign`
- **Import/Export**: `kra.admin`

---

## Examples (cURL)

### Create KRA
```bash
curl -X POST "https://host/api/v1/kras" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "workingYearId":"2025",
  "appraisalPeriodId":"annual-2025",
  "title":"Research & Development",
  "weight":50
}'
```

### Validate KRA weights
```bash
curl -X POST "https://host/api/v1/kras/validate-weights" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"workingYearId":"2025","appraisalPeriodId":"annual-2025"}'
```

### Create Objective under a KRA
```bash
curl -X POST "https://host/api/v1/kras/123/objectives" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"title":"Improve grant success","weight":25}'
```

### Create KPI under an Objective
```bash
curl -X POST "https://host/api/v1/objectives/456/kpis" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"Approved grants","weight":10,"target":50,"unit":"count","measurementType":"Number"}'
```

### Export KRAs for a period
```bash
curl -X GET "https://host/api/v1/kras/export?workingYearId=2025&appraisalPeriodId=annual-2025&format=excel" \
-H "Authorization: Bearer $TOKEN" -o kras.xlsx
```

---

## Roadmap (Optional)
- Versioned snapshots per period
- Draft/published states with approvals
- Audit log for changes
- Templates & cloning across periods
