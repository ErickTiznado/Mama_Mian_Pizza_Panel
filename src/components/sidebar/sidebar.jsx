import "./sidebar.css";
import Logo from "../../assets/Logo.png";
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
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../icons/notificationBell/notificationBell";
import { useNotifications } from "../../context/NotificationContext";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const { requestPermission, permissionStatus, sendTestNotification } = useNotifications();
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Verificar el estado de los permisos al cargar
  useEffect(() => {
    if ('Notification' in window) {
      // Mostrar banner solo si el permiso no está concedido ni denegado
      setShowPermissionBanner(Notification.permission === 'default');
    }
  }, [permissionStatus]);

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        setShowPermissionBanner(false);
        
        // Enviar una notificación de prueba inmediatamente para confirmar que funciona
        setTimeout(async () => {
          await sendTestNotification();
        }, 1000);
      } else if (result === 'denied') {
        alert("Has denegado los permisos de notificación. Para recibir alertas importantes, debes activarlas en la configuración del navegador.");
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
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>      {/* Botón para colapsar/expandir */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={22}  color="white" strokeWidth={4} /> : <ChevronLeft size={22}  color="white" strokeWidth={4}/>}
      </button>

      <header className="sidebar-header">
        <img className="sidebar-brand" src={Logo} alt="" />
        {!isCollapsed && (
          <h1>
            Mama Mian Panel
          </h1>
        )}
      </header>      {/* Banner de solicitud de permisos */}
      {showPermissionBanner && !isCollapsed && (
        <div className="notification-permission-banner">
          <div className="permission-banner-content">
            <Bell size={20} />
            <p>Activa las notificaciones para estar al día con pedidos y alertas</p>
          </div>
          <div className="permission-banner-actions">
            <button 
              className="permission-accept-btn" 
              onClick={handleRequestPermission}
            >
              Activar
            </button>
            <button 
              className="permission-dismiss-btn" 
              onClick={handleDismissBanner}
            >
              Ahora no
            </button>
          </div>
        </div>
      )}      <div className="sidebar-body">
        <button className="items" onClick={() => handleNavigation("/home")} title="Inicio">
          <span>
            <House size={18} />
            {!isCollapsed && "Inicio"}
          </span>
        </button>        {/* Changed button to div to prevent nesting errors with NotificationBell */}
        <div className="items" onClick={() => handleNavigation("/pedidos")} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleNavigation("/pedidos")} title="Pedidos">
          <span>
            <ShoppingCart size={18} />
            {!isCollapsed && "Pedidos"}
          </span>
          <NotificationBell category="pedidos" isCollapsed={isCollapsed} />
        </div>
        
        <button
          className="items"
          onClick={() => handleNavigation("/AgregarContenido")}
          title="Contenido"
        >
          <span>
            <ClipboardList size={18} />
            {!isCollapsed && "Contenido"}
          </span>
        </button>        <button className="items" onClick={() => handleNavigation("/inventario")} title="Inventario">
          <span>
            <Package size={18} />
            {!isCollapsed && "Inventario"}
          </span>
          <NotificationBell category="inventario" isCollapsed={isCollapsed} />
        </button>
        
        <button className="items" onClick={() => handleNavigation("/graficas")} title="Informes">
          <span>
            <ChartLine size={18} />
            {!isCollapsed && "Informes"}
          </span>
        </button>
          <button className="items" onClick={() => handleNavigation("/clientes")} title="Clientes">
          <span>
            <Users size={18} />
            {!isCollapsed && "Clientes"}
          </span>
          <NotificationBell category="clientes" isCollapsed={isCollapsed} />
        </button>
        
        <button className="items" onClick={() => window.open("https://contmigo.tiznadodev.com/", "_blank")} title="Tienda">
          <span>
            <Store size={18} />
            {!isCollapsed && "Tienda"}
          </span>
        </button>
      </div>      {/* Botón para activar notificaciones (si están desactivadas) */}
      {permissionStatus !== 'granted' && !showPermissionBanner && !isCollapsed && (
        <button className="notification-toggle" onClick={handleRequestPermission} title="Activar notificaciones">
          <BellOff size={24} />
          <span>Activar notificaciones</span>
        </button>
      )}
    </div>
  );
}

export default Sidebar;
