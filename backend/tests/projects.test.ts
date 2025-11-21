import request from "supertest";
import app from "../src/app";
import { TEST_TOKEN } from "./setupTestDB";

describe("CRUD Projects (Integration Tests)", () => {
  let createdId: number;

  test("POST /projects debe crear un proyecto", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        name: "Proyecto Jest",
        description: "Testing con SQLite in-memory",
      });

    expect(res.status).toBe(201);
    expect(res.body.project).toBeDefined();
    createdId = res.body.project.id;
  });

  test("GET /projects debe listar proyectos", async () => {
    const res = await request(app)
    .get("/api/projects")
    .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /projects/:id debe obtener el proyecto", async () => {
    const res = await request(app)
    .get(`/api/projects/${createdId}`)
    .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    expect(res.body.id).toBe(createdId);
  });

  test("PUT /projects/:id debe actualizar un proyecto", async () => {
    const res = await request(app)
      .put(`/api/projects/${createdId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ name: "Proyecto Modificado", description: "Testing con SQLite in-memory test 2" });
    expect(res.status).toBe(200);
    expect(res.body.project.name).toBeDefined();
    expect(res.body.project.name).toBe("Proyecto Modificado");
    expect(res.body.project.description).toBeDefined();
    expect(res.body.project.description).toBe("Testing con SQLite in-memory test 2");
  });

  test("DELETE /projects/:id debe eliminar un proyecto", async () => {
    const res = await request(app)
        .delete(`/api/projects/${createdId}`)
        .set("Authorization", `Bearer ${TEST_TOKEN}`);
    expect(res.status).toBe(204);
  });
});
