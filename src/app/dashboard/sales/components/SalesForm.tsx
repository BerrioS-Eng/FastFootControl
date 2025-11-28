"use client";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ProductsTable} from "./ProductsTable";
import {saleFormSchema, type SaleFormData} from "@/app/dashboard/sales/types";
import {useSalesDraft} from "@/app/dashboard/sales/context/SalesDraftContext";
import {formatCurrency} from "@/lib/utils";
import {toast} from "sonner";


// Utilidades para convertir a/desde datetime-local
const toLocalInputValue = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`; // formato datetime-local
};

export const SaleForm: React.FC<{ initialValues?: Partial<SaleFormData> }> = ({initialValues}) => {
    const {isEditing, isLoading, setCurrentFormData, saveDraft, submit, close, deleteCurrent} = useSalesDraft();

    const form = useForm<SaleFormData>({
        resolver: zodResolver(saleFormSchema),
        defaultValues: {
            id: initialValues?.id ?? undefined,
            concept: initialValues?.concept ?? "",
            totalPrice: initialValues?.totalPrice ?? 0,
            paymentMethod: initialValues?.paymentMethod ?? "",
            products: initialValues?.products ?? [],
            saleDate: initialValues?.saleDate ?? new Date().toISOString(),
        },
        mode: "onChange",
    });

    useEffect(() => {
        form.setValue("saleDate", new Date().toISOString(), {shouldValidate: true, shouldDirty: true});
        setCurrentFormData(form.getValues());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const subscription = form.watch((value) => setCurrentFormData(value as SaleFormData));
        return () => subscription.unsubscribe();
    }, [form, setCurrentFormData]);


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (values) => {
                    try {
                        await submit(values);
                        toast.success("Venta registrada correctamente");
                    } catch (error: any) {
                        console.error(error);
                        toast.error(error?.message ?? "No se pudo registrar la venta");
                    }
                })}
                className="space-y-4"
                noValidate
            >
                {/* Cabecera en grid responsiva */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* saleDate */}
                    <FormField
                        control={form.control}
                        name="saleDate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Fecha y hora</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" value={toLocalInputValue(field.value)} readOnly/>
                                </FormControl>
                                <FormDescription>Fecha y hora de la venta</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* paymentMethod */}
                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Método de pago</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un método de pago"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                        <SelectItem value="Otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Seleccione cómo se realizó el pago.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* concept (ocupa 2 columnas en sm+) */}
                    <div className="sm:col-span-2">
                        <FormField
                            control={form.control}
                            name="concept"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Concepto</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* products (componente responsivo abajo) */}
                <FormField
                    control={form.control}
                    name="products"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Productos</FormLabel>
                            <FormControl>
                                <ProductsTable
                                    value={(field.value ?? []).map((p) => ({
                                        id: String(p.productId),
                                        product: p.name ?? "",
                                        quantity: p.quantity,
                                        salePrice: p.salePrice,
                                        totalPrice: p.totalPrice,
                                    }))}
                                    onChange={(rows) => {
                                        const products = rows.map((r) => ({
                                            productId: Number(r.id),
                                            name: r.product,
                                            quantity: r.quantity,
                                            salePrice: r.salePrice,
                                            totalPrice: r.totalPrice,
                                        }));
                                        field.onChange(products);
                                        const total = products.reduce((sum, p) => sum + p.totalPrice, 0);
                                        form.setValue('totalPrice', total, {shouldValidate: true});
                                    }}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* totalPrice (solo lectura) */}
                <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                                <div className="space-y-1">
                                    <Input value={formatCurrency(field.value, 'es-CO', 'COP')} readOnly/>
                                    <input type="hidden" name={field.name} value={field.value ?? 0} ref={field.ref}
                                           onChange={field.onChange} onBlur={field.onBlur}/>
                                </div>
                            </FormControl>
                            <FormDescription>Total calculado</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Botones responsivos */}
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                    {!isEditing && (
                        <Button type="button" variant="outline" onClick={() => {
                            form.reset();
                            close();
                        }} disabled={isLoading} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    )}
                    {!isEditing && (
                        <Button type="button" variant="secondary" className="bg-[#FB8C00] w-full sm:w-auto"
                                onClick={saveDraft} disabled={isLoading}>
                            En proceso
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            type="button"
                            className="btn btn-destructive w-full sm:w-auto"
                            variant="destructive"
                            onClick={deleteCurrent}
                        >
                            Eliminar
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">Guardar</Button>
                </div>
            </form>
        </Form>
    );
};
