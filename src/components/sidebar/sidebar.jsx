import "./sidebar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import {
  House,
  ShoppingCart,
  Users,
  ClipboardList,
  Package,
  ChartLine,
  Store,
  Bell,
  BellOff
} from "lucide-react";
import NotificationBell from "../icons/notificationBell/notificationBell";
import { useNotifications } from "../../context/NotificationContext";

function Sidebar() {
  const navigate = useNavigate();
  const { requestPermission, permissionStatus, sendTestNotification } = useNotifications();

  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setShowPermissionBanner(Notification.permission === 'default');
    }
  }, [permissionStatus]);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed);
  }, [isCollapsed]);

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        setShowPermissionBanner(false);
        setTimeout(async () => {
          await sendTestNotification();
        }, 1000);
      } else if (result === 'denied') {
        alert("Has denegado los permisos de notificación.");
      }
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
    }
  };

  const handleDismissBanner = () => {
    setShowPermissionBanner(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    navigate("/login"); // o tu ruta de logout
  };

  const handleConfig = () => {
    navigate("/configuracion");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="collapse-btn" onClick={toggleSidebar}>
        {isCollapsed ? "⮞" : "⮜"}
      </button>

      {showPermissionBanner && (
        <div className="notification-permission-banner">
          <div className="permission-banner-content">
            <Bell size={20} />
            <p>Activa las notificaciones para estar al día con pedidos y alertas</p>
          </div>
          <div className="permission-banner-actions">
            <button className="permission-accept-btn" onClick={handleRequestPermission}>Activar</button>
            <button className="permission-dismiss-btn" onClick={handleDismissBanner}>Ahora no</button>
          </div>
        </div>
      )}

      {/* Menú principal */}
      <button className="items" onClick={() => handleNavigation("/home")}>
        <span><House size={38} /> {!isCollapsed && "Inicio"}</span>
      </button>

      <button className="items" onClick={() => handleNavigation("/pedidos")}>
        <span><ShoppingCart size={38} /> {!isCollapsed && "Pedidos"}</span>
        {!isCollapsed && <NotificationBell category="pedidos" />}
      </button>

      <button className="items" onClick={() => handleNavigation("/inventario")}>
        <span><Package size={38} /> {!isCollapsed && "Inventario"}</span>
        {!isCollapsed && <NotificationBell category="inventario" />}
      </button>

      <button className="items" onClick={() => handleNavigation("/AgregarContenido")}>
        <span><ClipboardList size={38} /> {!isCollapsed && "Contenido"}</span>
      </button>

      <button className="items" onClick={() => handleNavigation("/graficas")}>
        <span><ChartLine size={38} /> {!isCollapsed && "Informes y Estadisticas"}</span>
      </button>

      <button className="items" onClick={() => handleNavigation("/clientes")}>
        <span><Users size={38} /> {!isCollapsed && "Clientes"}</span>
        {!isCollapsed && <NotificationBell category="clientes" />}
      </button>

      <button className="items" onClick={() => window.open("https://contmigo.tiznadodev.com/", "_blank")}>
        <span><Store size={38} /> {!isCollapsed && "Visualizar Tienda"}</span>
      </button>

      {permissionStatus !== 'granted' && !showPermissionBanner && (
        <button className="notification-toggle" onClick={handleRequestPermission} title="Activar notificaciones">
          <BellOff size={24} />
          {!isCollapsed && <span>Activar notificaciones</span>}
        </button>
      )}

      {/* Menú Admin abajo */}
      <div className="admin-section wide-admin">
        <div className="admin-header" onClick={toggleUserMenu}>
          <div className="admin-icon">
            <span className="icon-user">👤</span>
          </div>
          {!isCollapsed && (
            <>
              <span className="admin-name">
                <span className="gear-icon">⚙️</span> Admin
              </span>
              <span className="admin-dropdown-arrow">▾</span>
            </>
          )}
        </div>

        {!isCollapsed && userMenuOpen && (
          <div className="admin-menu wide-admin-menu">
            <button onClick={handleConfig}>
              <Settings size={16} style={{ marginRight: "8px" }} />
              Configuración
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} style={{ marginRight: "8px", color: "#f87171" }} />
              <span className="logout-text">Cerrar sesión</span>
            </button>
          </div>
        )}

        {!isCollapsed && <p className="dashboard-version">Dashboard v2.1.0</p>}
      </div>
    </div>
  );
}

export default Sidebar;
