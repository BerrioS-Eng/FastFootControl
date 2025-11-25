"use client";
import React from "react";
import { reportsService } from "@/app/dashboard/reports/services/reports.services";
import type { GrowMonthlyRatio } from "@/app/dashboard/reports/types";

export function useSalesGrowth(startDate: string, endDate: string) {
    const [data, setData] = React.useState<GrowMonthlyRatio[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let on = true;
        (async () => {
            try {
                setLoading(true);
                const res = await reportsService.getSalesGrowth(startDate, endDate);
                if (on) setData(res);
            } catch (e: any) {
                if (on) setError(e?.message ?? "Error cargando crecimiento de ventas");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => { on = false; };
    }, [startDate, endDate]);

    return { data, loading, error };
}