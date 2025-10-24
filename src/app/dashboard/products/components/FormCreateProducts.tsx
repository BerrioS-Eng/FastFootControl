'use client';
import {useFieldArray, useForm, UseFormReturn} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {productCreateSchema, type ProductCreateInput} from '../schemas/product.schema';
import React, {useEffect, useRef, useState} from 'react';
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import InputListCustom from "@/app/dashboard/products/components/InputListCustom";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {useCreateProduct} from "@/app/dashboard/products/hooks/useCreateProduct";
import { toast } from "sonner";

export function ProductForm({onSuccess}: { onSuccess?: () => void }) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const form: UseFormReturn<ProductCreateInput> = useForm<ProductCreateInput>({
        resolver: zodResolver(productCreateSchema),
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
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: {errors},
        reset
    } = form;
    const {mutateAsync, isPending} = useCreateProduct();
    //Observar valores del formulario
    const laborCoast = watch("laborCoast");
    const profitMargin = watch("profitMargin");
    const inputListIngredients = watch("inputListIngredients");
    const inputListDirects = watch("inputListDirects");


    useEffect(() => {
        const laborCoastValue = parseFloat(laborCoast) || 0;
        const ingredientsTotal = inputListIngredients?.reduce((sum, item) => sum + (parseInt(item.precio) || 0), 0);
        const directsTotal = inputListDirects?.reduce((sum, item) => sum + (parseInt(item.precio) || 0), 0);

        const netPrice = laborCoastValue + (ingredientsTotal || 0) + (directsTotal || 0);
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
                toast("Imagen requerida", { description: "Selecciona una imagen para el producto." });
                return;
            }
            await mutateAsync({ formValues: values, imageFile });
            toast("Éxito", { description: "Producto guardado exitosamente." });
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
            toast("Error", { description: error?.message || "No se pudo guardar el producto." });
            console.error("Error al crear producto:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crea un producto</CardTitle>
                <CardDescription>Introduce los datos requeridos a continuación para añadir un nuevo producto a
                    lista</CardDescription>
                <CardAction>
                    <Button disabled={isPending} type="submit" form='createProduct' className='w-30 m-auto bg-[#FB8C00]'>
                        Agregar producto</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id='createProduct' onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
                        <div className='flex flex-col gap-3'>
                            <FormField
                                control={control}
                                name="productName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nombre producto" {...field}
                                            />
                                        </FormControl>
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
                                            <Input placeholder="Costo" {...field} />
                                        </FormControl>
                                    </FormItem>

                                )}
                            />
                            <FormField
                                control={control}
                                name="profitMargin"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Margen de ganancia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Margen" {...field} />
                                        </FormControl>
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
                                            <Input placeholder="Precio" disabled {...field} />
                                        </FormControl>
                                    </FormItem>

                                )}
                            />
                        </div>
                        <div className='items-center'>
                            <FormField
                                control={control}
                                name="inputListIngredients"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Costos ingredientes</FormLabel>
                                        <FormControl>
                                            <InputListCustom
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='items-center'>
                            <FormField
                                control={control}
                                name="inputListDirects"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Costos directos</FormLabel>
                                        <FormControl>
                                            <InputListCustom
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                    <Separator className='my-4 px-30 border-1'/>
                    <div className='flex flex-row gap-3'>
                        <div className='basis-1/3'>
                            <FormField
                                control={control}
                                name="salePrice"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Precio venta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Precio" {...field} />
                                        </FormControl>
                                    </FormItem>

                                )}
                            />
                        </div>
                        <Separator className='border-1' orientation='vertical'/>
                        <div className='basis-2/3'>
                            <Label htmlFor="picture" className='mb-2'>Imagen del producto</Label>
                            <Input
                                id="picture"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </div>
                </Form>
            </CardContent>
        </Card>
    );
}