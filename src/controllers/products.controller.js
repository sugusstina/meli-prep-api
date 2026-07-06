import { getAllProducts } from "../services/products.service.js";

export function getProducts(req, res) {
  const products = getAllProducts();

  res.status(200).json({
    data: products,
    error: null
  });
}