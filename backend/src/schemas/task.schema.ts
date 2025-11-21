import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    status: z.enum(["pending", "in_progress", "completed"]),
    priority: z.enum(["low", "medium", "high"]).default("low"),
    projectId: z.string().uuid("ID de proyecto inválido"),
    assignedTo: z.string().uuid().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "in_progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    assignedTo: z.string().uuid().optional(),
  }),
});
