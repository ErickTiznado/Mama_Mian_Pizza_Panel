import React from 'react';
import { FaMapMarkerAlt, FaMapMarked } from 'react-icons/fa';
import OrderLocationMap from '../../map/OrderLocationMap';
import '../OrderManager.css';

const OrderDetailModal = ({
  showModal,
  selectedOrder,
  showMap,
  showRoute,
  closeModal,
  handleShowLocationMap,
  handleShowRoute,
  handleCloseMap,
  formatDate,
  getClientName,
  getStatusName,
  changeOrderStatus,
  handleCancelOrder
}) => {
  if (!showModal || !selectedOrder) return null;

  return (
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
  );
};

export default OrderDetailModal;