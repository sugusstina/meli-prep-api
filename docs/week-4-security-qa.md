# Week 4 Security QA

This document summarizes the manual security QA performed during Week 4.

## 1. HTTP security headers

The API uses Helmet globally.

Expected behavior:

```txt
Security-related headers are present.
X-Powered-By is not exposed.
```
Manual checks:
```js
curl -I http://localhost:3000/health
curl -I http://localhost:3000/health | grep -i "x-powered-by"
```
Expected result:
```
Security headers are present.
X-Powered-By does not appear.
```

### 2. CORS

The API uses a restricted CORS allowlist.

Allowed origin:
```
FRONTEND_URL
```

Manual checks:
```js
curl -i http://localhost:3000/health

curl -i http://localhost:3000/health \
  -H "Origin: http://localhost:5173"

curl -i http://localhost:3000/health \
  -H "Origin: http://evil.com"
```

Expected results:
```
Request without Origin → 200 OK
Allowed Origin → 200 OK
Blocked Origin → 403 CORS_ORIGIN_NOT_ALLOWED
```
Preflight check:
```js
curl -i -X OPTIONS http://localhost:3000/api/products \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"
```
Expected result:
```
204 No Content
Access-Control-Allow-Origin present
Access-Control-Allow-Methods present
Access-Control-Allow-Headers present
```

### 3. Login rate limiting

The API applies rate limiting to:
```
POST /api/auth/login
```

Manual check:
```js
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nobody@example.com","password":"wrongpassword"}'
```

Repeat until the limit is exceeded.

Expected result:
```
Initial attempts → 401 INVALID_CREDENTIALS
After limit → 429 TOO_MANY_LOGIN_ATTEMPTS
```

The limiter is applied before request validation so malformed login attempts are also counted.

### 4. Authentication

Protected endpoint:
```
GET /api/auth/me
```
Manual checks:
```js
curl -i http://localhost:3000/api/auth/me

curl -i http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid-token"

curl -i http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VALID_TOKEN"
```

Expected results:
```
No token → 401 AUTH_TOKEN_REQUIRED
Invalid token → 401 INVALID_AUTH_TOKEN
Valid token → 200 OK
```
### 5. Product authorization

Product write operations require admin role:
```
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

Manual checks:
```js
curl -i http://localhost:3000/api/products

curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"QA Product","price":100,"stock":2}'

curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{"name":"QA Product","price":100,"stock":2}'

curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"name":"QA Product","price":100,"stock":2}'
```

Expected results:
```
GET products → 200 OK
POST without token → 401 AUTH_TOKEN_REQUIRED
POST with customer → 403 FORBIDDEN
POST with admin → 201 Created
```

### 6. Order ownership

Order access is restricted by role and ownership.

Rules:
```
Customer can create orders for themselves.
Customer can see their own orders.
Customer cannot see another customer's orders.
Admin can see all orders.
Admin can see any order by ID.
```
Manual checks:
```js
curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{"productIds":["prod_1","prod_3"]}'

curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{"userId":"user_999","productIds":["prod_1"]}'

curl -i http://localhost:3000/api/orders/my-orders \
  -H "Authorization: Bearer CUSTOMER_TOKEN"

curl -i http://localhost:3000/api/orders/ORDER_ID \
  -H "Authorization: Bearer OTHER_CUSTOMER_TOKEN"

curl -i http://localhost:3000/api/orders/ORDER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Expected results:
```
Create order as customer → 201 Created
Create order with userId in body → 400 VALIDATION_ERROR
My orders → 200 OK
Other customer accessing order → 403 FORBIDDEN
Admin accessing order → 200 OK
```

### 7. Request IDs and error hardening

Every response should include:

```X-Request-Id```

Error responses should include:

```error.requestId```

Manual checks:
```js
curl -i http://localhost:3000/health

curl -i http://localhost:3000/health \
  -H "X-Request-Id: qa-request-123"

curl -i http://localhost:3000/api/not-real
```

Expected results:
```
X-Request-Id is present.
Incoming X-Request-Id is reused.
Errors include requestId.
```

### 8. Invalid JSON

Manual check:
```js
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor"'
```
Expected result:
```
400 INVALID_JSON
requestId present
```

### 9. Sensitive logging

Logs should redact sensitive headers:
```
Authorization
Cookie
```
Expected result in logs:
```
authorization: [REDACTED]
cookie: [REDACTED]
```

### 10. Dependency audit

Manual check:

```npm audit```

Expected result:
```
found 0 vulnerabilities
Final status
HTTP security headers checked.
CORS restrictions checked.
Login rate limiting checked.
Authentication checked.
Role-based authorization checked.
Order ownership checked.
Request IDs checked.
Error hardening checked.
Dependency audit checked.
```