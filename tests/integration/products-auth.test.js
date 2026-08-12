import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "../../src/app.js";

import {
  createTestAdminUser,
  registerTestUser
} from "../helpers/auth.js";

async function createProductAsAdmin(app, adminToken) {
  const response = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Product For Test",
      price: 100,
      stock: 5
    })
    .expect(201);

  return response.body.data;
}

describe("Product authorization", () => {
  test("POST /api/products returns 401 without token", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        name: "Unauthorized Product",
        price: 100,
        stock: 5
      })
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/products returns 403 for customer user", async () => {
    const { accessToken } = await registerTestUser(app);

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Customer Product",
        price: 100,
        stock: 5
      })
      .expect(403);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("FORBIDDEN");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/products creates product for admin user", async () => {
    const { accessToken } = await createTestAdminUser(app);

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Admin Product",
        price: 150,
        stock: 3
      })
      .expect(201);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual({
      id: expect.any(String),
      name: "Admin Product",
      price: 150,
      stock: 3
    });
  });

  test("PUT /api/products/:id returns 401 without token", async () => {
    const { accessToken: adminToken } =
      await createTestAdminUser(app);

    const product = await createProductAsAdmin(app, adminToken);

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .send({
        name: "Unauthorized Update",
        price: 120,
        stock: 4
      })
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("PUT /api/products/:id returns 403 for customer user", async () => {
    const { accessToken: adminToken } =
      await createTestAdminUser(app);

    const { accessToken: customerToken } =
      await registerTestUser(app);

    const product = await createProductAsAdmin(app, adminToken);

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        name: "Customer Update",
        price: 120,
        stock: 4
      })
      .expect(403);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("FORBIDDEN");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("PUT /api/products/:id updates product for admin user", async () => {
    const { accessToken: adminToken } =
      await createTestAdminUser(app);

    const product = await createProductAsAdmin(app, adminToken);

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Admin Updated Product",
        price: 180,
        stock: 7
      })
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual({
      id: product.id,
      name: "Admin Updated Product",
      price: 180,
      stock: 7
    });
  });

  test("DELETE /api/products/:id returns 401 without token", async () => {
    const { accessToken: adminToken } =
      await createTestAdminUser(app);

    const product = await createProductAsAdmin(app, adminToken);

    const response = await request(app)
      .delete(`/api/products/${product.id}`)
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("DELETE /api/products/:id returns 403 for customer user", async () => {
    const { accessToken: adminToken } =
      await createTestAdminUser(app);

    const { accessToken: customerToken } =
      await registerTestUser(app);

    const product = await createProductAsAdmin(app, adminToken);

    const response = await request(app)
      .delete(`/api/products/${product.id}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(403);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("FORBIDDEN");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("DELETE /api/products/:id deletes product for admin user", async () => {
    const { accessToken: adminToken } =
      await createTestAdminUser(app);

    const product = await createProductAsAdmin(app, adminToken);

    const response = await request(app)
      .delete(`/api/products/${product.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data).toEqual({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    });

    const getDeletedProductResponse = await request(app)
      .get(`/api/products/${product.id}`)
      .expect(404);

    expect(getDeletedProductResponse.body.error.code).toBe(
      "PRODUCT_NOT_FOUND"
    );
  });
});