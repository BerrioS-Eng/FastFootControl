// Login validation schemas
import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const userSchema = z.object({
  userName: z.string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string()
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
  fullName: z.string()
    .min(1, "El nombre completo es requerido")
    .min(2, "El nombre completo debe tener al menos 2 caracteres"),
  password: z.string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.string()
    .min(1, "El rol es requerido"),
  area: z.string()
    .min(1, "El área es requerida")
    .min(2, "El área debe tener al menos 2 caracteres"),
});

export const userEditSchema = userSchema.extend({
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")),
  area: z.string()
    .min(1, "El área es requerida")
    .min(2, "El área debe tener al menos 2 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;