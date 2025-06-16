import React, { useState } from 'react';
import {
  FaEye,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPizzaSlice,
  FaLayerGroup,
  FaPlay,
  FaTruck,
  FaCheck,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import StatusChangeModal from './StatusChangeModal';
import "../OrderManager.css";


const OrderTable = ({
  orders,
  filteredOrders,
  filtrosAplicados,
  activeFilter,
  loading,
  paginaActual,
  elementosPorPagina,
  getRowBackgroundClass,
  formatDate,
  getClientName,
  getStatusName,
  handleViewDetails,
  changeOrderStatus
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState({
    order: null,
    newStatus: '',
    currentStatus: ''
  });

  const displayOrders = filtrosAplicados ? filteredOrders : orders;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const indexFin = indexInicio + elementosPorPagina;
  const ordersEnPagina = displayOrders.slice(indexInicio, indexFin);

  const getProductIcon = (name) =>
    name.toLowerCase().includes('pizza') ? <FaPizzaSlice className="icon-small product-icon" /> : <FaLayerGroup className="icon-small product-icon" />;

  const handleStatusChange = (order, newStatus) => {
    setStatusChangeData({
      order: order,
      newStatus: newStatus,
      currentStatus: order.estado
    });
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    changeOrderStatus(statusChangeData.order.id_pedido, statusChangeData.newStatus);
    setShowStatusModal(false);
    setStatusChangeData({ order: null, newStatus: '', currentStatus: '' });
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setStatusChangeData({ order: null, newStatus: '', currentStatus: '' });
  };  return (
    <>
      <div className="order__container">
        <div className="order__content">
          <table className="styled-table">
            <thead>
              <tr>
                <th className="th-estado">
                  <div className="header-content">
                    <span>Estado</span>
                  </div>
                </th>
                <th className="th-codigo">
                  <div className="header-content">
                    <FaClock className="header-icon" />
                    <span>Código + Hora</span>
                  </div>
                </th>
                <th className="th-cliente">
                  <div className="header-content">
                    <FaMoneyBillWave className="header-icon" />
                    <span>Cliente y Pago</span>
                  </div>
                </th>
                <th className="th-direccion">
                  <div className="header-content">
                    <FaMapMarkerAlt className="header-icon" />
                    <span>Dirección</span>
                  </div>
                </th>
                <th className="th-productos">
                  <div className="header-content">
                    <FaPizzaSlice className="header-icon" />
                    <span>Productos</span>
                  </div>
                </th>
                <th className="th-total">
                  <div className="header-content">
                    <span>Total</span>
                  </div>
                </th>
                <th className="th-detalles">
                  <div className="header-content">
                    <FaEye className="header-icon" />
                    <span>Ver Detalles</span>
                  </div>
                </th>
                <th className="th-accion">
                  <div className="header-content">
                    <span>Acción</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && ordersEnPagina.length > 0 ? (
                ordersEnPagina.map((order) => (                  <tr key={order.id_pedido} className={`styled-row ${getRowBackgroundClass(order.fecha_pedido)} order-row`}>                    <td className="estado-cell">
                      <div
                        className={`estado-pill estado-${order.estado.replace(' ', '_')}`}
                        style={{
                          backgroundColor:
                            order.estado === 'entregado'
                              ? '#22c55e'  // Verde más oscuro para mejor contraste
                              : order.estado === 'en proceso'
                              ? '#2563eb'  // Azul más oscuro para mejor contraste
                              : order.estado === 'cancelado'
                              ? '#dc2626'  // Rojo más oscuro para mejor contraste
                              : order.estado === 'pendiente'
                              ? '#ea580c'  // Naranja más oscuro para mejor contraste
                              : order.estado === 'en camino'
                              ? '#d97706'  // Amarillo oscuro para mejor contraste
                              : '#ea580c',
                          color: '#ffffff',  // Texto blanco para máximo contraste
                          fontWeight: '700'  // Texto más grueso para mejor legibilidad
                        }}
                      >
                        <span
                          className="estado-dot"
                          style={{
                            backgroundColor:
                              order.estado === 'entregado'
                                ? '#16a34a'  // Verde aún más oscuro para el punto
                                : order.estado === 'en proceso'
                                ? '#1d4ed8'  // Azul aún más oscuro para el punto
                                : order.estado === 'pendiente'
                                ? '#c2410c'  // Naranja aún más oscuro para el punto
                                : order.estado === 'en camino'
                                ? '#b45309'  // Amarillo aún más oscuro para el punto
                                : order.estado === 'cancelado'
                                ? '#b91c1c'  // Rojo aún más oscuro para el punto
                                : '#6b7280'  // Gris por defecto
                          }}
                        ></span>
                        <span className="estado-text">{getStatusName(order.estado)}</span>
                      </div>
                    </td>                    <td className="codigo-cell">
                      <div className="code-time">
                        <div className="code">
                          <span className="code-label">#</span>
                          <span className="code-number">{order.codigo_pedido}</span>
                        </div>
                        <div className="time">
                          <FaClock className="icon-small time-icon" /> 
                          <span className="time-text">{formatDate(order.fecha_pedido).split(' ')[1]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="cliente-cell">
                      <div className="client-pay">
                        <div className="client">
                          <span className="client-name">{getClientName(order)}</span>
                        </div>
                        <div className="pay">
                          <FaMoneyBillWave className="icon-small payment-icon" /> 
                          <span className="payment-method">{order.metodo_pago}</span>
                        </div>
                      </div>
                    </td>
                    <td className="direccion-cell">
                      <div className="address">
                        <FaMapMarkerAlt className="icon-small address-icon" />
                        <span className="address-text">
                          {order.direccion_formateada || 'Recogida en tienda'}
                        </span>
                      </div>
                    </td>
                    <td className="productos-cell">
                      <div className="products">
                        {order.detalles.slice(0, 2).map((prod, idx) => (
                          <div key={idx} className="product-item">
                            <span className="product-icon-wrapper">
                              {getProductIcon(prod.nombre_producto_original)}
                            </span>
                            <span className="product-name">{prod.nombre_producto_original}</span>
                            <span className="product-quantity">({prod.cantidad})</span>
                          </div>
                        ))}
                        {order.detalles.length > 2 && (
                          <div className="more-products">
                            +{order.detalles.length - 2} más...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="total-cell">
                      <div className="total-wrapper">
                        <span className="currency-symbol">$</span>
                        <span className="amount">{parseFloat(order.total).toFixed(2)}</span>
                      </div>
                    </td>                    <td className="detalles-cell">
                      <button
                        className="btn-details enhanced-btn"
                        onClick={() => {
                          console.log("CLICK DETALLES:", order);
                          handleViewDetails(order);
                        }}
                      >
                        <FaEye className="btn-icon" />
                        <span className="btn-text">Ver Detalles</span>
                      </button>
                    </td>                    <td className="accion-cell">
                      <div className="action-buttons">
                        {order.estado === "pendiente" && (
                          <button
                            className="btn-start enhanced-btn action-btn"
                            onClick={() => handleStatusChange(order, 'en proceso')}
                          >
                            <FaPlay className="action-icon" />
                            <span className="btn-text">Iniciar</span>
                          </button>
                        )}
                        {order.estado === "en proceso" && (
                          <button
                            className="btn-dispatch enhanced-btn action-btn"
                            onClick={() => handleStatusChange(order, 'en camino')}
                          >
                            <FaTruck className="action-icon" />
                            <span className="btn-text">Enviar</span>
                          </button>
                        )}
                        {order.estado === "en camino" && (
                          <button
                            className="btn-deliver enhanced-btn action-btn"
                            onClick={() => handleStatusChange(order, 'entregado')}
                          >
                            <FaCheck className="action-icon" />
                            <span className="btn-text">Entregar</span>
                          </button>
                        )}                        {(order.estado === "entregado" || order.estado === "cancelado") && (
                          <div className={`status-final enhanced-status status-${order.estado}`}>
                            {order.estado === "entregado" ? (
                              <>
                                <FaCheckCircle className="status-icon" />
                                <span className="status-text">Entregado</span>
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="status-icon" />
                                <span className="status-text">Cancelado</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))              ) : (
                <tr className="empty-row">
                  <td colSpan="8" className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-icon">
                        {loading ? (
                          <div className="loading-spinner">
                            <div className="spinner"></div>
                          </div>
                        ) : (
                          <FaLayerGroup className="no-data-icon" />
                        )}
                      </div>
                      <div className="empty-text">
                        {loading ? 'Cargando pedidos...' : 'No hay pedidos para mostrar'}
                      </div>
                      {!loading && (
                        <div className="empty-subtitle">
                          Los pedidos aparecerán aquí cuando estén disponibles
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación de cambio de estado */}
      <StatusChangeModal
        show={showStatusModal}
        onClose={closeStatusModal}
        onConfirm={confirmStatusChange}
        order={statusChangeData.order}
        newStatus={statusChangeData.newStatus}
        currentStatus={statusChangeData.currentStatus}
      />
    </>
  );
};

export default OrderTable;
