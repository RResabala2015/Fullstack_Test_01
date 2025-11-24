import { Router } from "express";
import { healthApp, healthDB } from "../controllers/health.controller";

const router = Router();

/**
 * @openapi
 * /health/app:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica el estado del servidor (sin BD)
 *     responses:
 *       200:
 *         description: El backend está funcionando.
 */
router.get("/app", healthApp);

/**
 * @openapi
 * /health/db:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica la conexión con la base de datos.
 *     responses:
 *       200:
 *         description: Conexión a la base de datos exitosa.
 *       500:
 *         description: Fallo en la conexión a la base de datos.
 */
router.get("/db", healthDB);

export default router;
