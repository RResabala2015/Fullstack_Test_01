import request from "supertest";
import app from "../src/app";

describe("GET /api/health/app", () => {
  it("should return application health status OK", async () => {
    const res = await request(app).get("/api/health/app");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
    expect(res.body.service).toBe("app");
    expect(res.body).toHaveProperty("uptime_seconds");
    expect(res.body).toHaveProperty("latency_ms");
  });
});
