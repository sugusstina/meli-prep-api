import { z } from "zod";

export const orderSchema = z
  .object({
    userId: z
      .string()
      .trim()
      .min(1, "userId is required")
      .regex(/^user_/, "userId must be a valid user id"),

    productIds: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Product id cannot be empty")
          .regex(/^prod_/, "Product id must be a valid product id")
      )
      .min(1, "At least one product is required")
  })
  .strict();