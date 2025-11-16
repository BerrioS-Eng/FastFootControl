"use client";
import React, {useEffect, useMemo} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {productEditSchema, type ProductEditInput} from '../schemas/product.schema';
import {useProduct} from '../hooks/useProduct';
import {useEditProduct} from '../hooks/useEditProduct';
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import InputListCustom from '@/app/dashboard/products/components/InputListCustom';

interface EditProductSheetProps {
    productId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProductSheet({productId, open, onOpenChange}: EditProductSheetProps) {
    const form: UseFormReturn<ProductEditInput> = useForm<ProductEditInput>({
        resolver: zodResolver(productEditSchema),
        defaultValues: {
            productName: '',
            laborCoast: '',
            profitMargin: '',
            netPrice: '',
            salePrice: '',
            inputListIngredients: [],
            inputListDirects: [],
        },
    });

    const {data: product, isLoading} = useProduct(open ? productId : null);
    const {mutateAsync, isPending} = useEditProduct();

    // Prefill form when products loads or sheet opens
    useEffect(() => {
        if (!product || !open) return;
        form.reset({
            productName: product.name ?? '',
            laborCoast: product.labour != null ? String(product.labour) : '',
            profitMargin: product.profitMargin != null ? String(product.profitMargin) : '',
            netPrice: product.netPrice != null ? String(product.netPrice) : '',
            salePrice: product.salePrice != null ? String(product.salePrice) : '',
            inputListIngredients: (product.ingredients ?? []).map(i => ({
                nombre: i.name,
                precio: String(i.cost ?? '')
            })),
            inputListDirects: (product.directCosts ?? []).map(d => ({nombre: d.name, precio: String(d.cost ?? '')})),
        });
    }, [product, open]);

    const onSubmit = async (values: ProductEditInput) => {
        if (!productId) return;
        await mutateAsync({id: productId, values});
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-2 sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar producto</SheetTitle>
                    <SheetDescription>
                        Modifica los campos y guarda los cambios. Los cálculos de precios son referenciales; el backend
                        es la fuente de verdad.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    {isLoading ? (
                        <div className="text-center text-sm text-muted-foreground">Cargando...</div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="productName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre del producto" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="laborCoast"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Mano de obra</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="profitMargin"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Margen (%)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="netPrice"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Precio neto</FormLabel>
                                                <FormControl>
                                                    <Input disabled placeholder="Calculado" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="salePrice"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Precio venta</FormLabel>
                                                <FormControl>
                                                    <Input disabled placeholder="Calculado" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="inputListIngredients"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Costos ingredientes</FormLabel>
                                            <FormControl>
                                                <InputListCustom value={field.value} onChange={field.onChange}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="inputListDirects"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Costos directos</FormLabel>
                                            <FormControl>
                                                <InputListCustom value={field.value} onChange={field.onChange}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <SheetFooter className="gap-2">
                                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isPending} className="bg-[#FB8C00]">
                                        {isPending ? 'Guardando...' : 'Guardar cambios'}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
