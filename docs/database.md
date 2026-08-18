# Database

This document summarizes the current database setup.

## 1. Tools

The project uses:

```txt
Prisma ORM
SQLite
```

SQLite is used for local development because it is file-based and does not require a separate database server.

## 2. Environment variable
```
DATABASE_URL="file:./dev.db"
```

## 3. Prisma files
```
prisma/
  schema.prisma
  migrations/
```

The generated Prisma Client is located in:
```
generated/prisma
```

### 4. Models

Current models:
```
User
Product
Order
OrderItem
```

## 5. Relationship overview
```
User
  has many Orders


Order
  belongs to User
  has many OrderItems


Product
  has many OrderItems


OrderItem
  belongs to Order
  belongs to Product
```

## 6. Why OrderItem exists

Orders and products have a many-to-many relationship.

A single order can contain multiple products.

A single product can appear in multiple orders.

The OrderItem model represents that relationship.

It also stores the product price at the time the order was created.

This avoids changing historical order totals when a product price changes later.

## 7. Commands

Generate Prisma Client:
```
npm run db:generate
```
Run migrations:
```
npm run db:migrate
```
Test database connection:
```
npm run db:test
```
Open Prisma Studio:
```
npm run db:studio
```

## 8. Current status
```
Database schema created.
Initial migration created.
Prisma Client generated.
Database connection tested.
API services still use in-memory data.
```

## 9. Next steps
```
Seed initial data.
Migrate products service to Prisma.
Migrate users/auth service to Prisma.
Migrate orders service to Prisma.
Adapt tests to reset database state.
```