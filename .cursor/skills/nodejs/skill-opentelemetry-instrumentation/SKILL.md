---
name: opentelemetry-instrumentation
description: Instruments Node.js/TypeScript applications with OpenTelemetry spans following best practices. Use when adding distributed tracing, instrumenting HTTP requests, database operations, or when implementing observability with OpenTelemetry in Node.js applications.
---

# OpenTelemetry Instrumentation for Node.js

This skill guides you through instrumenting Node.js/TypeScript applications with OpenTelemetry spans, following best practices for distributed tracing.

## When to Instrument

**✅ DO Instrument:**
- External service calls (HTTP, gRPC)
- Database operations (queries, transactions)
- Critical business operations (order processing, payment flows)
- Long-running operations (file processing, batch jobs)
- Integration points (third-party APIs, message queues)

**❌ DON'T Instrument:**
- Simple property getters/setters
- In-memory operations (object lookups, array operations)
- Trivial calculations
- Operations that complete in <1ms consistently

## Installation

```bash
npm install @opentelemetry/api @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-node
npm install @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express
npm install @opentelemetry/exporter-otlp-http
```

## Core Concepts

### Tracer and Span

OpenTelemetry uses `Tracer` and `Span` for creating traces:

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('MyService');

// Create a span
const span = tracer.startSpan('operation.name');
try {
  // Your code here
  span.setAttributes({
    'key': 'value',
  });
  span.setStatus({ code: SpanStatusCode.OK });
} catch (error) {
  span.setStatus({ 
    code: SpanStatusCode.ERROR, 
    message: error.message 
  });
  span.recordException(error);
  throw error;
} finally {
  span.end();
}
```

### Span Kinds

```typescript
import { SpanKind } from '@opentelemetry/api';

SpanKind.SERVER    // Incoming HTTP request
SpanKind.CLIENT    // Outgoing HTTP/gRPC call
SpanKind.INTERNAL  // Internal operation
SpanKind.PRODUCER  // Message queue producer
SpanKind.CONSUMER  // Message queue consumer
```

## Instrumentation Patterns

### Pattern 1: HTTP Server (Express)

**Automatic instrumentation:**

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

**Manual instrumentation:**

```typescript
import { trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import express, { Request, Response, NextFunction } from 'express';

const tracer = trace.getTracer('MyService');

export function tracingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const span = tracer.startSpan(`HTTP ${req.method} ${req.path}`, {
    kind: SpanKind.SERVER,
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.route': req.route?.path || req.path,
    },
  });

  res.on('finish', () => {
    span.setAttributes({
      'http.status_code': res.statusCode,
    });
    
    if (res.statusCode >= 400) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `HTTP ${res.statusCode}`,
      });
    } else {
      span.setStatus({ code: SpanStatusCode.OK });
    }
    
    span.end();
  });

  trace.setSpan(trace.active(), span);
  next();
}
```

### Pattern 2: HTTP Client Calls

```typescript
import { trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import axios, { AxiosRequestConfig } from 'axios';

const tracer = trace.getTracer('MyService');

export async function callExternalApi(
  url: string,
  config?: AxiosRequestConfig
) {
  const span = tracer.startSpan('http.client.call', {
    kind: SpanKind.CLIENT,
    attributes: {
      'http.method': config?.method?.toUpperCase() || 'GET',
      'http.url': url,
    },
  });

  try {
    const response = await axios(url, config);
    
    span.setAttributes({
      'http.status_code': response.status,
    });
    span.setStatus({ code: SpanStatusCode.OK });
    
    return response;
  } catch (error: any) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    throw error;
  } finally {
    span.end();
  }
}
```

### Pattern 3: Database Operations

```typescript
import { trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('MyService');

export async function queryDatabase<T>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const span = tracer.startSpan('db.query', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'db.system': 'postgresql',
      'db.name': databaseName,
      'db.operation': 'SELECT',
      // Note: Sanitize db.statement if contains sensitive data
    },
  });

  try {
    const result = await db.query(query, params);
    
    span.setAttributes({
      'db.rows_affected': result.rowCount || 0,
    });
    span.setStatus({ code: SpanStatusCode.OK });
    
    return result.rows;
  } catch (error: any) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    throw error;
  } finally {
    span.end();
  }
}
```

### Pattern 4: Business Operations

```typescript
export async function processOrder(orderId: string, amount: number) {
  const span = tracer.startSpan('order.process', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'order.id': orderId,
      'order.amount': amount,
    },
  });

  try {
    // Child spans for sub-operations
    const paymentSpan = tracer.startSpan('payment.process', {
      kind: SpanKind.INTERNAL,
    });
    
    try {
      await processPayment(orderId, amount);
      paymentSpan.setStatus({ code: SpanStatusCode.OK });
    } catch (error: any) {
      paymentSpan.recordException(error);
      paymentSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      paymentSpan.end();
    }
    
    span.setStatus({ code: SpanStatusCode.OK });
    return { success: true };
  } catch (error: any) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    throw error;
  } finally {
    span.end();
  }
}
```

## Configuration

### Bootstrap TracerProvider

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'MyService',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start SDK
sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
```

