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

  // Función para obtener todos los pedidos
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://server.tiznadodev.com/api/order/orders");
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
      const response = await axios.get(`https://server.tiznadodev.com/api/order/orders/status/${status}`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los pedidos: " + err.message);
      setLoading(false);
      console.error(`Error fetching orders with status ${status}:`, err);
    }
  };

  // Función para actualizar el estado de un pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`https://server.tiznadodev.com/api/order/orders/${orderId}/status`, {
        estado: newStatus
      });
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
    // Aquí podrías implementar la lógica para mostrar un modal con detalles
    console.log("Ver detalles del pedido:", order);
    alert(`Detalles del pedido ${order.id_pedido}\n${JSON.stringify(order, null, 2)}`);
  };
  
  // Función para formatear los productos de un pedido
  const formatProductList = (detalles) => {
    if (!detalles || detalles.length === 0) return "Sin productos";
    return detalles.map(item => item.nombre_producto_original).join(", ");
  };

  // Función para obtener el nombre del cliente
  const getClientName = (order) => {
    if (order.nombre_usuario) return order.nombre_usuario;
    if (order.nombre_invitado) return `${order.nombre_invitado} ${order.apellido_invitado || ''}`;
    return "Cliente sin nombre";
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
                <th>Pedido</th>
                <th>Productos</th>
                <th>Descripción</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Notas</th>
                <th>Método de Pago</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id_pedido}>
                    <td>{order.id_pedido}</td>
                    <td>{formatProductList(order.detalles)}</td>
                    <td>{order.instrucciones_especiales || "Sin especificaciones"}</td>
                    <td>{getClientName(order)}</td>
                    <td>{order.direccion_formateada || "Recogida en tienda"}</td>
                    <td>{order.notas || "Ninguna"}</td>
                    <td>{order.metodo_pago}</td>
                    <td>${parseFloat(order.total).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn__action__details"
                        onClick={() => handleViewDetails(order)}
                      >
                        Ver Detalles
                      </button>
                      {activeFilter !== "cancelado" && (
                        <button 
                          className="btn__action__cancell"
                          onClick={() => handleCancelOrder(order.id_pedido)}
                        >
                          Cancelar
                        </button>
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
    </div>
  );
};

export default OrderManager;
