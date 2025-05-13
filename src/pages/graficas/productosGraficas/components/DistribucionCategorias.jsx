import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './DistribucionCategorias.css';
import axios from 'axios';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api";

const DistribucionCategorias = () => {
  // Colores de la marca MamaMianPizza
  const brandColors = {
    pizzas: '#991B1B',       // Rojo de marca
    bebidas: '#3D84B8',      // Azul corporativo
    complementos: '#FEB248'  // Amarillo de marca
  };

  const [chartData, setChartData] = useState({
    labels: ['Pizzas', 'Bebidas', 'Complementos'],
    datasets: [
      {
        label: 'Ventas por Categoría',
        data: [0, 0, 0],
        backgroundColor: [
          brandColors.pizzas,
          brandColors.bebidas,
          brandColors.complementos,
        ],
        borderColor: [
          '#1E1E1E',
          '#1E1E1E',
          '#1E1E1E',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('ultimo-mes');

  useEffect(() => {
    fetchDistribucionData();
  }, [periodoSeleccionado]);

  const fetchDistribucionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener los pedidos según el periodo seleccionado
      const fechaInicio = getFechaInicioPeriodo(periodoSeleccionado);
      const fechaFin = new Date(); // Fecha actual como fin
      
      // Llamada a la API para obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders/orders`);
      
      if (!response.data || response.data.length === 0) {
        setError("No se encontraron datos de pedidos");
        setLoading(false);
        return;
      }
      
      // Filtrar pedidos por periodo
      const pedidosFiltrados = response.data.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido >= fechaInicio && fechaPedido <= fechaFin && pedido.estado !== 'cancelado';
      });
      
      // Consultar los productos para obtener sus categorías
      const responseProductos = await axios.get(`${API_BASE_URL}/content/getMenu`);
      const productos = responseProductos.data.productos || [];
      
      // Mapear productos por ID para consulta rápida
      const productosMap = {};
      productos.forEach(producto => {
        productosMap[producto.id_producto] = {
          categoria: producto.categoria || 'sin-categoria',
          titulo: producto.titulo || ''
        };
      });
      
      // Contar ventas por categoría
      const categorias = {
        'Pizzas': 0,
        'Bebidas': 0,
        'Complementos': 0
      };
      
      // Procesar cada pedido y sus detalles
      let totalProductosContados = 0;
      
      pedidosFiltrados.forEach(pedido => {
        if (pedido.detalles && Array.isArray(pedido.detalles)) {
          pedido.detalles.forEach(detalle => {
            const productoId = detalle.id_producto;
            const cantidad = parseInt(detalle.cantidad) || 1;
            const productoInfo = productosMap[productoId];
            
            if (productoInfo) {
              totalProductosContados += cantidad;
              
              // Intentar categorizar por el nombre de categoría
              let categoriaAsignada = null;
              const categoriaBaja = productoInfo.categoria ? productoInfo.categoria.toLowerCase() : '';
              const tituloBajo = productoInfo.titulo ? productoInfo.titulo.toLowerCase() : '';
              
              // Verificar categoría primero
              if (categoriaBaja.includes('pizza') || tituloBajo.includes('pizza')) {
                categoriaAsignada = 'Pizzas';
              } else if (categoriaBaja.includes('bebida') || 
                        categoriaBaja.includes('refresco') || 
                        tituloBajo.includes('bebida') ||
                        tituloBajo.includes('coca') ||
                        tituloBajo.includes('pepsi') ||
                        tituloBajo.includes('agua') ||
                        tituloBajo.includes('jugo') ||
                        tituloBajo.includes('cerveza')) {
                categoriaAsignada = 'Bebidas';
              } else {
                categoriaAsignada = 'Complementos';
              }
              
              categorias[categoriaAsignada] += cantidad;
            }
          });
        }
      });
      
      console.log("Distribución de categorías calculada:", categorias);
      console.log("Total productos contados:", totalProductosContados);
      
      // Preparar datos para el gráfico
      const data = [
        categorias['Pizzas'],
        categorias['Bebidas'],
        categorias['Complementos']
      ];
      
      const total = data.reduce((sum, value) => sum + value, 0);
      
      if (total === 0) {
        setError(`No hay ventas registradas en el periodo seleccionado`);
        // Mantener el gráfico vacío pero visible
        setChartData({
          labels: ['Pizzas', 'Bebidas', 'Complementos'],
          datasets: [
            {
              label: 'Porcentaje de ventas',
              data: [1, 1, 1], // Datos mínimos para mostrar el gráfico
              backgroundColor: [
                brandColors.pizzas,
                brandColors.bebidas,
                brandColors.complementos,
              ],
              borderColor: ['#1E1E1E', '#1E1E1E', '#1E1E1E'],
              borderWidth: 1,
            },
          ],
        });
        setTotalVentas(0);
      } else {
        setChartData({
          labels: ['Pizzas', 'Bebidas', 'Complementos'],
          datasets: [
            {
              label: 'Porcentaje de ventas',
              data: data,
              backgroundColor: [
                brandColors.pizzas,
                brandColors.bebidas,
                brandColors.complementos,
              ],
              borderColor: ['#1E1E1E', '#1E1E1E', '#1E1E1E'],
              borderWidth: 1,
            },
          ],
        });
        setTotalVentas(total);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar datos de distribución:", err);
      setError("Error al cargar datos de distribución: " + err.message);
      setLoading(false);
    }
  };

  // Función para obtener la fecha de inicio según el periodo seleccionado
  const getFechaInicioPeriodo = (periodo) => {
    const hoy = new Date();
    let fechaInicio = new Date(hoy);
    
    switch (periodo) {
      case 'hoy':
        fechaInicio.setHours(0, 0, 0, 0); // Inicio del día actual
        break;
      case 'ultima-semana':
        fechaInicio.setDate(hoy.getDate() - 7);
        break;
      case 'ultimo-mes':
        fechaInicio.setMonth(hoy.getMonth() - 1);
        break;
      case 'ultimo-anio':
        fechaInicio.setFullYear(hoy.getFullYear() - 1);
        break;
      default:
        fechaInicio.setMonth(hoy.getMonth() - 1); // Por defecto último mes
    }
    
    return fechaInicio;
  };

  // Opciones para el gráfico de dona
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ocultamos la leyenda por defecto de Chart.js
        position: 'bottom',
        labels: {
          font: {
            size: 11, // Reducido de 12
            family: "'Poppins', sans-serif"
          },
          color: '#E5E7EB',
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#111828',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        bodyFont: {
          size: 12 // Reducido de 13
        },
        titleFont: {
          size: 13, // Reducido de 14
          weight: 'bold'
        },
        padding: 10, // Reducido de 12
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalVentas) * 100);
            return `${label}: ${percentage}% (${value} unidades)`;
          }
        }
      }
    },
    cutout: '65%', // Reducido de 70%
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Manejar cambio de periodo
  const handleChangePeriodo = (event) => {
    setPeriodoSeleccionado(event.target.value);
  };
  
  // Obtener el nombre del periodo para mostrar
  const getNombrePeriodo = () => {
    switch (periodoSeleccionado) {
      case 'hoy': return 'Hoy';
      case 'ultima-semana': return 'Última Semana';
      case 'ultimo-mes': return 'Último Mes';
      case 'ultimo-anio': return 'Último Año';
      default: return 'Último Periodo';
    }
  };

  // Calcular porcentajes para mostrar
  const calcularPorcentajes = () => {
    if (totalVentas === 0) return [0, 0, 0];
    
    return chartData.datasets[0].data.map(value => 
      Math.round((value / totalVentas) * 100)
    );
  };
  
  const porcentajes = calcularPorcentajes();

  // Mapear nombres de periodos para el selector
  const mapPeriodoName = (periodoValue) => {
    const periodoMap = {
      'hoy': 'Hoy',
      'ultima-semana': 'Última Semana',
      'ultimo-mes': 'Último Mes',
      'ultimo-anio': 'Último Año'
    };
    return periodoMap[periodoValue] || periodoValue;
  };

  return (
    <div className="distribucion-categorias-container">
      <div className="distribucion-categorias-header">
        <h3>Distribución de Ventas por Categoría</h3>
        <p>Porcentaje de ventas para {getNombrePeriodo().toLowerCase()}</p>
        
        <div className="distribucion-filtros">
          <select 
            value={periodoSeleccionado} 
            onChange={handleChangePeriodo}
            className="periodo-select"
            aria-label="Seleccionar período"
          >
            <option value="hoy">Hoy</option>
            <option value="ultima-semana">Última Semana</option>
            <option value="ultimo-mes">Último Mes</option>
            <option value="ultimo-anio">Último Año</option>
          </select>
        </div>
      </div>
      
      <div className="distribucion-chart-container">
        {loading ? (
          <div className="loading-indicator">Cargando...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="chart-wrapper">
              <Doughnut data={chartData} options={options} />
              
              <div className="total-ventas">
                <span className="total-number">{totalVentas}</span>
                <span className="total-label">ventas</span>
              </div>
            </div>
            
            {/* Eliminamos la leyenda redundante y dejamos solo las estadísticas */}
            <div className="categoria-stats">
              <div className="stat-item pizzas">
                <div className="stat-color"></div>
                <div className="stat-info">
                  <span className="stat-label">Pizzas</span>
                  <span className="stat-value">{porcentajes[0]}%</span>
                </div>
              </div>
              
              <div className="stat-item bebidas">
                <div className="stat-color"></div>
                <div className="stat-info">
                  <span className="stat-label">Bebidas</span>
                  <span className="stat-value">{porcentajes[1]}%</span>
                </div>
              </div>
              
              <div className="stat-item complementos">
                <div className="stat-color"></div>
                <div className="stat-info">
                  <span className="stat-label">Complementos</span>
                  <span className="stat-value">{porcentajes[2]}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DistribucionCategorias;