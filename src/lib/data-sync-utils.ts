import { toast } from 'sonner';

export class DataSyncUtils {
  /**
   * Limpia los datos de autenticación y redirige al login
   */
  static forceReauth() {
    toast.info('♻️ Sincronizando datos...');
    
    setTimeout(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }, 1000);
  }

  /**
   * Verifica la integridad de los datos del usuario
   */
  static isUserDataValid(): boolean {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (!token || !userData) return false;
      
      const user = JSON.parse(userData);
      return !!(user.userId && user.userName && user.role);
    } catch {
      return false;
    }
  }
}