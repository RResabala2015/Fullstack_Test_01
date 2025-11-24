import { Request, Response } from "express";
import sequelize from "../config/db";
import { performance } from "perf_hooks";

export const healthApp = (req: Request, res: Response) => {
  const start = performance.now();

  const latency = performance.now() - start;

  return res.json({
    status: "OK",
    service: "app",
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    latency_ms: latency.toFixed(2),
  });
};

export const healthDB = async (req: Request, res: Response) => {
  const start = performance.now();

  try {
    await sequelize.query("SELECT 1");

    const latency = performance.now() - start;

    return res.json({
      status: "OK",
      service: "database",
      timestamp: new Date().toISOString(),
      db_latency_ms: latency.toFixed(2),
      uptime_seconds: process.uptime(),
    });
  } catch (error: any) {
    return res.status(503).json({
      status: "ERROR",
      service: "database",
      error: error.message,
    });
  }
};
