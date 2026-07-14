import { Router } from "express";
import {
  getOrders,
  addOrder
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.post("/", addOrder);

export default router;