import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must have at least 2 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email must be valid"),

    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email must be valid"),

    password: z
      .string()
      .min(1, "Password is required")
  })
  .strict();