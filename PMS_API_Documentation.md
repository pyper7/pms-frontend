# PMS API Documentation

## Base URL
```
https://api.pms.ohcsf.gov.ng/v1
```

## Authentication
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 1. Authentication Endpoints

### POST /auth/login
```json
// Request
{
  "email": "hr.admin@ohcsf.gov.ng",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "hr.admin@ohcsf.gov.ng",
      "role": "HR_ADMIN",
      "name": "Jane HR Admin",
      "department": "HR",
      "position": "HR Administrator",
      "ippisNo": "12345"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### POST /auth/logout
```json
// Request
{}

// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/profile
```json
// Response
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "hr.admin@ohcsf.gov.ng",
    "role": "HR_ADMIN",
    "name": "Jane HR Admin",
    "department": "HR",
    "position": "HR Administrator",
    "ippisNo": "12345",
    "phone": "08012345678",
    "designation": "HR Administrator"
  }
}
```

### POST /auth/refresh
```json
// Request
{
  "refreshToken": "refresh_token_here"
}

// Response
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 86400
  }
}
```

---

## 2. Post Management Endpoints

### GET /posts
```json
// Query Parameters
// ?page=1&limit=10&search=officer&department=PMD&status=active&gradeLevel=13

// Response
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_1",
        "title": "Senior Program Officer",
        "code": "SPO001",
        "department": "PMD",
        "gradeLevel": "13",
        "status": "active",
        "description": "Responsible for policy development and implementation",
        "requirements": ["Masters Degree", "5 years experience", "Policy background"],
        "currentOccupant": {
          "id": "officer_1",
          "name": "John Doe",
          "email": "john.doe@ohcsf.gov.ng",
          "ippisNo": "12345"
        },
        "vacancyDuration": null,
        "createdAt": "2020-01-01T00:00:00Z",
        "updatedAt": "2020-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1247,
      "pages": 125
    },
    "summary": {
      "totalPosts": 1247,
      "occupied": 1189,
      "vacant": 58,
      "occupancyRate": 95.3
    }
  }
}
```

### GET /posts/{postId}
```json
// Response
{
  "success": true,
  "data": {
    "id": "post_1",
    "title": "Senior Program Officer",
    "code": "SPO001",
    "department": "PMD",
    "gradeLevel": "13",
    "status": "active",
    "description": "Responsible for policy development and implementation",
    "requirements": ["Masters Degree", "5 years experience"],
    "currentOccupant": {
      "id": "officer_1",
      "name": "John Doe",
      "email": "john.doe@ohcsf.gov.ng"
    },
    "occupancyHistory": [
      {
        "officerId": "officer_1",
        "officerName": "John Doe",
        "startDate": "2020-01-15",
        "endDate": null,
        "status": "current"
      }
    ],
    "createdAt": "2020-01-01T00:00:00Z",
    "updatedAt": "2020-01-01T00:00:00Z"
  }
}
```

### POST /posts
```json
// Request
{
  "title": "New Program Officer",
  "code": "NPO001",
  "department": "PMD",
  "gradeLevel": "12",
  "description": "New position for policy implementation",
  "requirements": ["Bachelors Degree", "3 years experience", "Policy background"],
  "reportingTo": "post_1"
}

// Response
{
  "success": true,
  "data": {
    "id": "post_123",
    "title": "New Program Officer",
    "code": "NPO001",
    "department": "PMD",
    "gradeLevel": "12",
    "status": "active",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### PUT /posts/{postId}
```json
// Request
{
  "title": "Updated Program Officer",
  "description": "Updated position description",
  "requirements": ["Bachelors Degree", "5 years experience", "Policy background"]
}

