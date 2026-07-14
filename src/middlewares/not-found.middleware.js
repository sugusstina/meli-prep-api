import { AppError } from "../errors/AppError.js";

export function notFoundHandler(req, res, next) {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND"
  );

  return next(error);
}