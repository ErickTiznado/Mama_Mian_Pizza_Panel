import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './PedidosSemanales.css';

const PedidosSemanales = ({ API_BASE_URL }) => {
  const [dataSemanal, setDataSemanal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el API_BASE_URL proporcionado como prop o el valor por defecto si no está definido
  const apiUrl = API_BASE_URL || "https://server.tiznadodev.com/api";

  // Colores corporativos para las gráficas
  const BRAND_COLORS = {
    delivery: 'rgba(254, 178, 72, 1)', // color-brand-yellow
    recogida: 'rgba(153, 27, 27, 1)',  // color-brand-red
    cartesianGrid: '#374151',
    tooltip: '#242424',
    text: '#FFFFFF'
  };

  // Obtener las semanas recientes (últimas 6 semanas)
  const obtenerSemanasRecientes = () => {
    const semanas = [];
    const hoy = new Date();
    
    for (let i = 5; i >= 0; i--) {
      // Calcular fecha de inicio de la semana (i semanas atrás)
      const fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - (i * 7 + hoy.getDay()));
      fechaInicio.setHours(0, 0, 0, 0);
      
      // Calcular fecha fin de la semana
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 6);
      fechaFin.setHours(23, 59, 59, 999);
      
      semanas.push({
        inicio: fechaInicio,
        fin: fechaFin,
        nombre: `Semana ${6-i}`
      });
    }
    
    return semanas;
  };

  const fetchPedidosPorSemana = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${apiUrl}/orders/orders`);
      const pedidos = response.data;
      
      // Preparar datos por semana
      const semanas = obtenerSemanasRecientes();
      const dataPorSemana = semanas.map(semana => {
        // Filtrar pedidos de esta semana
        const pedidosSemana = pedidos.filter(pedido => {
          const fechaPedido = new Date(pedido.fecha_pedido);
          return fechaPedido >= semana.inicio && fechaPedido <= semana.fin;
        });
        
        // Contar pedidos por método de entrega
        const delivery = pedidosSemana.filter(p => p.metodo_entrega === 'delivery').length;
        const recogida = pedidosSemana.filter(p => p.metodo_entrega === 'recogida').length;
        const totalPedidos = pedidosSemana.length;
        
        return {
          name: semana.nombre,
          delivery: delivery,
          recogida: recogida,
          total: totalPedidos
        };
      });
      
      setDataSemanal(dataPorSemana);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los pedidos por semana:", err);
      setError("No se pudieron cargar los datos semanales");
      setLoading(false);
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    fetchPedidosPorSemana();
  }, []);

  // Si no hay datos reales, usar datos de muestra
  const sampleData = [
    { name: 'Semana 1', delivery: 65, recogida: 28, total: 93 },
    { name: 'Semana 2', delivery: 75, recogida: 32, total: 107 },
    { name: 'Semana 3', delivery: 62, recogida: 30, total: 92 },
    { name: 'Semana 4', delivery: 80, recogida: 40, total: 120 },
    { name: 'Semana 5', delivery: 90, recogida: 38, total: 128 },
    { name: 'Semana 6', delivery: 85, recogida: 42, total: 127 },
  ];

  const dataToDisplay = dataSemanal.length > 0 ? dataSemanal : sampleData;

  return (
    <div className="pedidos-semanales-container">
      <h3>Pedidos por Semana</h3>
      {loading ? (
        <div className="loading-indicator">Cargando datos...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataToDisplay}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.cartesianGrid} />
            <XAxis dataKey="name" stroke={BRAND_COLORS.text} />
            <YAxis stroke={BRAND_COLORS.text} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: BRAND_COLORS.tooltip, 
                borderColor: '#374151',
                color: BRAND_COLORS.text 
              }}
              labelStyle={{ color: BRAND_COLORS.text }}
            />
            <Legend wrapperStyle={{ color: BRAND_COLORS.text }} />
            <Bar dataKey="delivery" name="Delivery" fill={BRAND_COLORS.delivery} />
            <Bar dataKey="recogida" name="Recogida" fill={BRAND_COLORS.recogida} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PedidosSemanales;