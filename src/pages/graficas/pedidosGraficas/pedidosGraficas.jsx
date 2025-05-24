import React, { useState, useEffect } from "react";
import PedidosRecientes from "../pedidosRecientes/pedidosRecientes";
import EvolucionMensual from "./components/EvolucionMensual";
import MetodoEntregaChart from "./components/MetodoEntregaChart";
import PedidosKPI from "./components/PedidosKPI";
import PedidosSemanales from "./components/PedidosSemanales";
import MapaPedidos from "./components/MapaPedidos";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faTruck, faUsers, faChartBar, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./pedidosGraficas.css";

// URL base para la API de pedidos
const API_BASE_URL = "https://server.tiznadodev.com/api";

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
      
      {/* KPIs principales */}
      <PedidosKPI API_BASE_URL={API_BASE_URL} />
      
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
              API_BASE_URL={API_BASE_URL}
            />
          </div>
          
          {/* Gráfica de pedidos semanales */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '10px', color: '#FEB248' }} />
                Pedidos Semanales
              </h3>
              <p className="chart-description">Distribución de pedidos por semana</p>
            </div>
            <PedidosSemanales API_BASE_URL={API_BASE_URL} />
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
              API_BASE_URL={API_BASE_URL}
            />
          </div>
          
          {/* Mapa de pedidos */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                <FontAwesomeIcon icon={faMapMarkedAlt} style={{ marginRight: '10px', color: '#FEB248' }} />
                Mapa de Pedidos
              </h3>
              <p className="chart-description">Visualización geográfica de los pedidos</p>
            </div>
            <MapaPedidos API_BASE_URL={API_BASE_URL} />
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
              <PedidosRecientes 
                colorAccent="#FEB248" 
                fechasFiltradas={fechasFiltradas} 
                API_BASE_URL={API_BASE_URL}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosGraficas;