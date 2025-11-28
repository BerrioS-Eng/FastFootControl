"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {SalesInProgressList} from "@/app/dashboard/sales/components/SalesInProgressList";
import {SalesFormModal} from "@/app/dashboard/sales/components/SalesFormModal";
import {useSalesInProgress} from "@/app/dashboard/sales/hooks/useSaleInProgress";
import {SalesDraftProvider, useSalesDraft} from "@/app/dashboard/sales/context/SalesDraftContext";
import {IconPlus, IconReceipt2} from "@tabler/icons-react";

const ModuleBody: React.FC = () => {
    const {sales} = useSalesInProgress();
    const {openNew} = useSalesDraft();

    const salesInProgressCount = sales.length;

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Hero */}
            <div
                className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-[#FF9800] to-[#FF3D00] text-white shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* círculo decorativo */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/10"/>

                <div className="relative z-10 flex items-start gap-3">
                    <div className="hidden sm:flex h-10 w-10 rounded-full bg-white/20 items-center justify-center my-auto">
                        <IconReceipt2 className="h-5 w-5"/>
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-1">Gestión de ventas</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Registro de ventas
                        </h1>
                        <p className="text-sm md:text-base opacity-90">
                            Crea nuevas ventas y retoma las que quedaron en proceso.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
                    <Button
                        className="mt-1 bg-white text-[#F4511E] cursor-pointer hover:bg-orange-50 font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
                        onClick={openNew}
                    >
                        <IconPlus className="h-4 w-4"/>
                        Registrar venta
                    </Button>
                </div>
            </div>

            {/* Lista de ventas en proceso + modal */}
            <SalesInProgressList sales={sales}/>
            <SalesFormModal/>

            {salesInProgressCount === 0 && (
                <div className="mt-4 flex justify-center">
                    <span className="text-muted-foreground font-medium">
                        No hay registro de ventas en proceso.
                    </span>
                </div>
            )}
        </div>
    );
};

const SalesModule: React.FC = () => (
    <SalesDraftProvider>
        <ModuleBody/>
    </SalesDraftProvider>
);

export default SalesModule;