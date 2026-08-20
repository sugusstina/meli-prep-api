import { prisma } from "../db/prisma.js";

export async function getAllProducts() {
  return prisma.product.findMany();
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