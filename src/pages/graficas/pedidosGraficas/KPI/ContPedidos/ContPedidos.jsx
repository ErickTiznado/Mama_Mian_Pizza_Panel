import { ShoppingBag } from "lucide-react";
import './ContPedidos.css';


const ContPedidos = () => {
    return (
        <div className=" count__kpi__container">
            <div className="count__kpi__header">
                <h5>
                   Pedidos Totales 
                </h5>
                <span>
                    <ShoppingBag />
                </span>
            </div>
            <div className="count__kpi__body">
                
            </div>
        </div>
    )
}

export default ContPedidos;