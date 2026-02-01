# Development Guidelines

General development guidelines and best practices for software development.

## Code Organization

### File Structure

- Group related functionality together
- Use consistent naming conventions
- Separate concerns (controllers, services, repositories)
- Keep files focused and reasonably sized

### Naming Conventions

**Files:**
- Use kebab-case for file names: `user-service.ts`, `order-controller.ts`
- Use PascalCase for class files: `UserService.ts`, `OrderController.ts`

**Variables and Functions:**
- Use camelCase: `getUserById`, `orderTotal`
- Use descriptive names that reveal intent
- Avoid abbreviations

**Constants:**
- Use UPPER_SNAKE_CASE: `MAX_RETRY_ATTEMPTS`, `API_BASE_URL`

**Classes:**
- Use PascalCase: `UserService`, `OrderController`

## Code Quality

### General Principles

1. **Readability**: Code should be easy to read and understand
2. **Maintainability**: Code should be easy to modify and extend
3. **Testability**: Code should be easy to test
4. **DRY**: Don't Repeat Yourself - avoid duplication
5. **KISS**: Keep It Simple - prefer simple solutions
6. **YAGNI**: You Aren't Gonna Need It - don't add until needed

### Function/Method Guidelines

- Keep functions small and focused
- Functions should do one thing well
- Use descriptive function names
- Limit parameters (3 or fewer ideally)
- Return early to reduce nesting

### Error Handling

- Always handle errors appropriately
- Use try-catch for operations that can fail
- Provide meaningful error messages
- Log errors with context
- Don't swallow exceptions silently

## Documentation

### Code Comments

- Write self-documenting code when possible
- Use comments to explain "why", not "what"
- Document complex business logic
- Remove commented-out code
- Keep comments up to date

### API Documentation

- Document all public APIs
- Include parameter descriptions
- Document return values and exceptions
- Provide usage examples
- Keep documentation synchronized with code

## Testing

### Test Coverage

- Write tests for business logic
- Aim for high coverage of critical paths (> 80%)
- Test edge cases and error scenarios
- Keep tests fast and independent
- Use appropriate test types (unit, integration, E2E)

### Test Quality

- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- One assertion per test (or related assertions)
- Mock external dependencies
- Keep tests maintainable

## Security

### Input Validation

- Always validate user input
- Use allowlists instead of blocklists
- Sanitize input before processing
- Validate data types and ranges

### Authentication and Authorization

- Implement proper authentication
- Check authorization on every request
- Use secure session management
- Follow principle of least privilege

### Sensitive Data

- Never log passwords, tokens, or PII
- Encrypt sensitive data at rest and in transit
- Use environment variables for secrets
- Never commit secrets to version control

## Performance

### Optimization Guidelines

- Measure before optimizing
- Optimize hot paths (frequently executed code)
- Use caching strategically
- Batch operations when possible
- Use async operations appropriately

### Database

- Optimize queries (use indexes, avoid N+1)
- Use pagination for large datasets
- Batch database operations
- Monitor query performance

## Version Control

### Commit Guidelines

- Follow Conventional Commits format
- Make small, focused commits
- Group related changes together
- Write clear commit messages
- Don't commit temporary or debug code

### Branch Strategy

- Use feature branches for new work
- Keep branches up to date
- Use descriptive branch names
- Clean up merged branches

## Key Principles

1. **Code Quality**: Write clean, maintainable code
2. **Security First**: Always consider security implications
3. **Test Coverage**: Maintain good test coverage
4. **Documentation**: Keep documentation current
5. **Performance**: Optimize when needed, but measure first
6. **Collaboration**: Write code others can understand and maintain
