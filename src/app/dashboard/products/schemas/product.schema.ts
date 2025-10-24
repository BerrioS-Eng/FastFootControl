import { z } from 'zod';

export const productCreateSchema = z.object({
    productName: z.string().min(2, {
        message: "El nombre del producto debe tener al menos 2 caracteres.",
    }),
    laborCoast: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El costo de mano de obra debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El costo de mano de obra debe ser mayor o igual a 0.",
        }),
    profitMargin: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El margen de ganancia debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El margen de ganancia debe ser mayor o igual a 0.",
        }),
    netPrice: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El precio neto debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El precio neto debe ser mayor o igual a 0.",
        }),
    salePrice: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El precio de venta debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El precio de venta debe ser mayor o igual a 0.",
        }),
    inputListIngredients: z
        .array(
            z.object({
                nombre: z.string().min(1, "El nombre del ingrediente es requerido."),
                precio: z
                    .string()
                    .regex(/^\d*\.?\d*$/, "El precio debe ser un número válido.")
                    .refine((val) => parseFloat(val) >= 0 || val === '', {
                        message: "El precio debe ser mayor o igual a 0.",
                    }),
            })
        )
        .optional(),
    inputListDirects: z
        .array(
            z.object({
                nombre: z.string().min(1, "El nombre del costo directo es requerido."),
                precio: z
                    .string()
                    .regex(/^\d*\.?\d*$/, "El precio debe ser un número válido.")
                    .refine((val) => parseFloat(val) >= 0 || val === '', {
                        message: "El precio debe ser mayor o igual a 0.",
                    }),
            })
        )
        .optional(),
});

export const productEditSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductEditInput = z.infer<typeof productEditSchema>;