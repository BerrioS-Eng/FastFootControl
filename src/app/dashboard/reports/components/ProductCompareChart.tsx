"use client";

import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {ProductSalesCompareResponse} from "@/app/dashboard/reports/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {formatCurrency} from "@/lib/utils";

interface ProductCompareChartProps {
    data: ProductSalesCompareResponse[] | null;
}

export function ProductCompareChart({data}: ProductCompareChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="border border-border/60 shadow-sm bg-gradient-to-b from-background to-muted/40">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold tracking-tight">
                        Comparación gráfica de productos
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Ingrese 2 productos y aplique los filtros para ver la comparación.
                    </p>
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
        <Card
            className="border border-border/60 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-background to-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold tracking-tight">
                    Comparación gráfica de productos
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Unidades y valor de ventas para los productos seleccionados.
                </p>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Gráfico de unidades */}
                    <div className="h-56 w-full md:flex-1">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                            Unidades vendidas
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={unidadesData}>
                                <XAxis dataKey="name" tick={{fontSize: 12}}/>
                                <YAxis allowDecimals={false}/>
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
                    <div className="h-56 w-full md:flex-1">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                            Valor de ventas
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ventasData}>
                                <XAxis dataKey="name" tick={{fontSize: 12}}/>
                                <YAxis
                                    tickFormatter={(v) =>
                                        v.toLocaleString("es-CO", {maximumFractionDigits: 0})
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
                </div>
            </CardContent>
        </Card>
    );
}