import React from "react";
import PedidosRecientes from "../pedidosRecientes/pedidosRecientes";
import PedidosKPI from "./components/PedidosKPI";
import PedidosSemanales from "./components/PedidosSemanales";
import MetodoEntregaChart from "./components/MetodoEntregaChart";
import EvolucionMensual from "./components/EvolucionMensual";
import MapaPedidos from "./components/MapaPedidos";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faMapMarkedAlt, faTruck, faUsers, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import "./pedidosGraficas.css";

function PedidosGraficas({ fechasFiltradas }) {
  // Formatea la fecha para mostrarla en la UI
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const f = new Date(fecha);
    return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
  };

  // Texto del período filtrado
  const textoPeriodo = fechasFiltradas ? 
    `${formatearFecha(fechasFiltradas.inicio)} - ${formatearFecha(fechasFiltradas.fin)}` : 
    "Último mes";

  return (
    <div className="pedidos-graficas-container">

      
      {/* Sección de KPIs */}
      <PedidosKPI fechasFiltradas={fechasFiltradas} />
      
      {/* Gráficas y tablas principales */}
      <div className="pedidos-main-content">
        <div className="pedidos-charts-column">
          {/* Gráfica de evolución mensual con altura fija */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px', color: '#FEB248' }} />
                Evolución Mensual
              </h3>
              <p className="chart-description">Tendencia de pedidos y ventas durante los últimos meses</p>
            </div>
            <EvolucionMensual colorPrimario="#FEB248" colorSecundario="#3D84B8" fechasFiltradas={fechasFiltradas} />
          </div>
          
          {/* Gráfica de pedidos semanales */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#FEB248' }} />
                Pedidos por Día de Semana
              </h3>
              <p className="chart-description">Distribución de pedidos por día de la semana</p>
            </div>
            <PedidosSemanales colorPrimario="#FEB248" fechasFiltradas={fechasFiltradas} />
          </div>
          
          {/* Nueva sección: Mapa de pedidos */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faMapMarkedAlt} style={{ marginRight: '10px', color: '#FEB248' }} />
                Mapa de Pedidos
              </h3>
              <p className="chart-description">Distribución geográfica de los pedidos recientes</p>
            </div>
            <MapaPedidos colorMarcador="#FEB248" fechasFiltradas={fechasFiltradas} />
          </div>
          
          {/* Gráfica de métodos de entrega */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faTruck} style={{ marginRight: '10px', color: '#FEB248' }} />
                Métodos de Entrega
              </h3>
              <p className="chart-description">Distribución de pedidos por método de entrega</p>
            </div>
            <MetodoEntregaChart 
              colores={['#FEB248', '#3D84B8', '#821717', '#1f2937']} 
              fechasFiltradas={fechasFiltradas} 
            />
          </div>
        </div>
        
        <div className="pedidos-side-column">
          {/* Pedidos recientes */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px', color: '#FEB248' }} />
                Pedidos Recientes
              </h3>
              <p className="chart-description">Últimos pedidos registrados en el sistema</p>
            </div>
            <div className="pedidos-recientes-box">
              <PedidosRecientes colorAccent="#FEB248" fechasFiltradas={fechasFiltradas} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosGraficas;