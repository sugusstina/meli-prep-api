# Postman

This directory contains the Postman collection for the Meli Prep API.

## Import

Open Postman and import:

`Meli Prep API.postman_collection.json`

Then create a local Postman environment named:

`Meli Prep Local`

## Required environment variables

- `baseUrl`
- `customerEmail`
- `customerPassword`
- `customerAccessToken`
- `adminEmail`
- `adminPassword`
- `adminAccessToken`
- `orderId`

For local development:

```txt
baseUrl=http://localhost:3000
```

Access tokens and order IDs are populated automatically by Postman scripts.

## Authentication

The **Customer** folder automatically obtains and reuses a customer JWT.

The **Admin** folder automatically obtains and reuses an admin JWT.

Requests inherit Bearer authentication from their parent folder.

## Functional workflows

### Customer

Recommended execution order:

1. Get Me
2. Create Order
3. Get Order By ID
4. My Orders
5. Cancel Order
6. Cancel Order Again

### Admin

Create a fresh pending order with **Customer > Create Order** before running the Admin workflow.

Recommended execution order:

1. Get All Orders
2. Set Order Processing
3. Complete Order
4. Try Reopen Completed Order

## Security

Do not commit exported Postman environment files.

The repository ignores:

```txt
postman/*.postman_environment.json
```

Environment files can contain passwords, access tokens and other local values.

## Testing strategy

Postman is used for manual and exploratory API workflows.

Vitest and Supertest remain the source of truth for automated regression testing.
