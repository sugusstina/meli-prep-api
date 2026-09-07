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