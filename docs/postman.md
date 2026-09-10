# Postman

Postman is used as the manual API client for the Meli Prep API.

Automated regression testing remains handled by Vitest and Supertest.

## Local environment

Create a Postman environment named:

`Meli Prep Local`

Variables:

- `baseUrl`
- `customerEmail`
- `customerPassword`
- `customerAccessToken`
- `adminEmail`
- `adminPassword`
- `adminAccessToken`
- `orderId`

Local base URL:

`http://localhost:3000`

Access tokens are populated automatically by the login requests.

## Collection

Collection name:

`Meli Prep API`

Suggested structure:

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
  Cancel Order

Admin/
  Get All Orders
  Change Order Status
```



## Authentication

The Customer folder uses Bearer authentication with:

```
{{customerAccessToken}}
```

The Admin folder uses Bearer authentication with:

```
{{adminAccessToken}}
```

Requests inside those folders inherit authentication from their parent.

## Login automation

Customer login stores the returned JWT in:

```
customerAccessToken
```

Admin login stores the returned JWT in:

```
adminAccessToken
```

The Create Order request stores the created order ID in:

```
orderId
```

This allows authenticated requests to be executed without manually copying JWTs or order IDs.

## Testing strategy

Postman is intended for manual and exploratory API testing.

Vitest and Supertest remain the source of truth for automated regression testing.

Run the complete automated test suite with:

```
npm test
```



## Order workflow

The Customer folder contains requests for the authenticated
customer order flow:

```txt
Create Order
Get Order By ID
My Orders
Cancel Order
```

The Create Order request stores the returned order ID in the
`orderId` environment variable:

```
const response = pm.response.json();

pm.environment.set(
  "orderId",
  response.data.id
);
```

Other requests can reuse it with:

```
{{orderId}}
```

For example:

```
GET {{baseUrl}}/api/orders/{{orderId}}

PATCH {{baseUrl}}/api/orders/{{orderId}}/cancel
```

The Admin folder includes:

```
GET {{baseUrl}}/api/orders

PATCH {{baseUrl}}/api/orders/{{orderId}}/status
```

Admin status updates use the adminAccessToken inherited from
the Admin folder.

Valid status update values are:

```
processing
completed
```

Cancellation uses the dedicated /cancel endpoint instead of
the generic status endpoint.

## Request chaining

Post-response scripts can store data returned by one request
as environment variables.

This allows later requests to reuse values such as:

```
customerAccessToken
adminAccessToken
orderId
```

without manually copying and pasting them.