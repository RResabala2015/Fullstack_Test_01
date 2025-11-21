import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Contraseña requerida"),
  }),
});
