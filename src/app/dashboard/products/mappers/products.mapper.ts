import type {ProductCreateRequest, ProductDTO, ProductEditRequest} from "@/app/dashboard/products/types/dto";
import type {CostItem, Product} from "@/app/dashboard/products/types";

export function toCostItems(input: ProductDTO['ingredients'] | ProductDTO['directCosts']): CostItem[] {
    if (!input) return [];
    if (Array.isArray(input)) {
        if (input.length === 0) return [];
        const first = input[0] as any;
        // Si ya son objetos con name/cost
        if (first && typeof first === 'object' && 'name' in first) {
            return (input as any[]).map((it) => ({name: String(it.name ?? ''), cost: Number(it.cost ?? 0)}));
        }
        // Si son strings
        return (input as string[]).map((s) => ({name: String(s), cost: 0}));
    }
    return [];
}

export function fromDTO(dto: ProductDTO): Product {
    const ingredients = toCostItems(dto.ingredients);
    const directCosts = toCostItems(dto.directCosts);

    return {
        id: dto.productId,
        name: dto.productName,
        ingredients,
        directCosts,
        labour: Number(dto.labour ?? 0),
        profitMargin: Number(dto.profitMargin ?? 0),
        netPrice: Number(dto.netPrice ?? 0),
        salePrice: Number(dto.salePrice ?? 0),
        imageUrl: dto.imageUrl,
    };
}

export function toCreateRequest(input: {
    name: string;
    ingredients: CostItem[];
    directCosts: CostItem[];
    labour: number;
    profitMargin: number;
}): ProductCreateRequest {
    return {
        productName: input.name,
        ingredients: input.ingredients,
        directCosts: input.directCosts,
        labour: input.labour,
        profitMargin: input.profitMargin,
    };
}

export function toEditRequest(
    input: Partial<{
        name: string;
        ingredients: CostItem[];
        directCosts: CostItem[];
        labour: number;
        profitMargin: number;
        netPrice: number;
    }>,
): ProductEditRequest {
    return {
        productName: input.name,
        ingredients: input.ingredients,
        directCosts: input.directCosts,
        labour: input.labour,
        profitMargin: input.profitMargin,
        netPrice: input.netPrice,
    };
}