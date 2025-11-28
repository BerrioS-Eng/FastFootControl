import {ENDPOINTS} from '@/lib/config';

export async function http<T>(baseUrl: string, input: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${input}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data as any)?.message ?? `HTTP ${res.status}`;
        const error: any = new Error(message);
        error.status = res.status; //
        error.body = data;         //
        throw error;
    }

    return data as T;
}

//Creación de productos con imagen
export async function httpMultipart<T>(input: string, formData: FormData, init?: RequestInit): Promise<T> {
    const base = ENDPOINTS.products;
    const res = await fetch(`${base}${input}`, {
        method: 'POST',
        body: formData,
        // no seteamos Content-Type para que el navegador ponga boundary
        cache: 'no-store',
        ...(init || {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.message ?? `HTTP ${res.status}`);
    return data as T;
}