import React, { useState, useRef, useEffect } from 'react';
import './notificationBell.css';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';

function NotificationBell({ category, isCollapsed = false }) {
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

  // Contador de notificaciones no leídas para esta categoría
  const count = getUnreadCount(category);

  // Filtrar las notificaciones por categoría y ordenarlas por fecha
  const categoryNotifications = notifications
    .filter(notification => notification.category === category)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Debugging: Imprimimos información relevante para diagnóstico
  useEffect(() => {
    console.log(`NotificationBell (${category}): Contador actual: ${count}`);
    console.log(`NotificationBell: Total notificaciones: ${notifications.length}`);
    console.log(`NotificationBell: Notificaciones de categoría ${category}: ${categoryNotifications.length}`);
  }, [count, notifications, category, categoryNotifications.length]);

  // Para evitar perder notificaciones importantes, sincronizar cuando se abre el menú
  useEffect(() => {
    if (isOpen) {
      syncWithServer().then(() => {
        console.log('Sincronización forzada completada');
      });
    }
  }, [isOpen, syncWithServer]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar clic en la campana
  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  // Marcar una notificación como leída al hacer clic en ella
  const handleNotificationClick = (notification) => {
    // Solo marcar como leída si no lo está ya
    if (!notification.read) {
      console.log('Marcando notificación como leída:', notification.id);
      markAsRead(notification.id);
    }
    
    // Navegar a la URL si está definida
    if (notification.data?.url) {
      window.location.href = notification.data.url;
    }
  };

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    
    // Solo si hay notificaciones no leídas
    const unreadNotifications = categoryNotifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      markAllAsRead();
    }
  };

  // Eliminar una notificación
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

  // Obtener el título según la categoría
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
    <div className={`notification-bell ${isCollapsed ? 'collapsed' : ''}`} ref={dropdownRef}>
      <button 
        className="notification-button"
        onClick={handleBellClick}
        aria-label="Notificaciones"
      >
        <Bell size={isCollapsed ? 16 : 24} color={count > 0 ? "#ff6600" : "#333333"} />
        
        {count > 0 && (
          <span className="notification-badge">{count > 99 ? '99+' : count}</span>
        )}
      </button>      {isOpen && (
        <div className={`notification-dropdown ${isCollapsed ? 'collapsed-dropdown' : ''}`}>
          <div className="notification-header">
            <h3>{getCategoryTitle()}</h3>
            {categoryNotifications.length > 0 && (
              <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                Marcar todas como leídas
              </button>
            )}
          </div>

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