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
  integration/
    health.test.js
    products-public.test.js
    errors.test.js
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