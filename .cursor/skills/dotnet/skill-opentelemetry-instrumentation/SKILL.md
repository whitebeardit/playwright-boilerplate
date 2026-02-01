---
name: opentelemetry-instrumentation
description: Instruments .NET applications with OpenTelemetry spans following best practices. Use when adding distributed tracing, instrumenting HTTP requests, SOAP calls, database operations, or when implementing observability with OpenTelemetry in .NET Framework 4.8 or .NET 8 applications.
---

# OpenTelemetry Instrumentation

This skill guides you through instrumenting .NET applications with OpenTelemetry spans, following best practices for distributed tracing.

## When to Instrument

**✅ DO Instrument:**
- External service calls (HTTP, SOAP, gRPC)
- Database operations (queries, transactions)
- Critical business operations (order processing, payment flows)
- Long-running operations (file processing, batch jobs)
- Integration points (third-party APIs, message queues)

**❌ DON'T Instrument:**
- Simple property getters/setters
- In-memory operations (dictionary lookups, list operations)
- Trivial calculations
- Operations that complete in <1ms consistently

## Core Concepts

### Activity and ActivitySource

OpenTelemetry uses `Activity` and `ActivitySource` for creating spans:

```csharp
using System.Diagnostics;

// Create ActivitySource (typically one per component/service)
private static readonly ActivitySource ActivitySource = new ActivitySource("MyService");

// Create a span
using (var activity = ActivitySource.StartActivity("operation.name", ActivityKind.Internal))
{
    if (activity != null)
    {
        activity.SetTag("key", "value");
        // Your code here
        activity.SetStatus(ActivityStatusCode.Ok);
    }
}
```

### Activity Kinds

```csharp
ActivityKind.Server    // Incoming HTTP request
ActivityKind.Client     // Outgoing HTTP/SOAP call
ActivityKind.Internal  // Internal operation
ActivityKind.Producer  // Message queue producer
ActivityKind.Consumer  // Message queue consumer
```

## Instrumentation Patterns

### Pattern 1: HTTP Server (ASP.NET)

**ASP.NET Core (.NET 8):**
```csharp
// Middleware automatically creates spans for HTTP requests
// Just configure TracerProvider in Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation() // Automatic HTTP spans
        .AddSource("MyService")          // Your custom spans
        .AddOtlpExporter());
```

**ASP.NET Framework 4.8:**
```csharp
// Global.asax.cs - Application_BeginRequest
protected void Application_BeginRequest(object sender, EventArgs e)
{
    if (!IsOtelEnabled()) return;
    
    var request = HttpContext.Current.Request;
    var activity = TraceabilityHelper.StartSpan(
        $"HTTP {request.HttpMethod} {request.Path}", 
        ActivityKind.Server);
    
    if (activity != null)
    {
        TraceabilityHelper.SetHttpTags(activity, 
            request.HttpMethod, 
            request.Url.ToString(), 
            null);
        HttpContext.Current.Items["OtelRootActivity"] = activity;
    }
}

// Application_EndRequest
protected void Application_EndRequest(object sender, EventArgs e)
{
    if (HttpContext.Current.Items["OtelRootActivity"] is Activity activity)
    {
        var statusCode = HttpContext.Current.Response.StatusCode;
        TraceabilityHelper.SetHttpTags(activity, null, null, statusCode);
        
        if (statusCode >= 400)
            TraceabilityHelper.SetErrorStatus(activity, $"HTTP {statusCode}");
        else
            TraceabilityHelper.SetSuccessStatus(activity);
        
        activity.Dispose();
    }
}
```

### Pattern 2: HTTP Client Calls

```csharp
using (var activity = ActivitySource.StartActivity("http.client.call", ActivityKind.Client))
{
    if (activity != null)
    {
        activity.SetTag("http.method", "GET");
        activity.SetTag("http.url", url);
        activity.SetTag("net.peer.name", new Uri(url).Host);
    }
    
    try
    {
        var response = await httpClient.GetAsync(url);
        activity?.SetTag("http.status_code", (int)response.StatusCode);
        activity?.SetStatus(response.IsSuccessStatusCode ? ActivityStatusCode.Ok : ActivityStatusCode.Error);
        return response;
    }
    catch (Exception ex)
    {
        activity?.RecordException(ex);
        activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
        throw;
    }
}
```

### Pattern 3: SOAP Calls (WCF)

