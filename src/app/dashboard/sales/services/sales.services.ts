import type { SaleDTO, SaleRequest } from "@/app/dashboard/sales/types";
import { SalesAPI } from "@/app/dashboard/sales/api/sales";

export const salesService = {
    register: (data: SaleRequest): Promise<SaleDTO> => SalesAPI.register(data),
    getByDayNow: (): Promise<SaleDTO[]> => SalesAPI.getByDayNow(),
};
