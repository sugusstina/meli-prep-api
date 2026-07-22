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

## Orders

### `GET /api/orders`

Returns all orders.

#### Success response

**Status:** `200 OK`

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

### `POST /api/orders`

Creates a new order.

#### Request body

```json
{
  "userId": "user_1",
  "productIds": ["prod_1", "prod_3"]
}
```

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

### Configuration

**The API requires the following environment variables:**

```txt
NODE_ENV
PORT
PAYMENT_PROVIDER_API_KEY
```
