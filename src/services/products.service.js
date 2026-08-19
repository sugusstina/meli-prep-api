import { products } from "../data/products.js";
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

export function createProduct(productData) {
  const newProduct = {
    id: `prod_${Date.now()}`,
    ...productData
  };

  products.push(newProduct);

  return newProduct;
}

export function updateProductById(id, productData) {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return null;
  }

  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    id
  };

  products[productIndex] = updatedProduct;

  return updatedProduct;
}

export function deleteProductById(id) {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return null;
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  return deletedProduct;
}