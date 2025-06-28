import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotification.jsx';
import {
  House,
  ShoppingCart,
  Users,
  ClipboardList,
  Package,
  ChartLine,
  Store,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import Logo from '../../assets/Logo.png';
import './sidebar.css';

const Sidebar = ({ onToggle, collapsed: externalCollapsed }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { notifications, noleidas, markAllRead, formatNotificationMessage, formatNotificationTitle } = useNotifications();
  
  // Función para contar notificaciones de pedidos
  const getPedidosNotificationCount = () => {
    return notifications.filter(notif => 
      notif.tipo === 'pedido' && !notif.read
    ).length;
  };
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('/home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const adminRef = useRef();
  const notificationRef = useRef();

  const menuItems = [
    {
      id: 'home',
      path: '/home',
      label: 'Inicio',
      icon: House
    },
    {
      id: 'pedidos',
      path: '/pedidos',
      label: 'Pedidos',
      icon: ShoppingCart
    },    {
      id: 'contenido',
      path: '/AgregarContenido',
      label: 'Contenido',
      icon: ClipboardList
    },
    // {
    //   id: 'inventario',
    //   path: '/inventario',
    //   label: 'Inventario',
    //   icon: Package,
    //   hasNotification: true,
    //   notificationCategory: 'inventario'
    // },
    // {
    //   id: 'generadordeinformes',
    //   path: '/generadordeinformes',
    //   label: 'Informes',
    //   icon: ChartLine,
    //   hasNotification: false
    // },
    {
      id: 'clientes',
      path: '/clientes',
      label: 'Clientes',
      icon: Users
    },
    {
      id: 'administradores',
      path: '/administradores',
      label: 'Administradores',
      icon: Settings
    },
    {
      id: 'tienda',
      path: 'https://mamamianpizza.com/',
      label: 'Tienda',
      icon: Store,
      isExternal: true
    }
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveItem(currentPath);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setIsAdminOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path, isExternal = false) => {
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      navigate(path);
      setActiveItem(path);
    }

    if (isMobile) {
      setIsCollapsed(true);
    }

    setIsAdminOpen(false);
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleAdminClick = () => {
    setIsAdminOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications && noleidas > 0) {
      markAllRead();
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <nav className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded'} ${isMobile ? 'sidebar--mobile' : ''}`}>
        <header className="sidebar__header">
          <div className="sidebar__brand">
            <img src={Logo} alt="Mama Mian Pizza" className="sidebar__logo" />
            {!isCollapsed && (
              <div className="sidebar__brand-text">
                <h1 className="sidebar__title">Mama Mian</h1>
                <p className="sidebar__subtitle">Panel de Administración</p>
              </div>
            )}
          </div>
        </header>

        <nav className="sidebar__navigation">
          <ul className="sidebar__menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.path;
              const isPedidos = item.id === 'pedidos';
              const pedidosCount = isPedidos ? getPedidosNotificationCount() : 0;
              
              return (
                <li key={item.id} className="sidebar__menu-item">
                  <div className="sidebar__menu-item-container">
                    <button
                      className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                      onClick={() => handleNavigation(item.path, item.isExternal)}
                      title={isCollapsed ? item.label : ''}
                      aria-label={item.label}
                    >
                      <div className="sidebar__link-content">
                        <div className="sidebar__icon-container">
                          <Icon size={24} className="sidebar__icon" />
                          {/* Contador sobre el ícono de pedidos cuando está colapsado */}
                          {isPedidos && isCollapsed && pedidosCount > 0 && (
                            <span className="sidebar__collapsed-notification-badge">
                              {pedidosCount > 99 ? '99+' : pedidosCount}
                            </span>
                          )}
                        </div>
                        {!isCollapsed && <span className="sidebar__label">{item.label}</span>}
                      </div>
                    </button>
                    
                    {/* Campanita fuera del link cuando no está colapsado */}
                    {isPedidos && !isCollapsed && (
                      <div className="sidebar__notification-icon-wrapper" ref={notificationRef}>
                        <button
                          className="sidebar__notification-bell-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNotifications();
                          }}
                          title="Ver notificaciones"
                        >
                          <Bell size={22} className="sidebar__notification-icon" />
                          {pedidosCount > 0 && (
                            <span className="sidebar__notification-badge">
                              {pedidosCount > 99 ? '99+' : pedidosCount}
                            </span>
                          )}
                        </button>
                        
                        {/* Dropdown de notificaciones */}
                        {showNotifications && (
                          <div className="sidebar__notification-dropdown">
                            <div className="sidebar__notification-header">
                              <h3>Notificaciones</h3>
                              {notifications.length > 0 && (
                                <button 
                                  className="sidebar__notification-clear"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAllRead();
                                  }}
                                >
                                  Marcar todas como leídas
                                </button>
                              )}
                            </div>
                            <div className="sidebar__notification-list">
                              {notifications.length === 0 ? (
                                <div className="sidebar__notification-empty">
                                  <Bell size={24} />
                                  <p>No hay notificaciones</p>
                                </div>
                              ) : (
                                notifications.slice(0, 10).map((notification, index) => (
                                  <div 
                                    key={`${notification.id_notificacion}-${index}`} 
                                    className={`sidebar__notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (notification.tipo === 'pedido') {
                                        handleNavigation('/pedidos');
                                        setShowNotifications(false);
                                      }
                                    }}
                                  >
                                    <div className="sidebar__notification-content">
                                      <div className="sidebar__notification-title">
                                        {formatNotificationTitle(notification) || notification.titulo || 'Nueva notificación'}
                                      </div>
                                      <div className="sidebar__notification-message">
                                        {formatNotificationMessage(notification) || notification.mensaje || 'Nueva notificación disponible'}
                                      </div>
                                      <div className="sidebar__notification-time">
                                        {formatNotificationTime(notification.timestamp || notification.fecha_emision)}
                                      </div>
                                    </div>
                                    {notification.icon && (
                                      React.createElement(notification.icon, { 
                                        size: 16, 
                                        className: "sidebar__notification-type-icon" 
                                      })
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <button 
            className="sidebar__toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {isCollapsed ? (
              <>
                <ChevronRight size={20} />
                <span style={{ display: 'none' }}>Expandir</span>
              </>
            ) : (
              <>
                <ChevronLeft size={20} />
                <span>Colapsar</span>
              </>
            )}
          </button>

          <div 
            className="sidebar__user-info"
            ref={adminRef}
            onClick={handleAdminClick}
          >
            <div className="sidebar__user-avatar">
              <div className="user-avatar__circle">
                <User size={20} className="user-avatar__icon" />
              </div>
              {!isCollapsed && (
                <div className="sidebar__user-details">
                  <div className="user-details__header">
                    <span className="user-details__label">
                      <User size={14} className="user-details__icon" />
                      Admin
                    </span>
                    <ChevronRight size={16} className={`user-details__chevron ${isAdminOpen ? 'open' : ''}`} />
                  </div>
                  <span className="user-details__version">Dashboard v2.1.0</span>
                </div>
              )}
            </div>

            {!isCollapsed && (
             <div className={`sidebar__admin-dropdown ${isAdminOpen ? 'open' : ''}`}>
  <button
    className="sidebar__dropdown-item"
    onClick={(e) => {
      e.stopPropagation();
      handleNavigation('/configuracion');
    }}
  >
    <Settings size={16} />
    <span>Configuración</span>
  </button>  <button
    className="sidebar__dropdown-item logout"
    onClick={(e) => {
      e.stopPropagation();
      logout();
      navigate('/login');
    }}
    
  >
    <LogOut size={16} />
    <span>Cerrar sesión</span>
  </button>
</div>

            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

