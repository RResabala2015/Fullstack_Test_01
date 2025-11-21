import sequelizeTest from "./test-db";
import request from "supertest";
import app from "../src/app";
import jwt from "jsonwebtoken";

export let TEST_TOKEN: string;
export let userId: number;

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

  const decoded = jwt.verify(TEST_TOKEN, process.env.JWT_SECRET as string) as { id: number };
  userId = decoded.id;

  if (!userId || typeof userId !== "number") {
    throw new Error("No se pudo obtener el id del usuario de test");
  }
});

afterAll(async () => {
  await sequelizeTest.close();
});
