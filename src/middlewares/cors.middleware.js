import cors from "cors";

import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

const allowedOrigins = [
  env.FRONTEND_URL
];

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new AppError(
        "Origin is not allowed by CORS",
        403,
        "CORS_ORIGIN_NOT_ALLOWED"
      )
    );
  },

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
});