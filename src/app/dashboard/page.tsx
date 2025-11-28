"use client";
import React, {useEffect, useMemo, useState} from "react";
import {useSalesByDay} from "@/app/dashboard/sales/hooks/useSalesByDay";
import {useTopProductsByDay} from "@/app/dashboard/reports/hooks/useTopProductsByDay";
import type {SaleDTO} from "@/app/dashboard/sales/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import type {TopProduct} from "@/app/dashboard/reports/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {todayLocalYmd} from "@/app/dashboard/sales/api/sales";
import {formatCurrency} from "@/lib/utils";
import {useAuth} from "@/app/dashboard/users/hooks/useAuth";
import {
    IconShoppingCart,
    IconCurrencyDollar,
    IconClockHour4,
    IconCrown,
} from "@tabler/icons-react";
import {useSalesInProgress} from "@/app/dashboard/sales/hooks/useSaleInProgress";

/** Devuelve el saludo según la hora local */
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
}

export default function PageDashboard() {
    const [dateYmd] = useState(todayLocalYmd());
    const {user} = useAuth();
    const {sales: salesInProgress} = useSalesInProgress();

    const {data: sales, loading: salesLoading, error: salesError} = useSalesByDay(dateYmd);
    const {
        data: topProducts,
        loading: topLoading,
        error: topError,
    } = useTopProductsByDay(dateYmd, 3);

    const loading = salesLoading || topLoading;
    const error = salesError || topError;

    const {totalSalesCount, totalAmount, validSalesForTable} = useMemo(() => {
        const valid = (Array.isArray(sales) ? sales : []).filter(
            (s): s is SaleDTO =>
                s != null && s.saleId != null && String(s.saleId) !== "",
        );
        const count = valid.length;
        const amount = valid.reduce(
            (acc: number, s: SaleDTO) => acc + (Number(s.totalPrice) || 0),
            0,
        );
        return {totalSalesCount: count, totalAmount: amount, validSalesForTable: valid};
    }, [sales]);

    const greeting = getGreeting();
    const todayLabel = useMemo(
        () =>
            new Date(dateYmd).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        [dateYmd],
    );

    const firstName =
        user?.userName?.split(" ")[0] ?? user?.userName ?? "Usuario";

    const top1: TopProduct | undefined =
        Array.isArray(topProducts) && topProducts.length > 0
            ? topProducts[0]
            : undefined;

    const pendingOrdersCount = salesInProgress.length;

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Hero de bienvenida */}
            <div
                className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-[#FF9800] to-[#FF3D00] text-white shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Círculo decorativo inferior derecho */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/10"/>

                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        {greeting}, {firstName}
                    </h1>
                    <p className="text-sm md:text-base opacity-90">
                        Bienvenido al sistema DeliChicharrones.
                    </p>
                </div>
                <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
                    <span
                        className="inline-flex items-center text-sm rounded-full bg-white/15 px-4 py-1 font-semibold uppercase tracking-wide">
                        {todayLabel}
                    </span>
                </div>
            </div>

            {/* Cards resumen (4 columnas en desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Número de ventas */}
                <Card
                    className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                    <div
                        className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/10"/>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">
                            Número de ventas
                        </CardTitle>
                        <IconShoppingCart className="h-5 w-5 opacity-80"/>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-8 w-20 bg-white/30"/>
                        ) : (
                            <div className="text-3xl font-bold">
                                {totalSalesCount}
                            </div>
                        )}
                        <p className="mt-1 text-xs text-white/80">
                            Ventas registradas hoy
                        </p>
                    </CardContent>
                </Card>

                {/* Total vendido */}
                <Card
                    className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
                    <div
                        className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/10"/>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">
                            Total vendido hoy
                        </CardTitle>
                        <IconCurrencyDollar className="h-5 w-5 opacity-80"/>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-8 w-28 bg-white/30"/>
                        ) : (
                            <div className="text-3xl font-bold">
                                {formatCurrency(totalAmount, "es-CO", "COP")}
                            </div>
                        )}
                        <p className="mt-1 text-xs text-white/80">
                            Ingresos del día
                        </p>
                    </CardContent>
                </Card>

                {/* Órdenes pendientes (localStorage) */}
                <Card
                    className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md">
                    <div
                        className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/10"/>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">
                            Órdenes pendientes
                        </CardTitle>
                        <IconClockHour4 className="h-5 w-5 opacity-80"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingOrdersCount}</div>
                        <p className="mt-1 text-xs text-white/80">
                            En preparación / sin cerrar
                        </p>
                    </CardContent>
                </Card>

                {/* Top de productos */}
                <Card
                    className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md">
                    <div
                        className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/10"/>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">
                            Top producto del día
                        </CardTitle>
                        <IconCrown className="h-5 w-5 opacity-80"/>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40 bg-white/30"/>
                                <Skeleton className="h-4 w-24 bg-white/25"/>
                            </div>
                        ) : top1 ? (
                            <div>
                                <div className="text-sm font-semibold truncate">
                                    {top1.productName}
                                </div>
                                <p className="mt-1 text-xs text-white/80">
                                    {top1.totalSold} unidades vendidas hoy
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-white/80">Sin datos para hoy</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de ventas */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle>Ventas del día</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Detalle de las ventas registradas para {dateYmd}
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-full"/>
                            <Skeleton className="h-9 w-full"/>
                            <Skeleton className="h-9 w-full"/>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border bg-white">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/40">
                                            <TableHead className="w-1/2">
                                                Concepto
                                            </TableHead>
                                            <TableHead className="w-1/4">
                                                Método de pago
                                            </TableHead>
                                            <TableHead className="w-1/4 text-right">
                                                Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {validSalesForTable.map((s, idx) => (
                                            <TableRow
                                                key={String(s.saleId)}
                                                className={
                                                    idx % 2 === 0
                                                        ? "bg-white hover:bg-muted/40"
                                                        : "bg-muted/10 hover:bg-muted/50"
                                                }
                                            >
                                                <TableCell className="font-medium">
                                                    {s.concept || "Sin concepto"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full px-3 py-0.5 text-xs"
                                                    >
                                                        {s.paymentMethod}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatCurrency(
                                                        Number(s.totalPrice),
                                                        "es-CO",
                                                        "COP",
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {validSalesForTable.length === 0 && (
                                            <TableRow key="empty">
                                                <TableCell
                                                    colSpan={3}
                                                    className="h-24 text-center text-sm text-muted-foreground"
                                                >
                                                    No hay ventas registradas para{" "}
                                                    {dateYmd}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}