// Servicio para manejar notificaciones en toda la aplicación
// Este servicio permite crear y gestionar notificaciones desde cualquier parte de la aplicación

const API_URL = 'https://server.tiznadodev.com/api/notifications';

// Categorías de notificaciones disponibles
export const NotificationCategories = {
  PEDIDOS: 'pedidos',
  INVENTARIO: 'inventario',
  CLIENTES: 'clientes',
  SISTEMA: 'sistema'
};

// Tipos de notificaciones (diferentes estilos visuales)
export const NotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Mapeo entre campos locales y del servidor
const mapLocalToServer = (notification) => {
  return {
    titulo: notification.title,
    mensaje: notification.message,
    tipo: notification.type || 'info',
    categoria: notification.category || 'sistema',
    data: JSON.stringify(notification.data || {}),
    estado: notification.read ? 'leida' : 'no leida'
  };
};

const mapServerToLocal = (serverNotification) => {
  return {
    id: Date.now() + Math.random(),
    serverId: serverNotification.id_notificacion,
    title: serverNotification.titulo,
    message: serverNotification.mensaje,
    timestamp: new Date(serverNotification.fecha_emision || Date.now()),
    category: serverNotification.categoria || 'sistema',
    type: serverNotification.tipo || 'info',
    read: serverNotification.estado === 'leida',
    data: serverNotification.data ? JSON.parse(serverNotification.data) : {}
  };
};

// Funciones para comunicarse con el API remoto de notificaciones
export const fetchNotifications = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const serverNotifications = await response.json();
    // Convertir al formato local
    return serverNotifications.map(mapServerToLocal);
  } catch (error) {
    console.error('Error al obtener notificaciones del servidor:', error);
    return [];
  }
};

export const fetchUnreadNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/unread`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const serverNotifications = await response.json();
    // Convertir al formato local
    return serverNotifications.map(mapServerToLocal);
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    return [];
  }
};

export const saveNotificationToServer = async (notification) => {
  try {
    const serverNotification = mapLocalToServer(notification);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serverNotification)
    });
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const result = await response.json();
    
    // Devolver el objeto con el ID del servidor
    if (result && result.id_notificacion) {
      return { 
        ...notification, 
        serverId: result.id_notificacion
      };
    }
    
    return notification;
  } catch (error) {
    console.error('Error al guardar notificación en el servidor:', error);
    return notification; // Devolvemos la notificación original para guardarla localmente
  }
};

export const markNotificationReadOnServer = async (notificationId) => {
  try {
    console.log('Marcando como leída en servidor la notificación con ID:', notificationId);
    const response = await fetch(`${API_URL}/${notificationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: 'leida' })
    });
    
    if (!response.ok) {
      console.error('Error de respuesta del servidor:', response.status, response.statusText);
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const resultado = await response.json();
    console.log('Respuesta del servidor al marcar como leída:', resultado);
    return true;
  } catch (error) {
    console.error('Error al marcar notificación como leída en el servidor:', error);
    return false;
  }
};

export const markAllNotificationsReadOnServer = async () => {
  try {
    const response = await fetch(`${API_URL}/mark-all-read`, {
      method: 'PATCH'
    });
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return true;
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas en el servidor:', error);
    return false;
  }
};

export const deleteNotificationFromServer = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/${notificationId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar notificación del servidor:', error);
    return false;
  }
};

// Función para crear una notificación de pedido nuevo
export const createOrderNotification = (notificationContext, pedido) => {
  if (!notificationContext) return null;
  
  const notification = {
    title: 'Nuevo pedido recibido',
    message: `Pedido #${pedido.codigo_pedido || pedido.id_pedido} por $${parseFloat(pedido.total).toFixed(2)}`,
    category: NotificationCategories.PEDIDOS,
    type: NotificationType.INFO,
    showPush: true,
    urgente: true, // Marcar como urgente para destacarlo en notificaciones push
    read: false, // Asegurarse de que sea no leída
    data: { 
      pedidoId: pedido.id_pedido,
      url: '/pedidos',
      timeToShow: 10000, // Tiempo que la notificación permanece visible (10 segundos)
      sound: true // Reproducir sonido de alerta
    }
  };
  
  // Intentar guardar en el servidor y luego en local
  return saveNotificationToServer(notification)
    .then(serverNotification => {
      // Si se guardó correctamente en el servidor con ID, usar ese objeto
      return notificationContext.addNotification(serverNotification);
    })
    .catch(() => {
      // En caso de error, guardar solo localmente
      return notificationContext.addNotification(notification);
    });
};

