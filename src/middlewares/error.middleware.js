import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";
import { logError } from "../utils/logger.js";

function getValidationDetails(error) {
  if (!error.details) {
    return {};
  }

  return {
    details: error.details
  };
}

function getDevelopmentDetails(error, isKnownError) {
  if (env.NODE_ENV !== "development") {
    return {};
  }

  return {
    debug: {
      name: error.name,
      isKnownError,
      stack: error.stack
    }
  };
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson =
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error;

  if (isInvalidJson) {
    const invalidJsonError = new AppError(
      "The request body contains invalid JSON",
      400,
      "INVALID_JSON"
    );

    logError(invalidJsonError, req);

    return res.status(400).json({
      data: null,
      error: {
        message: invalidJsonError.message,
        code: invalidJsonError.code,
        requestId: req.requestId,
        ...getDevelopmentDetails(
          invalidJsonError,
          true
        )
      }
    });
  }

  const isKnownError = error instanceof AppError;

  const statusCode = isKnownError
    ? error.statusCode
    : 500;

  const responseError = {
    message: isKnownError
      ? error.message
      : "Internal server error",

    code: isKnownError
      ? error.code
      : "INTERNAL_SERVER_ERROR",

    requestId: req.requestId,

    ...(isKnownError
      ? getValidationDetails(error)
      : {}),

    ...getDevelopmentDetails(error, isKnownError)
  };

  logError(error, req);

  return res.status(statusCode).json({
    data: null,
    error: responseError
  });
}