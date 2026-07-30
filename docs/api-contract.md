# API Contract

This document describes the available endpoints for the Meli Prep API.

## Response format

All successful responses follow this format:

```json
{
  "data": {},
  "error": null
}
```

All error responses follow this format:

```json
{
  "data": null,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

Some errors may include additional details:

```json
{
  "data": null,
  "error": {
    "message": "One or more products were not found",
    "code": "PRODUCTS_NOT_FOUND",
    "details": {
      "missingProductIds": ["prod_999"]
    }
  }
}
```

---

## Health

### `GET /health`

Returns the API status.

#### Success response

**Status:** `200 OK`

```json
{
  "data": {
    "status": "ok",
    "service": "meli-prep-api"
  },
  "error": null
}
```

---

## Products

### `GET /api/products`

Returns all products.
Auth required: No

#### Success response

**Status:** `200 OK`

```json
{
  "data": [
    {
      "id": "prod_1",
      "name": "Wireless Mouse",
      "price": 25,
      "stock": 15
    }
  ],
  "error": null
}
```

---

### `GET /api/products/:id`

Returns a product by ID.
Auth required: No

#### Success response

**Status:** `200 OK`

```json
{
  "data": {
    "id": "prod_1",
    "name": "Wireless Mouse",
    "price": 25,
    "stock": 15
  },
  "error": null
}
```

#### Error response

**Status:** `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "Product not found",
    "code": "PRODUCT_NOT_FOUND"
  }
}
```

---

### `POST /api/products`

Creates a new product.
Auth required: Yes
Required role: admin

#### Request body

```json
{
  "name": "Monitor",
  "price": 200,
  "stock": 5
}
```

#### Success response

**Status:** `201 Created`

```json
{
  "data": {
    "id": "prod_123456789",
    "name": "Monitor",
    "price": 200,
    "stock": 5
  },
  "error": null
}
```

#### Error response

**Status:** `400 Bad Request`

```json
{
  "data": null,
  "error": {
    "message": "Invalid request body",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "name",
        "message": "Name must have at least 2 characters"
      }
    ]
  }
}
```

---

### `PUT /api/products/:id`

Updates an existing product.
Auth required: Yes
Required role: admin

#### Request body

```json
{
  "name": "Wireless Mouse Updated",
  "price": 30,
  "stock": 10
}
```



#### Success response

**Status:** `200 OK`

```json
{
  "data": {
    "id": "prod_1",
    "name": "Wireless Mouse Updated",
    "price": 30,
    "stock": 10
  },
  "error": null
}
```

#### Error responses

**Status:** `400 Bad Request`

```json
{
  "data": null,
  "error": {
    "message": "Name, price and stock are required",
    "code": "INVALID_PRODUCT_PAYLOAD"
  }
}
```

**Status:** `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "Product not found",
    "code": "PRODUCT_NOT_FOUND"
  }
}
```

---

### `DELETE /api/products/:id`

Deletes an existing product.
Auth required: Yes
Required role: admin

#### Success response

**Status:** `200 OK`

```json
{
  "data": {
    "id": "prod_1",
    "name": "Wireless Mouse",
    "price": 25,
    "stock": 15
  },
  "error": null
}
```

#### Error response

**Status:** `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "Product not found",
    "code": "PRODUCT_NOT_FOUND"
  }
}
```

---

## Users

### `GET /api/users`

Returns all users.

#### Success response

**Status:** `200 OK`

```json
{
  "data": [
    {
      "id": "user_1",
      "name": "Laura Gómez",
      "email": "laura@example.com"
    }
  ],
  "error": null
}
```

---

### `GET /api/users/:id`

Returns a public user by ID.

#### Success response

**Status:** `200 OK`

```json
{
  "data": {
    "id": "user_1",
    "name": "Laura Gómez",
    "email": "laura@example.com"
  },
  "error": null
}
```

---

## Orders

## `GET /api/orders`

Returns all orders.

Auth required: Yes  
Required role: admin

### Success response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "order_123456789",
      "userId": "user_1",
      "productIds": ["prod_1", "prod_3"],
      "status": "pending",
      "total": 70
    }
  ],
  "error": null
}
```

---

## `GET /api/orders/my-orders`

Returns the authenticated user's orders.

Auth required: Yes

### Success response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "order_123456789",
      "userId": "user_1",
      "productIds": ["prod_1", "prod_3"],
      "status": "pending",
      "total": 70
    }
  ],
  "error": null
}
```
## `GET /api/orders/:id`

Returns an order by ID if the authenticated user is the owner or an admin.

Auth required: Yes
Access: owner or admin

### Success response

Status: `200 OK`

```json
{
  "data": {
    "id": "order_123456789",
    "userId": "user_1",
    "productIds": ["prod_1", "prod_3"],
    "status": "pending",
    "total": 70
  },
  "error": null
}
```

### Success response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "order_123456789",
      "userId": "user_1",
      "productIds": ["prod_1", "prod_3"],
      "status": "pending",
      "total": 70
    }
  ],
  "error": null
}
```

### Error response

Status: `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "Order not found",
    "code": "ORDER_NOT_FOUND"
  }
}
```

Status: `403 Forbidden`

```json
{
  "data": null,
  "error": {
    "message": "You do not have permission to access this order",
    "code": "FORBIDDEN"
  }
}
```

