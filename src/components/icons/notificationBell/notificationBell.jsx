import React, { useState, useRef, useEffect } from 'react';
import './notificationBell.css';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';

function NotificationBell({ category }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    notifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    permissionStatus,
    syncWithServer
  } = useNotifications();

  // Estado local para el conteo
  const [count, setCount] = useState(0);

  // Filtrar las notificaciones por categoría y ordenarlas por fecha
  const categoryNotifications = notifications
    .filter(notification => notification.category === category)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Actualizar el conteo cuando cambien las notificaciones
  useEffect(() => {
    const unreadCount = getUnreadCount(category);
    setCount(unreadCount);
    
    // Actualizar el favicon con un indicador visual si hay notificaciones no leídas
    updateFaviconBadge(unreadCount > 0);
    
    console.log(`NotificationBell: Categoría ${category}, notificaciones no leídas: ${unreadCount}`);
  }, [notifications, category, getUnreadCount]);

  // Función para actualizar el favicon con un indicador visual
  const updateFaviconBadge = (hasUnread) => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) return;
    
    if (hasUnread) {
      if (!favicon.href.includes('notification')) {
        // Aquí podrías cambiar a un favicon con un indicador de notificación
        // Por ahora solo cambiamos la clase del favicon
        favicon.dataset.hasNotification = 'true';
      }
    } else {
      favicon.dataset.hasNotification = 'false';
    }
  };

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Forzar sincronización al abrir el dropdown
  useEffect(() => {
    if (isOpen) {
      // Sincronizar con el servidor cuando se abre el dropdown
      syncWithServer().then(() => {
        console.log('NotificationBell: Sincronización forzada completada');
      });
    }
  }, [isOpen, syncWithServer]);

  // Manejar clic en la campana
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    
    // Si se está abriendo, marcar todas como leídas con un pequeño retraso
    if (!isOpen && categoryNotifications.length > 0) {
      setTimeout(() => {
        categoryNotifications.forEach(notification => {
          if (!notification.read) {
            markAsRead(notification.id);
          }
        });
      }, 2000); // Esperar 2 segundos antes de marcar como leídas
    }
  };

  // Manejar clic en notificación individual
  const handleNotificationClick = (notification) => {
    console.log('Clic en notificación:', notification);
    
    // Solo marcar como leída si no lo está ya
    if (!notification.read) {
      console.log('Marcando notificación como leída:', notification.id);
      markAsRead(notification.id);
    }
    
    // Si hay URL en los datos de la notificación, navegar a ella
    if (notification.data?.url) {
      window.location.href = notification.data.url;
    }
  };

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    console.log('Marcando todas las notificaciones como leídas para la categoría:', category);
    
    // Solo si hay notificaciones no leídas
    const unreadNotifications = categoryNotifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      markAllAsRead();
    }
  };

  // Eliminar una notificación específica
  const handleRemoveNotification = (e, id) => {
    e.stopPropagation();
    removeNotification(id);
  };

  // Formatear la fecha relativa
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'ahora';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;

    // Para fechas más antiguas, mostrar la fecha completa
    return date.toLocaleDateString();
  };

  // Formatear el título de categoría
  const getCategoryTitle = () => {
    switch (category) {
      case 'pedidos':
        return 'Notificaciones de Pedidos';
      case 'inventario':
        return 'Alertas de Inventario';
      case 'clientes':
        return 'Notificaciones de Clientes';
      default:
        return 'Notificaciones';
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className={`notification-button ${count > 0 ? 'has-notifications' : ''}`}
        onClick={handleBellClick} 
        aria-label={`${getCategoryTitle()} (${count} no leídas)`}
        data-count={count}
      >
        <Bell size={24} />
        {count > 0 && (
          <div className="notification-count" aria-label={`${count} notificaciones no leídas`}>
            {count > 99 ? '99+' : count}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>{getCategoryTitle()}</h3>
            {categoryNotifications.length > 0 && (
              <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Sección de permisos si no están concedidos */}
          {permissionStatus !== 'granted' && (
            <div className="notification-permission">
              <p>Activa las notificaciones para recibir alertas importantes</p>
            </div>
          )}

          <div className="notification-list">
            {categoryNotifications.length === 0 ? (
              <div className="no-notifications">
                No hay notificaciones nuevas
              </div>
            ) : (
              categoryNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatRelativeTime(notification.timestamp)}
                    </span>
                  </div>
                  <button 
                    className="delete-notification"
                    onClick={(e) => handleRemoveNotification(e, notification.id)}
                    aria-label="Eliminar notificación"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;