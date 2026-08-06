# Security Review

This document summarizes the current security considerations for the Meli Prep API.

## 1. Input Validation

The API validates request bodies using Zod schemas before requests reach the controllers.

Current validated endpoints:

```
POST /api/products
PUT  /api/products/:id
POST /api/orders
```

### Product validation rules

- `name` → string, trimmed, at least 2 characters
- `price` → number, greater than 0
- `stock` → number, integer, 0 or greater

### Order validation rules

- `userId` → string, trimmed, must start with `user_`
- `productIds` → non-empty array of strings, each trimmed and starting with `prod_`

### Reasoning

Request validation prevents controllers and services from processing malformed payloads.
The API should not trust clients to always send correct data.

---

## 2. Business Validation

Some validation cannot be handled only by schemas.

Examples:

- Does `user_999` actually exist?
- Does `prod_999` actually exist?
- What is the total price of an order?

These checks are handled in the service layer.

### Current examples

- `orders.service.js` checks whether the user exists.
- `orders.service.js` checks whether all products exist.
- `orders.service.js` calculates the order total from real products.

### Reasoning

Schema validation checks the shape of the request.
Business validation checks whether the operation makes sense.

---

## 3. Environment Variables

The API uses environment variables for configuration.

Required variables:

- `NODE_ENV`
- `PORT`
- `PAYMENT_PROVIDER_API_KEY`

The real `.env` file is ignored by Git and should not be committed.
The `.env.example` file is committed as a safe template.

### Reasoning

Secrets and environment-specific configuration should not be hardcoded in source code.
The app validates environment variables on startup and exits if required configuration is missing or invalid.

---

## 4. Sensitive Data Exposure

The API avoids returning internal user objects directly.

Internal users may contain fields such as:

- `passwordHash`
- `internalNotes`
- `role`
- `createdAt`

Public user responses only expose:

- `id`
- `name`
- `email`

This is handled through serializers.

### Current serializers

- `user.serializer.js`
- `product.serializer.js`
- `order.serializer.js`

### Reasoning

API responses should explicitly expose only the fields required by clients.
Internal models should not be returned directly.

---

## 5. Error Handling

The API uses centralized error handling.

Known errors use `AppError`.
Unknown errors return a generic response:

```json
{
  "data": null,
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

### Reasoning

Unexpected errors should not expose stack traces, file paths, local machine paths, or implementation details to API clients.
Detailed errors should stay in server logs.

---

## 6. Current Limitations

The API is still a practice project and has some intentional limitations:

- Data is stored in memory.
- There is no real database yet.
- There is no authentication yet.
- There is no authorization yet.
- Passwords are mock fields only.
- There are no automated tests yet.
- There is no rate limiting yet.
- There is no production logging strategy yet.

---

## 7. Next Security Improvements

Possible next steps:

- Add authentication.
- Hash passwords with bcrypt.
- Add authorization by role.
- Add rate limiting to sensitive endpoints.
- Add Helmet security headers.
- Add stricter CORS configuration.
- Add automated tests for validation and error cases.
- Add dependency audit checks.


## 8. Authentication

### Supported Auth Endpoints

```txt
POST /api/auth/register
POST /api/auth/login
```

---

### Password Handling

- **Passwords are never stored in plaintext.**
- All stored passwords are hashed using bcrypt.

#### Registration Flow

1. **Receive**: Plaintext password from the user.
2. **Hashing**: Hash the password using bcrypt.
3. **Storage**: Store the resulting hash as `passwordHash` internally.

<details>
<summary>Registration Password Processing (flow diagram)</summary>

```
plain password
      ↓
 bcrypt hash
      ↓
passwordHash stored internally
```
</details>

---

#### Login Flow

1. **User provides** a login password.
2. **Verification**: Use `bcrypt.compare` to check the password against the stored hash.

<details>
<summary>Login Password Verification (flow diagram)</summary>

```
plain password from request
           ↓
bcrypt.compare(password, stored passwordHash)
           ↓
   valid or invalid credentials
```
</details>

---

### Error Handling

- API always returns a generic error, `INVALID_CREDENTIALS`, for both unknown emails and incorrect passwords.

```json
{
  "data": null,
  "error": {
    "message": "Invalid email or password",
    "code": "INVALID_CREDENTIALS"
  }
}
```

**Reason:**  
This avoids leaking information about whether a specific email exists.

## 9. Token-based authentication

The API uses JWT access tokens for authenticated requests.

Tokens are generated after successful register/login.

The token payload currently includes:

```txt
sub
email
role
```
The token payload must not include:
```
password
passwordHash
internalNotes
secrets
```
Protected routes require:

Authorization: ```Bearer <accessToken>```

The auth middleware verifies the token signature and expiration before allowing access.

If the token is missing, malformed, invalid, or expired, the API returns ```401 Unauthorized```.

## 10. Authorization

The API now supports role-based authorization.

Current roles:

```txt
customer
admin
```
Current protected operations:
```
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```
These operations require:
```
Authenticated user
Role: admin

Authentication and authorization are handled separately:

authMiddleware
  ↓
verifies the JWT and sets req.user

requireRole("admin")
  ↓
checks whether req.user.role is allowed

If a request has no valid token, the API returns:

401 Unauthorized

If a request has a valid token but insufficient permissions, the API returns:

403 Forbidden
```

## 11. Resource ownership

The API now enforces ownership checks for orders.

Rules:

```txt
Customers can create orders only for themselves.
Customers can view only their own orders.
Admins can view all orders.
Admins can view any order by ID.
```

Order creation does not accept ```userId``` from the client.

Instead, the API uses:

```req.user.id```

This prevents authenticated customers from creating orders on behalf of another user.

Order access uses both role and ownership:
```
admin → can access any order
owner → can access their own order
other customer → forbidden
```

## 12. HTTP security headers

The API uses Helmet to configure security-related HTTP response headers.

Helmet is applied globally before routes.

The API also disables the Express `X-Powered-By` header:

```js
app.disable("x-powered-by");
```

## 13. CORS

The API uses a restricted ```CORS``` configuration.

Allowed origins are configured through environment variables.

Current setting:

```txt
FRONTEND_URL
```

Requests without an Origin header are allowed to support curl, Postman and server-to-server requests.

Requests from origins outside the allowlist are rejected with:
```
CORS_ORIGIN_NOT_ALLOWED
```
```CORS``` is not used as an authentication or authorization mechanism.

It only controls whether browsers allow frontend JavaScript from another origin to read API responses.

## 14. Login rate limiting

The API applies rate limiting to the login endpoint:

```txt
POST /api/auth/login
```
This helps reduce brute-force and password guessing attempts.

Current behavior:
```
Too many login attempts
  ↓
429 Too Many Requests
  ↓
TOO_MANY_LOGIN_ATTEMPTS
```
The limiter is configured through environment variables:
```
LOGIN_RATE_LIMIT_WINDOW_MS
LOGIN_RATE_LIMIT_MAX
```
The limiter currently uses in-memory storage, which is acceptable for local development.

Production improvements:
```
Use Redis or another shared store.
Add monitoring for repeated failed login attempts.
Consider additional protections for credential stuffing.
```