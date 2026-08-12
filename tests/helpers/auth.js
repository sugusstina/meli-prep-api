import request from "supertest";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { env } from "../../src/config/env.js";
import { createUser } from "../../src/services/users.service.js";

export function buildUniqueEmail(prefix = "test") {
  const id = randomUUID().slice(0, 8);

  return `${prefix}.${id}@example.com`;
}

export async function registerTestUser(
  app,
  {
    name = "Test User",
    email = buildUniqueEmail("user"),
    password = "supersecret"
  } = {}
) {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name,
      email,
      password
    });

  return {
    response,
    name,
    email,
    password,
    user: response.body.data?.user,
    accessToken: response.body.data?.accessToken
  };
}

export async function createTestAdminUser(
  app,
  {
    name = "Test Admin",
    email = buildUniqueEmail("admin"),
    password = "adminsecret"
  } = {}
) {
  const passwordHash = await bcrypt.hash(
    password,
    env.BCRYPT_SALT_ROUNDS
  );

  createUser({
    name,
    email,
    passwordHash,
    role: "admin"
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password
    });

  return {
    response: loginResponse,
    name,
    email,
    password,
    user: loginResponse.body.data?.user,
    accessToken: loginResponse.body.data?.accessToken
  };
}