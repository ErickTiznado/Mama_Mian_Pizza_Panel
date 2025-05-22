import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';
import './MetodoEntregaChart.css';

const MetodoEntregaChart = ({ colores, fechasFiltradas }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  // URL base para la API de pedidos
  const API_BASE_URL = "https://server.tiznadodev.com/api";

  // Colores corporativos para las gráficas
  const BRAND_COLORS = colores || [
    'rgba(254, 178, 72, 1)', // color-brand-yellow para delivery
    'rgba(153, 27, 27, 1)'   // color-brand-red para recogida
  ];

  // Obtener los últimos 30 días si no hay filtros
  const obtenerUltimos30Dias = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hoy.getDate() - 30);
    hace30Dias.setHours(0, 0, 0, 0);
    
    return {
      inicio: hace30Dias,
      fin: new Date(hoy.setHours(23, 59, 59, 999))
    };
  };

  const fetchMetodosEntrega = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoData(false);
      
      // Determinar el rango de fechas a utilizar
      const rangoFechas = fechasFiltradas || obtenerUltimos30Dias();
      const fechaInicio = new Date(rangoFechas.inicio);
      const fechaFin = new Date(rangoFechas.fin);
      
      console.log(`Obteniendo datos de métodos de entrega desde ${fechaInicio.toLocaleDateString()} hasta ${fechaFin.toLocaleDateString()}`);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders/orders`);
      
      if (!response.data || response.data.length === 0) {
        console.log("No se encontraron pedidos en la respuesta");
        setNoData(true);
        setLoading(false);
        return;
      }
      
      const pedidos = response.data;
      console.log("Total de pedidos obtenidos:", pedidos.length);
      
      // Filtrar pedidos por rango de fechas
      const pedidosFiltrados = pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion);
        return fechaPedido >= fechaInicio && 
               fechaPedido <= fechaFin && 
               pedido.estado !== 'cancelado';
      });
      
      console.log("Pedidos filtrados por fecha:", pedidosFiltrados.length);
      
      // Contar pedidos por método de entrega (considerando posibles variaciones en los nombres)
      const countDelivery = pedidosFiltrados.filter(p => 
        p.metodo_entrega === 'delivery' || 
        p.metodo_entrega === 'domicilio' || 
        p.tipo_entrega === 'delivery' || 
        p.tipo_entrega === 'domicilio'
      ).length;
      
      const countRecogida = pedidosFiltrados.filter(p => 
        p.metodo_entrega === 'recogida' || 
        p.metodo_entrega === 'local' || 
        p.tipo_entrega === 'recogida' || 
        p.tipo_entrega === 'local'
      ).length;
      
      // Formatear datos para el gráfico
      const chartData = [
        { name: 'Delivery', value: countDelivery },
        { name: 'Recogida', value: countRecogida }
      ];
      
      console.log("Datos procesados para el gráfico:", chartData);
      
      // Verificar si hay datos reales para mostrar
      const hayDatosReales = chartData.some(item => item.value > 0);
      if (!hayDatosReales) {
        console.log("No hay datos de métodos de entrega para mostrar");
        setNoData(true);
        setLoading(false);
        return;
      }
      
      setData(chartData);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los datos de métodos de entrega:", err);
      setError("No se pudieron cargar los datos: " + err.message);
      setLoading(false);
    }
  };

  // Cargar datos cuando el componente se monte o cuando cambien los filtros
  useEffect(() => {
    console.log("Cargando datos de métodos de entrega con filtros:", fechasFiltradas);
    fetchMetodosEntrega();
    
    // Configurar un intervalo para actualizar los datos cada 5 minutos
    const interval = setInterval(() => {
      console.log("Actualizando datos de métodos de entrega...");
      fetchMetodosEntrega();
    }, 300000); // 5 minutos
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [fechasFiltradas]);

  // Calcular porcentajes
  const calcularPorcentajes = (dataArr) => {
    const total = dataArr.reduce((acc, item) => acc + item.value, 0);
    return dataArr.map(item => ({
      ...item,
      porcentaje: total > 0 ? Math.round((item.value / total) * 100) : 0
    }));
  };

  // Data a mostrar
  const dataToDisplay = data.length > 0 ? data : [];
  const porcentajes = calcularPorcentajes(dataToDisplay);

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#242424', padding: '10px', border: '1px solid #374151', borderRadius: '5px' }}>
          <p style={{ color: '#FFFFFF', margin: '0 0 5px' }}>{`${payload[0].name}: ${payload[0].value} pedidos`}</p>
          <p style={{ color: '#FFFFFF', margin: '0' }}>{`${payload[0].payload.porcentaje}% del total`}</p>
        </div>
      );
    }
    return null;
  };

  const renderNoDataMessage = () => (
    <div className="no-data-message">
      <p>No hay datos de pedidos suficientes para mostrar los métodos de entrega.</p>
      <button 
        onClick={fetchMetodosEntrega}
        className="reload-button"
      >
        Actualizar datos
      </button>
    </div>
  );

  return (
    <div className="metodo-entrega-container">
      {loading ? (
        <div className="loading-indicator">Cargando datos...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : noData ? (
        renderNoDataMessage()
      ) : (
        <div className="chart-content">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={porcentajes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
              >
                {porcentajes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend 
                formatter={(value) => <span style={{ color: '#FFFFFF' }}>{value}</span>}
                iconType="circle" 
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="metodo-entrega-stats">
            {porcentajes.map((item, index) => (
              <div key={index} className="stat-item">
                <div className="stat-color" style={{ backgroundColor: BRAND_COLORS[index % BRAND_COLORS.length] }}></div>
                <div className="stat-info">
                  <div className="stat-name">{item.name}</div>
                  <div className="stat-value">{item.value} pedidos</div>
                  <div className="stat-percentage">{item.porcentaje}%</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón para actualizar datos manualmente */}
          <button 
            className="update-data-button"
            onClick={fetchMetodosEntrega}
          >
            Actualizar datos
          </button>
        </div>
      )}
    </div>
  );
};

export default MetodoEntregaChart;