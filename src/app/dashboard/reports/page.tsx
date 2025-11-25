"use client";
import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Skeleton} from "@/components/ui/skeleton";
import {formatCurrency} from "@/lib/utils";
import {
    useSalesSummary,
} from "@/app/dashboard/reports/hooks/useSalesSummary";
import {useMonthlySales} from "@/app/dashboard/reports/hooks/useMonthlySales";
import {useSalesGrowth} from "@/app/dashboard/reports/hooks/useSalesGrowth";
import {useCompareSales} from "@/app/dashboard/reports/hooks/useCompareSales";
import {useTopProducts} from "@/app/dashboard/reports/hooks/useTopProducts";
import {useCompareProductSales} from "@/app/dashboard/reports/hooks/useCompareProductSales";
import type {
    GrowMonthlyRatio,
    ProductSalesCompareResponse
} from "@/app/dashboard/reports/types";
import {todayLocalYmd} from "@/app/dashboard/sales/api/sales";
import {SalesSummaryChart} from "@/app/dashboard/reports/components/SaleSummaryChart";
import {MonthlySalesChart} from "@/app/dashboard/reports/components/MonthlySalesChart";
import {TopProductsChart} from "@/app/dashboard/reports/components/TopProductChart";
import {ProductCompareChart} from "@/app/dashboard/reports/components/ProductCompareChart";
import {useAuth} from "@/app/dashboard/users/hooks/useAuth";
import {IconAlertTriangle} from "@tabler/icons-react";


