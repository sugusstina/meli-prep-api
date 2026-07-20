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

```
GET /api/users
```

### Orders

```
GET  /api/orders
POST /api/orders
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

## Next improvements

- Order request validation with Zod
- User request validation for future endpoints
- Authentication and authorization
- Security middleware
- Unit tests
- Integration tests
- API tests with Supertest

---


```
