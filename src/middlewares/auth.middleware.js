import { AppError } from "../errors/AppError.js";

import {
  verifyAccessToken
} from "../services/token.service.js";

import {
  findUserById
} from "../services/users.service.js";

export function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(
      new AppError(
        "Authentication token is required",
        401,
        "AUTH_TOKEN_REQUIRED"
      )
    );
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(
        "Authorization header must use Bearer scheme",
        401,
        "INVALID_AUTH_HEADER"
      )
    );
  }

  try {
    const payload = verifyAccessToken(token);

    const user = findUserById(payload.sub);

    if (!user) {
      return next(
        new AppError(
          "Authenticated user was not found",
          401,
          "AUTH_USER_NOT_FOUND"
        )
      );
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(
      new AppError(
        "Invalid or expired authentication token",
        401,
        "INVALID_AUTH_TOKEN"
      )
    );
  }
}