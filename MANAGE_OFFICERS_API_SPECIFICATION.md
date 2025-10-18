# Manage Officers API Specification

## Overview
This document outlines the comprehensive API specification for the Manage Officers page, covering all CRUD operations, search, filtering, and management functionalities for officers within the Performance Management System.

## Base URL
```
https://localhost:44366/api/v1
```

---

## 1. Authentication & Authorization

### Headers
All API requests require authentication headers:
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Required Permissions
- `officers:view` - View officers list
- `officers:create` - Create new officers
- `officers:edit` - Update officer information
- `officers:delete` - Delete officers
- `officers:export` - Export officers data
- `officers:bulk_operations` - Perform bulk operations

---

## 2. Core Officer Management APIs

### 2.1 Get All Officers
**Endpoint:** `GET /api/v1/officers`

**Description:** Retrieve a paginated list of all officers with optional filtering and search.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10, max: 100) |
| search | string | No | Search term for name, IPPIS, email, or department |
| department | string | No | Filter by department |
| gradeLevel | string | No | Filter by grade level |
| status | string | No | Filter by status (active, inactive, suspended) |
| position | string | No | Filter by position |
| sortBy | string | No | Sort field (name, ippis, department, gradeLevel, dateCreated) |
| sortOrder | string | No | Sort order (asc, desc) |

**Request Example:**
```http
GET /api/v1/officers?page=1&limit=20&search=john&department=HR&status=active&sortBy=name&sortOrder=asc
```

**Response:**
```json
{
  "success": true,
  "message": "Officers retrieved successfully",
  "data": {
    "officers": [
      {
        "id": 1,
        "ippis": "12345",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@tetfund.gov.ng",
        "phoneNumber": "08012345678",
        "department": "Human Resources",
        "position": "Director",
        "gradeLevel": "15",
        "status": "active",
        "dateOfBirth": "1980-05-15",
        "dateOfEmployment": "2010-03-01",
        "address": "123 Main Street, Abuja",
        "emergencyContact": {
          "name": "Jane Doe",
          "phone": "08098765432",
          "relationship": "Spouse"
        },
        "qualifications": [
          {
            "id": 1,
            "institution": "University of Lagos",
            "degree": "Bachelor of Science",
            "field": "Business Administration",
            "year": "2005"
          }
        ],
        "dateCreated": "2024-01-15T10:30:00Z",
        "lastUpdated": "2024-01-20T14:45:00Z",
        "createdBy": "admin@tetfund.gov.ng",
        "updatedBy": "admin@tetfund.gov.ng"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "errorCode": null,
  "errors": null
}
```

### 2.2 Get Officer by ID
**Endpoint:** `GET /api/v1/officers/{id}`

**Description:** Retrieve detailed information about a specific officer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Request Example:**
```http
GET /api/v1/officers/1
```

