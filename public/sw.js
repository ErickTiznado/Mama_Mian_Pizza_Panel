console.log('SW loaded');

self.addEventListener('install', function(event) {
    console.log('SW instalado');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('SW activado');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
    console.log('Push recibido');
    
    let notificationData = {
        title: 'MamaMian Pizza',
        body: 'Nueva notificacion',
        icon: '/vite.svg',
        badge: '/vite.svg'
    };
    
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData.title = data.titulo || data.title || 'MamaMian Pizza';
            notificationData.body = data.mensaje || data.body || 'Nueva notificacion';
        } catch (error) {
            console.error('Error parsing push data:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notificacion clickeada');
    event.notification.close();
    
    event.waitUntil(
        self.clients.openWindow('/')
    );
});