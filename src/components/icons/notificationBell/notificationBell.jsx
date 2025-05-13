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
    permissionStatus
  } = useNotifications();

  // Estado local para el conteo
  const [count, setCount] = useState(0);

  // Filtrar las notificaciones por categoría
  const categoryNotifications = notifications
    .filter(notification => notification.category === category)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Actualizar el conteo cuando cambien las notificaciones
  useEffect(() => {
    const unreadCount = getUnreadCount(category);
    setCount(unreadCount);
  }, [notifications, category, getUnreadCount]);

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

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    categoryNotifications.forEach(notification => {
      markAsRead(notification.id);
    });
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
      <button className="notification-button" onClick={handleBellClick}>
        <Bell size={24} />
        {count > 0 && <div className="notification-count">{count}</div>}
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