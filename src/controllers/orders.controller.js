import {
  getAllOrders,
  getOrdersByUserId,
  findOrderById,
  createOrder,
  cancelOrderById,
  updateOrderStatus
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

export async function addOrder(req, res, next) {
  const { productIds } = req.validatedBody;

  const result = await createOrder({
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

  if (
    result.error?.code ===
    "INSUFFICIENT_STOCK"
  ) {
    return next(
      new AppError(
        "Insufficient stock for one or more products",
        409,
        "INSUFFICIENT_STOCK",
        {
          products: result.error.products
        }
      )
    );
  }

  return sendSuccess(res, {
    statusCode: 201,
    data: toPublicOrder(result.order)
  });
}

export async function cancelOrder(
  req,
  res,
  next
) {
  const { id } = req.params;

  const existingOrder =
    await findOrderById(id);

  if (!existingOrder) {
    return next(
      new AppError(
        "Order not found",
        404,
        "ORDER_NOT_FOUND"
      )
    );
  }

  const isAdmin =
    req.user.role === "admin";

  const isOwner =
    existingOrder.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    return next(
      new AppError(
        "You do not have permission to cancel this order",
        403,
        "FORBIDDEN"
      )
    );
  }

  const result =
    await cancelOrderById(id);

  if (
    result.error?.code ===
    "ORDER_CANNOT_BE_CANCELLED"
  ) {
    return next(
      new AppError(
        "Order cannot be cancelled",
        409,
        "ORDER_CANNOT_BE_CANCELLED"
      )
    );
  }

  if (
    result.error?.code ===
    "ORDER_NOT_FOUND"
  ) {
    return next(
      new AppError(
        "Order not found",
        404,
        "ORDER_NOT_FOUND"
      )
    );
  }

  return sendSuccess(res, {
    data: toPublicOrder(result.order)
  });
}

export async function changeOrderStatus(
  req,
  res,
  next
) {
  const { id } = req.params;
  const { status } = req.validatedBody;

  const result =
    await updateOrderStatus(
      id,
      status
    );

  if (
    result.error?.code ===
    "ORDER_NOT_FOUND"
  ) {
    return next(
      new AppError(
        "Order not found",
        404,
        "ORDER_NOT_FOUND"
      )
    );
  }

  if (
    result.error?.code ===
    "INVALID_ORDER_STATUS_TRANSITION"
  ) {
    return next(
      new AppError(
        "Invalid order status transition",
        409,
        "INVALID_ORDER_STATUS_TRANSITION",
        {
          currentStatus:
            result.error.currentStatus,

          requestedStatus:
            result.error.requestedStatus
        }
      )
    );
  }

  return sendSuccess(res, {
    data: toPublicOrder(result.order)
  });
}