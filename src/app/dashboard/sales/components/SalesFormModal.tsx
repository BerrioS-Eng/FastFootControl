import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SaleForm } from "@/app/dashboard/sales/components/SalesForm";
import { useSalesDraft } from "@/app/dashboard/sales/context/SalesDraftContext";

export const SalesFormModal: React.FC = () => {
    const { isOpen, initialData, isEditing, close, deleteCurrent } = useSalesDraft();

    const handleOpenChange = (open: boolean) => {
        if (!open) close();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl w-2xl h-4/5 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Venta" : "Registro de venta"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Edite los detalles de la venta en proceso." : "Complete el formulario para registrar una nueva venta."}
                    </DialogDescription>
                </DialogHeader>

                <SaleForm initialValues={initialData || undefined} />

            </DialogContent>
        </Dialog>
    );
};