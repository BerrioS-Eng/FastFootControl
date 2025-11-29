"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "@/app/dashboard/products/hooks/useProducts";
import EditProductSheet from "@/app/dashboard/products/components/EditProductSheet";
import { useAuth } from "@/app/dashboard/users/hooks/useAuth";
import { IconAlertTriangle, IconPlus, IconBottle, IconSalad } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ProductCreateWizard } from "@/app/dashboard/products/components/ProductCreateWizard";

export default function Products() {
    const { role, isLoading: authLoading } = useAuth();
    const isAdmin = role === "ADMIN";

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 border-2 border-primary border-b-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600">
                        <IconAlertTriangle className="h-5 w-5" />
                        <h1 className="font-semibold text-lg">Acceso restringido</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Solo los usuarios con rol <span className="font-semibold">ADMIN</span> pueden
                        gestionar productos.
                    </p>
                </div>
            </div>
        );
    }

    return <ProductsAdminContent />;
}

function ProductsAdminContent() {
    const { data: products, isLoading, isError } = useProducts({});
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [currentProductId, setCurrentProductId] = React.useState<number | null>(null);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);

    return (
        <div className="p-4 flex flex-col gap-6">
            {/* Hero */}
            <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/10" />
                <div className="relative z-10 flex items-start gap-3">
                    <div className="hidden sm:flex h-10 w-10 rounded-full bg-white/20 items-center justify-center my-auto">
                        <IconSalad className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-1">Gestión de productos</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Productos de la carta
                        </h1>
                        <p className="text-sm md:text-base opacity-90">
                            Administra tus platos de comida y bebidas disponibles para la venta.
                        </p>
                    </div>
                </div>
                <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-1 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
                    >
                        <IconPlus className="h-4 w-4" />
                        <span>Agregar producto</span>
                    </Button>
                    <p className="hidden sm:flex items-center gap-1 text-xs text-white/80">
                        <IconBottle className="h-4 w-4" />
                        <span>Soporta productos de comida y bebida</span>
                    </p>
                </div>
            </div>

            {/* Tabla de productos */}
            {isLoading ? (
                <Spinner className="mx-auto size-6 text-emerald-500" />
            ) : isError ? (
                <div className="text-center text-red-600">
                    Error al cargar productos
                </div>
            ) : (
                <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-5">
                    <DataTable
                        columns={columns({
                            onEdit: (id: number) => {
                                setCurrentProductId(id);
                                setIsEditOpen(true);
                            },
                        })}
                        data={products ?? []}
                    />
                </div>
            )}

            <EditProductSheet
                productId={currentProductId}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <ProductCreateWizard open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    );
}