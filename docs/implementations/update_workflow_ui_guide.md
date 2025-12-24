# UI Implementation Guide: Update Approval Workflow

## API Endpoint
```
PATCH /api/approval-workflows/workflows/{workflowId}
```

## Business Rules & Conditions

### 1. **Stage Identification**
- **New Stage**: `stageId` is `null` or `undefined`
- **Update Stage**: `stageId` contains a valid UUID
- **Delete Stage**: Existing stage not included in the `stages` array

### 2. **Validation Rules**
- ✅ Minimum 1 stage required
- ✅ Stage orders must be sequential: `1, 2, 3, 4...` (no gaps)
- ✅ Stage orders must be unique (no duplicates)
- ✅ Cannot deactivate workflow if it has pending approval requests

### 3. **Stage Update Restrictions**

#### Stages WITH Executions (used in approval requests):
**Allowed Updates:**
- ✅ `stageName` - Display name can change
- ✅ `isOptional` - Optional flag can change
- ✅ `autoApprove` - Auto-approve flag can change

**Blocked Updates:**
- ❌ `stageOrder` - Cannot reorder (breaks historical data)
- ❌ `approverType` - Cannot change approver type (invalidates executions)
- ❌ `roleId` - Cannot change role (if locked by executions)
- ❌ `userId` - Cannot change user (if locked by executions)
- ❌ Cannot delete stage

**Error Messages:**
- `"Cannot change order of stage '{stageName}' as it has existing executions"`
- `"Cannot change approver type of stage '{stageName}' as it has existing executions"`
- `"Cannot delete stages that have existing approval executions"`

#### Stages WITHOUT Executions (never used):
**Allowed Updates:**
- ✅ All fields can be updated
- ✅ Can be deleted safely

### 4. **UI Display Logic**

#### When Editing a Workflow:
```javascript
// Fetch workflow with stages
GET /api/approval-workflows/workflows/{workflowId}

// For each stage, check if it has executions
// (API should return this info or calculate client-side based on usage)
```

#### Stage Status Indicators:
```
Stage 1: Agent Review
  • Used in 23 approval requests
  • ⚠️ Limited editing (has executions)
  
Stage 2: Unit Head Approval  
  • Never used
  • ✅ Full editing allowed
  • ✅ Can be deleted
```

#### Form Field States:
```javascript
// Disable fields based on execution status
<Select 
  label="Approver Type"
  disabled={stage.hasExecutions}
  tooltip="Cannot change - stage has been used in approvals"
/>

<Input 
  label="Stage Order"
  disabled={stage.hasExecutions}
  tooltip="Cannot reorder - stage has approval history"
/>

<Input 
  label="Stage Name"
  disabled={false}  // Always editable
/>
```

#### Delete Button Logic:
```javascript
<DeleteButton 
  disabled={stage.hasExecutions}
  onClick={() => confirmDelete(stage)}
  tooltip={
    stage.hasExecutions 
      ? "Cannot delete - used in 23 requests" 
      : "Delete stage"
  }
/>
```

### 5. **Request Payload Structure**

#### Example: Update existing + Add new + Delete unused
```json
{
  "workflowName": "Updated Member Registration",
  "description": "Enhanced workflow",
  "isActive": true,
  "stages": [
    {
      "stageId": "uuid-1",        // UPDATE existing
      "stageName": "Agent Review (Updated)",
      "stageOrder": 1,
      "approverType": "Role",
      "roleId": "agent-role-uuid",
      "organizationBody": "Unit",
      "isOptional": false
    },
    {
      "stageId": null,            // CREATE new
      "stageName": "Unit Head Approval",
      "stageOrder": 2,
      "approverType": "Role",
      "roleId": "unithead-role-uuid",
      "organizationBody": "Unit",
      "isOptional": false
    },
    {
      "stageId": "uuid-3",        // UPDATE existing
      "stageName": "Final Admin Approval",
      "stageOrder": 3,
      "approverType": "SpecificUser",
      "userId": "admin-user-uuid",
      "isOptional": false
    }
    // Note: uuid-2 not included = DELETED (if no executions)
  ]
}
```

### 6. **User Confirmations**

#### Before Deleting Stages:
```
Are you sure you want to delete "Unit Head Approval"?
✅ This stage has never been used and can be safely removed.
```

```
Cannot delete "Agent Review"
❌ This stage has been used in 23 approval requests.
Consider creating a new workflow version instead.
```

#### Before Deactivating Workflow:
```
Cannot deactivate workflow
❌ This workflow has 5 pending approval requests.
Please wait for all requests to complete or reject them first.
```

### 7. **Stage Order Management**

#### Drag-and-Drop Reordering:
```javascript
// Only allow reordering for stages without executions
const canReorder = (stage) => !stage.hasExecutions;

// When dropping, recalculate sequential orders
const recalculateOrders = (stages) => {
  return stages.map((stage, index) => ({
    ...stage,
    stageOrder: index + 1
  }));
};
```

#### Adding New Stage:
```javascript
const addStage = () => {
  const newOrder = stages.length + 1;
  return {
    stageId: null,           // Marks as new
    stageOrder: newOrder,
    stageName: "",
    approverType: "Role",
    roleId: null,
    userId: null,
    organizationBody: null,
    isOptional: false,
    autoApprove: false
  };
};
```

### 8. **Validation Messages**

#### Client-Side Pre-Submit Validation:
- ❌ "At least one stage is required"
- ❌ "Stage orders must be 1, 2, 3... (found gap at order 3)"
- ❌ "Duplicate stage order detected: 2"
- ❌ "Stage name is required"
- ❌ "Approver type is required"
- ❌ "Role required for Role-based approval"
- ❌ "User required for SpecificUser approval"

#### Server Response Errors (400):
- `"Stage orders must be sequential (1, 2, 3...)"`
- `"Duplicate stage orders not allowed"`
- `"Cannot deactivate workflow with pending requests"`
- `"Cannot delete stages that have existing approval executions"`
- `"Cannot change order of stage 'X' as it has existing executions"`
- `"Cannot change approver type of stage 'X' as it has existing executions"`

### 9. **UI Flow Summary**

```
1. Fetch Workflow + Stages
   ↓
2. Display Stage List with Status
   - Show execution count per stage (Future implementation)
   - Enable/disable edit controls
   ↓
3. User Makes Changes
   - Edit allowed fields
   - Add new stages
   - Remove unused stages
   - Reorder non-executed stages
   ↓
4. Validate Client-Side
   - Check sequential orders
   - Ensure no duplicates
   - Minimum 1 stage
   ↓
5. Submit PATCH Request
   - Include all stages (existing + new)
   - Exclude stages to delete
   ↓
6. Handle Response
   - Success: Show updated workflow
   - Error: Display validation message
```

### 10. **Recommended UI Components**

```
- Sortable list (drag-drop) for stage ordering
- Badge indicators for stage status ("Used in X requests" / "Unused")
- Disabled field styling with tooltips
- Confirmation modals for delete/deactivate actions
- Real-time validation feedback
- Sequential order auto-numbering
```

---

**Key Takeaway for AI Agents:**
- Always send the complete desired `stages` array
- Include `stageId` for existing stages you want to keep/update
- Omit `stageId` (or use `null`) for new stages
- Don't include stages you want to delete
- Backend validates execution constraints automatically
