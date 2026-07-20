import {
  getAllProducts,
  findProductById,
  createProduct,
  updateProductById,
  deleteProductById
} from "../services/products.service.js";

import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/http-response.js";

export function getProducts(req, res) {
  const products = getAllProducts();

  return sendSuccess(res, {
    data: products
  });
}

export function getProductById(req, res, next) {
  const { id } = req.params;

  const product = findProductById(id);

  if (!product) {
    return next(
      new AppError(
        "Product not found",
        404,
        "PRODUCT_NOT_FOUND"
      )
    );
  }

  return sendSuccess(res, {
    data: product
  });
}

export function addProduct(req, res) {
  const { name, price, stock } = req.validatedBody;

  const newProduct = createProduct({
    name,
    price,
    stock
  });

  return sendSuccess(res, {
    statusCode: 201,
    data: newProduct
  });
}

export function updateProduct(req, res, next) {
  const { id } = req.params;
  const { name, price, stock } = req.validatedBody;

  const updatedProduct = updateProductById(id, {
    name,
    price,
    stock
  });

  if (!updatedProduct) {
    return next(
      new AppError(
        "Product not found",
        404,
        "PRODUCT_NOT_FOUND"
      )
    );
  }

  return sendSuccess(res, {
    data: updatedProduct
  });
}

export function removeProduct(req, res, next) {
  const { id } = req.params;

  const deletedProduct = deleteProductById(id);

  if (!deletedProduct) {
    return next(
      new AppError(
        "Product not found",
        404,
        "PRODUCT_NOT_FOUND"
      )
    );
  }

  return sendSuccess(res, {
    data: deletedProduct
  });
}