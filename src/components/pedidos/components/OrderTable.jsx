import React from 'react';
import {
  FaEye,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPizzaSlice,
  FaLayerGroup
} from 'react-icons/fa';
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
  const displayOrders = filtrosAplicados ? filteredOrders : orders;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const indexFin = indexInicio + elementosPorPagina;
  const ordersEnPagina = displayOrders.slice(indexInicio, indexFin);

  const getProductIcon = (name) =>
    name.toLowerCase().includes('pizza') ? <FaPizzaSlice className="icon-small" /> : <FaLayerGroup className="icon-small" />;

  return (
    <div className="order__container">
      <div className="order__content">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Código + Hora</th>
              <th>Cliente y Pago</th>
              <th>Dirección</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Ver Detalles</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {!loading && ordersEnPagina.length > 0 ? (
              ordersEnPagina.map((order) => (
                <tr key={order.id_pedido} className="styled-row">
                  <td className="estado-cell">
                    <div className={`estado-pill estado-${order.estado.toLowerCase()}`}>
                      <span className="estado-dot"></span>
                      <span className="estado-text">{getStatusName(order.estado)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="code-time">
                      <div className="code">{order.codigo_pedido}</div>
                      <div className="time">
                        <FaClock className="icon-small" /> {formatDate(order.fecha_pedido).split(' ')[1]}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="client-pay">
                      <div className="client">{getClientName(order)}</div>
                      <div className="pay">
                        <FaMoneyBillWave className="icon-small" /> {order.metodo_pago}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="address">
                      <FaMapMarkerAlt className="icon-small" />
                      {order.direccion_formateada || 'Recogida en tienda'}
                    </div>
                  </td>
                  <td>
                    <div className="products">
                      {order.detalles.slice(0, 2).map((prod, idx) => (
                        <div key={idx} className="product-item">
                          {getProductIcon(prod.nombre_producto_original)} {prod.nombre_producto_original} ({prod.cantidad})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="total-cell">
                    ${parseFloat(order.total).toFixed(2)}
                  </td>
                  <td>
                    <button
  className="btn-details"
  onClick={() => {
    console.log("CLICK DETALLES:", order);
    handleViewDetails(order);
  }}
>
  <FaEye /> Ver Detalles
</button>

                  </td>
                  <td>
                    <button
                      className="btn-start"
                      onClick={() => changeOrderStatus(order.id_pedido, 'en_proceso')}
                    >
                      ▶ Iniciar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? 'Cargando pedidos...' : 'No hay pedidos para mostrar'}
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
