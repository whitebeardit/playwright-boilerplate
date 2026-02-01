# Architecture Guidelines

Architectural decisions, design patterns, and separation of concerns guidelines.

## Architectural Principles

### Separation of Concerns

- **Presentation Layer**: Handles user interaction (controllers, routes)
- **Business Logic Layer**: Contains business rules and domain logic (services)
- **Data Access Layer**: Handles data persistence (repositories, data access)
- **Infrastructure Layer**: External concerns (logging, monitoring, messaging)

### Layered Architecture

```
┌─────────────────────────────────┐
│   Presentation Layer            │
│   (Controllers, Routes)         │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Business Logic Layer           │
│   (Services, Domain Models)     │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Data Access Layer              │
│   (Repositories, ORM)           │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Infrastructure Layer           │
│   (Database, External Services) │
└─────────────────────────────────┘
```

## Design Patterns

### Repository Pattern

Abstract data access logic:

```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements IRepository<User> {
  async findById(id: string) {
    return db.users.findById(id);
  }
  // ... other methods
}
```

### Service Layer Pattern

Encapsulate business logic:

```typescript
class OrderService {
  constructor(
    private orderRepository: IRepository<Order>,
    private paymentService: PaymentService,
    private inventoryService: InventoryService
  ) {}
  
  async processOrder(orderData: CreateOrderRequest): Promise<Order> {
    // Business logic here
    const order = await this.orderRepository.save(new Order(orderData));
    await this.paymentService.charge(order);
    await this.inventoryService.reserveItems(order.items);
    return order;
  }
}
```

### Dependency Injection

Depend on abstractions, not concretions:

```typescript
// ✅ Good: Dependency injection
class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private paymentService: IPaymentService
  ) {}
}

// ❌ Bad: Direct instantiation
class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();
}
```

## Key Principles

1. **Separation of Concerns**: Each layer has distinct responsibilities
2. **Dependency Inversion**: Depend on abstractions
3. **Single Responsibility**: Each class/component has one reason to change
4. **Open/Closed**: Open for extension, closed for modification
5. **Interface Segregation**: Small, focused interfaces
6. **Don't Repeat Yourself**: Reuse code through proper abstraction
