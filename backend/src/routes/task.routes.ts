import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

import validate from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
