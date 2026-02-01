---
name: correlation-id-tracking
description: Manages correlation-id in .NET applications using AsyncLocal for async context isolation. Use when implementing correlation-id tracking, HTTP request/response correlation, logging integration, or when working with distributed tracing in .NET applications.
---

# Using Traceability Package for Correlation-ID Tracking

This skill helps you use the **WhiteBeard.Traceability** NuGet package to implement correlation-id tracking in .NET applications. The package provides automatic correlation-id management with zero-configuration setup.

## Installation

```bash
dotnet add package WhiteBeard.Traceability
```

Or via Package Manager:
```powershell
Install-Package WhiteBeard.Traceability
```

## Quick Setup

### ASP.NET Core (.NET 8) - Zero Configuration

**Minimal setup (one line!):**

```csharp
using Traceability.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Zero configuration - everything is automatic!
// - Middleware registered automatically
// - HttpClient configured automatically
// - Source from TRACEABILITY_SERVICENAME or assembly name
builder.Services.AddTraceability();
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();
```

**With explicit service name:**

```csharp
builder.Services.AddTraceability("MyService");
```

**Done!** Correlation-id is now automatically:
- ✅ Generated on each request (if not provided via `X-Correlation-Id` header)
- ✅ Available via `CorrelationContext.Current`
- ✅ Added to response headers as `X-Correlation-Id`
- ✅ Propagated in HttpClient calls automatically
- ✅ Included in logs (when logging is configured)

### ASP.NET Framework 4.8 - Zero Code

**Just install the package - no code needed!**

The library automatically:
- ✅ Registers `CorrelationIdHttpModule` via `PreApplicationStartMethod`
- ✅ Manages correlation-id automatically

**Optional: Configure Serilog**

```csharp
// Global.asax.cs
using Traceability.Extensions;
using Serilog;

protected void Application_Start()
{
    Log.Logger = new LoggerConfiguration()
        .WithTraceability("MyService")
        .WriteTo.Console(
            outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Source} {CorrelationId} {Message:lj}{NewLine}{Exception}")
        .CreateLogger();
}
```

## Using Correlation-ID in Code

### In Controllers

```csharp
using Traceability;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ApiController : ControllerBase
{
    [HttpGet("test")]
    public IActionResult Test()
    {
        // Correlation-id is automatically available
        var correlationId = CorrelationContext.Current;
        
        return Ok(new { CorrelationId = correlationId });
    }
}
```

### In Console Applications

```csharp
using Traceability;

// Get or create correlation-ID
var correlationId = CorrelationContext.GetOrCreate();
Console.WriteLine($"Correlation ID: {correlationId}");

// Correlation-id is preserved across async operations
await SomeAsyncMethod();
var sameId = CorrelationContext.Current; // Still the same!
```

### CorrelationContext API

```csharp
// Get current (auto-creates if missing)
var id = CorrelationContext.Current;

// Check if exists without creating
if (CorrelationContext.TryGetValue(out var correlationId))
{
    // Use existing correlation-ID
}

// Set explicitly
CorrelationContext.Current = "existing-correlation-id";

// Clear context
CorrelationContext.Clear();
```

## HttpClient Integration

**Automatic propagation - no extra code needed!**

```csharp
// In Program.cs
builder.Services.AddTraceability();
builder.Services.AddHttpClient("ExternalApi", client =>
{
    client.BaseAddress = new Uri("https://api.example.com/");
});

// In Controller
var client = _httpClientFactory.CreateClient("ExternalApi");
// Correlation-id is automatically added to X-Correlation-Id header!
var response = await client.GetAsync("posts/1");
```

The `CorrelationIdHandler` is automatically registered - all HttpClient instances created via `IHttpClientFactory` will include the correlation-ID header.

## Logging Integration

### Serilog

```csharp
using Traceability.Logging;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .Enrich.With<CorrelationIdEnricher>()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

// Now all logs automatically include CorrelationId property
logger.LogInformation("Processing request");
// Output: [12:34:56 INF] a1b2c3d4e5f6789012345678901234ab Processing request
```

### Microsoft.Extensions.Logging

