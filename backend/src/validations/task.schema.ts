import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    status: z.enum(["pending", "inProgress", "completed"]),
    priority: z.enum(["low", "mid", "high"]).default("low"),
    projectId: z.coerce.number().pipe(z.number().int().positive()).catch(() => {
      throw new Error("ID de proyecto inválido");
    }),
    assignedTo: z.coerce.number().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "inProgress", "completed"]).optional(),
    priority: z.enum(["low", "mid", "high"]).optional(),
    assignedTo: z.coerce.number().optional(),
  }),
});
