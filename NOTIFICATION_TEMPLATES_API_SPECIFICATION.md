# Notification Templates API Specification

## Overview
This document provides comprehensive API specifications for the Notification Templates management system in the TETFund Performance Management System (PMS). The notification templates system allows administrators to create, manage, and configure reusable notification templates for various system events and user communications.

## Base URL
```
https://localhost:44366/api/v1
```

## Authentication
All endpoints require authentication using JWT Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Notification Templates Management

### 1.1 Get All Notification Templates
**Endpoint:** `GET /notification-templates`

**Description:** Retrieve a paginated list of notification templates with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10, max: 100) |
| search | string | No | Search term for name, description, or subject |
| type | string | No | Filter by notification type |
| channel | string | No | Filter by notification channel |
| isActive | boolean | No | Filter by active status |
| sortBy | string | No | Sort field (name, createdAt, updatedAt) |
| sortOrder | string | No | Sort order (asc, desc) |

**Request Example:**
```http
GET /notification-templates?page=1&limit=10&search=appraisal&type=appraisal_period_start&channel=email&isActive=true&sortBy=name&sortOrder=asc
```

**Response:**
```json
{
  "success": true,
  "message": "Notification templates retrieved successfully",
  "data": {
    "templates": [
      {
        "id": "1",
        "name": "Appraisal Period Start Notification",
        "description": "Notification sent when appraisal period begins",
        "type": "appraisal_period_start",
        "channel": "email",
        "subject": "Appraisal Period Started - {PeriodName}",
        "body": "Dear {StaffName},\n\nThe {PeriodName} has officially started. Please complete your self-appraisal by {Deadline}.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
        "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
        "isActive": true,
        "isSystemTemplate": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "createdBy": "admin@tetfund.gov.ng"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "errorCode": null,
  "errors": null
}
```

### 1.2 Get Notification Template by ID
**Endpoint:** `GET /notification-templates/{id}`

**Description:** Retrieve a specific notification template by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID |

**Request Example:**
```http
GET /notification-templates/1
```

