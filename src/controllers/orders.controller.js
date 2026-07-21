import {
  getAllOrders,
  createOrder
} from "../services/orders.service.js";

import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/http-response.js";

export function getOrders(req, res) {
  const orders = getAllOrders();

  return sendSuccess(res, {
    data: orders
  });
}

export function addOrder(req, res, next) {
  const { userId, productIds } = req.validatedBody;

  const result = createOrder({
    userId,
    productIds
  });

  if (result.error?.code === "USER_NOT_FOUND") {
    return next(
      new AppError(
        "User not found",
        404,
        "USER_NOT_FOUND"
      )
    );
  }

  if (result.error?.code === "PRODUCTS_NOT_FOUND") {
    return next(
      new AppError(
        "One or more products were not found",
        404,
        "PRODUCTS_NOT_FOUND",
        {
          missingProductIds:
            result.error.missingProductIds
        }
      )
    );
  }

  return sendSuccess(res, {
    statusCode: 201,
    data: result.order
  });
}