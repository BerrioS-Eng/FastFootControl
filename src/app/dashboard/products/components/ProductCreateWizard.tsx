"use client";

import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ProductForm} from "@/app/dashboard/products/components/FormCreateProducts";
import {DrinkProductForm} from "@/app/dashboard/products/components/DrinkProductForm";

type ProductType = "FOOD" | "DRINK";

interface ProductCreateWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductCreateWizard({open, onOpenChange}: ProductCreateWizardProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [productType, setProductType] = useState<ProductType | null>(null);

    const handleClose = (nextOpen: boolean) => {
        if (!nextOpen) {
            setStep(1);
            setProductType(null);
        }
        onOpenChange(nextOpen);
    };

    const handleContinue = () => {
        if (!productType) return;
        setStep(2);
    };

    const handleSuccess = () => {
        // al terminar, cerramos y reseteamos
        handleClose(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className="w-3xl max-h-[95vh] overflow-y-auto sm:w-full"
            >
                <DialogHeader className="mb-3">
                    <DialogTitle>Nuevo producto</DialogTitle>
                    <DialogDescription>
                        Crea productos de comida o bebida para tu carta. Sigue los pasos para configurar
                        correctamente cada tipo.
                    </DialogDescription>
                </DialogHeader>

                {/* Indicador simple de pasos */}
                <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
                    <span
                        className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                            step === 1
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-primary/10 text-primary border-primary/30"
                        )}
                    >
                        1
                    </span>
                    <span className={step === 1 ? "font-semibold" : "text-muted-foreground"}>
                        Tipo de producto
                    </span>
                    <span className="mx-1 text-muted-foreground">›</span>
                    <span
                        className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                            step === 2
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted text-muted-foreground border-muted-foreground/20"
                        )}
                    >
                        2
                    </span>
                    <span className={step === 2 ? "font-semibold" : "text-muted-foreground"}>
                        Detalles
                    </span>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Selecciona qué tipo de producto deseas crear. Podrás cambiar la información en el
                            siguiente paso.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setProductType("FOOD")}
                                className={cn(
                                    "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:border-primary hover:bg-primary/5",
                                    productType === "FOOD"
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-background"
                                )}
                            >
                                <span className="text-sm font-semibold">Comida</span>
                                <span className="text-xs text-muted-foreground">
                                    Platos preparados con ingredientes y costos de mano de obra.
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setProductType("DRINK")}
                                className={cn(
                                    "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:border-primary hover:bg-primary/5",
                                    productType === "DRINK"
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-background"
                                )}
                            >
                                <span className="text-sm font-semibold">Bebida</span>
                                <span className="text-xs text-muted-foreground">
                                    Bebidas con precio y margen definidos.
                                </span>
                            </button>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => handleClose(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={!productType}
                                className="bg-[#FB8C00]"
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && productType === "FOOD" && (
                    <ProductForm onSuccess={handleSuccess}/>
                )}

                {step === 2 && productType === "DRINK" && (
                    <DrinkProductForm onSuccess={handleSuccess}/>
                )}
            </DialogContent>
        </Dialog>
    );
}