**Response:**
```json
{
  "success": true,
  "message": "Notification template retrieved successfully",
  "data": {
    "id": "1",
    "name": "Appraisal Period Start Notification",
    "description": "Notification sent when appraisal period begins",
    "type": "appraisal_period_start",
    "channel": "email",
    "subject": "Appraisal Period Started - {PeriodName}",
    "body": "Dear {StaffName},\n\nThe {PeriodName} has officially started. Please complete your self-appraisal by {Deadline}.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
    "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
    "isActive": true,
    "isSystemTemplate": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 1.3 Create Notification Template
**Endpoint:** `POST /notification-templates`

**Description:** Create a new notification template.

**Request Body:**
```json
{
  "name": "Self Appraisal Due Reminder",
  "description": "Reminder notification for self appraisal deadline",
  "type": "self_appraisal_due",
  "channel": "email",
  "subject": "Self Appraisal Due Soon - {PeriodName}",
  "body": "Dear {StaffName},\n\nYour self appraisal for {PeriodName} is due on {Deadline}. Please complete it as soon as possible.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
  "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
  "isActive": true
}
```

**Validation Rules:**
- `name`: Required, string, max 100 characters
- `description`: Required, string, max 500 characters
- `type`: Required, must be valid NotificationType enum value
- `channel`: Required, must be valid NotificationChannel enum value
- `subject`: Required, string, max 200 characters
- `body`: Required, string, max 5000 characters
- `mergeFields`: Optional, array of strings, max 20 items
- `isActive`: Optional, boolean, default true

**Response:**
```json
{
  "success": true,
  "message": "Notification template created successfully",
  "data": {
    "id": "2",
    "name": "Self Appraisal Due Reminder",
    "description": "Reminder notification for self appraisal deadline",
    "type": "self_appraisal_due",
    "channel": "email",
    "subject": "Self Appraisal Due Soon - {PeriodName}",
    "body": "Dear {StaffName},\n\nYour self appraisal for {PeriodName} is due on {Deadline}. Please complete it as soon as possible.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
    "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
    "isActive": true,
    "isSystemTemplate": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "createdBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 1.4 Update Notification Template
**Endpoint:** `PUT /notification-templates/{id}`

**Description:** Update an existing notification template.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID |

**Request Body:**
```json
{
  "name": "Self Appraisal Due Reminder - Updated",
  "description": "Updated reminder notification for self appraisal deadline",
  "type": "self_appraisal_due",
  "channel": "email",
  "subject": "URGENT: Self Appraisal Due Soon - {PeriodName}",
  "body": "Dear {StaffName},\n\nURGENT: Your self appraisal for {PeriodName} is due on {Deadline}. Please complete it immediately.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
  "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification template updated successfully",
  "data": {
    "id": "2",
    "name": "Self Appraisal Due Reminder - Updated",
    "description": "Updated reminder notification for self appraisal deadline",
    "type": "self_appraisal_due",
    "channel": "email",
    "subject": "URGENT: Self Appraisal Due Soon - {PeriodName}",
    "body": "Dear {StaffName},\n\nURGENT: Your self appraisal for {PeriodName} is due on {Deadline}. Please complete it immediately.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
    "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
    "isActive": true,
    "isSystemTemplate": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:30:00Z",
    "createdBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 1.5 Delete Notification Template
**Endpoint:** `DELETE /notification-templates/{id}`

**Description:** Delete a notification template. System templates cannot be deleted.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID |

**Request Example:**
```http
DELETE /notification-templates/2
```

**Response:**
```json
{
  "success": true,
  "message": "Notification template deleted successfully",
  "data": null,
  "errorCode": null,
  "errors": null
}
```

### 1.6 Duplicate Notification Template
**Endpoint:** `POST /notification-templates/{id}/duplicate`

**Description:** Create a copy of an existing notification template.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID to duplicate |

**Request Body:**
```json
{
  "name": "Copy of Appraisal Period Start Notification"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification template duplicated successfully",
  "data": {
    "id": "3",
    "name": "Copy of Appraisal Period Start Notification",
    "description": "Notification sent when appraisal period begins",
    "type": "appraisal_period_start",
    "channel": "email",
    "subject": "Appraisal Period Started - {PeriodName}",
    "body": "Dear {StaffName},\n\nThe {PeriodName} has officially started. Please complete your self-appraisal by {Deadline}.\n\nAppraisal Link: {AppraisalLink}\n\nBest regards,\n{SystemName} Team",
    "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}", "{AppraisalLink}", "{SystemName}"],
    "isActive": true,
    "isSystemTemplate": false,
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "createdBy": "admin@tetfund.gov.ng"
  },
  "errorCode": null,
  "errors": null
}
```

### 1.7 Toggle Template Status
**Endpoint:** `PUT /notification-templates/{id}/toggle-status`

**Description:** Toggle the active status of a notification template.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID |

**Request Example:**
```http
PUT /notification-templates/1/toggle-status
```

**Response:**
```json
{
  "success": true,
  "message": "Template status updated successfully",
  "data": {
    "id": "1",
    "isActive": false
  },
  "errorCode": null,
  "errors": null
}
```

---

## 2. Template Preview and Testing

### 2.1 Preview Template
**Endpoint:** `POST /notification-templates/preview`

**Description:** Preview how a template will look with sample merge field values.

**Request Body:**
```json
{
  "templateId": "1",
  "mergeFields": {
    "{StaffName}": "John Doe",
    "{PeriodName}": "2024 Annual Appraisal",
    "{Deadline}": "15th June 2024",
    "{AppraisalLink}": "https://pms.tetfund.gov.ng/appraisal/123",
    "{SystemName}": "TETFund PMS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template preview generated successfully",
  "data": {
    "renderedSubject": "Appraisal Period Started - 2024 Annual Appraisal",
    "renderedBody": "Dear John Doe,\n\nThe 2024 Annual Appraisal has officially started. Please complete your self-appraisal by 15th June 2024.\n\nAppraisal Link: https://pms.tetfund.gov.ng/appraisal/123\n\nBest regards,\nTETFund PMS Team",
    "template": {
      "id": "1",
      "name": "Appraisal Period Start Notification",
      "type": "appraisal_period_start",
      "channel": "email"
    }
  },
  "errorCode": null,
  "errors": null
}
```

### 2.2 Test Template
**Endpoint:** `POST /notification-templates/{id}/test`

**Description:** Send a test notification using the template to specified recipients.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID |

**Request Body:**
```json
{
  "recipients": [
    {
      "email": "test@tetfund.gov.ng",
      "name": "Test User"
    }
  ],
  "mergeFields": {
    "{StaffName}": "Test User",
    "{PeriodName}": "2024 Annual Appraisal",
    "{Deadline}": "15th June 2024",
    "{AppraisalLink}": "https://pms.tetfund.gov.ng/appraisal/123",
    "{SystemName}": "TETFund PMS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test notification sent successfully",
  "data": {
    "notificationId": "test-123",
    "recipients": 1,
    "sentAt": "2024-01-15T12:30:00Z"
  },
  "errorCode": null,
  "errors": null
}
```

---

## 3. Merge Fields Management

### 3.1 Get Available Merge Fields
**Endpoint:** `GET /notification-templates/merge-fields`

**Description:** Get all available merge fields that can be used in templates.

**Request Example:**
```http
GET /notification-templates/merge-fields
```

**Response:**
```json
{
  "success": true,
  "message": "Merge fields retrieved successfully",
  "data": {
    "mergeFields": [
      {
        "key": "{StaffName}",
        "label": "Staff Name",
        "description": "Full name of the staff member",
        "example": "John Doe",
        "category": "user"
      },
      {
        "key": "{StaffEmail}",
        "label": "Staff Email",
        "description": "Email address of the staff member",
        "example": "john.doe@example.com",
        "category": "user"
      },
      {
        "key": "{PeriodName}",
        "label": "Appraisal Period",
        "description": "Name of the appraisal period",
        "example": "2024 Annual Appraisal",
        "category": "appraisal"
      },
      {
        "key": "{SystemName}",
        "label": "System Name",
        "description": "Name of the PMS system",
        "example": "TETFund PMS",
        "category": "system"
      }
    ],
    "categories": [
      {
        "name": "user",
        "label": "User Information",
        "description": "Fields related to user data"
      },
      {
        "name": "appraisal",
        "label": "Appraisal Information",
        "description": "Fields related to performance appraisal"
      },
      {
        "name": "system",
        "label": "System Information",
        "description": "Fields related to system data"
      },
      {
        "name": "custom",
        "label": "Custom Fields",
        "description": "Custom merge fields"
      }
    ]
  },
  "errorCode": null,
  "errors": null
}
```

### 3.2 Validate Merge Fields
**Endpoint:** `POST /notification-templates/validate-merge-fields`

**Description:** Validate that all merge fields in a template are available and properly formatted.

**Request Body:**
```json
{
  "subject": "Appraisal Period Started - {PeriodName}",
  "body": "Dear {StaffName},\n\nYour appraisal is due on {Deadline}.",
  "mergeFields": ["{StaffName}", "{PeriodName}", "{Deadline}"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Merge fields validated successfully",
  "data": {
    "isValid": true,
    "validFields": ["{StaffName}", "{PeriodName}", "{Deadline}"],
    "invalidFields": [],
    "missingFields": [],
    "suggestions": []
  },
  "errorCode": null,
  "errors": null
}
```

---

## 4. Template Statistics and Analytics

### 4.1 Get Template Statistics
**Endpoint:** `GET /notification-templates/statistics`

**Description:** Get usage statistics for notification templates.

**Request Example:**
```http
GET /notification-templates/statistics
```

**Response:**
```json
{
  "success": true,
  "message": "Template statistics retrieved successfully",
  "data": {
    "totalTemplates": 15,
    "activeTemplates": 12,
    "inactiveTemplates": 3,
    "systemTemplates": 5,
    "customTemplates": 10,
    "byType": {
      "appraisal_period_start": 3,
      "self_appraisal_due": 2,
      "document_approved": 4,
      "deadline_missed": 2,
      "account_created": 1,
      "password_reset": 1,
      "role_assigned": 1,
      "post_assigned": 1
    },
    "byChannel": {
      "email": 10,
      "sms": 3,
      "in_app": 8,
      "push": 2
    },
    "mostUsed": [
      {
        "templateId": "1",
        "name": "Appraisal Period Start Notification",
        "usageCount": 150
      },
      {
        "templateId": "2",
        "name": "Self Appraisal Due Reminder",
        "usageCount": 89
      }
    ],
    "recentActivity": [
      {
        "templateId": "3",
        "name": "Document Approved Notification",
        "action": "created",
        "timestamp": "2024-01-15T10:30:00Z",
        "performedBy": "admin@tetfund.gov.ng"
      }
    ]
  },
  "errorCode": null,
  "errors": null
}
```

### 4.2 Get Template Usage History
**Endpoint:** `GET /notification-templates/{id}/usage-history`

**Description:** Get usage history for a specific template.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Template ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10) |
| dateFrom | string | No | Start date (ISO 8601) |
| dateTo | string | No | End date (ISO 8601) |

**Request Example:**
```http
GET /notification-templates/1/usage-history?page=1&limit=10&dateFrom=2024-01-01&dateTo=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "message": "Template usage history retrieved successfully",
  "data": {
    "template": {
      "id": "1",
      "name": "Appraisal Period Start Notification"
    },
    "usageHistory": [
      {
        "id": "usage-1",
        "sentAt": "2024-01-15T10:30:00Z",
        "recipientCount": 25,
        "deliveredCount": 24,
        "openedCount": 20,
        "failedCount": 1,
        "triggeredBy": "system",
        "triggerEvent": "appraisal_period_activated"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    }
  },
  "errorCode": null,
  "errors": null
}
```

---

## 5. Bulk Operations

### 5.1 Bulk Create Templates
**Endpoint:** `POST /notification-templates/bulk`

**Description:** Create multiple notification templates from a CSV/Excel file.

**Request Body:**
```json
{
  "file": "<base64_encoded_file_content>",
  "fileType": "csv"
}
```

**CSV Format:**
```csv
name,description,type,channel,subject,body,mergeFields,isActive
"Template 1","Description 1","appraisal_period_start","email","Subject 1","Body 1","{StaffName},{PeriodName}","true"
"Template 2","Description 2","self_appraisal_due","sms","Subject 2","Body 2","{StaffName},{Deadline}","true"
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk templates created successfully",
  "data": {
    "successful": 2,
    "failed": 0,
    "errors": [],
    "createdTemplates": [
      {
        "id": "4",
        "name": "Template 1"
      },
      {
        "id": "5",
        "name": "Template 2"
      }
    ]
  },
  "errorCode": null,
  "errors": null
}
```

### 5.2 Bulk Update Templates
**Endpoint:** `PUT /notification-templates/bulk`

**Description:** Update multiple templates with bulk operations.

**Request Body:**
```json
{
  "templateIds": ["1", "2", "3"],
  "updates": {
    "isActive": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk templates updated successfully",
  "data": {
    "successful": 3,
    "failed": 0,
    "updatedTemplates": ["1", "2", "3"]
  },
  "errorCode": null,
  "errors": null
}
```

### 5.3 Bulk Delete Templates
**Endpoint:** `DELETE /notification-templates/bulk`

**Description:** Delete multiple templates. System templates cannot be deleted.

**Request Body:**
```json
{
  "templateIds": ["4", "5"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk templates deleted successfully",
  "data": {
    "successful": 2,
    "failed": 0,
    "deletedTemplates": ["4", "5"]
  },
  "errorCode": null,
  "errors": null
}
```

---

## 6. Export and Import

### 6.1 Export Templates
**Endpoint:** `GET /notification-templates/export`

**Description:** Export notification templates to various formats.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | No | Export format (csv, excel, json) |
| templateIds | string | No | Comma-separated list of template IDs |
| includeInactive | boolean | No | Include inactive templates (default: false) |

**Request Example:**
```http
GET /notification-templates/export?format=excel&includeInactive=true
```

**Response:**
```json
{
  "success": true,
  "message": "Templates exported successfully",
  "data": {
    "downloadUrl": "https://localhost:44366/api/v1/notification-templates/export/download/export-123.xlsx",
    "expiresAt": "2024-01-15T13:30:00Z",
    "fileSize": 15678,
    "recordCount": 15
  },
  "errorCode": null,
  "errors": null
}
```

### 6.2 Import Templates
**Endpoint:** `POST /notification-templates/import`

**Description:** Import notification templates from a file.

**Request Body:**
```json
{
  "file": "<base64_encoded_file_content>",
  "fileType": "excel",
  "options": {
    "skipDuplicates": true,
    "updateExisting": false,
    "validateOnly": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Templates imported successfully",
  "data": {
    "totalRecords": 10,
    "successful": 8,
    "failed": 2,
    "skipped": 0,
    "errors": [
      {
        "row": 3,
        "error": "Invalid notification type: invalid_type"
      },
      {
        "row": 7,
        "error": "Missing required field: subject"
      }
    ],
    "importedTemplates": [
      {
        "id": "6",
        "name": "Imported Template 1"
      }
    ]
  },
  "errorCode": null,
  "errors": null
}
```

---

## 7. Error Responses

### 7.1 Validation Error
**HTTP Status:** 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errorCode": "VALIDATION_ERROR",
  "errors": {
    "name": ["Name is required"],
    "type": ["Invalid notification type"],
    "subject": ["Subject cannot exceed 200 characters"]
  }
}
```

### 7.2 Not Found Error
**HTTP Status:** 404 Not Found

```json
{
  "success": false,
  "message": "Notification template not found",
  "data": null,
  "errorCode": "TEMPLATE_NOT_FOUND",
  "errors": null
}
```

### 7.3 Unauthorized Error
**HTTP Status:** 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errorCode": "UNAUTHORIZED",
  "errors": null
}
```

### 7.4 Forbidden Error
**HTTP Status:** 403 Forbidden

```json
{
  "success": false,
  "message": "Insufficient permissions",
  "data": null,
  "errorCode": "FORBIDDEN",
  "errors": null
}
```

### 7.5 System Template Error
**HTTP Status:** 400 Bad Request

```json
{
  "success": false,
  "message": "Cannot modify system template",
  "data": null,
  "errorCode": "SYSTEM_TEMPLATE_ERROR",
  "errors": {
    "templateId": ["System templates cannot be modified or deleted"]
  }
}
```

---

## 8. Data Models

### 8.1 NotificationTemplate
```typescript
interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject: string;
  body: string;
  mergeFields: string[];
  isActive: boolean;
  isSystemTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### 8.2 NotificationType Enum
```typescript
enum NotificationType {
  // System Alerts
  ACCOUNT_CREATED = 'account_created',
  PASSWORD_RESET = 'password_reset',
  ROLE_ASSIGNED = 'role_assigned',
  POST_ASSIGNED = 'post_assigned',
  
  // Performance Management
  APPRAISAL_PERIOD_START = 'appraisal_period_start',
  SELF_APPRAISAL_DUE = 'self_appraisal_due',
  SUPERVISOR_REVIEW_PENDING = 'supervisor_review_pending',
  FINAL_APPROVAL_REQUIRED = 'final_approval_required',
  PERFORMANCE_CONTRACT_REMINDER = 'performance_contract_reminder',
  
  // Workflow Alerts
  DOCUMENT_APPROVED = 'document_approved',
  DOCUMENT_REJECTED = 'document_rejected',
  DEADLINE_MISSED = 'deadline_missed',
  VACANCY_ALERT = 'vacancy_alert',
  
  // Broadcast Notifications
  AGENCY_WIDE_MESSAGE = 'agency_wide_message',
  POLICY_UPDATE = 'policy_update',
  
  // Escalation
  ESCALATION_NOTICE = 'escalation_notice'
}
```

### 8.3 NotificationChannel Enum
```typescript
enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
  PUSH = 'push'
}
```

### 8.4 MergeField
```typescript
interface MergeField {
  key: string;
  label: string;
  description: string;
  example: string;
  category: 'user' | 'appraisal' | 'system' | 'custom';
}
```

---

## 9. Rate Limiting

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| Read Operations | 100 requests | 1 minute |
| Write Operations | 20 requests | 1 minute |
| Bulk Operations | 5 requests | 1 minute |
| Export/Import | 10 requests | 1 minute |

---

## 10. Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Role-based access control (HR Admin, Director)
3. **Input Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: Prevents abuse and ensures system stability
5. **Audit Logging**: All template modifications are logged
6. **Data Encryption**: Sensitive data is encrypted in transit and at rest

---

## 11. Integration Examples

### 11.1 Frontend Integration
```typescript
// Get all templates
const response = await fetch('/api/v1/notification-templates', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Create new template
const newTemplate = await fetch('/api/v1/notification-templates', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Template',
    description: 'Template description',
    type: 'appraisal_period_start',
    channel: 'email',
    subject: 'Subject with {mergeField}',
    body: 'Body with {mergeField}',
    mergeFields: ['{mergeField}'],
    isActive: true
  })
});
```

### 11.2 Backend Integration
```csharp
// Example C# controller method
[HttpGet]
public async Task<IActionResult> GetTemplates([FromQuery] TemplateFilters filters)
{
    var templates = await _templateService.GetTemplatesAsync(filters);
    return Ok(new ApiResponse<NotificationTemplateListResponse>
    {
        Success = true,
        Message = "Notification templates retrieved successfully",
        Data = templates
    });
}
```

---

This comprehensive API specification covers all aspects of the Notification Templates management system, providing detailed information for frontend integration, backend implementation, and system administration.
