import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {SalesSummaryProjection} from "@/app/dashboard/reports/types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface SalesSummaryChartProps {
    data: SalesSummaryProjection[] | null;
    loading: boolean;
}

export function SalesSummaryChart({data, loading}: SalesSummaryChartProps) {
    const chartData = (data ?? []).map((d) => ({
        date: d.date,
        totalSales: Number(d.totalSales),
        totalOrders: d.totalOrders,
    }));

    return (
        <Card
            className="border border-border/60 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-background to-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold tracking-tight">
                    Ventas diarias (gráfico)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Evolución diaria de ventas y pedidos.
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
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted"/>
                            <XAxis
                                dataKey="date"
                                tick={{fontSize: 12}}
                                tickMargin={8}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{fontSize: 12}}
                                tickFormatter={(v) => v.toLocaleString("es-CO")}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{fontSize: 12}}
                            />
                            <Tooltip
                                formatter={(value: any, name) => {
                                    if (name === "Ventas") {
                                        return [
                                            value.toLocaleString("es-CO", {
                                                style: "currency",
                                                currency: "COP",
                                                maximumFractionDigits: 0,
                                            }),
                                            "Ventas",
                                        ];
                                    }
                                    return [value, name === "Pedidos" ? "Pedidos" : name];
                                }}
                            />
                            <Legend/>
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="totalSales"
                                name="Ventas"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="totalOrders"
                                name="Pedidos"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{r: 2}}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}