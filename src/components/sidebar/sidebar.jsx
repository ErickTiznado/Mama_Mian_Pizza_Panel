import './sidebar.css';
import { House, ShoppingCart, Users, ClipboardList, Package, ChartLine, Store  } from 'lucide-react';

function Sidebar() {
    return(
        <div className='sidebar'>
            <div className="items">
                <House size={38} />
                <span>
                    Inicio
                </span>
            </div>
            <div className="items">
            <ShoppingCart  size={38} />
            <span>Pedidos</span>
            </div>
            <div className="items">
                <ClipboardList size={38}  />
                <span>
                    Contenido
                </span>
            </div>
            <div className="items">
                <Package size={38}  />
                <span>
                    Inventario
                </span>
            </div>
            <div className="items">
                <ChartLine size={38}  />
                <span>
                    Informes y Estadisticas
                </span>
            </div>
            <div className="items">
                <Users  size={38} />
                <span>
                    Clientes
                </span>
            </div>
            <div className="items">
                <Store size={38}  />
                <span>
                    Visualizar Tienda
                </span>
            </div>
        </div>
    );
}

export default Sidebar;