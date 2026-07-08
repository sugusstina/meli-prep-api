import {
  getAllProducts,
  findProductById,
  createProduct,
  updateProductById,
  deleteProductById
} from "../services/products.service.js";

export function getProducts(req, res) {
  const products = getAllProducts();

  res.status(200).json({
    data: products,
    error: null
  });
}

export function getProductById(req, res) {
  const { id } = req.params;

  const product = findProductById(id);

  if (!product) {
    return res.status(400).json({
      data: null,
      error: {
        message: "Product not found",
        code: "PRODUCT_NOT_FOUND"
      }
    });
  }
  res.status(200).json({
    data: product,
    error: null
  });
}

export function addProduct(req, res) {
  const { name, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({
      data: null,
      error: {
        message: "Name, price and stock are required",
        code: "INVALID_PRODUCT_PAYLOAD"
      }
    });
  }

  const newProduct = createProduct({
    name,
    price,
    stock
  });

  res.status(201).json({
    data: newProduct,
    error: null
  });
}

export function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({
      data: null,
      error: {
        message: "Name, price and stock are required",
        code: "INVALID_PRODUCT_PAYLOAD"
      }
    });
  }

  const updatedProduct = updateProductById(id, {
    name,
    price,
    stock
  });

  if (!updatedProduct) {
    return res.status(404).json({
      data: null,
      error: {
        message: "Product not found",
        code: "PRODUCT_NOT_FOUND"
      }
    });
  }

  res.status(200).json({
    data: updatedProduct,
    error: null
  });
}

export function removeProduct(req, res) {
  const { id } = req.params;

  const deletedProduct = deleteProductById(id);

  if (!deletedProduct) {
    return res.status(404).json({
      data: null,
      error: {
        message: "Product not found",
        code: "PRODUCT_NOT_FOUND"
      }
    });
  }

  res.status(200).json({
    data: deletedProduct,
    error: null
  });
}