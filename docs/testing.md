# Testing

This document summarizes the current automated testing setup.

## 1. Tools

The project uses:

```txt
Vitest
Supertest
```
```Vitest``` is used as the test runner.

```Supertest``` is used to send HTTP requests to the Express app during tests.

## 2. Test commands

Run all tests once:
```bash
npm test
```
Run tests in watch mode:
```bash
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
    products-auth.test.js
    errors.test.js
    auth.test.js
    orders-auth.test.js
```

## 4. Environment setup

Tests load environment variables through:

```bash
tests/setup/env.js
```
This file imports:
```
import "dotenv/config";
```

This is required because the app validates environment variables on startup.

## 5. Current tested behavior
```
GET /health returns status ok.
GET /health includes X-Request-Id.
GET /health reuses incoming X-Request-Id.
GET /health does not expose X-Powered-By.
GET /api/products returns products.
GET /api/products/:id returns a product.
GET /api/products/:id returns PRODUCT_NOT_FOUND for unknown products.
Unknown routes return ROUTE_NOT_FOUND.
Invalid JSON returns INVALID_JSON.
```

## 6. Testing strategy

The tests import the Express app directly:
```
import app from "../../src/app.js";
```
They do not import server.js.

This avoids opening a real network port during tests.

## 7. Next test areas
```
Auth register/login
JWT protected routes
Admin-only products
Order ownership
Rate limiting
CORS
Error hardening
```

## Auth tests

Current auth test coverage includes:

```txt
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

## Product authorization tests

Current product authorization test coverage includes:

```txt
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

## Order authorization and ownership tests

Current order authorization test coverage includes:

```txt
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