import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import Project from "../models/Project.model";
import Task from "../models/Task.model";

interface StatsRangeMap {
  [key: string]: number;
}

export const getGeneralStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const range = (req.query.range as string) || "30d";

    const daysMap: StatsRangeMap = {
      "7d": 7,
      "15d": 15,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    const days = daysMap[range] || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // ---------------------------------------------------------
    // 1. Total proyectos del usuario
    // ---------------------------------------------------------
    const totalProjects = await Project.count({
      where: { ownerId: userId },
    });

    // ---------------------------------------------------------
    // 2. Total de tareas asignadas
    // ---------------------------------------------------------
    const totalTasks = await Task.count({
      where: { assignedTo: userId },
    });

    // ---------------------------------------------------------
    // 3. Tareas completadas
    // ---------------------------------------------------------
    const completedTasks = await Task.count({
      where: { assignedTo: userId, status: "done" },
    });

    // ---------------------------------------------------------
    // 4. Tareas por estado
    // ---------------------------------------------------------
    const tasksByStatusRaw = await Task.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
      ],
      where: { assignedTo: userId },
      group: ["status"],
    });

    const tasksByStatus = {
      todo: 0,
      in_progress: 0,
      done: 0,
    };

    tasksByStatusRaw.forEach((row: any) => {
      tasksByStatus[row.status as keyof typeof tasksByStatus] = Number(row.dataValues.count);
    });

    // ---------------------------------------------------------
    // 5. Tareas por prioridad
    // ---------------------------------------------------------
    const tasksByPriorityRaw = await Task.findAll({
      attributes: [
        "priority",
        [Sequelize.fn("COUNT", Sequelize.col("priority")), "count"],
      ],
      where: { assignedTo: userId },
      group: ["priority"],
    });

    const tasksByPriority = {
      low: 0,
      mid: 0,
      high: 0,
    };

    tasksByPriorityRaw.forEach((row: any) => {
      tasksByPriority[row.priority as keyof typeof tasksByPriority] = Number(row.dataValues.count);
    });

    // ---------------------------------------------------------
    // 6. Actividad por día
    // ---------------------------------------------------------
    const activityByDayRaw = await Task.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"),
          "day",
        ],
        [Sequelize.fn("COUNT", "*"), "tasks"],
      ],
      where: {
        assignedTo: userId,
        createdAt: { [Op.gte]: fromDate },
      },
      group: ["day"],
      order: [[Sequelize.literal("day"), "ASC"]],
    });

    const activityByDay = activityByDayRaw.map((row: any) => ({
      day: row.dataValues.day,
      tasks: Number(row.dataValues.tasks),
    }));

    // ---------------------------------------------------------
    // 7. Tareas agrupadas por mes (para gráficos)
    // ---------------------------------------------------------
    const tasksOverTimeRaw = await Task.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],

        // Conteos por estado
        [
          Sequelize.literal(
            `SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`
          ),
          "pending",
        ],
        [
          Sequelize.literal(
            `SUM(CASE WHEN status = 'inProgress' THEN 1 ELSE 0 END)`
          ),
          "inProgress",
        ],
        [
          Sequelize.literal(
            `SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`
          ),
          "completed",
        ],
      ],
      where: {
        assignedTo: userId,
        createdAt: { [Op.gte]: fromDate },
      },
      group: [
        Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
      ],
      order: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "ASC"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"],
      ],
      raw: true,
    });

    const tasksOverTime = tasksOverTimeRaw.map((row: any) => {
      const rawDate = row.dataValues.date; // '2025-11'
      const monthName = new Date(rawDate + "-01").toLocaleString("en-US", {
        month: "short",
      });

      return {
        date: monthName,
        todo: Number(row.dataValues.todo),
        inProgress: Number(row.dataValues.in_progress),
        completed: Number(row.dataValues.done),
      };
    });

    // ---------------------------------------------------------
    // Respuesta final
    // ---------------------------------------------------------
    return res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      tasksByStatus,
      tasksByPriority,
      tasksOverTime,
      activityByDay,
    });
  } catch (error) {
    console.error("Error en estadísticas:", error);
    return res
      .status(500)
      .json({ message: "Error al generar estadísticas", error });
  }
};
