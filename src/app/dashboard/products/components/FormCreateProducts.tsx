"use client";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    productCreateSchema,
    type ProductCreateInput,
} from "../schemas/product.schema";
import React, {useEffect, useRef, useState} from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import InputListCustom from "@/app/dashboard/products/components/InputListCustom";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {useCreateProduct} from "@/app/dashboard/products/hooks/useCreateProduct";
import {toast} from "sonner";

export function ProductForm({onSuccess}: { onSuccess?: () => void }) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form: UseFormReturn<ProductCreateInput> = useForm<ProductCreateInput>({
        resolver: zodResolver(productCreateSchema),
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

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: {errors},
        reset,
    } = form;

    const {mutateAsync, isPending} = useCreateProduct();

    // Observamos valores del formulario
    const laborCoast = watch("laborCoast");
    const profitMargin = watch("profitMargin");
    const inputListIngredients = watch("inputListIngredients");
    const inputListDirects = watch("inputListDirects");

    useEffect(() => {
        const laborCoastValue = parseFloat(laborCoast) || 0;
        const ingredientsTotal =
            inputListIngredients?.reduce(
                (sum, item) => sum + (parseInt(item.precio) || 0),
                0
            ) ?? 0;
        const directsTotal =
            inputListDirects?.reduce(
                (sum, item) => sum + (parseInt(item.precio) || 0),
                0
            ) ?? 0;

        const netPrice = laborCoastValue + ingredientsTotal + directsTotal;
        setValue("netPrice", netPrice.toFixed(2));

        const profitMarginValue = parseFloat(profitMargin) || 0;
        if (profitMargin) {
            const salePrice = netPrice * (1 + profitMarginValue / 100);
            setValue("salePrice", salePrice.toFixed(2), {shouldValidate: true});
        }
    }, [laborCoast, profitMargin, inputListIngredients, inputListDirects, setValue]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setImageFile(file);
    };

    const onSubmit = async (values: ProductCreateInput) => {
        try {
            if (!imageFile) {
                toast("Imagen requerida", {
                    description: "Selecciona una imagen para el producto.",
                });
                return;
            }
            await mutateAsync({formValues: values, imageFile});
            toast("Éxito", {description: "Producto guardado exitosamente."});
            reset({
                productName: "",
                laborCoast: "",
                profitMargin: "",
                netPrice: "",
                salePrice: "",
                inputListIngredients: [],
                inputListDirects: [],
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
            setImageFile(null);
            onSuccess?.();
        } catch (error: any) {
            toast("Error", {
                description: error?.message || "No se pudo guardar el producto.",
            });
            console.error("Error al crear producto:", error);
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">
                    Crear producto de comida
                </CardTitle>
                <CardDescription className="text-sm">
                    Define el nombre, costos e imagen del producto. El precio neto y el precio de
                    venta se calculan automáticamente a partir de los costos y el margen.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        id="createProduct"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Sección: Información general */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                Información general
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
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

                                <FormField
                                    control={control}
                                    name="laborCoast"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Costo mano de obra</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej: 5000"
                                                    inputMode="decimal"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator/>

                        {/* Sección: Costos de ingredientes y directos */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                Costos de preparación
                            </h3>

                            {/* Bloque: Costos de ingredientes */}
                            <FormField
                                control={control}
                                name="inputListIngredients"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Costos de ingredientes</FormLabel>
                                        <FormControl>
                                            <InputListCustom
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Bloque: Costos directos */}
                            <FormField
                                control={control}
                                name="inputListDirects"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Costos directos</FormLabel>
                                        <FormControl>
                                            <InputListCustom
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </section>

                        <Separator/>

                        {/* Sección: Margen, precios e imagen */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                Margen, precios e imagen
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4 items-start">
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                            name="netPrice"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Precio neto (calculado)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={control}
                                        name="salePrice"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Precio de venta</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ej: 25000"
                                                        inputMode="decimal"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="picture">Imagen del producto</Label>
                                    <Input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Sube una imagen clara del producto. Se mostrará en el menú.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end pt-2">
                            <Button
                                disabled={isPending}
                                type="submit"
                                className="bg-[#FB8C00]"
                            >
                                {isPending ? "Guardando..." : "Agregar producto"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}