"use client";
import React, {useMemo} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Skeleton} from "@/components/ui/skeleton";
import {formatCurrency} from "@/lib/utils";
import {useSalesSummary} from "@/app/dashboard/reports/hooks/useSalesSummary";
import {useMonthlySales} from "@/app/dashboard/reports/hooks/useMonthlySales";
import {useSalesGrowth} from "@/app/dashboard/reports/hooks/useSalesGrowth";
import {useCompareSales} from "@/app/dashboard/reports/hooks/useCompareSales";
import {useTopProducts} from "@/app/dashboard/reports/hooks/useTopProducts";
import {useCompareProductSales} from "@/app/dashboard/reports/hooks/useCompareProductSales";
import type {GrowMonthlyRatio, ProductSalesCompareResponse} from "@/app/dashboard/reports/types";
import {todayLocalYmd} from "@/app/dashboard/sales/api/sales";
import {SalesSummaryChart} from "@/app/dashboard/reports/components/SaleSummaryChart";
import {MonthlySalesChart} from "@/app/dashboard/reports/components/MonthlySalesChart";
import {TopProductsChart} from "@/app/dashboard/reports/components/TopProductChart";
import {ProductCompareChart} from "@/app/dashboard/reports/components/ProductCompareChart";
import {useAuth} from "@/app/dashboard/users/hooks/useAuth";
import {IconAlertTriangle, IconChartBar, IconCalendar} from "@tabler/icons-react";
import {ChartFilterBar} from "@/app/dashboard/reports/components/ChartFilterBar";
import {useDateRangeFilter} from "@/app/dashboard/reports/hooks/useDateRangeFilter";
import {ReportSectionCard} from "@/app/dashboard/reports/components/ReportSectionCard";

export default function ReportsPage() {
    const {role, authLoading} = useAuth();
    const isAdmin = role === "ADMIN";

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 border-2 border-primary border-b-transparent rounded-full animate-spin"/>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600">
                        <IconAlertTriangle className="h-5 w-5"/>
                        <h1 className="font-semibold text-lg">Acceso restringido</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Solo los usuarios con rol <span className="font-semibold">ADMIN</span> pueden ver reportes.
                    </p>
                </div>
            </div>
        );
    }

    // Solo ADMIN
    return <ReportsAdminContent/>;
}

// Helper reutilizable para fecha inicial (30 días atrás)
function getDefaultStartDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

