import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  }),
  params: z.object({
    id: z.coerce.number(),
  }),
});
