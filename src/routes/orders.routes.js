import { Router } from "express";

import {
  getOrders,
  getMyOrders,
  getOrderById,
  addOrder,
  cancelOrder,
  changeOrderStatus
} from "../controllers/orders.controller.js";

import {
  createOrderSchema,
  updateOrderStatusSchema
} from "../schemas/order.schema.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  getOrders
);

router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

router.post(
  "/",
  authMiddleware,
  validateBody(createOrderSchema),
  addOrder
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("admin"),
  validateBody(updateOrderStatusSchema),
  changeOrderStatus
);

export default router;