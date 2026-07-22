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
    .min(1, "PAYMENT_PROVIDER_API_KEY is required")
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