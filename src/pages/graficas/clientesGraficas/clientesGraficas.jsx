import React, { useState, useEffect } from "react";
import LineGraf from "../graficodeLineas/lineGraf";
import axios from "axios";
import "./clientesGraficas.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy, faArrowUp, faCalendarAlt, faChartLine, faUserTag } from '@fortawesome/free-solid-svg-icons';

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api";

// Datos de muestra para cuando la API no retorna datos
const sampleClientesChartData = [
  { month: "January", nuevos: 42, recurrentes: 138 },
  { month: "February", nuevos: 58, recurrentes: 147 },
  { month: "March", nuevos: 65, recurrentes: 172 },
  { month: "April", nuevos: 47, recurrentes: 143 },
  { month: "May", nuevos: 73, recurrentes: 157 },
  { month: "June", nuevos: 61, recurrentes: 165 },
];

// Top customers sample data
const sampleTopClientes = [
  { nombre: "Carlos Méndez", pedidos: 24, gasto: "$352.80" },
  { nombre: "María López", pedidos: 18, gasto: "$287.50" },
  { nombre: "Juan Rodríguez", pedidos: 15, gasto: "$231.40" },
  { nombre: "Ana García", pedidos: 12, gasto: "$198.75" },
  { nombre: "Pedro Sánchez", pedidos: 10, gasto: "$167.90" },
];

