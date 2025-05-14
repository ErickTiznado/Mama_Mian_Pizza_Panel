import React from "react";
import LineGraf from "../graficodeLineas/lineGraf";
import "./clientesGraficas.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy, faArrowUp, faCalendarAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';

// Sample data for Clientes charts
const clientesChartData = [
  { month: "January", nuevos: 42, recurrentes: 138 },
  { month: "February", nuevos: 58, recurrentes: 147 },
  { month: "March", nuevos: 65, recurrentes: 172 },
  { month: "April", nuevos: 47, recurrentes: 143 },
  { month: "May", nuevos: 73, recurrentes: 157 },
  { month: "June", nuevos: 61, recurrentes: 165 },
];

// Top customers sample data
const topClientes = [
  { nombre: "Carlos Méndez", pedidos: 24, gasto: "$352.80" },
  { nombre: "María López", pedidos: 18, gasto: "$287.50" },
  { nombre: "Juan Rodríguez", pedidos: 15, gasto: "$231.40" },
  { nombre: "Ana García", pedidos: 12, gasto: "$198.75" },
  { nombre: "Pedro Sánchez", pedidos: 10, gasto: "$167.90" },
];

function ClientesGraficas({ fechasFiltradas }) {
  // Formatear la fecha para mostrarla en la UI
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
    <div className="clientes-graficas-container">
      <div className="periodo-indicador">
        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#FEB248', marginRight: '8px' }} />
        Periodo: <span className="periodo-texto">{textoPeriodo}</span>
      </div>
      
      {/* KPIs de clientes */}
      <div className="kpi-content">
        <div className="kpi-card">
          <h4 className="kpi-title">Total Clientes</h4>
          <p className="kpi-value">1,258</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> 12% respecto al mes anterior
          </span>
        </div>
        <div className="kpi-card">
          <h4 className="kpi-title">Clientes Nuevos</h4>
          <p className="kpi-value">186</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> 8% respecto al mes anterior
          </span>
        </div>
        <div className="kpi-card">
          <h4 className="kpi-title">Tasa de Retención</h4>
          <p className="kpi-value">78%</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> 5% respecto al mes anterior
          </span>
        </div>
        <div className="kpi-card">
          <h4 className="kpi-title">Ticket Promedio</h4>
          <p className="kpi-value">$24.50</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> 3% respecto al mes anterior
          </span>
        </div>
      </div>
      
      <div className="clientes-graficas-content">
        {/* Gráfica de clientes nuevos vs recurrentes */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px', color: '#FEB248' }} />
              Clientes Nuevos vs Recurrentes
            </h3>
            <p className="chart-description">Evolución de clientes nuevos y recurrentes a lo largo del tiempo</p>
          </div>
          <LineGraf 
            data={clientesChartData} 
            colors={['#FEB248', '#3D84B8']} 
            lineNames={['nuevos', 'recurrentes']} 
          />
        </div>
        
        {/* Lista de clientes frecuentes */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faTrophy} style={{ marginRight: '10px', color: '#FEB248' }} />
              Clientes Frecuentes
            </h3>
            <p className="chart-description">Los clientes más activos durante el periodo seleccionado</p>
          </div>
          <div className="top-clientes-list">
            {topClientes.map((cliente, index) => (
              <div key={index} className="top-cliente-item">
                <div className="cliente-rank">{index + 1}</div>
                <div className="cliente-info">
                  <span className="cliente-nombre">{cliente.nombre}</span>
                  <div className="cliente-stats">
                    <span className="cliente-pedidos">
                      <FontAwesomeIcon icon={faUsers} style={{ color: '#FEB248', marginRight: '5px' }} />
                      {cliente.pedidos} pedidos
                    </span>
                    <span className="cliente-gasto">{cliente.gasto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientesGraficas;