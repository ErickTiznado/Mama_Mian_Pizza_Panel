import React from 'react';
import { FaEye, FaRegCalendarAlt, FaClock, FaMapMarkerAlt, FaShoppingBag, FaUser, FaMoneyBillWave, FaExclamationTriangle, FaPizzaSlice, FaLayerGroup } from 'react-icons/fa';
import '../OrderManager.css';

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
  formatTiempoTranscurrido,
  getTotalProductos,
  getClientName,
  getStatusName,
  handleViewDetails,
  changeOrderStatus,
  handleCancelOrder
}) => {
  const displayOrders = filtrosAplicados ? filteredOrders : orders;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const indexFin = indexInicio + elementosPorPagina;
  const ordersEnPagina = displayOrders.slice(indexInicio, indexFin);

  const getPaymentMethodStyle = (method) => {
    switch(method?.toLowerCase()) {
      case 'efectivo':
        return { backgroundColor: 'rgba(25, 135, 84, 0.2)', color: '#198754', borderColor: '#198754' };
      case 'tarjeta':
        return { backgroundColor: 'rgba(13, 110, 253, 0.2)', color: '#0d6efd', borderColor: '#0d6efd' };
      case 'transferencia':
        return { backgroundColor: 'rgba(108, 117, 125, 0.2)', color: '#6c757d', borderColor: '#6c757d' };
      default:
        return {};
    }
  };

  const getProductIcon = (productName) => {
    const nameLower = productName.toLowerCase();
    if (nameLower.includes('pizza')) return <FaPizzaSlice className="producto-icon" />;
    return <FaLayerGroup className="producto-icon" />;
  };

  return (
    <div className="order__container">
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
            {!loading && ordersEnPagina.length > 0 ? (
              ordersEnPagina.map((order) => (
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
                          <FaShoppingBag className="icon-small" /> <strong>{getTotalProductos(order.detalles)}</strong> productos
                        </div>
                        <ul className="productos-lista">
                          {order.detalles.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="producto-item">
                              <div className="producto-cantidad">{item.cantidad}x</div>
                              <div className="producto-detalle">
                                <span className="producto-nombre">
                                  {getProductIcon(item.nombre_producto_original)} {item.nombre_producto_original}
                                </span>
                                {item.tamano && <span className="producto-tamano">{item.tamano}</span>}
                              </div>
                            </li>
                          ))}
                          {order.detalles.length > 3 && (
                            <li className="mas-productos">
                              +{order.detalles.length - 3} más
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
                      <div className="cliente-nombre"><FaUser className="icon-small" /> {getClientName(order)}</div>
                      <div className="cliente-telefono">{order.celular_invitado || order.telefono || 'No disponible'}</div>
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
                    <div 
                      className="metodo-pago-badge" 
                      style={getPaymentMethodStyle(order.metodo_pago)}
                    >
                      <FaMoneyBillWave className="icon-small" /> {order.metodo_pago || 'No especificado'}
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
                      {activeFilter !== "cancelado" && order.estado !== "cancelado" && (
                        <button 
                          className="action-primary-button btn__action__cancell"
                          onClick={() => handleCancelOrder(order.id_pedido)}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  {loading ? (
                    <div className="loading-indicator">Cargando pedidos...</div>
                  ) : (
                    <div className="empty-state">
                      <FaExclamationTriangle className="empty-icon" />
                      <div className="empty-message">No hay pedidos para mostrar</div>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
