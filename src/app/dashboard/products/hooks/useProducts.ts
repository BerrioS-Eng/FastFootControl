import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import type { ProductFilters } from '../types';

export function useProducts(filters: ProductFilters) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => ProductService.list(),
        staleTime: 30_000,
        placeholderData: [],
    });
}