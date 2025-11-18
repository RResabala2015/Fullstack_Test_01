import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Platform API",
      version: "1.0.0",
      description: "API para la plataforma de gestión de proyectos y tareas",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            name: { type: "string", example: "Renato Resabala" },
            email: { type: "string", example: "renato@example.com" },
            createdAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
            updatedAt: { type: "string", example: "2025-01-02T00:00:00.000Z" },
          },
        },

        UpdateUserInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Nuevo Nombre",
            },
            email: {
              type: "string",
              example: "nuevo@email.com",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: Express) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger disponible en http://localhost:3000/api/docs");
};
