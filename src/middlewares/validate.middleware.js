import { AppError } from "../errors/AppError.js";

export function validateBody(schema) {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => {
        return {
          path: issue.path.join("."),
          message: issue.message
        };
      });

      return next(
        new AppError(
          "Invalid request body",
          400,
          "VALIDATION_ERROR",
          details
        )
      );
    }

    req.validatedBody = result.data;

    return next();
  };
}