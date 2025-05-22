import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

// Este componente no renderiza nada, solo gestiona las notificaciones en segundo plano
const NotificationsPollingManager = () => {
  const notificationContext = useNotifications();

  useEffect(() => {
    console.log('Iniciando gestor de notificaciones...');
    
    // Solo iniciar el polling si tenemos permisos de notificación
    if (notificationContext.permissionStatus === 'granted') {
      // Verificar notificaciones no leídas inmediatamente al iniciar
      notificationContext.loadUnreadNotifications();
      
      // Configurar polling para verificar notificaciones no leídas cada 15 segundos
      const pollingInterval = setInterval(() => {
        console.log('Ejecutando polling de notificaciones...');
        notificationContext.loadUnreadNotifications();
      }, 15000);
      
      // Detener el polling cuando el componente se desmonte
      return () => {
        clearInterval(pollingInterval);
        console.log('Polling de notificaciones detenido');
      };
    } else {
      console.log('Las notificaciones no están habilitadas. El polling no se iniciará.');
    }
  }, [notificationContext, notificationContext.permissionStatus]);

  // No renderiza nada visible
  return null;
};

export default NotificationsPollingManager;