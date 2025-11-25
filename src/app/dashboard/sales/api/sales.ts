import { http } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/config";
import type { SaleDTO, SaleRequest } from "@/app/dashboard/sales/types";

export function todayLocalYmd(): string {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
    ].join('-');
}


export const SalesAPI = {
    register: (payload: SaleRequest) =>
        http<SaleDTO>("", "/api/sales", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    getByDayNow: async (): Promise<SaleDTO[]> => {
        const ymd = todayLocalYmd();
        const data = await http<SaleDTO[]>("", `/api/sales?date=${ymd}`);
        // Si necesitas adaptar la forma, mantenlo. Si ya coincide, puedes retornar data directo.
        return (data ?? []).map((s): SaleDTO => ({
            saleId: String(s.saleId),
            concept: s.concept,
            paymentMethod: s.paymentMethod,
            saleDate: s.saleDate,
            totalPrice: s.totalPrice,
            items: s.items,
        }));
    },
    // getById: (id: string | number) => http<SaleDTO>(ENDPOINTS.route.ts, `/get-sale?id=${id}`),
    // getAll: () => http<SaleDTO[]>(ENDPOINTS.route.ts, "/get-all-route.ts"),
};