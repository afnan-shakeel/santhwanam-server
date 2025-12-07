# Event System Setup for Your Express.js Application

Based on your architecture, here's how to implement the event system:

---

## **1. Install Required Dependencies**

```bash
npm install uuid
npm install --save-dev @types/uuid
```

---

## **2. Project Structure**

```
src/
├── shared/
│   ├── domain/
│   │   └── events/
│   │       ├── domain-event.base.ts
│   │       ├── event-bus.ts
│   │       └── event-handler.interface.ts
│   ├── infrastructure/
│   │   └── events/
│   │       └── event-store.repository.ts (optional)
│   └── utils/
│       └── logger.ts
├── modules/
│   ├── members/
│   │   ├── domain/
│   │   │   ├── events/
│   │   │   │   ├── member-registered.event.ts
│   │   │   │   └── member-activated.event.ts
│   │   │   └── repositories/
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   └── activate-member.command.ts
│   │   │   └── event-handlers/
│   │   │       └── member-activated.handler.ts
│   │   └── api/
│   └── wallets/
│       └── application/
│           └── event-handlers/
│               └── create-wallet-on-activation.handler.ts
├── config/
│   ├── event-handlers.config.ts
│   └── container.config.ts (DI container)
└── app.ts
```

---

## **3. Base Domain Event**

```typescript
// src/shared/domain/events/domain-event.base.ts

import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly version: number = 1;

  constructor(
    public readonly eventType: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly payload: Record<string, unknown>,
    public readonly metadata?: {
      userId?: string;
      correlationId?: string;
      causationId?: string;
    }
  ) {
    this.eventId = uuidv4();
    this.occurredAt = new Date();
  }
}
```

---

## **4. Event Handler Interface**

```typescript
// src/shared/domain/events/event-handler.interface.ts

import { DomainEvent } from './domain-event.base';

export interface IEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}
```

---

## **5. Event Bus**

```typescript
// src/shared/domain/events/event-bus.ts

import { EventEmitter } from 'events';
import { DomainEvent } from './domain-event.base';
import { IEventHandler } from './event-handler.interface';
import { logger } from '@/shared/utils/logger';

class EventBus {
  private emitter: EventEmitter;
  private handlers: Map<string, IEventHandler[]>;

  constructor() {
    this.emitter = new EventEmitter();
    this.handlers = new Map();
    this.emitter.setMaxListeners(100);
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: IEventHandler<T>
  ): void {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [...existing, handler]);

    this.emitter.on(eventType, async (event: T) => {
      try {
        logger.info(`Handling event: ${eventType}`, {
          eventId: event.eventId,
          handler: handler.constructor.name
        });

        await handler.handle(event);

        logger.info(`Event handled successfully: ${eventType}`, {
          eventId: event.eventId,
          handler: handler.constructor.name
        });
      } catch (error) {
        logger.error(`Event handler failed for ${eventType}`, {
          eventId: event.eventId,
          handler: handler.constructor.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        // Don't rethrow - other handlers should continue
      }
    });

    logger.info(`Subscribed handler for event: ${eventType}`, {
      handler: handler.constructor.name
    });
  }

  async publish(event: DomainEvent): Promise<void> {
    logger.info(`Publishing event: ${event.eventType}`, {
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType
    });

    // Emit synchronously (handlers run in background)
    this.emitter.emit(event.eventType, event);
  }

  getHandlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.length || 0;
  }
}

export const eventBus = new EventBus();
```

---

## **6. Example Domain Event**

```typescript
// src/modules/members/domain/events/member-activated.event.ts

import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface MemberActivatedPayload {
  memberId: string;
  memberCode: string;
  agentId: string;
  unitId: string;
  areaId: string;
  forumId: string;
  tierId: string;
  advanceDeposit: number;
  approvedBy: string;
}

export class MemberActivatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'member.activated';

  constructor(payload: MemberActivatedPayload, userId?: string) {
    super(
      MemberActivatedEvent.EVENT_TYPE,
      payload.memberId,
      'Member',
      payload,
      { userId }
    );
  }

  get data(): MemberActivatedPayload {
    return this.payload as MemberActivatedPayload;
  }
}
```

---

## **7. Event Handler Implementation**

