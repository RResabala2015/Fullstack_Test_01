import request from "supertest";
import app from "../src/app";

describe("Auth - Login", () => {
  test("POST /auth/login debe autenticar y devolver un token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /auth/login debe fallar con credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "fail@example.com",
        password: "wrongpass",
      });

    expect(res.status).toBe(404);
  });
});
