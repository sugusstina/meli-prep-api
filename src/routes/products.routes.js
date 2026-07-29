import { Router } from "express";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  removeProduct
} from "../controllers/products.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

import { productSchema } from "../schemas/product.schema.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validateBody(productSchema),
  addProduct
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  validateBody(productSchema),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  removeProduct
);

export default router;