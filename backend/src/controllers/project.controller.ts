import { Response } from "express";
import Project from "../models/Project.model";
import User from "../models/User.model";
import ProjectUser from "../models/ProjectUser.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// Crear proyecto (ownerId = usuario que lo crea)
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user!.id;

    const project = await Project.create({
      ...req.body,
      ownerId,
    });

    res.status(201).json({
      message: "Proyecto creado exitosamente",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creando proyecto", error });
  }
};

// Listar con paginación
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await Project.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo proyectos", error });
  }
};

// Obtener un proyecto
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    const project = await Project.findByPk(id);

    if (!project)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    const isMember =
      project.ownerId === req.user!.id ||
      project.collaborators.some((u) => u.id === req.user!.id);

    if (!isMember)
      return res.status(403).json({ message: "No tienes acceso a este proyecto" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error consultando proyecto", error });
  }
};

// Actualizar (solo owner)
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user!.id;

    const project = await Project.findByPk(id);

    if (!project)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    if (project.ownerId !== userId)
      return res.status(403).json({ message: "No autorizado" });

    await project.update(req.body);

    res.status(200).json({
      message: "Proyecto actualizado",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando proyecto", error });
  }
};

// Eliminar (solo owner)
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user!.id;

    const project = await Project.findByPk(id);

    if (!project)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    if (project.ownerId !== userId)
      return res.status(403).json({ message: "No autorizado" });

    await project.destroy();

    res.status(204).json({ message: "Proyecto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando proyecto", error });
  }
};

// Añadir colaborador
export const addCollaborator = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    // Solo el owner puede añadir colaboradores
    if (project.ownerId !== req.user!.id)
      return res.status(403).json({ message: "No autorizado" });

    // El owner no se añade como colaborador
    if (project.ownerId === userId)
      return res.status(403).json({ message: "El dueño es un colaborador principal, no deberia agregarse como colaborador" });

    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Evitar duplicados
    const exists = await ProjectUser.findOne({
      where: { projectId, userId },
    });

    if (exists)
      return res.status(400).json({ message: "El usuario ya es colaborador" });

    await ProjectUser.create({
      projectId: projectId,
      userId: userId
    } as any);

    res.status(201).json({ message: "Colaborador agregado" });

  } catch (error) {
    res.status(500).json({ message: "Error al agregar colaborador", error });
  }
};

export const getCollaborators = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const links = await ProjectUser.findAll({
      where: { projectId },
      attributes: ["userId"],
    });

    const userIds = links.map(l => l.userId);

    if (userIds.length === 0) {
      return res.status(404).json({ collaborators: [] });
    }

    const collaborators = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "email"],
    });

    return res.status(200).json({ collaborators });

  } catch (error) {
    console.error("Error obteniendo colaboradores:", error);
    return res.status(500).json({
      message: "Error obteniendo colaboradores",
      error,
    });
  }
};

export const removeCollaborator = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const relation = await ProjectUser.findOne({
      where: { projectId, userId },
    });

    if (!relation) {
      return res
        .status(400)
        .json({ message: "El usuario no es colaborador del proyecto" });
    }

    await relation.destroy();

    return res.json({ message: "Colaborador eliminado" });
  } catch (error) {
    console.error("Error removiendo colaborador:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
