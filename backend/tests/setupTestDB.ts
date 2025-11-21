import sequelizeTest from "./test-db";
import request from "supertest";
import app from "../src/app";

export let TEST_TOKEN: string;

beforeAll(async () => {
  await sequelizeTest.sync({ force: true });

  const userRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

  if (userRes.status !== 201) {
    throw new Error("No se pudo crear usuario de test");
  }

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@example.com",
      password: "123456",
    });
  
  if (!loginRes.body.token) {
    throw new Error("No se pudo obtener TOKEN de test");
  }

  TEST_TOKEN = loginRes.body.token;
});

afterAll(async () => {
  await sequelizeTest.close();
});