**Response:**
```json
{
  "success": true,
  "message": "Officer retrieved successfully",
  "data": {
    "id": 1,
    "ippis": "12345",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@tetfund.gov.ng",
    "phoneNumber": "08012345678",
    "department": "Human Resources",
    "position": "Director",
    "gradeLevel": "15",
    "status": "active",
    "dateOfBirth": "1980-05-15",
    "dateOfEmployment": "2010-03-01",
    "address": "123 Main Street, Abuja",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "08098765432",
      "relationship": "Spouse"
    },
    "qualifications": [
      {
        "id": 1,
        "institution": "University of Lagos",
        "degree": "Bachelor of Science",
        "field": "Business Administration",
        "year": "2005"
      }
    ],
    "workHistory": [
      {
        "id": 1,
        "position": "Assistant Director",
        "department": "Finance",
        "startDate": "2015-01-01",
        "endDate": "2020-12-31",
        "notes": "Promoted to Director"
      }
    ],
    "currentPost": {
      "id": 1,
      "name": "Director, Human Resources",
      "orgUnit": "Human Resources Department",
      "assignedDate": "2021-01-01"
    },
    "performanceHistory": {
      "totalAppraisals": 4,
      "averageRating": 4.2,
      "lastAppraisalDate": "2023-12-31"
    },
    "dateCreated": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-20T14:45:00Z",
    "createdBy": "admin@tetfund.gov.ng",
    "updatedBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 2.3 Create New Officer
**Endpoint:** `POST /api/v1/officers`

**Description:** Create a new officer record.

**Request Body:**
```json
{
  "ippis": "12346",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@tetfund.gov.ng",
  "phoneNumber": "08012345679",
  "department": "Finance",
  "position": "Deputy Director",
  "gradeLevel": "14",
  "status": "active",
  "dateOfBirth": "1985-08-20",
  "dateOfEmployment": "2012-06-01",
  "address": "456 Oak Avenue, Lagos",
  "emergencyContact": {
    "name": "Bob Smith",
    "phone": "08087654321",
    "relationship": "Brother"
  },
  "qualifications": [
    {
      "institution": "University of Ibadan",
      "degree": "Master of Business Administration",
      "field": "Finance",
      "year": "2010"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer created successfully",
  "data": {
    "id": 2,
    "ippis": "12346",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@tetfund.gov.ng",
    "phoneNumber": "08012345679",
    "department": "Finance",
    "position": "Deputy Director",
    "gradeLevel": "14",
    "status": "active",
    "dateOfBirth": "1985-08-20",
    "dateOfEmployment": "2012-06-01",
    "address": "456 Oak Avenue, Lagos",
    "emergencyContact": {
      "name": "Bob Smith",
      "phone": "08087654321",
      "relationship": "Brother"
    },
    "qualifications": [
      {
        "id": 2,
        "institution": "University of Ibadan",
        "degree": "Master of Business Administration",
        "field": "Finance",
        "year": "2010"
      }
    ],
    "dateCreated": "2024-01-21T09:15:00Z",
    "lastUpdated": "2024-01-21T09:15:00Z",
    "createdBy": "admin@tetfund.gov.ng",
    "updatedBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 2.4 Update Officer
**Endpoint:** `PUT /api/v1/officers/{id}`

**Description:** Update an existing officer's information.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@tetfund.gov.ng",
  "phoneNumber": "08012345678",
  "department": "Human Resources",
  "position": "Director",
  "gradeLevel": "15",
  "status": "active",
  "dateOfBirth": "1980-05-15",
  "dateOfEmployment": "2010-03-01",
  "address": "123 Main Street, Abuja",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "08098765432",
    "relationship": "Spouse"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer updated successfully",
  "data": {
    "id": 1,
    "ippis": "12345",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@tetfund.gov.ng",
    "phoneNumber": "08012345678",
    "department": "Human Resources",
    "position": "Director",
    "gradeLevel": "15",
    "status": "active",
    "dateOfBirth": "1980-05-15",
    "dateOfEmployment": "2010-03-01",
    "address": "123 Main Street, Abuja",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "08098765432",
      "relationship": "Spouse"
    },
    "qualifications": [
      {
        "id": 1,
        "institution": "University of Lagos",
        "degree": "Bachelor of Science",
        "field": "Business Administration",
        "year": "2005"
      }
    ],
    "dateCreated": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-21T11:30:00Z",
    "createdBy": "admin@tetfund.gov.ng",
    "updatedBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 2.5 Delete Officer
**Endpoint:** `DELETE /api/v1/officers/{id}`

**Description:** Delete an officer record.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Request Example:**
```http
DELETE /api/v1/officers/1
```

**Response:**
```json
{
  "success": true,
  "message": "Officer deleted successfully",
  "data": null,
  "errorCode": null,
  "errors": null
}
```

---

## 3. Officer Qualifications Management

### 3.1 Get Officer Qualifications
**Endpoint:** `GET /api/v1/officers/{id}/qualifications`

**Description:** Retrieve all qualifications for a specific officer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Response:**
```json
{
  "success": true,
  "message": "Officer qualifications retrieved successfully",
  "data": [
    {
      "id": 1,
      "officerId": 1,
      "institution": "University of Lagos",
      "degree": "Bachelor of Science",
      "field": "Business Administration",
      "year": "2005",
      "grade": "Second Class Upper",
      "certificateNumber": "BSC-2005-001",
      "dateCreated": "2024-01-15T10:30:00Z"
    }
  ],
  "errorCode": null,
  "errors": null
}
```

### 3.2 Add Officer Qualification
**Endpoint:** `POST /api/v1/officers/{id}/qualifications`

**Description:** Add a new qualification for an officer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Request Body:**
```json
{
  "institution": "University of Ibadan",
  "degree": "Master of Business Administration",
  "field": "Finance",
  "year": "2010",
  "grade": "Distinction",
  "certificateNumber": "MBA-2010-002"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Qualification added successfully",
  "data": {
    "id": 2,
    "officerId": 1,
    "institution": "University of Ibadan",
    "degree": "Master of Business Administration",
    "field": "Finance",
    "year": "2010",
    "grade": "Distinction",
    "certificateNumber": "MBA-2010-002",
    "dateCreated": "2024-01-21T12:00:00Z"
  },
  "errorCode": null,
  "errors": null
}
```

### 3.3 Update Officer Qualification
**Endpoint:** `PUT /api/v1/officers/{id}/qualifications/{qualificationId}`

**Description:** Update an existing qualification.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |
| qualificationId | string | Yes | Qualification ID |

**Request Body:**
```json
{
  "institution": "University of Lagos",
  "degree": "Bachelor of Science",
  "field": "Business Administration",
  "year": "2005",
  "grade": "First Class",
  "certificateNumber": "BSC-2005-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Qualification updated successfully",
  "data": {
    "id": 1,
    "officerId": 1,
    "institution": "University of Lagos",
    "degree": "Bachelor of Science",
    "field": "Business Administration",
    "year": "2005",
    "grade": "First Class",
    "certificateNumber": "BSC-2005-001",
    "dateCreated": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-21T12:30:00Z"
  },
  "errorCode": null,
  "errors": null
}
```

### 3.4 Delete Officer Qualification
**Endpoint:** `DELETE /api/v1/officers/{id}/qualifications/{qualificationId}`

**Description:** Delete a qualification.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |
| qualificationId | string | Yes | Qualification ID |

**Response:**
```json
{
  "success": true,
  "message": "Qualification deleted successfully",
  "data": null,
  "errorCode": null,
  "errors": null
}
```

---

## 4. Officer Work History Management

### 4.1 Get Officer Work History
**Endpoint:** `GET /api/v1/officers/{id}/work-history`

**Description:** Retrieve work history for a specific officer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Response:**
```json
{
  "success": true,
  "message": "Officer work history retrieved successfully",
  "data": [
    {
      "id": 1,
      "officerId": 1,
      "position": "Assistant Director",
      "department": "Finance",
      "startDate": "2015-01-01",
      "endDate": "2020-12-31",
      "notes": "Promoted to Director",
      "dateCreated": "2024-01-15T10:30:00Z"
    }
  ],
  "errorCode": null,
  "errors": null
}
```

### 4.2 Add Work History Entry
**Endpoint:** `POST /api/v1/officers/{id}/work-history`

**Description:** Add a new work history entry.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Request Body:**
```json
{
  "position": "Senior Officer",
  "department": "Human Resources",
  "startDate": "2012-01-01",
  "endDate": "2014-12-31",
  "notes": "Initial position after joining"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Work history entry added successfully",
  "data": {
    "id": 2,
    "officerId": 1,
    "position": "Senior Officer",
    "department": "Human Resources",
    "startDate": "2012-01-01",
    "endDate": "2014-12-31",
    "notes": "Initial position after joining",
    "dateCreated": "2024-01-21T13:00:00Z"
  },
  "errorCode": null,
  "errors": null
}
```

---

## 5. Bulk Operations

### 5.1 Bulk Create Officers
**Endpoint:** `POST /api/v1/officers/bulk`

**Description:** Create multiple officers in a single request.

**Request Body:**
```json
{
  "officers": [
    {
      "ippis": "12347",
      "firstName": "Mike",
      "lastName": "Johnson",
      "email": "mike.johnson@tetfund.gov.ng",
      "phoneNumber": "08012345680",
      "department": "Research",
      "position": "Assistant Director",
      "gradeLevel": "13",
      "status": "active",
      "dateOfBirth": "1990-03-10",
      "dateOfEmployment": "2015-07-01"
    },
    {
      "ippis": "12348",
      "firstName": "Sarah",
      "lastName": "Wilson",
      "email": "sarah.wilson@tetfund.gov.ng",
      "phoneNumber": "08012345681",
      "department": "Administration",
      "position": "Principal Officer",
      "gradeLevel": "12",
      "status": "active",
      "dateOfBirth": "1988-11-25",
      "dateOfEmployment": "2016-02-15"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk officers created successfully",
  "data": {
    "created": 2,
    "failed": 0,
    "officers": [
      {
        "id": 3,
        "ippis": "12347",
        "firstName": "Mike",
        "lastName": "Johnson",
        "email": "mike.johnson@tetfund.gov.ng",
        "phoneNumber": "08012345680",
        "department": "Research",
        "position": "Assistant Director",
        "gradeLevel": "13",
        "status": "active",
        "dateOfBirth": "1990-03-10",
        "dateOfEmployment": "2015-07-01",
        "dateCreated": "2024-01-21T14:00:00Z"
      },
      {
        "id": 4,
        "ippis": "12348",
        "firstName": "Sarah",
        "lastName": "Wilson",
        "email": "sarah.wilson@tetfund.gov.ng",
        "phoneNumber": "08012345681",
        "department": "Administration",
        "position": "Principal Officer",
        "gradeLevel": "12",
        "status": "active",
        "dateOfBirth": "1988-11-25",
        "dateOfEmployment": "2016-02-15",
        "dateCreated": "2024-01-21T14:00:00Z"
      }
    ]
  },
  "errorCode": null,
  "errors": null
}
```

### 5.2 Bulk Update Officers
**Endpoint:** `PUT /api/v1/officers/bulk`

**Description:** Update multiple officers in a single request.

**Request Body:**
```json
{
  "updates": [
    {
      "id": 1,
      "department": "Human Resources",
      "gradeLevel": "16"
    },
    {
      "id": 2,
      "department": "Finance",
      "gradeLevel": "15"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk officers updated successfully",
  "data": {
    "updated": 2,
    "failed": 0,
    "officers": [
      {
        "id": 1,
        "ippis": "12345",
        "firstName": "John",
        "lastName": "Doe",
        "department": "Human Resources",
        "gradeLevel": "16",
        "lastUpdated": "2024-01-21T15:00:00Z"
      },
      {
        "id": 2,
        "ippis": "12346",
        "firstName": "Jane",
        "lastName": "Smith",
        "department": "Finance",
        "gradeLevel": "15",
        "lastUpdated": "2024-01-21T15:00:00Z"
      }
    ]
  },
  "errorCode": null,
  "errors": null
}
```

### 5.3 Bulk Delete Officers
**Endpoint:** `DELETE /api/v1/officers/bulk`

**Description:** Delete multiple officers in a single request.

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk officers deleted successfully",
  "data": {
    "deleted": 3,
    "failed": 0
  },
  "errorCode": null,
  "errors": null
}
```

---

## 6. Export and Reporting

### 6.1 Export Officers
**Endpoint:** `GET /api/v1/officers/export`

**Description:** Export officers data in various formats.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | Yes | Export format (csv, excel, pdf) |
| search | string | No | Search term for filtering |
| department | string | No | Filter by department |
| gradeLevel | string | No | Filter by grade level |
| status | string | No | Filter by status |
| includeQualifications | boolean | No | Include qualifications in export (default: false) |
| includeWorkHistory | boolean | No | Include work history in export (default: false) |

**Request Example:**
```http
GET /api/v1/officers/export?format=excel&department=HR&includeQualifications=true
```

**Response:**
```json
{
  "success": true,
  "message": "Officers export generated successfully",
  "data": {
    "downloadUrl": "https://localhost:44366/api/v1/exports/officers_20240121_150000.xlsx",
    "fileName": "officers_20240121_150000.xlsx",
    "fileSize": "2.5MB",
    "expiresAt": "2024-01-22T15:00:00Z"
  },
  "errorCode": null,
  "errors": null
}
```

### 6.2 Get Officers Statistics
**Endpoint:** `GET /api/v1/officers/statistics`

**Description:** Retrieve statistical information about officers.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| department | string | No | Filter by department |
| gradeLevel | string | No | Filter by grade level |
| dateFrom | string | No | Start date for statistics (YYYY-MM-DD) |
| dateTo | string | No | End date for statistics (YYYY-MM-DD) |

**Response:**
```json
{
  "success": true,
  "message": "Officers statistics retrieved successfully",
  "data": {
    "totalOfficers": 150,
    "activeOfficers": 145,
    "inactiveOfficers": 5,
    "byDepartment": {
      "Human Resources": 25,
      "Finance": 30,
      "Research": 20,
      "Administration": 35,
      "IT": 15,
      "Legal": 10,
      "Audit": 15
    },
    "byGradeLevel": {
      "17": 5,
      "16": 10,
      "15": 20,
      "14": 25,
      "13": 30,
      "12": 35,
      "11": 20,
      "10": 5
    },
    "byStatus": {
      "active": 145,
      "inactive": 3,
      "suspended": 2
    },
    "averageAge": 42.5,
    "averageYearsOfService": 8.2,
    "newHiresThisYear": 12,
    "retirementsThisYear": 3
  },
  "errorCode": null,
  "errors": null
}
```

---

## 7. Search and Advanced Filtering

### 7.1 Advanced Search
**Endpoint:** `POST /api/v1/officers/search`

**Description:** Perform advanced search with multiple criteria.

**Request Body:**
```json
{
  "criteria": {
    "name": "John",
    "department": "Human Resources",
    "gradeLevel": {
      "min": 13,
      "max": 16
    },
    "dateOfEmployment": {
      "from": "2010-01-01",
      "to": "2020-12-31"
    },
    "qualifications": {
      "degree": "Master",
      "field": "Business"
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20
  },
  "sorting": {
    "field": "name",
    "order": "asc"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Advanced search completed successfully",
  "data": {
    "officers": [
      {
        "id": 1,
        "ippis": "12345",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@tetfund.gov.ng",
        "department": "Human Resources",
        "gradeLevel": "15",
        "qualifications": [
          {
            "degree": "Master of Business Administration",
            "field": "Business Administration",
            "year": "2010"
          }
        ]
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    },
    "searchMetadata": {
      "searchTime": "0.045s",
      "totalMatches": 5,
      "filtersApplied": 5
    }
  },
  "errorCode": null,
  "errors": null
}
```

---

## 8. Officer Status Management

### 8.1 Update Officer Status
**Endpoint:** `PUT /api/v1/officers/{id}/status`

**Description:** Update an officer's status (active, inactive, suspended).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Request Body:**
```json
{
  "status": "inactive",
  "reason": "Resigned",
  "effectiveDate": "2024-01-31",
  "notes": "Officer submitted resignation letter"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer status updated successfully",
  "data": {
    "id": 1,
    "ippis": "12345",
    "firstName": "John",
    "lastName": "Doe",
    "status": "inactive",
    "statusReason": "Resigned",
    "statusEffectiveDate": "2024-01-31",
    "statusNotes": "Officer submitted resignation letter",
    "lastUpdated": "2024-01-21T16:00:00Z"
  },
  "errorCode": null,
  "errors": null
}
```

### 8.2 Get Status History
**Endpoint:** `GET /api/v1/officers/{id}/status-history`

**Description:** Retrieve status change history for an officer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Officer ID |

**Response:**
```json
{
  "success": true,
  "message": "Officer status history retrieved successfully",
  "data": [
    {
      "id": 1,
      "officerId": 1,
      "previousStatus": "active",
      "newStatus": "inactive",
      "reason": "Resigned",
      "effectiveDate": "2024-01-31",
      "notes": "Officer submitted resignation letter",
      "changedBy": "admin@tetfund.gov.ng",
      "dateChanged": "2024-01-21T16:00:00Z"
    }
  ],
  "errorCode": null,
  "errors": null
}
```

---

## 9. Data Validation and Constraints

### 9.1 Validate Officer Data
**Endpoint:** `POST /api/v1/officers/validate`

**Description:** Validate officer data before creation or update.

**Request Body:**
```json
{
  "ippis": "12345",
  "email": "john.doe@tetfund.gov.ng",
  "phoneNumber": "08012345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Validation completed",
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": [
      "IPPIS number already exists for another officer"
    ]
  },
  "errorCode": null,
  "errors": null
}
```

---

## 10. Error Handling

### 10.1 Common Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Email address is required",
      "code": "REQUIRED"
    },
    {
      "field": "ippis",
      "message": "IPPIS number must be unique",
      "code": "UNIQUE_CONSTRAINT"
    }
  ]
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Officer not found",
  "data": null,
  "errorCode": "NOT_FOUND",
  "errors": [
    {
      "field": "id",
      "message": "Officer with ID 999 does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

**Unauthorized Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errorCode": "UNAUTHORIZED",
  "errors": [
    {
      "field": "authorization",
      "message": "Invalid or expired token",
      "code": "INVALID_TOKEN"
    }
  ]
}
```

**Forbidden Error (403):**
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "data": null,
  "errorCode": "FORBIDDEN",
  "errors": [
    {
      "field": "permissions",
      "message": "You do not have permission to delete officers",
      "code": "INSUFFICIENT_PERMISSIONS"
    }
  ]
}
```

**Internal Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null,
  "errorCode": "INTERNAL_ERROR",
  "errors": [
    {
      "field": "server",
      "message": "An unexpected error occurred while processing your request",
      "code": "INTERNAL_ERROR"
    }
  ]
}
```

---

## 11. Data Models

### 11.1 Officer Model
```typescript
interface Officer {
  id: number;
  ippis: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  gradeLevel: string;
  status: 'active' | 'inactive' | 'suspended';
  dateOfBirth: string; // ISO date
  dateOfEmployment: string; // ISO date
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  qualifications: Qualification[];
  workHistory: WorkHistoryEntry[];
  currentPost?: {
    id: number;
    name: string;
    orgUnit: string;
    assignedDate: string;
  };
  performanceHistory?: {
    totalAppraisals: number;
    averageRating: number;
    lastAppraisalDate: string;
  };
  dateCreated: string; // ISO datetime
  lastUpdated: string; // ISO datetime
  createdBy: string;
  updatedBy: string;
}
```

### 11.2 Qualification Model
```typescript
interface Qualification {
  id: number;
  officerId: number;
  institution: string;
  degree: string;
  field: string;
  year: number;
  grade?: string;
  certificateNumber?: string;
  dateCreated: string; // ISO datetime
  lastUpdated?: string; // ISO datetime
}
```

### 11.3 Work History Entry Model
```typescript
interface WorkHistoryEntry {
  id: number;
  officerId: number;
  position: string;
  department: string;
  startDate: string; // ISO date
  endDate?: string; // ISO date
  notes?: string;
  dateCreated: string; // ISO datetime
}
```

---

## 12. Rate Limiting

### 12.1 Rate Limits
- **Standard Operations**: 100 requests per minute per user
- **Bulk Operations**: 10 requests per minute per user
- **Export Operations**: 5 requests per minute per user
- **Search Operations**: 50 requests per minute per user

### 12.2 Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 13. Caching

### 13.1 Cache Headers
- **Officer List**: Cache for 5 minutes
- **Officer Details**: Cache for 10 minutes
- **Statistics**: Cache for 15 minutes
- **Export URLs**: Cache for 1 hour

### 13.2 Cache Invalidation
- Officer data is invalidated when any officer is created, updated, or deleted
- Statistics are invalidated when officer status changes
- Export URLs are invalidated after expiration

---

## 14. Security Considerations

### 14.1 Data Protection
- All personal data is encrypted at rest
- Sensitive fields (SSN, bank details) are masked in responses
- Audit logs are maintained for all data modifications

### 14.2 Access Control
- Role-based access control (RBAC) is enforced
- Department-based data filtering for non-admin users
- API keys are required for external integrations

### 14.3 Input Validation
- All input data is validated and sanitized
- SQL injection prevention measures are in place
- XSS protection is implemented

---

## 15. Performance Considerations

### 15.1 Database Optimization
- Indexes are created on frequently queried fields
- Pagination is implemented for large datasets
- Query optimization is performed regularly

### 15.2 Response Optimization
- Response compression is enabled
- Unnecessary data is excluded from list responses
- Lazy loading is implemented for related data

---

## 16. Monitoring and Logging

### 16.1 API Monitoring
- Response times are monitored
- Error rates are tracked
- Usage patterns are analyzed

### 16.2 Audit Logging
- All CRUD operations are logged
- User actions are tracked
- Data changes are recorded with timestamps

---

## 17. Integration Points

### 17.1 HR System Integration
- Employee data synchronization
- Organizational structure updates
- Performance appraisal integration

### 17.2 External Systems
- Government database integration
- Payroll system integration
- Training management system integration

---

This comprehensive API specification covers all the functionalities needed for the Manage Officers page, including CRUD operations, advanced search, bulk operations, reporting, and data management features.
