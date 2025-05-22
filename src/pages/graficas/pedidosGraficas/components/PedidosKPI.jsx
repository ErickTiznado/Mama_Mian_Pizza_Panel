import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PedidosKPI.css';

// Iconos para las tarjetas
const TrendIcon = ({ value }) => {
  if (value > 0) {
    return <span className="trend-icon up">↑ {value}%</span>;
  } else if (value < 0) {
    return <span className="trend-icon down">↓ {Math.abs(value)}%</span>;
  }
  return <span className="trend-icon neutral">0%</span>;
};

const PedidosKPI = () => {
  const [kpiData, setKpiData] = useState({
    totalHoy: 0,
    totalSemana: 0,
    ticketMedio: 0,
    pedidosPorHora: 0,
    tendenciaHoy: 5, // % de cambio respecto a ayer
    tendenciaSemana: 8, // % de cambio respecto a la semana anterior
    tendenciaTicket: -2, // % de cambio en ticket medio
    tendenciaHora: 10 // % de cambio en pedidos por hora
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL base para la API de pedidos
  const API_BASE_URL = "https://server.tiznadodev.com/api";

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders/orders`);
      const pedidos = response.data;
      
      // Fecha actual
      const hoy = new Date();
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
      
      // Fecha de ayer
      const ayer = new Date(hoy);
      ayer.setDate(ayer.getDate() - 1);
      const inicioAyer = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());
      const finAyer = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate(), 23, 59, 59);
      
      // Inicio de la semana actual (lunes)
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1));
      inicioSemana.setHours(0, 0, 0, 0);
      
      // Fin de la semana actual (domingo)
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);
      
      // Inicio de la semana pasada
      const inicioSemanaPasada = new Date(inicioSemana);
      inicioSemanaPasada.setDate(inicioSemanaPasada.getDate() - 7);
      
      // Fin de la semana pasada
      const finSemanaPasada = new Date(finSemana);
      finSemanaPasada.setDate(finSemanaPasada.getDate() - 7);
      
      // Filtrar pedidos
      const pedidosHoy = pedidos.filter(p => {
        const fechaPedido = new Date(p.fecha_pedido);
        return fechaPedido >= inicioHoy && fechaPedido <= finHoy;
      });
      
      const pedidosAyer = pedidos.filter(p => {
        const fechaPedido = new Date(p.fecha_pedido);
        return fechaPedido >= inicioAyer && fechaPedido <= finAyer;
      });
      
      const pedidosSemana = pedidos.filter(p => {
        const fechaPedido = new Date(p.fecha_pedido);
        return fechaPedido >= inicioSemana && fechaPedido <= finSemana;
      });
      
      const pedidosSemanaPasada = pedidos.filter(p => {
        const fechaPedido = new Date(p.fecha_pedido);
        return fechaPedido >= inicioSemanaPasada && fechaPedido <= finSemanaPasada;
      });
      
      // Calcular KPIs
      const totalHoy = pedidosHoy.length;
      const totalAyer = pedidosAyer.length;
      const totalSemana = pedidosSemana.length;
      const totalSemanaPasada = pedidosSemanaPasada.length;
      
      const importeTotalHoy = pedidosHoy.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      const ticketMedio = totalHoy > 0 ? importeTotalHoy / totalHoy : 0;
      
      const importeTotalAyer = pedidosAyer.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      const ticketMedioAyer = totalAyer > 0 ? importeTotalAyer / totalAyer : 0;
      
      const pedidosActivos = 12; // Horas activas de la pizzería
      const pedidosPorHora = totalHoy > 0 ? totalHoy / pedidosActivos : 0;
      const pedidosPorHoraAyer = totalAyer > 0 ? totalAyer / pedidosActivos : 0;
      
      // Calcular tendencias (% de cambio)
      const tendenciaHoy = totalAyer > 0 ? Math.round(((totalHoy - totalAyer) / totalAyer) * 100) : 0;
      const tendenciaSemana = totalSemanaPasada > 0 ? Math.round(((totalSemana - totalSemanaPasada) / totalSemanaPasada) * 100) : 0;
      const tendenciaTicket = ticketMedioAyer > 0 ? Math.round(((ticketMedio - ticketMedioAyer) / ticketMedioAyer) * 100) : 0;
      const tendenciaHora = pedidosPorHoraAyer > 0 ? Math.round(((pedidosPorHora - pedidosPorHoraAyer) / pedidosPorHoraAyer) * 100) : 0;
      
      setKpiData({
        totalHoy,
        totalSemana,
        ticketMedio: ticketMedio.toFixed(2),
        pedidosPorHora: pedidosPorHora.toFixed(1),
        tendenciaHoy,
        tendenciaSemana,
        tendenciaTicket,
        tendenciaHora
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los datos KPI:", err);
      setError("No se pudieron cargar los indicadores");
      setLoading(false);
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    fetchKPIData();
  }, []);

  return (
    <div className="pedidos-kpi-container">
      {loading ? (
        <div className="kpi-loading">Cargando indicadores...</div>
      ) : error ? (
        <div className="kpi-error">{error}</div>
      ) : (
        <div className="kpi-cards">
          <div className="kpi-card">
            <div className="kpi-title">Pedidos Hoy</div>
            <div className="kpi-value">{kpiData.totalHoy}</div>
            <div className="kpi-trend">
              <TrendIcon value={kpiData.tendenciaHoy} />
              <span>vs ayer</span>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-title">Pedidos Semana</div>
            <div className="kpi-value">{kpiData.totalSemana}</div>
            <div className="kpi-trend">
              <TrendIcon value={kpiData.tendenciaSemana} />
              <span>vs semana anterior</span>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-title">Ticket Medio</div>
            <div className="kpi-value">${kpiData.ticketMedio}</div>
            <div className="kpi-trend">
              <TrendIcon value={kpiData.tendenciaTicket} />
              <span>vs ayer</span>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-title">Pedidos/Hora</div>
            <div className="kpi-value">{kpiData.pedidosPorHora}</div>
            <div className="kpi-trend">
              <TrendIcon value={kpiData.tendenciaHora} />
              <span>vs ayer</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosKPI;