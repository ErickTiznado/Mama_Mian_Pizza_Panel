// Service Worker para gestionar notificaciones push
console.log('[Service Worker] Inicializando SW de notificaciones...');

const API_URL = 'https://server.tiznadodev.com/api/notifications';

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

// Mantener un registro de las notificaciones ya mostradas para evitar duplicados
let notificationsShown = new Set();

// Sincronizar con el servidor en segundo plano
const syncWithServer = async () => {
  try {
    // Intentar obtener notificaciones sin leer del servidor
    const response = await fetch(`${API_URL}/unread`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const unreadNotifications = await response.json();
    console.log('[Service Worker] Notificaciones no leídas recuperadas:', unreadNotifications.length);
    
    // Procesar solo las nuevas notificaciones que requieren alerta
    // y que no hayan sido mostradas anteriormente
    const notificationsToShow = unreadNotifications.filter(notification => {
      // Verificar que sea una notificación no leída y que no la hayamos mostrado antes
      return notification.estado === 'no leida' && 
             !notificationsShown.has(notification.id_notificacion) &&
             !notification.displayedByServiceWorker;
    });
    
    console.log('[Service Worker] Notificaciones a mostrar:', notificationsToShow.length);
    
    // Mostrar notificaciones nuevas
    for (const notification of notificationsToShow) {
      await showNotification(notification);
      
      // Registrar que esta notificación ya fue mostrada
      notificationsShown.add(notification.id_notificacion);
      
      // Marcar como mostrada en el server pero sin cambiar su estado de leída/no leída
      try {
        await fetch(`${API_URL}/${notification.id_notificacion}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ displayedByServiceWorker: true })
        });
      } catch (error) {
        console.error('[Service Worker] Error al actualizar estado de notificación:', error);
      }
    }
    
    return unreadNotifications;
  } catch (error) {
    console.error('[Service Worker] Error al sincronizar con servidor:', error);
    return [];
  }
};

// Función auxiliar para mostrar una notificación
const showNotification = async (notificationData) => {
  try {
    // Parsear data si existe
    let data = {};
    if (typeof notificationData.data === 'string' && notificationData.data) {
      try {
        data = JSON.parse(notificationData.data);
      } catch (e) {
        console.error('[Service Worker] Error al parsear data de notificación:', e);
      }
    } else if (typeof notificationData.data === 'object' && notificationData.data !== null) {
      data = notificationData.data;
    }
    
    const options = {
      body: notificationData.mensaje || notificationData.message || 'Nueva notificación',
      icon: '/vite.svg', 
      badge: '/vite.svg',
      data: { 
        ...data, 
        serverId: notificationData.id_notificacion,
        category: notificationData.categoria || notificationData.category || 'sistema'
      },
      vibrate: [100, 50, 100],
      requireInteraction: data.timeToShow ? true : false,
      actions: [
        {
          action: 'view',
          title: 'Ver'
        }
      ]
    };

    await self.registration.showNotification(
      notificationData.titulo || notificationData.title || 'MamaMian Pizza', 
      options
    );
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Error al mostrar notificación:', error);
    return false;
  }
};

// Gestionar notificaciones push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recibido:', event);
  if (!event.data) return;

  try {
    const data = event.data.json();
    console.log('[Service Worker] Datos de push:', data);
    
    // Solo mostrar si no está marcada como leída
    if (data.read === true || data.estado === 'leida') {
      console.log('[Service Worker] Ignorando notificación ya leída');
      return;
    }
    
    // Agregar a la lista de notificaciones mostradas para evitar duplicados
    if (data.id_notificacion) {
      notificationsShown.add(data.id_notificacion);
    }
    
    const options = {
      body: data.message || data.mensaje || 'Nueva notificación',
      icon: '/vite.svg',
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
      self.registration.showNotification(
        data.title || data.titulo || 'MamaMian Pizza', 
        options
      )
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
  
  if (notificationData.category === 'pedidos' || notificationData.categoria === 'pedidos') {
    url = '/pedidos';
  } else if (notificationData.category === 'inventario' || notificationData.categoria === 'inventario') {
    url = '/inventario';
  } else if (notificationData.category === 'clientes' || notificationData.categoria === 'clientes') {
    url = '/clientes';
  }
  
  // Si es una acción específica
  if (event.action === 'view' && notificationData.url) {
    url = notificationData.url;
  }

  // Si tenemos el ID del servidor, marcar como leída al hacer clic
  if (notificationData.serverId) {
    try {
      fetch(`${API_URL}/${notificationData.serverId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'leida' })
      }).then(() => {
        console.log('[Service Worker] Notificación marcada como leída en el servidor');
      }).catch(error => {
        console.error('[Service Worker] Error al marcar como leída:', error);
      });
    } catch (error) {
      console.error('[Service Worker] Error al enviar petición de leída:', error);
    }
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

// Sincronizar periódicamente con el servidor para recibir notificaciones
// incluso si el frontend está cerrado
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'notifications-sync') {
    console.log('[Service Worker] Realizando sincronización periódica de notificaciones');
    event.waitUntil(syncWithServer());
  }
});

// Iniciar sincronización periódica al registrar el Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_NOTIFICATION_SYNC') {
    console.log('[Service Worker] Recibida solicitud para configurar sincronización periódica');
    
    // Realizar una sincronización inmediata
    syncWithServer();
    
    if ('periodicSync' in self.registration) {
      // Intentar registrar sincronización periódica 
      // (la API requiere que el usuario conceda permisos)
      const tryPeriodicSync = async () => {
        try {
          await self.registration.periodicSync.register('notifications-sync', {
            minInterval: 15 * 60 * 1000 // Cada 15 minutos como mínimo
          });
          console.log('[Service Worker] Sincronización periódica registrada');
        } catch (error) {
          console.warn('[Service Worker] Error al registrar sincronización periódica:', error);
          // Configuramos un temporizador como alternativa
          setTimeout(() => {
            syncWithServer();
          }, 5 * 60 * 1000); // Cada 5 minutos como alternativa
        }
      };
      
      tryPeriodicSync();
    } else {
      console.warn('[Service Worker] Periodic Sync API no disponible');
      // Alternativa para navegadores sin periodicSync
      setInterval(() => {
        syncWithServer();
      }, 5 * 60 * 1000); // Cada 5 minutos como alternativa
    }
  }
});