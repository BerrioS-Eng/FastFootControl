"use client";
import { ProductForm } from '@/app/dashboard/products/components/FormCreateProducts';
import React from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Spinner } from '@/components/ui/spinner';
import { useProducts } from '@/app/dashboard/products/hooks/useProducts';
import EditProductSheet from "@/app/dashboard/products/components/EditProductSheet"; // ruta correcta

export default function Products() {
    const { data: products, isLoading, isError } = useProducts({});
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [currentProductId, setCurrentProductId] = React.useState<number | null>(null);

    return (
        <div className='mx-8 my-6 flex flex-col gap-9'>
            <ProductForm />
            {isLoading ? (
                <Spinner className='mx-auto size-6 text-yellow-500' />
            ) : isError ? (
                <div className='text-center text-red-600'>Error al cargar productos</div>
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

