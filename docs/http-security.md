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