// Service Worker para gestionar notificaciones push
console.log('[Service Worker] Inicializando SW de notificaciones...');

// Evento de instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando SW de notificaciones...');
  self.skipWaiting();
});

// Evento de activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] SW de notificaciones activado y listo!');
  return self.clients.claim();
});

// Gestionar notificaciones push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recibido:', event);
  if (!event.data) return;

  try {
    const data = event.data.json();
    console.log('[Service Worker] Datos de push:', data);
    
    const options = {
      body: data.message || 'Nueva notificación',
      icon: '/vite.svg', // Ruta relativa al directorio public
      badge: '/vite.svg',
      data: data.data || {},
      vibrate: [100, 50, 100],
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'MamaMian Pizza', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error al procesar notificación push:', error);
    
    // Si hay error al parsear JSON, mostrar notificación genérica
    event.waitUntil(
      self.registration.showNotification('MamaMian Pizza', {
        body: 'Nueva notificación',
        icon: '/vite.svg'
      })
    );
  }
});

// Gestionar clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Clic en notificación:', event);
  event.notification.close();

  // Datos personalizados de la notificación
  const notificationData = event.notification.data || {};
  
  // URL a la que dirigir según la categoría
  let url = '/';
  
  if (notificationData.category === 'pedidos') {
    url = '/pedidos';
  } else if (notificationData.category === 'inventario') {
    url = '/inventario';
  } else if (notificationData.category === 'clientes') {
    url = '/clientes';
  }
  
  // Si es una acción específica
  if (event.action === 'view' && notificationData.url) {
    url = notificationData.url;
  }

  console.log('[Service Worker] Abriendo URL:', url);

  // Abrir o enfocar la ventana existente
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Si no hay ventanas abiertas, abrir una nueva
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});