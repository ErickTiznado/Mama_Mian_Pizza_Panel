import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';
import './MetodoEntregaChart.css';

// Colores corporativos para las gráficas
const BRAND_COLORS = [
  'rgba(254, 178, 72, 1)', // color-brand-yellow para delivery
  'rgba(153, 27, 27, 1)'   // color-brand-red para recogida
];

const MetodoEntregaChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL base para la API de pedidos
  const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

  // Obtener los últimos 30 días
  const obtenerUltimos30Dias = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hoy.getDate() - 30);
    hace30Dias.setHours(0, 0, 0, 0);
    
    return hace30Dias;
  };

  const fetchMetodosEntrega = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders`);
      const pedidos = response.data;
      
      // Filtrar pedidos de los últimos 30 días
      const hace30Dias = obtenerUltimos30Dias();
      const pedidosRecientes = pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido >= hace30Dias;
      });
      
      // Contar pedidos por método de entrega
      const countDelivery = pedidosRecientes.filter(p => p.metodo_entrega === 'delivery').length;
      const countRecogida = pedidosRecientes.filter(p => p.metodo_entrega === 'recogida').length;
      
      // Formatear datos para el gráfico
      const chartData = [
        { name: 'Delivery', value: countDelivery },
        { name: 'Recogida', value: countRecogida }
      ];
      
      setData(chartData);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los datos de métodos de entrega:", err);
      setError("No se pudieron cargar los datos");
      setLoading(false);
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    fetchMetodosEntrega();
  }, []);

  // Si no hay datos reales, usar datos de muestra
  const sampleData = [
    { name: 'Delivery', value: 68 },
    { name: 'Recogida', value: 32 }
  ];

  const dataToDisplay = data.length > 0 ? data : sampleData;
  
  // Calcular porcentajes
  const total = dataToDisplay.reduce((acc, item) => acc + item.value, 0);
  const porcentajes = dataToDisplay.map(item => ({
    ...item,
    porcentaje: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#242424', padding: '10px', border: '1px solid #374151', borderRadius: '5px' }}>
          <p style={{ color: '#FFFFFF', margin: '0 0 5px' }}>{`${payload[0].name}: ${payload[0].value}`}</p>
          <p style={{ color: '#FFFFFF', margin: '0' }}>{`${porcentajes.find(item => item.name === payload[0].name).porcentaje}% del total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="metodo-entrega-container">
      <h3>Distribución de Métodos de Entrega</h3>
      <p className="chart-subtitle">Últimos 30 días</p>
      
      {loading ? (
        <div className="loading-indicator">Cargando datos...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataToDisplay}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
              >
                {dataToDisplay.map((entry, index) => (
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
        </div>
      )}
    </div>
  );
};

export default MetodoEntregaChart;