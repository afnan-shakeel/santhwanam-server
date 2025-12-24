# Member Listing Page - UI Implementation Guide

## API Endpoint
```
POST /api/members/search
```

## Request Payload
```json
{
  "searchTerm": "john",
  "searchFields": ["firstName", "lastName", "email", "contactNumber", "memberCode"],
  "filters": [
    { "field": "registrationStatus", "operator": "equals", "value": "Approved" },
    { "field": "memberStatus", "operator": "equals", "value": "Active" },
    { "field": "agentId", "operator": "equals", "value": "agent-uuid" }
  ],
  "sort": [{ "field": "createdAt", "direction": "desc" }],
  "pagination": {
    "page": 1,
    "pageSize": 20
  }
}
```

## Response Structure
```json
{
  "items": [
    {
      "memberId": "uuid",
      "memberCode": "MEM-001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "contactNumber": "+1234567890",
      "dateOfBirth": "1990-01-15",
      "gender": "Male",
      "registrationStatus": "Approved",
      "memberStatus": "Active",
      "tier": {
        "tierId": "uuid",
        "tierCode": "STANDARD",
        "tierName": "Standard Member"
      },
      "agent": {
        "agentId": "uuid",
        "agentCode": "AG-001",
        "firstName": "Agent",
        "lastName": "Smith"
      },
      "unit": {
        "unitId": "uuid",
        "unitCode": "UNIT-001",
        "unitName": "Main Unit"
      },
      "createdAt": "2025-12-14T10:00:00Z",
      "registeredAt": "2025-12-14T12:00:00Z"
    }
  ],
  "total": 145,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```
## UI Components & Features

### Action Buttons
```
- View Details: Navigate to member profile
- Edit: Open member edit form
- Suspend: Suspend active member
- Reactivate: Reactivate suspended member
- Delete: Soft delete member (if allowed)
```

## Example Requests

### Search All Active Members
```json
{
  "filters": [
    { "field": "memberStatus", "operator": "equals", "value": "Active" }
  ],
  "pagination": { "page": 1, "pageSize": 20 }
}
```

### Search by Agent & Status
```json
{
  "searchTerm": "john",
  "filters": [
    { "field": "agentId", "operator": "equals", "value": "agent-uuid-123" },
    { "field": "registrationStatus", "operator": "equals", "value": "Approved" }
  ],
  "sort": [{ "field": "createdAt", "direction": "desc" }],
  "pagination": { "page": 1, "pageSize": 20 }
}
```

### Date Range Filter (Registration in last 30 days)
```json
{
  "filters": [
    { "field": "createdAt", "operator": "between", "value": ["2025-11-14", "2025-12-14"] }
  ]
}
```

### Multi-Status Filter
```json
{
  "filters": [
    { "field": "memberStatus", "operator": "in", "value": ["Active", "Suspended"] }
  ]
}
```

## Member Statuses

### Registration Status (Progress)
- **Draft** - Registration started but not submitted
- **Submitted** - Awaiting approval
- **Approved** - Registration approved, member active
- **Rejected** - Registration rejected

### Member Status (Current State)
- **Active** - Normal member status
- **Suspended** - Temporarily suspended (suspension counter tracked)
- **Closed** - Account closed (permanent)

## UI Flow

```
1. Load members listing page
   ↓
2. Display filters panel
   ↓
3. User applies filters/search
   ↓
4. POST /api/members/search
   ↓
5. Display results in table with pagination
   ↓
6. User selects action (View/Edit/Suspend/etc)
   ↓
7. Navigate to member details/edit page
```

## open api snippet:
```
    "/api/members/search": {
      "post": {
        "tags": ["Members - Queries"],
        "summary": "Search members with advanced filtering",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SearchRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Search results",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SearchResponse"
                }
              }
            }
          }
        }
      }
    },
```
