"use client";
import React from "react";
import type { TopProduct } from "@/app/dashboard/reports/types";
import { reportsService } from "@/app/dashboard/reports/services/reports.services";

interface UseTopProductsParams {
    startDate: string | undefined;
    endDate: string | undefined;
    topNumber?: number; // default 5
    enabled?: boolean; // default true
}

export function useTopProducts({ startDate, endDate, topNumber = 5, enabled = true }: UseTopProductsParams) {
    const [data, setData] = React.useState<TopProduct[] | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Normalizamos topNumber (buenas prácticas y UX defensivo)
    const safeTop = Math.max(1, Math.min(50, Number.isFinite(topNumber) ? Number(topNumber) : 5));

    React.useEffect(() => {
        let on = true;
        (async () => {
            if (!enabled) return;
            if (!startDate || !endDate) return;
            try {
                setLoading(true);
                const res = await reportsService.getTopProducts(startDate, endDate, safeTop);
                if (on) setData(res ?? []);
            } catch (e: any) {
                if (on) setError(e?.message ?? "Error cargando top de productos");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => { on = false; };
    }, [startDate, endDate, safeTop, enabled]);

    return { data, loading, error };
}