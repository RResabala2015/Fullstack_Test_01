import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(4, "Mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
