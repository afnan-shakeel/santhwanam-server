# Domain — Agents

## Core Principles

- Agent is a User: Agent references `userId` from `users` table
- Belongs to Unit: Agent is assigned to exactly ONE unit (Phase 1)
- Minimal Details: Basic personal info, contact, optional address
- Admin-Defined Code: Agent code unique within unit
- Status Management: Active, Inactive, Suspended, Terminated
- Phase 1: No transfers between units, no member reassignments on status change

---

## Domain Model

### Entity: Agent

```js
Agent {
  agentId: UUID

  // Hierarchy (belongs to unit)
  unitId: UUID // Parent unit
  areaId: UUID // Denormalized from unit
  forumId: UUID // Denormalized from unit

  // Identification
  agentCode: string // Admin-defined, unique within unit

  // User reference (Agent IS a user)
  userId: UUID // References users.userId

  // Basic Personal Details
  firstName: string
  middleName: string?
  lastName: string
  dateOfBirth: date
  gender: enum [Male, Female, Other]

  // Contact Details
  contactNumber: string
  alternateContactNumber: string?
  email: string // Synced from user.email

  // Address (Optional)
  address: {
    line1: string?
    line2: string?
    city: string?
    state: string?
    postalCode: string?
    country: string?
  }

  // Status
  agentStatus: enum [Active, Inactive, Suspended, Terminated]
  // Phase 1: Only Active and Terminated used
  // Phase 2: Inactive (temporary), Suspended (disciplinary)

  // Statistics (computed/cached)
  totalActiveMembers: int // Count of members with status = Active
  totalRegistrations: int // All-time count of members registered by this agent

  // Metadata
  joinedDate: date // When agent started
  terminatedDate: date? // When agent was terminated
  terminationReason: string? // Why agent was terminated

  // Timestamps
  createdAt: timestamp
  createdBy: UUID
  updatedAt: timestamp
  updatedBy: UUID?
}
```

### Business Rules

**Creation**

- Agent must belong to an existing active unit
- `agentCode` must be unique within the unit
- `userId` must reference an existing active user
- User cannot be an agent in multiple units simultaneously (Phase 1)
- `contactNumber` is required
- Address is optional (can be null/empty)
- Only Super Admin, Forum Admin (of parent forum), Area Admin (of parent area), or Unit Admin (of parent unit) can create agents
- `joinedDate` cannot be in the future

**Status**

- Active: Agent can register members, handle transactions
- Terminated: Agent permanently removed (Phase 1)
- Inactive: Temporary deactivation (Phase 2)
- Suspended: Disciplinary action (Phase 2)

**Phase 1 Constraints**

- No agent transfers between units
- No member reassignments when agent status changes
- Agent must have zero active members before termination

**Phase 2 Features (Future)**

- ⏳ Transfer agent to another unit (with or without members)
- ⏳ Reassign members to another agent
- ⏳ Temporary inactivation (without termination)
- ⏳ Suspension with automatic reactivation date

---

## Commands

### 1. RegisterAgent

**Triggered by:** Super Admin, Forum Admin, Area Admin, Unit Admin (of parent unit)

**Input:**

```json
{
  "unitId": "uuid",
  "agentCode": "string",
  "email": "string",
  "personalDetails": {
    "firstName": "string",
    "middleName": "string?",
    "lastName": "string",
    "dateOfBirth": "date",
    "gender": "Male|Female|Other"
  },
  "contactDetails": {
    "contactNumber": "string",
    "alternateContactNumber": "string?"
  },
  "address": {
    "line1": "string?",
    "line2": "string?",
    "city": "string?",
    "state": "string?",
    "postalCode": "string?",
    "country": "string?"
  },
  "joinedDate": "date",
  "createdBy": "uuid"
}
```

**Preconditions:**

- `unitId` references an existing unit
- `agentCode` is unique within the unit
- `email` is unique (not already in `users` table)
- User (`createdBy`) has permission to create agents in this unit
- `joinedDate` <= today

**Validations:**

- `agentCode`: required, alphanumeric + hyphen/underscore, 3-50 chars
- `email`: required, valid email format, unique
- `firstName`, `lastName`: required, 2-100 chars each
- `dateOfBirth`: valid date, agent must be 18+ years old
- `contactNumber`: required, valid phone format
- address fields: optional, but if provided must be valid

