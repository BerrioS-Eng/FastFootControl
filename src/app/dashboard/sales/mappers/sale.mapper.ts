import { SaleFormData, SaleInProgress, SaleRequest } from "@/app/dashboard/sales/types";
import { v4 as uuidv4 } from "uuid";

export const toSaleInProgress = (
    data: SaleFormData,
    fallbackId?: string
): SaleInProgress => ({
    id: data.id ?? fallbackId ?? uuidv4(),
    concept: data.concept,
    totalPrice: data.totalPrice,
    paymentMethod: data.paymentMethod,
    products: data.products ?? [],
    saleDate: data.saleDate, // asegúrate de que exista en el tipo
});

const toLocalDateTime = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`; // sin Z ni milisegundos
};

export const toSaleRequest = (f: SaleFormData): SaleRequest => ({
    concept: f.concept,
    paymentMethod: f.paymentMethod,
    saleDate: toLocalDateTime(f.saleDate),
    items: f.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
    })),
});