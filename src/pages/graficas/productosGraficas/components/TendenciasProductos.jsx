import React, { useState, useEffect } from 'react';
import { FaLongArrowAltUp, FaLongArrowAltDown, FaMinus } from 'react-icons/fa';
import './TendenciasProductos.css';
import axios from 'axios';

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api";

// Colores de la marca MamaMianPizza
const brandColors = {
  pizzas: '#991B1B',       // Rojo de marca
  bebidas: '#3D84B8',      // Azul corporativo
  complementos: '#FEB248'  // Amarillo de marca
};

const TendenciasProductos = () => {
  const [tendencias, setTendencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipoTendencia, setTipoTendencia] = useState('ganando'); // ganando, perdiendo
  
  useEffect(() => {
    fetchTendenciaData();
  }, [tipoTendencia]);

  const fetchTendenciaData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener pedidos de los últimos 60 días
      const fechaActual = new Date();
      const fechaInicio = new Date(fechaActual);
      fechaInicio.setDate(fechaActual.getDate() - 60); // Hace 60 días
      
      // Obtener pedidos a través de la API
      const pedidosResponse = await axios.get(`${API_BASE_URL}/orders/orders`);
      
      if (!pedidosResponse.data || pedidosResponse.data.length === 0) {
        setError("No se encontraron datos de pedidos");
        setLoading(false);
        return;
      }
      
      const pedidos = pedidosResponse.data;
      
      // Obtener productos del menú para tener información completa
      const productosResponse = await axios.get(`${API_BASE_URL}/content/getMenu`);
      const productos = productosResponse.data.productos || [];
      
      // Dividir los datos en dos periodos: 30 días anteriores y 30 días más anteriores
      const fechaInicioUltimos30 = new Date(fechaActual);
      fechaInicioUltimos30.setDate(fechaActual.getDate() - 30);
      
      // Filtrar pedidos completados (no cancelados)
      const pedidosCompletados = pedidos.filter(pedido => pedido.estado !== 'cancelado');
      
      // Pedidos de los últimos 30 días
      const pedidosUltimos30 = pedidosCompletados.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido >= fechaInicioUltimos30 && fechaPedido <= fechaActual;
      });
      
      // Pedidos del periodo anterior (30-60 días atrás)
      const pedidosPeriodoAnterior = pedidosCompletados.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido >= fechaInicio && fechaPedido < fechaInicioUltimos30;
      });
      
      // Contar ventas por producto en ambos periodos
      const ventasUltimos30 = contarVentasPorProducto(pedidosUltimos30);
      const ventasPeriodoAnterior = contarVentasPorProducto(pedidosPeriodoAnterior);
      
      // Calcular tendencias (comparativa entre ambos periodos)
      const tendenciasProductos = calcularTendencias(
        ventasUltimos30, 
        ventasPeriodoAnterior,
        productos
      );
      
      // Filtrar tendencias según el tipo seleccionado (ganando o perdiendo)
      const tendenciasFiltradas = tendenciasProductos
        .filter(t => (tipoTendencia === 'ganando' ? t.porcentaje > 0 : t.porcentaje < 0))
        .sort((a, b) => tipoTendencia === 'ganando' 
          ? b.porcentaje - a.porcentaje 
          : a.porcentaje - b.porcentaje
        )
        .slice(0, 5); // Tomar las 5 principales tendencias
      
      if (tendenciasFiltradas.length === 0) {
        setError(`No hay productos ${tipoTendencia === 'ganando' ? 'en aumento' : 'en descenso'}`);
      } else {
        setTendencias(tendenciasFiltradas);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar datos de tendencias:", err);
      setError("Error al cargar datos de tendencias: " + err.message);
      setLoading(false);
      
      // Cargar datos de ejemplo si la API falla
      setTendencias(getDatosDePrueba(tipoTendencia));
    }
  };
  
  // Función para contar ventas por producto en un conjunto de pedidos
  const contarVentasPorProducto = (pedidos) => {
    const ventasPorProducto = {};
    
    pedidos.forEach(pedido => {
      if (pedido.detalles && Array.isArray(pedido.detalles)) {
        pedido.detalles.forEach(detalle => {
          const idProducto = detalle.id_producto;
          const cantidad = parseInt(detalle.cantidad) || 1;
          
          if (idProducto) {
            ventasPorProducto[idProducto] = (ventasPorProducto[idProducto] || 0) + cantidad;
          }
        });
      }
    });
    
    return ventasPorProducto;
  };
  
  // Función para calcular tendencias comparando dos periodos
  const calcularTendencias = (ventasActuales, ventasAnteriores, productos) => {
    const tendencias = [];
    
    // Crear un mapa de productos para acceso rápido por ID
    const productosMap = {};
    productos.forEach(producto => {
      productosMap[producto.id_producto] = producto;
    });
    
    // Calcular tendencias para cada producto en el periodo actual
    for (const idProducto in ventasActuales) {
      const ventasActual = ventasActuales[idProducto] || 0;
      const ventasAnterior = ventasAnteriores[idProducto] || 0;
      const producto = productosMap[idProducto];
      
      // Omitir productos que no existan en el catálogo actual
      if (!producto) continue;
      
      let porcentaje = 0;
      
      if (ventasAnterior === 0 && ventasActual > 0) {
        // Producto nuevo, asignar un alto porcentaje de crecimiento
        porcentaje = 100;
      } else if (ventasAnterior > 0) {
        // Calcular porcentaje de cambio
        porcentaje = Math.round(((ventasActual - ventasAnterior) / ventasAnterior) * 100);
      }
      
      tendencias.push({
        id: idProducto,
        nombre: producto.titulo,
        porcentaje: porcentaje,
        periodo: '30d',
        ventasActual: ventasActual,
        ventasAnterior: ventasAnterior
      });
    }
    
    // Incluir productos que se vendieron en el periodo anterior pero no en el actual
    for (const idProducto in ventasAnteriores) {
      if (!ventasActuales[idProducto] && productosMap[idProducto]) {
        const producto = productosMap[idProducto];
        tendencias.push({
          id: idProducto,
          nombre: producto.titulo,
          porcentaje: -100, // -100% significa que dejó de venderse
          periodo: '30d',
          ventasActual: 0,
          ventasAnterior: ventasAnteriores[idProducto]
        });
      }
    }
    
    return tendencias;
  };
  
  // Datos de ejemplo para usar si la API falla
  const getDatosDePrueba = (tipo) => {
    const datos = {
      ganando: [
        { id: 1, nombre: 'Pizza de Camarón', porcentaje: 18, periodo: '30d' },
        { id: 2, nombre: 'Cheese Sticks', porcentaje: 15, periodo: '30d' },
        { id: 3, nombre: 'Pizza Vegetariana', porcentaje: 12, periodo: '30d' },
        { id: 4, nombre: 'Pepsi lata 355ml', porcentaje: 8, periodo: '30d' },
        { id: 5, nombre: 'Pizza Rolls', porcentaje: 7, periodo: '30d' },
      ],
      perdiendo: [
        { id: 6, nombre: 'Pizza Hawaiana', porcentaje: -10, periodo: '30d' },
        { id: 7, nombre: 'Pizza BBQ', porcentaje: -8, periodo: '30d' },
        { id: 8, nombre: 'Coca Cola 355ml', porcentaje: -6, periodo: '30d' },
        { id: 9, nombre: 'Pizza Suprema', porcentaje: -5, periodo: '30d' },
        { id: 10, nombre: 'Alitas de Pollo', porcentaje: -3, periodo: '30d' },
      ]
    };
    
    return datos[tipo];
  };
  
  const getTendenciaIcon = (porcentaje) => {
    if (porcentaje > 0) {
      return <FaLongArrowAltUp className="trend-icon up" />;
    } else if (porcentaje < 0) {
      return <FaLongArrowAltDown className="trend-icon down" />;
    } else {
      return <FaMinus className="trend-icon neutral" />;
    }
  };
  
  const formatPorcentaje = (porcentaje) => {
    const signo = porcentaje > 0 ? '+' : '';
    return `${signo}${porcentaje}%`;
  };

  return (
    <div className="tendencias-productos-container">
      <div className="tendencias-header">
        <h3>Tendencias de Productos</h3>
        <p>Productos ganando o perdiendo popularidad</p>
        
        <div className="tendencias-tabs">
          <button 
            className={`tab-btn ${tipoTendencia === 'ganando' ? 'active' : ''}`}
            onClick={() => setTipoTendencia('ganando')}
          >
            En Aumento
          </button>
          <button 
            className={`tab-btn ${tipoTendencia === 'perdiendo' ? 'active' : ''}`}
            onClick={() => setTipoTendencia('perdiendo')}
          >
            En Descenso
          </button>
        </div>
      </div>
      
      <div className="tendencias-content">
        {loading ? (
          <div className="tendencias-loading">Cargando...</div>
        ) : error ? (
          <div className="tendencias-error">{error}</div>
        ) : tendencias.length === 0 ? (
          <div className="tendencias-empty">No hay datos disponibles</div>
        ) : (
          <ul className="tendencias-lista">
            {tendencias.map((item, index) => (
              <li key={item.id || index} className={`tendencia-item ${index < 3 ? 'destacado' : ''}`}>
                <span className="tendencia-nombre">{item.nombre}</span>
                <div className="tendencia-stats">
                  <span className="tendencia-periodo">{item.periodo}</span>
                  <div className={`tendencia-porcentaje ${item.porcentaje > 0 ? 'positivo' : 'negativo'}`}>
                    {getTendenciaIcon(item.porcentaje)}
                    {formatPorcentaje(item.porcentaje)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TendenciasProductos;