// Response
{
  "success": true,
  "data": {
    "id": "post_123",
    "title": "Updated Program Officer",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

### DELETE /posts/{postId}
```json
// Response
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### POST /posts/{postId}/assign
```json
// Request
{
  "officerId": "officer_123",
  "startDate": "2025-01-15",
  "assignmentType": "permanent",
  "notes": "Assignment notes"
}

// Response
{
  "success": true,
  "data": {
    "assignmentId": "assign_123",
    "postId": "post_123",
    "officerId": "officer_123",
    "startDate": "2025-01-15",
    "status": "active"
  }
}
```

### POST /posts/{postId}/unassign
```json
// Request
{
  "officerId": "officer_123",
  "endDate": "2025-01-15",
  "reason": "Promotion"
}

// Response
{
  "success": true,
  "data": {
    "assignmentId": "assign_123",
    "endDate": "2025-01-15",
    "status": "inactive"
  }
}
```

---

## 3. Role Management Endpoints

### GET /roles
```json
// Query Parameters
// ?page=1&limit=10&search=admin&isActive=true&module=user_management

// Response
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role_1",
        "name": "HR Admin",
        "description": "Human Resources administrative access",
        "isActive": true,
        "permissions": [
          "user_management:read",
          "user_management:create",
          "user_management:update",
          "user_management:delete",
          "post_management:read",
          "post_management:create",
          "post_management:update",
          "post_management:delete"
        ],
        "userCount": 5,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "createdBy": "system"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

### GET /roles/{roleId}
```json
// Response
{
  "success": true,
  "data": {
    "id": "role_1",
    "name": "HR Admin",
    "description": "Human Resources administrative access",
    "isActive": true,
    "permissions": [
      "user_management:read",
      "user_management:create",
      "user_management:update",
      "user_management:delete"
    ],
    "users": [
      {
        "id": "user_1",
        "name": "Jane HR Admin",
        "email": "jane@ohcsf.gov.ng",
        "assignedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /roles
```json
// Request
{
  "name": "New Role",
  "description": "Role description",
  "permissions": [
    "user_management:read",
    "post_management:read",
    "appraisal_management:read"
  ]
}

// Response
{
  "success": true,
  "data": {
    "id": "role_123",
    "name": "New Role",
    "description": "Role description",
    "isActive": true,
    "permissions": [
      "user_management:read",
      "post_management:read",
      "appraisal_management:read"
    ],
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### PUT /roles/{roleId}
```json
// Request
{
  "name": "Updated Role",
  "description": "Updated role description",
  "permissions": [
    "user_management:read",
    "user_management:create",
    "post_management:read"
  ]
}

// Response
{
  "success": true,
  "data": {
    "id": "role_123",
    "name": "Updated Role",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

### DELETE /roles/{roleId}
```json
// Response
{
  "success": true,
  "message": "Role deleted successfully"
}
```

### GET /permissions
```json
// Response
{
  "success": true,
  "data": {
    "permissions": [
      {
        "module": "user_management",
        "actions": ["read", "create", "update", "delete"],
        "description": "Manage system users and officers"
      },
      {
        "module": "post_management",
        "actions": ["read", "create", "update", "delete"],
        "description": "Manage organizational posts and positions"
      },
      {
        "module": "appraisal_management",
        "actions": ["read", "create", "update", "approve", "reject"],
        "description": "Manage performance appraisals"
      },
      {
        "module": "role_management",
        "actions": ["read", "create", "update", "delete", "assign"],
        "description": "Manage roles and permissions"
      },
      {
        "module": "notification_management",
        "actions": ["read", "create", "update", "send"],
        "description": "Manage notifications and templates"
      }
    ]
  }
}
```

### POST /roles/{roleId}/assign
```json
// Request
{
  "userId": "user_123",
  "assignedBy": "admin_123"
}

// Response
{
  "success": true,
  "data": {
    "assignmentId": "assign_123",
    "roleId": "role_1",
    "userId": "user_123",
    "assignedAt": "2025-01-15T10:30:00Z"
  }
}
```

### POST /roles/{roleId}/unassign
```json
// Request
{
  "userId": "user_123"
}

// Response
{
  "success": true,
  "data": {
    "assignmentId": "assign_123",
    "unassignedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 4. Officer Management Endpoints

### GET /officers
```json
// Query Parameters
// ?page=1&limit=10&search=john&department=PMD&status=active&gradeLevel=13

// Response
{
  "success": true,
  "data": {
    "officers": [
      {
        "id": "officer_1",
        "name": "John Doe",
        "email": "john.doe@ohcsf.gov.ng",
        "ippisNo": "12345",
        "position": "Senior Program Officer",
        "department": "PMD",
        "gradeLevel": "13",
        "status": "active",
        "hireDate": "2020-01-15",
        "lastPromotion": "2023-01-01",
        "currentPost": {
          "id": "post_1",
          "title": "Senior Program Officer",
          "department": "PMD"
        },
        "phone": "08012345678",
        "address": "123 Main Street, Abuja",
        "createdAt": "2020-01-15T00:00:00Z",
        "updatedAt": "2020-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1247,
      "pages": 125
    }
  }
}
```

### GET /officers/{officerId}
```json
// Response
{
  "success": true,
  "data": {
    "id": "officer_1",
    "name": "John Doe",
    "email": "john.doe@ohcsf.gov.ng",
    "ippisNo": "12345",
    "position": "Senior Program Officer",
    "department": "PMD",
    "gradeLevel": "13",
    "status": "active",
    "hireDate": "2020-01-15",
    "lastPromotion": "2023-01-01",
    "currentPost": {
      "id": "post_1",
      "title": "Senior Program Officer",
      "department": "PMD"
    },
    "postHistory": [
      {
        "id": "history_1",
        "postId": "post_2",
        "postTitle": "Program Officer",
        "startDate": "2020-01-15",
        "endDate": "2022-12-31",
        "status": "completed"
      }
    ],
    "appraisalHistory": [
      {
        "id": "app_1",
        "period": "2024 Q4",
        "score": 88,
        "status": "Completed"
      }
    ],
    "phone": "08012345678",
    "address": "123 Main Street, Abuja",
    "createdAt": "2020-01-15T00:00:00Z",
    "updatedAt": "2020-01-15T00:00:00Z"
  }
}
```

### POST /officers
```json
// Request
{
  "name": "Jane Smith",
  "email": "jane.smith@ohcsf.gov.ng",
  "ippisNo": "67890",
  "position": "Program Officer",
  "department": "PMD",
  "gradeLevel": "12",
  "hireDate": "2025-01-15",
  "phone": "08012345678",
  "address": "123 Main Street, Abuja",
  "postId": "post_123"
}

// Response
{
  "success": true,
  "data": {
    "id": "officer_123",
    "name": "Jane Smith",
    "email": "jane.smith@ohcsf.gov.ng",
    "ippisNo": "67890",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### PUT /officers/{officerId}
```json
// Request
{
  "name": "Jane Smith Updated",
  "phone": "08012345679",
  "address": "456 New Street, Abuja"
}

// Response
{
  "success": true,
  "data": {
    "id": "officer_123",
    "name": "Jane Smith Updated",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

### DELETE /officers/{officerId}
```json
// Response
{
  "success": true,
  "message": "Officer deleted successfully"
}
```

---

## 5. Organization Management Endpoints

### GET /organogram
```json
// Response
{
  "success": true,
  "data": {
    "departments": [
      {
        "id": "dept_1",
        "name": "Performance Management Department",
        "code": "PMD",
        "head": {
          "id": "user_1",
          "name": "Dr. John Director",
          "position": "Director",
          "email": "john.director@ohcsf.gov.ng"
        },
        "divisions": [
          {
            "id": "div_1",
            "name": "Policy Division",
            "head": {
              "id": "user_2",
              "name": "Jane Manager",
              "position": "Assistant Director",
              "email": "jane.manager@ohcsf.gov.ng"
            },
            "branches": [
              {
                "id": "branch_1",
                "name": "Research Branch",
                "head": {
                  "id": "user_3",
                  "name": "Mike Supervisor",
                  "position": "Chief Research Officer",
                  "email": "mike.supervisor@ohcsf.gov.ng"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### POST /organogram/departments
```json
// Request
{
  "name": "New Department",
  "code": "ND",
  "headId": "user_123",
  "description": "Department description"
}

// Response
{
  "success": true,
  "data": {
    "id": "dept_123",
    "name": "New Department",
    "code": "ND",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 6. Appraisal Management Endpoints

### GET /appraisals
```json
// Query Parameters
// ?page=1&limit=10&period=2025Q1&status=submitted&userId=officer_123

// Response
{
  "success": true,
  "data": {
    "appraisals": [
      {
        "id": "app_123",
        "userId": "officer_123",
        "userName": "John Doe",
        "period": "2025 Q1",
        "status": "Submitted",
        "progress": 100,
        "score": 88,
        "submittedAt": "2025-01-15T10:30:00Z",
        "reviewedAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1000,
      "pages": 100
    }
  }
}
```

### GET /appraisals/{appraisalId}
```json
// Response
{
  "success": true,
  "data": {
    "id": "app_123",
    "userId": "officer_123",
    "userName": "John Doe",
    "period": "2025 Q1",
    "status": "Submitted",
    "progress": 100,
    "sections": [
      {
        "id": 1,
        "title": "Employee's Tasks",
        "percentage": 70,
        "data": {
          "tasks": [
            {
              "kra": "Policy Development",
              "weight": 30,
              "objective": "Complete policy research",
              "kpis": "Number of reports",
              "unit": "Reports",
              "target": 5,
              "achieved": 3
            }
          ]
        }
      }
    ],
    "comments": "Excellent performance this quarter",
    "signature": "data:image/png;base64,...",
    "score": 88,
    "submittedAt": "2025-01-15T10:30:00Z",
    "reviewedAt": null
  }
}
```

### POST /appraisals
```json
// Request
{
  "userId": "officer_123",
  "period": "2025 Q1"
}

// Response
{
  "success": true,
  "data": {
    "id": "app_123",
    "userId": "officer_123",
    "period": "2025 Q1",
    "status": "Not Started",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### PUT /appraisals/{appraisalId}/submit
```json
// Request
{
  "sections": [
    {
      "id": 1,
      "data": {
        "tasks": [...]
      }
    }
  ],
  "comments": "My performance this quarter was excellent",
  "signature": "data:image/png;base64,..."
}

// Response
{
  "success": true,
  "data": {
    "id": "app_123",
    "status": "Submitted",
    "submittedAt": "2025-01-15T10:30:00Z"
  }
}
```

### POST /appraisals/{appraisalId}/review
```json
// Request
{
  "score": 88,
  "reviewNotes": "Outstanding performance in all areas",
  "action": "approve",
  "feedback": "Continue the excellent work"
}

// Response
{
  "success": true,
  "data": {
    "reviewId": "rev_123",
    "status": "Reviewed",
    "reviewedAt": "2025-01-15T14:30:00Z"
  }
}
```

---

## 7. Director Dashboard Endpoints

### GET /director/dashboard/overview
```json
// Response
{
  "success": true,
  "data": {
    "departmentObjectives": {
      "total": 12,
      "achieved": 8,
      "remaining": 4,
      "percentage": 67
    },
    "teamAppraisals": {
      "total": 15,
      "completed": 10,
      "pending": 5,
      "percentage": 67
    },
    "pendingApprovals": 3,
    "notifications": 7,
    "recentActivity": [
      {
        "id": "act_1",
        "type": "appraisal_submitted",
        "message": "Adetola Akeju submitted Q1 appraisal",
        "timestamp": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

### GET /director/team-appraisals
```json
// Response
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "member_1",
        "name": "Adetola Akeju",
        "position": "Senior Program Officer",
        "department": "PMD",
        "email": "adetola.akeju@ohcsf.gov.ng",
        "appraisalStatus": "Submitted",
        "submissionDate": "2025-01-15",
        "score": 88,
        "lastActivity": "2 hours ago",
        "progress": 100
      }
    ],
    "summary": {
      "completed": 1,
      "submitted": 1,
      "inProgress": 1,
      "notStarted": 1
    }
  }
}
```

### GET /director/department-objectives
```json
// Response
{
  "success": true,
  "data": {
    "objectives": [
      {
        "id": "obj_1",
        "title": "Improve Policy Development Process",
        "description": "Streamline policy development workflow",
        "weight": 100,
        "status": "Active",
        "kpis": [
          {
            "id": "kpi_1",
            "title": "Policy Documents Completed",
            "target": 10,
            "unit": "Documents",
            "weight": 60
          }
        ]
      }
    ]
  }
}
```

---

## 8. HR Admin Dashboard Endpoints

### GET /hr/dashboard/overview
```json
// Response
{
  "success": true,
  "data": {
    "totalOfficers": 1247,
    "activeOfficers": 1189,
    "pendingOnboarding": 23,
    "vacantPosts": 15,
    "activeAppraisals": 8,
    "completedAppraisals": 1156,
    "pendingReviews": 89,
    "overdueTasks": 12,
    "notifications": 7,
    "systemAlerts": 2
  }
}
```

### GET /hr/dashboard/analytics
```json
// Response
{
  "success": true,
  "data": {
    "officerDistribution": [
      { "department": "PMD", "count": 45, "percentage": 25 },
      { "department": "Finance", "count": 30, "percentage": 17 },
      { "department": "Admin", "count": 25, "percentage": 14 }
    ],
    "appraisalProgress": [
      { "status": "Completed", "count": 1156, "percentage": 85 },
      { "status": "In Progress", "count": 150, "percentage": 11 },
      { "status": "Not Started", "count": 40, "percentage": 3 }
    ],
    "postOccupancy": [
      { "status": "Occupied", "count": 1189, "percentage": 95 },
      { "status": "Vacant", "count": 58, "percentage": 5 }
    ]
  }
}
```

---

## 9. Profile Management Endpoints

### GET /profile
```json
// Response
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@ohcsf.gov.ng",
    "name": "John User",
    "role": "OFFICER",
    "department": "PMD",
    "position": "Program Officer",
    "ippisNo": "12345",
    "phone": "08012345678",
    "designation": "Program Officer",
    "postHistory": [
      {
        "id": "post_1",
        "position": "Assistant Program Officer",
        "department": "PMD",
        "startDate": "2020-01-01",
        "endDate": "2022-12-31",
        "status": "Completed"
      }
    ]
  }
}
```

### PUT /profile
```json
// Request
{
  "name": "John User Updated",
  "phone": "08012345679"
}

// Response
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John User Updated",
    "phone": "08012345679",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

### POST /profile/change-password
```json
// Request
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

// Response
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 10. Notification Management Endpoints

### GET /notifications/templates
```json
// Response
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template_1",
        "name": "Appraisal Reminder",
        "type": "email",
        "subject": "Appraisal Submission Reminder",
        "body": "Dear {{name}}, your appraisal is due on {{deadline}}.",
        "variables": ["name", "deadline"],
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /notifications/templates
```json
// Request
{
  "name": "New Template",
  "type": "email",
  "subject": "New Notification",
  "body": "Hello {{name}}, this is a new notification.",
  "variables": ["name"]
}

// Response
{
  "success": true,
  "data": {
    "id": "template_123",
    "name": "New Template",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### GET /notifications/logs
```json
// Query Parameters
// ?page=1&limit=10&type=email&status=sent&startDate=2025-01-01&endDate=2025-01-31

// Response
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_1",
        "type": "email",
        "recipient": "john.doe@ohcsf.gov.ng",
        "subject": "Appraisal Reminder",
        "status": "sent",
        "sentAt": "2025-01-15T10:30:00Z",
        "templateId": "template_1"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1000,
      "pages": 100
    }
  }
}
```

---

## 11. Appraisal Settings Endpoints

### GET /appraisal-settings
```json
// Response
{
  "success": true,
  "data": {
    "generalSettings": {
      "appraisalPeriod": "quarterly",
      "currentPeriod": "2025 Q1",
      "startDate": "2025-01-01",
      "endDate": "2025-03-31",
      "isActive": true
    },
    "workflowSteps": [
      {
        "id": "step_1",
        "name": "Self Assessment",
        "order": 1,
        "isRequired": true,
        "deadline": 7
      },
      {
        "id": "step_2",
        "name": "Supervisor Review",
        "order": 2,
        "isRequired": true,
        "deadline": 14
      }
    ],
    "gradingScale": {
      "excellent": { "min": 90, "max": 100, "description": "Outstanding performance" },
      "veryGood": { "min": 80, "max": 89, "description": "Above average performance" },
      "good": { "min": 70, "max": 79, "description": "Satisfactory performance" },
      "fair": { "min": 60, "max": 69, "description": "Below average performance" },
      "poor": { "min": 0, "max": 59, "description": "Unsatisfactory performance" }
    },
    "weightDistribution": {
      "tasks": 70,
      "competencies": 20,
      "operations": 10
    }
  }
}
```

### PUT /appraisal-settings
```json
// Request
{
  "generalSettings": {
    "appraisalPeriod": "quarterly",
    "currentPeriod": "2025 Q1",
    "startDate": "2025-01-01",
    "endDate": "2025-03-31"
  },
  "weightDistribution": {
    "tasks": 70,
    "competencies": 20,
    "operations": 10
  }
}

// Response
{
  "success": true,
  "data": {
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 12. KRA & KPI Management Endpoints

### GET /kra-kpi
```json
// Response
{
  "success": true,
  "data": {
    "kras": [
      {
        "id": "kra_1",
        "title": "Policy Development",
        "description": "Develop and implement policies",
        "department": "PMD",
        "weight": 40,
        "kpis": [
          {
            "id": "kpi_1",
            "title": "Policy Documents Completed",
            "target": 10,
            "unit": "Documents",
            "weight": 60,
            "measurementType": "count"
          }
        ]
      }
    ]
  }
}
```

### POST /kra-kpi/kras
```json
// Request
{
  "title": "New KRA",
  "description": "KRA description",
  "department": "PMD",
  "weight": 30,
  "kpis": [
    {
      "title": "New KPI",
      "target": 5,
      "unit": "Count",
      "weight": 100,
      "measurementType": "count"
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "id": "kra_123",
    "title": "New KRA",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 13. Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'HR_ADMIN' | 'DIRECTOR' | 'OFFICER';
  department: string;
  position: string;
  ippisNo: string;
  phone?: string;
  designation?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Officer Model
```typescript
interface Officer {
  id: string;
  name: string;
  email: string;
  ippisNo: string;
  position: string;
  department: string;
  gradeLevel: string;
  status: 'active' | 'inactive' | 'suspended';
  hireDate: string;
  lastPromotion?: string;
  currentPost?: Post;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Post Model
```typescript
interface Post {
  id: string;
  title: string;
  code: string;
  department: string;
  gradeLevel: string;
  status: 'active' | 'inactive';
  description: string;
  requirements: string[];
  currentOccupant?: Officer;
  createdAt: string;
  updatedAt: string;
}
```

### Role Model
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

### Appraisal Model
```typescript
interface Appraisal {
  id: string;
  userId: string;
  period: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed';
  progress: number;
  sections: AppraisalSection[];
  comments?: string;
  signature?: string;
  score?: number;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Department Objective Model
```typescript
interface DepartmentObjective {
  id: string;
  title: string;
  description: string;
  weight: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  kpis: KPI[];
  cascade?: CascadeConfiguration;
  createdAt: string;
  updatedAt: string;
}
```

### Notification Template Model
```typescript
interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 14. Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## 15. Pagination

### Standard Pagination Format
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 16. Filtering and Sorting

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term
- `sort` - Sort field
- `order` - Sort order (asc/desc)
- `filter` - Filter parameters (JSON string)

### Example
```
GET /officers?page=1&limit=20&search=john&sort=name&order=asc&filter={"department":"PMD","status":"active"}
```

---

This comprehensive API documentation covers all features of the PMS application with proper organization starting with Authentication, Posts, and Roles as requested.
