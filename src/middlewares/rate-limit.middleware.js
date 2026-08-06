import { rateLimit } from "express-rate-limit";

import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

export const loginRateLimiter = rateLimit({
  windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS,
  limit: env.LOGIN_RATE_LIMIT_MAX,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler(req, res, next) {
    return next(
      new AppError(
        "Too many login attempts. Please try again later.",
        429,
        "TOO_MANY_LOGIN_ATTEMPTS"
      )
    );
  }
});