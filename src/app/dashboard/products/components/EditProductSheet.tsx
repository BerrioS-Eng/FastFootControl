"use client";
import React, {useEffect} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {productEditSchema, type ProductEditInput} from "../schemas/product.schema";
import {useProduct} from "../hooks/useProduct";
import {useEditProduct} from "../hooks/useEditProduct";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import type {Product} from "@/app/dashboard/products/types";

interface EditProductSheetProps {
    productId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProductSheet({productId, open, onOpenChange}: EditProductSheetProps) {
    const form: UseFormReturn<ProductEditInput> = useForm<ProductEditInput>({
        resolver: zodResolver(productEditSchema),
        defaultValues: {
            productName: "",
            laborCoast: "",
            profitMargin: "",
            netPrice: "",
            salePrice: "",
            inputListIngredients: [],
            inputListDirects: [],
        },
    });

    const {data: product, isLoading} = useProduct(open ? productId : null);
    const {mutateAsync, isPending} = useEditProduct();

    // Prefill cuando cargue el producto
    useEffect(() => {
        if (!product || !open) return;

        form.reset({
            productName: product.name ?? "",
            laborCoast: "",
            profitMargin: product.profitMargin != null ? String(product.profitMargin) : "",
            netPrice: product.netPrice != null ? String(product.netPrice) : "",
            salePrice: product.salePrice != null ? String(product.salePrice) : "",
            inputListIngredients: [], // ya no editamos ingredientes
            inputListDirects: [],
        });
    }, [product, open, form]);

    // Auto-cálculo de salePrice a partir de netPrice y profitMargin (evitando bucles)
    useEffect(() => {
        const subscription = form.watch((values, {name}) => {
            if (name !== "netPrice" && name !== "profitMargin") return;

            const rawNet = values.netPrice;
            const rawMargin = values.profitMargin;

            const net = parseFloat(String(rawNet ?? "0").replace(",", "."));
            const margin = parseFloat(String(rawMargin ?? "0").replace(",", "."));
            if (Number.isNaN(net) || Number.isNaN(margin)) return;

            const sale = net * (1 + margin / 100);
            const nextSale = sale.toFixed(2);

            if (String(values.salePrice ?? "") !== nextSale) {
                form.setValue("salePrice", nextSale, {
                    shouldValidate: false,
                    shouldDirty: true,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = async (values: ProductEditInput) => {
        if (!productId) return;

        const payload: ProductEditInput = {
            productName: values.productName,
            netPrice: values.netPrice ? values.netPrice : undefined,
            profitMargin: values.profitMargin ? values.profitMargin : undefined,
        };

        await mutateAsync({id: productId, values: payload});
        onOpenChange(false);
    };

    const currentImageUrl = (product as Product | undefined)?.imageUrl || null;

    const renderIngredientsReadOnly = (p?: Product | null) => {
        if (!p?.ingredients || !p.ingredients.length) {
            return (
                <p className="text-xs text-muted-foreground">
                    Este producto no tiene ingredientes registrados.
                </p>
            );
        }

        return (
            <div className="flex flex-wrap gap-1.5 mt-1">
                {p.ingredients.map((ing: any, idx: number) => {
                    const name = typeof ing === "string" ? ing : ing.name;
                    if (!name) return null;
                    return (
                        <span
                            key={`${name}-${idx}`}
                            className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                            {name}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-3 sm:p-4 sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="space-y-1">
                    <SheetTitle>Editar producto</SheetTitle>
                    <SheetDescription className="text-xs sm:text-sm">
                        Puedes modificar el nombre, el precio neto y el margen de ganancia. El precio de
                        venta se calcula automáticamente a partir de esos valores. La imagen e ingredientes
                        son sólo de lectura.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-4">
                    {isLoading ? (
                        <div className="text-center text-sm text-muted-foreground">
                            Cargando producto...
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Información general + imagen (layout responsivo) */}
                                <section className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4 items-start">
                                        {/* Nombre */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold">Información general</h3>
                                            <FormField
                                                control={form.control}
                                                name="productName"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Nombre del producto</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ej: Ceviche"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Imagen solo lectura */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold">Imagen</h3>
                                            <div
                                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg border bg-muted flex items-center justify-center overflow-hidden mx-auto md:mx-0">
                                                {currentImageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={currentImageUrl}
                                                        alt={form.getValues("productName") || "Imagen del producto"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground text-center px-2">
                                                        Sin imagen
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Ingredientes solo lectura */}
                                <section className="space-y-2">
                                    <h3 className="text-sm font-semibold">Ingredientes</h3>
                                    {renderIngredientsReadOnly(product as Product)}
                                    <p className="text-[11px] text-muted-foreground">
                                        Los ingredientes no pueden modificarse desde esta vista.
                                    </p>
                                </section>

                                {/* Margen y precios */}
                                <section className="space-y-3">
                                    <h3 className="text-sm font-semibold">Margen y precios</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="netPrice"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Precio neto</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                placeholder="Ej: 19000"
                                                                inputMode="decimal"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="profitMargin"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Margen de ganancia (%)</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                placeholder="Ej: 32"
                                                                inputMode="decimal"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="salePrice"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Precio de venta (calculado)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </section>

                                <SheetFooter className="gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-[#FB8C00]"
                                    >
                                        {isPending ? "Guardando..." : "Guardar cambios"}
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