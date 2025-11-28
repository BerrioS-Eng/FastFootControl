import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {TopProduct} from "@/app/dashboard/reports/types";
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts";

interface TopProductsChartProps {
    data: TopProduct[] | null;
    loading: boolean;
    topNumber: number;
}

const COLORS = [
    "#22c55e", // green-500
    "#3b82f6", // blue-500
    "#f97316", // orange-500
    "#e11d48", // rose-600
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#facc15", // yellow-400
    "#16a34a", // green-600
];

export function TopProductsChart({
                                     data,
                                     loading,
                                     topNumber,
                                 }: TopProductsChartProps) {
    const sorted = [...(data ?? [])].sort(
        (a, b) => Number(b.totalSalesValue) - Number(a.totalSalesValue)
    );

    const chartData = sorted.slice(0, topNumber).map((p) => ({
        name: p.productName,
        value: Number(p.totalSalesValue),
    }));

    return (
        <Card
            className="border border-border/60 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-background to-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold tracking-tight">
                    Top productos (gráfico)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Productos con mayor valor de ventas en el rango seleccionado.
                </p>
            </CardHeader>
            <CardContent className="h-80 pt-0">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Cargando gráfica...
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Sin datos
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${entry.name}-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any, _name: any, entry: any) =>
                                    [
                                        value.toLocaleString("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                            maximumFractionDigits: 0,
                                        }),
                                        entry?.payload?.name ?? "Ventas",
                                    ] as [string, string]
                                }
                            />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{fontSize: 12}}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}