import { prisma } from "../db/prisma.js";

export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: true
    }
  });
}

export async function findOrderById(id) {
  return prisma.order.findUnique({
    where: {
      id
    },
    include: {
      items: true
    }
  });
}

export async function getOrdersByUserId(userId) {
  return prisma.order.findMany({
    where: {
      userId
    },
    include: {
      items: true
    }
  });
}

export async function createOrder({
  userId,
  productIds
}) {
  const requestedQuantityByProductId =
    new Map();

  for (const productId of productIds) {
    const currentQuantity =
      requestedQuantityByProductId.get(
        productId
      ) ?? 0;

    requestedQuantityByProductId.set(
      productId,
      currentQuantity + 1
    );
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return {
        order: null,
        error: {
          code: "USER_NOT_FOUND"
        }
      };
    }

    const products =
      await tx.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });

    const productsById = new Map(
      products.map((product) => [
        product.id,
        product
      ])
    );

    const missingProductIds = [
      ...new Set(
        productIds.filter(
          (productId) =>
            !productsById.has(productId)
        )
      )
    ];

    if (missingProductIds.length > 0) {
      return {
        order: null,
        error: {
          code: "PRODUCTS_NOT_FOUND",
          missingProductIds
        }
      };
    }

    const insufficientStock = products
      .map((product) => {
        const requested =
          requestedQuantityByProductId.get(
            product.id
          );

        return {
          productId: product.id,
          requested,
          available: product.stock
        };
      })
      .filter(
        ({ requested, available }) =>
          requested > available
      );

    if (insufficientStock.length > 0) {
      return {
        order: null,
        error: {
          code: "INSUFFICIENT_STOCK",
          products: insufficientStock
        }
      };
    }

    const selectedProducts =
      productIds.map(
        (productId) =>
          productsById.get(productId)
      );

    const total = selectedProducts.reduce(
      (currentTotal, product) => {
        return currentTotal + product.price;
      },
      0
    );

    for (
      const [productId, quantity]
      of requestedQuantityByProductId
    ) {
      await tx.product.update({
        where: {
          id: productId
        },
        data: {
          stock: {
            decrement: quantity
          }
        }
      });
    }

    const timestamp = Date.now();

    const newOrder = await tx.order.create({
      data: {
        id: `order_${timestamp}`,
        userId,
        status: "pending",
        total,

        items: {
          create: selectedProducts.map(
            (product, index) => ({
              id: `order_item_${timestamp}_${index}`,
              productId: product.id,
              price: product.price
            })
          )
        }
      },

      include: {
        items: true
      }
    });

    return {
      order: newOrder,
      error: null
    };
  });
}

export async function cancelOrderById(id) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return {
        order: null,
        error: {
          code: "ORDER_NOT_FOUND"
        }
      };
    }

    if (order.status !== "pending") {
      return {
        order: null,
        error: {
          code: "ORDER_CANNOT_BE_CANCELLED",
          currentStatus: order.status
        }
      };
    }

    const quantityByProductId = new Map();

    for (const item of order.items) {
      const currentQuantity =
        quantityByProductId.get(
          item.productId
        ) ?? 0;

      quantityByProductId.set(
        item.productId,
        currentQuantity + 1
      );
    }

    const updateResult =
      await tx.order.updateMany({
        where: {
          id,
          status: "pending"
        },
        data: {
          status: "cancelled"
        }
      });

    if (updateResult.count === 0) {
      return {
        order: null,
        error: {
          code: "ORDER_CANNOT_BE_CANCELLED"
        }
      };
    }

    for (
      const [productId, quantity]
      of quantityByProductId
    ) {
      await tx.product.update({
        where: {
          id: productId
        },
        data: {
          stock: {
            increment: quantity
          }
        }
      });
    }

    const cancelledOrder =
      await tx.order.findUnique({
        where: {
          id
        },
        include: {
          items: true
        }
      });

    return {
      order: cancelledOrder,
      error: null
    };
  });
}