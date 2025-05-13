import "./sidebar.css";
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
import { useNavigate } from "react-router-dom";
import NotificationBell from "../icons/notificationBell/notificationBell";
import { useNotifications } from "../../context/NotificationContext";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const { requestPermission, permissionStatus, sendTestNotification } = useNotifications();
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

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

  return (
    <div className="sidebar">
      {/* Banner de solicitud de permisos */}
      {showPermissionBanner && (
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
      )}
      
      <button className="items" onClick={() => handleNavigation("/home")}>
        <span>
        <House size={38} />
        Inicio 
        </span>
      </button>
      <button className="items" onClick={() => handleNavigation("/pedidos")}>
        <span>
        <ShoppingCart size={38} />
        Pedidos
        </span>
        <NotificationBell category="pedidos" />
      </button>
      <button
        className="items"
        onClick={() => handleNavigation("/AgregarContenido")}
      >
        <span>
        <ClipboardList size={38} />
        Contenido 
        </span>
      </button>
      <button className="items" onClick={() => handleNavigation("/inventario")}>
        <span>
        <Package size={38} />
        Inventario 
        </span>
        <NotificationBell category="inventario" />
      </button>
      <button className="items" onClick={() => handleNavigation("/graficas")}>
        <span>
        <ChartLine size={38} />
        Informes y Estadisticas 
        </span>
      </button>
      <button className="items" onClick={() => handleNavigation("/clientes")}>
        <span>
        <Users size={38} />
        Clientes 
        </span>
        <NotificationBell category="clientes" />
      </button>
      <button className="items" onClick={() => window.open("/", "_blank")}>
        <span>
        <Store size={38} />
        Visualizar Tienda 
        </span>
      </button>
      
      {/* Botón para activar notificaciones (si están desactivadas) */}
      {permissionStatus !== 'granted' && !showPermissionBanner && (
        <button className="notification-toggle" onClick={handleRequestPermission} title="Activar notificaciones">
          <BellOff size={24} />
          <span>Activar notificaciones</span>
        </button>
      )}
    </div>
  );
}

export default Sidebar;
