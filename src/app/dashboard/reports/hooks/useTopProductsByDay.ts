"use client";
import React from "react";
import type { TopProduct } from "@/app/dashboard/reports/types";
import { useTopProducts } from "./useTopProducts";

export function useTopProductsByDay(dateYmd: string, topNumber = 2) {
    // Reutilizamos el hook genérico forzando start=end
    const { data, loading, error } = useTopProducts({
        startDate: dateYmd,
        endDate: dateYmd,
        topNumber,
        enabled: Boolean(dateYmd),
    });

    return { data: (data as TopProduct[] | null), loading, error };
}