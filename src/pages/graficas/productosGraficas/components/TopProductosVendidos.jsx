import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPizzaSlice, FaGlassWhiskey, FaHamburger, FaCarrot } from 'react-icons/fa';
import './TopProductosVendidos.css';

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

const TopProductosVendidos = () => {
  // Estados para el componente
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('ultima-semana');
  const [categoria, setCategoria] = useState('todos');
  const [mostrarTodos, setMostrarTodos] = useState(false); // Estado para controlar cuántos productos mostrar

  // Cargar datos al montar el componente o cuando cambie el periodo seleccionado
  useEffect(() => {
    fetchTopProductos();
  }, [periodoSeleccionado, categoria]);

  // Función para obtener los productos más vendidos
  const fetchTopProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamada a la API para obtener los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders`);
      
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        setError("No se recibieron datos válidos de la API");
        setLoading(false);
        return;
      }
      
      // Procesar los datos de pedidos para extraer productos más vendidos
      const productosVendidos = procesarPedidosParaTopProductos(response.data);
      
      setTopProductos(productosVendidos);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los productos más vendidos: " + err.message);
      setLoading(false);
      console.error("Error fetching top productos:", err);
    }
  };

  // Función para procesar los pedidos y extraer productos más vendidos
  const procesarPedidosParaTopProductos = (pedidos) => {
    try {
      // Verificar si hay pedidos
      if (!pedidos || pedidos.length === 0) {
        return [];
      }
      
      // Filtrar pedidos según periodo seleccionado
      const pedidosFiltrados = filtrarPedidosPorPeriodo(pedidos, periodoSeleccionado);
      
      // Filtrar pedidos por estado (solo considerar "pendiente" o completados, no los cancelados)
      const pedidosValidos = pedidosFiltrados.filter(pedido => 
        pedido.estado !== 'cancelado'
      );
      
      // Inicializar contador de productos
      const contadorProductos = {};
      
      // Iterar sobre todos los pedidos
      pedidosValidos.forEach(pedido => {
        // Verificar si el pedido tiene detalles
        if (pedido.detalles && Array.isArray(pedido.detalles)) {
          pedido.detalles.forEach(detalle => {
            // Verificar si tenemos los datos necesarios del producto
            if (detalle.nombre_producto_original) {
              const nombreProducto = detalle.nombre_producto_original;
              // Intentar inferir categoría basada en el nombre o descripción
              let categoriaProducto = 'sin_categoria';
              
              const nombreLower = nombreProducto.toLowerCase();
              if (nombreLower.includes('pizza')) {
                categoriaProducto = 'pizza';
              } else if (nombreLower.includes('bebida') || 
                         nombreLower.includes('refresco') || 
                         nombreLower.includes('agua') ||
                         nombreLower.includes('pepsi') ||
                         nombreLower.includes('fanta') ||
                         nombreLower.includes('lata') ||
                         nombreLower.includes('ml')) {
                categoriaProducto = 'bebida';
              } else if (nombreLower.includes('roll') || 
                         nombreLower.includes('stick') || 
                         nombreLower.includes('palitos')) {
                categoriaProducto = 'complemento';
              }
              
              // Si estamos filtrando por categoría y no es la categoría seleccionada, ignorar
              if (categoria !== 'todos' && categoriaProducto.toLowerCase() !== categoria.toLowerCase()) {
                return;
              }
              
              // Incrementar el contador para este producto
              if (!contadorProductos[nombreProducto]) {
                contadorProductos[nombreProducto] = {
                  nombre: nombreProducto,
                  cantidad: 0,
                  categoria: categoriaProducto,
                  precioPromedio: 0,
                  totalVentas: 0
                };
              }
              
              // Incrementar según la cantidad del producto en el detalle
              const cantidad = parseInt(detalle.cantidad) || 1;
              const precio = parseFloat(detalle.precio_unitario) || 0;
              
              contadorProductos[nombreProducto].cantidad += cantidad;
              contadorProductos[nombreProducto].totalVentas += (precio * cantidad);
            }
          });
        }
      });
      
      // Convertir el objeto a un array y calcular precio promedio
      const productosArray = Object.values(contadorProductos).map(producto => {
        if (producto.cantidad > 0) {
          producto.precioPromedio = (producto.totalVentas / producto.cantidad).toFixed(2);
        }
        return producto;
      });
      
      // Ordenar productos por cantidad (de mayor a menor)
      const topProductos = productosArray.sort((a, b) => b.cantidad - a.cantidad);
      
      // Tomar los primeros 10 productos más vendidos
      return topProductos.slice(0, 10);
      
    } catch (error) {
      console.error("Error al procesar pedidos para top productos:", error);
      return [];
    }
  };

  // Función para filtrar pedidos por periodo
  const filtrarPedidosPorPeriodo = (pedidos, periodo) => {
    const fechaActual = new Date();
    let fechaInicio;
    
    switch (periodo) {
      case 'hoy':
        fechaInicio = new Date(fechaActual);
        fechaInicio.setHours(0, 0, 0, 0);
        break;
        
      case 'ultima-semana':
        fechaInicio = new Date(fechaActual);
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        break;
        
      case 'ultimo-mes':
        fechaInicio = new Date(fechaActual);
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
        
      case 'ultimo-anio':
        fechaInicio = new Date(fechaActual);
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
        
      default:
        // Por defecto, último mes
        fechaInicio = new Date(fechaActual);
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }
    
    return pedidos.filter(pedido => {
      if (!pedido.fecha_pedido) return false;
      const fechaPedido = new Date(pedido.fecha_pedido);
      return fechaPedido >= fechaInicio && fechaPedido <= fechaActual;
    });
  };

  // Obtener ícono según la categoría del producto
  const getProductIcon = (nombre, categoria) => {
    const nombreLower = nombre.toLowerCase();
    const categoriaLower = categoria?.toLowerCase() || '';
    
    if (nombreLower.includes('pizza') || categoriaLower.includes('pizza')) {
      return <FaPizzaSlice className="producto-icon pizza-icon" />;
    } else if (
      nombreLower.includes('bebida') || 
      nombreLower.includes('refresco') || 
      nombreLower.includes('agua') ||
      nombreLower.includes('pepsi') ||
      nombreLower.includes('fanta') ||
      nombreLower.includes('lata') ||
      nombreLower.includes('ml') ||
      categoriaLower.includes('bebida')
    ) {
      return <FaGlassWhiskey className="producto-icon bebida-icon" />;
    } else if (
      nombreLower.includes('ensalada') || 
      nombreLower.includes('vegetal') ||
      categoriaLower.includes('vegetal')
    ) {
      return <FaCarrot className="producto-icon ensalada-icon" />;
    } else {
      return <FaHamburger className="producto-icon complemento-icon" />;
    }
  };

  // Función para obtener el porcentaje de crecimiento (simulado)
  const obtenerPorcentaje = (index) => {
    // En una implementación real esto vendría de comparar con periodos anteriores
    const porcentajes = ['+12%', '+8%', '+5%', '+3%', '-2%', '+1%', '+7%', '+4%', '-1%', '+2%'];
    return porcentajes[index] || '+0%';
  };

  // Manejar cambio de periodo
  const handleChangePeriodo = (event) => {
    setPeriodoSeleccionado(event.target.value);
  };

  // Manejar cambio de categoría
  const handleChangeCategoria = (event) => {
    setCategoria(event.target.value);
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

  // Función para alternar entre mostrar más o menos productos
  const toggleMostrarTodos = () => {
    setMostrarTodos(!mostrarTodos);
  };

  // Limitamos a 5 productos por defecto, y mostramos todos (hasta 10) si mostrarTodos es true
  const productosAMostrar = mostrarTodos 
    ? topProductos 
    : topProductos.slice(0, 5);

  return (
    <div className="top-productos-vendidos">
      <div className="top-productos-header">
        <h3 className="top-productos-title">Top Productos Más Vendidos</h3>
        
        <div className="top-productos-controles">
          <div className="top-productos-filtros">
            <select 
              id="periodo" 
              value={periodoSeleccionado} 
              onChange={handleChangePeriodo}
              className="filtro-select"
            >
              <option value="hoy">Hoy</option>
              <option value="ultima-semana">Última Semana</option>
              <option value="ultimo-mes">Último Mes</option>
              <option value="ultimo-anio">Último Año</option>
            </select>
            
            <select 
              id="categoria" 
              value={categoria} 
              onChange={handleChangeCategoria}
              className="filtro-select"
            >
              <option value="todos">Todas</option>
              <option value="pizza">Pizzas</option>
              <option value="bebida">Bebidas</option>
              <option value="complemento">Complementos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="top-productos-content">
        {loading ? (
          <div className="top-productos-loading">Cargando productos...</div>
        ) : error ? (
          <div className="top-productos-error">{error}</div>
        ) : topProductos.length === 0 ? (
          <div className="top-productos-empty">No hay datos disponibles para este periodo</div>
        ) : (
          <div className="top-productos-lista">
            {productosAMostrar.map((producto, index) => (
              <div key={index} className={`top-producto-item ${index < 3 ? 'top-tres' : ''}`}>
                <div className="top-producto-ranking">
                  <span className={`ranking-number rank-${index + 1}`}>{index + 1}</span>
                </div>
                <div className="top-producto-info">
                  <div className="producto-nombre-container">
                    {getProductIcon(producto.nombre, producto.categoria)}
                    <span className="producto-nombre">{producto.nombre}</span>
                  </div>
                </div>
                <div className="top-producto-stats">
                  <div className="producto-cantidad">
                    <span className="cantidad-valor">{producto.cantidad}</span>
                    <span className="cantidad-label">uds</span>
                  </div>
                  <div className={`producto-porcentaje ${obtenerPorcentaje(index).includes('-') ? 'negativo' : 'positivo'}`}>
                    {obtenerPorcentaje(index)}
                  </div>
                </div>
              </div>
            ))}
            
            {topProductos.length > 5 && (
              <button 
                onClick={toggleMostrarTodos} 
                className="ver-mas-btn"
              >
                {mostrarTodos ? 'Ver menos' : `Ver ${topProductos.length - 5} más`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductosVendidos;