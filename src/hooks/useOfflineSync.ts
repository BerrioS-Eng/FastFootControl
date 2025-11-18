import { useState, useEffect } from 'react';

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
}

/**
 * Hook para detectar estado online/offline
 * Permite implementar funcionalidad offline-first
 */
export function useOfflineSync() {
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false
  });

  const [pendingActions, setPendingActions] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ isOnline: true, wasOffline: prev.wasOffline || !prev.isOnline }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingAction = (action: any) => {
    if (!state.isOnline) {
      setPendingActions(prev => [...prev, { ...action, timestamp: Date.now() }]);
      return true; // Indica que se agregó a pending
    }
    return false; // Indica que se puede ejecutar inmediatamente
  };

  const clearPendingActions = () => {
    setPendingActions([]);
  };

  const syncPendingActions = async (syncFunction: (actions: any[]) => Promise<void>) => {
    if (state.isOnline && pendingActions.length > 0) {
      try {
        await syncFunction(pendingActions);
        clearPendingActions();
        return true;
      } catch (error) {
        console.error('Error syncing pending actions:', error);
        return false;
      }
    }
    return false;
  };

  return {
    isOnline: state.isOnline,
    wasOffline: state.wasOffline,
    pendingActions,
    pendingCount: pendingActions.length,
    addPendingAction,
    clearPendingActions,
    syncPendingActions,
    markAsOnline: () => setState(prev => ({ ...prev, wasOffline: false }))
  };
}