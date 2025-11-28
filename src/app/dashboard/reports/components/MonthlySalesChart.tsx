import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {MonthlySales} from "@/app/dashboard/reports/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

interface MonthlySalesChartProps {
    data: MonthlySales[] | null;
    loading: boolean;
}

export function MonthlySalesChart({data, loading}: MonthlySalesChartProps) {
    const chartData = (data ?? []).map((m) => ({
        period: `${m.year}-${String(m.month).padStart(2, "0")}`,
        totalSales: Number(m.totalSales),
    }));

    return (
        <Card
            className="border border-border/60 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-background to-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold tracking-tight">
                    Ventas mensuales (gráfico)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Total de ventas agrupadas por mes.
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
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted"/>
                            <XAxis dataKey="period" tick={{fontSize: 12}} tickMargin={8}/>
                            <YAxis
                                tick={{fontSize: 12}}
                                tickFormatter={(v) => v.toLocaleString("es-CO")}
                            />
                            <Tooltip
                                formatter={(value: any) =>
                                    value.toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                        maximumFractionDigits: 0,
                                    })
                                }
                            />
                            <Bar
                                dataKey="totalSales"
                                name="Ventas"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}