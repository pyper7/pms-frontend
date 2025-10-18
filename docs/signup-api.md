## TETFund PMS – Signup API Documentation

- Base URL: `/api/v1`
- Content-Type: `application/json; charset=utf-8`
- Standard envelope:
  - Success: `{ "success": true, "message": string, "data": any }`
  - Failure: `{ "success": false, "message": string, "errorCode": string, "details"?: any }`

### Overview of Signup Flow
1) Validate StaffId → 2) Set Password → 3) Select Department → 4) Select Division (optional) → 5) Select Branch (optional) → 6) Select Post → 7) Review & Confirm → 8) Success

The frontend shows only the relevant hierarchy levels. Posts are filtered by scope:
- Branch selected → show branch-level posts
- Division selected (no branch) → show division-level posts
- Only department selected → show department-level posts

---

### 1) Validate StaffId
- Method: POST
- Path: `/auth/validate-staff-id`
- Purpose: Verify a StaffId is eligible to register and hasn’t completed onboarding.

Request
```json
{ "staffId": "EMP001" }
```

Success 200
```json
{
  "success": true,
  "message": "Staff ID is valid for registration",
  "data": {
    "staffId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@tetfund.gov.ng",
    "department": "ICT",
    "position": "Software Developer"
  }
}
```

Failures (examples)
```json
{ "success": false, "message": "Invalid staff ID", "errorCode": "INVALID_STAFF_ID" }
```
```json
{ "success": false, "message": "User has already completed onboarding", "errorCode": "ONBOARDING_COMPLETED" }
```

---

### 2) Set Password
- Method: POST
- Path: `/auth/set-password`
- Purpose: Set initial password after StaffId validation.
- Password policy: ≥8 chars, at least 1 lowercase, 1 uppercase, 1 number.

Request
```json
{ "staffId": "EMP001", "password": "StrongP@ssw0rd!" }
```

Success 200
```json
{ "success": true, "message": "Password set successfully" }
```

Errors (examples)
```json
{ "success": false, "message": "Weak password", "errorCode": "WEAK_PASSWORD" }
```
```json
{ "success": false, "message": "User has already completed onboarding", "errorCode": "ONBOARDING_COMPLETED" }
```

---

### 3) Get Departments
- Method: GET
- Path: `/org/departments`
- Query (optional): `q`, `page`, `pageSize`

Success 200
```json
{
  "success": true,
  "data": [
    { "id": "dept1", "name": "Human Resources Department" },
    { "id": "dept2", "name": "Finance Department" }
  ]
}
```

---

### 4) Get Divisions under a Department
- Method: GET
- Path: `/org/departments/{departmentId}/divisions`

Success 200
```json
{
  "success": true,
  "data": [
    { "id": "div1", "name": "IT Operations Division" }
  ]
}
```

---

### 5) Get Branches under a Division
- Method: GET
- Path: `/org/divisions/{divisionId}/branches`

Success 200
```json
{
  "success": true,
  "data": [
    { "id": "br1", "name": "Network Security Branch" }
  ]
}
```

---

### 6) Get Posts by Scope
- Method: GET
- Path: `/org/posts`
- Purpose: Return available posts within the selected scope.
- Scope precedence: `branchId` > `divisionId` > `departmentId` (use only one).
- Query params:
  - `departmentId` (required if `divisionId`/`branchId` not provided)
  - `divisionId` (required if `branchId` not provided)
  - `branchId` (optional, most specific)
  - `q`, `page`, `pageSize`

Success 200
```json
{
  "success": true,
  "data": [
    {
      "id": "POST_123",
      "name": "Branch Manager",
      "description": "Leads branch operations",
      "gradeLevel": "Level 12",
      "occupied": false
    }
  ]
}
```

Notes
- Backend should filter by scope and either exclude occupied posts or include `occupied: true` so the client can block selection.

---

### 7) Check and Reserve Post (Atomic)
- Method: POST
- Path: `/org/posts/check-and-reserve`
- Purpose: Atomically validate availability and place a short-lived reservation to avoid race conditions.

Request
```json
{
  "staffId": "EMP001",
  "postId": "POST_123",
  "departmentId": "dept1",
  "divisionId": "div1",
  "branchId": "br1"
}
```

