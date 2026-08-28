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
  const user = await prisma.user.findUnique({
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

  const products = await prisma.product.findMany({
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

  const selectedProducts = productIds.map(
    (productId) =>
      productsById.get(productId)
  );

  const total = selectedProducts.reduce(
    (currentTotal, product) => {
      return currentTotal + product.price;
    },
    0
  );

  const timestamp = Date.now();

  const newOrder = await prisma.order.create({
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
}