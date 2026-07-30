import { orders } from "../data/orders.js";
import { findUserById } from "./users.service.js";
import { findProductById } from "./products.service.js";

export function getAllOrders() {
  return orders;
}

export function findOrderById(id) {
  return orders.find((order) => order.id === id);
}

export function getOrdersByUserId(userId) {
  return orders.filter((order) => order.userId === userId);
}

export function createOrder({ userId, productIds }) {
  const user = findUserById(userId);

  if (!user) {
    return {
      order: null,
      error: {
        code: "USER_NOT_FOUND"
      }
    };
  }

  const missingProductIds = productIds.filter((productId) => {
    return !findProductById(productId);
  });

  if (missingProductIds.length > 0) {
    return {
      order: null,
      error: {
        code: "PRODUCTS_NOT_FOUND",
        missingProductIds
      }
    };
  }

  const selectedProducts = productIds.map((productId) => {
    return findProductById(productId);
  });

  const total = selectedProducts.reduce((currentTotal, product) => {
    return currentTotal + product.price;
  }, 0);

  const newOrder = {
    id: `order_${Date.now()}`,
    userId,
    productIds,
    status: "pending",
    total
  };

  orders.push(newOrder);

  return {
    order: newOrder,
    error: null
  };
}