Success 200
```json
{
  "success": true,
  "message": "Post reserved",
  "data": { "reservationId": "RSV_abc123", "expiresAt": "2025-09-15T10:00:00Z" }
}
```

Errors (examples)
```json
{ "success": false, "message": "Post already occupied", "errorCode": "POST_OCCUPIED" }
```
```json
{ "success": false, "message": "Scope mismatch", "errorCode": "INVALID_SCOPE" }
```

---

### 8) Confirm Onboarding (Assign Post)
- Method: POST
- Path: `/auth/onboard/confirm`
- Purpose: Finalize onboarding, persist selections, and assign the post.

Request
```json
{
  "staffId": "EMP001",
  "departmentId": "dept1",
  "divisionId": "div1",
  "branchId": "br1",
  "postId": "POST_123",
  "reservationId": "RSV_abc123"
}
```

Success 200
```json
{
  "success": true,
  "message": "Onboarding completed",
  "data": {
    "userId": "USR_999",
    "assignedPost": { "id": "POST_123", "name": "Branch Manager" }
  }
}
```

Errors (examples)
```json
{ "success": false, "message": "Reservation expired", "errorCode": "RESERVATION_EXPIRED" }
```
```json
{ "success": false, "message": "User already onboarded", "errorCode": "ONBOARDING_COMPLETED" }
```

---

### Error Codes (Suggested)
- Auth/Identity: `INVALID_STAFF_ID`, `ONBOARDING_COMPLETED`, `STAFF_NOT_ELIGIBLE`
- Password: `WEAK_PASSWORD`
- Org Structure: `DEPARTMENT_NOT_FOUND`, `DIVISION_NOT_FOUND`, `BRANCH_NOT_FOUND`
- Posts: `POST_NOT_FOUND`, `POST_OCCUPIED`, `INVALID_SCOPE`
- Reservation/Confirm: `RESERVATION_EXPIRED`, `RESERVATION_NOT_FOUND`

### Status Codes
- 200: Success
- 400: Validation error / bad input
- 401: Unauthorized (if token-based endpoints are added later)
- 404: Resource not found
- 409: Conflict (occupied post, already onboarded)
- 500: Server error

### Security & Idempotency
- Enforce HTTPS.
- Rate-limit `/auth/validate-staff-id` and `/auth/set-password`.
- Consider issuing a short-lived onboarding token after StaffId validation to authorize subsequent steps.
- Idempotency (recommended) for write endpoints (`/auth/set-password`, `/org/posts/check-and-reserve`, `/auth/onboard/confirm`):
  - Header: `Idempotency-Key: <uuid>`

### Validation Summary
- StaffId: 6–10 alphanumeric.
- Password: ≥8 chars, at least one lowercase, one uppercase, one number.
- Org path: `departmentId` required; `divisionId` only if selecting division/branch post; `branchId` only if selecting branch post.
- Post: must belong to provided scope; must not be occupied at confirmation time.

### cURL Examples

Validate StaffId
```bash
curl -X POST "$BASE/api/v1/auth/validate-staff-id" \
  -H "Content-Type: application/json" \
  -d '{"staffId":"EMP001"}'
```

Set Password
```bash
curl -X POST "$BASE/api/v1/auth/set-password" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 5e1c1f3a-8db5-4a0e-9b7d-0b1a1e0c3f11" \
  -d '{"staffId":"EMP001","password":"StrongP@ssw0rd!"}'
```

Get Posts (division scope)
```bash
curl "$BASE/api/v1/org/posts?divisionId=div1&q=manager&page=1&pageSize=20"
```

Reserve Post
```bash
curl -X POST "$BASE/api/v1/org/posts/check-and-reserve" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 1f9c0e5e-6a3a-4f4c-9a54-6c50321d9e77" \
  -d '{"staffId":"EMP001","postId":"POST_123","departmentId":"dept1","divisionId":"div1","branchId":"br1"}'
```

Confirm Onboarding
```bash
curl -X POST "$BASE/api/v1/auth/onboard/confirm" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 8c2b08d8-6c03-4bc1-8b2a-e78a33f6b9a2" \
  -d '{"staffId":"EMP001","departmentId":"dept1","divisionId":"div1","branchId":"br1","postId":"POST_123","reservationId":"RSV_abc123"}'
```


