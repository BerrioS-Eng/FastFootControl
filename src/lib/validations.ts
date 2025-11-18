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
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres"),
  email: z.string()
    .min(1, "El email es requerido")
    .email("Debe ser un email válido")
    .max(100, "El email no puede exceder 100 caracteres"),
  fullName: z.string()
    .min(1, "El nombre completo es requerido")
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(100, "El nombre completo no puede exceder 100 caracteres"),
  password: z.string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  role: z.enum(['ADMIN', 'MANAGER', 'WORKER'], {
    errorMap: () => ({ message: "Debe seleccionar un rol válido (ADMIN, MANAGER, WORKER)" })
  }),
  area: z.string()
    .min(1, "El área es requerida")
    .min(2, "El área debe tener al menos 2 caracteres")
    .max(50, "El área no puede exceder 50 caracteres"),
  status: z.enum(['activo', 'inactivo', 'descanso']).optional().default('activo'),
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