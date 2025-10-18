# Organogram Management API Specification

## Base URL
```
https://localhost:44366/api/v1
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Organizational Unit Management APIs

### 1.1 Get All Organizational Units
**GET** `/organizational-units`

Retrieve all organizational units with optional filtering and pagination.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search term for name or description |
| `type` | string | No | Filter by unit type (BOARD, EXECUTIVE, DEPT, DIV, BRANCH) |
| `parentId` | string | No | Filter by parent unit ID |
| `mdaId` | string | No | Filter by MDA ID |
| `status` | string | No | Filter by status (active, inactive) |
| `level` | number | No | Filter by hierarchy level |
| `page` | number | No | Page number (default: 1) |
| `pageSize` | number | No | Items per page (default: 50) |
| `sortBy` | string | No | Sort field (name, type, level, order) |
| `sortOrder` | string | No | Sort direction (asc, desc) |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational units retrieved successfully",
  "data": {
    "units": [
      {
        "id": "1",
        "name": "Board of Trustees",
        "type": "BOARD",
        "description": "Highest governing body of TETFund",
        "parentId": null,
        "level": 0,
        "order": 1,
        "mdaId": "1",
        "mdaName": "TETFund",
        "status": "active",
        "headOfUnit": {
          "id": "1",
          "name": "Dr. John Smith",
          "position": "Chairman",
          "email": "chairman@tetfund.gov.ng",
          "phone": "+2348012345678",
          "staffId": "TET001"
        },
        "childrenCount": 1,
        "postsCount": 0,
        "staffCount": 5,
        "dateCreated": "2024-01-01T00:00:00Z",
        "lastUpdated": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 50,
      "totalItems": 25,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    },
    "summary": {
      "totalUnits": 25,
      "activeUnits": 23,
      "inactiveUnits": 2,
      "byType": {
        "BOARD": 1,
        "EXECUTIVE": 1,
        "DEPT": 8,
        "DIV": 10,
        "BRANCH": 5
      }
    }
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units"
}
```

### 1.2 Get Single Organizational Unit
**GET** `/organizational-units/{id}`

