# Postman

Postman is used as the manual API client for the Meli Prep API.

Automated regression testing remains handled by Vitest and Supertest.

---

## Local environment

Create a Postman environment named **Meli Prep Local**.

### Variables

- `baseUrl`
- `customerEmail`
- `customerPassword`
- `customerAccessToken`
- `adminEmail`
- `adminPassword`
- `adminAccessToken`
- `orderId`

### Local base URL

```txt
http://localhost:3000
```

Access tokens are populated automatically by login requests and folder pre-request scripts.

---

## Collection

Collection name: **Meli Prep API**

### Suggested structure

```txt
Auth/
  Login Customer
  Login Admin

Public/
  Get Products
  Get Product By ID

Customer/
  Get Me
  My Orders
  Create Order
  Get Order By ID
  Cancel Order

Admin/
  Get All Orders
  Change Order Status
```

---

## Authentication

The **Customer** folder uses Bearer authentication with:

```txt
{{customerAccessToken}}
```

The **Admin** folder uses Bearer authentication with:

```txt
{{adminAccessToken}}
```

Requests inside those folders inherit authentication from their parent.

### Login automation

Customer login stores the returned JWT in `customerAccessToken`.

Admin login stores the returned JWT in `adminAccessToken`.

The **Customer** and **Admin** folders also use pre-request scripts to check whether their access token exists and is still valid.

If the token is missing or expired, Postman automatically sends a login request and stores the new access token before the protected request runs.

The JWT expiration field is used only to decide whether a fresh login is needed.

JWT signature verification remains the responsibility of the API.

---

## Testing strategy

Postman is intended for **manual and exploratory** API testing.

Vitest and Supertest remain the source of truth for automated regression testing.

Run the complete automated test suite with:

```bash
npm test
```

---

## Order workflow

The **Customer** folder contains requests for the authenticated customer order flow:

- Create Order
- Get Order By ID
- My Orders
- Cancel Order

The **Create Order** request stores the returned order ID in the `orderId` environment variable.

Other requests can reuse it with `{{orderId}}`.

### Example requests

```http
GET {{baseUrl}}/api/orders/{{orderId}}

PATCH {{baseUrl}}/api/orders/{{orderId}}/cancel
```

### Admin requests

The **Admin** folder includes:

```http
GET {{baseUrl}}/api/orders

PATCH {{baseUrl}}/api/orders/{{orderId}}/status
```

Admin status updates use the `adminAccessToken` inherited from the Admin folder.

Valid status update values are:

- `processing`
- `completed`

Cancellation uses the dedicated `/cancel` endpoint instead of the generic status endpoint.

---

## Request chaining

Post-response scripts can store data returned by one request as environment variables.

This allows later requests to reuse values such as:

- `customerAccessToken`
- `adminAccessToken`
- `orderId`

without manually copying and pasting them.

---

## Postman tests

Post-response scripts can also validate responses with `pm.test()` and `pm.expect()`.

Examples include checking:

- expected HTTP status
- required response fields
- user roles
- initial order status

Postman tests help during manual exploration but don't replace the Vitest and Supertest automated integration test suite.

---

## Script lifecycle

### Pre-request scripts

Pre-request scripts execute **before** a request is sent.

They are used in this project to ensure that valid authentication tokens are available.

### Post-response scripts

Post-response scripts execute **after** a response is received.

They are used to:

- validate responses
- store access tokens
- store created order IDs