**Backend Logic:**

```js
async function registerAgent(input) {
  return await db.transaction(async (trx) => {

    // 1. Check permission
    const canCreate = await hasPermission(
      input.createdBy,
      'agent.create',
      { unitId: input.unitId }
    );

    if (!canCreate) {
      throw new Error('Not authorized to create agents in this unit');
    }

    // 2. Get unit and validate
    const unit = await db.units.findByPk(input.unitId, { transaction: trx });
    if (!unit) {
      throw new Error('Unit not found');
    }

    // 3. Validate agentCode is unique within unit
    const existingAgent = await db.agents.findOne({
      where: {
        unitId: input.unitId,
        agentCode: input.agentCode
      }
    }, { transaction: trx });

    if (existingAgent) {
      throw new Error('Agent code already exists in this unit');
    }

    // 4. Validate age (must be 18+)
    const age = calculateAge(input.personalDetails.dateOfBirth);
    if (age < 18) {
      throw new Error('Agent must be at least 18 years old');
    }

    // 5. Check if email already exists
    const existingUser = await supabase.auth.admin.listUsers({
      filter: `email.eq.${input.email}`
    });

    if (existingUser.data.users.length > 0) {
      throw new Error('User with this email already exists');
    }

    // 6. Create user in Supabase
    const { data: supabaseUser, error: supabaseError } =
      await supabase.auth.admin.createUser({
        email: input.email,
        email_confirm: true
      });

    if (supabaseError) {
      throw new Error(`Failed to create user in Supabase: ${supabaseError.message}`);
    }

    // 7. Create local user record
    const localUser = await db.users.create({
      userId: generateUUID(),
      externalAuthId: supabaseUser.id,
      email: input.email,
      firstName: input.personalDetails.firstName,
      lastName: input.personalDetails.lastName,
      isActive: true,
      createdAt: new Date(),
      lastSyncedAt: new Date()
    }, { transaction: trx });

    // 8. Create agent record
    const agent = await db.agents.create({
      agentId: generateUUID(),
      unitId: input.unitId,
      areaId: unit.areaId, // Denormalized
      forumId: unit.forumId, // Denormalized
      agentCode: input.agentCode,
      userId: localUser.userId,
      firstName: input.personalDetails.firstName,
      middleName: input.personalDetails.middleName,
      lastName: input.personalDetails.lastName,
      dateOfBirth: input.personalDetails.dateOfBirth,
      gender: input.personalDetails.gender,
      contactNumber: input.contactDetails.contactNumber,
      alternateContactNumber: input.contactDetails.alternateContactNumber,
      email: input.email,
      addressLine1: input.address?.line1,
      addressLine2: input.address?.line2,
      city: input.address?.city,
      state: input.address?.state,
      postalCode: input.address?.postalCode,
      country: input.address?.country,
      agentStatus: 'Active',
      joinedDate: input.joinedDate,
      totalActiveMembers: 0,
      totalRegistrations: 0,
      createdAt: new Date(),
      createdBy: input.createdBy
    }, { transaction: trx });

    // 9. Get Agent role
    const agentRole = await db.roles.findOne({
      where: { roleCode: 'agent', isActive: true }
    });

    if (!agentRole) {
      throw new Error('Agent role not found in system');
    }

    // 10. Assign Agent role to user
    await db.userRoles.create({
      userRoleId: generateUUID(),
      userId: localUser.userId,
      roleId: agentRole.roleId,
      scopeEntityType: 'Agent',
      scopeEntityId: agent.agentId,
      isActive: true,
      assignedAt: new Date(),
      assignedBy: input.createdBy
    }, { transaction: trx });

    // 11. Generate invitation link for password setup
    const { data: inviteLink, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: 'invite',
        email: input.email,
        options: {
          redirectTo: `${process.env.APP_URL}/auth/set-password`
        }
      });

    if (linkError) {
      console.error('Failed to generate invite link:', linkError);
    }

    // 12. Emit event
    await emitEvent('AgentRegistered', {
      agentId: agent.agentId,
      userId: localUser.userId,
      unitId: input.unitId,
      areaId: unit.areaId,
      forumId: unit.forumId,
      agentCode: agent.agentCode,
      email: input.email,
      createdBy: input.createdBy
    });

    return {
      agentId: agent.agentId,
      userId: localUser.userId,
      agentCode: agent.agentCode,
      email: input.email,
      invitationSent: !linkError
    };
  });
}
```

