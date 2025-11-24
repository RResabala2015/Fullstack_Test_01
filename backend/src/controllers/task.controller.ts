import { Response } from "express";
import Task from "../models/Task.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Op, OrderItem } from "sequelize";

interface TaskFilters {
  projectId?: number;
  userId?: number;
  status?: string;
  priority?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  search?: string;
}

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

export const getTasksByFilters = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Query params received:', req.query);

    const {
      projectId,
      userId,
      status,
      priority,
      sort = 'createdAt',
      order = 'DESC',
      startDate,
      endDate,
      search,
    } = req.query as TaskFilters;

    // Construir objeto where dinámico
    const where: any = {};

    // Filtro por proyecto
    if (projectId) {
      const projectIdNum = Number(projectId);
      if (!isNaN(projectIdNum) && projectIdNum > 0) {
        where.projectId = projectIdNum;
        console.log('Filtering by projectId:', projectIdNum);
      }
    }

    // Filtro por usuario asignado
    if (userId) {
      const userIdNum = Number(userId);
      if (!isNaN(userIdNum) && userIdNum > 0) {
        where.assignedTo = userIdNum;
        console.log('Filtering by userId:', userIdNum);
      }
    }

    // Filtro por estado
    if (status && status !== 'all') {
      const validStatuses = ['pending', 'inProgress', 'completed'];
      if (validStatuses.includes(status as string)) {
        where.status = status;
        console.log('Filtering by status:', status);
      }
    }

    // Filtro por prioridad
    if (priority && priority !== 'all') {
      const validPriorities = ['low', 'mid', 'high'];
      if (validPriorities.includes(priority as string)) {
        where.priority = priority;
        console.log('Filtering by priority:', priority);
      }
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        try {
          where.createdAt[Op.gte] = new Date(startDate as string);
          console.log('Filtering from date:', startDate);
        } catch (error) {
          console.error('Invalid startDate format:', startDate);
        }
      }
      if (endDate) {
        try {
          where.createdAt[Op.lte] = new Date(endDate as string);
          console.log('Filtering to date:', endDate);
        } catch (error) {
          console.error('Invalid endDate format:', endDate);
        }
      }
    }

    // Búsqueda de texto (en título y descripción)
    if (search && search !== '') {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
      console.log('Searching for:', search);
    }

    // Construir ordenamiento
    const validSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];
    const sortField = validSortFields.includes(sort as string) ? sort : 'createdAt';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
    
    const orderBy: OrderItem[] = [[sortField as string, sortOrder]];

    // Consultar base de datos
    const tasks = await Task.findAll({
      where,
      order: orderBy,
    });

    return res.status(200).json({
      data: tasks,
      filters: {
        projectId: projectId || null,
        userId: userId || null,
        status: status || null,
        priority: priority || null,
        sort: sortField,
        order: sortOrder,
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
      },
      count: tasks.length,
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
