import React, { useState, useEffect } from "react";
import "./OrderManager.css";
import axios from "axios";

const OrderManager = () => {
  const [modo, setModo] = useState("restaurante");
  const [metodoPago, setMetodoPago] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("pendiente");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Base URL para la API
  const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

  // Función para obtener todos los pedidos
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/orders`);
      console.log("Respuesta de la API (todos los pedidos):", response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los pedidos: " + err.message);
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  // Función para obtener pedidos por estado
  const fetchOrdersByStatus = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/orders/status/${status}`);
      console.log(`Respuesta de la API (pedidos con estado ${status}):`, response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los pedidos: " + err.message);
      setLoading(false);
      console.error(`Error fetching orders with status ${status}:`, err);
      // Mostrar detalles del error
      if (err.response) {
        console.error("Detalles del error:", {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
      }
    }
  };

  // Función para actualizar el estado de un pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
        estado: newStatus
      });
      console.log("Respuesta de actualización de estado:", response.data);
      
      // Si la orden seleccionada es la que se actualizó, actualizar su estado en el modal
      if (selectedOrder && selectedOrder.id_pedido === orderId) {
        setSelectedOrder({...selectedOrder, estado: newStatus});
      }
      
      // Refrescar los pedidos después de actualizar el estado
      fetchOrdersByStatus(activeFilter);
    } catch (err) {
      setError("Error al actualizar el estado del pedido: " + err.message);
      console.error("Error updating order status:", err);
    }
  };

  // Cargar pedidos por defecto (pendientes) al montar el componente
  useEffect(() => {
    fetchOrdersByStatus("pendiente");
  }, []);

  // Función para manejar el cambio de filtro
  const handleFilterChange = (status) => {
    setActiveFilter(status);
    fetchOrdersByStatus(status);
  };

  // Función para cancelar un pedido
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("¿Estás seguro que deseas cancelar este pedido?")) {
      try {
        await updateOrderStatus(orderId, "cancelado");
      } catch (err) {
        console.error("Error canceling order:", err);
      }
    }
  };

  // Función para ver detalles de un pedido
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  
  const formatProductList = (detalles) => {
    if (!detalles || detalles.length === 0) return "Sin productos";
    return detalles.map(item => item.nombre_producto_original).join(", ");
  };

  const getClientName = (order) => {
    if (order.nombre_usuario) return order.nombre_usuario;
    if (order.nombre_invitado) return `${order.nombre_invitado} ${order.apellido_invitado || ''}`;
    return "Cliente sin nombre";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const changeOrderStatus = (orderId, newStatus) => {
    if (window.confirm(`¿Cambiar estado del pedido a ${getStatusName(newStatus)}?`)) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const getStatusName = (status) => {
    const statusMap = {
      "pendiente": "Pendiente",
      "en_proceso": "En Proceso",
      "entregado": "Entregado",
      "cancelado": "Cancelado"
    };
    return statusMap[status] || status;
  };

  // Función para obtener el color de fondo según el tiempo transcurrido
  const getRowBackgroundClass = (fechaCreacion) => {
    if (!fechaCreacion) return "";
    
    const fechaPedido = new Date(fechaCreacion);
    const ahora = new Date();
    const tiempoTranscurrido = ahora - fechaPedido; // milisegundos
    const minutosTranscurridos = tiempoTranscurrido / (1000 * 60);

    if (minutosTranscurridos > 30) return "pedido-urgente";
    if (minutosTranscurridos > 15) return "pedido-alerta";
    return "";
  };

  // Función para formatear tiempo transcurrido
  const formatTiempoTranscurrido = (fechaCreacion) => {
    if (!fechaCreacion) return "N/A";
    
    const fechaPedido = new Date(fechaCreacion);
    const ahora = new Date();
    const tiempoTranscurrido = ahora - fechaPedido; // milisegundos
    
    const minutos = Math.floor(tiempoTranscurrido / (1000 * 60));
    
    if (minutos < 60) {
      return `${minutos} min`;
    } else {
      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;
      return `${horas}h ${minutosRestantes}m`;
    }
  };

  return (
    <div className="order__container">
      <header className="order__header">
        <h1>Gestión de Pedidos</h1>
      </header>
      <main className="order__main">
        <div className="order__filters">
          <div className="filters">
            <button 
              className={activeFilter === "pendiente" ? "active" : ""}
              onClick={() => handleFilterChange("pendiente")}
            >
              Pendientes
            </button>
          </div>
          <div className="filters">
            <button 
              className={activeFilter === "en_proceso" ? "active" : ""}
              onClick={() => handleFilterChange("en_proceso")}
            >
              En Proceso
            </button>
          </div>
          <div className="filters">
            <button 
              className={activeFilter === "entregado" ? "active" : ""}
              onClick={() => handleFilterChange("entregado")}
            >
              Entregados
            </button>
          </div>
          <div className="filters">
            <button 
              className={activeFilter === "cancelado" ? "active" : ""}
              onClick={() => handleFilterChange("cancelado")}
            >
              Cancelados
            </button>
          </div>
        </div>
        
        {loading && <div className="loading-indicator">Cargando pedidos...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="order__content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiempo</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Método de Pago</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr 
                    key={order.id_pedido} 
                    className={activeFilter === "pendiente" ? getRowBackgroundClass(order.fecha_creacion) : ""}
                  >
                    <td>{order.id_pedido}</td>
                    <td>
                      <div className="tiempo-cell">
                        <div>{formatDate(order.fecha_creacion)}</div>
                        {activeFilter === "pendiente" && (
                          <div className="tiempo-transcurrido">
                            {formatTiempoTranscurrido(order.fecha_creacion)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="productos-cell">
                      {order.detalles && order.detalles.length > 0 ? (
                        <ul className="productos-lista">
                          {order.detalles.slice(0, 2).map((item, idx) => (
                            <li key={idx}>
                              <strong>{item.cantidad}x</strong> {item.nombre_producto_original}
                            </li>
                          ))}
                          {order.detalles.length > 2 && (
                            <li className="mas-productos">
                              +{order.detalles.length - 2} productos más
                            </li>
                          )}
                        </ul>
                      ) : (
                        "Sin productos"
                      )}
                    </td>
                    <td>
                      <span className={`pedido-estado estado-${order.estado}`}>
                        {getStatusName(order.estado)}
                      </span>
                    </td>
                    <td>{getClientName(order)}</td>
                    <td className="direccion-cell">
                      {order.direccion_formateada ? (
                        <div className="direccion-texto">
                          {order.direccion_formateada.length > 30 
                            ? `${order.direccion_formateada.substring(0, 30)}...` 
                            : order.direccion_formateada}
                        </div>
                      ) : (
                        "Recogida en tienda"
                      )}
                    </td>
                    <td>{order.metodo_pago}</td>
                    <td className="total-cell">${parseFloat(order.total).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn__action__details"
                        onClick={() => handleViewDetails(order)}
                      >
                        Ver Detalles
                      </button>
                      {activeFilter !== "cancelado" && (
                        <div className="order-actions">
                          {order.estado !== "pendiente" && (
                            <button 
                              className="btn-state btn-pendiente"
                              onClick={() => changeOrderStatus(order.id_pedido, "pendiente")}
                            >
                              Pendiente
                            </button>
                          )}
                          {order.estado !== "en_proceso" && (
                            <button 
                              className="btn-state btn-en_proceso"
                              onClick={() => changeOrderStatus(order.id_pedido, "en_proceso")}
                            >
                              En Proceso
                            </button>
                          )}
                          {order.estado !== "entregado" && (
                            <button 
                              className="btn-state btn-entregado"
                              onClick={() => changeOrderStatus(order.id_pedido, "entregado")}
                            >
                              Entregado
                            </button>
                          )}
                          {order.estado !== "cancelado" && (
                            <button 
                              className="btn__action__cancell"
                              onClick={() => handleCancelOrder(order.id_pedido)}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    {loading ? "Cargando..." : "No hay pedidos para mostrar"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de detalles del pedido */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle del Pedido #{selectedOrder.id_pedido}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="order-detail-section">
              <h3>Estado del Pedido</h3>
              <span className={`pedido-estado estado-${selectedOrder.estado}`}>
                {getStatusName(selectedOrder.estado)}
              </span>
            </div>

            <div className="order-detail-section">
              <h3>Información del Cliente</h3>
              <p><strong>Cliente:</strong> {getClientName(selectedOrder)}</p>
              {selectedOrder.celular_invitado && (
                <p><strong>Teléfono:</strong> {selectedOrder.celular_invitado}</p>
              )}
              <p><strong>Dirección:</strong> {selectedOrder.direccion_formateada || "Recogida en tienda"}</p>
              {selectedOrder.latitud && selectedOrder.longitud && (
                <p><strong>Ubicación:</strong> {selectedOrder.latitud}, {selectedOrder.longitud}</p>
              )}
            </div>

            <div className="order-detail-section">
              <h3>Información del Pedido</h3>
              <p><strong>Fecha de creación:</strong> {formatDate(selectedOrder.fecha_creacion)}</p>
              <p><strong>Método de pago:</strong> {selectedOrder.metodo_pago}</p>
              <p><strong>Total:</strong> ${parseFloat(selectedOrder.total).toFixed(2)}</p>
              <p><strong>Modo de entrega:</strong> {selectedOrder.modo_entrega || "No especificado"}</p>
              {selectedOrder.instrucciones_especiales && (
                <p><strong>Instrucciones especiales:</strong> {selectedOrder.instrucciones_especiales}</p>
              )}
              {selectedOrder.notas && (
                <p><strong>Notas:</strong> {selectedOrder.notas}</p>
              )}
            </div>

            <div className="order-detail-section">
              <h3>Productos</h3>
              <div className="product-list">
                {selectedOrder.detalles && selectedOrder.detalles.length > 0 ? (
                  selectedOrder.detalles.map((item, index) => (
                    <div className="product-item" key={index}>
                      <p><strong>Producto:</strong> {item.nombre_producto_original}</p>
                      <p><strong>Cantidad:</strong> {item.cantidad}</p>
                      <p><strong>Precio unitario:</strong> ${parseFloat(item.precio_unitario).toFixed(2)}</p>
                      <p><strong>Subtotal:</strong> ${parseFloat(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                      {item.descripcion && (
                        <p><strong>Descripción:</strong> {item.descripcion}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No hay productos en este pedido</p>
                )}
              </div>
            </div>

            <div className="order-detail-section">
              <h3>Cambiar Estado</h3>
              <div className="order-actions">
                <button 
                  className="btn-state btn-pendiente"
                  onClick={() => changeOrderStatus(selectedOrder.id_pedido, "pendiente")}
                  disabled={selectedOrder.estado === "pendiente"}
                >
                  Pendiente
                </button>
                <button 
                  className="btn-state btn-en_proceso"
                  onClick={() => changeOrderStatus(selectedOrder.id_pedido, "en_proceso")}
                  disabled={selectedOrder.estado === "en_proceso"}
                >
                  En Proceso
                </button>
                <button 
                  className="btn-state btn-entregado"
                  onClick={() => changeOrderStatus(selectedOrder.id_pedido, "entregado")}
                  disabled={selectedOrder.estado === "entregado"}
                >
                  Entregado
                </button>
                <button 
                  className="btn__action__cancell"
                  onClick={() => handleCancelOrder(selectedOrder.id_pedido)}
                  disabled={selectedOrder.estado === "cancelado"}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