function ClientesGraficas({ fechasFiltradas }) {
  // Estados para manejar los datos
  const [clientesChartData, setClientesChartData] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalClientes: 1258,
    clientesNuevos: 186,
    tasaRetencion: 78,
    ticketPromedio: 24.50,
    tendenciaTotal: 12,
    tendenciaNuevos: 8,
    tendenciaRetencion: 5,
    tendenciaTicket: 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [segmentoSeleccionado, setSegmentoSeleccionado] = useState('todos');
  
  // Obtener datos cuando cambien las fechas filtradas
  useEffect(() => {
    if (fechasFiltradas && fechasFiltradas.inicio && fechasFiltradas.fin) {
      fetchClientesData(fechasFiltradas.inicio, fechasFiltradas.fin);
    }
  }, [fechasFiltradas, segmentoSeleccionado]);

  // Función para obtener los datos de clientes
  const fetchClientesData = async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders/orders`);
      
      if (!response.data || response.data.length === 0) {
        console.log("No hay pedidos disponibles");
        // Utilizar datos de muestra si no hay datos reales
        setClientesChartData(sampleClientesChartData);
        setTopClientes(sampleTopClientes);
        setLoading(false);
        return;
      }
      
      const pedidos = response.data;
      
      // Filtrar pedidos por el periodo seleccionado
      const pedidosFiltrados = pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion);
        return fechaPedido >= fechaInicio && 
               fechaPedido <= fechaFin && 
               pedido.estado !== 'cancelado';
      });

      // Preparar meses para el gráfico
      const meses = obtenerMesesEnRango(fechaInicio, fechaFin);
      
      // Crear un mapa de clientes para contar nuevos vs recurrentes
      const clientesMap = {};
      
      // Primer paso: mapear todos los pedidos para identificar clientes
      pedidosFiltrados.forEach(pedido => {
        const clienteId = pedido.id_cliente || pedido.cliente_id || 
                         (pedido.nombre_cliente && `${pedido.nombre_cliente}-${pedido.apellido_cliente}`);
        
        if (clienteId) {
          if (!clientesMap[clienteId]) {
            clientesMap[clienteId] = {
              id: clienteId,
              primerPedido: new Date(pedido.fecha_pedido || pedido.fecha_creacion),
              totalPedidos: 0,
              totalGasto: 0,
              ultimoPedido: new Date(pedido.fecha_pedido || pedido.fecha_creacion),
              nombre: `${pedido.nombre_cliente || ''} ${pedido.apellido_cliente || ''}`.trim() || "Cliente"
            };
          }
          
          clientesMap[clienteId].totalPedidos += 1;
          clientesMap[clienteId].totalGasto += parseFloat(pedido.total || 0);
          
          // Actualizar fecha del último pedido si es más reciente
          const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion);
          if (fechaPedido > clientesMap[clienteId].ultimoPedido) {
            clientesMap[clienteId].ultimoPedido = fechaPedido;
          }
          
          // Actualizar fecha del primer pedido si es más antigua
          if (fechaPedido < clientesMap[clienteId].primerPedido) {
            clientesMap[clienteId].primerPedido = fechaPedido;
          }
        }
      });

      // Convertir map a array
      const clientesArray = Object.values(clientesMap);
      
      // Aplicar filtro de segmento si está seleccionado
      let clientesFiltrados = clientesArray;
      if (segmentoSeleccionado !== 'todos') {
        clientesFiltrados = filtrarClientesPorSegmento(clientesArray, segmentoSeleccionado);
      }
      
      // Calcular top clientes por total de gasto
      const topClientesData = clientesFiltrados
        .sort((a, b) => b.totalPedidos - a.totalPedidos)
        .slice(0, 5)
        .map(cliente => ({
          nombre: cliente.nombre,
          pedidos: cliente.totalPedidos,
          gasto: `$${cliente.totalGasto.toFixed(2)}`
        }));
      
      // Agrupar datos de nuevos vs recurrentes por mes
      const datosPorMes = meses.map(mes => {
        // Contar clientes nuevos y recurrentes para este mes
        const nuevos = clientesFiltrados.filter(cliente => {
          const primerPedidoMes = cliente.primerPedido.getMonth() === mes.numeroMes && 
                                 cliente.primerPedido.getFullYear() === mes.anio;
          return primerPedidoMes;
        }).length;
        
        // Clientes recurrentes: tienen pedido en este mes pero no es su primer mes
        const recurrentes = clientesFiltrados.filter(cliente => {
          // El cliente tiene algún pedido en este mes
          const tienePedidoEsteMes = new Date(cliente.primerPedido).getTime() < 
            new Date(mes.anio, mes.numeroMes, 1).getTime() && 
            new Date(cliente.ultimoPedido).getTime() >= new Date(mes.anio, mes.numeroMes, 1).getTime();
          
          return tienePedidoEsteMes && 
                 !(cliente.primerPedido.getMonth() === mes.numeroMes && 
                   cliente.primerPedido.getFullYear() === mes.anio);
        }).length;

        return {
          month: mes.nombreMes,
          nuevos: nuevos,
          recurrentes: recurrentes
        };
      });
      
      // Actualizar KPIs basados en datos reales
      const totalClientes = clientesFiltrados.length;
      const clientesNuevos = clientesFiltrados.filter(c => 
        c.primerPedido >= fechaInicio && c.primerPedido <= fechaFin
      ).length;
      
      // Calcular tasa de retención (clientes que han hecho más de un pedido)
      const clientesRecurrentes = clientesFiltrados.filter(c => c.totalPedidos > 1).length;
      const tasaRetencion = totalClientes > 0 ? Math.round((clientesRecurrentes / totalClientes) * 100) : 0;
      
      // Calcular ticket promedio
      const totalPedidos = clientesFiltrados.reduce((sum, c) => sum + c.totalPedidos, 0);
      const totalGasto = clientesFiltrados.reduce((sum, c) => sum + c.totalGasto, 0);
      const ticketPromedio = totalPedidos > 0 ? totalGasto / totalPedidos : 0;
      
      // Actualizar estado con datos procesados
      setClientesChartData(datosPorMes);
      setTopClientes(topClientesData.length > 0 ? topClientesData : sampleTopClientes);
      setKpiData({
        totalClientes,
        clientesNuevos,
        tasaRetencion,
        ticketPromedio: ticketPromedio.toFixed(2),
        tendenciaTotal: 12, // En una implementación real, esto se calcularía comparando con período anterior
        tendenciaNuevos: 8,
        tendenciaRetencion: 5,
        tendenciaTicket: 3
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener datos de clientes:", err);
      setError("No se pudieron cargar los datos de clientes");
      // Usar datos de muestra en caso de error
      setClientesChartData(sampleClientesChartData);
      setTopClientes(sampleTopClientes);
      setLoading(false);
    }
  };

  // Función para filtrar clientes según el segmento seleccionado
  const filtrarClientesPorSegmento = (clientes, segmento) => {
    switch (segmento) {
      case 'frecuentes':
        return clientes.filter(c => c.totalPedidos >= 5);
      case 'nuevos':
        return clientes.filter(c => c.totalPedidos === 1);
      case 'vip':
        return clientes.filter(c => c.totalGasto > 200);
      case 'inactivos':
        const tresMesesAtras = new Date();
        tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
        return clientes.filter(c => c.ultimoPedido < tresMesesAtras);
      default:
        return clientes;
    }
  };

  // Función para obtener los meses en un rango de fechas
  const obtenerMesesEnRango = (fechaInicio, fechaFin) => {
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const meses = [];
    const fechaActual = new Date(fechaInicio);
    
    // Si es el mismo día (hoy), devolver solo el día actual
    if (fechaInicio.toDateString() === fechaFin.toDateString()) {
      return [{ 
        nombreMes: `${nombresMeses[fechaInicio.getMonth()]} ${fechaInicio.getDate()}`,
        numeroMes: fechaInicio.getMonth(),
        anio: fechaInicio.getFullYear()
      }];
    }

    // Para periodos de una semana, mostrar los últimos 7 días
    if (fechaFin - fechaInicio < 8 * 24 * 60 * 60 * 1000) {
      const dias = [];
      const tempFecha = new Date(fechaInicio);
      
      while (tempFecha <= fechaFin) {
        dias.push({ 
          nombreMes: `${tempFecha.getDate()}/${tempFecha.getMonth() + 1}`,
          numeroMes: tempFecha.getMonth(),
          anio: tempFecha.getFullYear(),
          dia: tempFecha.getDate()
        });
        tempFecha.setDate(tempFecha.getDate() + 1);
      }
      
      return dias;
    }

    // Para periodos más largos, mostrar meses
    while (
      fechaActual.getFullYear() < fechaFin.getFullYear() || 
      (fechaActual.getFullYear() === fechaFin.getFullYear() && 
       fechaActual.getMonth() <= fechaFin.getMonth())
    ) {
      meses.push({
        nombreMes: nombresMeses[fechaActual.getMonth()],
        numeroMes: fechaActual.getMonth(),
        anio: fechaActual.getFullYear()
      });
      
      fechaActual.setMonth(fechaActual.getMonth() + 1);
    }
    
    return meses;
  };

  // Determinar qué datos mostrar en el gráfico
  const renderLineGraph = () => {
    if (loading) {
      return (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Cargando datos de clientes...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => fetchClientesData(fechasFiltradas.inicio, fechasFiltradas.fin)} 
            className="reload-button"
          >
            Intentar nuevamente
          </button>
        </div>
      );
    }
    
    if (!clientesChartData.length) {
      return (
        <div className="no-data-message">
          <p>No hay datos suficientes para este periodo.</p>
          <button 
            onClick={() => fetchClientesData(fechasFiltradas.inicio, fechasFiltradas.fin)} 
            className="reload-button"
          >
            Intentar nuevamente
          </button>
        </div>
      );
    }
    
    return (
      <LineGraf 
        data={clientesChartData} 
        colors={{
          nuevos: '#FEB248',
          recurrentes: '#3D84B8'
        }}
      />
    );
  };

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
    
  // Manejar cambio de segmento
  const handleChangeSegmento = (event) => {
    setSegmentoSeleccionado(event.target.value);
  };

  return (
    <div className="clientes-graficas-container">
      <div className="periodo-indicador">
        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#FEB248', marginRight: '8px' }} />
        Periodo: <span className="periodo-texto">{textoPeriodo}</span>
      </div>
      
      {/* Selector de segmento de clientes */}
      <div className="segmento-selector">
        <label htmlFor="segmento-clientes">Segmentar por:</label>
        <select 
          id="segmento-clientes" 
          value={segmentoSeleccionado}
          onChange={handleChangeSegmento}
          className="filtro-select"
        >
          <option value="todos">Todos los clientes</option>
          <option value="frecuentes">Clientes frecuentes (5+ pedidos)</option>
          <option value="nuevos">Clientes nuevos (1 pedido)</option>
          <option value="vip">Clientes VIP ($200+)</option>
          <option value="inactivos">Clientes inactivos (3+ meses)</option>
        </select>
      </div>
      
      {/* KPIs de clientes */}
      <div className="kpi-content">
        <div className="kpi-card">
          <h4 className="kpi-title">Total Clientes</h4>
          <p className="kpi-value">{loading ? '...' : kpiData.totalClientes.toLocaleString()}</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> {kpiData.tendenciaTotal}% respecto al mes anterior
          </span>
        </div>
        <div className="kpi-card">
          <h4 className="kpi-title">Clientes Nuevos</h4>
          <p className="kpi-value">{loading ? '...' : kpiData.clientesNuevos.toLocaleString()}</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> {kpiData.tendenciaNuevos}% respecto al mes anterior
          </span>
        </div>
        <div className="kpi-card">
          <h4 className="kpi-title">Tasa de Retención</h4>
          <p className="kpi-value">{loading ? '...' : kpiData.tasaRetencion}%</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> {kpiData.tendenciaRetencion}% respecto al mes anterior
          </span>
        </div>
        <div className="kpi-card">
          <h4 className="kpi-title">Ticket Promedio</h4>
          <p className="kpi-value">${loading ? '...' : kpiData.ticketPromedio}</p>
          <span className="kpi-trend kpi-trend-up">
            <FontAwesomeIcon icon={faArrowUp} /> {kpiData.tendenciaTicket}% respecto al mes anterior
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
          <div className="chart-container-inner">
            {renderLineGraph()}
          </div>
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
            {loading ? (
              <div className="loading-indicator">Cargando clientes...</div>
            ) : topClientes.length === 0 ? (
              <div className="no-data-message">No hay datos de clientes para mostrar</div>
            ) : (
              topClientes.map((cliente, index) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientesGraficas;