import {
  getAllProducts,
  findProductById,
  createProduct,
  updateProductById,
  deleteProductById
} from "../services/products.service.js";

import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/http-response.js";

import {
  toPublicProduct,
  toPublicProducts
} from "../serializers/product.serializer.js";

export async function getProducts(req, res) {
  const {
    search,
    minPrice,
    maxPrice,
    sortBy = "name",
    order = "asc",
    page = "1",
    limit = "10"
  } = req.query;

  const allowedSortFields = [
    "name",
    "price",
    "stock"
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "name";

  const safeOrder = order === "desc"
    ? "desc"
    : "asc";

  const products = await getAllProducts({
    search,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: safeSortBy,
    order: safeOrder,
    page: Number(page),
    limit: Number(limit)
  });

  return sendSuccess(res, {
    data: toPublicProducts(products)
  });
}

export async function getProductById(req, res, next) {
  const { id } = req.params;

  const product = await findProductById(id);

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
    data: toPublicProduct(product)
  });
}

export async function addProduct(req, res) {
  const { name, price, stock } = req.validatedBody;

  const newProduct = await createProduct({
    name,
    price,
    stock
  });

  return sendSuccess(res, {
    statusCode: 201,
    data: toPublicProduct(newProduct)
  });
}

export async function updateProduct(req, res, next) {
  const { id } = req.params;
  const { name, price, stock } = req.validatedBody;

  const updatedProduct = await updateProductById(id, {
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
    data: toPublicProduct(updatedProduct)
  });
}

export async function removeProduct(req, res, next) {
  const { id } = req.params;

  const deletedProduct = await deleteProductById(id);

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
    data: toPublicProduct(deletedProduct)
  });
}
