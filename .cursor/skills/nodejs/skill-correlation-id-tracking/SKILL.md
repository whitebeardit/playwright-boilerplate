---
name: correlation-id-tracking
description: Manages correlation-id in Node.js/TypeScript applications using AsyncLocalStorage for async context isolation. Use when implementing correlation-id tracking, HTTP request/response correlation, logging integration, or when working with distributed tracing in Node.js applications.
---

# Correlation-ID Tracking for Node.js

This skill helps you implement correlation-id tracking in Node.js/TypeScript applications using AsyncLocalStorage for async context preservation.

## Installation

```bash
npm install async-local-storage
# or
yarn add async-local-storage
```

## Quick Setup

### Express.js - Zero Configuration

**Minimal setup:**

```typescript
import express from 'express';
import { correlationIdMiddleware } from './middleware/correlation-id';

const app = express();

// Add correlation-ID middleware (must be first)
app.use(correlationIdMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
  const correlationId = getCorrelationId();
  res.json({ correlationId });
});

app.listen(3000);
```

### Correlation-ID Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

const correlationStorage = new AsyncLocalStorage<string>();

export function getCorrelationId(): string {
  return correlationStorage.getStore() || generateCorrelationId();
}

export function setCorrelationId(id: string): void {
  correlationStorage.enterWith(id);
}

function generateCorrelationId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId = 
    req.headers['x-correlation-id'] as string || generateCorrelationId();
  
  correlationStorage.run(correlationId, () => {
    res.setHeader('X-Correlation-Id', correlationId);
    next();
  });
}
```

## Using Correlation-ID in Code

### In Controllers

```typescript
import { Request, Response } from 'express';
import { getCorrelationId } from '../middleware/correlation-id';