---

### `POST /api/orders`

Creates a new order for the authenticated user.

Auth required: Ye

#### Request body

```json
{
  "productIds": ["prod_1", "prod_3"]
}
```
The ```userId``` is taken from the authenticated user. Clients cannot assign orders to arbitrary users.

#### Success response

**Status:** `201 Created`

```json
{
  "data": {
    "id": "order_123456789",
    "userId": "user_1",
    "productIds": ["prod_1", "prod_3"],
    "status": "pending",
    "total": 70
  },
  "error": null
}
```

#### Error responses

**Status:** `401 Unauthorized`

```json
{
  "data": null,
  "error": {
    "message": "Authentication token is required",
    "code": "AUTH_TOKEN_REQUIRED"
  }
}
```
**Status:** `403 Forbidden`

```json
{
  "data": null,
  "error": {
    "message": "You do not have permission to perform this action",
    "code": "FORBIDDEN"
  }
}
```
**Status:** `400 Bad Request`

```json
{
  "data": null,
  "error": {
    "message": "Invalid request body",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "productIds",
        "message": "At least one product is required"
      }
    ]
  }
}
```

**Status:** `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND"
  }
}
```

**Status:** `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "One or more products were not found",
    "code": "PRODUCTS_NOT_FOUND",
    "details": {
      "missingProductIds": ["prod_999"]
    }
  }
}
```

---

## Auth

### `POST /api/auth/register`

Creates a new user account.

#### Request body

```json
{
  "name": "Agustina",
  "email": "agus@example.com",
  "password": "supersecret"
}
```

#### Success response

**Status:** `201 Created`

```json
{
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "Agustina",
      "email": "agus@example.com"
    }
  },
  "error": null
}
```

#### Error responses

**Status:** `400 Bad Request`

```json
{
  "data": null,
  "error": {
    "message": "Invalid request body",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "password",
        "message": "Password must have at least 8 characters"
      }
    ]
  }
}
```

**Status:** `409 Conflict`

```json
{
  "data": null,
  "error": {
    "message": "Email is already in use",
    "code": "EMAIL_ALREADY_IN_USE"
  }
}
```

### Status: `401 Unauthorized`

```json
{
  "data": null,
  "error": {
    "message": "Authentication token is required",
    "code": "AUTH_TOKEN_REQUIRED"
  }
}
```

### Status: `403 Forbidden`
```json
{
  "data": null,
  "error": {
    "message": "You do not have permission to perform this action",
    "code": "FORBIDDEN"
  }
}
```
---

### `POST /api/auth/login`

Authenticates an existing user.

#### Request body

```json
{
  "email": "agus@example.com",
  "password": "supersecret"
}
```

#### Success response

**Status:** `200 OK`

```json
{
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "Agustina",
      "email": "agus@example.com"
    }
  },
  "error": null
}
```

#### Error responses

**Status:** `400 Bad Request`

```json
{
  "data": null,
  "error": {
    "message": "Invalid request body",
    "code": "VALIDATION_ERROR"
  }
}
```

**Status:** `401 Unauthorized`

```json
{
  "data": null,
  "error": {
    "message": "Invalid email or password",
    "code": "INVALID_CREDENTIALS"
  }
}
```

---

## Global errors

### Unknown route

**Status:** `404 Not Found`

```json
{
  "data": null,
  "error": {
    "message": "Route GET /api/unknown not found",
    "code": "ROUTE_NOT_FOUND"
  }
}
```

### Invalid JSON

**Status:** `400 Bad Request`

```json
{
  "data": null,
  "error": {
    "message": "The request body contains invalid JSON",
    "code": "INVALID_JSON"
  }
}
```

### Unexpected server error

**Status:** `500 Internal Server Error`

```json
{
  "data": null,
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

---

## Configuration

The API requires the following environment variables:

```txt
NODE_ENV
PORT
PAYMENT_PROVIDER_API_KEY
```

---

## Data exposure policy

API responses should only expose public fields required by clients.

User responses **must expose**:

```txt
id
name
email
```

User responses **must not expose**:

```txt
passwordHash
internalNotes
security-related fields
```

### Register success

```
{
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "Agustina",
      "email": "agus@example.com"
    },
    "accessToken": "jwt_access_token"
  },
  "error": null
}
```

### Login success

```
{
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "Agustina",
      "email": "agus@example.com"
    },
    "accessToken": "jwt_access_token"
  },
  "error": null
}
```

## GET /api/auth/me

Returns the currently authenticated user.

Requires an Authorization header:

```txt
Authorization: Bearer <accessToken>
```

### Success response
Status: 200 OK

```
{
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "Agustina",
      "email": "agus@example.com"
    }
  },
  "error": null
}
```

### Error response
Status: 401 Unauthorized

```
{
  "data": null,
  "error": {
    "message": "Authentication token is required",
    "code": "AUTH_TOKEN_REQUIRED"
  }
}
```

Status: 401 Unauthorized

```
{
  "data": null,
  "error": {
    "message": "Authorization header must use Bearer scheme",
    "code": "INVALID_AUTH_HEADER"
  }
}
```

Status: 401 Unauthorized

```
{
  "data": null,
  "error": {
    "message": "Invalid or expired authentication token",
    "code": "INVALID_AUTH_TOKEN"
  }
}
```