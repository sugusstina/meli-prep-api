import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must have at least 2 characters"),

    price: z
      .number({
        error: "Price must be a number"
      })
      .positive("Price must be greater than 0"),

    stock: z
      .number({
        error: "Stock must be a number"
      })
      .int("Stock must be an integer")
      .nonnegative("Stock cannot be negative")
  })
  .strict();