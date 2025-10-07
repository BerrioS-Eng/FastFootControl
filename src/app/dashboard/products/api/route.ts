import { Product } from "../types";


const API_URL = "http://192.168.101.11:8080/products";

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/get-all-products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Error al obtener productos");
    }

    return res.json();
}

export async function getProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_URL}/get-product`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error(`Error al obtener producto ${id}`);
    }

    return res.json();
}