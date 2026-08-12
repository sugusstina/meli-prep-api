import request from "supertest";
import { randomUUID } from "crypto";

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