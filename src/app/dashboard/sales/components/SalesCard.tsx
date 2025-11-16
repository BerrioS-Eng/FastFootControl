import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaleInProgress } from '@/app/dashboard/sales/types';
import { useSalesDraft } from '@/app/dashboard/sales/context/SalesDraftContext';
import {formatCurrency} from "@/lib/utils";

type Props = { sale: SaleInProgress };

export const SaleCard: React.FC<Props> = ({ sale }) => {
    const { openEdit } = useSalesDraft();
    return (
        <Card
            className="w-full border-amber-500 hover:cursor-pointer hover:shadow-sm transition"
            onClick={() => openEdit(sale)}
        >
            <CardHeader>
                <CardTitle className="truncate">{sale.concept}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground">Método de pago: {sale.paymentMethod || 'No especificado'}</p>
                <p className="font-medium">Total: {typeof sale.totalPrice === 'number' ? formatCurrency(sale.totalPrice, 'es-CO', 'COP') : 'No especificado'}</p>
            </CardContent>
        </Card>
    );
}