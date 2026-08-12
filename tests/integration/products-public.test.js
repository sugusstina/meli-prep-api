import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "../../src/app.js";

describe("Public products endpoints", () => {
  test("GET /api/products returns products", async () => {
    const response = await request(app)
      .get("/api/products")
      .expect(200);

    expect(response.body.error).toBeNull();
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    expect(response.body.data[0]).toHaveProperty("id");
    expect(response.body.data[0]).toHaveProperty("name");
    expect(response.body.data[0]).toHaveProperty("price");
    expect(response.body.data[0]).toHaveProperty("stock");
  });

  test("GET /api/products/:id returns product by id", async () => {
    const response = await request(app)
      .get("/api/products/prod_1")
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: "prod_1",
        name: "Wireless Mouse",
        price: 25,
        stock: 15
      },
      error: null
    });
  });

  test("GET /api/products/:id returns 404 when product does not exist", async () => {
    const response = await request(app)
      .get("/api/products/prod_999")
      .expect(404);

    expect(response.body.data).toBeNull();
    expect(response.body.error.message).toBe("Product not found");
    expect(response.body.error.code).toBe("PRODUCT_NOT_FOUND");
    expect(response.body.error.requestId).toBeDefined();
  });
});