export async function getOrder(req: Request, res: Response) {
  const correlationId = getCorrelationId();
  
  try {
    const order = await orderService.getById(req.params.id);
    res.json({ order, correlationId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get order', correlationId });
  }
}
```

### In Services

```typescript
import { getCorrelationId } from '../middleware/correlation-id';
import logger from '../logger';

export class OrderService {
  async getById(id: string) {
    const correlationId = getCorrelationId();
    
    logger.info('Getting order', { 
      orderId: id, 
      correlationId 
    });
    
    // Your business logic here
    return order;
  }
}
```

## HTTP Client Integration

### Axios Interceptor

```typescript
import axios from 'axios';
import { getCorrelationId } from './middleware/correlation-id';

// Add request interceptor
axios.interceptors.request.use((config) => {
  const correlationId = getCorrelationId();
  if (correlationId) {
    config.headers['X-Correlation-Id'] = correlationId;
  }
  return config;
});
```

### Fetch Wrapper

```typescript
import { getCorrelationId } from './middleware/correlation-id';

export async function fetchWithCorrelationId(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const correlationId = getCorrelationId();
  
  const headers = {
    ...options?.headers,
    'X-Correlation-Id': correlationId || '',
  };
  
  return fetch(url, { ...options, headers });
}
```

## Logging Integration

### Winston Logger

```typescript
import winston from 'winston';
import { getCorrelationId } from './middleware/correlation-id';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    get correlationId() {
      return getCorrelationId();
    },
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Usage
logger.info('Processing order', { orderId: '123' });
// Automatically includes correlationId in metadata
```

### Pino Logger

```typescript
import pino from 'pino';
import { getCorrelationId } from './middleware/correlation-id';

const logger = pino({
  mixin() {
    return {
      correlationId: getCorrelationId(),
    };
  },
});

// Usage
logger.info({ orderId: '123' }, 'Processing order');
// Automatically includes correlationId
```

## Logging Best Practices

### Log Levels: When to Use Each

**DEBUG** - Development and troubleshooting only:
- Detailed execution flow
- Variable values and intermediate states
- Step-by-step process information
- **Not visible in production** (typically filtered out)

**INFO** - Production-ready, important events:
- Request start/completion
- Business operations (create, update, delete)
- External API calls (start/end)
- Important state changes
- **Visible in production**

**WARNING** - Potential issues that don't break functionality:
- Retry attempts
- Fallback to default values
- Deprecated API usage
- Performance degradation

**ERROR** - Failures that need attention:
- Exceptions and errors
- Failed operations
- External service failures

### What to Log (and What NOT to Log)

**✅ DO Log:**
- Request identifiers (correlation-ID, user ID, request ID)
- Business operations (what happened)
- External service calls (start, end, duration)
- Important state changes
- Errors with context (correlation-ID, user, operation)

**❌ DON'T Log:**
- Sensitive data (passwords, tokens, PII, credit cards)
- Large payloads (use summaries instead)
- Every iteration in loops (log once per operation)
- Redundant information (correlation-ID is already in context)
- Excessive detail in production (use DEBUG for that)

### Structured Logging with Correlation-ID

Always include correlation-ID in logs for traceability:

```typescript
// ✅ Good: Structured logging with correlation-ID
logger.info('Processing order', {
  orderId: orderId,
  userId: userId,
  correlationId: getCorrelationId(),
});

// ✅ Good: Using structured properties
logger.info('External API call completed', {
  endpoint: endpoint,
  duration: duration,
  statusCode: statusCode,
  correlationId: getCorrelationId(),
});

// ❌ Bad: Logging without correlation-ID context
logger.info(`Processing order ${orderId}`); // Missing correlation-ID!

// ❌ Bad: Logging sensitive data
logger.info(`User password: ${password}`); // NEVER log passwords!
```

### Logging Patterns for Debugging

**Pattern 1: Request Lifecycle**
```typescript
export async function getOrder(req: Request, res: Response) {
  const correlationId = getCorrelationId();
  
  // ✅ INFO: Request start (production-visible)
  logger.info('Getting order', { 
    orderId: req.params.id, 
    correlationId 
  });
  
  try {
    // ✅ DEBUG: Detailed steps (development only)
    logger.debug('Querying database for order', { 
      orderId: req.params.id, 
      correlationId 
    });
    
    const order = await orderRepository.findById(req.params.id);
    
    if (!order) {
      // ✅ WARNING: Expected but notable condition
      logger.warn('Order not found', { 
        orderId: req.params.id, 
        correlationId 
      });
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // ✅ INFO: Successful completion (production-visible)
    logger.info('Order retrieved successfully', { 
      orderId: req.params.id, 
      correlationId 
    });
    
    res.json(order);
  } catch (error) {
    // ✅ ERROR: Always log exceptions with correlation-ID
    logger.error(error, 'Error retrieving order', { 
      orderId: req.params.id, 
      correlationId 
    });
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Pattern 2: External Service Calls**
```typescript
export async function processPayment(request: PaymentRequest) {
  const correlationId = getCorrelationId();
  
  // ✅ INFO: External call start (production-visible)
  logger.info('Calling payment service', {
    amount: request.amount,
    currency: request.currency,
    correlationId,
  });
  
  const startTime = Date.now();
  
  try {
    const response = await paymentClient.process(request);
    const duration = Date.now() - startTime;
    
    // ✅ INFO: Success with duration (production-visible)
    logger.info('Payment service call completed', {
      status: response.status,
      duration,
      correlationId,
    });
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // ✅ ERROR: Failure with context (production-visible)
    logger.error(error, 'Payment service call failed', {
      duration,
      correlationId,
    });
    throw error;
  }
}
```

**Pattern 3: Conditional Debug Logging**
```typescript
export async function processItems(items: Item[]) {
  const correlationId = getCorrelationId();
  
  // ✅ INFO: Operation start (production-visible)
  logger.info('Processing items', {
    count: items.length,
    correlationId,
  });
  
  for (let i = 0; i < items.length; i++) {
    // ✅ DEBUG: Detailed per-item info (development only)
    logger.debug('Processing item', {
      index: i + 1,
      total: items.length,
      itemId: items[i].id,
      correlationId,
    });
    
    await processItem(items[i]);
  }
  
  // ✅ INFO: Operation completion (production-visible)
  logger.info('Processed items successfully', {
    count: items.length,
    correlationId,
  });
}
```

## Key Features

1. **AsyncLocalStorage**: Uses Node.js `async_hooks` AsyncLocalStorage for context preservation
2. **Automatic Propagation**: HTTP clients automatically include correlation-ID in headers
3. **Logging Integration**: Works with Winston, Pino, and other loggers
4. **Framework Support**: Works with Express, Fastify, NestJS, and other frameworks
5. **Header-Based**: Uses `X-Correlation-Id` header for HTTP propagation

## Important Notes

- **UUID Format**: Correlation-IDs are typically 32-character UUIDs without hyphens
- **Never Overwrites**: If correlation-ID exists (from headers), it's preserved
- **Independent from OpenTelemetry**: Correlation-ID is separate from trace context - both can coexist
- **Thread-Safe**: AsyncLocalStorage is safe for concurrent async operations

## Common Patterns

### Pattern 1: Reading Correlation-ID from Request

The middleware automatically:
1. Reads `X-Correlation-Id` from incoming request headers
2. If present, uses that value
3. If missing, generates new UUID (32 chars, no hyphens)
4. Sets AsyncLocalStorage context
5. Adds to response headers

### Pattern 2: Preserving Across Async Operations

```typescript
const correlationId = getCorrelationId(); // "abc123"

await someAsyncMethod();

const sameId = getCorrelationId(); // Still "abc123" - preserved!
```

### Pattern 3: Manual Propagation

```typescript
// Set correlation-ID from external source
setCorrelationId(externalCorrelationId);

// Now all operations use this correlation-ID
await processRequest();
```

## Key Principles

1. **Correlation-ID Always**: Every log should include correlation-ID
2. **Structured Properties**: Use structured logging with named properties, not string interpolation
3. **Context Matters**: Include relevant context (user ID, operation, IDs) but not sensitive data
4. **Level Appropriately**: Use DEBUG for detailed troubleshooting, INFO for production visibility
5. **Performance Aware**: Don't log in tight loops; summarize instead
6. **Error Context**: Always include correlation-ID and relevant context in error logs
