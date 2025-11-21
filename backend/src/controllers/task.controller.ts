import { Response } from "express";
import Task from "../models/Task.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.create(req.body);

    return res.status(201).json({
      message: "Tarea creada",
      task,
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return res.status(500).json({ message: "Error al crear la tarea" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.findAll();

    return res.status(200).json({
      data: tasks,
    });
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return res.status(500).json({ message: "Error al obtener tareas" });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error al obtener tarea:", error);
    return res.status(500).json({ message: "Error al obtener tarea" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await task.update(req.body);

    return res.status(200).json({
      message: "Tarea actualizada",
      task,
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return res.status(500).json({ message: "Error al actualizar tarea" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await task.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return res.status(500).json({ message: "Error al eliminar tarea" });
  }
};
