// Service Worker para manejar notificaciones push
const CACHE_NAME = 'notification-cache-v1';

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker de notificaciones instalado');
  // Activar inmediatamente sin esperar a que se cierre la página
  self.skipWaiting();
});

// Activación del Service Worker 
self.addEventListener('activate', event => {
  console.log('Service Worker de notificaciones activado');
  // Reclamar el control inmediatamente
  event.waitUntil(self.clients.claim());
});

// Evento para mostrar la notificación cuando se hace clic en ella
self.addEventListener('notificationclick', event => {
  console.log('Notification click recibido', event);
  
  // Cerrar la notificación
  event.notification.close();

  // Obtener los datos adjuntos
  const notificationData = event.notification.data;
  const url = notificationData?.url || '/';

  // Si se hace clic en el botón "view", o en la notificación misma
  if (event.action === 'view' || !event.action) {
    // Buscar si ya hay una ventana abierta para dirigirse a ella
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then(clientList => {
          // Verificar si ya hay una ventana abierta
          for (const client of clientList) {
            // Si ya hay una ventana abierta, navegar a la URL
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              // Navegar a la URL específica
              if (url && client.navigate) {
                return client.navigate(url);
              }
              return;
            }
          }
          
          // Si no hay una ventana abierta, abrir una nueva
          if (self.clients.openWindow) {
            return self.clients.openWindow(url);
          }
        })
    );
  }
});

// Evento para recibir mensajes desde la página principal
self.addEventListener('message', event => {
  console.log('Service Worker recibió mensaje:', event.data);
  
  if (event.data && event.data.type === 'INIT_NOTIFICATION_SYNC') {
    console.log('Inicializando sincronización de notificaciones');
    
    // Puedes añadir aquí la lógica de sincronización necesaria
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_READY',
          message: 'El Service Worker está activo y listo para notificaciones'
        });
      });
    });
  }
});

// Evento para notificaciones push (para futuras implementaciones de servidor)
self.addEventListener('push', event => {
  console.log('Push recibido:', event);

  if (!(self.Notification && self.Notification.permission === 'granted')) {
    console.log('No hay permisos para mostrar notificaciones push');
    return;
  }

  let data;
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Nueva notificación',
        message: event.data.text(),
      };
    }
  } else {
    data = {
      title: 'Nueva notificación',
      message: 'El servidor ha enviado una actualización'
    };
  }

  const options = {
    body: data.message || 'Hay una nueva actualización',
    icon: '/vite.svg',
    badge: '/vite.svg',
    data: data.data || {},
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});