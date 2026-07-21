import { Router } from "express";
import {
  getOrders,
  addOrder
} from "../controllers/orders.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { orderSchema } from "../schemas/order.schema.js";

const router = Router();

router.get("/", getOrders);
router.post("/", validateBody(orderSchema), addOrder);

export default router;