**Outcome:**

- User created in Supabase
- User created in local DB
- Agent record created with status "Active"
- Agent role assigned to user
- Invitation email sent for password setup
- Event: `AgentRegistered`

**Returns:**

```json
{
  "agentId": "uuid",
  "userId": "uuid",
  "agentCode": "AG001",
  "email": "agent@example.com",
  "invitationSent": true
}
```

---

### 2. UpdateAgent

**Triggered by:** Super Admin, Forum Admin, Area Admin, Unit Admin, Agent (self)

**Input:**

```json
{
  "agentId": "uuid",
  "personalDetails": {
    "firstName": "string?",
    "middleName": "string?",
    "lastName": "string?",
    "dateOfBirth": "date?"
  },
  "contactDetails": {
    "contactNumber": "string?",
    "alternateContactNumber": "string?"
  },
  "address": {
    "line1": "string?",
    "line2": "string?",
    "city": "string?",
    "state": "string?",
    "postalCode": "string?",
    "country": "string?"
  },
  "updatedBy": "uuid"
}
```

Note: `agentCode`, `unitId`, `userId`, `email`, `joinedDate` cannot be updated

**Preconditions:**

- Agent exists
- If self-update: `updatedBy` must be the agent's `userId`
- If admin update: `updatedBy` must have permission

**Backend Logic:**

```js
async function updateAgent(input) {
  return await db.transaction(async (trx) => {

    // 1. Get agent
    const agent = await db.agents.findByPk(input.agentId, { transaction: trx });
    if (!agent) {
      throw new Error('Agent not found');
    }

    // 2. Check permission
    const isSelfUpdate = (input.updatedBy === agent.userId);

    if (!isSelfUpdate) {
      const canUpdate = await hasPermission(
        input.updatedBy,
        'agent.update',
        { unitId: agent.unitId }
      );

      if (!canUpdate) {
        throw new Error('Not authorized to update this agent');
      }
    }

    // 3. Build updates object
    const updates = {
      updatedAt: new Date(),
      updatedBy: input.updatedBy
    };

    if (input.personalDetails) {
      if (input.personalDetails.firstName) updates.firstName = input.personalDetails.firstName;
      if (input.personalDetails.middleName !== undefined) updates.middleName = input.personalDetails.middleName;
      if (input.personalDetails.lastName) updates.lastName = input.personalDetails.lastName;
      if (input.personalDetails.dateOfBirth) {
        // Validate age
        const age = calculateAge(input.personalDetails.dateOfBirth);
        if (age < 18) {
          throw new Error('Agent must be at least 18 years old');
        }
        updates.dateOfBirth = input.personalDetails.dateOfBirth;
      }
    }

    if (input.contactDetails) {
      if (input.contactDetails.contactNumber) updates.contactNumber = input.contactDetails.contactNumber;
      if (input.contactDetails.alternateContactNumber !== undefined) {
        updates.alternateContactNumber = input.contactDetails.alternateContactNumber;
      }
    }

    if (input.address) {
      if (input.address.line1 !== undefined) updates.addressLine1 = input.address.line1;
      if (input.address.line2 !== undefined) updates.addressLine2 = input.address.line2;
      if (input.address.city !== undefined) updates.city = input.address.city;
      if (input.address.state !== undefined) updates.state = input.address.state;
      if (input.address.postalCode !== undefined) updates.postalCode = input.address.postalCode;
      if (input.address.country !== undefined) updates.country = input.address.country;
    }

    // 4. Update agent
    await db.agents.update(updates, {
      where: { agentId: input.agentId }
    }, { transaction: trx });

    // 5. If name changed, update user table too
    if (updates.firstName || updates.lastName) {
      const userUpdates = {};
      if (updates.firstName) userUpdates.firstName = updates.firstName;
      if (updates.lastName) userUpdates.lastName = updates.lastName;

      await db.users.update(userUpdates, {
        where: { userId: agent.userId }
      }, { transaction: trx });
    }

    // 6. Emit event
    await emitEvent('AgentUpdated', {
      agentId: input.agentId,
      updates,
      updatedBy: input.updatedBy
    });

    return await db.agents.findByPk(input.agentId, { transaction: trx });
  });
}
```

