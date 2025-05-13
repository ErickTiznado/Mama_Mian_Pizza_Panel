import React, { useState, useEffect } from "react";
import LineGraf from "../graficodeLineas/lineGraf";
import "./productosGraficas.css";
import axios from "axios";

// Importar componentes
import TopProductosVendidos from "./components/TopProductosVendidos";
import ProductosKPI from "./components/ProductosKPI";
import DistribucionCategorias from "./components/DistribucionCategorias";
import TendenciasProductos from "./components/TendenciasProductos";

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api";

function ProductosGraficas() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('ultimo-mes');
  const [evolutionData, setEvolutionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cambiar el periodo seleccionado
  const handlePeriodoChange = (event) => {
    setPeriodoSeleccionado(event.target.value);
  };

  // Obtener datos de evolución por categoría
  useEffect(() => {
    fetchEvolutionData(periodoSeleccionado);
  }, [periodoSeleccionado]);

  // Función para obtener los datos de evolución de ventas por categoría
  const fetchEvolutionData = async (periodo) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener fechas para el periodo seleccionado
      const { fechaInicio, fechaFin } = getFechasParaPeriodo(periodo);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders/orders`);
      
      if (!response.data || response.data.length === 0) {
        console.log("No hay pedidos disponibles");
        setEvolutionData([]);
        setLoading(false);
        return;
      }
      
      const pedidos = response.data;
      
      // Obtener productos para determinar categorías
      const productosResponse = await axios.get(`${API_BASE_URL}/content/getMenu`);
      const productos = productosResponse.data.productos || [];
      
      // Crear mapa de productos por ID para consulta rápida
      const productosMap = {};
      productos.forEach(producto => {
        const categoriaBaja = producto.categoria ? producto.categoria.toLowerCase() : '';
        const tituloBajo = producto.titulo ? producto.titulo.toLowerCase() : '';
        
        let categoria = 'complementos'; // Categoría por defecto
        
        // Determinar categoría
        if (categoriaBaja.includes('pizza') || tituloBajo.includes('pizza')) {
          categoria = 'pizzas';
        } else if (
          categoriaBaja.includes('bebida') || 
          categoriaBaja.includes('refresco') || 
          tituloBajo.includes('bebida') ||
          tituloBajo.includes('coca') ||
          tituloBajo.includes('pepsi') ||
          tituloBajo.includes('agua') ||
          tituloBajo.includes('jugo')
        ) {
          categoria = 'bebidas';
        }
        
        productosMap[producto.id_producto] = { categoria };
      });

      // Filtrar pedidos por el periodo seleccionado
      const pedidosFiltrados = pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion);
        return fechaPedido >= fechaInicio && 
               fechaPedido <= fechaFin && 
               pedido.estado !== 'cancelado';
      });

      // Preparar meses para el gráfico
      const meses = obtenerMesesEnRango(fechaInicio, fechaFin);
      
      // Agrupar ventas por mes y categoría
      const datosPorMes = meses.map(mes => {
        // Filtrar pedidos del mes actual
        const pedidosDelMes = pedidosFiltrados.filter(pedido => {
          const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion);
          return fechaPedido.getMonth() === mes.numeroMes && 
                 fechaPedido.getFullYear() === mes.anio;
        });

        // Contar productos vendidos por categoría
        const categorias = { pizzas: 0, bebidas: 0, complementos: 0 };
        
        pedidosDelMes.forEach(pedido => {
          if (pedido.detalles && Array.isArray(pedido.detalles)) {
            pedido.detalles.forEach(detalle => {
              const productoId = detalle.id_producto;
              const cantidad = parseInt(detalle.cantidad) || 1;
              
              if (productosMap[productoId]) {
                const categoria = productosMap[productoId].categoria;
                categorias[categoria] += cantidad;
              } else {
                // Si no encuentra el producto, asignarlo a complementos
                categorias.complementos += cantidad;
              }
            });
          }
        });

        return {
          month: mes.nombreMes,
          pizzas: categorias.pizzas,
          bebidas: categorias.bebidas,
          complementos: categorias.complementos
        };
      });

      console.log("Datos de evolución procesados:", datosPorMes);
      setEvolutionData(datosPorMes);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener datos de evolución:", err);
      setError("No se pudieron cargar los datos de evolución");
      setLoading(false);
    }
  };

  // Función auxiliar para obtener fechas de inicio y fin según periodo
  const getFechasParaPeriodo = (periodo) => {
    const hoy = new Date();
    let fechaInicio = new Date(hoy);
    const fechaFin = new Date(hoy);
    
    switch (periodo) {
      case 'hoy':
        fechaInicio.setHours(0, 0, 0, 0); // Inicio del día
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
    
    return { fechaInicio, fechaFin };
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
      return <div className="loading-indicator">Cargando datos...</div>;
    }
    
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    
    if (!evolutionData.length) {
      return (
        <div className="no-data-message">
          <p>No hay datos suficientes para este periodo.</p>
          <button onClick={() => fetchEvolutionData(periodoSeleccionado)} className="reload-button">
            Intentar nuevamente
          </button>
        </div>
      );
    }
    
    return <LineGraf data={evolutionData} />;
  };

  return (
    <div className="productos-graficas-container">
      <h2 className="dashboard-title">Análisis de Productos</h2>

      {/* Sección de filtros de tiempo global */}
      <div className="filtros-dashboard">
        <select 
          value={periodoSeleccionado} 
          onChange={handlePeriodoChange}
          className="select-periodo"
        >
          <option value="hoy">Hoy</option>
          <option value="ultima-semana">Última Semana</option>
          <option value="ultimo-mes">Último Mes</option>
          <option value="ultimo-anio">Último Año</option>
        </select>
      </div>
      
      {/* Sección de KPIs de productos */}
      <ProductosKPI periodoSeleccionado={periodoSeleccionado} />
      
      <div className="productos-graficas-content">
        <div className="productos-charts-column">
          {/* Gráfica de evolución de ventas por categoría */}
          <div className="productos-chart">
            <div className="chart-header">
              <h3>Evolución de Ventas por Categoría</h3>
              <p className="chart-description">
                Visualización de la tendencia de ventas por categoría de productos en el tiempo
              </p>
            </div>
            <div className="chart-container">
              {renderLineGraph()}
            </div>
          </div>
          
          {/* Distribución de categorías y Tendencias */}
          <div className="productos-charts-row">
            <div className="chart-col-50">
              <DistribucionCategorias />
            </div>
            <div className="chart-col-50">
              <TendenciasProductos />
            </div>
          </div>
        </div>
        
        {/* Ranking de productos más vendidos */}
        <div className="productos-side-column">
          <TopProductosVendidos periodoSeleccionado={periodoSeleccionado} />
        </div>
      </div>
    </div>
  );
}

export default ProductosGraficas;