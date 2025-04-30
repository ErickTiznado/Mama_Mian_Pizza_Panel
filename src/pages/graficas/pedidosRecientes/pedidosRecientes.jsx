import { useState, useEffect } from "react";
import axios from "axios";
import "./pedidosRecientes.css";

const PedidosRecientes = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL base para la API de pedidos
  const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getFechaActual = () => {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0];
  };
  
  // Función para obtener pedidos del día actual
  const fetchPedidosDeHoy = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders`);
      console.log("Respuesta completa de la API:", response.data);
      
      // Filtrar los pedidos de hoy
      const fechaHoy = getFechaActual();
      const pedidosHoy = response.data.filter(pedido => 
        pedido.fecha_pedido && pedido.fecha_pedido.includes(fechaHoy)
      );
      
      console.log("Pedidos de hoy:", pedidosHoy);
      
      // Formatear los datos para que coincidan con la estructura esperada por el componente
      const pedidosFormateados = pedidosHoy.map(pedido => {
        // Obtener el nombre completo del cliente
        const nombreCliente = `${pedido.nombre_cliente || ''} ${pedido.apellido_cliente || ''}`.trim() || "Cliente";
        
        return {
          name: nombreCliente,
          orderId: pedido.codigo_pedido || `ORD-${pedido.id_pedido}`,
          total: parseFloat(pedido.total) || 0, 
          estado: pedido.estado || "pendiente"
        };
      });
      
      setPedidos(pedidosFormateados);
      setLoading(false);
      console.log("Pedidos formateados:", pedidosFormateados);
    } catch (err) {
      console.error("Error al cargar los pedidos:", err);
      setError("No se pudieron cargar los pedidos");
      setLoading(false);
    }
  };
  
  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchPedidosDeHoy();
  }, []);
  
  return (
    <>
      <div className="pedidos-container">
        <header className="pedidos-header">
          <h3>Pedidos Recientes</h3>
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <p>Has recibido {pedidos.length} pedidos hoy</p>
          )}
        </header>
        <div className="pedidos-content">
          {loading ? (
            <div className="loading">Cargando</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : pedidos.length === 0 ? (
            <div className="no-pedidos">No hay pedidos para hoy</div>
          ) : (
            <ul className="pedidos-list">
              {pedidos.slice(0, 5).map((pedido, index) => {
                // Determinar la clase de estado
                const statusClass = 
                  pedido.estado === "entregado" ? "entregado" :
                  pedido.estado === "en proceso" ? "en-proceso" :
                  pedido.estado === "cancelado" ? "cancelado" :
                  "pendiente";
                
                return (
                  <li key={index} className="pedido-item">
                    <div className="pedido-info">
                      <span className="pedido-name">
                        {pedido.name}
                      </span>
                      <span className="pedido-id">{pedido.orderId}</span>
                    </div>
                    <div className="pedido-details">
                      <span className="pedido-total">
                        ${typeof pedido.total === 'number' ? pedido.total.toFixed(2) : '0.00'}
                      </span>
                      <div className="pedido-status">
                        <div className={`status ${statusClass}`}>
                          <span>{pedido.estado === "pendiente" ? "Pendiente" : 
                                 pedido.estado === "en proceso" ? "En proceso" :
                                 pedido.estado === "cancelado" ? "Cancelado" : 
                                 pedido.estado === "entregado" ? "Entregado" : 
                                 "Pendiente"}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default PedidosRecientes;
