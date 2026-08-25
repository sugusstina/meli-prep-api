export function toPublicOrder(order) {
  return {
    id: order.id,
    userId: order.userId,
    productIds: order.items.map(
      (item) => item.productId
    ),
    status: order.status,
    total: order.total
  };
}

export function toPublicOrders(orders) {
  return orders.map((order) => toPublicOrder(order));
}