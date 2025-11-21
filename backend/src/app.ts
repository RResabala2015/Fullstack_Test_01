import express, { type Express }  from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import statsRoutes from "./routes/stats.routes";

import { swaggerDocs } from "./config/swagger";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test.local" : ".env",
});

const app : Express = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/stats", statsRoutes);

// Swagger
if (process.env.NODE_ENV !== "test") {
    swaggerDocs(app);
}
export default app;
