import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import Project from "../models/Project.model";
import Task from "../models/Task.model";

interface RangeMap {
  [key: string]: number;
}

export const getGeneralStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const range = (req.query.range as string) || "30d";

    const rangeMap: RangeMap = {
      "7d": 7,
      "15d": 15,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    const days = rangeMap[range] || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // ---------------------------------------------------------
    // 1. Total Projects
    // ---------------------------------------------------------
    const totalProjects = await Project.count({
      where: { ownerId: userId },
    });

    // ---------------------------------------------------------
    // 2. Total Tasks
    // ---------------------------------------------------------
    const totalTasks = await Task.count({
      where: { assignedTo: userId },
    });

    // ---------------------------------------------------------
    // 3. Completed Tasks
    // ---------------------------------------------------------
    const completedTasks = await Task.count({
      where: { assignedTo: userId, status: "completed" },
    });

    // ---------------------------------------------------------
    // 4. Tasks by Status
    // ---------------------------------------------------------
    const tasksByStatusRaw = await Task.findAll({
      raw: true,
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
      ],
      where: { assignedTo: userId },
      group: ["status"],
    });

    const tasksByStatus = { pending: 0, inProgress: 0, completed: 0 };

    tasksByStatusRaw.forEach((row: any) => {
      const status = row.status as keyof typeof tasksByStatus;
      tasksByStatus[status] = Number(row.count);
    });

    // ---------------------------------------------------------
    // 5. Tasks by Priority
    // ---------------------------------------------------------
    const tasksByPriorityRaw = await Task.findAll({
      raw: true,
      attributes: [
        "priority",
        [Sequelize.fn("COUNT", Sequelize.col("priority")), "count"],
      ],
      where: { assignedTo: userId },
      group: ["priority"],
    });

    const tasksByPriority = { low: 0, mid: 0, high: 0 };

    tasksByPriorityRaw.forEach((row: any) => {
      const priority = row.priority as keyof typeof tasksByPriority;
      tasksByPriority[priority] = Number(row.count);
    });

    // ---------------------------------------------------------
    // 6. Activity by Day
    // ---------------------------------------------------------
    const activityByDay = await Task.findAll({
      raw: true,
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

    // ---------------------------------------------------------
    // 7. Tasks Over Time (Year-Month Aggregation)
    // ---------------------------------------------------------
    const tasksOverTimeRaw = await Task.findAll({
      raw: true,
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
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
      group: ["year", "month"],
      order: [
        ["year", "ASC"],
        ["month", "ASC"],
      ],
    });

    const tasksOverTime = tasksOverTimeRaw.map((row: any) => {
      const date = `${row.year}-${String(row.month).padStart(2, "0")}-01`;

      return {
        date: new Date(date).toLocaleString("en-US", { month: "short" }),
        pending: Number(row.pending),
        inProgress: Number(row.inProgress),
        completed: Number(row.completed),
      };
    });

    // ---------------------------------------------------------
    // Response
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
