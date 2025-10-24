import { z } from "zod";
export const saleFormSchema = z.object({
    id: z.string().optional(),
    concept: z.string().min(1, "Requerido"),
    paymentMethod: z.string().min(1, "Requerido"),
    saleDate: z.string().datetime(), // ISO
    products: z.array(z.object({
        productId: z.number(),
        name: z.string().optional(),
        quantity: z.number().positive(),
        salePrice: z.number().nonnegative(),
        totalPrice: z.number().nonnegative(),
    })).min(1, "Agrega al menos un producto"),
    totalPrice: z.number().nonnegative(),
});