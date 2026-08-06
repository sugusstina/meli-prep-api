import { randomUUID } from "crypto";

export function requestIdMiddleware(req, res, next) {
  const incomingRequestId = req.headers["x-request-id"];

  const requestId = Array.isArray(incomingRequestId)
    ? incomingRequestId[0]
    : incomingRequestId;

  req.requestId = requestId || randomUUID();

  res.setHeader("X-Request-Id", req.requestId);

  return next();
}