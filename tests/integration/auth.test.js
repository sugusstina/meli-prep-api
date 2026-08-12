import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "../../src/app.js";

import {
  buildUniqueEmail,
  registerTestUser
} from "../helpers/auth.js";

describe("Auth endpoints", () => {
  test("POST /api/auth/register creates a user and returns an access token", async () => {
    const email = buildUniqueEmail("register");

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Register Test",
        email,
        password: "supersecret"
      })
      .expect(201);

    expect(response.body.error).toBeNull();

    expect(response.body.data.user).toEqual({
      id: expect.any(String),
      name: "Register Test",
      email
    });

    expect(response.body.data.accessToken).toEqual(
      expect.any(String)
    );

    expect(response.body.data.user.password).toBeUndefined();
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.user.internalNotes).toBeUndefined();
  });

  test("POST /api/auth/register returns 409 when email is already in use", async () => {
    const email = buildUniqueEmail("duplicate");

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate Test",
        email,
        password: "supersecret"
      })
      .expect(201);

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate Test",
        email,
        password: "supersecret"
      })
      .expect(409);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe(
      "EMAIL_ALREADY_IN_USE"
    );
    expect(response.body.error.message).toBe(
      "Email is already in use"
    );
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/auth/register validates request body", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "A",
        email: "not-an-email",
        password: "123"
      })
      .expect(400);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.requestId).toBeDefined();

    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "name"
        }),
        expect.objectContaining({
          path: "email"
        }),
        expect.objectContaining({
          path: "password"
        })
      ])
    );
  });

  test("POST /api/auth/register rejects role assignment from client", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Fake Admin",
        email: buildUniqueEmail("fake-admin"),
        password: "supersecret",
        role: "admin"
      })
      .expect(400);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/auth/login returns user and access token for valid credentials", async () => {
    const { email, password } = await registerTestUser(app, {
      name: "Login Test"
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password
      })
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data.user).toEqual({
      id: expect.any(String),
      name: "Login Test",
      email
    });

    expect(response.body.data.accessToken).toEqual(
      expect.any(String)
    );

    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.user.internalNotes).toBeUndefined();
  });

  test("POST /api/auth/login returns 401 for invalid password", async () => {
    const { email } = await registerTestUser(app);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "wrongpassword"
      })
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe(
      "INVALID_CREDENTIALS"
    );
    expect(response.body.error.message).toBe(
      "Invalid email or password"
    );
    expect(response.body.error.requestId).toBeDefined();
  });

  test("POST /api/auth/login returns 401 for unknown email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: buildUniqueEmail("unknown"),
        password: "supersecret"
      })
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe(
      "INVALID_CREDENTIALS"
    );
    expect(response.body.error.message).toBe(
      "Invalid email or password"
    );
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/auth/me returns 401 without token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/auth/me returns 401 with invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);

    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe("INVALID_AUTH_TOKEN");
    expect(response.body.error.requestId).toBeDefined();
  });

  test("GET /api/auth/me returns current user with valid token", async () => {
    const {
      email,
      user,
      accessToken
    } = await registerTestUser(app, {
      name: "Me Test"
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.error).toBeNull();

    expect(response.body.data.user).toEqual({
      id: user.id,
      name: "Me Test",
      email
    });

    expect(response.body.data.user.password).toBeUndefined();
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.user.internalNotes).toBeUndefined();
  });
});