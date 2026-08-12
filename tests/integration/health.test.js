import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "../../src/app.js";

describe("GET /health", () => {
  test("returns API health status", async () => {
    const response = await request(app)
      .get("/health")
      .expect(200);

    expect(response.body).toEqual({
      data: {
        status: "ok",
        service: "meli-prep-api"
      },
      error: null
    });
  });

  test("includes a request id header", async () => {
    const response = await request(app)
      .get("/health")
      .expect(200);

    expect(response.headers["x-request-id"]).toBeDefined();
  });

  test("reuses incoming request id header", async () => {
    const response = await request(app)
      .get("/health")
      .set("X-Request-Id", "test-request-id")
      .expect(200);

    expect(response.headers["x-request-id"]).toBe(
      "test-request-id"
    );
  });

  test("does not expose x-powered-by header", async () => {
    const response = await request(app)
      .get("/health")
      .expect(200);

    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});