```csharp
using Traceability.Logging;

builder.Services.AddTraceability();
builder.Logging.AddConsole(options => options.IncludeScopes = true);

// CorrelationIdScopeProvider is automatically registered
// Logs automatically include correlation-ID in scope
logger.LogInformation("Processing request");
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

```csharp
// ✅ Good: Structured logging with correlation-ID
_logger.LogInformation(
    "Processing order {OrderId} for user {UserId}. CorrelationId: {CorrelationId}",
    orderId, userId, CorrelationContext.Current);

// ✅ Good: Using structured properties
_logger.LogInformation(
    "External API call completed. Endpoint: {Endpoint}, Duration: {Duration}ms, StatusCode: {StatusCode}",
    endpoint, duration, statusCode);

// ❌ Bad: Logging without correlation-ID context
_logger.LogInformation($"Processing order {orderId}"); // Missing correlation-ID!

// ❌ Bad: Logging sensitive data
_logger.LogInformation($"User password: {password}"); // NEVER log passwords!
```

### Production vs Development Logging

**Production Configuration:**
```csharp
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",  // INFO and above
      "Microsoft": "Warning",    // Reduce framework noise
      "System": "Warning"
    }
  }
}
```

**Development Configuration:**
```csharp
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",        // DEBUG and above
      "Microsoft": "Information",
      "System": "Information"
    }
  }
}
```

### Logging Patterns for Debugging

**Pattern 1: Request Lifecycle**
```csharp
[HttpGet("orders/{id}")]
public async Task<IActionResult> GetOrder(int id)
{
    var correlationId = CorrelationContext.Current;
    
    // ✅ INFO: Request start (production-visible)
    _logger.LogInformation(
        "Getting order {OrderId}. CorrelationId: {CorrelationId}",
        id, correlationId);
    
    try
    {
        // ✅ DEBUG: Detailed steps (development only)
        _logger.LogDebug(
            "Querying database for order {OrderId}. CorrelationId: {CorrelationId}",
            id, correlationId);
        
        var order = await _repository.GetByIdAsync(id);
        
        if (order == null)
        {
            // ✅ WARNING: Expected but notable condition
            _logger.LogWarning(
                "Order {OrderId} not found. CorrelationId: {CorrelationId}",
                id, correlationId);
            return NotFound();
        }
        
        // ✅ INFO: Successful completion (production-visible)
        _logger.LogInformation(
            "Order {OrderId} retrieved successfully. CorrelationId: {CorrelationId}",
            id, correlationId);
        
        return Ok(order);
    }
    catch (Exception ex)
    {
        // ✅ ERROR: Always log exceptions with correlation-ID
        _logger.LogError(ex,
            "Error retrieving order {OrderId}. CorrelationId: {CorrelationId}",
            id, correlationId);
        return StatusCode(500);
    }
}
```

**Pattern 2: External Service Calls**
```csharp
public async Task<PaymentResult> ProcessPayment(PaymentRequest request)
{
    var correlationId = CorrelationContext.Current;
    
    // ✅ INFO: External call start (production-visible)
    _logger.LogInformation(
        "Calling payment service. Amount: {Amount}, Currency: {Currency}. CorrelationId: {CorrelationId}",
        request.Amount, request.Currency, correlationId);
    
    var stopwatch = Stopwatch.StartNew();
    
    try
    {
        var response = await _paymentClient.ProcessAsync(request);
        stopwatch.Stop();
        
        // ✅ INFO: Success with duration (production-visible)
        _logger.LogInformation(
            "Payment service call completed. Status: {Status}, Duration: {Duration}ms. CorrelationId: {CorrelationId}",
            response.Status, stopwatch.ElapsedMilliseconds, correlationId);
        
        return response;
    }
    catch (Exception ex)
    {
        stopwatch.Stop();
        
        // ✅ ERROR: Failure with context (production-visible)
        _logger.LogError(ex,
            "Payment service call failed. Duration: {Duration}ms. CorrelationId: {CorrelationId}",
            stopwatch.ElapsedMilliseconds, correlationId);
        throw;
    }
}
```

**Pattern 3: Conditional Debug Logging**
```csharp
public async Task ProcessItems(List<Item> items)
{
    var correlationId = CorrelationContext.Current;
    
    // ✅ INFO: Operation start (production-visible)
    _logger.LogInformation(
        "Processing {Count} items. CorrelationId: {CorrelationId}",
        items.Count, correlationId);
    
    for (int i = 0; i < items.Count; i++)
    {
        // ✅ DEBUG: Detailed per-item info (development only)
        _logger.LogDebug(
            "Processing item {Index}/{Total}: {ItemId}. CorrelationId: {CorrelationId}",
            i + 1, items.Count, items[i].Id, correlationId);
        
        await ProcessItem(items[i]);
    }
    
    // ✅ INFO: Operation completion (production-visible)
    _logger.LogInformation(
        "Processed {Count} items successfully. CorrelationId: {CorrelationId}",
        items.Count, correlationId);
}
```

### Key Principles

1. **Correlation-ID Always**: Every log should include correlation-ID (automatically via enricher/scope)
2. **Structured Properties**: Use structured logging with named properties, not string interpolation
3. **Context Matters**: Include relevant context (user ID, operation, IDs) but not sensitive data
4. **Level Appropriately**: Use DEBUG for detailed troubleshooting, INFO for production visibility
5. **Performance Aware**: Don't log in tight loops; summarize instead
6. **Error Context**: Always include correlation-ID and relevant context in error logs

## Environment Variables

Set service name via environment variable to reduce code:

**Linux/Mac:**
```bash
export TRACEABILITY_SERVICENAME="UserService"
```

**Windows PowerShell:**
```powershell
$env:TRACEABILITY_SERVICENAME="UserService"
```

Then use:
```csharp
// Source comes automatically from TRACEABILITY_SERVICENAME
builder.Services.AddTraceability();
```

## Common Patterns

### Pattern 1: Reading Correlation-ID from Request

The middleware automatically:
1. Reads `X-Correlation-Id` from incoming request headers
2. If present, uses that value
3. If missing, generates new GUID (32 chars, no hyphens)
4. Sets `CorrelationContext.Current`
5. Adds to response headers

**No code needed** - this happens automatically!

### Pattern 2: Preserving Across Async Operations

```csharp
var correlationId = CorrelationContext.Current; // "abc123"
await SomeAsyncMethod();
var sameId = CorrelationContext.Current; // Still "abc123" - preserved!
```

### Pattern 3: Isolated Contexts

```csharp
var mainId = CorrelationContext.Current; // "id1"

