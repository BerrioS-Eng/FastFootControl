import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

interface KeyboardShortcuts {
  onCreateNew?: () => void;
  onSearch?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onSelectAll?: () => void;
  onEscape?: () => void;
}

/**
 * Hook para manejar atajos de teclado globales
 * Mejora la accesibilidad y productividad del usuario
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  // Crear nuevo usuario (Ctrl+N)
  useHotkeys('ctrl+n', (e) => {
    e.preventDefault();
    if (shortcuts.onCreateNew) {
      shortcuts.onCreateNew();
      toast.success('Atajo: Crear nuevo usuario');
    }
  }, { enableOnFormTags: false });

  // Enfocar búsqueda (Ctrl+K)
  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    if (shortcuts.onSearch) {
      shortcuts.onSearch();
      toast.info('Atajo: Búsqueda');
    }
  }, { enableOnFormTags: false });

  // Exportar datos (Ctrl+E)
  useHotkeys('ctrl+e', (e) => {
    e.preventDefault();
    if (shortcuts.onExport) {
      shortcuts.onExport();
      toast.info('Atajo: Exportar datos');
    }
  }, { enableOnFormTags: false });

  // Refrescar datos (F5 o Ctrl+R)
  useHotkeys('f5,ctrl+r', (e) => {
    e.preventDefault();
    if (shortcuts.onRefresh) {
      shortcuts.onRefresh();
      toast.info('Atajo: Refrescar datos');
    }
  }, { enableOnFormTags: false });

  // Seleccionar todo (Ctrl+A)
  useHotkeys('ctrl+a', (e) => {
    e.preventDefault();
    if (shortcuts.onSelectAll) {
      shortcuts.onSelectAll();
      toast.info('Atajo: Seleccionar todo');
    }
  }, { enableOnFormTags: false });

  // Escape para cerrar modales
  useHotkeys('escape', () => {
    if (shortcuts.onEscape) {
      shortcuts.onEscape();
    }
  });

  return {
    showShortcutsHelp: () => {
      toast.info(
        'Atajos disponibles:\n' +
        '• Ctrl+N: Nuevo usuario\n' +
        '• Ctrl+K: Búsqueda\n' +
        '• Ctrl+E: Exportar\n' +
        '• F5/Ctrl+R: Refrescar\n' +
        '• Ctrl+A: Seleccionar todo\n' +
        '• Escape: Cerrar modal',
        { duration: 5000 }
      );
    }
  };
}