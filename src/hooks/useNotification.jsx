import {useState, useEffect, useRef, createContext, useContext} from 'react';
import axios from 'axios';
import { ShoppingCart, Users, Package, Settings, Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { usePushNotifications } from './usePushNotifications';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const evtSourceRef = useRef(null);
    const [noleidas, setnoleidas] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const reconnectTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const lastHeartbeatRef = useRef(Date.now());
    const moderatePollingRef = useRef(null);
    const lastFetchTime = useRef(Date.now());
    
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

    // Función para mejorar el mensaje de las notificaciones (adaptado al backend)
    const formatNotificationMessage = (notification) => {
        const { tipo, mensaje, titulo } = notification;
        
        // Usar el campo 'mensaje' del backend directamente
        if (mensaje && mensaje.length > 5) {
            return mensaje;
        }

        // Fallback basado en el tipo si no hay mensaje
        switch (tipo) {
            case 'pedido':
                return titulo || 'Nueva actividad en pedidos';
            case 'cliente':
                return 'Nueva actividad en clientes';
            case 'inventario':
                return 'Actualización en inventario';
            case 'sistema':
            case 'system':
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

    // Función para mejorar el título de las notificaciones (adaptado al backend)
    const formatNotificationTitle = (notification) => {
        const { titulo, tipo } = notification;
        
        // Usar el campo 'titulo' del backend directamente
        if (titulo && titulo.length > 2) {
            return titulo;
        }

        // Fallback basado en el tipo si no hay título
        switch (tipo) {
            case 'pedido':
                return 'Nuevo Pedido';
            case 'cliente':
                return 'Clientes';
            case 'inventario':
                return 'Inventario';
            case 'sistema':
            case 'system':
                return 'Sistema';
            default:
                return 'Notificación';
        }
    };

    // Función para conectar/reconectar SSE
    const connectSSE = () => {
        if (evtSourceRef.current) {
            evtSourceRef.current.close();
        }

        console.log('Conectando a SSE...');
        setConnectionStatus('connecting');
        
        try {
            evtSourceRef.current = new EventSource('https://api.mamamianpizza.com/api/notifications/stream', {
                withCredentials: true
            });

            evtSourceRef.current.onopen = () => {
                console.log('SSE conectado exitosamente');
                setConnectionStatus('connected');
                lastHeartbeatRef.current = Date.now();
                
                // Limpiar timeout de reconexión si existe
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                
                // Fetch inmediato de notificaciones al conectar
                setTimeout(() => {
                    fetchNoLeidas();
                    checkForNewNotifications();
                }, 1000);
            };

            evtSourceRef.current.onmessage = (e) => {
                try {
                    const backendNotif = JSON.parse(e.data);
                    console.log('📨 Mensaje SSE recibido del backend:', backendNotif);
                    
                    // Verificar si es un heartbeat
                    if (backendNotif.type === 'heartbeat') {
                        lastHeartbeatRef.current = Date.now();
                        console.log('💓 Heartbeat recibido');
                        return;
                    }
                    
                    // Verificar si es mensaje de test de conexión
                    if (backendNotif.id_notificacion === 'test') {
                        console.log('🧪 Mensaje de test SSE recibido:', backendNotif.titulo);
                        return;
                    }
                    
                    // Procesar notificación del backend con estructura correcta
                    const enhancedNotif = {
                        ...backendNotif,
                        id: backendNotif.id_notificacion, // Mapear id_notificacion a id
                        formattedTitle: formatNotificationTitle(backendNotif),
                        formattedMessage: formatNotificationMessage(backendNotif),
                        icon: getNotificationIcon(backendNotif),
                        timestamp: backendNotif.fecha_emision || new Date().toISOString(),
                        category: backendNotif.tipo
                    };
                    
                    console.log('✨ Notificación del backend procesada:', enhancedNotif);
                    
                    setNotifications(n => {
                        // Verificar duplicados usando id_notificacion
                        const exists = n.find(notif => notif.id_notificacion === enhancedNotif.id_notificacion);
                        if (!exists) {
                            console.log('➕ Añadiendo nueva notificación del backend');
                            return [enhancedNotif, ...n];
                        } else {
                            console.log('⚠️ Notificación duplicada, ignorando');
                        }
                        return n;
                    });
                    
                    // Solo incrementar si la notificación no está leída
                    if (backendNotif.estado === 'no leida') {
                        setnoleidas((u) => u + 1);
                    }
                    
                    // Mostrar notificación push si la página no está visible
                    if (!isPageVisible() && canShowNotifications) {
                        showPushNotification(enhancedNotif);
                    }
                } catch (error) {
                    console.error('❌ Error parseando notificación SSE del backend:', error);
                }
            };

            evtSourceRef.current.onerror = (error) => {
                console.error('Error en SSE:', error);
                setConnectionStatus('error');
                
                // Intentar reconectar después de un delay
                if (!reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('Intentando reconectar SSE...');
                        connectSSE();
                    }, 2000); // Reconectar cada 2 segundos
                }
            };
        } catch (error) {
            console.error('Error creando conexión SSE:', error);
            setConnectionStatus('error');
            
            // Intentar reconectar
            if (!reconnectTimeoutRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    connectSSE();
                }, 3000);
            }
        }
    };

    // Función de heartbeat para detectar conexiones perdidas (menos agresivo)
    const startHeartbeat = () => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
        }

        console.log('Iniciando heartbeat cada 30 segundos...');
        heartbeatIntervalRef.current = setInterval(() => {
            const timeSinceLastHeartbeat = Date.now() - lastHeartbeatRef.current;
            
            console.log('Verificando heartbeat - Tiempo desde último:', timeSinceLastHeartbeat);
            
            // Si no hemos recibido heartbeat en 60 segundos, reconectar
            if (timeSinceLastHeartbeat > 60000) {
                console.warn('Heartbeat perdido, reconectando SSE...');
                setConnectionStatus('disconnected');
                connectSSE();
            }
        }, 30000); // Heartbeat cada 30 segundos
    };
    // Función de polling moderado cada 30 segundos (solo como respaldo)
    const startModeratePolling = () => {
        if (moderatePollingRef.current) {
            clearInterval(moderatePollingRef.current);
        }

        console.log('Iniciando polling moderado cada 30 segundos...');
        
        moderatePollingRef.current = setInterval(async () => {
            const now = Date.now();
            const timeSinceLastFetch = now - lastFetchTime.current;
            
            // Solo hacer polling si han pasado al menos 25 segundos desde la última fetch
            if (timeSinceLastFetch >= 25000) {
                console.log('Ejecutando polling moderado...');
                await fetchNoLeidas();
                await checkForNewNotifications();
                lastFetchTime.current = now;
            }
        }, 30000); // Cada 30 segundos
    };

    // Función para verificar nuevas notificaciones directamente del servidor
    const checkForNewNotifications = async () => {
        try {
            console.log('🔍 Verificando nuevas notificaciones desde servidor...');
            const response = await axios.get('https://api.mamamianpizza.com/api/notifications/recent', {
                withCredentials: true,
                timeout: 8000,
                params: {
                    since: lastHeartbeatRef.current - 30000 // Últimas notificaciones de los últimos 30 segundos
                }
            });
            
            if (response.data && response.data.notifications && response.data.notifications.length > 0) {
                console.log('🎉 Nuevas notificaciones encontradas:', response.data.notifications.length);
                
                response.data.notifications.forEach(rawNotif => {
                    const enhancedNotif = {
                        ...rawNotif,
                        formattedTitle: formatNotificationTitle(rawNotif),
                        formattedMessage: formatNotificationMessage(rawNotif),
                        icon: getNotificationIcon(rawNotif),
                        timestamp: rawNotif.fecha_emision || new Date().toISOString(),
                        category: rawNotif.tipo
                    };
                    
                    // Verificar si la notificación ya existe
                    setNotifications(prev => {
                        const exists = prev.find(n => n.id === enhancedNotif.id);
                        if (!exists) {
                            console.log('➕ Añadiendo nueva notificación:', enhancedNotif.formattedTitle);
                            return [enhancedNotif, ...prev];
                        }
                        return prev;
                    });
                });
                
                // Actualizar contador
                setnoleidas(prev => prev + response.data.notifications.length);
                
                // Mostrar notificaciones push
                if (!isPageVisible() && canShowNotifications) {
                    response.data.notifications.forEach(notif => {
                        const enhancedNotif = {
                            ...notif,
                            formattedTitle: formatNotificationTitle(notif),
                            formattedMessage: formatNotificationMessage(notif)
                        };
                        showPushNotification(enhancedNotif);
                    });
                }
            } else {
                console.log('ℹ️ No hay nuevas notificaciones');
            }
        } catch (error) {
            console.error('❌ Error verificando nuevas notificaciones:', error);
        }
    };

    // Función de respaldo con polling moderado (solo como último recurso)
    const fallbackPolling = useRef(null);
    
    const startFallbackPolling = () => {
        if (fallbackPolling.current) {
            clearInterval(fallbackPolling.current);
        }

        console.log('Iniciando polling de respaldo cada 60 segundos...');
        fallbackPolling.current = setInterval(async () => {
            console.log('Ejecutando polling de respaldo - Estado conexión:', connectionStatus);
            try {
                await fetchNoLeidas();
                await checkForNewNotifications();
            } catch (error) {
                console.error('Error en polling de respaldo:', error);
            }
        }, 60000); // Polling cada 60 segundos como respaldo
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

   const fetchNoLeidas = async (retryCount = 0) => {
        try {
            console.log('🔍 Fetching notificaciones no leídas...');
            const {data} = await axios.get('https://api.mamamianpizza.com/api/notifications/unread', {
                withCredentials: true,
                timeout: 5000 // 5 segundos de timeout
            });
            console.log('✅ Notificaciones no leídas recibidas:', data.count);
            setnoleidas(data.count);
        }
        catch(err) {
            console.error('❌ Error al extraer notificaciones no leidas:', err);
            
            // Retry logic: hasta 3 intentos con delay exponencial
            if (retryCount < 3) {
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                console.log(`Reintentando fetchNoLeidas en ${delay}ms...`);
                setTimeout(() => {
                    fetchNoLeidas(retryCount + 1);
                }, delay);
            }
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

    // Función para inicializar el sistema con estrategia moderada
    const initializeNotificationSystem = () => {
        console.log('Inicializando sistema de notificaciones...');
        
        // Fetch inicial inmediato
        fetchNoLeidas();
        checkForNewNotifications();
        
        // Conectar SSE (principal método de comunicación)
        connectSSE();
        
        // Iniciar heartbeat moderado
        startHeartbeat();
        
        // Iniciar polling moderado solo como respaldo
        startModeratePolling();
        
        // Solo polling de respaldo muy ocasional
        startFallbackPolling();
    };

    // Función de testing manual para la consola
    const testNotificationSystem = async () => {
        console.log('🧪 INICIANDO TEST MANUAL DEL SISTEMA DE NOTIFICACIONES...');
        
        console.log('📊 Estado actual:');
        console.log('- Notificaciones no leídas:', noleidas);
        console.log('- Estado conexión SSE:', connectionStatus);
        console.log('- Total notificaciones en memoria:', notifications.length);
        
        console.log('🔄 Ejecutando fetch de notificaciones...');
        
        try {
            await fetchNoLeidas();
            console.log('✅ Fetch de notificaciones no leídas completado');
            
            await checkForNewNotifications();
            console.log('✅ Check de nuevas notificaciones completado');
            
            console.log('🧪 TEST COMPLETADO EXITOSAMENTE');
        } catch (error) {
            console.error('❌ ERROR EN TEST:', error);
        }
    };

    // Exponer función de testing en window para debugging manual
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.testNotifications = testNotificationSystem;
            console.log('🧪 Función de testing disponible: window.testNotifications()');
        }
    }, []);

    useEffect(() => {
        // Solicitar permisos para notificaciones push al inicializar
        if (isSupported && permission === 'default') {
            requestPermission();
        }
        
        // Inicializar sistema
        initializeNotificationSystem();
        
        // Cleanup function
        return () => {
            console.log('Limpiando sistema de notificaciones...');
            if (evtSourceRef.current) {
                evtSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            if (fallbackPolling.current) {
                clearInterval(fallbackPolling.current);
            }
            if (moderatePollingRef.current) {
                clearInterval(moderatePollingRef.current);
            }
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
            connectionStatus,
            // Funciones de notificaciones push
            enablePushNotifications,
            canShowNotifications,
            pushPermission: permission,
            isPushSupported: isSupported,
            // Funciones de conexión y mantenimiento
            reconnectSSE: connectSSE,
            forceCheck: checkForNewNotifications,
            forceRefresh: () => {
                fetchNoLeidas();
                checkForNewNotifications();
            }
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
