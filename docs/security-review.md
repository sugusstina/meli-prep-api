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

The API currently supports:

```txt
POST /api/auth/register
POST /api/auth/login