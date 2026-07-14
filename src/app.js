import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import productsRoutes from "./routes/products.routes.js";

import usersRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/products", productsRoutes);

app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);

export default app;