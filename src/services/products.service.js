import { products } from "../data/products.js";

export function getAllProducts() {
  return products;
}

export function findProductById(id) {
  return products.find((product) => product.id === id);
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