import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z
    .coerce
    .number()
    .int("PORT must be an integer")
    .positive("PORT must be greater than 0")
    .default(3000),

  PAYMENT_PROVIDER_API_KEY: z
    .string()
    .min(1, "PAYMENT_PROVIDER_API_KEY is required"),

  BCRYPT_SALT_ROUNDS: z
    .coerce
    .number()
    .int("BCRYPT_SALT_ROUNDS must be an integer")
    .min(10, "BCRYPT_SALT_ROUNDS must be at least 10")
    .default(10),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must have at least 32 characters"),

  JWT_EXPIRES_IN: z
    .string()
    .min(1, "JWT_EXPIRES_IN is required")
    .default("1h"),

  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL must be a valid URL")
    .default("http://localhost:5173"),

  LOGIN_RATE_LIMIT_WINDOW_MS: z
    .coerce
    .number()
    .int("LOGIN_RATE_LIMIT_WINDOW_MS must be an integer")
    .positive("LOGIN_RATE_LIMIT_WINDOW_MS must be greater than 0")
    .default(900000),

  LOGIN_RATE_LIMIT_MAX: z
    .coerce
    .number()
    .int("LOGIN_RATE_LIMIT_MAX must be an integer")
    .positive("LOGIN_RATE_LIMIT_MAX must be greater than 0")
    .default(5),

    DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
});


const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables");

  console.error(
    result.error.issues.map((issue) => {
      return {
        path: issue.path.join("."),
        message: issue.message
      };
    })
  );

  process.exit(1);
}

export const env = result.data;