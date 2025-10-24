import { http } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/config";
import type { SaleDTO, SaleRequest } from "@/app/dashboard/sales/types";

export function toYmd(date: string | Date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export const SalesAPI = {
    register: (payload: SaleRequest) =>
        http<SaleDTO>(ENDPOINTS.sales, "/register-sale", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    getByDay: (date: string | Date) => {
        const ymd = toYmd(date);
        return http<SaleDTO[]>(ENDPOINTS.sales, `/get-sales-by-day?date=${ymd}`);
    },
    // Ejemplos futuros (comentados hasta que el back esté listo):
    // getById: (id: string | number) => http<SaleDTO>(ENDPOINTS.sales, `/get-sale?id=${id}`),
    // getAll: () => http<SaleDTO[]>(ENDPOINTS.sales, "/get-all-sales"),
};