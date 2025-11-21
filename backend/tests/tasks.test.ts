import request from "supertest";
import app from "../src/app";
import { TEST_TOKEN } from "./setupTestDB";

describe("CRUD Tasks (Integration Tests)", () => {
  let createdTaskId: number;
  let createdProjectId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        name: "Proyecto para Tasks",
        description: "Proyecto de prueba para tareas",
      });
    createdProjectId = res.body.project.id;
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/projects/${createdProjectId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
  });

  describe("POST /tasks", () => {
    test("debe crear una tarea con datos válidos", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "Tarea de prueba",
          description: "Descripción de la tarea",
          status: "pending",
          priority: "mid",
          projectId: createdProjectId,
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Tarea creada");
      expect(res.body.task).toBeDefined();
      expect(res.body.task.title).toBe("Tarea de prueba");
      expect(res.body.task.status).toBe("pending");
      expect(res.body.task.priority).toBe("mid");

      createdTaskId = res.body.task.id;
    });

    test("debe crear una tarea con prioridad high", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "Tarea urgente",
          description: "Tarea de alta prioridad",
          status: "pending",
          priority: "high",
          projectId: createdProjectId,
        });

      expect(res.status).toBe(201);
      expect(res.body.task.priority).toBe("high");
    });

    test("debe crear una tarea con status inProgress", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "Tarea en progreso",
          description: "Ya comenzada",
          status: "inProgress",
          priority: "low",
          projectId: createdProjectId,
        });

      expect(res.status).toBe(201);
      expect(res.body.task.status).toBe("inProgress");
    });

    test("debe fallar sin token de autorización", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({
          title: "Tarea sin auth",
          description: "No debería crearse",
          status: "pending",
          priority: "low",
        });

      expect(res.status).toBe(401);
    });

    test("debe fallar con datos incompletos", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "Solo título",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /tasks", () => {
    test("debe listar todas las tareas", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${TEST_TOKEN}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("debe fallar sin token de autorización", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /tasks/:id", () => {
    test("debe obtener una tarea por ID", async () => {
      const res = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdTaskId);
      expect(res.body.title).toBe("Tarea de prueba");
      expect(res.body.description).toBe("Descripción de la tarea");
    });

    test("debe retornar 404 para tarea inexistente", async () => {
      const res = await request(app)
        .get("/api/tasks/99999")
        .set("Authorization", `Bearer ${TEST_TOKEN}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Tarea no encontrada");
    });

    test("debe fallar sin token de autorización", async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /tasks/:id", () => {
    test("debe actualizar el título de una tarea", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "Tarea actualizada",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Tarea actualizada");
      expect(res.body.task.title).toBe("Tarea actualizada");
    });

    test("debe actualizar el status a inProgress", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          status: "inProgress",
        });

      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe("inProgress");
    });

    test("debe actualizar el status a completed", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          status: "completed",
        });

      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe("completed");
    });

    test("debe actualizar la prioridad", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          priority: "high",
        });

      expect(res.status).toBe(200);
      expect(res.body.task.priority).toBe("high");
    });

    test("debe actualizar múltiples campos", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "Tarea completamente modificada",
          description: "Nueva descripción",
          status: "pending",
          priority: "low",
        });

      expect(res.status).toBe(200);
      expect(res.body.task.title).toBe("Tarea completamente modificada");
      expect(res.body.task.description).toBe("Nueva descripción");
      expect(res.body.task.status).toBe("pending");
      expect(res.body.task.priority).toBe("low");
    });

    test("debe retornar 404 para tarea inexistente", async () => {
      const res = await request(app)
        .put("/api/tasks/99999")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          title: "No existe",
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Tarea no encontrada");
    });

    test("debe fallar sin token de autorización", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({ title: "Sin auth" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /tasks/:id", () => {
    test("debe eliminar una tarea existente", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`);

      expect(res.status).toBe(204);
    });

    test("debe confirmar que la tarea fue eliminada", async () => {
      const res = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`);

      expect(res.status).toBe(404);
    });

    test("debe retornar 404 para tarea inexistente", async () => {
      const res = await request(app)
        .delete("/api/tasks/99999")
        .set("Authorization", `Bearer ${TEST_TOKEN}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Tarea no encontrada");
    });

    test("debe fallar sin token de autorización", async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(401);
    });
  });
});

describe("Task Status Transitions", () => {
  let taskId: number;
  let projectId: number;

  beforeAll(async () => {
    const projectRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ name: "Status Test Project", description: "Testing" });
    projectId = projectRes.body.project.id;

    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        title: "Status Test Task",
        description: "For status testing",
        status: "pending",
        priority: "mid",
        projectId,
      });
    taskId = taskRes.body.task.id;
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
  });

  test("pending -> inProgress", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ status: "inProgress" });

    expect(res.status).toBe(200);
    expect(res.body.task.status).toBe("inProgress");
  });

  test("inProgress -> completed", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ status: "completed" });

    expect(res.status).toBe(200);
    expect(res.body.task.status).toBe("completed");
  });

  test("completed -> pending (reopen)", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ status: "pending" });

    expect(res.status).toBe(200);
    expect(res.body.task.status).toBe("pending");
  });
});

describe("Task Priority Tests", () => {
  let taskId: number;
  let projectId: number;

  beforeAll(async () => {
    const projectRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ name: "Priority Test Project", description: "Testing" });
    projectId = projectRes.body.project.id;
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
  });

  test.each(["low", "mid", "high"])("debe crear tarea con prioridad %s", async (priority) => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        title: `Tarea ${priority}`,
        description: `Prioridad ${priority}`,
        status: "pending",
        priority,
        projectId,
      });

    expect(res.status).toBe(201);
    expect(res.body.task.priority).toBe(priority);
  });
});