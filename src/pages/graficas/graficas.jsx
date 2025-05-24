import { useState, useEffect } from "react";
import "./graficas.css";
import PedidosGraficas from "./pedidosGraficas/pedidosGraficas";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Graficas() {

  return (
    <div className="dashboard__container">
      <div className="dash__action-bar__container">
       <div className="dash__action-bar">
       <div  className="dash__act__col-4">
        <div className="dash__act__flex-container">
          <div className="dash__act__btn-container">
                    <button className="dash__act__btn">	
            Pedidos
          </button>
          <button className="dash__act__btn">
            Productos
          </button>
          <button className="dash__act__btn">
            Clientes
          </button>
          
          </div>
        </div>
        </div>
        <div>
        <div className="dash__act__col-4">
          <select name="" id="">
            <option value="">Hoy</option>
            <option value="">Semanal</option>
            <option value="">Mes</option>
          </select>
          </div>
        </div>
        <div className="dash__act__col-4">
          <div >
            <span>Exportar</span>
          </div>
</div>
       </div>
      </div>
    </div>

//    <PedidosGraficas />

  );
}

export default Graficas;