Retrieve a specific organizational unit by ID.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational unit retrieved successfully",
  "data": {
    "id": "1",
    "name": "Board of Trustees",
    "type": "BOARD",
    "description": "Highest governing body of TETFund",
    "parentId": null,
    "level": 0,
    "order": 1,
    "mdaId": "1",
    "mdaName": "TETFund",
    "status": "active",
    "headOfUnit": {
      "id": "1",
      "name": "Dr. John Smith",
      "position": "Chairman",
      "email": "chairman@tetfund.gov.ng",
      "phone": "+2348012345678",
      "staffId": "TET001"
    },
    "children": [
      {
        "id": "2",
        "name": "Executive Secretary",
        "type": "EXECUTIVE",
        "level": 1,
        "order": 1,
        "childrenCount": 8,
        "postsCount": 1,
        "staffCount": 1
      }
    ],
    "posts": [
      {
        "id": "1",
        "name": "Chairman",
        "gradeLevel": "GL 17",
        "status": "active",
        "isOccupied": true,
        "assignedOfficerName": "Dr. John Smith"
      }
    ],
    "dateCreated": "2024-01-01T00:00:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/1"
}
```

### 1.3 Create Organizational Unit
**POST** `/organizational-units`

Create a new organizational unit.

#### Request Body
```json
{
  "name": "Human Resource Department",
  "type": "DEPT",
  "description": "Manages all human resource activities",
  "parentId": "2",
  "mdaId": "1",
  "order": 1
}
```

#### Success Response (201)
```json
{
  "success": true,
  "message": "Organizational unit created successfully",
  "data": {
    "id": "3",
    "name": "Human Resource Department",
    "type": "DEPT",
    "description": "Manages all human resource activities",
    "parentId": "2",
    "level": 2,
    "order": 1,
    "mdaId": "1",
    "mdaName": "TETFund",
    "status": "active",
    "headOfUnit": null,
    "childrenCount": 0,
    "postsCount": 0,
    "staffCount": 0,
    "dateCreated": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units"
}
```

### 1.4 Update Organizational Unit
**PUT** `/organizational-units/{id}`

Update an existing organizational unit.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Request Body
```json
{
  "name": "Human Resource & General Administration",
  "description": "Manages all human resource and general administration activities",
  "order": 2
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational unit updated successfully",
  "data": {
    "id": "3",
    "name": "Human Resource & General Administration",
    "type": "DEPT",
    "description": "Manages all human resource and general administration activities",
    "parentId": "2",
    "level": 2,
    "order": 2,
    "mdaId": "1",
    "mdaName": "TETFund",
    "status": "active",
    "headOfUnit": null,
    "childrenCount": 2,
    "postsCount": 5,
    "staffCount": 12,
    "dateCreated": "2024-01-01T00:00:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3"
}
```

### 1.5 Delete Organizational Unit
**DELETE** `/organizational-units/{id}`

Delete an organizational unit and all its children.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `force` | boolean | No | Force delete even if unit has children or staff (default: false) |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational unit deleted successfully",
  "data": {
    "deletedUnitId": "3",
    "deletedChildrenCount": 2,
    "affectedPostsCount": 5,
    "affectedStaffCount": 12
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3"
}
```

---

## 2. Organizational Hierarchy APIs

### 2.1 Get Organizational Tree
**GET** `/organizational-units/tree`

Retrieve the complete organizational hierarchy as a tree structure.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mdaId` | string | No | Filter by MDA ID |
| `includeInactive` | boolean | No | Include inactive units (default: false) |
| `maxDepth` | number | No | Maximum tree depth to return |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational tree retrieved successfully",
  "data": {
    "tree": [
      {
        "id": "1",
        "name": "Board of Trustees",
        "type": "BOARD",
        "level": 0,
        "order": 1,
        "children": [
          {
            "id": "2",
            "name": "Executive Secretary",
            "type": "EXECUTIVE",
            "level": 1,
            "order": 1,
            "children": [
              {
                "id": "3",
                "name": "Human Resource & Gen. Admin",
                "type": "DEPT",
                "level": 2,
                "order": 1,
                "children": [
                  {
                    "id": "9",
                    "name": "HR Management",
                    "type": "DIV",
                    "level": 3,
                    "order": 1,
                    "children": [
                      {
                        "id": "17",
                        "name": "Recruitment",
                        "type": "BRANCH",
                        "level": 4,
                        "order": 1,
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "summary": {
      "totalUnits": 25,
      "maxDepth": 4,
      "byLevel": {
        "0": 1,
        "1": 1,
        "2": 8,
        "3": 10,
        "4": 5
      }
    }
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/tree"
}
```

### 2.2 Get Unit Children
**GET** `/organizational-units/{id}/children`

Get direct children of a specific organizational unit.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Parent unit ID |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Unit children retrieved successfully",
  "data": [
    {
      "id": "9",
      "name": "HR Management",
      "type": "DIV",
      "level": 3,
      "order": 1,
      "childrenCount": 2,
      "postsCount": 3,
      "staffCount": 8
    },
    {
      "id": "10",
      "name": "General Administration",
      "type": "DIV",
      "level": 3,
      "order": 2,
      "childrenCount": 1,
      "postsCount": 2,
      "staffCount": 5
    }
  ],
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3/children"
}
```

### 2.3 Move Organizational Unit
**PUT** `/organizational-units/{id}/move`

Move an organizational unit to a different parent.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unit ID to move |

#### Request Body
```json
{
  "newParentId": "4",
  "newOrder": 3
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational unit moved successfully",
  "data": {
    "id": "3",
    "name": "Human Resource & Gen. Admin",
    "newParentId": "4",
    "newLevel": 3,
    "newOrder": 3,
    "affectedChildrenCount": 2
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3/move"
}
```

---

## 3. Head of Unit Management APIs

### 3.1 Assign Head of Unit
**POST** `/organizational-units/{id}/head`

Assign a staff member as head of an organizational unit.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Request Body
```json
{
  "staffId": "TET001",
  "position": "Director",
  "effectiveDate": "2024-01-15"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Head of unit assigned successfully",
  "data": {
    "unitId": "3",
    "unitName": "Human Resource & Gen. Admin",
    "headOfUnit": {
      "id": "1",
      "name": "Dr. John Smith",
      "position": "Director",
      "email": "john.smith@tetfund.gov.ng",
      "phone": "+2348012345678",
      "staffId": "TET001",
      "effectiveDate": "2024-01-15T00:00:00Z"
    }
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3/head"
}
```

### 3.2 Remove Head of Unit
**DELETE** `/organizational-units/{id}/head`

Remove the current head of an organizational unit.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Request Body
```json
{
  "effectiveDate": "2024-01-15",
  "reason": "Transfer to another department"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Head of unit removed successfully",
  "data": {
    "unitId": "3",
    "unitName": "Human Resource & Gen. Admin",
    "removedHead": {
      "id": "1",
      "name": "Dr. John Smith",
      "position": "Director",
      "effectiveDate": "2024-01-15T00:00:00Z"
    }
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3/head"
}
```

### 3.3 Get Head of Unit History
**GET** `/organizational-units/{id}/head/history`

Get the history of heads of an organizational unit.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Head of unit history retrieved successfully",
  "data": [
    {
      "id": "1",
      "staffId": "TET001",
      "staffName": "Dr. John Smith",
      "position": "Director",
      "effectiveDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-15T00:00:00Z",
      "status": "ended",
      "reason": "Transfer to another department"
    },
    {
      "id": "2",
      "staffId": "TET002",
      "staffName": "Dr. Jane Doe",
      "position": "Director",
      "effectiveDate": "2024-01-15T00:00:00Z",
      "endDate": null,
      "status": "active",
      "reason": null
    }
  ],
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3/head/history"
}
```

---

## 4. Organizational Unit Statistics APIs

### 4.1 Get Unit Statistics
**GET** `/organizational-units/statistics`

Get comprehensive statistics about organizational units.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mdaId` | string | No | Filter by MDA ID |
| `type` | string | No | Filter by unit type |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational unit statistics retrieved successfully",
  "data": {
    "overview": {
      "totalUnits": 25,
      "activeUnits": 23,
      "inactiveUnits": 2,
      "totalStaff": 150,
      "totalPosts": 45,
      "vacantPosts": 5
    },
    "byType": {
      "BOARD": {
        "count": 1,
        "staff": 5,
        "posts": 1,
        "vacantPosts": 0
      },
      "EXECUTIVE": {
        "count": 1,
        "staff": 1,
        "posts": 1,
        "vacantPosts": 0
      },
      "DEPT": {
        "count": 8,
        "staff": 45,
        "posts": 15,
        "vacantPosts": 2
      },
      "DIV": {
        "count": 10,
        "staff": 60,
        "posts": 20,
        "vacantPosts": 2
      },
      "BRANCH": {
        "count": 5,
        "staff": 39,
        "posts": 8,
        "vacantPosts": 1
      }
    },
    "byLevel": {
      "0": { "units": 1, "staff": 5, "posts": 1 },
      "1": { "units": 1, "staff": 1, "posts": 1 },
      "2": { "units": 8, "staff": 45, "posts": 15 },
      "3": { "units": 10, "staff": 60, "posts": 20 },
      "4": { "units": 5, "staff": 39, "posts": 8 }
    },
    "hierarchy": {
      "maxDepth": 4,
      "averageChildrenPerUnit": 2.5,
      "unitsWithChildren": 15,
      "leafUnits": 10
    }
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/statistics"
}
```

### 4.2 Get Unit Performance Metrics
**GET** `/organizational-units/{id}/metrics`

Get performance metrics for a specific organizational unit.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Organizational unit ID |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Unit performance metrics retrieved successfully",
  "data": {
    "unitId": "3",
    "unitName": "Human Resource & Gen. Admin",
    "metrics": {
      "staffing": {
        "totalStaff": 12,
        "activeStaff": 11,
        "inactiveStaff": 1,
        "staffTurnoverRate": 8.3,
        "averageTenure": 3.2
      },
      "posts": {
        "totalPosts": 5,
        "occupiedPosts": 4,
        "vacantPosts": 1,
        "occupancyRate": 80.0
      },
      "performance": {
        "averageAppraisalScore": 4.2,
        "completedAppraisals": 10,
        "pendingAppraisals": 2,
        "completionRate": 83.3
      },
      "hierarchy": {
        "childrenCount": 2,
        "maxDepth": 2,
        "averageChildrenPerChild": 1.5
      }
    },
    "trends": {
      "staffGrowth": {
        "lastMonth": 0,
        "lastQuarter": 1,
        "lastYear": 3
      },
      "performanceTrend": {
        "lastMonth": 0.1,
        "lastQuarter": 0.2,
        "lastYear": 0.5
      }
    }
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/3/metrics"
}
```

---

## 5. Bulk Operations APIs

### 5.1 Bulk Create Organizational Units
**POST** `/organizational-units/bulk`

Create multiple organizational units in a single operation.

#### Request Body
```json
{
  "units": [
    {
      "name": "Division A",
      "type": "DIV",
      "description": "Division A description",
      "parentId": "3",
      "order": 1
    },
    {
      "name": "Division B",
      "type": "DIV",
      "description": "Division B description",
      "parentId": "3",
      "order": 2
    }
  ]
}
```

#### Success Response (201)
```json
{
  "success": true,
  "message": "Bulk creation completed",
  "data": {
    "created": 2,
    "failed": 0,
    "results": [
      {
        "index": 0,
        "success": true,
        "unitId": "26",
        "name": "Division A"
      },
      {
        "index": 1,
        "success": true,
        "unitId": "27",
        "name": "Division B"
      }
    ]
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/bulk"
}
```

### 5.2 Bulk Update Organizational Units
**PUT** `/organizational-units/bulk`

Update multiple organizational units in a single operation.

#### Request Body
```json
{
  "updates": [
    {
      "id": "26",
      "name": "Updated Division A",
      "description": "Updated description"
    },
    {
      "id": "27",
      "order": 3
    }
  ]
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Bulk update completed",
  "data": {
    "updated": 2,
    "failed": 0,
    "results": [
      {
        "index": 0,
        "success": true,
        "unitId": "26",
        "name": "Updated Division A"
      },
      {
        "index": 1,
        "success": true,
        "unitId": "27",
        "order": 3
      }
    ]
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/bulk"
}
```

---

## 6. Export APIs

### 6.1 Export Organizational Units
**GET** `/organizational-units/export`

Export organizational units data in various formats.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | Yes | Export format (csv, excel, pdf) |
| `mdaId` | string | No | Filter by MDA ID |
| `type` | string | No | Filter by unit type |
| `includeInactive` | boolean | No | Include inactive units (default: false) |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Export generated successfully",
  "data": {
    "downloadUrl": "https://localhost:44366/api/v1/exports/organizational-units-20240115-103000.csv",
    "fileName": "organizational-units-20240115-103000.csv",
    "fileSize": 24576,
    "expiresAt": "2024-01-15T11:30:00Z"
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/export"
}
```

### 6.2 Export Organizational Tree
**GET** `/organizational-units/tree/export`

Export the organizational hierarchy as a visual diagram.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | Yes | Export format (png, svg, pdf) |
| `mdaId` | string | No | Filter by MDA ID |
| `maxDepth` | number | No | Maximum tree depth |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Organizational tree export generated successfully",
  "data": {
    "downloadUrl": "https://localhost:44366/api/v1/exports/organizational-tree-20240115-103000.png",
    "fileName": "organizational-tree-20240115-103000.png",
    "fileSize": 102400,
    "expiresAt": "2024-01-15T11:30:00Z"
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/tree/export"
}
```

---

## 7. Validation APIs

### 7.1 Validate Organizational Unit
**POST** `/organizational-units/validate`

Validate organizational unit data before creation or update.

#### Request Body
```json
{
  "name": "New Department",
  "type": "DEPT",
  "parentId": "2",
  "mdaId": "1"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Validation completed",
  "data": {
    "valid": true,
    "warnings": [],
    "errors": [],
    "suggestions": [
      {
        "field": "name",
        "message": "Consider using 'Department' instead of 'Dept' for consistency"
      }
    ]
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/validate"
}
```

### 7.2 Check Unit Name Availability
**GET** `/organizational-units/check-name`

Check if an organizational unit name is available.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Unit name to check |
| `parentId` | string | No | Parent unit ID for context |
| `excludeId` | string | No | Unit ID to exclude from check (for updates) |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Name availability checked",
  "data": {
    "available": true,
    "suggestions": [
      "Human Resource Department",
      "HR Department",
      "Human Resources"
    ]
  },
  "errorCode": null,
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units/check-name"
}
```

---

## 8. Error Responses

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "data": null,
  "errorCode": "VALIDATION_ERROR",
  "errors": {
    "field": ["Specific error message for this field"]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/organizational-units"
}
```

### Common Error Codes
| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `DUPLICATE_NAME` | Unit name already exists | 409 |
| `INVALID_HIERARCHY` | Invalid parent-child relationship | 400 |
| `HAS_CHILDREN` | Cannot delete unit with children | 409 |
| `HAS_STAFF` | Cannot delete unit with assigned staff | 409 |
| `UNAUTHORIZED` | Insufficient permissions | 401 |
| `FORBIDDEN` | Operation not allowed | 403 |
| `INTERNAL_ERROR` | Internal server error | 500 |

---

## 9. TypeScript Interfaces

### Core Interfaces
```typescript
interface OrganizationalUnit {
  id: string;
  name: string;
  type: 'BOARD' | 'EXECUTIVE' | 'DEPT' | 'DIV' | 'BRANCH';
  description?: string;
  parentId?: string;
  level: number;
  order: number;
  mdaId: string;
  mdaName: string;
  status: 'active' | 'inactive';
  headOfUnit?: HeadOfUnit;
  childrenCount: number;
  postsCount: number;
  staffCount: number;
  dateCreated: string;
  lastUpdated: string;
}

interface HeadOfUnit {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  staffId: string;
  effectiveDate: string;
  endDate?: string;
}

interface OrganizationalTree {
  id: string;
  name: string;
  type: string;
  level: number;
  order: number;
  children: OrganizationalTree[];
}

interface UnitStatistics {
  overview: {
    totalUnits: number;
    activeUnits: number;
    inactiveUnits: number;
    totalStaff: number;
    totalPosts: number;
    vacantPosts: number;
  };
  byType: Record<string, {
    count: number;
    staff: number;
    posts: number;
    vacantPosts: number;
  }>;
  byLevel: Record<string, {
    units: number;
    staff: number;
    posts: number;
  }>;
  hierarchy: {
    maxDepth: number;
    averageChildrenPerUnit: number;
    unitsWithChildren: number;
    leafUnits: number;
  };
}

interface CreateUnitRequest {
  name: string;
  type: 'BOARD' | 'EXECUTIVE' | 'DEPT' | 'DIV' | 'BRANCH';
  description?: string;
  parentId?: string;
  mdaId: string;
  order?: number;
}

interface UpdateUnitRequest {
  name?: string;
  description?: string;
  order?: number;
}

interface AssignHeadRequest {
  staffId: string;
  position: string;
  effectiveDate: string;
}
```

---

## 10. Rate Limiting

All endpoints are subject to rate limiting:
- **Standard endpoints**: 100 requests per minute per user
- **Bulk operations**: 10 requests per minute per user
- **Export endpoints**: 5 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

---

## 11. Webhooks

The following events can trigger webhooks:

### Events
- `organizational_unit.created`
- `organizational_unit.updated`
- `organizational_unit.deleted`
- `organizational_unit.moved`
- `head_of_unit.assigned`
- `head_of_unit.removed`

### Webhook Payload Example
```json
{
  "event": "organizational_unit.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "unitId": "3",
    "unitName": "Human Resource Department",
    "unitType": "DEPT",
    "parentId": "2",
    "mdaId": "1"
  }
}
```

---

This comprehensive API specification covers all aspects of organizational unit management, including CRUD operations, hierarchy management, head of unit assignments, statistics, bulk operations, exports, and validation. The APIs are designed to support the full functionality of the organogram page with proper error handling, pagination, and performance optimization.
