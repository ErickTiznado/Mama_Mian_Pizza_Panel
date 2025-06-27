import {useState, useEffect, useRef, createContext, useContext} from 'react';
import axios from 'axios';
import { ShoppingCart, Users, Package, Settings, Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { usePushNotifications } from './usePushNotifications';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const evtSourceRef = useRef(null);
    const [noleidas, setnoleidas] = useState(0);
    
    // Hook para notificaciones push
    const {
        permission,
        isSupported,
        requestPermission,
        showNotification,
        isPageVisible,
        getNotificationConfig,
        canShowNotifications
    } = usePushNotifications();

    // Función para mejorar el mensaje de las notificaciones
    const formatNotificationMessage = (notification) => {
        const { tipo, mensaje, titulo } = notification;
        
        // Si ya tiene un mensaje, usarlo (viene bien formateado de la API)
        if (mensaje && mensaje.length > 10) {
            return mensaje;
        }

        // Fallback basado en el tipo
        switch (tipo) {
            case 'pedido':
                return titulo || 'Nueva actividad en pedidos';
            case 'cliente':
                return 'Nueva actividad en clientes';
            case 'inventario':
                return 'Actualización en inventario';
            case 'sistema':
                return 'Notificación del sistema';
            default:
                return titulo || 'Nueva notificación disponible';
        }
    };

    // Función para obtener el ícono según el tipo
    const getNotificationIcon = (notification) => {
        const { tipo } = notification;
        
        switch (tipo) {
            case 'pedido':
                return ShoppingCart;
            case 'cliente':
                return Users;
            case 'inventario':
                return Package;
            case 'sistema':
                return Settings;
            default:
                return Bell;
        }
    };

    // Función para mejorar el título de las notificaciones
    const formatNotificationTitle = (notification) => {
        const { titulo, tipo } = notification;
        
        // Si ya tiene título, usarlo (viene bien de la API)
        if (titulo && titulo.length > 3) {
            return titulo;
        }

        // Fallback basado en el tipo
        switch (tipo) {
            case 'pedido':
                return 'Nuevo Pedido';
            case 'cliente':
                return 'Clientes';
            case 'inventario':
                return 'Inventario';
            case 'sistema':
                return 'Sistema';
            default:
                return 'Notificación';
        }
    };

    const markAllRead = async () => {
        try {
            // Actualizar inmediatamente el estado local
            setnoleidas(0);
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            
            // Hacer la llamada al servidor
            await axios.post('https://api.mamamianpizza.com/api/notifications/mark-all-read', {}, {withCredentials: true} );
        } catch (err){
            console.error('Error marcando notificaciones como leídas:', err);
            // En caso de error, revertir el estado
            fetchNoLeidas();
        }
    };

   const fetchNoLeidas = async () => {
        try {
            const {data} = await axios.get('https://api.mamamianpizza.com/api/notifications/unread', {withCredentials: true});
            setnoleidas(data.count);
        }
        catch(err) {
            console.error('Error al extraer todos las notificaciones no leidas:', err);
        }
   };

    // Función para mostrar notificaciones push del navegador
    const showPushNotification = async (notification) => {
        if (!canShowNotifications) return;

        const config = getNotificationConfig(notification);
        const title = notification.formattedTitle || 'Nueva Notificación';
        const message = notification.formattedMessage || 'Tienes una nueva notificación en MamaMian Pizza';

        const notificationOptions = {
            body: message,
            icon: '/src/assets/Logo.png', // Usar el logo de la aplicación
            badge: '/vite.svg',
            tag: `notification-${notification.id || Date.now()}`,
            requireInteraction: notification.tipo === 'pedido', // Los pedidos requieren más atención
            silent: false,
            timestamp: Date.now(),
            data: {
                notificationId: notification.id,
                tipo: notification.tipo,
                url: window.location.origin
            }
        };

        // Solo agregar acciones si vamos a usar Service Worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
            try {
                const registration = await navigator.serviceWorker.ready;
                if (registration && registration.showNotification) {
                    // Agregar acciones solo para Service Worker
                    if (notification.tipo === 'pedido') {
                        notificationOptions.actions = [
                            {
                                action: 'view',
                                title: 'Ver Pedido'
                            },
                            {
                                action: 'dismiss',
                                title: 'Descartar'
                            }
                        ];
                    }
                    
                    await registration.showNotification(title, notificationOptions);
                    return;
                }
            } catch (error) {
                console.error('Error usando Service Worker para notificaciones:', error);
            }
        }

        // Fallback: usar showNotification del hook
        await showNotification(title, notificationOptions);
    };

    // Función para manejar permisos de notificación
    const enablePushNotifications = async () => {
        const granted = await requestPermission();
        if (granted) {
            console.log('Notificaciones push habilitadas');
        } else {
            console.warn('Permisos de notificación denegados');
        }
        return granted;
    };

    useEffect(() => {
        fetchNoLeidas();
        
        // Solicitar permisos para notificaciones push al inicializar
        if (isSupported && permission === 'default') {
            requestPermission();
        }
        
        evtSourceRef.current = new EventSource('https://api.mamamianpizza.com/api/notifications/stream', {withCredentials: true});
        evtSourceRef.current.onmessage = e => {
            const rawNotif = JSON.parse(e.data);
            
            // Mejorar el formato de la notificación usando los campos reales de la API
            const enhancedNotif = {
                ...rawNotif,
                formattedTitle: formatNotificationTitle(rawNotif),
                formattedMessage: formatNotificationMessage(rawNotif),
                icon: getNotificationIcon(rawNotif),
                timestamp: rawNotif.fecha_emision || new Date().toISOString(),
                category: rawNotif.tipo // Para compatibilidad con el sidebar
            };
            
            setNotifications(n => [enhancedNotif, ...n]);
            setnoleidas((u) => u + 1);
            
            // Mostrar notificación push si la página no está visible
            if (!isPageVisible() && canShowNotifications) {
                showPushNotification(enhancedNotif);
            }
        };
        return () => {
            evtSourceRef.current?.close();
        };
    }, [isSupported, permission, requestPermission, canShowNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications, 
            markAllRead, 
            noleidas, 
            fetchNoLeidas,
            formatNotificationMessage,
            formatNotificationTitle,
            getNotificationIcon,
            // Funciones de notificaciones push
            enablePushNotifications,
            canShowNotifications,
            pushPermission: permission,
            isPushSupported: isSupported
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error(
            'useNotifications debe ser usado dentro de un NotificationProvider'
        );
    }
    return ctx;
};