## Environment Variables

```bash
# Enable/disable OpenTelemetry
OTEL_ENABLED=true

# OTLP endpoint
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Service name
SERVICE_NAME=MyService

# Sampling configuration
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=1.0  # 1.0 = 100%, 0.1 = 10%
```

## Semantic Tags (Best Practices)

Follow OpenTelemetry semantic conventions:

**HTTP:** `http.method`, `http.url`, `http.status_code`, `http.route`, `net.peer.name`

**Database:** `db.system`, `db.name`, `db.operation`, `db.statement` (sanitized!), `db.rows_affected`

**RPC:** `rpc.system`, `rpc.service`, `rpc.method`, `rpc.status_code`

**Custom Business:** `order.id`, `user.id`, `payment.amount`, etc.

**Never include:** Passwords, tokens, API keys, credit cards, full request/response bodies

## Helper Pattern (Recommended)

Create a centralized helper for consistent instrumentation:

```typescript
import { trace, SpanKind, SpanStatusCode, Span } from '@opentelemetry/api';

export class TraceabilityHelper {
  private static tracer = trace.getTracer('MyService');

  static startSpan(
    name: string,
    kind: SpanKind = SpanKind.INTERNAL
  ): Span | undefined {
    if (!this.isOtelEnabled()) return undefined;
    return this.tracer.startSpan(name, { kind });
  }

  static setHttpTags(
    span: Span | undefined,
    method?: string,
    url?: string,
    statusCode?: number
  ): void {
    if (!span) return;
    if (method) span.setAttribute('http.method', method);
    if (url) span.setAttribute('http.url', url);
    if (statusCode !== undefined) {
      span.setAttribute('http.status_code', statusCode);
    }
  }

  static setDbTags(
    span: Span | undefined,
    system: string,
    name: string,
    operation: string
  ): void {
    if (!span) return;
    span.setAttribute('db.system', system);
    span.setAttribute('db.name', name);
    span.setAttribute('db.operation', operation);
  }

  static setSuccessStatus(span: Span | undefined): void {
    span?.setStatus({ code: SpanStatusCode.OK });
  }

  static setErrorStatus(
    span: Span | undefined,
    errorMessage?: string
  ): void {
    span?.setStatus({
      code: SpanStatusCode.ERROR,
      message: errorMessage,
    });
  }

  static recordException(span: Span | undefined, error: Error): void {
    if (!span || !error) return;
    span.recordException(error);
  }

  private static isOtelEnabled(): boolean {
    const env = process.env.OTEL_ENABLED;
    return env === 'true' || env === '1';
  }
}
```

## Best Practices

1. **Feature Flag**: Use `OTEL_ENABLED` to disable without code changes
2. **Never Crash**: Wrap initialization in try/catch - misconfiguration shouldn't bring down the app
3. **Null Checks**: Always check if span exists (may be null if disabled or sampled out)
4. **Semantic Conventions**: Use standard attribute names (`http.*`, `db.*`, `rpc.*`, `error.*`)
5. **Sensitive Data**: Never include passwords, tokens, credit cards, full payloads
6. **Span Hierarchy**: Create logical parent-child relationships (Server → Internal → Client)
7. **Error Handling**: Always record exceptions and set error status
8. **Sampling**: Dev 100% (`SAMPLER_ARG=1.0`), Production 10% or less (`0.1` or `0.01`)

## Common Issues

**Spans Not Appearing:**
- Check `OTEL_ENABLED=true`, OTLP endpoint reachable, sampling rate, tracer registered

**Memory Leaks:**
- Ensure spans are properly ended in finally blocks
- Use automatic instrumentation when possible

**Performance Impact:**
- Use sampling in production (10% or less)
- Avoid instrumenting high-frequency operations

## Key Principles

1. **Instrument at boundaries**: External calls, database operations, critical business flows
2. **Use semantic conventions**: Standard attribute names ensure compatibility with observability tools
3. **Fail gracefully**: Misconfiguration should never crash the application
4. **Respect sampling**: Don't instrument operations that complete in <1ms
5. **Protect sensitive data**: Never log passwords, tokens, or full payloads
6. **Create logical hierarchies**: Parent-child spans show operation flow clearly
