import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import type {SaleInProgress} from "@/app/dashboard/sales/types";
import {useSalesDraft} from "@/app/dashboard/sales/context/SalesDraftContext";
import {formatCurrency} from "@/lib/utils";
import {IconClockHour4} from "@tabler/icons-react";

type Props = { sale: SaleInProgress };

export const SaleCard: React.FC<Props> = ({sale}) => {
    const {openEdit} = useSalesDraft();
    const total =
        typeof sale.totalPrice === "number"
            ? formatCurrency(sale.totalPrice, "es-CO", "COP")
            : "No especificado";

    return (
        <Card
            className="w-full border-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer relative overflow-hidden"
            onClick={() => openEdit(sale)}
        >
            {/* círculo decorativo */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-20 w-20 rounded-full bg-white/15"/>
            <CardHeader className="pb-2 relative z-10 flex flex-row items-start justify-between gap-2">
                <div className="min-w-0">
                    <CardTitle className="truncate text-xl">
                        {sale.concept || "Sin concepto"}
                    </CardTitle>
                    <p className="text-lg text-white/80 mt-1 flex items-center gap-1">
                        <IconClockHour4 className="h-3 w-3"/>
                        En proceso • {sale.paymentMethod || "Método no especificado"}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-1 text-sm">
                <p className="text-xs text-white/90">Total estimado</p>
                <p className="text-lg font-bold">{total}</p>
            </CardContent>
        </Card>
    );
};