**Factory Pattern (Recommended):**
```csharp
// Create interceptor for automatic SOAP instrumentation
internal class SoapTracingInspector : IClientMessageInspector
{
    private Activity _currentActivity;
    
    public object BeforeSendRequest(ref Message request, IClientChannel channel)
    {
        if (!IsOtelEnabled()) return null;
        
        var operationName = request.Headers.Action?.Split('/').LastOrDefault() ?? "soap.call";
        var endpoint = channel.RemoteAddress?.Uri?.ToString() ?? "unknown";
        
        _currentActivity = TraceabilityHelper.StartSpan(
            $"soap.{operationName}", 
            ActivityKind.Client);
        
        if (_currentActivity != null)
        {
            TraceabilityHelper.SetRpcTags(_currentActivity, "SOAP", endpoint, operationName);
            _currentActivity.SetTag("rpc.system", "soap");
            _currentActivity.SetTag("net.peer.name", channel.RemoteAddress?.Uri?.Host ?? "unknown");
        }
        
        return _currentActivity;
    }
    
    public void AfterReceiveReply(ref Message reply, object correlationState)
    {
        var activity = correlationState as Activity;
        if (activity != null)
        {
            if (reply.IsFault)
            {
                TraceabilityHelper.SetErrorStatus(activity, "SOAP Fault");
            }
            else
            {
                TraceabilityHelper.SetSuccessStatus(activity);
            }
            activity.Dispose();
        }
    }
}

// Add behavior to SOAP client
public class SoapTracingBehavior : IEndpointBehavior
{
    public void ApplyClientBehavior(ServiceEndpoint endpoint, ClientRuntime clientRuntime)
    {
        clientRuntime.ClientMessageInspectors.Add(new SoapTracingInspector());
    }
    // ... other methods empty
}

// In factory method
public static T ObterServico<T>() where T : ICommunicationObject, new()
{
    T cliente = new T();
    
    // Add tracing behavior using reflection (IClientChannel doesn't expose Endpoint)
    if (cliente.State == CommunicationState.Created)
    {
        var endpointProperty = cliente.GetType().GetProperty("Endpoint", 
            BindingFlags.Public | BindingFlags.Instance);
        if (endpointProperty != null)
        {
            var endpoint = endpointProperty.GetValue(cliente) as ServiceEndpoint;
            if (endpoint != null)
            {
                endpoint.EndpointBehaviors.Add(new SoapTracingBehavior());
            }
        }
    }
    
    return cliente;
}
```

### Pattern 4: Database Operations

```csharp
using (var activity = ActivitySource.StartActivity("db.query", ActivityKind.Internal))
{
    activity?.SetTag("db.system", "sqlserver");
    activity?.SetTag("db.name", databaseName);
    activity?.SetTag("db.operation", "SELECT");
    // Note: Sanitize db.statement if contains sensitive data
    
    try
    {
        var result = await connection.QueryAsync<T>(sqlQuery, parameters);
        activity?.SetTag("db.rows_affected", result.Count());
        activity?.SetStatus(ActivityStatusCode.Ok);
        return result;
    }
    catch (Exception ex)
    {
        activity?.RecordException(ex);
        activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
        throw;
    }
}
```

### Pattern 5: Business Operations

```csharp
using (var activity = ActivitySource.StartActivity("order.process", ActivityKind.Internal))
{
    if (activity != null)
    {
        activity.SetTag("order.id", orderId);
        activity.SetTag("order.amount", amount);
    }
    
    try
    {
        // Child spans for sub-operations
        using (var paymentSpan = ActivitySource.StartActivity("payment.process", ActivityKind.Internal))
        {
            await ProcessPayment(orderId, amount);
            paymentSpan?.SetStatus(ActivityStatusCode.Ok);
        }
        
        activity?.SetStatus(ActivityStatusCode.Ok);
    }
    catch (Exception ex)
    {
        activity?.RecordException(ex);
        activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
        throw;
    }
}
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

```csharp
public static class TraceabilityHelper
{
    private static readonly ActivitySource ActivitySource = new ActivitySource("MyService");
    
    public static Activity StartSpan(string name, ActivityKind kind = ActivityKind.Internal)
    {
        if (!IsOtelEnabled()) return null;
        return ActivitySource.StartActivity(name, kind);
    }
    
    public static void SetHttpTags(Activity activity, string method, string url, int? statusCode)
    {
        if (activity == null) return;
        if (method != null) activity.SetTag("http.method", method);
        if (url != null) activity.SetTag("http.url", url);
        if (statusCode.HasValue) activity.SetTag("http.status_code", statusCode.Value);
    }
    
    public static void SetDbTags(Activity activity, string system, string name, string operation)
    {
        if (activity == null) return;
        activity.SetTag("db.system", system);
        activity.SetTag("db.name", name);
        activity.SetTag("db.operation", operation);
    }
    
    public static void SetRpcTags(Activity activity, string system, string service, string method)
    {
        if (activity == null) return;
        activity.SetTag("rpc.system", system);
        activity.SetTag("rpc.service", service);
        activity.SetTag("rpc.method", method);
    }
    
    public static void SetSuccessStatus(Activity activity) => activity?.SetStatus(ActivityStatusCode.Ok);
    public static void SetErrorStatus(Activity activity, string errorMessage = null) => 
        activity?.SetStatus(ActivityStatusCode.Error, errorMessage);
    
    public static void RecordException(Activity activity, Exception ex)
    {
        if (activity == null || ex == null) return;
        // .NET Framework 4.8: use manual tags
        activity.SetTag("error", true);
        activity.SetTag("error.type", ex.GetType().Name);
        activity.SetTag("error.message", ex.Message);
        // .NET 8+: activity.RecordException(ex);
    }
    
