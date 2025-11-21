import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getGeneralStats } from "../controllers/stats.controller";

const router = Router();

/**
 * @swagger
 * /stats/general:
 *   get:
 *     summary: Obtener estadísticas generales del usuario autenticado
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7d, 15d, 30d, 90d, 1y]
 *         description: Rango de fechas para análisis
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProjects:
 *                   type: number
 *                   example: 12
 *                 totalTasks:
 *                   type: number
 *                   example: 87
 *                 completedTasks:
 *                   type: number
 *                   example: 55
 *                 tasksByStatus:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: number
 *                       example: 10
 *                     inProgress:
 *                       type: number
 *                       example: 22
 *                     completed:
 *                       type: number
 *                       example: 55
 *                 tasksByPriority:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       value:
 *                         type: number
 *                 tasksOverTime:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: Jan
 *                       pending:
 *                         type: number
 *                         example: 4
 *                       inProgress:
 *                         type: number
 *                         example: 10
 *                       completed:
 *                         type: number
 *                         example: 5
 *                 activityByDay:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: string
 *                         format: date
 *                       tasks:
 *                         type: number
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/general", auth, getGeneralStats);

export default router;
