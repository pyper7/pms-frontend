# 📋 **Post Management & Post Occupancy API Specification**

## **Base URL**
```
https://localhost:44366/api/v1
```

## **Authentication**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## **Standard Response Format**

### **Success Response**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": <response_data>,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information",
    "field": "field_name" // For validation errors
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

---

## **1. POST MANAGEMENT APIs**

### **1.1 Get All Posts**
```http
GET /posts
```

**Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "search": "string",
  "mdaId": "string",
  "orgUnitId": "string",
  "status": "active|inactive",
  "isOccupied": true|false,
  "gradeLevel": "string",
  "sortBy": "name|dateCreated|lastUpdated",
  "sortOrder": "asc|desc"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "post_123",
        "name": "Director, Human Resource",
        "description": "Oversees all human resource activities and policies",
        "gradeLevel": "GL 15",
        "mdaId": "mda_1",
        "mdaName": "TETFund",
        "orgUnitId": "org_3",
        "orgUnitName": "Human Resource & Gen. Admin",
        "orgUnitType": "DEPT",
        "status": "active",
        "isOccupied": true,
        "assignedOfficerId": "officer_1",
        "assignedOfficerName": "John Doe",
        "roleId": "role_1",
        "roleName": "HR Admin",
        "dateCreated": "2024-01-15T00:00:00Z",
        "lastUpdated": "2024-01-20T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts"
}
```

### **1.2 Get Single Post**
```http
GET /posts/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": "post_123",
    "name": "Director, Human Resource",
    "description": "Oversees all human resource activities and policies",
    "gradeLevel": "GL 15",
    "mdaId": "mda_1",
    "mdaName": "TETFund",
    "orgUnitId": "org_3",
    "orgUnitName": "Human Resource & Gen. Admin",
    "orgUnitType": "DEPT",
    "status": "active",
    "isOccupied": true,
    "assignedOfficerId": "officer_1",
    "assignedOfficerName": "John Doe",
    "roleId": "role_1",
    "roleName": "HR Admin",
    "dateCreated": "2024-01-15T00:00:00Z",
    "lastUpdated": "2024-01-20T00:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123"
}
```

### **1.3 Create Post**
```http
POST /posts
```

**Request Body:**
```json
{
  "name": "Director, Human Resource",
  "description": "Oversees all human resource activities and policies",
  "gradeLevel": "GL 15",
  "mdaId": "mda_1",
  "orgUnitId": "org_3",
  "status": "active",
  "roleId": "role_1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "post_123",
    "name": "Director, Human Resource",
    "description": "Oversees all human resource activities and policies",
    "gradeLevel": "GL 15",
    "mdaId": "mda_1",
    "mdaName": "TETFund",
    "orgUnitId": "org_3",
    "orgUnitName": "Human Resource & Gen. Admin",
    "orgUnitType": "DEPT",
    "status": "active",
    "isOccupied": false,
    "roleId": "role_1",
    "roleName": "HR Admin",
    "dateCreated": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts"
}
```

### **1.4 Update Post**
```http
PUT /posts/{id}
```

**Request Body:**
```json
{
  "name": "Senior Director, Human Resource",
  "description": "Updated description",
  "gradeLevel": "GL 16",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "post_123",
    "name": "Senior Director, Human Resource",
    "description": "Updated description",
    "gradeLevel": "GL 16",
    "mdaId": "mda_1",
    "mdaName": "TETFund",
    "orgUnitId": "org_3",
    "orgUnitName": "Human Resource & Gen. Admin",
    "orgUnitType": "DEPT",
    "status": "active",
    "isOccupied": true,
    "assignedOfficerId": "officer_1",
    "assignedOfficerName": "John Doe",
    "roleId": "role_1",
    "roleName": "HR Admin",
    "dateCreated": "2024-01-15T00:00:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123"
}
```

### **1.5 Delete Post**
```http
DELETE /posts/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123"
}
```

### **1.6 Assign Role to Post**
```http
POST /posts/{id}/role
```

**Request Body:**
```json
{
  "roleId": "role_1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role assigned to post successfully",
  "data": {
    "postId": "post_123",
    "roleId": "role_1",
    "roleName": "HR Admin"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123/role"
}
```

### **1.7 Remove Role from Post**
```http
DELETE /posts/{id}/role
```

**Response:**
```json
{
  "success": true,
  "message": "Role removed from post successfully",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123/role"
}
```

---

## **2. POST OCCUPANCY APIs**

### **2.1 Get All Post Occupancies**
```http
GET /post-occupancies
```

**Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "search": "string",
  "postId": "string",
  "officerId": "string",
  "isActive": true|false,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "sortBy": "startDate|endDate|officerName",
  "sortOrder": "asc|desc"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post occupancies retrieved successfully",
  "data": {
    "occupancies": [
      {
        "id": "occupancy_123",
        "postId": "post_123",
        "postName": "Director, Human Resource",
        "officerId": "officer_1",
        "officerName": "John Doe",
        "officerIppis": "12345",
        "startDate": "2024-01-15T00:00:00Z",
        "endDate": null,
        "isActive": true,
        "notes": "Permanent assignment",
        "dateCreated": "2024-01-15T00:00:00Z",
        "lastUpdated": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies"
}
```

### **2.2 Get Single Post Occupancy**
```http
GET /post-occupancies/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Post occupancy retrieved successfully",
  "data": {
    "id": "occupancy_123",
    "postId": "post_123",
    "postName": "Director, Human Resource",
    "officerId": "officer_1",
    "officerName": "John Doe",
    "officerIppis": "12345",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": null,
    "isActive": true,
    "notes": "Permanent assignment",
    "dateCreated": "2024-01-15T00:00:00Z",
    "lastUpdated": "2024-01-15T00:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies/occupancy_123"
}
```

### **2.3 Assign Officer to Post**
```http
POST /post-occupancies
```

**Request Body:**
```json
{
  "postId": "post_123",
  "officerId": "officer_1",
  "notes": "Permanent assignment",
  "startDate": "2024-01-15T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer assigned to post successfully",
  "data": {
    "id": "occupancy_123",
    "postId": "post_123",
    "postName": "Director, Human Resource",
    "officerId": "officer_1",
    "officerName": "John Doe",
    "officerIppis": "12345",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": null,
    "isActive": true,
    "notes": "Permanent assignment",
    "dateCreated": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies"
}
```

### **2.4 Update Post Occupancy**
```http
PUT /post-occupancies/{id}
```

**Request Body:**
```json
{
  "notes": "Updated assignment notes",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post occupancy updated successfully",
  "data": {
    "id": "occupancy_123",
    "postId": "post_123",
    "postName": "Director, Human Resource",
    "officerId": "officer_1",
    "officerName": "John Doe",
    "officerIppis": "12345",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": null,
    "isActive": true,
    "notes": "Updated assignment notes",
    "dateCreated": "2024-01-15T00:00:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies/occupancy_123"
}
```

### **2.5 End Post Occupancy**
```http
PUT /post-occupancies/{id}/end
```

**Request Body:**
```json
{
  "endDate": "2024-12-31T23:59:59Z",
  "notes": "Assignment ended due to promotion"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post occupancy ended successfully",
  "data": {
    "id": "occupancy_123",
    "postId": "post_123",
    "postName": "Director, Human Resource",
    "officerId": "officer_1",
    "officerName": "John Doe",
    "officerIppis": "12345",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "isActive": false,
    "notes": "Assignment ended due to promotion",
    "dateCreated": "2024-01-15T00:00:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies/occupancy_123/end"
}
```

### **2.6 Delete Post Occupancy**
```http
DELETE /post-occupancies/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Post occupancy deleted successfully",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies/occupancy_123"
}
```

### **2.7 Get Post Occupancy History**
```http
GET /posts/{postId}/occupancy-history
```

**Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "includeInactive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post occupancy history retrieved successfully",
  "data": {
    "post": {
      "id": "post_123",
      "name": "Director, Human Resource",
      "description": "Oversees all human resource activities and policies"
    },
    "occupancies": [
      {
        "id": "occupancy_123",
        "postId": "post_123",
        "postName": "Director, Human Resource",
        "officerId": "officer_1",
        "officerName": "John Doe",
        "officerIppis": "12345",
        "startDate": "2024-01-15T00:00:00Z",
        "endDate": null,
        "isActive": true,
        "notes": "Current assignment"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123/occupancy-history"
}
```

---

## **3. SUPPORTING DATA APIs**

### **3.1 Get All MDAs**
```http
GET /mdas
```

**Response:**
```json
{
  "success": true,
  "message": "MDAs retrieved successfully",
  "data": [
    {
      "id": "mda_1",
      "name": "TETFund",
      "code": "TETFUND",
      "status": "active",
      "dateCreated": "2024-01-01T00:00:00Z",
      "lastUpdated": "2024-01-01T00:00:00Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/mdas"
}
```

### **3.2 Get All Organizational Units**
```http
GET /org-units
```

**Query Parameters:**
```json
{
  "mdaId": "mda_1",
  "type": "DEPT|DIV|BRANCH",
  "parentId": "org_1",
  "status": "active|inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organizational units retrieved successfully",
  "data": [
    {
      "id": "org_1",
      "name": "Board of Trustees",
      "type": "DEPT",
      "mdaId": "mda_1",
      "parentId": null,
      "status": "active",
      "dateCreated": "2024-01-01T00:00:00Z",
      "lastUpdated": "2024-01-01T00:00:00Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/org-units"
}
```

### **3.3 Get All Officers**
```http
GET /officers
```

**Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "search": "string",
  "department": "string",
  "division": "string",
  "branch": "string",
  "status": "active|inactive",
  "unassigned": true|false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officers retrieved successfully",
  "data": {
    "officers": [
      {
        "id": "officer_1",
        "ippis": "12345",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@tetfund.gov.ng",
        "phone": "08012345678",
        "department": "Human Resource",
        "division": "HR Management",
        "branch": "Recruitment",
        "post": "Director, Human Resource",
        "cadre": "Director",
        "status": "active",
        "dateCreated": "2024-01-01T00:00:00Z",
        "lastLogin": "2024-01-15T09:00:00Z",
        "profilePicture": "https://example.com/profile.jpg"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/officers"
}
```

### **3.4 Get All Roles**
```http
GET /roles
```

**Response:**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": "role_1",
      "name": "HR Admin",
      "description": "Full HR management access",
      "permissions": [
        "user:create",
        "user:read",
        "user:update",
        "user:delete"
      ],
      "status": "active",
      "dateCreated": "2024-01-01T00:00:00Z",
      "lastUpdated": "2024-01-01T00:00:00Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/roles"
}
```

---

## **4. EXPORT APIs**

### **4.1 Export Posts**
```http
GET /posts/export
```

**Query Parameters:**
```json
{
  "format": "csv|excel|pdf",
  "search": "string",
  "mdaId": "string",
  "orgUnitId": "string",
  "status": "active|inactive",
  "isOccupied": true|false,
  "gradeLevel": "string"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/csv
Content-Disposition: attachment; filename="posts_export_2024-01-15.csv"

id,name,description,gradeLevel,mdaName,orgUnitName,status,isOccupied,roleName,dateCreated
post_123,Director Human Resource,Oversees HR activities,GL 15,TETFund,Human Resource & Gen. Admin,active,true,HR Admin,2024-01-15T00:00:00Z
```

### **4.2 Export Post Occupancies**
```http
GET /post-occupancies/export
```

**Query Parameters:**
```json
{
  "format": "csv|excel|pdf",
  "search": "string",
  "postId": "string",
  "officerId": "string",
  "isActive": true|false,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/csv
Content-Disposition: attachment; filename="post_occupancies_export_2024-01-15.csv"

id,postName,officerName,officerIppis,startDate,endDate,isActive,notes
occupancy_123,Director Human Resource,John Doe,12345,2024-01-15T00:00:00Z,,true,Permanent assignment
```

---

## **5. BULK OPERATIONS APIs**

### **5.1 Bulk Create Posts**
```http
POST /posts/bulk
```

**Request Body:**
```json
{
  "posts": [
    {
      "name": "Director, Human Resource",
      "description": "Oversees all human resource activities",
      "gradeLevel": "GL 15",
      "mdaId": "mda_1",
      "orgUnitId": "org_3",
      "status": "active",
      "roleId": "role_1"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk post creation completed",
  "data": {
    "successful": [
      {
        "id": "post_123",
        "name": "Director, Human Resource",
        "status": "created"
      }
    ],
    "errors": [
      {
        "index": 1,
        "data": {
          "name": "Invalid Post"
        },
        "error": "Name is required"
      }
    ],
    "summary": {
      "total": 2,
      "successful": 1,
      "errors": 1
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/bulk"
}
```

### **5.2 Bulk Assign Officers**
```http
POST /post-occupancies/bulk
```

**Request Body:**
```json
{
  "assignments": [
    {
      "postId": "post_123",
      "officerId": "officer_1",
      "notes": "Permanent assignment"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk officer assignment completed",
  "data": {
    "successful": [
      {
        "id": "occupancy_123",
        "postId": "post_123",
        "officerId": "officer_1",
        "status": "assigned"
      }
    ],
    "errors": [],
    "summary": {
      "total": 1,
      "successful": 1,
      "errors": 0
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies/bulk"
}
```

---

## **6. VALIDATION APIs**

### **6.1 Validate Post Assignment**
```http
POST /posts/{id}/validate-assignment
```

**Request Body:**
```json
{
  "officerId": "officer_1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post assignment validation completed",
  "data": {
    "isValid": true,
    "conflicts": [],
    "warnings": [
      {
        "type": "grade_level_mismatch",
        "message": "Officer grade level is lower than post requirement"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123/validate-assignment"
}
```

### **6.2 Check Post Availability**
```http
GET /posts/{id}/availability
```

**Response:**
```json
{
  "success": true,
  "message": "Post availability checked",
  "data": {
    "isAvailable": false,
    "currentOccupancy": {
      "id": "occupancy_123",
      "officerName": "John Doe",
      "startDate": "2024-01-15T00:00:00Z"
    },
    "canAssign": false,
    "reason": "Post is currently occupied"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_123/availability"
}
```

---

## **7. STATISTICS APIs**

### **7.1 Get Post Statistics**
```http
GET /posts/statistics
```

**Response:**
```json
{
  "success": true,
  "message": "Post statistics retrieved successfully",
  "data": {
    "totalPosts": 100,
    "activePosts": 95,
    "inactivePosts": 5,
    "occupiedPosts": 80,
    "vacantPosts": 15,
    "postsByGradeLevel": [
      {
        "gradeLevel": "GL 15",
        "count": 25
      }
    ],
    "postsByMDA": [
      {
        "mdaId": "mda_1",
        "mdaName": "TETFund",
        "count": 100
      }
    ],
    "postsByOrgUnit": [
      {
        "orgUnitId": "org_3",
        "orgUnitName": "Human Resource & Gen. Admin",
        "count": 15
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/statistics"
}
```

### **7.2 Get Occupancy Statistics**
```http
GET /post-occupancies/statistics
```

**Response:**
```json
{
  "success": true,
  "message": "Occupancy statistics retrieved successfully",
  "data": {
    "totalAssignments": 150,
    "activeAssignments": 80,
    "endedAssignments": 70,
    "averageAssignmentDuration": 365,
    "assignmentsByMonth": [
      {
        "month": "2024-01",
        "count": 10
      }
    ],
    "topOccupiedPosts": [
      {
        "postId": "post_123",
        "postName": "Director, Human Resource",
        "assignmentCount": 5
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies/statistics"
}
```

---

## **8. ERROR CODES**

### **Common Error Codes:**
- `VALIDATION_ERROR` (400) - Request validation failed
- `NOT_FOUND` (404) - Resource not found
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `CONFLICT` (409) - Resource conflict (e.g., post already occupied)
- `INTERNAL_SERVER_ERROR` (500) - Server error

### **Validation Error Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "The name field is required",
    "field": "name"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts"
}
```

### **Not Found Error Example:**
```json
{
  "success": false,
  "message": "Post not found",
  "error": {
    "code": "NOT_FOUND",
    "details": "Post with ID 'post_999' does not exist"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/posts/post_999"
}
```

### **Conflict Error Example:**
```json
{
  "success": false,
  "message": "Post is already occupied",
  "error": {
    "code": "CONFLICT",
    "details": "Cannot assign officer to post that is already occupied"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/post-occupancies"
}
```

---

## **9. PAGINATION**

All list endpoints support pagination with the following parameters:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `sortBy` (string) - Field to sort by
- `sortOrder` (string, default: "asc") - Sort order (asc/desc)

Pagination response format:
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## **10. FILTERING AND SEARCHING**

Most list endpoints support:
- **Search**: Full-text search across relevant fields
- **Filters**: Field-specific filtering
- **Date Ranges**: For date-based filtering
- **Status Filters**: For active/inactive filtering

Example search and filter parameters:
```json
{
  "search": "director",
  "status": "active",
  "mdaId": "mda_1",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

---

This API specification provides comprehensive coverage for all Post Management and Post Occupancy functionality with standard REST API patterns and consistent response formats.
