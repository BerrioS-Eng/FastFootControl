import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';

export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => ProductService.remove(id),
        onSuccess: async () => {
            await qc.invalidateQueries({queryKey: ['products']});
        },
    });
}