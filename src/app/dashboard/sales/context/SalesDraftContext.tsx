"use client";
import React, {createContext, useCallback, useContext, useMemo, useState} from "react";
import { SaleFormData, SaleInProgress } from "@/app/dashboard/sales/types";
import { useSalesInProgress } from "@/app/dashboard/sales/hooks/useSaleInProgress";
import { salesService } from "@/app/dashboard/sales/services/sales.services";
import { saveSaleInProgress, removeSaleInProgress } from "@/app/dashboard/sales/utils/localStorage";
import { toSaleInProgress, toSaleRequest } from "@/app/dashboard/sales/mappers/sale.mapper";

interface SalesDraftContextValue {
    // UI state
    isOpen: boolean;
    isLoading: boolean;
    initialData: SaleInProgress | null; // null = nueva venta, !=null = editando borrador
    isEditing: boolean;

    // Form state (últimos valores del formulario que se van tipeando)
    currentFormData: SaleFormData | null;
    setCurrentFormData: (data: SaleFormData | null) => void;

    // Actions
    openNew: () => void;
    openEdit: (sale: SaleInProgress) => void;
    close: () => void; // cierra sin persistir (salvo autoguardado si editando)

    saveDraft: () => void;      // "En proceso"
    submit: (data?: SaleFormData) => Promise<void>; // "Guardar" → POST al backend
    deleteCurrent: () => void;  // "Eliminar" (sólo si isEditing)
}

const SalesDraftContext = createContext<SalesDraftContextValue | null>(null);

export const SalesDraftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reload, remove } = useSalesInProgress();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState<SaleInProgress | null>(null);
    const [currentFormData, setCurrentFormData] = useState<SaleFormData | null>(null);

    const isEditing = Boolean(initialData?.id);

    const openNew = useCallback(() => {
        setInitialData(null);
        setCurrentFormData(null);
        setIsOpen(true);
    }, []);

    const openEdit = useCallback((sale: SaleInProgress) => {
        setInitialData(sale);
        setCurrentFormData(null);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        // Al cerrar el modal: si estábamos editando un borrador y hay cambios, auto-persistir borrador
        if (isEditing && currentFormData) {
            const draft = toSaleInProgress(currentFormData, initialData?.id);
            saveSaleInProgress(draft);
            reload();
        }
        setIsOpen(false);
        // Limpieza diferida para evitar unmount/animaciones bruscas
        setTimeout(() => {
            setInitialData(null);
            setCurrentFormData(null);
        }, 150);
    }, [isEditing, currentFormData, initialData?.id, reload]);

    const saveDraft = useCallback(() => {
        if (!currentFormData) {
            setIsOpen(false);
            return;
        }
        const draft = toSaleInProgress(currentFormData, initialData?.id);
        saveSaleInProgress(draft);
        reload();
        setIsOpen(false);
    }, [currentFormData, initialData?.id, reload]);

    const submit = useCallback(async (data?: SaleFormData) => {
        const formData = data ?? currentFormData;

        if (!formData) {
            console.warn('No hay datos del formulario para enviar');
            return;
        }
        try {
            setIsLoading(true);
            //console.log('submit formData', toSaleRequest(formData));
            await salesService.register(toSaleRequest(formData));
            if (formData.id) {
                remove(formData.id);
            }
            setIsOpen(false);
            reload();
            window.dispatchEvent(new Event('route.ts-in-progress:changed'));
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setInitialData(null);
                setCurrentFormData(null);
            }, 150);
        }
    }, [currentFormData, remove, reload]);

    const deleteCurrent = useCallback(() => {
        if (initialData?.id) {
            remove(initialData.id); // sincroniza hook + lista
            removeSaleInProgress(initialData.id); // por si el hook no lo abarca
        }
        setIsOpen(false);
        setTimeout(() => {
            setInitialData(null);
            setCurrentFormData(null);
        }, 150);
    }, [initialData?.id, remove]);

    const value = useMemo(() => ({
        isOpen,
        isLoading,
        initialData,
        isEditing,
        currentFormData,
        setCurrentFormData,
        openNew,
        openEdit,
        close,
        saveDraft,
        submit,
        deleteCurrent,
    }), [isOpen, isLoading, initialData, isEditing, currentFormData, openNew, openEdit, close, saveDraft, submit, deleteCurrent]);

    return (
        <SalesDraftContext.Provider value={value}>{children}</SalesDraftContext.Provider>
    );
};

export const useSalesDraft = () => {
    const ctx = useContext(SalesDraftContext);
    if (!ctx) throw new Error("useSalesDraft must be used within SalesDraftProvider");
    return ctx;
};