import request from "supertest";
import app from "../src/app";
import { TEST_TOKEN, userId } from "./setupTestDB";

describe("CRUD Users (Integration Tests)", () => {

  test("GET /users debe listar usuarios", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /users/:id debe obtener un usuario", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  test("PUT /users/:id debe actualizar un usuario", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ name: "Usuario Modificado" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Usuario Modificado");
  });

  test("DELETE /users/:id debe eliminar un usuario", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(204);
  });
});
