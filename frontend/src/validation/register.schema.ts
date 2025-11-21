import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña muy corta"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
