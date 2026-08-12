import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "../../src/app.js";

describe("Global error handling", () => {
  test("returns JSON error for unknown routes", async () => {
    const response = await request(app)
      .get("/api/not-real")
      .expect(404);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
    expect(response.body.error.message).toBe(
      "Route GET /api/not-real not found"
    );
    expect(response.body.error.requestId).toBeDefined();
  });

  test("returns JSON error for invalid JSON body", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Content-Type", "application/json")
      .send('{"name":"Monitor"')
      .expect(400);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("INVALID_JSON");
    expect(response.body.error.message).toBe(
      "The request body contains invalid JSON"
    );
    expect(response.body.error.requestId).toBeDefined();
  });
});