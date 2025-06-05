import React, { useState, useEffect } from "react";
import LineGraf from "../graficodeLineas/lineGraf";
import "./productosGraficas.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faCalendarAlt, faBoxOpen, faChartLine, faTrophy, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';

// Importar componentes
import TopProductosVendidos from "./components/TopProductosVendidos";
import ProductosKPI from "./components/ProductosKPI";
import DistribucionCategorias from "./components/DistribucionCategorias";
import TendenciasProductos from "./components/TendenciasProductos";

// API Base URL
const API_BASE_URL = "https://api.mamamianpizza.com/api";

function ProductosGraficas({ fechasFiltradas }) {
  const [evolutionData, setEvolutionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos de evolución por categoría cuando cambien las fechas filtradas
  useEffect(() => {
    if (fechasFiltradas && fechasFiltradas.inicio && fechasFiltradas.fin) {
      fetchEvolutionData(fechasFiltradas.inicio, fechasFiltradas.fin);
    }
  }, [fechasFiltradas]);

  // Función para obtener los datos de evolución de ventas por categoría
  const fetchEvolutionData = async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      
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
    
    if (!evolutionData.length) {
      return (
        <div className="gprod-no-data-message">
          <p>No hay datos suficientes para este periodo.</p>
          <button 
            onClick={() => fechasFiltradas && fetchEvolutionData(fechasFiltradas.inicio, fechasFiltradas.fin)} 
            className="gprod-reload-button"
          >
            Intentar nuevamente
          </button>
        </div>
      );
    }
    
    return <LineGraf data={evolutionData} colors={['#FEB248', '#3D84B8', '#1f2937']} />;
  };

  // Formatear el texto del período para mostrarlo en la UI
  const obtenerTextoPeriodo = () => {
    if (!fechasFiltradas) return "Último mes";
    
    switch (fechasFiltradas.periodo) {
      case 'hoy':
        return "Hoy";
      case 'ultima-semana':
        return "Última semana";
      case 'ultimo-mes':
        return "Último mes";
      case 'ultimo-anio':
        return "Último año";
      case 'personalizado':
        return `Desde ${formatoFecha(fechasFiltradas.inicio)} hasta ${formatoFecha(fechasFiltradas.fin)}`;
      default:
        return "Último mes";
    }
  };

  // Función auxiliar para formatear fechas
  const formatoFecha = (fecha) => {
    if (!fecha) return "";
    const f = new Date(fecha);
    return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
  };

  return (
    <div className="gprod-productos-graficas-container">

      
      {/* Sección de KPIs de productos */}
      <ProductosKPI fechasFiltradas={fechasFiltradas} colorPrimario="#FEB248" />
      
      <div className="gprod-productos-graficas-content">
        <div className="gprod-productos-charts-column">
          {/* Gráfica de evolución de ventas por categoría */}
          <div className="gprod-productos-chart">
            <div className="gprod-chart-header">
              <h3>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px', color: '#FEB248' }} />
                Evolución de Ventas por Categoría
              </h3>
              <p className="gprod-chart-description">
                Visualización de la tendencia de ventas por categoría de productos en el tiempo
              </p>
            </div>
            <div className="gprod-chart-container">
              {renderLineGraph()}
            </div>
          </div>
          
          {/* Distribución de categorías y Tendencias */}
          <div className="gprod-productos-charts-row">

            <div className="gprod-chart-col-50">
              <div className="gprod-chart-container">
                <div className="gprod-chart-header">
                  <h3>
                    <FontAwesomeIcon icon={faArrowAltCircleUp} style={{ marginRight: '10px', color: '#FEB248' }} />
                    Tendencias de Productos
                  </h3>
                  <p className="gprod-chart-description">
                    Productos con mayor crecimiento en ventas
                  </p>
                </div>
                <TendenciasProductos 
                  fechasFiltradas={fechasFiltradas} 
                  colorPrimario="#FEB248" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Ranking de productos más vendidos */}
        <div className="gprod-productos-side-column">
          <div className="gprod-chart-container">
            <div className="gprod-chart-header">
              <h3>
                <FontAwesomeIcon icon={faTrophy} style={{ marginRight: '10px', color: '#FEB248' }} />
                Top Productos Vendidos
              </h3>
              <p className="gprod-chart-description">
                Los productos más populares durante el período seleccionado
              </p>
            </div>
            <TopProductosVendidos 
              fechasFiltradas={fechasFiltradas} 
              colorAccent="#FEB248" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductosGraficas;