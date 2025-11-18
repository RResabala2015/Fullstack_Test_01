import { Request, Response } from "express";
import Task from "../models/Task.model";

export const createTask = async (req: Request, res: Response) => {
  const task = await Task.create(req.body);
  res.json({ message: "Tarea creada", task });
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

  await task.update(req.body);

  res.json({ message: "Tarea actualizada", task });
};

export const deleteTask = async (req: Request, res: Response) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

  await task.destroy();

  res.json({ message: "Tarea eliminada" });
};