```typescript
// src/modules/wallets/application/event-handlers/create-wallet-on-activation.handler.ts

import { IEventHandler } from '@/shared/domain/events/event-handler.interface';
import { MemberActivatedEvent } from '@/modules/members/domain/events/member-activated.event';
import { IWalletRepository } from '@/modules/wallets/domain/repositories/wallet.repository.interface';
import { logger } from '@/shared/utils/logger';

export class CreateWalletOnActivationHandler 
  implements IEventHandler<MemberActivatedEvent> {
  
  constructor(private readonly walletRepository: IWalletRepository) {}

  async handle(event: MemberActivatedEvent): Promise<void> {
    const { memberId, advanceDeposit } = event.data;

    logger.info('Creating wallet for activated member', {
      memberId,
      eventId: event.eventId
    });

    // Check if wallet already exists (idempotency)
    const existingWallet = await this.walletRepository.findByMemberId(memberId);
    
    if (existingWallet) {
      logger.warn('Wallet already exists, skipping creation', {
        memberId,
        walletId: existingWallet.walletId
      });
      return;
    }

    // Create wallet
    await this.walletRepository.create({
      memberId,
      currentBalance: advanceDeposit,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    logger.info('Wallet created successfully', { memberId });
  }
}
```

---

## **8. Using Events in Commands**

```typescript
// src/modules/members/application/commands/activate-member.command.ts

import { IMemberRepository } from '@/modules/members/domain/repositories/member.repository.interface';
import { eventBus } from '@/shared/domain/events/event-bus';
import { MemberActivatedEvent } from '@/modules/members/domain/events/member-activated.event';
import { logger } from '@/shared/utils/logger';
import { NotFoundError } from '@/shared/utils/error-handling/errors';

export class ActivateMemberCommand {
  constructor(
    private readonly memberRepository: IMemberRepository
  ) {}

  async execute(memberId: string, approvedBy: string): Promise<void> {
    logger.info('Activating member', { memberId, approvedBy });

    // Get member
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new NotFoundError('Member not found');
    }

    // Update member status
    await this.memberRepository.update(memberId, {
      registrationStatus: 'Approved',
      memberStatus: 'Active',
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    });

    logger.info('Member activated, publishing event', { memberId });

    // Publish event
    const event = new MemberActivatedEvent({
      memberId: member.memberId,
      memberCode: member.memberCode,
      agentId: member.agentId,
      unitId: member.unitId,
      areaId: member.areaId,
      forumId: member.forumId,
      tierId: member.tierId,
      advanceDeposit: member.advanceDeposit,
      approvedBy
    }, approvedBy);

    await eventBus.publish(event);
  }
}
```

---

## **9. Register Event Handlers**

```typescript
// src/config/event-handlers.config.ts

import { eventBus } from '@/shared/domain/events/event-bus';
import { PrismaClient } from '@prisma/client';

// Repositories
import { PrismaWalletRepository } from '@/shared/infrastructure/repositories/wallet.repository';
import { PrismaAgentRepository } from '@/shared/infrastructure/repositories/agent.repository';

// Handlers
import { CreateWalletOnActivationHandler } from '@/modules/wallets/application/event-handlers/create-wallet-on-activation.handler';
import { UpdateAgentStatsHandler } from '@/modules/agents/application/event-handlers/update-agent-stats.handler';
import { MemberActivatedEvent } from '@/modules/members/domain/events/member-activated.event';

export function registerEventHandlers(prisma: PrismaClient): void {
  // Initialize repositories
  const walletRepo = new PrismaWalletRepository(prisma);
  const agentRepo = new PrismaAgentRepository(prisma);

  // Initialize handlers
  const createWalletHandler = new CreateWalletOnActivationHandler(walletRepo);
  const updateAgentStatsHandler = new UpdateAgentStatsHandler(agentRepo);

  // Register subscriptions
  eventBus.subscribe(
    MemberActivatedEvent.EVENT_TYPE,
    createWalletHandler
  );

  eventBus.subscribe(
    MemberActivatedEvent.EVENT_TYPE,
    updateAgentStatsHandler
  );

  // Add more event subscriptions here...
}
```

---

## **10. Initialize in App**

