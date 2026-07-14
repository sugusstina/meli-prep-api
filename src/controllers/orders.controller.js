import {
    getAllOrders,
    createOrder
  } from "../services/orders.service.js";
  
  export function getOrders(req, res) {
    const orders = getAllOrders();
  
    res.status(200).json({
      data: orders,
      error: null
    });
  }
  
  export function addOrder(req, res) {
    const { userId, productIds } = req.body;
  
    if (
      !userId ||
      !Array.isArray(productIds) ||
      productIds.length === 0
    ) {
      return res.status(400).json({
        data: null,
        error: {
          message:
            "userId and a non-empty productIds array are required",
          code: "INVALID_ORDER_PAYLOAD"
        }
      });
    }
  
    const result = createOrder({
      userId,
      productIds
    });
  
    if (result.error?.code === "USER_NOT_FOUND") {
      return res.status(404).json({
        data: null,
        error: {
          message: "User not found",
          code: "USER_NOT_FOUND"
        }
      });
    }
  
    if (result.error?.code === "PRODUCTS_NOT_FOUND") {
      return res.status(404).json({
        data: null,
        error: {
          message: "One or more products were not found",
          code: "PRODUCTS_NOT_FOUND",
          details: {
            missingProductIds: result.error.missingProductIds
          }
        }
      });
    }
  
    res.status(201).json({
      data: result.order,
      error: null
    });
  }