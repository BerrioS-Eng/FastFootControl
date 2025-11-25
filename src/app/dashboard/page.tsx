"use client"
import React, {useState} from 'react'
import {useSalesByDay} from "@/app/dashboard/sales/hooks/useSalesByDay";
import {useTopProductsByDay} from "@/app/dashboard/reports/hooks/useTopProductsByDay";
import {SaleDTO} from "@/app/dashboard/sales/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {TopProduct} from "@/app/dashboard/reports/types";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {todayLocalYmd} from "@/app/dashboard/sales/api/sales";
import {formatCurrency} from "@/lib/utils";


export default function PageDashboard() {
    const [dateYmd] = useState(todayLocalYmd());

    const { data: sales, loading: salesLoading, error: salesError } = useSalesByDay(dateYmd);
    const { data: topProducts, loading: topLoading, error: topError } = useTopProductsByDay(dateYmd, 2);

    const loading = salesLoading || topLoading;
    const error = salesError || topError;

    const validSales = (Array.isArray(sales) ? sales : []).filter(
        (s): s is SaleDTO => s != null && s.saleId != null && String(s.saleId) !== ""
    );
    const totalSalesCount = validSales.length;
    const totalAmount = validSales.reduce((acc: number, s: SaleDTO) => acc + (Number(s.totalPrice) || 0), 0);

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="flex items-center justify-between">
                    <span className="text-muted-foreground">Resumen de actividad diaria</span>
                    <span className="font-bold">{dateYmd}</span>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas del día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex gap-4">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                        ) : (
                            <div className="flex items-baseline gap-6">
                                <div>
                                    <div className="text-sm text-muted-foreground">Número de ventas</div>
                                    <div className="text-3xl font-bold">{totalSalesCount}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Total vendido</div>
                                    <div className="text-3xl font-bold">{formatCurrency(totalAmount, 'es-CO', 'COP')}</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top productos del día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-6 w-52" />
                            </div>
                        ) : (
                            <ul className="space-y-1">
                                {(topProducts ?? []).slice(0, 2).map((p: TopProduct, idx: number) => (
                                    <li key={`${p.productId}-${idx}`} className="flex items-center justify-between">
                                        <span className="font-medium">{idx + 1}. {p.productName}</span>
                                        <span className="text-sm text-muted-foreground">{p.totalSold} vendidos</span>
                                    </li>
                                ))}
                                {(!topProducts || topProducts.length === 0) && (
                                    <div className="text-sm text-muted-foreground">Sin datos</div>
                                )}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de ventas del día */}
            <Card>
                <CardHeader>
                    <CardTitle>Listado de ventas</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Concepto</TableHead>
                                        <TableHead>Método de pago</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {validSales.map((s) => (
                                        <TableRow key={String(s.saleId)}>
                                            <TableCell className="font-medium">{s.concept}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{s.paymentMethod}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(Number(s.totalPrice), 'es-CO', 'COP')}</TableCell>
                                        </TableRow>
                                    ))}

                                    {/* 2) Fila de estado vacío con key fija */}
                                    {validSales.length === 0 && (
                                        <TableRow key="empty">
                                            <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                                                No hay ventas registradas para {dateYmd}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}