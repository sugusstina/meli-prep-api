import {
  getAllOrders,
  getOrdersByUserId,
  findOrderById,
  createOrder
} from "../services/orders.service.js";

import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/http-response.js";

import {
  toPublicOrder,
  toPublicOrders
} from "../serializers/order.serializer.js";

export async function getOrders(req, res) {
  const orders = await getAllOrders();

  return sendSuccess(res, {
    data: toPublicOrders(orders)
  });
}

export async function getMyOrders(req, res) {
  const orders = await getOrdersByUserId(
    req.user.id
  );

  return sendSuccess(res, {
    data: toPublicOrders(orders)
  });
}

export async function getOrderById(
  req,
  res,
  next
) {
  const { id } = req.params;

  const order = await findOrderById(id);

  if (!order) {
    return next(
      new AppError(
        "Order not found",
        404,
        "ORDER_NOT_FOUND"
      )
    );
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = order.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    return next(
      new AppError(
        "You do not have permission to access this order",
        403,
        "FORBIDDEN"
      )
    );
  }

  return sendSuccess(res, {
    data: toPublicOrder(order)
  });
}

export function addOrder(req, res, next) {
  const { productIds } = req.validatedBody;

  const result = createOrder({
    userId: req.user.id,
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
    data: toPublicOrder(result.order)
  });
}