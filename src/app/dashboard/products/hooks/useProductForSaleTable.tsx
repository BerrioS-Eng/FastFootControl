import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';

export function useProductsForSale() {
    return useQuery({
        queryKey: ['products-for-sale'],
        queryFn: () => ProductService.listForSale(),
        staleTime: 60_000, // podemos cachear 1 min porque cambia poco
        placeholderData: [],
    });
}