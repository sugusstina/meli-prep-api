import bcrypt from "bcrypt";

import { env } from "../config/env.js";

import {
  createUser,
  findUserByEmail
} from "./users.service.js";

import {
  generateAccessToken
} from "./token.service.js";

export async function registerUser({
  name,
  email,
  password
}) {
  const existingUser = findUserByEmail(email);

  if (existingUser) {
    return {
      user: null,
      accessToken: null,
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

  const accessToken = generateAccessToken(newUser);

  return {
    user: newUser,
    accessToken,
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
      accessToken: null,
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
      accessToken: null,
      error: {
        code: "INVALID_CREDENTIALS"
      }
    };
  }

  const accessToken = generateAccessToken(user);

  return {
    user,
    accessToken,
    error: null
  };
}