**Outcome:**

- Agent details updated
- If name changed, `users` table also updated
- Event: `AgentUpdated`

---

### 3. TerminateAgent (Phase 1)

**Triggered by:** Super Admin, Forum Admin, Area Admin, Unit Admin

**Input:**

```json
{
  "agentId": "uuid",
  "terminationReason": "string",
  "terminatedDate": "date",
  "terminatedBy": "uuid"
}
```

**Preconditions:**

- Agent exists with status "Active"
- Agent has zero active members (Phase 1 constraint)
- User (`terminatedBy`) has permission to terminate agents

**Backend Logic:**

```js
async function terminateAgent(input) {
  return await db.transaction(async (trx) => {

    // 1. Get agent
    const agent = await db.agents.findByPk(input.agentId, { transaction: trx });
    if (!agent) {
      throw new Error('Agent not found');
    }

    if (agent.agentStatus !== 'Active') {
      throw new Error('Only active agents can be terminated');
    }

    // 2. Check permission
    const canTerminate = await hasPermission(
      input.terminatedBy,
      'agent.terminate',
      { unitId: agent.unitId }
    );

    if (!canTerminate) {
      throw new Error('Not authorized to terminate this agent');
    }

    // 3. Phase 1: Check agent has no active members
    const activeMembers = await db.members.count({
      where: {
        agentId: input.agentId,
        memberStatus: 'Active'
      }
    }, { transaction: trx });

    if (activeMembers > 0) {
      throw new Error(
        `Cannot terminate agent with ${activeMembers} active members. ` +
        `Please reassign members first (Phase 2 feature).`
      );
    }

    // 4. Update agent status
    await db.agents.update({
      agentStatus: 'Terminated',
      terminatedDate: input.terminatedDate,
      terminationReason: input.terminationReason,
      updatedAt: new Date(),
      updatedBy: input.terminatedBy
    }, {
      where: { agentId: input.agentId }
    }, { transaction: trx });

    // 5. Deactivate user account
    await db.users.update({
      isActive: false
    }, {
      where: { userId: agent.userId }
    }, { transaction: trx });

    // 6. Revoke agent role
    await db.userRoles.update({
      isActive: false,
      revokedAt: new Date(),
      revokedBy: input.terminatedBy
    }, {
      where: {
        userId: agent.userId,
        scopeEntityType: 'Agent',
        scopeEntityId: input.agentId,
        isActive: true
      }
    }, { transaction: trx });

    // 7. Deactivate user in Supabase (optional, for extra security)
    const localUser = await db.users.findByPk(agent.userId);
    if (localUser) {
      await supabase.auth.admin.updateUserById(localUser.externalAuthId, {
        ban_duration: 'none' // Or use ban_duration: '876000h' for permanent ban
        // Note: Supabase doesn't have "soft delete", so we just rely on local isActive
      });
    }

    // 8. Emit event
    await emitEvent('AgentTerminated', {
      agentId: input.agentId,
      userId: agent.userId,
      unitId: agent.unitId,
      terminationReason: input.terminationReason,
      terminatedBy: input.terminatedBy
    });

    return await db.agents.findByPk(input.agentId, { transaction: trx });
  });
}
```

**Outcome:**

- Agent status → "Terminated"
- `terminatedDate` and `terminationReason` set
- User account deactivated (`isActive` → `false`)
- Agent role revoked
- Event: `AgentTerminated`

---

### 4. GetAgentDetails

**Triggered by:** Any authenticated user (with permission)

**Input:**

```json
{
  "agentId": "uuid",
  "requestedBy": "uuid"
}
```

**Backend Logic:**

