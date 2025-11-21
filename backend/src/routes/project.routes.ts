import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addCollaborator,
} from "../controllers/project.controller";

import validate from "../middlewares/validate";
import {
  createProjectSchema,
  updateProjectSchema
} from "../validations/project.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gestión de proyectos y colaboradores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         ownerId:
 *           type: integer
 *         owner:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         collaborators:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *
 *
 *     CreateProjectInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Sistema de Inventarios
 *         description:
 *           type: string
 *
 *     UpdateProjectInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *
 *     AddCollaboratorInput:
 *       type: object
 *       required:
 *         - projectId
 *         - userId
 *       properties:
 *         projectId:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       200:
 *         description: Proyecto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 */
router.post("/", auth, validate(createProjectSchema), createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Listar proyectos con paginación
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista paginada de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get("/", auth, getProjects);


/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       403:
 *         description: El usuario no tiene acceso a este proyecto
 *       404:
 *         description: Proyecto no existe
 */
router.get("/:id", auth, getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto (solo owner)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectInput'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no existe
 */
router.put("/:id", auth, validate(updateProjectSchema), updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto (solo owner)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no existe
 */
router.delete("/:id", auth, deleteProject);

/**
 * @swagger
 * /api/projects/add-collaborator:
 *   post:
 *     summary: Añadir un colaborador al proyecto (solo owner)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCollaboratorInput'
 *     responses:
 *       200:
 *         description: Colaborador agregado correctamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Proyecto o usuario no existe
 */
router.post("/add-collaborator", auth, addCollaborator);

export default router;
