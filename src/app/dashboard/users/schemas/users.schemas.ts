import { z } from "zod";

export const UserBaseSchema = z.object({
    userName: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    role: z.enum(["ADMIN", "WORKER"], {
        message: "Rol inválido",
    }),
});

export const UserCreateSchema = UserBaseSchema.extend({
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const UserEditSchema = UserBaseSchema.extend({
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .optional()
        .or(z.literal("")),
});