import { useCallback, useEffect, useState } from "react";
import { SaleInProgress } from "@/app/dashboard/sales/types";
import { loadSalesInProgress, removeSaleInProgress } from "@/app/dashboard/sales/utils/localStorage";

export const useSalesInProgress = () => {
    const [sales, setSales] = useState<SaleInProgress[]>([]);

    const reload = useCallback(() => setSales(loadSalesInProgress()), []);

    useEffect(() => { reload(); }, [reload]);

    // escuchar cambios en localStorage y evento custom
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key.includes("sale") || e.key.includes("sales")) {
                // si tu util usa una clave específica, verifica esa clave concreta
                reload();
            }
        };

        const onCustom = () => reload();

        window.addEventListener('storage', onStorage);
        window.addEventListener('route.ts-in-progress:changed', onCustom as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('route.ts-in-progress:changed', onCustom as EventListener);
        };
    }, [reload]);

    const remove = useCallback((id: string) => {
        removeSaleInProgress(id);
        reload();
    }, [reload]);

    return { sales, reload, remove };
};