await Task.Run(async () =>
{
    // New isolated context - no correlation-ID unless set
    if (!CorrelationContext.HasValue)
    {
        CorrelationContext.Current = "id2";
    }
});
```

### Pattern 4: Manual Propagation

```csharp
// Set correlation-ID from external source
CorrelationContext.Current = externalCorrelationId;

// Now all operations use this correlation-ID
await ProcessRequest();
```

## Key Features

1. **Zero Configuration**: Works out of the box with minimal setup
2. **Async-Safe**: Uses `AsyncLocal<string>` to preserve correlation-ID across async/await
3. **Automatic Propagation**: HttpClient automatically includes correlation-ID in headers
4. **Logging Integration**: Works with Serilog and Microsoft.Extensions.Logging
5. **Framework Support**: Works with .NET 8 and .NET Framework 4.8
6. **Header-Based**: Uses `X-Correlation-Id` header for HTTP propagation

## Important Notes

- **GUID Format**: Correlation-IDs are 32-character GUIDs without hyphens
- **Never Overwrites**: If correlation-ID exists (from headers), it's preserved
- **Independent from OpenTelemetry**: Correlation-ID is separate from `Activity.TraceId` - both can coexist
- **Thread-Safe**: All operations are thread-safe and async-safe

## Examples

See complete examples in:
- **ASP.NET Core**: `samples/Sample.WebApi.Net8/`
- **Console App**: `samples/Sample.Console.Net8/`
- **.NET Framework**: `samples/Sample.Console.NetFramework/`

## Troubleshooting

**Correlation-ID not appearing in logs?**
- Ensure `CorrelationIdEnricher` is registered (Serilog) or `CorrelationIdScopeProvider` is registered (ILogger)

**HttpClient not including correlation-ID?**
- Ensure you're using `IHttpClientFactory.CreateClient()` (not `new HttpClient()`)
- Verify `AddTraceability()` was called in service configuration

**Correlation-ID not preserved across async?**
- This shouldn't happen - the package uses `AsyncLocal<string>` which handles this automatically
- Check if you're using `Task.Run()` which creates isolated contexts
