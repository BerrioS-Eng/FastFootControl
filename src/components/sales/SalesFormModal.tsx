import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SaleForm } from "@/components/sales/SalesForm";
import { SaleFormData, SaleInProgress } from "@/app/dashboard/sales/types";
import { uuidv4 } from "zod";
import { saveSaleInProgress } from "@/app/dashboard/sales/utils/localStorage";

type Props = {
  isOpen: boolean;
  initialData: SaleInProgress | null;
  onClose: (data?: SaleInProgress) => void;
  onSave: (id?: string) => void;
  onDelete: (id: string) => void;
};

const toSaleInProgress = (
  data: SaleFormData,
  fallbackId?: string
): SaleInProgress => ({
  ...data,
  id: data.id ?? fallbackId ?? uuidv4(),
});

export const SalesFormModal: React.FC<Props> = ({
  isOpen,
  initialData,
  onClose,
  onDelete,
  onSave,
}) => {
  const [currentFormData, setCurrentFormData] = useState<SaleFormData | null>(null);

  const handleSubmit = (data: SaleFormData) => {
    const normalized = toSaleInProgress(data, initialData?.id);
    console.log("Datos del registro venta: ", normalized);
    onSave(normalized.id);
  };

  const persistAndClose = () => {
    if (currentFormData && currentFormData.concept) {
      const saleToSave = toSaleInProgress(currentFormData, initialData?.id);
      saveSaleInProgress(saleToSave);
      onClose(saleToSave);
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    persistAndClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      persistAndClose();
    }
  };

  const handleValuesChange = (data: SaleFormData | null) => {
    setCurrentFormData(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Editar Venta" : "Registro de venta"}
          </DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? "Edite los detalles de la venta en proceso."
              : "Complete el formulario para registrar una nueva venta."}
          </DialogDescription>
        </DialogHeader>

        <SaleForm
          initialValues={initialData || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onValuesChange={handleValuesChange}
        />

        {initialData?.id && (
          <div className="mt-4 flex justify-end">
            <button
              className="btn btn-destructive"
              onClick={() => {
                onDelete(initialData.id);
                onClose();
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
