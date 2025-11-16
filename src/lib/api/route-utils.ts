import { NextResponse } from "next/server";

export function handleApiError(e: any, fallbackStatus = 500) {
    const status = typeof e?.status === "number" ? e.status : fallbackStatus;
    const message = e?.message || (status === 401 ? "No autorizado" : "Error inesperado");
    return NextResponse.json({ message }, { status });
}