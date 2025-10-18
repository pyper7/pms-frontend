# Appraisal Settings API Documentation

## Overview
The Appraisal Settings API provides comprehensive management of competencies, processes, appraisal periods, scoring weights, and notification settings for the Performance Management System.

## Base URL
```
/api/v1/appraisal-settings
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Competencies Management

### 1. Get All Competencies
**Endpoint:** `GET /competencies`

**Description:** Retrieve all competencies with optional filtering and pagination.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `pageSize` | integer | No | 6 | Number of items per page |
| `search` | string | No | "" | Search term for name or description |
| `category` | string | No | "ALL" | Filter by category (GENERIC, FUNCTIONAL, ETHICS, ALL) |
| `isActive` | boolean | No | null | Filter by active status |

**Response:**
```json
{
  "success": true,
  "data": {
    "competencies": [
      {
        "id": "1",
        "name": "Communication Skills",
        "category": "GENERIC",
        "description": "Ability to communicate effectively with colleagues, stakeholders, and clients",
        "isActive": true,
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 6,
      "totalPages": 3,
      "totalItems": 18,
      "hasNext": true,
      "hasPrevious": false
    },
    "filters": {
      "search": "",
      "category": "ALL",
      "isActive": null
    }
  }
}
```

### 2. Create Competency
**Endpoint:** `POST /competencies`

**Description:** Create a new competency.

**Request Body:**
```json
{
  "name": "Leadership",
  "category": "GENERIC",
  "description": "Ability to lead and motivate team members",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "19",
    "name": "Leadership",
    "category": "GENERIC",
    "description": "Ability to lead and motivate team members",
    "isActive": true,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Competency created successfully"
}
```

### 3. Update Competency
**Endpoint:** `PUT /competencies/{id}`

**Description:** Update an existing competency.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Competency ID |

**Request Body:**
```json
{
  "name": "Advanced Leadership",
  "category": "FUNCTIONAL",
  "description": "Advanced ability to lead and motivate team members",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Advanced Leadership",
    "category": "FUNCTIONAL",
    "description": "Advanced ability to lead and motivate team members",
    "isActive": true,
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Competency updated successfully"
}
```

### 4. Delete Competency
**Endpoint:** `DELETE /competencies/{id}`

**Description:** Delete a competency.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Competency ID |

**Response:**
```json
{
  "success": true,
  "message": "Competency deleted successfully"
}
```

### 5. Toggle Competency Status
**Endpoint:** `PATCH /competencies/{id}/toggle-status`

**Description:** Toggle the active status of a competency.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Competency ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "isActive": false,
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Competency status updated successfully"
}
```

---

## Processes Management

### 1. Get All Processes
**Endpoint:** `GET /processes`

**Description:** Retrieve all processes and operations.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `pageSize` | integer | No | 10 | Number of items per page |
| `search` | string | No | "" | Search term for name or description |
| `isActive` | boolean | No | null | Filter by active status |

**Response:**
```json
{
  "success": true,
  "data": {
    "processes": [
      {
        "id": "1",
        "name": "Punctuality/Attendance",
        "description": "Maintain 95% attendance rate and punctuality",
        "weight": 10,
        "isActive": true,
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 1,
      "totalItems": 3,
      "hasNext": false,
      "hasPrevious": false
    }
  }
}
```

### 2. Create Process
**Endpoint:** `POST /processes`

**Description:** Create a new process.

**Request Body:**
```json
{
  "name": "Work Turn Around Time",
  "description": "Complete tasks within agreed timelines",
  "weight": 10,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "name": "Work Turn Around Time",
    "description": "Complete tasks within agreed timelines",
    "weight": 10,
    "isActive": true,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Process created successfully"
}
```

### 3. Update Process
**Endpoint:** `PUT /processes/{id}`

**Description:** Update an existing process.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Process ID |

**Request Body:**
```json
{
  "name": "Innovation on the Job",
  "description": "Implement process improvements and innovative solutions",
  "weight": 15,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Innovation on the Job",
    "description": "Implement process improvements and innovative solutions",
    "weight": 15,
    "isActive": true,
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Process updated successfully"
}
```

### 4. Delete Process
**Endpoint:** `DELETE /processes/{id}`

**Description:** Delete a process.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Process ID |

**Response:**
```json
{
  "success": true,
  "message": "Process deleted successfully"
}
```

### 5. Toggle Process Status
**Endpoint:** `PATCH /processes/{id}/toggle-status`

**Description:** Toggle the active status of a process.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Process ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "isActive": false,
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Process status updated successfully"
}
```

---

## Appraisal Periods Management

### 1. Get All Periods
**Endpoint:** `GET /periods`

**Description:** Retrieve all appraisal periods.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `pageSize` | integer | No | 10 | Number of items per page |
| `search` | string | No | "" | Search term for name |
| `isActive` | boolean | No | null | Filter by active status |
| `year` | integer | No | null | Filter by year |

**Response:**
```json
{
  "success": true,
  "data": {
    "periods": [
      {
        "id": "1",
        "name": "Q1 2024",
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 1,
      "totalItems": 4,
      "hasNext": false,
      "hasPrevious": false
    }
  }
}
```

### 2. Create Period
**Endpoint:** `POST /periods`

**Description:** Create a new appraisal period.

**Request Body:**
```json
{
  "name": "Q2 2024",
  "startDate": "2024-04-01",
  "endDate": "2024-06-30",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "5",
    "name": "Q2 2024",
    "startDate": "2024-04-01",
    "endDate": "2024-06-30",
    "isActive": true,
    "createdAt": "2024-01-20T10:30:00Z"
  },
  "message": "Period created successfully"
}
```

### 3. Update Period
**Endpoint:** `PUT /periods/{id}`

**Description:** Update an existing appraisal period.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Period ID |

**Request Body:**
```json
{
  "name": "Q1 2024 (Updated)",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Q1 2024 (Updated)",
    "startDate": "2024-01-01",
    "endDate": "2024-03-31",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Period updated successfully"
}
```

### 4. Delete Period
**Endpoint:** `DELETE /periods/{id}`

**Description:** Delete an appraisal period.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Period ID |

**Response:**
```json
{
  "success": true,
  "message": "Period deleted successfully"
}
```

### 5. Toggle Period Status
**Endpoint:** `PATCH /periods/{id}/toggle-status`

**Description:** Toggle the active status of an appraisal period.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Period ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "isActive": false,
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Period status updated successfully"
}
```

