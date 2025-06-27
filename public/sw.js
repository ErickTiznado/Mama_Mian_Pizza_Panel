// Service Worker pa    let notificationData = {
        title: 'MamaMian Pizza',
        body: 'Nueva notificación disponible',
        icon: '/src/assets/Logo.png',
        badge: '/vite.svg',
        tag: 'default',
        requireInteraction: false,
        data: {
            url: '/'
        }
    };notificaciones push
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

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click:', event);

    event.notification.close();

    const notificationData = event.notification.data;
    const action = event.action;

    let urlToOpen = notificationData.url || '/';

    // Manejar acciones específicas
    if (action === 'view') {
        urlToOpen = notificationData.url || '/';
    } else if (action === 'dismiss') {
        return; // Solo cerrar la notificación
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Buscar si ya hay una ventana abierta
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        // Navegar a la URL específica
                        client.postMessage({
                            type: 'NOTIFICATION_CLICK',
                            url: urlToOpen,
                            data: notificationData
                        });
                        return client.focus();
                    }
                }
                
                // Si no hay ventana abierta, abrir una nueva
                if (clients.openWindow) {
                    return clients.openWindow(self.location.origin + urlToOpen);
                }
            })
    );
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);
    
    // Aquí podrías enviar analytics o marcar la notificación como vista
    const notificationData = event.notification.data;
    if (notificationData.notificationId) {
        // Opcional: marcar como vista en el servidor
        markNotificationAsViewed(notificationData.notificationId);
    }
});

// Función auxiliar para obtener URL según el tipo de notificación
function getUrlByType(tipo) {
    switch (tipo) {
        case 'pedido':
            return '/pedidos';
        case 'cliente':
            return '/clientes';
        case 'inventario':
            return '/inventario';
        case 'sistema':
            return '/configuracion';
        default:
            return '/home';
    }
}

// Función auxiliar para marcar notificación como vista (opcional)
function markNotificationAsViewed(notificationId) {
    fetch(`${API_BASE_URL}/api/notifications/${notificationId}/viewed`, {
        method: 'POST',
        credentials: 'include'
    }).catch(error => {
        console.error('Error marking notification as viewed:', error);
    });
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
