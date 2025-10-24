import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';

export function useProduct(productId: number | null) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => {
      if (productId == null) throw new Error('productId is required');
      return ProductService.get(productId);
    },
    enabled: productId != null,
    staleTime: 30_000,
  });
}
