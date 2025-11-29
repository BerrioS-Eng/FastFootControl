"use client";

import React, {useEffect, useRef, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
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
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {ProductService} from "@/app/dashboard/products/services/product.service";
import type {CostItem} from "@/app/dashboard/products/types";

const drinkSchema = z.object({
    productName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    netPrice: z
        .string()
        .regex(/^\d*\.?\d*$/, "Debe ser un número válido")
        .refine((v) => parseFloat(v || "0") >= 0, "Debe ser mayor o igual a 0"),
    profitMargin: z
        .string()
        .regex(/^\d*\.?\d*$/, "Debe ser un número válido")
        .refine((v) => parseFloat(v || "0") >= 0, "Debe ser mayor o igual a 0"),
    salePrice: z
        .string()
        .regex(/^\d*\.?\d*$/, "Debe ser un número válido")
        .refine((v) => parseFloat(v || "0") >= 0, "Debe ser mayor o igual a 0"),
});

// usamos el tipo de entrada del schema (coincide con lo que espera zodResolver)
type DrinkFormInput = z.input<typeof drinkSchema>;

interface DrinkProductFormProps {
    onSuccess?: () => void;
}

export function DrinkProductForm({onSuccess}: DrinkProductFormProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form: UseFormReturn<DrinkFormInput> = useForm<DrinkFormInput>({
        resolver: zodResolver(drinkSchema),
        defaultValues: {
            productName: "",
            netPrice: "",
            profitMargin: "",
            salePrice: "",
        },
    });

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: {isSubmitting},
    } = form;

    const netPrice = watch("netPrice");
    const profitMargin = watch("profitMargin");

    useEffect(() => {
        const net = parseFloat(netPrice || "0");
        const margin = parseFloat(profitMargin || "0");
        if (Number.isNaN(net) || Number.isNaN(margin)) return;

        const sale = net * (1 + margin / 100);
        setValue("salePrice", sale.toFixed(2), {shouldValidate: true});
    }, [netPrice, profitMargin, setValue]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setImageFile(file);
    };

    const onSubmit = async (values: DrinkFormInput) => {
        try {
            if (!imageFile) {
                toast("Imagen requerida", {
                    description: "Selecciona una imagen para la bebida.",
                });
                return;
            }

            const toNumber = (s: string) => {
                const n = parseFloat(s || "0");
                return Number.isFinite(n) ? n : 0;
            };

            // siempre enviamos un arreglo vacío de ingredientes
            const ingredientsCostItems: CostItem[] = [];

            const input = {
                name: values.productName,
                ingredients: ingredientsCostItems,
                directCosts: [] as CostItem[],
                labour: 0, // bebidas sin mano de obra específica
                profitMargin: toNumber(values.profitMargin),
            };

            await ProductService.create(input, imageFile);
            toast("Éxito", {description: "Bebida creada exitosamente."});

            reset({
                productName: "",
                netPrice: "",
                profitMargin: "",
                salePrice: "",
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
            setImageFile(null);
            onSuccess?.();
        } catch (error: any) {
            toast("Error", {
                description: error?.message || "No se pudo crear la bebida.",
            });
            console.error("Error al crear bebida:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crear bebida</CardTitle>
                <CardDescription>
                    Define el nombre y precios de la bebida. El precio de venta se calcula automáticamente
                    a partir del precio neto y el margen.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="productName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nombre de la bebida</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: Gaseosa 350ml"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="netPrice"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Precio neto</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 3000"
                                                inputMode="decimal"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="profitMargin"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Margen de ganancia (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 30"
                                                inputMode="decimal"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="salePrice"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Precio de venta (calculado)</FormLabel>
                                        <FormControl>
                                            <Input readOnly {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="drink-image">Imagen de la bebida</Label>
                            <Input
                                id="drink-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#FB8C00]"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar bebida"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}