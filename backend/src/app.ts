import express, { type Express }  from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

import { swaggerDocs } from "./config/swagger";

const app : Express = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Swagger
swaggerDocs(app);

export default app;
