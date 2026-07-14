import { AppError } from "../errors/AppError.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson =
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error;

  if (isInvalidJson) {
    return res.status(400).json({
      data: null,
      error: {
        message: "The request body contains invalid JSON",
        code: "INVALID_JSON"
      }
    });
  }

  const isKnownError = error instanceof AppError;

  const statusCode = isKnownError
    ? error.statusCode
    : 500;

  if (!isKnownError) {
    console.error(error);
  }

  return res.status(statusCode).json({
    data: null,
    error: {
      message: isKnownError
        ? error.message
        : "Internal server error",

      code: isKnownError
        ? error.code
        : "INTERNAL_SERVER_ERROR",

      ...(isKnownError && error.details
        ? { details: error.details }
        : {})
    }
  });
}