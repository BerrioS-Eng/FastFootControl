// app/components/sales/SalesModule.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SalesInProgressList } from "@/components/sales/SalesInProgressList";
import { SalesFormModal } from "@/components/sales/SalesFormModal";
import { SaleInProgress } from "@/app/dashboard/sales/types";
import {
  loadSalesInProgress,
  saveSaleInProgress,
  removeSaleInProgress,
} from "@/app/dashboard/sales/utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const SalesModule: React.FC = () => {
  const [salesInProgress, setSalesInProgress] = useState<SaleInProgress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleInProgress | null>(null);

  useEffect(() => {
    const sales = loadSalesInProgress();
    setSalesInProgress(sales);
  }, []);

  const handleOpenModal = (sale?: SaleInProgress) => {
    setEditingSale(sale || null);
    setIsModalOpen(true);
  };

  const handleDeleteSale = (id: string) => {
    removeSaleInProgress(id);
    setSalesInProgress(loadSalesInProgress());
  };

  const handleModalClose = (data?: SaleInProgress) => {
    if (data && data.concept) {
      const saleToSave: SaleInProgress = {
        ...data,
        id: data.id && data.id !== "" ? data.id : uuidv4()
      };
      saveSaleInProgress(saleToSave);
      setSalesInProgress(loadSalesInProgress());
    }
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const handleSaveSale = (id?: string) => {
    if (id) {
      removeSaleInProgress(id);
      setSalesInProgress(loadSalesInProgress());
    }
    setEditingSale(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        className="bg-[#FB8C00] hover:bg-[#FB8C00] hover:cursor-pointer"
        onClick={() => handleOpenModal()}
      >
        Registrar Venta
      </Button>

      <SalesInProgressList sales={salesInProgress} onEdit={handleOpenModal} />

      <SalesFormModal
        isOpen={isModalOpen}
        initialData={editingSale}
        onClose={handleModalClose}
        onSave={handleSaveSale}
        onDelete={handleDeleteSale}
      />

      {salesInProgress.length === 0 && (
        <div className="mt-50 flex justify-center content-center">
          <span className="text-gray-200 font-bold">
            No hay registro de ventas en proceso.
          </span>
        </div>
      )}
    </div>
  );
};

export default SalesModule;
