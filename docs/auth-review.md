# Auth Review

This document summarizes the current authentication and authorization behavior of the Meli Prep API.

## 1. Authentication

Authentication answers:

```txt
Who is the user?
```

The API currently supports:

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Register flow

```
Request body
  ↓
Zod validation
  ↓
Check if email already exists
  ↓
Hash password with bcrypt
  ↓
Create user with passwordHash
  ↓
Generate JWT access token
  ↓
Return public user + accessToken
```

Passwords are never stored in plaintext.

The register response must not expose:

```
password
passwordHash
internalNotes
```

## 2. Login flow

```
Request body
  ↓
Zod validation
  ↓
Find user by email
  ↓
Compare password with passwordHash using bcrypt
  ↓
Generate JWT access token
  ↓
Return public user + accessToken
```

The API returns the same error for unknown email and wrong password:

```
INVALID_CREDENTIALS
```

This avoids revealing whether a specific email exists.

## 3. JWT

The API generates JWT access tokens after successful register/login.

Current token payload:

```
sub
email
role
```

The token must not include:

```
password
passwordHash
internalNotes
secrets
```

Protected routes require:

```
Authorization: Bearer <accessToken>
```

## 4. Auth middleware

The auth middleware:

```
Reads Authorization header
Checks Bearer scheme
Verifies JWT signature and expiration
Finds the user by token subject
Attaches the user to req.user
```

If the token is missing, invalid, malformed or expired, the API returns:

```
401 Unauthorized
```

## 5. Authorization by role

Authorization answers:
```
What can this user do?
```

Current roles:
```
customer
admin
```

Admin-only product operations:
```
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Public product operations:
```
GET /api/products
GET /api/products/:id
```

A customer with a valid token cannot create, update or delete products.

That returns:
```
403 Forbidden
```

## 6. Order ownership

Ownership answers:
```
Does this resource belong to this user?
```

Order rules:
```
Customers can create orders only for themselves.
Customers can see their own orders.
Customers cannot see another customer's orders.
Admins can see all orders.
Admins can see any order by ID.
```

Order creation uses:
```
req.user.id
```

not a client-provided ```userId```.

This prevents customers from creating orders for other users.

## 7. Status code rules

```
400 Bad Request
The request body is invalid.

401 Unauthorized
The request is missing valid authentication.

403 Forbidden
The user is authenticated but does not have permission.

404 Not Found
The requested resource does not exist.

409 Conflict
The email is already in use.
```

## 8. Current limitations

```
Access tokens are not stored or revoked.
There is no refresh token flow.
There is no real database.
There is no password reset flow.
There is no email verification.
There is no rate limiting yet.
There are no automated tests yet.
```

## 9. Next improvements

```
Add rate limiting to login.
Add Helmet security headers.
Add stricter CORS config.
Add automated auth tests.
Add refresh tokens.
Add persistent storage.
Add password reset flow.
```