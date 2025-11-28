"use client";
import { ProductForm } from "@/app/dashboard/products/components/FormCreateProducts";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "@/app/dashboard/products/hooks/useProducts";
import EditProductSheet from "@/app/dashboard/products/components/EditProductSheet";
import { useAuth } from "@/app/dashboard/users/hooks/useAuth";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function Products() {
    const { role, authLoading } = useAuth();
    const isAdmin = role === "ADMIN";

    if (authLoading) {
        // Estado neutral mientras resolvemos el rol.
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

    // Solo ADMIN llega aquí → solo aquí montamos los hooks de datos -> evitamos cargar los datos para WORKER
    return <ProductsAdminContent />;
}

function ProductsAdminContent() {
    const { data: products, isLoading, isError } = useProducts({});
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [currentProductId, setCurrentProductId] = React.useState<number | null>(null);

    return (
        <div className="mx-8 my-6 flex flex-col gap-9">
            <ProductForm />
            {isLoading ? (
                <Spinner className="mx-auto size-6 text-yellow-500" />
            ) : isError ? (
                <div className="text-center text-red-600">Error al cargar productos</div>
            ) : (
                <div>
                    <DataTable
                        columns={columns({
                            onEdit: (id: number) => {
                                setCurrentProductId(id);
                                setIsEditOpen(true);
                            },
                        })}
                        data={products ?? []}
                    />

                    <EditProductSheet
                        productId={currentProductId}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                    />
                </div>
            )}
        </div>
    );
}