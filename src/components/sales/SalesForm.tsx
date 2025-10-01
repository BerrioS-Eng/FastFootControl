// app/components/sales/SaleForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const saleFormSchema = z.object({
    id: z.string(),
    concept: z.string().min(1, "El concepto es obligatorio"),
    salePrice: z.number({
        message: "El precio de venta es obligatorio",
    }),
    products: z.array(
        z.object({
            product: z.string().min(1, "El producto es obligatorio"),
            quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
            salePrice: z.number(),
            totalPrice: z.number(),
        })
    ),
    totalPrice: z.number(),
    paymentMethod: z.string(),
});

export type SaleFormData = z.infer<typeof saleFormSchema>;

type SaleFormProps = {
    initialValues?: Partial<SaleFormData>;
    onSubmit: (data: SaleFormData) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    onValuesChange?: (data: SaleFormData | null) => void;
};

export const SaleForm: React.FC<SaleFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    isLoading,
    onValuesChange,
}) => {
    const form = useForm<SaleFormData>({
        resolver: zodResolver(saleFormSchema),
        defaultValues: {
            concept: "",
            totalPrice: 0,
            paymentMethod: "",
            ...initialValues,
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (onValuesChange) onValuesChange(value as SaleFormData);
        });
        return () => subscription.unsubscribe();
    }, [form, onValuesChange]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
            >
                <FormField
                    control={form.control}
                    name="concept"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Concepto</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val === "" ? undefined : Number(val));
                                    }}
                                />
                            </FormControl>
                            <FormDescription>Ingrese el monto de la venta</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Método de pago</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                Ejemplo: efectivo, tarjeta, etc.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                form.reset();
                                onCancel();
                            }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        Guardar
                    </Button>
                </div>
            </form>
        </Form>
    );
};
