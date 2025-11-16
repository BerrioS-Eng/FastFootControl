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
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button
                    className="bg-[#FB8C00] hover:bg-[#FB8C00] w-full sm:w-auto"
                    onClick={openNew}
                >
                    Registrar Venta
                </Button>
            </div>

            <SalesInProgressList sales={sales} />
            <SalesFormModal />

            {sales.length === 0 && (
                <div className="mt-10 flex justify-center">
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
        <ModuleBody />
    </SalesDraftProvider>
);

export default SalesModule;
