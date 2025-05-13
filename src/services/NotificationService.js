// Servicio para manejar notificaciones en toda la aplicación
// Este servicio permite crear y gestionar notificaciones desde cualquier parte de la aplicación

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

// Función para crear una notificación de pedido nuevo
export const createOrderNotification = (notificationContext, pedido) => {
  if (!notificationContext) return null;
  
  return notificationContext.addNotification({
    title: 'Nuevo pedido recibido',
    message: `Pedido #${pedido.codigo_pedido || pedido.id_pedido} por $${parseFloat(pedido.total).toFixed(2)}`,
    category: NotificationCategories.PEDIDOS,
    type: NotificationType.INFO,
    showPush: true,
    urgente: true, // Marcar como urgente para destacarlo en notificaciones push
    data: { 
      pedidoId: pedido.id_pedido,
      url: '/pedidos',
      timeToShow: 10000, // Tiempo que la notificación permanece visible (10 segundos)
      sound: true // Reproducir sonido de alerta
    }
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
  
  return notificationContext.addNotification({
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
  });
};

// Función para crear una notificación de inventario bajo
export const createLowInventoryNotification = (notificationContext, producto) => {
  if (!notificationContext) return null;
  
  return notificationContext.addNotification({
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
  });
};

// Función para crear una notificación de nuevo cliente
export const createNewClientNotification = (notificationContext, cliente) => {
  if (!notificationContext) return null;
  
  return notificationContext.addNotification({
    title: 'Nuevo cliente registrado',
    message: `${cliente.nombre} se ha registrado en el sistema`,
    category: NotificationCategories.CLIENTES,
    type: NotificationType.INFO,
    showPush: true,
    data: { 
      clienteId: cliente.id,
      url: '/clientes'
    }
  });
};

// Función para crear una notificación genérica del sistema
export const createSystemNotification = (notificationContext, { title, message, type = NotificationType.INFO, urgente = false }) => {
  if (!notificationContext) return null;
  
  return notificationContext.addNotification({
    title,
    message,
    category: NotificationCategories.SISTEMA,
    type,
    showPush: urgente, // Solo enviar push si es urgente
    urgente,
    data: { 
      timeToShow: urgente ? 20000 : 5000 // Más tiempo visible si es urgente
    }
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
  return notificationContext.addNotification({
    title: 'Notificación de prueba',
    message: `Esta es una notificación de prueba enviada a las ${now.toLocaleTimeString()}`,
    category: category,
    type: NotificationType.INFO,
    showPush: true,
    data: { 
      test: true,
      timestamp: now.getTime()
    }
  });
};