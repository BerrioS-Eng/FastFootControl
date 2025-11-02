import { z } from "zod";
import { saleFormSchema } from "@/app/dashboard/sales/schemas/saleform.schema";

// Opcional: tipar los métodos de pago si quieres restringirlos
export type PaymentMethod = "Efectivo" | "Transferencia" | "Tarjeta" | "Otros" | string;

// Item de producto usado en el formulario y en el borrador (ventas en proceso)
export type SaleProductItem = {
    productId: number;
    name?: string;
    quantity: number;
    salePrice: number;
    totalPrice: number;
};

// Type del formulario inferido desde Zod para mantener 1 sola fuente de verdad
export type SaleFormData = z.infer<typeof saleFormSchema>;

// Estructura guardada en localStorage como "ventas en proceso"
export interface SaleInProgress {
    id: string;
    concept: string;
    paymentMethod: PaymentMethod; // o PaymentMethod si prefieres
    saleDate: string; // ISO (LocalDateTime)
    products: SaleProductItem[];
    totalPrice: number;
}

// Payload esperado por el backend al crear la venta
export interface SaleRequest {
    concept: string;
    paymentMethod: string;
    saleDate: string; // LocalDateTime sin Z
    items: Array<{
        productId: number;
        quantity: number;
    }>;
}

// Reexport del schema para usos donde necesites validar
export { saleFormSchema } from "@/app/dashboard/sales/schemas/saleform.schema";

export interface SaleDTO {
    saleId: string;        // ajusta a lo que devuelva el back
    concept: string;
    paymentMethod: string;
    saleDate: string;  // ISO
    totalPrice: number;
    items: Array<{ productId: number; quantity: number }>;
}