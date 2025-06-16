import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  House,
  ShoppingCart,
  Users,
  ClipboardList,
  Package,
  ChartLine,
  Store,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Settings
} from 'lucide-react';
import Logo from '../../assets/Logo.png';
import NotificationBell from '../icons/notificationBell/notificationBell';
import { useNotifications } from '../../context/NotificationContext';
import './sidebar.css';

const Sidebar = ({ onToggle, collapsed: externalCollapsed }) => {
  const navigate = useNavigate();
  const { requestPermission, permissionStatus, sendTestNotification } = useNotifications();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [activeItem, setActiveItem] = useState('/home');

  // Configuración de elementos del menú
  const menuItems = [
    {
      id: 'home',
      path: '/home',
      label: 'Inicio',
      icon: House,
      hasNotification: false
    },
    {
      id: 'pedidos',
      path: '/pedidos',
      label: 'Pedidos',
      icon: ShoppingCart,
      hasNotification: true,
      notificationCategory: 'pedidos'
    },
    {
      id: 'contenido',
      path: '/AgregarContenido',
      label: 'Contenido',
      icon: ClipboardList,
      hasNotification: false
    },
    {
      id: 'inventario',
      path: '/inventario',
      label: 'Inventario',
      icon: Package,
      hasNotification: true,
      notificationCategory: 'inventario'
    },
    {
      id: 'graficas',
      path: '/graficas',
      label: 'Informes',
      icon: ChartLine,
      hasNotification: false
    },
    {
      id: 'clientes',
      path: '/clientes',
      label: 'Clientes',
      icon: Users,
      hasNotification: true,
      notificationCategory: 'clientes'
    },    {
      id: 'tienda',
      path: 'https://mamamianpizza.com/',
      label: 'Tienda',
      icon: Store,
      hasNotification: false,
      isExternal: true
    },
    {
      id: 'configuracion',
      path: '/configuracion',
      label: 'Configuración',
      icon: Settings,
      hasNotification: false
    }
  ];

  // Detectar el tamaño de pantalla
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

  // Verificar permisos de notificación
  useEffect(() => {
    if ('Notification' in window) {
      setShowPermissionBanner(Notification.permission === 'default');
    }
  }, [permissionStatus]);

  // Establecer el elemento activo basado en la ruta actual
  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveItem(currentPath);
  }, []);

  const handleNavigation = (path, isExternal = false) => {
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      navigate(path);
      setActiveItem(path);
    }
    
    // Cerrar sidebar en móvil después de navegar
    if (isMobile) {
      setIsCollapsed(true);
    }
  };
  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    // Comunicar el cambio al componente padre
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        setShowPermissionBanner(false);
        setTimeout(async () => {
          await sendTestNotification();
        }, 1000);
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  };

  const handleDismissBanner = () => {
    setShowPermissionBanner(false);
  };  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && !isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <nav className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded'} ${isMobile ? 'sidebar--mobile' : ''}`}>
        {/* Header */}
        <header className="sidebar__header">
          <div className="sidebar__brand">
            <img 
              src={Logo} 
              alt="Mama Mian Pizza" 
              className="sidebar__logo"
            />
            {!isCollapsed && (
              <div className="sidebar__brand-text">
                <h1 className="sidebar__title">Mama Mian</h1>
                <p className="sidebar__subtitle">Panel de Administración</p>
              </div>
            )}
          </div>
        </header>

        {/* Permission Banner */}
        {showPermissionBanner && !isCollapsed && (
          <div className="sidebar__notification-banner">
            <div className="notification-banner__content">
              <Bell size={20} className="notification-banner__icon" />
              <p className="notification-banner__text">
                Activa las notificaciones para mantenerte al día
              </p>
            </div>
            <div className="notification-banner__actions">
              <button 
                className="notification-banner__button notification-banner__button--accept"
                onClick={handleRequestPermission}
              >
                Activar
              </button>
              <button 
                className="notification-banner__button notification-banner__button--dismiss"
                onClick={handleDismissBanner}
              >
                Ahora no
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar__navigation">
          <ul className="sidebar__menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.path;
              
              return (
                <li key={item.id} className="sidebar__menu-item">
                  <button
                    className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                    onClick={() => handleNavigation(item.path, item.isExternal)}
                    title={isCollapsed ? item.label : ''}
                    aria-label={item.label}
                  >
                    <div className="sidebar__link-content">
                      <Icon size={24} className="sidebar__icon" />
                      {!isCollapsed && (
                        <span className="sidebar__label">{item.label}</span>
                      )}
                    </div>
                    
                    {item.hasNotification && (
                      <div className="sidebar__notification">
                        <NotificationBell 
                          category={item.notificationCategory} 
                          isCollapsed={isCollapsed} 
                        />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>        {/* Footer */}
        <div className="sidebar__footer">
          {/* Notification toggle */}
          {permissionStatus !== 'granted' && !showPermissionBanner && (
            <button 
              className="sidebar__notification-toggle"
              onClick={handleRequestPermission}
              title={isCollapsed ? 'Activar notificaciones' : ''}
            >
              <BellOff size={20} className="sidebar__notification-icon" />
              {!isCollapsed && (
                <span className="sidebar__notification-text">
                  Activar notificaciones
                </span>
              )}
            </button>          )}
            {/* Sidebar toggle button */}
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
            {/* User Info Section */}
          <div className="sidebar__user-info">
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
                    <ChevronRight size={16} className="user-details__chevron" />
                  </div>
                  <span className="user-details__version">Dashboard v2.1.0</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
