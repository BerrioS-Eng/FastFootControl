"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProductSalesCompareResponse } from "@/app/dashboard/reports/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ProductCompareChartProps {
    data: ProductSalesCompareResponse[] | null;
}

export function ProductCompareChart({ data }: ProductCompareChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Comparación gráfica de productos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Ingrese 2 IDs de producto para ver la comparación.
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Tomamos máximo 2 productos (la API está pensada para comparar 2)
    const productos = data.slice(0, 2);

    const unidadesData = productos.map((p) => ({
        name: p.productName,
        unidades: p.totalUnitSold,
    }));

    const ventasData = productos.map((p) => ({
        name: p.productName,
        ventas: Number(p.totalSalesValue),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comparación gráfica de productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Gráfico de unidades */}
                <div className="h-56">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        Unidades vendidas
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={unidadesData}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                formatter={(value: any) => [value, "Unidades"]}
                            />
                            <Bar
                                dataKey="unidades"
                                name="Unidades"
                                fill="#3b82f6" // blue-500
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de ventas */}
                <div className="h-56">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        Valor de ventas
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ventasData}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis
                                tickFormatter={(v) =>
                                    v.toLocaleString("es-CO", { maximumFractionDigits: 0 })
                                }
                            />
                            <Tooltip
                                formatter={(value: any) => [
                                    formatCurrency(Number(value), "es-CO", "COP"),
                                    "Ventas",
                                ]}
                            />
                            <Bar
                                dataKey="ventas"
                                name="Ventas"
                                fill="#22c55e" // green-500
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}