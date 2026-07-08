import { Router } from "express";
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    removeProduct
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);

export default router;