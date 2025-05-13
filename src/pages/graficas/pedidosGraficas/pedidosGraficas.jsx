import React from "react";
import PedidosRecientes from "../pedidosRecientes/pedidosRecientes";
import PedidosKPI from "./components/PedidosKPI";
import PedidosSemanales from "./components/PedidosSemanales";
import MetodoEntregaChart from "./components/MetodoEntregaChart";
import EvolucionMensual from "./components/EvolucionMensual";
import MapaPedidos from "./components/MapaPedidos";
import "./pedidosGraficas.css";

function PedidosGraficas() {
  return (
    <div className="pedidos-graficas-container">
      <h2>Análisis de Pedidos</h2>
      
      {/* Sección de KPIs */}
      <PedidosKPI />
      
      {/* Gráficas y tablas principales */}
      <div className="pedidos-main-content">
        <div className="pedidos-charts-column">
          {/* Gráfica de evolución mensual con altura fija */}
          <EvolucionMensual />
          
          {/* Gráfica de pedidos semanales */}
          <PedidosSemanales />
          
          {/* Nueva sección: Mapa de pedidos */}
          <MapaPedidos />
          
          {/* Gráfica de métodos de entrega */}
          <MetodoEntregaChart />
        </div>
        
        <div className="pedidos-side-column">
          {/* Pedidos recientes */}
          <div className="pedidos-recientes-box">
            <PedidosRecientes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosGraficas;