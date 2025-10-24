"use client";
import React from "react";
import type { TopProduct } from "@/app/dashboard/reports/types";
import { reportsService } from "@/app/dashboard/reports/services/reports.services";

export function useTopProductsByDay(dateYmd: string, topNumber = 2) {
    const [data, setData] = React.useState<TopProduct[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let on = true;
        (async () => {
            try {
                setLoading(true);
                const res = await reportsService.getTopProductsByDay(dateYmd, topNumber);
                if (on) setData(res);
            } catch (e: any) {
                setError(e?.message ?? "Error cargando top de productos");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => { on = false; };
    }, [dateYmd, topNumber]);

    return { data, loading, error };
}