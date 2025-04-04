import './sidebar.css';
import { House, ShoppingCart, Users, ClipboardList, Package, ChartLine, Store  } from 'lucide-react';

function Sidebar() {
    return(
        <div className='sidebar'>
            <button className="items">
                <House size={38} />
                Inicio
            </button>
            <button className="items">
            <ShoppingCart  size={38} />
            Pedidos
            </button>
            <button className="items">
                <ClipboardList size={38}  />
                    Contenido
            </button>
            <button className="items">
                <Package size={38}  />
                    Inventario
            </button>
            <button className="items">
                <ChartLine size={38}  />
                    Informes y Estadisticas
            </button>
            <button className="items">
                <Users  size={38} />
                    Clientes
            </button>
            <button className="items">
                <Store size={38}  />
                    Visualizar Tienda
            </button>
        </div>
    );
}

export default Sidebar;