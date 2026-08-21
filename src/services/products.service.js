import { prisma } from "../db/prisma.js";

export async function getAllProducts({
  search,
  minPrice,
  maxPrice,
  sortBy,
  order,
  page,
  limit
}) {
  const where = {};

  if (search) {
    where.name = {
      contains: search
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  return prisma.product.findMany({
    where,

    orderBy: {
      [sortBy]: order
    },

    skip: (page - 1) * limit,

    take: limit
  });
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: {
      id
    }
  });
}

export async function createProduct(productData) {
  return prisma.product.create({
    data: {
      id: `prod_${Date.now()}`,
      ...productData
    }
  });
}

export async function updateProductById(id, productData) {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id
    }
  });

  if (!existingProduct) {
    return null;
  }

  return prisma.product.update({
    where: {
      id
    },
    data: productData
  });
}

export async function deleteProductById(id) {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id
    }
  });

  if (!existingProduct) {
    return null;
  }

  return prisma.product.delete({
    where: {
      id
    }
  });
}