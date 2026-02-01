---
name: testing
description: Testing patterns, frameworks, and best practices for unit, integration, and end-to-end tests. Use when writing tests, implementing TDD/BDD, or when working with test frameworks in any language.
---

# Testing Best Practices

This skill provides testing patterns, frameworks, and best practices applicable across multiple programming languages and frameworks.

## When to Use

**✅ DO Write Tests For:**
- Business logic and domain rules
- API endpoints and routes
- Service methods and utilities
- Error handling and edge cases
- Integration points (external services, databases)
- Critical user flows

**❌ DON'T Write Tests For:**
- Simple getters/setters
- Framework code (unless custom)
- Third-party library code
- Trivial code with no logic
- Generated code

## Core Concepts

### Test Types

**Unit Tests:**
- Test individual functions/methods in isolation
- Fast execution (< 1ms per test)
- No external dependencies (mocked)
- High code coverage

**Integration Tests:**
- Test multiple components working together
- May include database, file system, or external services
- Slower execution
- Verify contracts and interfaces

**End-to-End (E2E) Tests:**
- Test complete user workflows
- Full system stack
- Slowest execution
- Verify system behavior from user perspective

### Test Structure (AAA Pattern)

**Arrange**: Set up test data and conditions
**Act**: Execute the code under test
**Assert**: Verify the expected outcome

```typescript
// Example: TypeScript/Jest
describe('OrderService', () => {
  it('should calculate total with tax', () => {
    // Arrange
    const order = { items: [{ price: 100 }], taxRate: 0.1 };
    
    // Act
    const total = calculateTotal(order);
    
    // Assert
    expect(total).toBe(110);
  });
});
```

```csharp
// Example: C#/xUnit
public class OrderServiceTests
{
    [Fact]
    public void CalculateTotal_WithTax_ReturnsCorrectTotal()
    {
        // Arrange
        var order = new Order { Items = new[] { new Item { Price = 100 } }, TaxRate = 0.1m };
        
        // Act
        var total = _service.CalculateTotal(order);
        
        // Assert
        Assert.Equal(110m, total);
    }
}
```

## Testing Patterns

### Pattern 1: Unit Test Structure

**Naming Convention:**
- `MethodName_Scenario_ExpectedBehavior`
- Example: `ProcessPayment_WithValidCard_ReturnsSuccess`

**Test Organization:**
```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do X when Y', () => {
      // Test implementation
    });
    
    it('should handle Z error', () => {
      // Test implementation
    });
  });
});
```

### Pattern 2: Mocking External Dependencies

**Dependency Injection for Testability:**

```typescript
// Production code
export class OrderService {
  constructor(
    private paymentClient: PaymentClient,
    private emailService: EmailService
  ) {}
  
  async processOrder(order: Order) {
    const payment = await this.paymentClient.charge(order);
    await this.emailService.sendConfirmation(order);
    return payment;
  }
}

// Test code
describe('OrderService', () => {
  it('should process order successfully', async () => {
    // Arrange
    const mockPaymentClient = {
      charge: jest.fn().mockResolvedValue({ success: true })
    };
    const mockEmailService = {
      sendConfirmation: jest.fn().mockResolvedValue(undefined)
    };
    const service = new OrderService(mockPaymentClient, mockEmailService);
    
    // Act
    const result = await service.processOrder(testOrder);
    
    // Assert
    expect(result.success).toBe(true);
    expect(mockPaymentClient.charge).toHaveBeenCalledWith(testOrder);
    expect(mockEmailService.sendConfirmation).toHaveBeenCalledWith(testOrder);
  });
});
```

### Pattern 3: Testing Async Operations

```typescript
// Test async functions
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Test promises
it('should reject on error', async () => {
  await expect(asyncFunction()).rejects.toThrow('Error message');
});
```

### Pattern 4: Testing Error Cases

```typescript
it('should throw error for invalid input', () => {
  expect(() => {
    processPayment(null);
  }).toThrow('Payment request is required');
});

it('should handle network errors gracefully', async () => {
  const mockClient = {
    charge: jest.fn().mockRejectedValue(new Error('Network error'))
  };
  
  await expect(service.processOrder(order)).rejects.toThrow('Network error');
});
```

