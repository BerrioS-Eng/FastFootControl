"use client";
import React from "react";
import { reportsService } from "@/app/dashboard/reports/services/reports.services";
import type { SalesCompare } from "@/app/dashboard/reports/types";

export function useCompareSales(startDate1: string, endDate1: string, startDate2: string, endDate2: string) {
    const [data, setData] = React.useState<SalesCompare | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let on = true;
        (async () => {
            try {
                setLoading(true);
                const res = await reportsService.compareSales(startDate1, endDate1, startDate2, endDate2);
                if (on) setData(res);
            } catch (e: any) {
                if (on) setError(e?.message ?? "Error comparando ventas");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => { on = false; };
    }, [startDate1, endDate1, startDate2, endDate2]);

    return { data, loading, error };
}