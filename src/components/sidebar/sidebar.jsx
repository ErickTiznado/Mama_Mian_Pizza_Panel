import "./sidebar.css";
import {
  House,
  ShoppingCart,
  Users,
  ClipboardList,
  Package,
  ChartLine,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../icons/notificationBell/notificationBell";

function Sidebar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
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
         <NotificationBell count={5} />
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
  <NotificationBell count={5} />
      </button>
      <button className="items">
        <span>
        <ChartLine size={38} />
        Informes y Estadisticas 
        </span>

      </button>
      <button className="items">
        <span>
        <Users size={38} />
        Clientes 
        </span>
        <NotificationBell count={5} />
      </button>
      <button className="items">
        <span>
        <Store size={38} />
        Visualizar Tienda 
        </span>
      </button>
    </div>
  );
}

export default Sidebar;
