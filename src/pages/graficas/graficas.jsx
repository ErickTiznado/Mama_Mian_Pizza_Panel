import { useState, useEffect } from "react";
import "./graficas.css";
import PedidosGraficas from "./pedidosGraficas/pedidosGraficas";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Graficas() {

  return (
    <div className="dashboard__container">
      <div className="dash__action-bar__container">
        <div>
          <button>
            Pedidos
          </button>
          <button>
            Productos
          </button>
          <button>
            Clientes
          </button>
        </div>
        <div>

        </div>
        <div>
          <select name="" id="">
            <option value="">Hoy</option>
            <option value="">Semanal</option>
            <option value="">Mes</option>
          </select>
        </div>
      </div>
    </div>

//    <PedidosGraficas />

  );
}

export default Graficas;
