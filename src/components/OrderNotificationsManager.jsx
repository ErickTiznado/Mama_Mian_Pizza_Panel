import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { startOrderPolling, stopOrderPolling } from '../services/PedidosService';

// Este componente no renderiza nada, solo gestiona las notificaciones en segundo plano
const OrderNotificationsManager = () => {
  const notificationContext = useNotifications();

  useEffect(() => {
    console.log('Iniciando gestor de notificaciones de pedidos...');
    
    // Solo iniciar el polling si tenemos permisos de notificación
    if (notificationContext.permissionStatus === 'granted') {
      // Iniciar el servicio de polling (verificar cada 5 segundos)
      const stopPolling = startOrderPolling(notificationContext, 5000);
      
      // Detener el polling cuando el componente se desmonte
      return () => {
        stopPolling();
      };
    } else {
      console.log('Las notificaciones no están habilitadas. El polling no se iniciará.');
    }
  }, [notificationContext, notificationContext.permissionStatus]);

  // No renderiza nada visible
  return null;
};

export default OrderNotificationsManager;