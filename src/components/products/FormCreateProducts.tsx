"use client";
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputListCustom from './InputListCustom';
import { Separator } from '@radix-ui/react-separator';
import { Label } from '../ui/label';

const FormSchema = z.object({
    productName: z.string().min(2, {
        message: "El nombre del producto debe tener al menos 2 caracteres.",
    }),
    laborCoast: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El costo de mano de obra debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El costo de mano de obra debe ser mayor o igual a 0.",
        }),
    profitMargin: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El margen de ganancia debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El margen de ganancia debe ser mayor o igual a 0.",
        }),
    netPrice: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El precio neto debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El precio neto debe ser mayor o igual a 0.",
        }),
    salePrice: z
        .string()
        .regex(/^\d*\.?\d*$/, {
            message: "El precio de venta debe ser un número válido.",
        })
        .refine((val) => parseFloat(val) >= 0 || val === '', {
            message: "El precio de venta debe ser mayor o igual a 0.",
        }),
    inputListIngredients: z
        .array(
            z.object({
                nombre: z.string().min(1, "El nombre del ingrediente es requerido."),
                precio: z
                    .string()
                    .regex(/^\d*\.?\d*$/, "El precio debe ser un número válido.")
                    .refine((val) => parseFloat(val) >= 0 || val === '', {
                        message: "El precio debe ser mayor o igual a 0.",
                    }),
            })
        )
        .optional(),
    inputListDirects: z
        .array(
            z.object({
                nombre: z.string().min(1, "El nombre del costo directo es requerido."),
                precio: z
                    .string()
                    .regex(/^\d*\.?\d*$/, "El precio debe ser un número válido.")
                    .refine((val) => parseFloat(val) >= 0 || val === '', {
                        message: "El precio debe ser mayor o igual a 0.",
                    }),
            })
        )
        .optional(),
})

type FormData = z.infer<typeof FormSchema>;

const FormCreateProducts = () => {

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form: UseFormReturn<FormData> = useForm<FormData>({
        resolver: zodResolver(FormSchema),
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
        formState: { errors },
    } = form;

    //Observar valores del formulario
    const laborCoast = watch("laborCoast");
    const profitMargin = watch("profitMargin");
    const inputListIngredients = watch("inputListIngredients");
    const inputListDirects = watch("inputListDirects");
    const netPriceTotal = watch("netPrice");
    const salePriceTotal = watch("salePrice");

    // Manejo de arrays dinámicos
    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control,
        name: 'inputListIngredients',
    });

    const { fields: directFields, append: appendDirect, remove: removeDirect } = useFieldArray({
        control,
        name: 'inputListDirects',
    });

    useEffect(() => {
        const laborCoastValue = parseFloat(laborCoast) || 0;
        const ingredientsTotal = inputListIngredients?.reduce((sum, item) => sum + (parseInt(item.precio) || 0), 0);
        const directsTotal = inputListDirects?.reduce((sum, item) => sum + (parseInt(item.precio) || 0), 0);

        const netPrice = laborCoastValue + (ingredientsTotal || 0) + (directsTotal || 0);
        setValue("netPrice", netPrice.toFixed(2));

        const profitMarginValue = parseFloat(profitMargin) || 0;
        if (profitMargin) {
            const salePrice = netPrice * (1 + profitMarginValue / 100);
            setValue("salePrice", salePrice.toFixed(2), { shouldValidate: true });
        }
    }, [laborCoast, profitMargin, inputListIngredients, inputListDirects, setValue]);

    const handleSalePriceChange = (value: string) => {
        const salePrice = parseFloat(value) || 0;
        const netPrice = parseFloat(watch("netPrice")) || 0;
        if (salePrice > 0 && netPrice > 0) {
            const profitMarginModified = ((salePrice - netPrice) / salePrice) * 100;
            setValue("profitMargin", profitMarginModified.toFixed(2), { shouldValidate: true });
        } else {
            setValue("profitMargin", '', { shouldValidate: true });
        }
        setValue("salePrice", value, { shouldValidate: true });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const formData = new FormData();

        formData.append('productName', data.productName);
        formData.append('profitMargin', data.profitMargin);
        formData.append('netPrice', data.netPrice);
        formData.append('salePrice', data.salePrice);
        formData.append('labor_coast', data.laborCoast);

        if (data.inputListIngredients) {
            const ingredients = data.inputListIngredients.map(({ nombre }) => nombre)
            formData.append('ingredients', JSON.stringify(ingredients));
        }

        if (selectedImage) {
            formData.append('imageUrl', selectedImage);
        }

        // Log para depuración
        console.log('Datos del formulario:', data);
        console.log('Imagen seleccionada:', selectedImage);
        console.log('=== CONTENIDO DE FORMDATA ===');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}:`, {
                    name: value.name,
                    size: value.size,
                    type: value.type,
                    lastModified: value.lastModified,
                });
            } else {
                console.log(`${key}:`, value);
            }
        }
        console.log('================================');
        //*******************

        //Solicitud API
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/productos`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error(`Error en la API: ${res.statusText}`);
            }

            const result = await res.json();
            console.log("Producto creado:", result);
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crea un producto</CardTitle>
                <CardDescription>Introduce los datos requeridos a continuación para añadir un nuevo producto a lista</CardDescription>
                <CardAction>
                    <Button type="submit" form='createProduct' className='w-30 m-auto bg-[#FB8C00]'>Agregar producto</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id='createProduct' onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
                        <div className='flex flex-col gap-3'>
                            <FormField
                                control={control}
                                name="productName"
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                    <Separator className='my-4 px-30 border-1' />
                    <div className='flex flex-row gap-3'>
                        <div className='basis-1/3'>
                            <FormField
                                control={control}
                                name="salePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio venta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Precio" {...field} />
                                        </FormControl>
                                    </FormItem>

                                )}
                            />
                        </div>
                        <Separator className='border-1' orientation='vertical' />
                        <div className='basis-2/3'>
                            <Label htmlFor="picture" className='mb-2'>Imagen del producto</Label>
                            <Input id="picture" type="file" accept='image/*' onChange={handleImageChange} />
                        </div>
                    </div>
                </Form>
            </CardContent>
        </Card>

    )
}

export default FormCreateProducts;