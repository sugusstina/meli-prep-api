# Meli Prep API

Node.js REST API practice project focused on backend fundamentals, REST APIs, error handling, security and testing.

## Tech stack

- Node.js
- Express
- JavaScript ES Modules
- CORS
- dotenv
- nodemon

## Project structure

```txt
src/
  app.js
  server.js
  data/
  routes/
  controllers/
  services/
  middlewares/
  errors/
  utils/
docs/
  api-contract.md
```

## Architecture

The API follows a simple layered architecture:

```
Request
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
Data
  ↓
Response
```

### Routes

Routes define the available HTTP methods and paths.

Example:

```js
router.get("/:id", getProductById);
```

### Controllers

Controllers handle HTTP concerns:

- request params
- request body
- status codes
- calling services
- passing errors to the global error handler

### Services

Services handle business logic and data operations.

### Data

For now, data is stored in in-memory arrays.

This means changes are lost when the server restarts.

## Available endpoints

### Health

```
GET /health
```

### Products

```
GET    /api/products          public
GET    /api/products/:id      public
POST   /api/products          admin only
PUT    /api/products/:id      admin only
DELETE /api/products/:id      admin only
```

### Users

```txt
GET /api/users
GET /api/users/:id
```

### Orders

```
GET  /api/orders              admin only
GET  /api/orders/my-orders    authenticated user
GET  /api/orders/:id          owner or admin
POST /api/orders              authenticated user
```

### Auth

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Response format

Successful responses:

```json
{
  "data": {},
  "error": null
}
```

Error responses:

```json
{
  "data": null,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Run locally

```bash
npm install
npm run dev
```

The server runs on `http://localhost:3000`.

## API contract

See [`docs/api-contract.md`](docs/api-contract.md).

## Current features

- Express server setup
- Health endpoint
- Products CRUD
- Users list
- Orders creation
- In-memory data
- Centralized error handling
- Consistent JSON response format
- Product request validation with Zod
- Order request validation with Zod
- Environment variable validation with Zod
- `.env.example` documentation
- Public serializers for API responses
- Sensitive user fields excluded from responses
- Manual security review documentation
- Dependency audit script
- User registration
- User login
- Password hashing with bcrypt
- Auth request validation with Zod
- JWT access token generation
- Protected auth profile endpoint
- Bearer token authentication middleware
- Role-based authorization
- Admin-only product mutations
- Order ownership checks
- Customer users can access only their own orders
- Admin users can access all orders
- Login rate limiting
- `429 Too Many Requests` response for repeated login attempts
- Request ID middleware
- `X-Request-Id` response header
- Error responses include `requestId`
- Basic structured error logging
- Sensitive header redaction in logs
- Automated API tests with Vitest and Supertest
- Automated authorization tests for product mutations

## Next improvements

- User request validation for future endpoints
- Authentication and authorization
- Security middleware
- Unit tests
- Integration tests
- API tests with Supertest

---

## Environment variables

Create a `.env` file based on `.env.example`.

Required variables:

```txt
NODE_ENV=development
PORT=3000
PAYMENT_PROVIDER_API_KEY=
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5173
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=5

The .env file should not be committed to the repository.

Environment variables are validated on application startup. If a required variable is missing or invalid, the server will not start.


```
## Security notes

This project currently includes basic security-focused practices:

- Request body validation with Zod
- Centralized error handling
- Generic responses for unexpected server errors
- Environment variable validation on startup
- `.env.example` for required configuration
- `.env` ignored by Git
- Public serializers to avoid exposing internal fields
- Manual security review documented in `docs/security-review.md`
- Passwords are hashed with bcrypt before being stored
- Login returns a generic invalid credentials error
- Auth responses do not expose password hashes
- JWT secrets are stored in environment variables
- Access tokens expire based on `JWT_EXPIRES_IN`
- Protected routes require an `Authorization: Bearer <token>` header
- Product write operations require an authenticated admin user
- Customer users cannot create, update or delete products
- Register does not accept role assignment from the client
- Order creation uses the authenticated user's ID from the token
- Clients cannot assign `userId` when creating orders
- Order access is restricted to the owner or an admin
- Helmet is used to set security-related HTTP headers
- Express `X-Powered-By` header is disabled
- CORS is restricted to the configured frontend origin
- Requests without an `Origin` header are allowed for non-browser clients
- Allowed CORS headers include `Content-Type` and `Authorization`
- Login attempts are rate limited to reduce brute-force risk
- The login limiter is configurable through environment variables
- The current limiter uses in-memory storage for local development
- Unexpected errors return generic messages to clients
- Error responses include request IDs for debugging
- Authorization and Cookie headers are redacted from logs
- Stack traces are not intended to be exposed in production

Current limitations:

- No authentication yet
- No authorization yet
- No database yet
- No automated tests yet
- No rate limiting yet
- No security headers yet

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```


## Product permissions


### Products

```txt
GET    /api/products          public
GET    /api/products/:id      public
POST   /api/products          admin only
PUT    /api/products/:id      admin only
DELETE /api/products/:id      admin only
```

## Order permissions


### Orders

```txt
GET  /api/orders              admin only
GET  /api/orders/my-orders    authenticated user
GET  /api/orders/:id          owner or admin
POST /api/orders              authenticated user
```


## Current features
```
- User registration and login
- Password hashing with bcrypt
- JWT access tokens
- Auth middleware
- Role-based authorization
- Admin-only product mutations
- Order ownership checks
- Public serializers for API responses
- HTTP security headers with Helmet
- `X-Powered-By` disabled
- Restricted CORS configuration with allowed frontend origin
```

## Security hardening

The API currently includes:
```
- Request validation with Zod
- Centralized error handling
- Environment variable validation
- Password hashing with bcrypt
- JWT authentication
- Role-based authorization
- Order ownership checks
- Public serializers for API responses
- HTTP security headers with Helmet
- Restricted CORS configuration
- Login rate limiting
- Request IDs
- Structured error logging
- Sensitive header redaction in logs
```
Current limitations:
```
- Data is stored in memory
- No real database yet
- No refresh token flow
- No token revocation
- No production-grade logger yet
- Rate limiting uses in-memory storage
```

## Testing

The project uses Vitest and Supertest for automated API tests.

Run tests once:

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Current test coverage includes:
```
GET /health
GET /api/products
GET /api/products/:id
Unknown routes
Invalid JSON
Request IDs
X-Powered-By header
```

Current test coverage includes:

```txt
GET /health
GET /api/products
GET /api/products/:id
Unknown routes
Invalid JSON
Request IDs
X-Powered-By header
Auth register
Auth login
Auth /me
JWT access token responses
Auth validation errors
Password hash exposure checks
```

Product authorization:

```txt
POST /api/products admin-only behavior
PUT /api/products/:id admin-only behavior
DELETE /api/products/:id admin-only behavior
401 for missing token
403 for customer users
success for admin users
```