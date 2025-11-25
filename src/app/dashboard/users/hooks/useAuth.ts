'use client';
import { useEffect, useState } from 'react';
import type { Role, UserLoginResponse } from '@/lib/auth/types';

export function useAuth() {
    const [user, setUser] = useState<UserLoginResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });
                if (!res.ok) {
                    if (!cancelled) setUser(null);
                    return;
                }
                const data = await res.json();
                if (!cancelled) setUser(data.user ?? null);
            } catch (e) {
                if (!cancelled) setError((e as Error).message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const role = user?.role as Role | undefined;
    return { user, role, loading, error };
}