### Pattern 5: Test Data Builders

```typescript
// Create test data builders for complex objects
class OrderBuilder {
  private order: Partial<Order> = {};
  
  withId(id: string) {
    this.order.id = id;
    return this;
  }
  
  withItems(items: Item[]) {
    this.order.items = items;
    return this;
  }
  
  build(): Order {
    return { ...defaultOrder, ...this.order } as Order;
  }
}

// Usage in tests
const order = new OrderBuilder()
  .withId('123')
  .withItems([{ price: 100 }])
  .build();
```

## Test Frameworks

### JavaScript/TypeScript

**Jest:**
```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup
  });
  
  it('should work', () => {
    expect(result).toBe(expected);
  });
});
```

**Vitest:**
```typescript
import { describe, it, expect } from 'vitest';
// Similar API to Jest, faster execution
```

**Mocha + Chai:**
```typescript
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('MyComponent', () => {
  it('should work', () => {
    expect(result).to.equal(expected);
  });
});
```

### C#/.NET

**xUnit:**
```csharp
public class MyServiceTests
{
    [Fact]
    public void ShouldWork()
    {
        // Arrange, Act, Assert
        Assert.Equal(expected, actual);
    }
    
    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(2, 3, 5)]
    public void ShouldAdd(int a, int b, int expected)
    {
        Assert.Equal(expected, a + b);
    }
}
```

**NUnit:**
```csharp
[TestFixture]
public class MyServiceTests
{
    [Test]
    public void ShouldWork()
    {
        Assert.AreEqual(expected, actual);
    }
}
```

## Best Practices

### 1. Test Independence

- Each test should be independent and runnable in isolation
- Tests should not depend on execution order
- Clean up after each test (use `beforeEach`/`afterEach`)

### 2. Test Naming

- Use descriptive names that explain what is being tested
- Follow pattern: `MethodName_Scenario_ExpectedBehavior`
- Avoid generic names like `test1`, `test2`

### 3. Arrange-Act-Assert (AAA)

- Clearly separate setup, execution, and verification
- Keep arrange section minimal
- One assertion per test when possible (or related assertions)

### 4. Test Coverage

- Aim for high coverage of business logic (> 80%)
- Don't obsess over 100% coverage
- Focus on critical paths and edge cases

### 5. Fast Tests

- Unit tests should be fast (< 1ms)
- Use mocks for slow operations
- Run fast tests frequently, slow tests less often

### 6. Test Maintainability

- Keep tests simple and readable
- Extract common setup into helper functions
- Use test data builders for complex objects
- Don't duplicate production logic in tests

## Common Patterns

### Pattern: Testing HTTP Endpoints

```typescript
// Express.js example
import request from 'supertest';
import app from '../app';

describe('GET /api/orders/:id', () => {
  it('should return order when found', async () => {
    const response = await request(app)
      .get('/api/orders/123')
      .expect(200);
    
    expect(response.body).toHaveProperty('id', '123');
  });
  
  it('should return 404 when not found', async () => {
    await request(app)
      .get('/api/orders/999')
      .expect(404);
  });
});
```

### Pattern: Testing Database Operations

```typescript
// Use test database or in-memory database
describe('OrderRepository', () => {
  beforeEach(async () => {
    await testDb.clean();
  });
  
  it('should save and retrieve order', async () => {
    const order = await repository.save(testOrder);
    const retrieved = await repository.findById(order.id);
    
    expect(retrieved).toMatchObject(testOrder);
  });
});
```

## Key Principles

1. **Test Behavior, Not Implementation**: Test what the code does, not how it does it
2. **Fast Feedback**: Keep tests fast for quick iteration
3. **Clear Intent**: Test names and structure should clearly communicate intent
4. **Isolation**: Tests should not depend on each other
5. **Maintainability**: Tests should be as maintainable as production code
6. **Coverage with Purpose**: High coverage is good, but meaningful tests are better
