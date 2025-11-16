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
            <DialogContent
                className="w-[calc(100vw-2rem)] max-w-full max-h-[90vh] overflow-y-auto p-4 sm:max-w-2xl"
            >
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Venta" : "Registro de venta"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Edite los detalles de la venta en proceso."
                            : "Complete el formulario para registrar una nueva venta."}
                    </DialogDescription>
                </DialogHeader>

                <SaleForm initialValues={initialData || undefined} />
            </DialogContent>
        </Dialog>
    );
};