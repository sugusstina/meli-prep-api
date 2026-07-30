import { z } from "zod";

export const createOrderSchema = z
  .object({
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