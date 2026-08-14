# Week 5 Testing QA

This document summarizes the automated testing QA performed during Week 5.

## 1. Test tools

The project uses:

```txt
Vitest
Supertest
```

```Vitest``` is used as the test runner.

```Supertest``` is used to send HTTP requests to the Express app during integration tests.

The tests import the Express app directly:

```js
import app from "../../src/app.js";
```

They do not import ```server.js```, so tests do not open a real network port.

## 2. Test commands

Run all tests once:

```
npm test
```

Run tests in watch mode:
```
npm run test:watch
```

## 3. Test structure

```
tests/
  setup/
    env.js
  helpers/
    auth.js
  integration/
    health.test.js
    products-public.test.js
    errors.test.js
    auth.test.js
    products-auth.test.js
    orders-auth.test.js
```

## 4. Environment setup

Tests load environment variables through:

```js
tests/setup/env.js
```

The test setup configures:
```
NODE_ENV=test
LOGIN_RATE_LIMIT_MAX=1000
```
This avoids test failures caused by login rate limiting while still keeping the limiter active in development.

## 5. Health tests

Covered behavior:

```
GET /health returns status ok.
GET /health includes X-Request-Id.
GET /health reuses incoming X-Request-Id.
GET /health does not expose X-Powered-By.
```

## 6. Public product tests

Covered behavior:

```
GET /api/products returns products.
GET /api/products/:id returns a product by ID.
GET /api/products/:id returns PRODUCT_NOT_FOUND for unknown products.
```

## 7. Global error tests

Covered behavior:

```
Unknown routes return ROUTE_NOT_FOUND.
Invalid JSON returns INVALID_JSON.
Error responses include requestId.
```

## 8. Auth tests

Covered behavior:

```
POST /api/auth/register creates a user.
POST /api/auth/register returns an access token.
POST /api/auth/register does not expose passwordHash.
POST /api/auth/register rejects duplicated emails.
POST /api/auth/register validates invalid payloads.
POST /api/auth/register rejects role assignment from client.
POST /api/auth/login returns an access token for valid credentials.
POST /api/auth/login returns INVALID_CREDENTIALS for wrong password.
POST /api/auth/login returns INVALID_CREDENTIALS for unknown email.
GET /api/auth/me returns AUTH_TOKEN_REQUIRED without token.
GET /api/auth/me returns INVALID_AUTH_TOKEN with invalid token.
GET /api/auth/me returns the current public user with a valid token.
```

## 9. Product authorization tests

Covered behavior:

```
POST /api/products returns AUTH_TOKEN_REQUIRED without token.
POST /api/products returns FORBIDDEN for customer users.
POST /api/products creates products for admin users.
PUT /api/products/:id returns AUTH_TOKEN_REQUIRED without token.
PUT /api/products/:id returns FORBIDDEN for customer users.
PUT /api/products/:id updates products for admin users.
DELETE /api/products/:id returns AUTH_TOKEN_REQUIRED without token.
DELETE /api/products/:id returns FORBIDDEN for customer users.
DELETE /api/products/:id deletes products for admin users.
```

These tests verify that product mutations require authentication and admin role authorization.

## 10. Order authorization and ownership tests

Covered behavior:
```
POST /api/orders returns AUTH_TOKEN_REQUIRED without token.
POST /api/orders creates an order for the authenticated user.
POST /api/orders rejects userId in the request body.
GET /api/orders returns AUTH_TOKEN_REQUIRED without token.
GET /api/orders returns FORBIDDEN for customer users.
GET /api/orders returns all orders for admin users.
GET /api/orders/my-orders returns AUTH_TOKEN_REQUIRED without token.
GET /api/orders/my-orders returns only the authenticated user's orders.
GET /api/orders/:id returns the order for the owner.
GET /api/orders/:id returns FORBIDDEN for another customer.
GET /api/orders/:id returns the order for an admin.
GET /api/orders/:id returns ORDER_NOT_FOUND for unknown orders.
```

These tests verify role-based access and ownership rules for orders.

## 11. Security behavior covered by tests

The current automated tests cover several security-related behaviors:

```
Sensitive user fields are not exposed.
Register cannot assign admin role from request body.
Missing auth tokens return 401.
Invalid auth tokens return 401.
Customer users cannot mutate products.
Customers cannot access another user's orders.
Clients cannot assign order ownership through userId.
Error responses include requestId.
X-Powered-By is not exposed.
```

## 12. Current limitations

The current test suite does not fully cover:

```
CORS behavior
Helmet header list
Rate limiting threshold behavior
Production-mode error responses
Logger output redaction
Token expiration
Refresh tokens
Database persistence
```

Some of those behaviors were tested manually during Week 4.

They can be automated later.

## 13. Final status

````
Health tests passing.
Public product tests passing.
Global error tests passing.
Auth tests passing.
Product authorization tests passing.
Order ownership tests passing.
Dependency audit checked.
Documentation updated.
```