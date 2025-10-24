import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import type { ProductCreateInput } from '../schemas/product.schema';

// Mapea los valores del formulario (strings) → tipos del backend (números y listas de objetos)
function mapFormToCreatePayload(values: ProductCreateInput) {
    const toNumber = (s?: string) => {
        const n = parseFloat(String(s ?? ''));
        return Number.isFinite(n) ? n : 0;
    };

    const ingredients = (values.inputListIngredients ?? []).map(i => ({
        name: i.nombre,
        cost: toNumber(i.precio),
    }));
    const directCosts = (values.inputListDirects ?? []).map(d => ({
        name: d.nombre,
        cost: toNumber(d.precio),
    }));

    return {
        name: values.productName,
        ingredients,
        directCosts,
        labour: toNumber(values.laborCoast),
        profitMargin: toNumber(values.profitMargin),
    } as const;
}

export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        // aceptamos `{ formValues, imageFile }` desde el componente
        mutationFn: async (args: { formValues: ProductCreateInput; imageFile: File }) => {
            const payload = mapFormToCreatePayload(args.formValues);
            return ProductService.create(payload, args.imageFile);
        },
        onSuccess: async () => {
            // refetch lista de productos
            await qc.invalidateQueries({ queryKey: ['products'] });
        },
    });
}