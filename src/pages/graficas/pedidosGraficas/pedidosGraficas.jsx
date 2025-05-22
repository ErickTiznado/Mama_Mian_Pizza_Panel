import React, { useState, useEffect } from "react";
import PedidosRecientes from "../pedidosRecientes/pedidosRecientes";
import EvolucionMensual from "./components/EvolucionMensual";
import MetodoEntregaChart from "./components/MetodoEntregaChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faTruck, faUsers } from '@fortawesome/free-solid-svg-icons';
import "./pedidosGraficas.css";

function PedidosGraficas({ fechasFiltradas }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Efecto para indicar que los datos se han cargado
  useEffect(() => {
    // Simulamos un tiempo de carga para mejorar la experiencia visual
    const timer = setTimeout(() => {
      setIsDataLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

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
      <div className="periodo-filtrado">
        <span>Período: </span>
        <strong>{textoPeriodo}</strong>
      </div>
      
      {/* Gráficas y tablas principales */}
      <div className="pedidos-main-content">
        <div className="pedidos-charts-column">
          {/* Gráfica de evolución mensual */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px', color: '#FEB248' }} />
                Evolución Mensual
              </h3>
              <p className="chart-description">Tendencia de pedidos por tipo de entrega durante los últimos meses</p>
            </div>
            <EvolucionMensual 
              colorPrimario="#FEB248" 
              colorSecundario="#3D84B8" 
              fechasFiltradas={fechasFiltradas} 
            />
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