    private static bool IsOtelEnabled()
    {
        var env = Environment.GetEnvironmentVariable("OTEL_ENABLED");
        return !string.IsNullOrWhiteSpace(env) && 
               (env.Equals("true", StringComparison.OrdinalIgnoreCase) || env == "1");
    }
}
```

## Configuration

### Bootstrap TracerProvider

**ASP.NET Core (.NET 8):**
```csharp
// Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddSource("MyService")
            .AddSource("IntegracaoBancoVW")
            .AddSource("IntegracaoBancoHonda")
            .AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri(
                    Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT") 
                    ?? "http://localhost:4317");
            });
        
        // Optional: Console exporter for development
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            builder.AddConsoleExporter();
        }
    });
```

**ASP.NET Framework 4.8:**
```csharp
// Global.asax.cs - Application_Start
protected void Application_Start()
{
    if (!IsOtelEnabled()) return;
    
    try
    {
        var builder = Sdk.CreateTracerProviderBuilder()
            .AddSource("MyService");
        
        // Sampler (handle locale-specific decimal: "0,1" → 0.1)
        var samplerArg = ParseSamplerArg(Environment.GetEnvironmentVariable("OTEL_TRACES_SAMPLER_ARG") ?? "1.0");
        builder.SetSampler(new TraceIdRatioBasedSampler(samplerArg));
        
        // OTLP exporter
        var otlpEndpoint = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT");
        if (!string.IsNullOrWhiteSpace(otlpEndpoint) && Uri.TryCreate(otlpEndpoint, UriKind.Absolute, out var uri))
        {
            builder.AddOtlpExporter(options => options.Endpoint = uri);
        }
        
        // Console exporter (dev only)
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            builder.AddConsoleExporter();
        }
        
        builder.Build();
    }
    catch (Exception ex)
    {
        // Never crash the app due to misconfiguration
        System.Diagnostics.Debug.WriteLine($"OpenTelemetry initialization failed: {ex.Message}");
    }
}

private static bool IsOtelEnabled()
{
    var env = Environment.GetEnvironmentVariable("OTEL_ENABLED");
    return !string.IsNullOrWhiteSpace(env) && 
           (env.Equals("true", StringComparison.OrdinalIgnoreCase) || env == "1");
}

private static double ParseSamplerArg(string arg)
{
    if (string.IsNullOrWhiteSpace(arg)) return 1.0;
    arg = arg.Replace(",", "."); // Handle locale-specific decimal
    if (double.TryParse(arg, NumberStyles.Float, CultureInfo.InvariantCulture, out var result))
        return Math.Max(0.0, Math.Min(1.0, result));
    return 1.0;
}
```

## Environment Variables

```bash
# Enable/disable OpenTelemetry
OTEL_ENABLED=true

# OTLP endpoint
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Sampling configuration
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=1.0  # 1.0 = 100%, 0.1 = 10%

# Optional: Sentry integration
Sentry_Key=https://xxx@xxx.ingest.sentry.io/xxx
```

## Best Practices

1. **Feature Flag**: Use `OTEL_ENABLED` to disable without code changes
2. **Never Crash**: Wrap initialization in try/catch - misconfiguration shouldn't bring down the app
3. **Null Checks**: Always check `activity != null` (may be null if disabled, sampled out, or no listener)
4. **Semantic Conventions**: Use standard tag names (`http.*`, `db.*`, `rpc.*`, `error.*`)
5. **Sensitive Data**: Never include passwords, tokens, credit cards, full payloads
6. **Span Hierarchy**: Create logical parent-child relationships (Server → Internal → Client)
7. **Error Handling**: Always record exceptions and set error status
8. **Sampling**: Dev 100% (`SAMPLER_ARG=1.0`), Production 10% or less (`0.1` or `0.01`)

## Common Issues

**Spans Not Appearing:**
- Check `OTEL_ENABLED=true`, OTLP endpoint reachable, sampling rate, ActivitySource registered

**CS0433 (Type exists in multiple versions):**
- Standardize all projects to `System.Diagnostics.DiagnosticSource` version `10.0.0.0`

**CS0246 (OpenTelemetry types not found):**
- Update HintPath to use `netstandard2.0` (not `net462`) for OpenTelemetry packages

**SOAP Interceptor Not Working:**
- Add behavior when `cliente.State == CommunicationState.Created`
- Use reflection to access `Endpoint` property (not `IClientChannel.Endpoint`)
- Create all SOAP clients via factory (not `new SoapPortClient()` directly)

## Key Principles

1. **Instrument at boundaries**: External calls, database operations, critical business flows
2. **Use semantic conventions**: Standard tag names ensure compatibility with observability tools
3. **Fail gracefully**: Misconfiguration should never crash the application
4. **Respect sampling**: Don't instrument operations that complete in <1ms
5. **Protect sensitive data**: Never log passwords, tokens, or full payloads
6. **Create logical hierarchies**: Parent-child spans show operation flow clearly
