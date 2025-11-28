import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../services/product.service";
import type { ProductEditInput } from "../schemas/product.schema";
import { toast } from "sonner";

function mapFormToEditPayload(values: ProductEditInput) {
    const toNumberOrUndefined = (s?: string) => {
        if (s == null) return undefined;
        const trimmed = String(s).trim();
        if (trimmed === "") return undefined; // no sobrescribir con 0 si el usuario no puso nada
        const n = Number(trimmed);
        return Number.isFinite(n) ? n : undefined; // undefined → el backend mantiene el valor actual
    };

    const ingredients = values.inputListIngredients?.map((i) => ({
        name: i.nombre,
        cost: toNumberOrUndefined(i.precio) ?? 0,
    }));
    const directCosts = values.inputListDirects?.map((d) => ({
        name: d.nombre,
        cost: toNumberOrUndefined(d.precio) ?? 0,
    }));

    return {
        name: values.productName,
        ingredients,
        directCosts,
        labour: toNumberOrUndefined(values.laborCoast),
        netPrice: toNumberOrUndefined(values.netPrice),
        profitMargin: toNumberOrUndefined(values.profitMargin),
    } as const;
}

export function useEditProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, values }: { id: number; values: ProductEditInput }) => {
            const payload = mapFormToEditPayload(values);
            return ProductService.edit(id, payload);
        },
        onSuccess: async (_data, variables) => {
            toast.success("Producto editado exitosamente");
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["products"] }),
                qc.invalidateQueries({ queryKey: ["product", variables.id] }),
            ]);
        },
        onError: (err: unknown) => {
            //console.error("Error guardando producto", err);
            toast.error("No se pudo guardar el producto");
        },
    });
}