```typescript
// src/app.ts

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerEventHandlers } from '@/config/event-handlers.config';
import { errorHandler } from '@/shared/utils/error-handling/error-handler';
import { logger } from '@/shared/utils/logger';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Register event handlers BEFORE routes
registerEventHandlers(prisma);
logger.info('Event handlers registered');

// Register routes
// ... your route registrations

// Global error handler (must be last)
app.use(errorHandler);

export { app, prisma };
```

---

## **11. Optional: Event Store with Prisma**

```prisma
// prisma/schema.prisma

model DomainEvent {
  id            String   @id @default(uuid())
  eventId       String   @unique
  eventType     String
  aggregateId   String
  aggregateType String
  payload       Json
  metadata      Json?
  occurredAt    DateTime
  version       Int
  createdAt     DateTime @default(now())

  @@index([aggregateId])
  @@index([eventType])
  @@index([occurredAt])
  @@map("domain_events")
}
```

```typescript
// src/shared/infrastructure/events/event-store.repository.ts

import { PrismaClient } from '@prisma/client';
import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export class EventStoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(event: DomainEvent): Promise<void> {
    await this.prisma.domainEvent.create({
      data: {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        payload: event.payload as any,
        metadata: event.metadata as any,
        occurredAt: event.occurredAt,
        version: event.version
      }
    });
  }

  async getByAggregateId(aggregateId: string): Promise<DomainEvent[]> {
    const events = await this.prisma.domainEvent.findMany({
      where: { aggregateId },
      orderBy: { occurredAt: 'asc' }
    });

    return events as unknown as DomainEvent[];
  }
}
```

To persist events, modify the event bus:

```typescript
// In event-bus.ts, add:
async publish(event: DomainEvent): Promise<void> {
  // Persist to event store (if configured)
  if (this.eventStore) {
    await this.eventStore.save(event);
  }

  logger.info(`Publishing event: ${event.eventType}`, {
    eventId: event.eventId,
    aggregateId: event.aggregateId
  });

  this.emitter.emit(event.eventType, event);
}
```

---

## **12. Testing Events**

```typescript
// __tests__/wallets/event-handlers/create-wallet-on-activation.handler.test.ts

import { CreateWalletOnActivationHandler } from '@/modules/wallets/application/event-handlers/create-wallet-on-activation.handler';
import { MemberActivatedEvent } from '@/modules/members/domain/events/member-activated.event';

describe('CreateWalletOnActivationHandler', () => {
  it('should create wallet when member activated', async () => {
    const mockWalletRepo = {
      findByMemberId: jest.fn().mockResolvedValue(null),
      create: jest.fn()
    };

    const handler = new CreateWalletOnActivationHandler(mockWalletRepo);

    const event = new MemberActivatedEvent({
      memberId: 'member-123',
      memberCode: 'MEM-2025-00001',
      agentId: 'agent-1',
      unitId: 'unit-1',
      areaId: 'area-1',
      forumId: 'forum-1',
      tierId: 'tier-1',
      advanceDeposit: 1000,
      approvedBy: 'admin-1'
    });

    await handler.handle(event);

    expect(mockWalletRepo.create).toHaveBeenCalledWith({
      memberId: 'member-123',
      currentBalance: 1000,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should skip creation if wallet exists', async () => {
    const mockWalletRepo = {
      findByMemberId: jest.fn().mockResolvedValue({ walletId: 'existing' }),
      create: jest.fn()
    };

    const handler = new CreateWalletOnActivationHandler(mockWalletRepo);

    const event = new MemberActivatedEvent({
      memberId: 'member-123',
      // ... payload
    });

    await handler.handle(event);

    expect(mockWalletRepo.create).not.toHaveBeenCalled();
  });
});
```

---

## **Benefits of This Approach**

✅ **Follows your architecture**: Events in `domain/events/`, handlers in `application/event-handlers/`  
✅ **Type-safe**: Full TypeScript support  
✅ **Decoupled**: Modules communicate via events  
✅ **Testable**: Easy to unit test handlers  
✅ **Error isolation**: One handler fails, others continue  
✅ **Idempotent**: Handlers can safely run multiple times  
✅ **Scalable**: Easy to add new handlers without modifying existing code  

---

**Ready to implement! Any questions?**