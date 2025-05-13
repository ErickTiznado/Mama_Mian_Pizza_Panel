import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './EvolucionMensual.css';

const EvolucionMensual = () => {
  const [dataMensual, setDataMensual] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  // URL base para la API de pedidos
  const API_BASE_URL = "https://server.tiznadodev.com/api";

  // Colores corporativos para las gráficas
  const BRAND_COLORS = {
    delivery: 'rgba(254, 178, 72, 1)', // color-brand-yellow
    recogida: 'rgba(153, 27, 27, 1)',  // color-brand-red
    cartesianGrid: '#374151',
    tooltip: '#242424',
    text: '#FFFFFF'
  };

  // Obtener los últimos 6 meses
  const obtenerUltimos6Meses = () => {
    const meses = [];
    const nombresMeses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    const fechaActual = new Date();
    
    for (let i = 5; i >= 0; i--) {
      // Calcular mes
      const fecha = new Date(fechaActual);
      fecha.setMonth(fechaActual.getMonth() - i);
      
      const mes = fecha.getMonth();
      const anio = fecha.getFullYear();
      
      const nombreMes = nombresMeses[mes];
      const inicioMes = new Date(anio, mes, 1);
      const finMes = new Date(anio, mes + 1, 0, 23, 59, 59, 999);
      
      meses.push({
        nombre: nombreMes,
        inicio: inicioMes,
        fin: finMes
      });
    }
    
    return meses;
  };

  const fetchPedidosPorMes = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoData(false);
      setDataMensual([]); // Resetear datos para evitar visualización de datos anteriores
      
      // Obtener todos los pedidos utilizando la API real
      const response = await axios.get(`${API_BASE_URL}/orders/orders`);
      
      if (!response.data || response.data.length === 0) {
        console.log("No se encontraron pedidos en la respuesta");
        setNoData(true);
        setLoading(false);
        return;
      }
      
      const pedidos = response.data;
      console.log("Total de pedidos obtenidos:", pedidos.length);
      
      // Preparar datos por mes
      const meses = obtenerUltimos6Meses();
      const dataPorMes = meses.map(mes => {
        // Filtrar pedidos de este mes
        const pedidosMes = pedidos.filter(pedido => {
          const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion);
          return fechaPedido >= mes.inicio && 
                 fechaPedido <= mes.fin && 
                 pedido.estado !== 'cancelado';
        });
        
        console.log(`Pedidos para ${mes.nombre}:`, pedidosMes.length);
        
        // Contar pedidos por método de entrega (considerando posibles variaciones en los nombres)
        const delivery = pedidosMes.filter(p => 
          p.metodo_entrega === 'delivery' || 
          p.metodo_entrega === 'domicilio' || 
          p.tipo_entrega === 'delivery' || 
          p.tipo_entrega === 'domicilio'
        ).length;
        
        const recogida = pedidosMes.filter(p => 
          p.metodo_entrega === 'recogida' || 
          p.metodo_entrega === 'local' || 
          p.tipo_entrega === 'recogida' || 
          p.tipo_entrega === 'local'
        ).length;
        
        return {
          month: mes.nombre,
          delivery: delivery,
          recogida: recogida
        };
      });
      
      console.log("Datos procesados por mes:", dataPorMes);
      
      // Verificar si hay datos reales para mostrar
      const hayDatosReales = dataPorMes.some(mes => mes.delivery > 0 || mes.recogida > 0);
      if (!hayDatosReales) {
        console.log("No hay datos reales para mostrar");
        setNoData(true);
        setLoading(false);
        return;
      }
      
      // Si hay datos, establecerlos
      setDataMensual(dataPorMes);
      setLoading(false);
      
    } catch (err) {
      console.error("Error al cargar los pedidos por mes:", err);
      setError("No se pudieron cargar los datos mensuales: " + err.message);
      setLoading(false);
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    fetchPedidosPorMes();
    
    // Configurar un intervalo para actualizar los datos cada 5 minutos
    const interval = setInterval(() => {
      console.log("Actualizando datos de evolución mensual...");
      fetchPedidosPorMes();
    }, 300000); // 5 minutos
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  const renderNoDataMessage = () => (
    <div className="no-data-message">
      <p>No hay datos de pedidos suficientes para mostrar la evolución.</p>
      <p>A medida que se registren pedidos, podrás ver aquí la evolución mensual.</p>
      <button 
        onClick={fetchPedidosPorMes}
        className="reload-button"
      >
        Actualizar datos
      </button>
    </div>
  );

  // IMPORTANTE: Verificar que dataMensual tenga datos válidos
  const hasValidData = dataMensual && dataMensual.length > 0 && !noData;

  return (
    <div className="evolucion-mensual-container">
      <h3>Evolución Mensual de Pedidos</h3>
      
      {loading ? (
        <div className="loading-indicator">Cargando datos...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : !hasValidData ? (
        renderNoDataMessage()
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={dataMensual}
              margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.cartesianGrid} />
              <XAxis dataKey="month" stroke={BRAND_COLORS.text} />
              <YAxis 
                stroke={BRAND_COLORS.text} 
                width={30} 
                tickFormatter={(value) => value > 999 ? `${(value/1000).toFixed(1)}k` : value} 
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: BRAND_COLORS.tooltip, 
                  borderColor: '#374151',
                  color: BRAND_COLORS.text,
                  padding: '8px' 
                }}
                labelStyle={{ color: BRAND_COLORS.text }}
                formatter={(value) => [`${value} pedidos`, null]}
              />
              <Legend 
                wrapperStyle={{ 
                  color: BRAND_COLORS.text,
                  fontSize: '12px',
                  paddingTop: '5px'
                }}
                iconSize={8}
                align="center"
              />
              <Line 
                type="monotone" 
                dataKey="delivery" 
                name="Delivery" 
                stroke={BRAND_COLORS.delivery} 
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="recogida" 
                name="Recogida" 
                stroke={BRAND_COLORS.recogida} 
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {/* Botón para actualizar datos manualmente */}
          <button 
            className="update-data-button"
            onClick={fetchPedidosPorMes}
          >
            Actualizar datos
          </button>
        </div>
      )}
    </div>
  );
};

export default EvolucionMensual;