import { Request, Response } from "express";
import Project from "../models/Project.model";

export const createProject = async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  res.json({ message: "Proyecto creado", project });
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await Project.findAll();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
  res.json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

  await project.update(req.body);

  res.json({ message: "Proyecto actualizado", project });
};

export const deleteProject = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

  await project.destroy();

  res.json({ message: "Proyecto eliminado" });
};
