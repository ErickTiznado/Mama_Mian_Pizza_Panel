import { useState, useEffect, useRef, useCallback } from 'react';
import { initializeServiceWorker } from '../utils/serviceWorkerManager';

export const usePushNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);
    const [isSupported, setIsSupported] = useState(false);
    const [swRegistered, setSwRegistered] = useState(false);

    useEffect(() => {
        // Verificar si las notificaciones están soportadas
        setIsSupported('Notification' in window);
        
        // Registrar service worker
        initializeServiceWorker().then(registered => {
            setSwRegistered(registered);
            console.log('Service Worker registrado:', registered);
        });
    }, []);

    // Solicitar permisos para notificaciones
    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            console.warn('Las notificaciones no están soportadas en este navegador');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        } catch (error) {
            console.error('Error al solicitar permisos de notificación:', error);
            return false;
        }
    }, [isSupported]);

    // Mostrar notificación push usando Service Worker para soporte completo
    const showNotification = useCallback(async (title, options = {}) => {
        if (!isSupported || permission !== 'granted') {
            console.warn('No se pueden mostrar notificaciones: sin permisos o no soportado');
            return null;
        }

        const defaultOptions = {
            icon: '/vite.svg', // Usar vite.svg que sabemos que existe
            badge: '/vite.svg',
            tag: 'mamamian-notification',
            requireInteraction: false,
            silent: false,
            ...options
        };

        try {
            // Si tenemos service worker registrado, usarlo para notificaciones con acciones
            if (swRegistered && 'serviceWorker' in navigator && navigator.serviceWorker.ready) {
                const registration = await navigator.serviceWorker.ready;
                if (registration && registration.showNotification) {
                    await registration.showNotification(title, defaultOptions);
                    return true;
                }
            }
            
            // Fallback: usar Notification API básica (sin acciones)
            const { actions, ...basicOptions } = defaultOptions; // Remover acciones para Notification básica
            const notification = new Notification(title, basicOptions);
            
            // Auto-cerrar después de 5 segundos si no requiere interacción
            if (!basicOptions.requireInteraction) {
                setTimeout(() => {
                    notification.close();
                }, 5000);
            }

            return notification;
        } catch (error) {
            console.error('Error al mostrar notificación:', error);
            return null;
        }
    }, [isSupported, permission, swRegistered]);

    // Verificar si la página está visible
    const isPageVisible = useCallback(() => {
        return !document.hidden;
    }, []);

    // Obtener configuración de notificación según el tipo
    const getNotificationConfig = useCallback((notification) => {
        const configs = {
            pedido: {
                icon: '🛒',
                color: '#4CAF50',
                priority: 'high'
            },
            cliente: {
                icon: '👥',
                color: '#2196F3',
                priority: 'normal'
            },
            inventario: {
                icon: '📦',
                color: '#FF9800',
                priority: 'normal'
            },
            sistema: {
                icon: '⚙️',
                color: '#9C27B0',
                priority: 'low'
            },
            default: {
                icon: '🔔',
                color: '#607D8B',
                priority: 'normal'
            }
        };

        return configs[notification.tipo] || configs.default;
    }, []);

    return {
        permission,
        isSupported,
        requestPermission,
        showNotification,
        isPageVisible,
        getNotificationConfig,
        canShowNotifications: isSupported && permission === 'granted',
        swRegistered
    };
};
