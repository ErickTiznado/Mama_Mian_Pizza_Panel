import React, { useState, useEffect } from "react";
import "./OrderManager.css";
import axios from "axios";
import { FaEye, FaClock, FaRegCalendarAlt, FaMapMarkerAlt, FaMapMarked } from "react-icons/fa";
import OrderLocationMap from "../map/OrderLocationMap";

const OrderManager = () => {
  const [modo, setModo] = useState("restaurante");
  const [metodoPago, setMetodoPago] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("pendiente");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

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
    if (order.nombre_cliente) return `${order.nombre_cliente} ${order.apellido_cliente || ''}`;
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

  // Función para contar el total de productos en un pedido
  const getTotalProductos = (detalles) => {
    if (!detalles || detalles.length === 0) return 0;
    return detalles.reduce((total, item) => total + parseInt(item.cantidad), 0);
  };

  // Función para manejar el clic en el botón de ubicación en tiempo real
  const handleShowLocationMap = () => {
    setShowMap(true);
    setShowRoute(false);
  }

  // Función para mostrar la ruta hacia la ubicación
  const handleShowRoute = () => {
    setShowRoute(true);
    setShowMap(true);
  }

  // Función para cerrar el mapa
  const handleCloseMap = () => {
    setShowMap(false);
    setShowRoute(false);
  }

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
                <th>Código</th>
                <th>Tiempo</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Método</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr 
                    key={order.id_pedido} 
                    className={activeFilter === "pendiente" ? getRowBackgroundClass(order.fecha_pedido) : ""}
                  >
                    <td className="codigo-cell">
                      <div className="codigo-info">
                        <span className="codigo-badge">{order.codigo_pedido}</span>
                        <span className="id-pedido">#{order.id_pedido}</span>
                      </div>
                    </td>
                    <td className="tiempo-cell">
                      <div className="tiempo-info">
                        <div className="tiempo-fecha">
                          <FaRegCalendarAlt className="icon-small" /> {formatDate(order.fecha_pedido)}
                        </div>
                        {activeFilter === "pendiente" && (
                          <div className="tiempo-transcurrido">
                            <FaClock className="icon-small" /> {formatTiempoTranscurrido(order.fecha_pedido)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="productos-cell">
                      {order.detalles && order.detalles.length > 0 ? (
                        <div className="productos-info">
                          <div className="productos-count">
                            <strong>{getTotalProductos(order.detalles)}</strong> productos
                          </div>
                          <ul className="productos-lista">
                            {order.detalles.slice(0, 2).map((item, idx) => (
                              <li key={idx}>
                                <strong>{item.cantidad}x</strong> {item.nombre_producto_original}
                                {item.tamano && <span className="producto-tamano"> ({item.tamano})</span>}
                              </li>
                            ))}
                            {order.detalles.length > 2 && (
                              <li className="mas-productos">
                                +{order.detalles.length - 2} más
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <span className="sin-productos">Sin productos</span>
                      )}
                    </td>
                    <td className="estado-cell">
                      <span className={`pedido-estado estado-${order.estado}`}>
                        {getStatusName(order.estado)}
                      </span>
                    </td>
                    <td className="cliente-cell">
                      <div className="cliente-info">
                        <div className="cliente-nombre">{getClientName(order)}</div>
                        <div className="cliente-telefono">{order.celular_invitado || order.telefono}</div>
                      </div>
                    </td>
                    <td className="direccion-cell">
                      {order.direccion_formateada ? (
                        <div className="direccion-info">
                          <FaMapMarkerAlt className="icon-small" />
                          <div className="direccion-texto" title={order.direccion_formateada}>
                            {order.direccion_formateada.length > 30 
                              ? `${order.direccion_formateada.substring(0, 30)}...` 
                              : order.direccion_formateada}
                          </div>
                        </div>
                      ) : (
                        <span className="direccion-local">Recogida en tienda</span>
                      )}
                    </td>
                    <td className="metodo-cell">
                      <div className="metodo-pago-badge">
                        {order.metodo_pago}
                      </div>
                    </td>
                    <td className="total-cell">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="acciones-cell">
                      <div className="action-buttons-container">
                        <button 
                          className="action-primary-button btn__action__details"
                          onClick={() => handleViewDetails(order)}
                        >
                          <FaEye className="icon-small" /> Ver Detalles
                        </button>
                        
                        {activeFilter !== "cancelado" && (
                          <div className="action-secondary-buttons">
                            {order.estado !== "pendiente" && (
                              <button 
                                className="action-secondary-button btn-state btn-pendiente"
                                onClick={() => changeOrderStatus(order.id_pedido, "pendiente")}
                              >
                                Pendiente
                              </button>
                            )}
                            {order.estado !== "en_proceso" && (
                              <button 
                                className="action-secondary-button btn-state btn-en_proceso"
                                onClick={() => changeOrderStatus(order.id_pedido, "en_proceso")}
                              >
                                En Proceso
                              </button>
                            )}
                            {order.estado !== "entregado" && (
                              <button 
                                className="action-secondary-button btn-state btn-entregado"
                                onClick={() => changeOrderStatus(order.id_pedido, "entregado")}
                              >
                                Entregado
                              </button>
                            )}
                            {order.estado !== "cancelado" && (
                              <button 
                                className="action-secondary-button btn__action__cancell"
                                onClick={() => handleCancelOrder(order.id_pedido)}
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
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
              <h2>Pedido #{selectedOrder.id_pedido} - {selectedOrder.codigo_pedido}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            {!showMap ? (
              <>
                <div className="modal-columns">
                  <div className="modal-column">
                    <div className="order-detail-section">
                      <h3>Estado del Pedido</h3>
                      <div className="estado-container">
                        <span className={`pedido-estado estado-${selectedOrder.estado}`}>
                          {getStatusName(selectedOrder.estado)}
                        </span>
                        <span className="tiempo-estimado">
                          Tiempo estimado: {selectedOrder.tiempo_estimado_entrega || "N/A"} min
                        </span>
                      </div>
                    </div>

                    <div className="order-detail-section">
                      <h3>Información del Cliente</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <strong>Cliente:</strong>
                          <span>{getClientName(selectedOrder)}</span>
                        </div>
                        {selectedOrder.celular_invitado && (
                          <div className="info-row">
                            <strong>Teléfono:</strong>
                            <span>{selectedOrder.celular_invitado}</span>
                          </div>
                        )}
                        {selectedOrder.telefono && !selectedOrder.celular_invitado && (
                          <div className="info-row">
                            <strong>Teléfono:</strong>
                            <span>{selectedOrder.telefono}</span>
                          </div>
                        )}
                        {selectedOrder.email && (
                          <div className="info-row">
                            <strong>Email:</strong>
                            <span>{selectedOrder.email}</span>
                          </div>
                        )}
                        <div className="info-row">
                          <strong>Dirección:</strong>
                          <span>{selectedOrder.direccion_formateada || selectedOrder.direccion || "Recogida en tienda"}</span>
                        </div>
                        {selectedOrder.latitud && selectedOrder.longitud && (
                          <div className="info-row">
                            <strong>Ubicación:</strong>
                            <span>{selectedOrder.latitud}, {selectedOrder.longitud}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedOrder.latitud && selectedOrder.longitud && (
                      <div className="order-detail-section">
                        <h3>Ubicación de Entrega</h3>
                        <div className="location-buttons">
                          <button 
                            className="location-button view-location"
                            onClick={handleShowLocationMap}
                          >
                            <FaMapMarkerAlt className="button-icon" /> Ver Ubicación
                          </button>
                          <button 
                            className="location-button show-route"
                            onClick={handleShowRoute}
                          >
                            <FaMapMarked className="button-icon" /> Ubicación en Tiempo Real
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-column">
                    <div className="order-detail-section">
                      <h3>Información del Pedido</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <strong>Fecha:</strong>
                          <span>{formatDate(selectedOrder.fecha_pedido || selectedOrder.fecha_creacion)}</span>
                        </div>
                        <div className="info-row">
                          <strong>Tipo de cliente:</strong>
                          <span>{selectedOrder.tipo_cliente || "No especificado"}</span>
                        </div>
                        <div className="info-row">
                          <strong>Método de pago:</strong>
                          <span>{selectedOrder.metodo_pago}</span>
                        </div>
                        <div className="info-row">
                          <strong>Subtotal:</strong>
                          <span>${parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</span>
                        </div>
                        {selectedOrder.costo_envio && parseFloat(selectedOrder.costo_envio) > 0 && (
                          <div className="info-row">
                            <strong>Costo de envío:</strong>
                            <span>${parseFloat(selectedOrder.costo_envio).toFixed(2)}</span>
                          </div>
                        )}
                        {selectedOrder.impuestos && parseFloat(selectedOrder.impuestos) > 0 && (
                          <div className="info-row">
                            <strong>Impuestos:</strong>
                            <span>${parseFloat(selectedOrder.impuestos).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="info-row total-row">
                          <strong>Total:</strong>
                          <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                        </div>
                        {selectedOrder.notas_adicionales && (
                          <div className="info-row full-width">
                            <strong>Notas adicionales:</strong>
                            <span>{selectedOrder.notas_adicionales}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3>Productos</h3>
                  <div className="product-list">
                    {selectedOrder.detalles && selectedOrder.detalles.length > 0 ? (
                      selectedOrder.detalles.map((item, index) => (
                        <div className="product-item" key={index}>
                          <div className="product-header">
                            <h4>{item.nombre_producto_original}</h4>
                            <span className="product-price">${parseFloat(item.subtotal).toFixed(2)}</span>
                          </div>
                          <div className="product-details">
                            <div className="product-specs">
                              <span className="product-qty">Cantidad: <strong>{item.cantidad}</strong></span>
                              <span className="product-unit-price">Precio unitario: <strong>${parseFloat(item.precio_unitario).toFixed(2)}</strong></span>
                              {item.tamano && <span className="product-size">Tamaño: <strong>{item.tamano}</strong></span>}
                              {item.masa && <span className="product-masa">Masa: <strong>{item.masa}</strong></span>}
                            </div>
                            {item.descripcion && (
                              <div className="product-description">
                                {item.descripcion}
                              </div>
                            )}
                            {item.instrucciones_especiales && (
                              <div className="product-instructions">
                                <strong>Instrucciones especiales:</strong> {item.instrucciones_especiales}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="sin-productos-mensaje">Este pedido no contiene productos registrados</p>
                    )}
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3>Cambiar Estado</h3>
                  <div className="modal-actions-section">
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
              </>
            ) : (
              <div className="map-modal-content">
                <div className="map-header">
                  <h3>
                    {showRoute ? 'Ruta hacia la ubicación del cliente' : 'Ubicación del cliente'}
                  </h3>
                  <button 
                    className="map-back-button"
                    onClick={handleCloseMap}
                  >
                    Volver a detalles
                  </button>
                </div>
                
                <OrderLocationMap 
                  order={selectedOrder} 
                  showRoute={showRoute}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
