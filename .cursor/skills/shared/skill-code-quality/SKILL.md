---
name: code-quality
description: Code quality principles including SOLID, clean code, design patterns, and code smells. Use when refactoring code, reviewing code quality, or when implementing design patterns in any language.
---

# Code Quality Best Practices

This skill provides code quality principles, design patterns, and practices for writing maintainable, clean code across multiple programming languages.

## SOLID Principles

### S - Single Responsibility Principle

A class/function should have only one reason to change.

```typescript
// ❌ Bad: Multiple responsibilities
class User {
  save() { /* database logic */ }
  sendEmail() { /* email logic */ }
  validate() { /* validation logic */ }
}

// ✅ Good: Single responsibility
class User {
  validate() { /* validation only */ }
}

class UserRepository {
  save(user: User) { /* database logic */ }
}

class EmailService {
  sendEmail(user: User) { /* email logic */ }
}
```

### O - Open/Closed Principle

Open for extension, closed for modification.

```typescript
// ✅ Good: Extensible without modification
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

class CreditCardProcessor implements PaymentProcessor {
  async process(amount: number) { /* credit card logic */ }
}

class PayPalProcessor implements PaymentProcessor {
  async process(amount: number) { /* PayPal logic */ }
}
```

### L - Liskov Substitution Principle

Subtypes must be substitutable for their base types.

```typescript
// ✅ Good: Subtypes can replace base types
class Bird {
  move() { /* generic movement */ }
}

class Sparrow extends Bird {
  move() { this.fly(); }
}

class Penguin extends Bird {
  move() { this.walk(); }
}
```

### I - Interface Segregation Principle

Clients shouldn't depend on interfaces they don't use.

```typescript
// ❌ Bad: Fat interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// ✅ Good: Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}
```

### D - Dependency Inversion Principle

Depend on abstractions, not concretions.

```typescript
// ❌ Bad: Depends on concrete class
class OrderService {
  private emailService = new EmailService();
}

// ✅ Good: Depends on abstraction
class OrderService {
  constructor(private emailService: IEmailService) {}
}
```

## Clean Code Principles

### Meaningful Names

- Use descriptive names that reveal intent
- Avoid abbreviations and single-letter variables
- Use searchable names
- Use consistent naming conventions

```typescript
// ❌ Bad
const d = new Date();
const u = getUserById(i);

// ✅ Good
const currentDate = new Date();
const user = getUserById(userId);
```

### Functions

- Small and focused (single responsibility)
- Do one thing well
- Descriptive names
- Few parameters (3 or fewer ideally)

```typescript
// ❌ Bad: Too many responsibilities
function processOrder(order) {
  validate(order);
  calculateTotal(order);
  applyDiscount(order);
  chargePayment(order);
  sendEmail(order);
  updateInventory(order);
  logActivity(order);
}

// ✅ Good: Single responsibility
function processOrder(order: Order) {
  const validatedOrder = validateOrder(order);
  const orderWithTotal = calculateOrderTotal(validatedOrder);
  return chargeAndFulfill(orderWithTotal);
}
```

### Comments

- Code should be self-documenting
- Comments should explain "why", not "what"
- Remove commented-out code
- Use comments for complex business logic

```typescript
// ❌ Bad: Comment explains what code does
// Increment counter by 1
counter++;

// ✅ Good: Comment explains why
// Increment retry counter to track failed attempts for circuit breaker
counter++;
```

## Code Smells

### Long Method

**Problem**: Method is too long and does too much.

**Solution**: Extract methods, break into smaller functions.

### Large Class

**Problem**: Class has too many responsibilities.

**Solution**: Split into multiple classes following SRP.

### Duplicate Code

**Problem**: Same code appears in multiple places.

**Solution**: Extract to shared function/class.

### Long Parameter List

**Problem**: Function has too many parameters.

**Solution**: Use parameter objects or configuration objects.

```typescript
// ❌ Bad: Too many parameters
function createUser(name, email, age, address, phone, role) {}

// ✅ Good: Parameter object
function createUser(userData: CreateUserRequest) {}
```

### Feature Envy

**Problem**: Method uses more features of another class than its own.

**Solution**: Move method to the class it's most interested in.

### Data Clumps

**Problem**: Same group of data appears together frequently.

**Solution**: Extract to a class or data structure.

## Design Patterns

### Strategy Pattern

Define a family of algorithms, encapsulate each, and make them interchangeable.

```typescript
interface PaymentStrategy {
  pay(amount: number): Promise<PaymentResult>;
}

class CreditCardStrategy implements PaymentStrategy {
  async pay(amount: number) { /* credit card logic */ }
}

class PayPalStrategy implements PaymentStrategy {
  async pay(amount: number) { /* PayPal logic */ }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  
  processPayment(amount: number) {
    return this.strategy.pay(amount);
  }
}
```

### Factory Pattern

Create objects without specifying the exact class.

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(message); }
}

class FileLogger implements Logger {
  log(message: string) { /* write to file */ }
}

class LoggerFactory {
  static create(type: 'console' | 'file'): Logger {
    switch (type) {
      case 'console': return new ConsoleLogger();
      case 'file': return new FileLogger();
      default: throw new Error('Unknown logger type');
    }
  }
}
```

### Repository Pattern

Abstract data access logic.

```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements IRepository<User> {
  async findById(id: string) { /* database query */ }
  async findAll() { /* database query */ }
  async save(user: User) { /* database save */ }
  async delete(id: string) { /* database delete */ }
}
```

## Key Principles

1. **Readability**: Code should be easy to read and understand
2. **Maintainability**: Code should be easy to modify and extend
3. **Testability**: Code should be easy to test
4. **DRY (Don't Repeat Yourself)**: Avoid duplication
5. **KISS (Keep It Simple, Stupid)**: Prefer simple solutions
6. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