```js
async function getAgentDetails(agentId, requestedBy) {
  // 1. Get agent with related data
  const agent = await db.agents.findByPk(agentId, {
    include: [
      {
        model: db.users,
        as: 'user',
        attributes: ['userId', 'email', 'isActive']
      },
      {
        model: db.units,
        as: 'unit',
        attributes: ['unitId', 'unitCode', 'unitName'],
        include: [
          {
            model: db.areas,
            as: 'area',
            attributes: ['areaId', 'areaCode', 'areaName']
          }
        ]
      }
    ]
  });

  if (!agent) {
    throw new Error('Agent not found');
  }

  // 2. Check permission to view this agent
  const canView = await hasPermission(
    requestedBy,
    'agent.read',
    { unitId: agent.unitId }
  );

  if (!canView && requestedBy !== agent.userId) {
    throw new Error('Not authorized to view this agent');
  }

  // 3. Return agent details
  return {
    agentId: agent.agentId,
    agentCode: agent.agentCode,
    agentStatus: agent.agentStatus,
    personalDetails: {
      firstName: agent.firstName,
      middleName: agent.middleName,
      lastName: agent.lastName,
      dateOfBirth: agent.dateOfBirth,
      gender: agent.gender
    },
    contactDetails: {
      contactNumber: agent.contactNumber,
      alternateContactNumber: agent.alternateContactNumber,
      email: agent.email
    },
    address: {
      line1: agent.addressLine1,
      line2: agent.addressLine2,
      city: agent.city,
      state: agent.state,
      postalCode: agent.postalCode,
      country: agent.country
    },
    unit: {
      unitId: agent.unit.unitId,
      unitCode: agent.unit.unitCode,
      unitName: agent.unit.unitName,
      area: {
        areaId: agent.unit.area.areaId,
        areaCode: agent.unit.area.areaCode,
        areaName: agent.unit.area.areaName
      }
    },
    statistics: {
      totalActiveMembers: agent.totalActiveMembers,
      totalRegistrations: agent.totalRegistrations
    },
    joinedDate: agent.joinedDate,
    terminatedDate: agent.terminatedDate,
    terminationReason: agent.terminationReason,
    createdAt: agent.createdAt
  };
}
```

---

### 5. ListAgentsByUnit

**Triggered by:** Admin users

**Input:**

```json
{
  "unitId": "uuid",
  "status": "Active|Terminated?", // Optional filter
  "page": 1,
  "limit": 20,
  "requestedBy": "uuid"
}
```

**Backend Logic:**

```js
async function listAgentsByUnit(filters) {
  // 1. Check permission
  const canView = await hasPermission(
    filters.requestedBy,
    'agent.read',
    { unitId: filters.unitId }
  );

  if (!canView) {
    throw new Error('Not authorized to view agents in this unit');
  }

  // 2. Build query
  const where = { unitId: filters.unitId };
  if (filters.status) {
    where.agentStatus = filters.status;
  }

  const offset = (filters.page - 1) * filters.limit;

  // 3. Fetch agents
  const { count, rows } = await db.agents.findAndCountAll({
    where,
    include: [
      {
        model: db.users,
        as: 'user',
        attributes: ['userId', 'email', 'isActive']
      }
    ],
    order: [['agentCode', 'ASC']],
    limit: filters.limit,
    offset
  });

  return {
    total: count,
    page: filters.page,
    limit: filters.limit,
    agents: rows.map(agent => ({
      agentId: agent.agentId,
      agentCode: agent.agentCode,
      agentStatus: agent.agentStatus,
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      contactNumber: agent.contactNumber,
      totalActiveMembers: agent.totalActiveMembers,
      totalRegistrations: agent.totalRegistrations,
      joinedDate: agent.joinedDate
    }))
  };
}
```

---

### 6. GetAgentStatistics

**Triggered by:** Agent (self) or Admin

**Input:**

```json
{
  "agentId": "uuid",
  "requestedBy": "uuid"
}
```

**Backend Logic:**

