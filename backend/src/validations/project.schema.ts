import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nombre muy corto"),
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
  }),
});
