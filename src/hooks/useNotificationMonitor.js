import { useEffect, useRef, useState } from 'react';
import { useNotifications } from './useNotification.jsx';

/**
 * Hook para monitorear notificaciones específicas y actualizar datos automáticamente
 * @param {string} type - Tipo de notificación a monitorear (ej: 'pedido', 'cliente', etc.)
 * @param {Function} onNotification - Callback que se ejecuta cuando se recibe una notificación del tipo especificado
 * @param {Object} options - Opciones adicionales
 */
export const useNotificationMonitor = (type = null, onNotification = null, options = {}) => {
    const { notifications, connectionStatus } = useNotifications();
    const [lastNotificationId, setLastNotificationId] = useState(null);
    const processedNotifications = useRef(new Set());
    
    const {
        autoRefresh = true,
        debounceMs = 1000,
        maxRetries = 3
    } = options;

    useEffect(() => {
        if (!notifications || notifications.length === 0) return;

        // Obtener la notificación más reciente
        const latestNotification = notifications[0];
        
        // Verificar si es una notificación nueva que no hemos procesado
        if (
            latestNotification.id && 
            latestNotification.id !== lastNotificationId &&
            !processedNotifications.current.has(latestNotification.id)
        ) {
            // Verificar si es del tipo que estamos monitoreando
            if (!type || latestNotification.tipo === type || latestNotification.category === type) {
                console.log(`Nueva notificación detectada (${type || 'cualquiera'}):`, latestNotification);
                
                // Marcar como procesada
                processedNotifications.current.add(latestNotification.id);
                setLastNotificationId(latestNotification.id);
                
                // Ejecutar callback con debounce
                if (onNotification && typeof onNotification === 'function') {
                    const timeoutId = setTimeout(() => {
                        try {
                            onNotification(latestNotification);
                        } catch (error) {
                            console.error('Error en callback de notificación:', error);
                        }
                    }, debounceMs);

                    // Cleanup function para limpiar timeout si el componente se desmonta
                    return () => clearTimeout(timeoutId);
                }
            }
        }
    }, [notifications, type, onNotification, lastNotificationId, debounceMs]);

    // Limpiar notificaciones procesadas cuando cambia la conexión
    useEffect(() => {
        if (connectionStatus === 'connected') {
            processedNotifications.current.clear();
        }
    }, [connectionStatus]);

    return {
        connectionStatus,
        latestNotification: notifications[0] || null,
        notificationsCount: notifications.length,
        isConnected: connectionStatus === 'connected'
    };
};

/**
 * Hook específico para monitorear notificaciones de pedidos
 * @param {Function} onNewOrder - Callback cuando llega un nuevo pedido
 * @param {Function} onOrderUpdate - Callback cuando se actualiza un pedido
 */
export const useOrderNotificationMonitor = (onNewOrder = null, onOrderUpdate = null) => {
    const { notifications } = useNotifications();
    
    const handleOrderNotification = (notification) => {
        // Analizar el contenido de la notificación para determinar si es nuevo pedido o actualización
        const message = notification.mensaje || notification.formattedMessage || '';
        const title = notification.titulo || notification.formattedTitle || '';
        
        const isNewOrder = 
            message.toLowerCase().includes('nuevo pedido') ||
            title.toLowerCase().includes('nuevo pedido') ||
            notification.subtipo === 'nuevo_pedido';
            
        const isOrderUpdate = 
            message.toLowerCase().includes('actualizado') ||
            message.toLowerCase().includes('cambio de estado') ||
            notification.subtipo === 'estado_actualizado';
            
        if (isNewOrder && onNewOrder) {
            console.log('Nuevo pedido detectado:', notification);
            onNewOrder(notification);
        } else if (isOrderUpdate && onOrderUpdate) {
            console.log('Actualización de pedido detectada:', notification);
            onOrderUpdate(notification);
        } else if (onNewOrder) {
            // Si no podemos determinar el tipo, asumir que es un nuevo pedido
            onNewOrder(notification);
        }
    };

    return useNotificationMonitor('pedido', handleOrderNotification, {
        debounceMs: 500, // Respuesta más rápida para pedidos
        autoRefresh: true
    });
};

/**
 * Hook para monitorear el estado de conexión y mostrar alertas
 */
export const useConnectionMonitor = () => {
    const { connectionStatus, reconnectSSE } = useNotifications();
    const [showConnectionAlert, setShowConnectionAlert] = useState(false);
    const previousStatus = useRef(connectionStatus);

    useEffect(() => {
        // Mostrar alerta cuando se pierde la conexión
        if (
            previousStatus.current === 'connected' && 
            (connectionStatus === 'disconnected' || connectionStatus === 'error')
        ) {
            setShowConnectionAlert(true);
        }
        
        // Ocultar alerta cuando se recupera la conexión
        if (connectionStatus === 'connected' && previousStatus.current !== 'connected') {
            setShowConnectionAlert(false);
        }
        
        previousStatus.current = connectionStatus;
    }, [connectionStatus]);

    const dismissAlert = () => {
        setShowConnectionAlert(false);
    };

    const retryConnection = () => {
        if (reconnectSSE) {
            reconnectSSE();
        }
        setShowConnectionAlert(false);
    };

    return {
        connectionStatus,
        showConnectionAlert,
        dismissAlert,
        retryConnection,
        isConnected: connectionStatus === 'connected'
    };
};

export default useNotificationMonitor;