```js
async function getAgentStatistics(agentId, requestedBy) {
  // 1. Get agent
  const agent = await db.agents.findByPk(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  // 2. Check permission
  const canView = (requestedBy === agent.userId) ||
    await hasPermission(requestedBy, 'agent.read', { unitId: agent.unitId });

  if (!canView) {
    throw new Error('Not authorized');
  }

  // 3. Compute statistics
  const stats = {
    totalMembers: await db.members.count({
      where: { agentId }
    }),
    activeMembers: await db.members.count({
      where: { agentId, memberStatus: 'Active' }
    }),
    suspendedMembers: await db.members.count({
      where: { agentId, memberStatus: 'Suspended' }
    }),
    pendingRegistrations: await db.members.count({
      where: { agentId, registrationStatus: 'PendingApproval' }
    }),
    totalWalletDepositsThisMonth: await db.walletTransactions.sum('amount', {
      where: {
        agentId,
        type: 'Deposit',
        status: 'Approved',
        createdAt: {
          gte: startOfMonth(),
          lte: endOfMonth()
        }
      }
    })
  };

  return stats;
}
```

---

## Database Schema (Agent Table)

```sql
CREATE TABLE agents (
  agent_id UUID PRIMARY KEY,

  -- Hierarchy
  unit_id UUID NOT NULL REFERENCES units(unit_id),
  area_id UUID NOT NULL REFERENCES areas(area_id), -- Denormalized
  forum_id UUID NOT NULL REFERENCES forums(forum_id), -- Denormalized

  -- Identification
  agent_code VARCHAR(50) NOT NULL,

  -- User reference
  user_id UUID NOT NULL REFERENCES users(user_id),

  -- Personal Details
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,

  -- Contact Details
  contact_number VARCHAR(20) NOT NULL,
  alternate_contact_number VARCHAR(20),
  email VARCHAR(255) NOT NULL,

  -- Address (Optional)
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),

  -- Status
  agent_status VARCHAR(50) DEFAULT 'Active', -- Active, Inactive, Suspended, Terminated

  -- Statistics
  total_active_members INT DEFAULT 0,
  total_registrations INT DEFAULT 0,

  -- Metadata
  joined_date DATE NOT NULL,
  terminated_date DATE,
  termination_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(user_id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(user_id),

  -- Constraints
  UNIQUE(unit_id, agent_code), -- Agent code unique within unit
  CONSTRAINT chk_agent_age CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

-- Indexes
CREATE INDEX idx_agents_unit ON agents(unit_id);
CREATE INDEX idx_agents_area ON agents(area_id);
CREATE INDEX idx_agents_forum ON agents(forum_id);
CREATE INDEX idx_agents_user ON agents(user_id);
CREATE INDEX idx_agents_status ON agents(agent_status);
CREATE INDEX idx_agents_code ON agents(unit_id, agent_code);
CREATE INDEX idx_agents_email ON agents(email);
```

---

## Validation Rules Summary

### Registration

- `agentCode`: required, alphanumeric + hyphen/underscore, 3-50 chars, unique within unit
- `email`: required, valid format, unique globally
- `firstName`, `lastName`: required, 2-100 chars
- `dateOfBirth`: required, agent must be 18+ years old
- `gender`: required, valid enum value
- `contactNumber`: required, valid phone format
- `address`: optional, all fields can be null
- `joinedDate`: required, cannot be in future

### Update

- Cannot update: `agentCode`, `unitId`, `userId`, `email`, `joinedDate`
- Can update: personal details, contact details, address
- Age validation applies if updating `dateOfBirth`

### Termination

- Can only terminate agents with status "Active"
- Phase 1: Agent must have zero active members
- `terminationReason`: required, min 10 chars

---

## Events Emitted

- `AgentRegistered` - When agent is created
- `AgentUpdated` - When agent details updated
- `AgentTerminated` - When agent is terminated
- `AgentMemberCountUpdated` - When member statistics change (triggered by member operations)

---

## Summary: Commands List

- `RegisterAgent` (Super Admin, Forum Admin, Area Admin, Unit Admin)
- `UpdateAgent` (Admins, Agent self)
- `TerminateAgent` (Super Admin, Forum Admin, Area Admin, Unit Admin) - Phase 1
- `GetAgentDetails` (Admins, Agent self)
- `ListAgentsByUnit` (Admins)
- `GetAgentStatistics` (Admins, Agent self)