// Función para crear una notificación de cambio de estado de pedido
export const createOrderStatusNotification = (notificationContext, pedido, nuevoEstado) => {
  if (!notificationContext) return null;
  
  const getStatusName = (estado) => {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };
  
  // Determinar si es un estado importante para notificación push
  const isImportantStatus = nuevoEstado === 'en_proceso' || nuevoEstado === 'entregado';
  
  const notification = {
    title: 'Estado de pedido actualizado',
    message: `Pedido #${pedido.codigo_pedido || pedido.id_pedido} ahora está: ${getStatusName(nuevoEstado)}`,
    category: NotificationCategories.PEDIDOS,
    type: NotificationType.SUCCESS,
    showPush: isImportantStatus, // Solo enviar push para estados importantes
    data: { 
      pedidoId: pedido.id_pedido, 
      estado: nuevoEstado,
      url: '/pedidos'
    }
  };

  // Intentar guardar en el servidor y luego en local
  saveNotificationToServer(notification)
    .then(serverNotification => {
      if (serverNotification && serverNotification.id) {
        return notificationContext.addNotification({
          ...notification,
          serverId: serverNotification.id
        });
      } else {
        return notificationContext.addNotification(notification);
      }
    })
    .catch(() => {
      return notificationContext.addNotification(notification);
    });
};

// Función para crear una notificación de inventario bajo
export const createLowInventoryNotification = (notificationContext, producto) => {
  if (!notificationContext) return null;
  
  const notification = {
    title: 'Inventario bajo',
    message: `${producto.nombre} está por debajo del nivel mínimo (${producto.cantidad} ${producto.unidad})`,
    category: NotificationCategories.INVENTARIO,
    type: NotificationType.WARNING,
    showPush: true,
    urgente: true, // Marcar como urgente para destacarlo en notificaciones push
    data: { 
      productoId: producto.id_ingrediente,
      url: '/inventario',
      timeToShow: 15000 // Tiempo que la notificación permanece visible (15 segundos)
    }
  };

  // Intentar guardar en el servidor y luego en local
  saveNotificationToServer(notification)
    .then(serverNotification => {
      if (serverNotification && serverNotification.id) {
        return notificationContext.addNotification({
          ...notification,
          serverId: serverNotification.id
        });
      } else {
        return notificationContext.addNotification(notification);
      }
    })
    .catch(() => {
      return notificationContext.addNotification(notification);
    });
};

// Función para crear una notificación de nuevo cliente
export const createNewClientNotification = (notificationContext, cliente) => {
  if (!notificationContext) return null;
  
  const notification = {
    title: 'Nuevo cliente registrado',
    message: `${cliente.nombre} se ha registrado en el sistema`,
    category: NotificationCategories.CLIENTES,
    type: NotificationType.INFO,
    showPush: true,
    data: { 
      clienteId: cliente.id,
      url: '/clientes'
    }
  };

  // Intentar guardar en el servidor y luego en local
  saveNotificationToServer(notification)
    .then(serverNotification => {
      if (serverNotification && serverNotification.id) {
        return notificationContext.addNotification({
          ...notification,
          serverId: serverNotification.id
        });
      } else {
        return notificationContext.addNotification(notification);
      }
    })
    .catch(() => {
      return notificationContext.addNotification(notification);
    });
};

// Función para crear una notificación genérica del sistema
export const createSystemNotification = (notificationContext, { title, message, type = NotificationType.INFO, urgente = false }) => {
  if (!notificationContext) return null;
  
  const notification = {
    title,
    message,
    category: NotificationCategories.SISTEMA,
    type,
    showPush: urgente, // Solo enviar push si es urgente
    urgente,
    data: { 
      timeToShow: urgente ? 20000 : 5000 // Más tiempo visible si es urgente
    }
  };

  // Intentar guardar en el servidor y luego en local
  saveNotificationToServer(notification)
    .then(serverNotification => {
      if (serverNotification && serverNotification.id) {
        return notificationContext.addNotification({
          ...notification,
          serverId: serverNotification.id
        });
      } else {
        return notificationContext.addNotification(notification);
      }
    })
    .catch(() => {
      return notificationContext.addNotification(notification);
    });
};

// Función para reproducir un sonido de alerta para notificaciones
export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 0.5; // Volumen al 50%
    audio.play().catch(e => console.log('Error reproduciendo sonido:', e));
  } catch (error) {
    console.log('No se pudo reproducir el sonido de notificación');
  }
};

// Función para mostrar una notificación de prueba (útil para desarrollo)
export const testNotification = (notificationContext, category = NotificationCategories.SISTEMA) => {
  if (!notificationContext) return null;
  
  const now = new Date();
  const notification = {
    title: 'Notificación de prueba',
    message: `Esta es una notificación de prueba enviada a las ${now.toLocaleTimeString()}`,
    category: category,
    type: NotificationType.INFO,
    showPush: true,
    data: { 
      test: true,
      timestamp: now.getTime()
    }
  };

  // Para pruebas, intentamos guardar en servidor también
  saveNotificationToServer(notification)
    .then(serverNotification => {
      if (serverNotification && serverNotification.id) {
        return notificationContext.addNotification({
          ...notification,
          serverId: serverNotification.id
        });
      } else {
        return notificationContext.addNotification(notification);
      }
    })
    .catch(() => {
      return notificationContext.addNotification(notification);
    });
};