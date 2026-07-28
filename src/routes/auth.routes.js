import { Router } from "express";

import {
  getMe,
  login,
  register
} from "../controllers/auth.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  loginSchema,
  registerSchema
} from "../schemas/auth.schema.js";

import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(login)
);

router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;