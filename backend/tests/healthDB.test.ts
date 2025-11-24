import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/db";

jest.mock("../src/config/db", () => ({
  query: jest.fn(),
}));

describe("GET /api/health/db", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return database health OK when connection works", async () => {
    (sequelize.query as jest.Mock).mockResolvedValueOnce([1]);

    const res = await request(app).get("/api/health/db");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
    expect(res.body.service).toBe("database");
    expect(res.body).toHaveProperty("db_latency_ms");
  });

  it("should return ERROR when database connection fails", async () => {
    (sequelize.query as jest.Mock).mockRejectedValueOnce(
      new Error("DB connection failed")
    );

    const res = await request(app).get("/api/health/db");

    expect(res.status).toBe(503);
    expect(res.body.status).toBe("ERROR");
    expect(res.body.service).toBe("database");
    expect(res.body.error).toBe("DB connection failed");
  });
});
