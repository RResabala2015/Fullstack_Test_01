import request from "supertest";
import app from "../src/app";
import Project from "../src/models/Project.model";
import Task from "../src/models/Task.model";

// 🔹 Mock completo de modelos Sequelize
jest.mock("../src/models/Project.model");
jest.mock("../src/models/Task.model");

describe("GET /api/stats (getGeneralStats)", () => {

  const mockUser = { id: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAuth = (req: any) => {
    req.user = mockUser;
    return req;
  };

  /**
   * 🛠 Mock del middleware de autenticación
   * Para que Supertest pueda enviar req.user sin JWT
   */
  jest.mock("../src/middleware/auth.middleware", () => ({
    authMiddleware: (req: any, res: any, next: any) => {
      req.user = mockUser;
      next();
    }
  }));

  it("should return stats successfully", async () => {

    // 1. totalProjects
    (Project.count as jest.Mock).mockResolvedValue(3);

    // 2. totalTasks
    (Task.count as jest.Mock).mockResolvedValueOnce(12);

    // 3. completedTasks
    (Task.count as jest.Mock).mockResolvedValueOnce(5);

    // 4. tasksByStatus
    (Task.findAll as jest.Mock).mockResolvedValueOnce([
      { status: "todo", dataValues: { count: 4 } },
      { status: "in_progress", dataValues: { count: 3 } },
      { status: "done", dataValues: { count: 5 } }
    ]);

    // 5. tasksByPriority
    (Task.findAll as jest.Mock).mockResolvedValueOnce([
      { priority: "low", dataValues: { count: 6 } },
      { priority: "mid", dataValues: { count: 3 } },
      { priority: "high", dataValues: { count: 2 } },
    ]);

    // 6. activityByDay
    (Task.findAll as jest.Mock).mockResolvedValueOnce([
      { dataValues: { day: "2025-11-18", tasks: 3 } },
      { dataValues: { day: "2025-11-19", tasks: 4 } },
    ]);

    // 7. tasksOverTime
    (Task.findAll as jest.Mock).mockResolvedValueOnce([
      {
        dataValues: {
          date: "2025-11",
          todo: 2,
          in_progress: 3,
          done: 1
        }
      }
    ]);

    const res = await request(app).get("/api/stats");

    expect(res.status).toBe(200);

    expect(res.body.totalProjects).toBe(3);
    expect(res.body.totalTasks).toBe(12);
    expect(res.body.completedTasks).toBe(5);

    expect(res.body.tasksByStatus.todo).toBe(4);
    expect(res.body.tasksByStatus.in_progress).toBe(3);
    expect(res.body.tasksByStatus.done).toBe(5);

    expect(res.body.tasksByPriority.low).toBe(6);
    expect(res.body.tasksByPriority.mid).toBe(3);
    expect(res.body.tasksByPriority.high).toBe(2);

    expect(res.body.activityByDay.length).toBe(2);
    expect(res.body.tasksOverTime.length).toBe(1);
  });

  it("should return 500 if an error occurs", async () => {
    (Project.count as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/api/stats");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error al generar estadísticas");
  });
});
