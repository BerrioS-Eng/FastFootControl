"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { SalesInProgressList } from "@/app/dashboard/sales/components/SalesInProgressList";
import { SalesFormModal } from "@/app/dashboard/sales/components/SalesFormModal";
import { useSalesInProgress } from "@/app/dashboard/sales/hooks/useSaleInProgress";
import { SalesDraftProvider, useSalesDraft } from "@/app/dashboard/sales/context/SalesDraftContext";

const ModuleBody: React.FC = () => {
    const { sales } = useSalesInProgress();
    const { openNew } = useSalesDraft();

    return (
        <div>
            <Button className="bg-[#FB8C00] hover:bg-[#FB8C00] hover:cursor-pointer" onClick={openNew}>
                Registrar Venta
            </Button>

            <SalesInProgressList sales={sales} />
            <SalesFormModal />

            {sales.length === 0 && (
                <div className="mt-50 flex justify-center content-center">
                    <span className="text-gray-200 font-bold">No hay registro de ventas en proceso.</span>
                </div>
            )}
        </div>
    );
};

const SalesModule: React.FC = () => (
    <SalesDraftProvider>
        <ModuleBody />
    </SalesDraftProvider>
);

export default SalesModule;
