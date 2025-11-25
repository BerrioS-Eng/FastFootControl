"use client";
import React from "react";
import { reportsService } from "@/app/dashboard/reports/services/reports.services";
import type { ProductSalesCompareResponse } from "@/app/dashboard/reports/types";

export function useCompareProductSales(productId1: number | undefined, productId2: number | undefined) {
    const [data, setData] = React.useState<ProductSalesCompareResponse[] | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let on = true;
        (async () => {
            if (!productId1 || !productId2) return;
            try {
                setLoading(true);
                const res = await reportsService.compareProductSales(productId1, productId2);
                if (on) setData(res);
            } catch (e: any) {
                if (on) setError(e?.message ?? "Error comparando productos");
            } finally {
                if (on) setLoading(false);
            }
        })();
        return () => { on = false; };
    }, [productId1, productId2]);

    return { data, loading, error };
}