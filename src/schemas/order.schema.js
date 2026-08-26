import { z } from "zod";

export const createOrderSchema = z
  .object({
    productIds: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Product id cannot be empty")
      )
      .min(1, "At least one product is required")
  })
  .strict();