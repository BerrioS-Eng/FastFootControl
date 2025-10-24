import { http } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/config";
import type { SaleDTO, SaleRequest } from "@/app/dashboard/sales/types";

export const SalesAPI = {
    register: (payload: SaleRequest) =>
        http<SaleDTO>(ENDPOINTS.sales, "/register-sale", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    // Ejemplos futuros (comentados hasta que el back esté listo):
    // getById: (id: string | number) => http<SaleDTO>(ENDPOINTS.sales, `/get-sale?id=${id}`),
    // getAll: () => http<SaleDTO[]>(ENDPOINTS.sales, "/get-all-sales"),
};