import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import authRoutes from "./routes/auth.routes.js";

import {
  notFoundHandler
} from "./middlewares/not-found.middleware.js";

import {
  errorHandler
} from "./middlewares/error.middleware.js";

import {
  securityHeaders
} from "./middlewares/security.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(securityHeaders);
app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;