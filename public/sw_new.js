// Service Worker para notificaciones push
const CACHE_NAME = 'mamamian-push-v1';
const API_BASE_URL = 'https://api.mamamianpizza.com';

// Instalar service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    self.skipWaiting();
});

// Activar service worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
    event.waitUntil(self.clients.claim());
});

// Función auxiliar para obtener URL según tipo de notificación
function getUrlByType(tipo) {
    switch (tipo) {
        case 'pedido':
            return '/pedidos';
        case 'cliente':
            return '/clientes';
        case 'inventario':
            return '/inventario';
        default:
            return '/';
    }
}

// Manejar notificaciones push
self.addEventListener('push', (event) => {
    console.log('Push recibido:', event);

    let notificationData = {
        title: 'MamaMian Pizza',
        body: 'Nueva notificación disponible',
        icon: '/src/assets/Logo.png',
        badge: '/vite.svg',
        tag: 'default',
        requireInteraction: false,
        data: {
            url: '/'
        }
    };

    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = {
                title: pushData.title || pushData.formattedTitle || 'MamaMian Pizza',
                body: pushData.body || pushData.formattedMessage || 'Nueva notificación disponible',
                icon: '/src/assets/Logo.png',
                badge: '/vite.svg',
                tag: pushData.tag || `notification-${pushData.id || Date.now()}`,
                requireInteraction: pushData.tipo === 'pedido',
                data: {
                    url: getUrlByType(pushData.tipo),
                    notificationId: pushData.id,
                    tipo: pushData.tipo
                },
                actions: pushData.tipo === 'pedido' ? [
                    {
                        action: 'view',
                        title: 'Ver Pedido'
                    },
                    {
                        action: 'dismiss',
                        title: 'Descartar'
                    }
                ] : []
            };
        } catch (error) {
            console.error('Error parsing push data:', error);
        }
    }

    const showNotification = self.registration.showNotification(
        notificationData.title,
        notificationData
    );

    event.waitUntil(showNotification);
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    const notification = event.notification;
    const action = event.action;
    
    notification.close();
    
    if (action === 'dismiss') {
        return;
    }
    
    // Determinar URL a abrir
    let url = '/';
    if (notification.data && notification.data.url) {
        url = notification.data.url;
    }
    
    // Abrir o enfocar ventana
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // Buscar si ya hay una ventana abierta con la URL objetivo
            for (const client of clients) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Si no hay ventana abierta, abrir una nueva
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);
    
    // Opcional: reportar al servidor que la notificación fue cerrada
    const notification = event.notification;
    if (notification.data && notification.data.notificationId) {
        fetch(`${API_BASE_URL}/api/notifications/${notification.data.notificationId}/close`, {
            method: 'POST',
            credentials: 'include'
        }).catch(error => {
            console.error('Error reporting notification close:', error);
        });
    }
});

// Manejar mensajes del cliente principal
self.addEventListener('message', (event) => {
    console.log('Message received in SW:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Interceptar requests (opcional, para cachear recursos si es necesario)
self.addEventListener('fetch', (event) => {
    // Por ahora solo interceptamos requests a la API para debugging
    if (event.request.url.includes('/api/notifications')) {
        console.log('API request intercepted:', event.request.url);
    }
    
    // Pasar todas las requests sin modificar
    event.respondWith(fetch(event.request));
});

// Manejar errores globales
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

// Manejar errores de promesas no capturadas
self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});
