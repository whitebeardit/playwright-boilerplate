---
name: performance
description: Performance optimization patterns including caching, async operations, profiling, and performance best practices. Use when optimizing code performance, implementing caching strategies, or when working with async/await patterns in any language.
---

# Performance Best Practices

This skill provides performance optimization patterns, caching strategies, and async operation best practices applicable across multiple programming languages.

## When to Optimize

**✅ DO Optimize:**
- Critical paths (hot paths)
- Operations that are measurably slow
- Code that runs frequently
- User-facing operations
- Database queries

**❌ DON'T Optimize:**
- Prematurely (before measuring)
- Code that runs rarely
- At the expense of readability
- Without profiling first

## Core Principles

1. **Measure First**: Profile before optimizing
2. **Optimize Hot Paths**: Focus on frequently executed code
3. **Cache Strategically**: Cache expensive operations
4. **Use Async Operations**: Don't block the event loop/thread
5. **Batch Operations**: Group similar operations
6. **Lazy Loading**: Load data only when needed

## Caching Strategies

### Pattern 1: In-Memory Cache

```typescript
// Simple in-memory cache
class Cache<T> {
  private cache = new Map<string, { value: T; expires: number }>();
  private ttl: number;

  constructor(ttlSeconds: number = 300) {
    this.ttl = ttlSeconds * 1000;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttl,
    });
  }
}
```

### Pattern 2: Cache-Aside Pattern

```typescript
async function getUser(userId: string): Promise<User> {
  // Try cache first
  const cached = cache.get(`user:${userId}`);
  if (cached) return cached;
  
  // If not in cache, fetch from database
  const user = await db.users.findById(userId);
  
  // Store in cache
  cache.set(`user:${userId}`, user);
  
  return user;
}
```

### Pattern 3: Write-Through Cache

```typescript
async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  // Update database
  const user = await db.users.update(userId, data);
  
  // Update cache
  cache.set(`user:${userId}`, user);
  
  return user;
}
```

## Async Operations

### Pattern 1: Parallel Execution

```typescript
// ❌ Bad: Sequential (slow)
const user = await getUser(userId);
const orders = await getOrders(userId);
const preferences = await getPreferences(userId);

// ✅ Good: Parallel (fast)
const [user, orders, preferences] = await Promise.all([
  getUser(userId),
  getOrders(userId),
  getPreferences(userId),
]);
```

### Pattern 2: Batch Processing

```typescript
// ❌ Bad: Process one by one
for (const item of items) {
  await processItem(item);
}

// ✅ Good: Batch processing
const batchSize = 10;
for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize);
  await Promise.all(batch.map(item => processItem(item)));
}
```

### Pattern 3: Async Queue

```typescript
class AsyncQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private concurrency: number;

  constructor(concurrency: number = 3) {
    this.concurrency = concurrency;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift()!;
    
    await task();
    this.running--;
    
    this.process();
  }
}
```

## Database Optimization

### Pattern 1: Query Optimization

```typescript
// ❌ Bad: N+1 queries
const orders = await db.orders.findAll();
for (const order of orders) {
  order.user = await db.users.findById(order.userId);
}

// ✅ Good: Single query with join
const orders = await db.orders.findAll({
  include: [{ model: User }],
});
```

### Pattern 2: Pagination

```typescript
// ✅ Good: Paginated queries
async function getOrders(page: number, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  return db.orders.findAll({
    limit: pageSize,
    offset: offset,
    order: [['createdAt', 'DESC']],
  });
}
```

### Pattern 3: Indexing

- Create indexes on frequently queried columns
- Index foreign keys
- Composite indexes for multi-column queries
- Monitor query performance

## Profiling and Measurement

### Pattern 1: Performance Timing

```typescript
function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

// Usage
const { result, duration } = await measureTime(() => processOrder(order));
console.log(`Processed in ${duration}ms`);
```

### Pattern 2: Performance Monitoring

```typescript
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  record(operation: string, duration: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);
  }

  getStats(operation: string) {
    const durations = this.metrics.get(operation) || [];
    if (durations.length === 0) return null;

    const sorted = [...durations].sort((a, b) => a - b);
    return {
      count: durations.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }
}
```

## Key Principles

1. **Measure Before Optimizing**: Profile to find bottlenecks
2. **Optimize Hot Paths**: Focus on frequently executed code
3. **Cache Wisely**: Cache expensive, frequently accessed data
4. **Use Async Operations**: Don't block execution
5. **Batch Operations**: Group similar operations
6. **Database Optimization**: Optimize queries, use indexes, paginate
7. **Lazy Loading**: Load data only when needed
8. **Monitor Performance**: Track metrics in production