export default function ReportsPage() {
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";

    // Filtros básicos
    const [startDate, setStartDate] = React.useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        const m = `${d.getMonth() + 1}`.padStart(2, "0");
        const day = `${d.getDate()}`.padStart(2, "0");
        return `${d.getFullYear()}-${m}-${day}`;
    });
    const [endDate, setEndDate] = React.useState(todayLocalYmd());
    const [topNumber, setTopNumber] = React.useState(5);

    // Comparación de rangos
    const [startDate1, setStartDate1] = React.useState(startDate);
    const [endDate1, setEndDate1] = React.useState(endDate);
    const [startDate2, setStartDate2] = React.useState(startDate);
    const [endDate2, setEndDate2] = React.useState(endDate);

    // Comparación de productos
    const [productId1, setProductId1] = React.useState<number | undefined>();
    const [productId2, setProductId2] = React.useState<number | undefined>();

    // Data hooks
    const {data: summary, loading: loadingSummary, error: errorSummary} = useSalesSummary(startDate, endDate);
    const {data: monthly, loading: loadingMonthly, error: errorMonthly} = useMonthlySales(startDate, endDate);
    const {data: growth, loading: loadingGrowth, error: errorGrowth} = useSalesGrowth(startDate, endDate);
    const {
        data: compare,
        loading: loadingCompare,
        error: errorCompare
    } = useCompareSales(startDate1, endDate1, startDate2, endDate2);
    const {data: topProductsRange, loading: loadingTopRange, error: errorTopRange} = useTopProducts({
        startDate,
        endDate,
        topNumber,
        enabled: true,
    });
    const {
        data: prodCompare,
        loading: loadingProdCmp,
        error: errorProdCmp
    } = useCompareProductSales(productId1, productId2);

    const anyLoading = loadingSummary || loadingMonthly || loadingGrowth || loadingCompare || loadingTopRange || loadingProdCmp;
    const anyError = errorSummary || errorMonthly || errorGrowth || errorCompare || errorTopRange || errorProdCmp;

    if (!isAdmin) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600">
                        <IconAlertTriangle className="h-5 w-5"/>
                        <h1 className="font-semibold text-lg">Acceso restringido</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Solo los usuarios con rol <span className="font-semibold">ADMIN</span> pueden
                        ver reportes.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {anyError && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{anyError}</AlertDescription>
                </Alert>
            )}

            {/* Filtros generales */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Inicio</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Fin</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Top productos</label>
                        <Input
                            type="number"
                            min={1}
                            max={20}
                            value={topNumber}
                            onChange={(e) =>
                                setTopNumber(parseInt(e.target.value || "5", 10))
                            }
                        />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={() => { /* Los hooks ya reaccionan a estado */
                        }}>
                            Aplicar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* GRID RESPONSIVO DE REPORTES */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-max">
                {/* Resumen de ventas por día */}
                <Card className="md:col-span-2 xl:col-span-2 h-full">
                    <CardHeader>
                        <CardTitle>Resumen de ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingSummary ? (
                            <Skeleton className="h-8 w-full"/>
                        ) : (
                            <div className="overflow-x-auto">
                                <SalesSummaryChart data={summary} loading={loadingSummary}/>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Ventas mensuales */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Ventas mensuales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingMonthly ? (
                            <Skeleton className="h-8 w-full"/>
                        ) : (
                            <div className="overflow-x-auto">
                                <MonthlySalesChart data={monthly} loading={loadingMonthly}/>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Crecimiento mensual */}
                <Card className="md:col-span-2 xl:col-span-1 h-full">
                    <CardHeader>
                        <CardTitle>Crecimiento mensual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingGrowth ? (
                            <Skeleton className="h-8 w-full"/>
                        ) : (
                            <div className="space-y-2">
                                {(growth ?? []).map((g: GrowMonthlyRatio, idx) => (
                                    <div key={`${g.months}-${idx}`} className="flex items-center gap-4">
                                        <div className="w-40 text-sm text-muted-foreground">{g.months}</div>
                                        <div className="flex-1 bg-muted h-2 rounded">
                                            <div
                                                className={`h-2 rounded ${
                                                    g.growthRatio >= 0 ? "bg-emerald-500" : "bg-rose-500"
                                                }`}
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.abs(g.growthRatio * 100)
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                        <div
                                            className={`w-20 text-right ${
                                                g.growthRatio >= 0
                                                    ? "text-emerald-600"
                                                    : "text-rose-600"
                                            }`}
                                        >
                                            {(g.growthRatio * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                                {(growth ?? []).length === 0 && (
                                    <div className="text-sm text-muted-foreground">Sin datos</div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top productos */}
                <Card className="md:col-span-2 xl:col-span-2 h-full">
                    <CardHeader>
                        <CardTitle>Top productos del día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingTopRange ? (
                            <Skeleton className="h-8 w-full"/>
                        ) : (
                            <div className="overflow-x-auto">
                                <TopProductsChart
                                    data={topProductsRange}
                                    loading={loadingTopRange}
                                    topNumber={topNumber}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Comparar ventas entre rangos */}
                <Card className="md:col-span-2 xl:col-span-3 h-full">
                    <CardHeader>
                        <CardTitle>Comparar ventas entre rangos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Inicio 1</label>
                                <Input
                                    type="date"
                                    value={startDate1}
                                    onChange={(e) => setStartDate1(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Fin 1</label>
                                <Input
                                    type="date"
                                    value={endDate1}
                                    onChange={(e) => setEndDate1(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Inicio 2</label>
                                <Input
                                    type="date"
                                    value={startDate2}
                                    onChange={(e) => setStartDate2(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Fin 2</label>
                                <Input
                                    type="date"
                                    value={endDate2}
                                    onChange={(e) => setEndDate2(e.target.value)}
                                />
                            </div>
                        </div>

                        {loadingCompare ? (
                            <Skeleton className="h-8 w-full"/>
                        ) : compare ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">Periodo 1</div>
                                    <div className="text-xl font-bold">
                                        {formatCurrency(
                                            Number(compare.totalPeriod1),
                                            "es-CO",
                                            "COP"
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">Periodo 2</div>
                                    <div className="text-xl font-bold">
                                        {formatCurrency(
                                            Number(compare.totalPeriod2),
                                            "es-CO",
                                            "COP"
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">Diferencia</div>
                                    <div
                                        className={`text-xl font-bold ${
                                            compare.diff >= 0
                                                ? "text-emerald-600"
                                                : "text-rose-600"
                                        }`}
                                    >
                                        {formatCurrency(
                                            Number(compare.diff),
                                            "es-CO",
                                            "COP"
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">Crecimiento</div>
                                    <div
                                        className={`text-xl font-bold ${
                                            compare.growthPercentage >= 0
                                                ? "text-emerald-600"
                                                : "text-rose-600"
                                        }`}
                                    >
                                        {(Number(compare.growthPercentage) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">Sin datos</div>
                        )}
                    </CardContent>
                </Card>

                {/* Comparar dos productos */}
                <Card className="md:col-span-2 xl:col-span-3 h-full">
                    <CardHeader>
                        <CardTitle>Comparar ventas de productos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Producto 1 (ID)</label>
                                <Input
                                    type="number"
                                    value={productId1 ?? ""}
                                    onChange={(e) =>
                                        setProductId1(
                                            e.target.value ? Number(e.target.value) : undefined
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Producto 2 (ID)</label>
                                <Input
                                    type="number"
                                    value={productId2 ?? ""}
                                    onChange={(e) =>
                                        setProductId2(
                                            e.target.value ? Number(e.target.value) : undefined
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {loadingProdCmp ? (
                            <Skeleton className="h-8 w-full"/>
                        ) : (
                            <>
                                {/* Gráfico de comparación */}
                                <ProductCompareChart data={prodCompare}/>

                                {/* Tabla de detalle */}
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Producto</TableHead>
                                                <TableHead className="text-right">Unidades vendidas</TableHead>
                                                <TableHead className="text-right">Valor de ventas</TableHead>
                                                <TableHead className="text-right">Δ Unidades</TableHead>
                                                <TableHead className="text-right">Δ Ventas</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(prodCompare ?? []).map(
                                                (p: ProductSalesCompareResponse, idx) => (
                                                    <TableRow key={`${p.productName}-${idx}`}>
                                                        <TableCell className="font-medium">
                                                            {p.productName}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {p.totalUnitSold}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {formatCurrency(
                                                                Number(p.totalSalesValue),
                                                                "es-CO",
                                                                "COP"
                                                            )}
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-right ${
                                                                p.unitsDiff >= 0
                                                                    ? "text-emerald-600"
                                                                    : "text-rose-600"
                                                            }`}
                                                        >
                                                            {p.unitsDiff}
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-right ${
                                                                p.salesValueDiff >= 0
                                                                    ? "text-emerald-600"
                                                                    : "text-rose-600"
                                                            }`}
                                                        >
                                                            {formatCurrency(
                                                                Number(p.salesValueDiff),
                                                                "es-CO",
                                                                "COP"
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                            {(prodCompare ?? []).length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={5}
                                                        className="text-center text-sm text-muted-foreground"
                                                    >
                                                        Ingrese 2 IDs de producto para ver la comparación
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}