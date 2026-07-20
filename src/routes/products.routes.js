import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  removeProduct
} from "../controllers/products.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validateBody(productSchema), addProduct);
router.put("/:id", validateBody(productSchema), updateProduct);
router.delete("/:id", removeProduct);

export default router;