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
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Users

```txt
GET /api/users
GET /api/users/:id
```

### Orders

```
GET  /api/orders
POST /api/orders
```

### Auth

```
POST /api/auth/register
POST /api/auth/login
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

Current limitations:

- No authentication yet
- No authorization yet
- No database yet
- No automated tests yet
- No rate limiting yet
- No security headers yet