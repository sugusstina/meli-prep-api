# HTTP Security

This document summarizes HTTP-level security practices used by the API.

## 1. Security headers

The API uses Helmet to set common security-related HTTP response headers.

Helmet is applied globally in `app.js` through:

```js
app.use(securityHeaders);
```

The middleware is defined in:
```
src/middlewares/security.middleware.js
```

## 2. X-Powered-By

The API disables the default Express X-Powered-By header:
```js
app.disable("x-powered-by");
```

This avoids exposing implementation details such as the framework used by the server.

## 3. Middleware order

Security headers are applied before routes:
```
securityHeaders
cors
express.json
routes
notFoundHandler
errorHandler
```

This helps ensure both successful and error responses include security headers.

## 4. Current limitations

```
CORS is still permissive.
There is no rate limiting yet.
There is no production proxy/TLS setup yet.
There is no persistent session/token revocation strategy yet.
5. Next improvements
Configure stricter CORS.
Add rate limiting to auth endpoints.
Review error responses.
Review production deployment settings.
```
## 5. Next improvements
```
Configure stricter CORS.
Add rate limiting to auth endpoints.
Review error responses.
Review production deployment settings.
```

## 6. CORS

The API uses a restricted CORS configuration.

Allowed origin:

```txt
FRONTEND_URL
```
The value is configured through environment variables.

Requests with no Origin header are allowed so tools like curl, Postman and server-to-server requests can still access the API.

Requests from origins not included in the allowlist are rejected with:

```CORS_ORIGIN_NOT_ALLOWED```

Current allowed methods:
```
GET
POST
PUT
DELETE
OPTIONS
```
Current allowed headers:
```
Content-Type
Authorization
```
The API currently uses bearer tokens in the Authorization header and does not require cookie credentials.

## 7. Login rate limiting

The API applies rate limiting to:

```txt
POST /api/auth/login
```

Current configuration:
```
LOGIN_RATE_LIMIT_WINDOW_MS
LOGIN_RATE_LIMIT_MAX
```
If the limit is exceeded, the API returns:
```
429 Too Many Requests
TOO_MANY_LOGIN_ATTEMPTS
```
The rate limiter is applied before request body validation so malformed login attempts are also limited.

Current implementation uses the default in-memory store, which is acceptable for local development.

For production, a shared store such as Redis would be preferred when running multiple server instances.

## 8. Error hardening and request IDs

The API attaches a request ID to every request.

The request ID is available in:

```txt
X-Request-Id response header
error.requestId response body
server logs
```

If the client sends an ```X-Request-Id``` header, the API reuses it.

Otherwise, the API generates a new ```UUID```.

Error responses include a request ID so client-side errors can be correlated with server logs.

Unexpected errors return a generic response:
```js
{
  "data": null,
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_SERVER_ERROR",
    "requestId": "request-id"
  }
}
```
Sensitive headers such as Authorization and Cookie are redacted from logs.

Debug information such as stack traces should only be exposed in development mode.

## 9. Week 4 Security QA

Manual QA was documented in:

```txt
docs/week-4-security-qa.md
```

## The QA covers:
```
Helmet headers
CORS allowlist
Login rate limiting
Auth errors
Role permissions
Order ownership
Request IDs
Error hardening
Sensitive log redaction
Dependency audit
```