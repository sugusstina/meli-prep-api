import {
  loginUser,
  registerUser
} from "../services/auth.service.js";

import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/http-response.js";
import { toPublicUser } from "../serializers/user.serializer.js";

export async function register(req, res, next) {
  const { name, email, password } = req.validatedBody;

  const result = await registerUser({
    name,
    email,
    password
  });

  if (result.error?.code === "EMAIL_ALREADY_IN_USE") {
    return next(
      new AppError(
        "Email is already in use",
        409,
        "EMAIL_ALREADY_IN_USE"
      )
    );
  }

  return sendSuccess(res, {
    statusCode: 201,
    data: {
      user: toPublicUser(result.user),
      accessToken: result.accessToken
    }
  });
}

export async function login(req, res, next) {
  const { email, password } = req.validatedBody;

  const result = await loginUser({
    email,
    password
  });

  if (result.error?.code === "INVALID_CREDENTIALS") {
    return next(
      new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS"
      )
    );
  }

  return sendSuccess(res, {
    data: {
      user: toPublicUser(result.user),
      accessToken: result.accessToken
    }
  });
}

export function getMe(req, res) {
  return sendSuccess(res, {
    data: {
      user: toPublicUser(req.user)
    }
  });
}