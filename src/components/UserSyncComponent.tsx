'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutos

export function UserSyncComponent() {
  const { syncUserFromBackend, user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.userId) return;

    // Sincronización inicial
    syncUserFromBackend();
    
    // Sincronización periódica cada 5 minutos
    intervalRef.current = setInterval(syncUserFromBackend, SYNC_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    
    // if (!user?.userId) return;
    // 
    // // Sincronización inicial
    // syncUserFromBackend();
    // 
    // // Sincronización periódica cada 5 minutos
    // intervalRef.current = setInterval(syncUserFromBackend, SYNC_INTERVAL);
    // 
    // return () => {
    //   if (intervalRef.current) {
    //     clearInterval(intervalRef.current);
    //   }
    // };
  }, [user?.userId, syncUserFromBackend]);

  return null;
}