function ReportsAdminContent() {
    // Resumen de ventas diarias (también se usa para el hero)
    const summaryFilter = useDateRangeFilter({
        defaultStart: getDefaultStartDate(),
        defaultEnd: todayLocalYmd(),
    });

    // Ventas mensuales
    const monthlyFilter = useDateRangeFilter({
        defaultStart: getDefaultStartDate(),
        defaultEnd: todayLocalYmd(),
    });

    // Crecimiento mensual
    const growthFilter = useDateRangeFilter({
        defaultStart: getDefaultStartDate(),
        defaultEnd: todayLocalYmd(),
    });

    // Top productos (rango de fechas con número de top)
    const topFilter = useDateRangeFilter({
        defaultStart: getDefaultStartDate(),
        defaultEnd: todayLocalYmd(),
    });
    const [topNumberInput, setTopNumberInput] = React.useState(5);
    const [topNumber, setTopNumber] = React.useState(5);
    const applyTopFilters = () => {
        topFilter.apply();
        setTopNumber(topNumberInput);
    };

    // Comparación de rangos (dos filtros de fecha)
    const compareFilter1 = useDateRangeFilter({
        defaultStart: getDefaultStartDate(),
        defaultEnd: todayLocalYmd(),
    });
    const compareFilter2 = useDateRangeFilter({
        defaultStart: getDefaultStartDate(),
        defaultEnd: todayLocalYmd(),
    });
    const applyCompareRanges = () => {
        compareFilter1.apply();
        compareFilter2.apply();
    };

    // Comparación de productos (IDs, no fechas)
    const [productId1Input, setProductId1Input] = React.useState<string>("");
    const [productId2Input, setProductId2Input] = React.useState<string>("");
    const [productId1, setProductId1] = React.useState<number | undefined>();
    const [productId2, setProductId2] = React.useState<number | undefined>();
    const applyProductCompare = () => {
        setProductId1(productId1Input ? Number(productId1Input) : undefined);
        setProductId2(productId2Input ? Number(productId2Input) : undefined);
    };

    // ====== HOOKS DE DATOS POR GRÁFICO ======

    const {data: summary, loading: loadingSummary, error: errorSummary} =
        useSalesSummary(summaryFilter.start, summaryFilter.end);

    const {data: monthly, loading: loadingMonthly, error: errorMonthly} =
        useMonthlySales(monthlyFilter.start, monthlyFilter.end);

    const {data: growth, loading: loadingGrowth, error: errorGrowth} =
        useSalesGrowth(growthFilter.start, growthFilter.end);

    const {
        data: compare,
        loading: loadingCompare,
        error: errorCompare,
    } = useCompareSales(
        compareFilter1.start,
        compareFilter1.end,
        compareFilter2.start,
        compareFilter2.end,
    );

    const {
        data: topProductsRange,
        loading: loadingTopRange,
        error: errorTopRange,
    } = useTopProducts({
        startDate: topFilter.start,
        endDate: topFilter.end,
        topNumber,
        enabled: Boolean(topFilter.start && topFilter.end),
    });

    const {
        data: prodCompare,
        loading: loadingProdCmp,
        error: errorProdCmp,
    } = useCompareProductSales(productId1, productId2);

    const anyLoading =
        loadingSummary ||
        loadingMonthly ||
        loadingGrowth ||
        loadingCompare ||
        loadingTopRange ||
        loadingProdCmp;

    const anyError =
        errorSummary ||
        errorMonthly ||
        errorGrowth ||
        errorCompare ||
        errorTopRange ||
        errorProdCmp;

    // Totales para el hero usando el rango aplicado del resumen
    const {totalSalesRange, totalOrdersRange} = useMemo(() => {
        const list = summary ?? [];
        const totalSalesRange = list.reduce(
            (acc, s) => acc + Number(s.totalSales ?? 0),
            0,
        );
        const totalOrdersRange = list.reduce(
            (acc, s) => acc + Number(s.totalOrders ?? 0),
            0,
        );
        return {totalSalesRange, totalOrdersRange};
    }, [summary]);

    const rangeLabel = `${summaryFilter.start} → ${summaryFilter.end}`;

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {/* Hero */}
            <div
                className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-[#4F46E5] via-[#EC4899] to-[#F97316] text-white shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* ... hero unchanged, pero usando rangeLabel, totalSalesRange, totalOrdersRange ... */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/10"/>
                <div className="relative z-10 flex items-start gap-3">
                    <div
                        className="hidden sm:flex h-10 w-10 rounded-full bg-white/20 items-center justify-center my-auto">
                        <IconChartBar className="h-5 w-5"/>
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-1">Análisis</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Reportes de ventas
                        </h1>
                        <p className="text-sm md:text-base opacity-90">
                            Explora el rendimiento del negocio por periodos, productos y ventas.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm items-center">
                                <span
                                    className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold gap-1">
                                    <IconCalendar className="h-3 w-3"/>
                                    Rango: {rangeLabel}
                                </span>
                            {!anyLoading && (
                                <>
                                        <span
                                            className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                            Total ventas:&nbsp;
                                            {formatCurrency(
                                                totalSalesRange,
                                                "es-CO",
                                                "COP",
                                            )}
                                        </span>
                                    <span
                                        className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                            Pedidos:&nbsp;{totalOrdersRange}
                                        </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {anyError && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{anyError}</AlertDescription>
                </Alert>
            )}

            {/* GRID RESPONSIVO DE REPORTES */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-max">
                {/* Resumen de ventas por día */}
                <ReportSectionCard
                    className="md:col-span-2 xl:col-span-2 h-full"
                    title="Resumen de ventas diarias"
                    description="Ajusta el rango y luego aplica los filtros para actualizar la gráfica."
                    loading={loadingSummary}
                    headerExtras={
                        <ChartFilterBar
                            startValue={summaryFilter.startInput}
                            endValue={summaryFilter.endInput}
                            onChangeStart={summaryFilter.setStartInput}
                            onChangeEnd={summaryFilter.setEndInput}
                            onApply={summaryFilter.apply}
                            cols={3}
                        />
                    }
                >
                    <div className="overflow-x-auto">
                        <SalesSummaryChart data={summary} loading={loadingSummary}/>
                    </div>
                </ReportSectionCard>

                {/* Ventas mensuales */}
                <ReportSectionCard
                    className="h-full"
                    title="Ventas mensuales"
                    description="Selecciona el rango para agrupar las ventas por mes."
                    loading={loadingMonthly}
                    headerExtras={
                        <ChartFilterBar
                            startValue={monthlyFilter.startInput}
                            endValue={monthlyFilter.endInput}
                            onChangeStart={monthlyFilter.setStartInput}
                            onChangeEnd={monthlyFilter.setEndInput}
                            onApply={monthlyFilter.apply}
                            cols={3}
                        />
                    }
                >
                    <div className="overflow-x-auto">
                        <MonthlySalesChart data={monthly} loading={loadingMonthly}/>
                    </div>
                </ReportSectionCard>

                {/* Crecimiento mensual */}
                <ReportSectionCard
                    className="md:col-span-2 xl:col-span-1 h-full"
                    title="Crecimiento mensual"
                    description="Compara el crecimiento entre meses dentro del rango seleccionado."
                    loading={loadingGrowth}
                    headerExtras={
                        <ChartFilterBar
                            startValue={growthFilter.startInput}
                            endValue={growthFilter.endInput}
                            onChangeStart={growthFilter.setStartInput}
                            onChangeEnd={growthFilter.setEndInput}
                            onApply={growthFilter.apply}
                            cols={3}
                        />
                    }
                >
                    <div className="space-y-2">
                        {(growth ?? []).map((g: GrowMonthlyRatio, idx) => (
                            <div key={`${g.months}-${idx}`} className="flex items-center gap-4">
                                <div className="w-40 text-sm text-muted-foreground">
                                    {g.months}
                                </div>
                                <div className="flex-1 bg-muted h-2 rounded">
                                    <div
                                        className={`h-2 rounded ${
                                            g.growthRatio >= 0 ? "bg-emerald-500" : "bg-rose-500"
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.abs(g.growthRatio * 100),
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
                </ReportSectionCard>

                {/* Top productos */}
                <ReportSectionCard
                    className="md:col-span-2 xl:col-span-2 h-full"
                    title="Top productos en rango"
                    description="Define el rango y la cantidad de productos a mostrar."
                    loading={loadingTopRange}
                    headerExtras={
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground">Inicio</label>
                                <Input
                                    type="date"
                                    value={topFilter.startInput}
                                    onChange={(e) => topFilter.setStartInput(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Fin</label>
                                <Input
                                    type="date"
                                    value={topFilter.endInput}
                                    onChange={(e) => topFilter.setEndInput(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Top productos</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={topNumberInput}
                                    onChange={(e) =>
                                        setTopNumberInput(
                                            Number.isNaN(Number(e.target.value))
                                                ? 5
                                                : Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={applyTopFilters}
                                >
                                    Aplicar filtros
                                </Button>
                            </div>
                        </div>
                    }
                >
                    <div className="overflow-x-auto">
                        <TopProductsChart
                            data={topProductsRange}
                            loading={loadingTopRange}
                            topNumber={topNumber}
                        />
                    </div>
                </ReportSectionCard>

                {/* Comparar ventas entre rangos */}
                <ReportSectionCard
                    className="md:col-span-2 xl:col-span-3 h-full"
                    title="Comparar ventas entre rangos"
                    description="Ajusta los dos rangos y presiona aplicar para actualizar la comparación."
                    loading={loadingCompare}
                    headerExtras={
                        <div className="space-y-3">
                            {/* Fila rango 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Inicio 1</label>
                                    <Input
                                        type="date"
                                        className="w-full"
                                        value={compareFilter1.startInput}
                                        onChange={(e) =>
                                            compareFilter1.setStartInput(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Fin 1</label>
                                    <Input
                                        type="date"
                                        className="w-full"
                                        value={compareFilter1.endInput}
                                        onChange={(e) =>
                                            compareFilter1.setEndInput(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Fila rango 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Inicio 2</label>
                                    <Input
                                        type="date"
                                        className="w-full"
                                        value={compareFilter2.startInput}
                                        onChange={(e) =>
                                            compareFilter2.setStartInput(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Fin 2</label>
                                    <Input
                                        type="date"
                                        className="w-full"
                                        value={compareFilter2.endInput}
                                        onChange={(e) =>
                                            compareFilter2.setEndInput(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Botón único */}
                            <div className="flex justify-stretch sm:justify-end">
                                <Button
                                    type="button"
                                    className="w-full sm:w-auto"
                                    onClick={applyCompareRanges}
                                >
                                    Aplicar filtros
                                </Button>
                            </div>
                        </div>
                    }
                >
                    {compare ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-muted rounded">
                                <div className="text-sm text-muted-foreground">Periodo 1</div>
                                <div className="text-xl font-bold">
                                    {formatCurrency(
                                        Number(compare.totalPeriod1),
                                        "es-CO",
                                        "COP",
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-muted rounded">
                                <div className="text-sm text-muted-foreground">Periodo 2</div>
                                <div className="text-xl font-bold">
                                    {formatCurrency(
                                        Number(compare.totalPeriod2),
                                        "es-CO",
                                        "COP",
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-muted rounded">
                                <div className="text-sm text-muted-foreground">Diferencia</div>
                                <div
                                    className={`text-xl font-bold ${
                                        compare.diff >= 0 ? "text-emerald-600" : "text-rose-600"
                                    }`}
                                >
                                    {formatCurrency(
                                        Number(compare.diff),
                                        "es-CO",
                                        "COP",
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
                </ReportSectionCard>

                {/* Comparar dos productos */}
                <ReportSectionCard
                    className="md:col-span-2 xl:col-span-3 h-full"
                    title="Comparar ventas de productos"
                    description="Ingresa los IDs de producto y aplica los filtros para ver la comparación."
                    loading={loadingProdCmp}
                    headerExtras={
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:items-end">
                            {/* Inicio 1 */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-muted-foreground">Inicio 1</label>
                                <Input
                                    type="date"
                                    className="w-full"
                                    value={compareFilter1.startInput}
                                    onChange={(e) => compareFilter1.setStartInput(e.target.value)}
                                />
                            </div>

                            {/* Fin 1 */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-muted-foreground">Fin 1</label>
                                <Input
                                    type="date"
                                    className="w-full"
                                    value={compareFilter1.endInput}
                                    onChange={(e) => compareFilter1.setEndInput(e.target.value)}
                                />
                            </div>

                            {/* Inicio 2 */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-muted-foreground">Inicio 2</label>
                                <Input
                                    type="date"
                                    className="w-full"
                                    value={compareFilter2.startInput}
                                    onChange={(e) => compareFilter2.setStartInput(e.target.value)}
                                />
                            </div>

                            {/* Fin 2 */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-muted-foreground">Fin 2</label>
                                <Input
                                    type="date"
                                    className="w-full"
                                    value={compareFilter2.endInput}
                                    onChange={(e) => compareFilter2.setEndInput(e.target.value)}
                                />
                            </div>

                            {/* Botón único */}
                            <div className="flex justify-stretch md:justify-end">
                                <Button
                                    type="button"
                                    className="w-full md:w-auto md:min-w-[160px]"
                                    onClick={applyCompareRanges}
                                >
                                    Aplicar filtros
                                </Button>
                            </div>
                        </div>
                    }
                >
                    <>
                        <ProductCompareChart data={prodCompare}/>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-right">
                                            Unidades vendidas
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Valor de ventas
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Δ Unidades
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Δ Ventas
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(prodCompare ?? []).map((p: ProductSalesCompareResponse, idx) => (
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
                                                    "COP",
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
                                                    "COP",
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                </ReportSectionCard>
            </div>
        </div>
    );
}