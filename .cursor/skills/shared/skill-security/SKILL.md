---
name: security
description: Security best practices, OWASP Top 10, input validation, and secure coding patterns. Use when implementing authentication, authorization, input validation, or when addressing security vulnerabilities in any language.
---

# Security Best Practices

This skill provides security best practices, OWASP Top 10 guidance, and secure coding patterns applicable across multiple programming languages.

## OWASP Top 10 (2021)

### 1. Broken Access Control

**Problem**: Users can access resources they shouldn't have access to.

**Solutions:**
- Implement proper authentication and authorization
- Validate user permissions on every request
- Use principle of least privilege
- Validate ownership before allowing access

```typescript
// ✅ Good: Check authorization
export async function getOrder(req: Request, res: Response) {
  const order = await orderService.getById(req.params.id);
  
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(order);
}
```

### 2. Cryptographic Failures

**Problem**: Sensitive data exposed due to weak encryption or missing encryption.

**Solutions:**
- Encrypt sensitive data at rest and in transit
- Use strong, up-to-date cryptographic algorithms
- Never store passwords in plain text (use hashing)
- Use HTTPS/TLS for all communications

```typescript
// ✅ Good: Hash passwords
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);

// ✅ Good: Verify passwords
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 3. Injection

**Problem**: Untrusted data is sent to interpreter (SQL, NoSQL, OS, LDAP).

**Solutions:**
- Use parameterized queries/prepared statements
- Validate and sanitize all input
- Use ORMs with built-in protection
- Escape special characters

```typescript
// ❌ Bad: SQL Injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Good: Parameterized query
const query = 'SELECT * FROM users WHERE id = $1';
const result = await db.query(query, [userId]);
```

```csharp
// ✅ Good: Parameterized query in C#
var query = "SELECT * FROM Users WHERE Id = @id";
var result = await connection.QueryAsync<User>(query, new { id = userId });
```

### 4. Insecure Design

**Problem**: Missing or ineffective security controls by design.

**Solutions:**
- Implement security by design
- Use threat modeling
- Follow secure coding standards
- Regular security reviews

### 5. Security Misconfiguration

**Problem**: Insecure default configurations, incomplete configurations.

**Solutions:**
- Remove default credentials
- Disable unnecessary features
- Keep frameworks and dependencies updated
- Use secure configuration management

```typescript
// ✅ Good: Secure defaults
const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// Set secure headers
app.use(helmet());

// Use environment variables for secrets
const dbPassword = process.env.DB_PASSWORD;
```

### 6. Vulnerable and Outdated Components

**Problem**: Using components with known vulnerabilities.

**Solutions:**
- Keep dependencies updated
- Use dependency scanning tools
- Remove unused dependencies
- Monitor security advisories

```bash
# Check for vulnerabilities
npm audit
npm audit fix

# For .NET
dotnet list package --vulnerable
```

### 7. Identification and Authentication Failures

**Problem**: Weak authentication, session management issues.

**Solutions:**
- Use strong password policies
- Implement multi-factor authentication (MFA)
- Use secure session management
- Protect against brute force attacks

```typescript
// ✅ Good: Rate limiting for login
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
});

app.post('/login', loginLimiter, loginHandler);
```

### 8. Software and Data Integrity Failures

**Problem**: Untrusted data or software without integrity verification.

**Solutions:**
- Verify software integrity (checksums, signatures)
- Use Content Security Policy (CSP)
- Validate data integrity
- Use secure update mechanisms

### 9. Security Logging and Monitoring Failures

**Problem**: Insufficient logging and monitoring of security events.

**Solutions:**
- Log security-relevant events
- Monitor for suspicious activities
- Set up alerts for security incidents
- Retain logs appropriately

```typescript
// ✅ Good: Security event logging
logger.warn('Failed login attempt', {
  username: username,
  ip: req.ip,
  userAgent: req.get('user-agent'),
  timestamp: new Date(),
});
```

### 10. Server-Side Request Forgery (SSRF)

**Problem**: Application fetches remote resources without validating URLs.

**Solutions:**
- Validate and sanitize URLs
- Use allowlists for allowed domains
- Disable internal network access
- Use network segmentation

```typescript
// ✅ Good: Validate URLs
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = ['api.example.com', 'cdn.example.com'];
    return allowedHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}
```

## Input Validation

### Always Validate Input

**✅ DO:**
- Validate all input from users
- Validate data types, ranges, formats
- Sanitize input before processing
- Use allowlists instead of blocklists

**❌ DON'T:**
- Trust user input
- Process unvalidated data
- Use client-side validation alone
- Rely on hidden fields for security

```typescript
// ✅ Good: Input validation
import { z } from 'zod';

const orderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive().max(100),
  })).min(1),
  total: z.number().positive(),
});

export async function createOrder(req: Request, res: Response) {
  try {
    const validatedData = orderSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' });
  }
}
```

## Authentication and Authorization

### Password Security

- Use strong hashing algorithms (bcrypt, Argon2, scrypt)
- Never store passwords in plain text
- Implement password complexity requirements
- Use secure password reset flows

### Session Management

- Use secure, HTTP-only cookies
- Implement session timeout
- Regenerate session IDs after login
- Invalidate sessions on logout

```typescript
// ✅ Good: Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: false,
}));
```

## Secure Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

## Key Principles

1. **Never Trust User Input**: Always validate and sanitize
2. **Defense in Depth**: Multiple layers of security
3. **Principle of Least Privilege**: Minimum necessary permissions
4. **Fail Securely**: Default to secure state on errors
5. **Security by Design**: Build security in from the start
6. **Keep Dependencies Updated**: Regular security updates
7. **Log Security Events**: Monitor and alert on suspicious activity