---

## Scoring Weights Management

### 1. Get Scoring Weights
**Endpoint:** `GET /scoring-weights`

**Description:** Retrieve current scoring weights configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "weights": [
      {
        "id": "1",
        "section": "KPI_TASKS",
        "weight": 70,
        "description": "Key Performance Indicators and Tasks"
      },
      {
        "id": "2",
        "section": "COMPETENCIES",
        "weight": 20,
        "description": "Core Competencies"
      },
      {
        "id": "3",
        "section": "PROCESSES",
        "weight": 10,
        "description": "Processes and Operations"
      }
    ],
    "totalWeight": 100,
    "isValid": true
  }
}
```

### 2. Update Scoring Weights
**Endpoint:** `PUT /scoring-weights`

**Description:** Update scoring weights configuration.

**Request Body:**
```json
{
  "weights": [
    {
      "section": "KPI_TASKS",
      "weight": 60
    },
    {
      "section": "COMPETENCIES",
      "weight": 25
    },
    {
      "section": "PROCESSES",
      "weight": 15
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "weights": [
      {
        "id": "1",
        "section": "KPI_TASKS",
        "weight": 60,
        "description": "Key Performance Indicators and Tasks",
        "updatedAt": "2024-01-20T10:30:00Z"
      },
      {
        "id": "2",
        "section": "COMPETENCIES",
        "weight": 25,
        "description": "Core Competencies",
        "updatedAt": "2024-01-20T10:30:00Z"
      },
      {
        "id": "3",
        "section": "PROCESSES",
        "weight": 15,
        "description": "Processes and Operations",
        "updatedAt": "2024-01-20T10:30:00Z"
      }
    ],
    "totalWeight": 100,
    "isValid": true
  },
  "message": "Scoring weights updated successfully"
}
```

---

## Notification Settings Management

### 1. Get Notification Settings
**Endpoint:** `GET /notification-settings`

**Description:** Retrieve current notification settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "systemNotifications": true,
    "reminderDays": 7,
    "escalationDays": 3,
    "autoReminders": true,
    "deadlineAlerts": true,
    "approvalNotifications": true,
    "rejectionNotifications": true,
    "updateNotifications": true
  }
}
```

### 2. Update Notification Settings
**Endpoint:** `PUT /notification-settings`

**Description:** Update notification settings.

**Request Body:**
```json
{
  "emailNotifications": true,
  "systemNotifications": false,
  "reminderDays": 5,
  "escalationDays": 2,
  "autoReminders": true,
  "deadlineAlerts": true,
  "approvalNotifications": true,
  "rejectionNotifications": true,
  "updateNotifications": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "systemNotifications": false,
    "reminderDays": 5,
    "escalationDays": 2,
    "autoReminders": true,
    "deadlineAlerts": true,
    "approvalNotifications": true,
    "rejectionNotifications": true,
    "updateNotifications": false,
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Notification settings updated successfully"
}
```

---

## Bulk Operations

### 1. Bulk Create Competencies
**Endpoint:** `POST /competencies/bulk`

**Description:** Create multiple competencies at once.

**Request Body:**
```json
{
  "competencies": [
    {
      "name": "Strategic Thinking",
      "category": "FUNCTIONAL",
      "description": "Ability to think strategically and plan long-term",
      "isActive": true
    },
    {
      "name": "Ethical Decision Making",
      "category": "ETHICS",
      "description": "Ability to make ethical decisions in complex situations",
      "isActive": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "created": 2,
    "failed": 0,
    "competencies": [
      {
        "id": "20",
        "name": "Strategic Thinking",
        "category": "FUNCTIONAL",
        "description": "Ability to think strategically and plan long-term",
        "isActive": true,
        "createdAt": "2024-01-20T10:30:00Z",
        "updatedAt": "2024-01-20T10:30:00Z"
      },
      {
        "id": "21",
        "name": "Ethical Decision Making",
        "category": "ETHICS",
        "description": "Ability to make ethical decisions in complex situations",
        "isActive": true,
        "createdAt": "2024-01-20T10:30:00Z",
        "updatedAt": "2024-01-20T10:30:00Z"
      }
    ]
  },
  "message": "Bulk creation completed successfully"
}
```

### 2. Bulk Update Competencies
**Endpoint:** `PUT /competencies/bulk`

**Description:** Update multiple competencies at once.

**Request Body:**
```json
{
  "competencies": [
    {
      "id": "1",
      "name": "Advanced Communication",
      "category": "GENERIC",
      "description": "Advanced communication skills for senior roles",
      "isActive": true
    },
    {
      "id": "2",
      "name": "Team Leadership",
      "category": "FUNCTIONAL",
      "description": "Leadership skills for team management",
      "isActive": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": 2,
    "failed": 0,
    "competencies": [
      {
        "id": "1",
        "name": "Advanced Communication",
        "category": "GENERIC",
        "description": "Advanced communication skills for senior roles",
        "isActive": true,
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-20T10:30:00Z"
      },
      {
        "id": "2",
        "name": "Team Leadership",
        "category": "FUNCTIONAL",
        "description": "Leadership skills for team management",
        "isActive": true,
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-20T10:30:00Z"
      }
    ]
  },
  "message": "Bulk update completed successfully"
}
```

---

## Export/Import Operations

### 1. Export Competencies
**Endpoint:** `GET /competencies/export`

**Description:** Export competencies to various formats.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | Yes | "json" | Export format (json, csv, excel) |
| `category` | string | No | "ALL" | Filter by category |
| `isActive` | boolean | No | null | Filter by active status |

**Response:**
- **JSON Format:** Returns JSON array of competencies
- **CSV Format:** Returns CSV file download
- **Excel Format:** Returns Excel file download

### 2. Import Competencies
**Endpoint:** `POST /competencies/import`

**Description:** Import competencies from file.

**Request Body:** Multipart form data with file upload

**Supported Formats:** JSON, CSV, Excel

**Response:**
```json
{
  "success": true,
  "data": {
    "imported": 15,
    "skipped": 2,
    "errors": 1,
    "details": [
      {
        "row": 3,
        "name": "Invalid Competency",
        "error": "Category must be one of: GENERIC, FUNCTIONAL, ETHICS"
      }
    ]
  },
  "message": "Import completed with 15 imported, 2 skipped, 1 error"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "category",
        "message": "Category must be one of: GENERIC, FUNCTIONAL, ETHICS"
      }
    ]
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

All endpoints are rate limited:
- **Standard endpoints:** 100 requests per minute per user
- **Bulk operations:** 10 requests per minute per user
- **Export/Import:** 5 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhooks

### Competency Events
- `competency.created` - Fired when a competency is created
- `competency.updated` - Fired when a competency is updated
- `competency.deleted` - Fired when a competency is deleted
- `competency.status_changed` - Fired when competency status changes

### Process Events
- `process.created` - Fired when a process is created
- `process.updated` - Fired when a process is updated
- `process.deleted` - Fired when a process is deleted
- `process.status_changed` - Fired when process status changes

### Period Events
- `period.created` - Fired when a period is created
- `period.updated` - Fired when a period is updated
- `period.deleted` - Fired when a period is deleted
- `period.status_changed` - Fired when period status changes

### Webhook Payload Example
```json
{
  "event": "competency.created",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "id": "19",
    "name": "Leadership",
    "category": "GENERIC",
    "description": "Ability to lead and motivate team members",
    "isActive": true,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript
```typescript
import { AppraisalSettingsAPI } from '@pms/sdk';

const api = new AppraisalSettingsAPI({
  baseURL: 'https://api.pms.com/v1',
  token: 'your-jwt-token'
});

// Get competencies with pagination
const competencies = await api.competencies.getAll({
  page: 1,
  pageSize: 10,
  category: 'GENERIC',
  search: 'leadership'
});

// Create new competency
const newCompetency = await api.competencies.create({
  name: 'Strategic Thinking',
  category: 'FUNCTIONAL',
  description: 'Ability to think strategically',
  isActive: true
});

// Update scoring weights
await api.scoringWeights.update({
  weights: [
    { section: 'KPI_TASKS', weight: 60 },
    { section: 'COMPETENCIES', weight: 25 },
    { section: 'PROCESSES', weight: 15 }
  ]
});
```

### Python
```python
from pms_sdk import AppraisalSettingsAPI

api = AppraisalSettingsAPI(
    base_url='https://api.pms.com/v1',
    token='your-jwt-token'
)

# Get competencies
competencies = api.competencies.get_all(
    page=1,
    page_size=10,
    category='GENERIC',
    search='leadership'
)

# Create new competency
new_competency = api.competencies.create({
    'name': 'Strategic Thinking',
    'category': 'FUNCTIONAL',
    'description': 'Ability to think strategically',
    'isActive': True
})
```

---

## Testing

### Postman Collection
A complete Postman collection is available for testing all endpoints:
- Import the collection from `/docs/postman/AppraisalSettings.postman_collection.json`
- Set up environment variables for base URL and authentication token
- Run the collection to test all endpoints

### Test Data
Sample test data is provided in `/docs/test-data/`:
- `competencies.json` - Sample competencies data
- `processes.json` - Sample processes data
- `periods.json` - Sample periods data

---

## Changelog

### Version 1.2.0 (2024-01-20)
- Added bulk operations for competencies
- Added export/import functionality
- Added webhook support
- Enhanced pagination and filtering

### Version 1.1.0 (2024-01-15)
- Added notification settings management
- Added scoring weights management
- Added process management
- Added period management

### Version 1.0.0 (2024-01-01)
- Initial release
- Basic competency management
- CRUD operations
- Authentication and authorization

---

## Support

For API support and questions:
- **Email:** api-support@pms.com
- **Documentation:** https://docs.pms.com/api
- **Status Page:** https://status.pms.com
- **GitHub Issues:** https://github.com/pms/api/issues
