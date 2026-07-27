import bcrypt from "bcrypt";

import { env } from "../config/env.js";

import {
  createUser,
  findUserByEmail
} from "./users.service.js";

export async function registerUser({
  name,
  email,
  password
}) {
  const existingUser = findUserByEmail(email);

  if (existingUser) {
    return {
      user: null,
      error: {
        code: "EMAIL_ALREADY_IN_USE"
      }
    };
  }

  const passwordHash = await bcrypt.hash(
    password,
    env.BCRYPT_SALT_ROUNDS
  );

  const newUser = createUser({
    name,
    email,
    passwordHash,
    role: "customer"
  });

  return {
    user: newUser,
    error: null
  };
}

export async function loginUser({
  email,
  password
}) {
  const user = findUserByEmail(email);

  if (!user) {
    return {
      user: null,
      error: {
        code: "INVALID_CREDENTIALS"
      }
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return {
      user: null,
      error: {
        code: "INVALID_CREDENTIALS"
      }
    };
  }

  return {
    user,
    error: null
  };
}