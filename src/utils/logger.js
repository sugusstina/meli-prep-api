function sanitizeHeaders(headers) {
    const sanitizedHeaders = {
      ...headers
    };
  
    if (sanitizedHeaders.authorization) {
      sanitizedHeaders.authorization = "[REDACTED]";
    }
  
    if (sanitizedHeaders.cookie) {
      sanitizedHeaders.cookie = "[REDACTED]";
    }
  
    return sanitizedHeaders;
  }
  
  export function logError(error, req) {
    const log = {
      level: "error",
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: error.statusCode || 500,
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message,
      userId: req.user?.id || null,
      headers: sanitizeHeaders(req.headers),
      stack: error.stack
    };
  
    console.error(JSON.stringify(log, null, 2));
  }