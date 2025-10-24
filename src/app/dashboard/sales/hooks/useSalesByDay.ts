"use client";
import React from "react";
import type { SaleDTO } from "@/app/dashboard/sales/types";
import { salesService } from "@/app/dashboard/sales/services/sales.services";

export function useSalesByDay(dateYmd: string) {
    const [data, setData] = React.useState<SaleDTO[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let on = true;
        (async () => {
            try {
                setLoading(true);
                const res = await salesService.getByDay(dateYmd);
                if (!on) return;
                const normalized = Array.isArray(res)
                    ? res.filter((s: any) => s && s.id != null && s.id !== "")
                    : [];
                setData(normalized);
            } catch (e: any) {
                setError(e?.message ?? "Error cargando ventas del día");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => {
            on = false;
        };
    }, [dateYmd]);

    return { data, loading, error };
}