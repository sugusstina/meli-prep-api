import request from "supertest";
import { describe, expect, test } from "vitest";
import { prisma } from "../../src/db/prisma.js";

import app from "../../src/app.js";

import {
  createTestAdminUser,
  registerTestUser
} from "../helpers/auth.js";

async function createOrderAsUser(
  app,
  accessToken,
  productIds = ["prod_1", "prod_3"]
) {
  const response = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      productIds
    })
    .expect(201);

  return response.body.data;
}

describe("Order authorization and ownership", () => {
  test("POST /api/orders returns 401 without token", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        productIds: ["prod_1"]
      })
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/orders creates an order for authenticated customer", async () => {
    const {
      user,
      accessToken
    } = await registerTestUser(app);

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productIds: ["prod_1", "prod_3"]
      })
      .expect(201);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual({
      id: expect.any(String),
      userId: user.id,
      productIds: ["prod_1", "prod_3"],
      status: "pending",
      total: expect.any(Number)
    });
  });

  test("POST /api/orders rejects userId in request body", async () => {
    const { accessToken } = await registerTestUser(app);

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: "user_999",
        productIds: ["prod_1"]
      })
      .expect(400);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/orders returns 401 without token", async () => {
    const response = await request(app)
      .get("/api/orders")
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/orders returns 403 for customer user", async () => {
    const { accessToken } = await registerTestUser(app);

    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("FORBIDDEN");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/orders returns all orders for admin user", async () => {
    const {
      accessToken: customerToken
    } = await registerTestUser(app);

    const {
      accessToken: adminToken
    } = await createTestAdminUser(app);

    const order = await createOrderAsUser(app, customerToken);

    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.error).toBeNull();
    expect(Array.isArray(response.body.data)).toBe(true);

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order.id,
          userId: order.userId
        })
      ])
    );
  });

  test("GET /api/orders/my-orders returns 401 without token", async () => {
    const response = await request(app)
      .get("/api/orders/my-orders")
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/orders/my-orders returns only authenticated user's orders", async () => {
    const {
      user: customerOne,
      accessToken: customerOneToken
    } = await registerTestUser(app);

    const {
      user: customerTwo,
      accessToken: customerTwoToken
    } = await registerTestUser(app);

    const customerOneOrder = await createOrderAsUser(
      app,
      customerOneToken,
      ["prod_1"]
    );

    const customerTwoOrder = await createOrderAsUser(
      app,
      customerTwoToken,
      ["prod_3"]
    );

    const response = await request(app)
      .get("/api/orders/my-orders")
      .set("Authorization", `Bearer ${customerOneToken}`)
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: customerOneOrder.id,
          userId: customerOne.id
        })
      ])
    );

    expect(response.body.data).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: customerTwoOrder.id,
          userId: customerTwo.id
        })
      ])
    );
  });

  test("GET /api/orders/:id returns order for owner", async () => {
    const {
      user,
      accessToken
    } = await registerTestUser(app);

    const order = await createOrderAsUser(app, accessToken);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual({
      id: order.id,
      userId: user.id,
      productIds: order.productIds,
      status: order.status,
      total: order.total
    });
  });

  test("GET /api/orders/:id returns 403 for another customer", async () => {
    const {
      accessToken: ownerToken
    } = await registerTestUser(app);

    const {
      accessToken: otherCustomerToken
    } = await registerTestUser(app);

    const order = await createOrderAsUser(app, ownerToken);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Authorization", `Bearer ${otherCustomerToken}`)
      .expect(403);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("FORBIDDEN");
    expect(response.body.error.message).toBe(
      "You do not have permission to access this order"
    );
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/orders/:id returns order for admin", async () => {
    const {
      accessToken: customerToken
    } = await registerTestUser(app);

    const {
      accessToken: adminToken
    } = await createTestAdminUser(app);

    const order = await createOrderAsUser(app, customerToken);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual({
      id: order.id,
      userId: order.userId,
      productIds: order.productIds,
      status: order.status,
      total: order.total
    });
  });

  test("GET /api/orders/:id returns 404 when order does not exist", async () => {
    const { accessToken } = await registerTestUser(app);

    const response = await request(app)
      .get("/api/orders/order_999")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("ORDER_NOT_FOUND");
    expect(response.body.error.message).toBe("Order not found");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/orders decrements product stock", async () => {
    const { accessToken } =
      await registerTestUser(app);

    const productBefore = await prisma.product.findUnique({
      where: {
        id: "prod_1"
      }
    });

    await request(app)
      .post("/api/orders")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        productIds: [
          "prod_1",
          "prod_1"
        ]
      })
      .expect(201);

    const productAfter = await prisma.product.findUnique({
      where: {
        id: "prod_1"
      }
    });

    expect(productAfter.stock).toBe(
      productBefore.stock - 2
    );
  });
  test("POST /api/orders returns 409 when stock is insufficient", async () => {
    const { accessToken } =
      await registerTestUser(app);

    await prisma.product.update({
      where: {
        id: "prod_1"
      },
      data: {
        stock: 1
      }
    });

    const response = await request(app)
      .post("/api/orders")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        productIds: [
          "prod_1",
          "prod_1"
        ]
      })
      .expect(409);

    expect(response.body.error.code).toBe(
      "INSUFFICIENT_STOCK"
    );

    const product = await prisma.product.findUnique({
      where: {
        id: "prod_1"
      }
    });

    expect(product.stock).toBe(1);
  });
});