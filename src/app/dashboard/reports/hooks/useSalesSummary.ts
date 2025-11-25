"use client";
import React from "react";
import { reportsService } from "@/app/dashboard/reports/services/reports.services";
import type { SalesSummaryProjection } from "@/app/dashboard/reports/types";

export function useSalesSummary(startDate: string, endDate?: string) {
    const [data, setData] = React.useState<SalesSummaryProjection[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let on = true;
        (async () => {
            try {
                setLoading(true);
                const res = await reportsService.getSalesSummary(startDate, endDate);
                if (on) setData(res);
            } catch (e: any) {
                if (on) setError(e?.message ?? "Error cargando resumen de ventas");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => {
            on = false;
        };
    }, [startDate, endDate]);

    return { data, loading, error };
}