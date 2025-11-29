"use client";

import { useCallback, useState } from "react";
import { signOut } from "next-auth/react";

/**
 * Hook reutilizable para cerrar sesión.
 * Usa NextAuth.signOut y opcionalmente permite configurar el callbackUrl.
 */
export function useLogout(defaultCallbackUrl: string = "/login") {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = useCallback(
        async (callbackUrl?: string) => {
            if (isLoggingOut) return;
            try {
                setIsLoggingOut(true);
                await signOut({ callbackUrl: callbackUrl ?? defaultCallbackUrl });
            } finally {
                setIsLoggingOut(false);
            }
        },
        [isLoggingOut, defaultCallbackUrl]
    );

    return {
        logout: handleLogout,
        isLoggingOut,
    };
}