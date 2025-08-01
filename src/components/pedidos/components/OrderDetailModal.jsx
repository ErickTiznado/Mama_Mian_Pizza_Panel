import React, { useState, useEffect } from 'react';
import './OrderDetailModal.css';
import {
  FaTruck,
  FaWhatsapp,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserAlt,
  FaLocationArrow,
  FaRoute,
  FaTimes
} from 'react-icons/fa';
import OrderLocationMap from '../../map/OrderLocationMap';

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
  changeOrderStatus,
  getStatusName
}) => {
  const [liveAddress, setLiveAddress] = useState('');
  useEffect(() => {
    const getReverseAddress = async () => {
      const lat = selectedOrder?.latitud || selectedOrder?.lat || '13.6988';
      const lng = selectedOrder?.longitud || selectedOrder?.lng || '-89.2407';

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        setLiveAddress(data.display_name || 'Dirección no disponible');
      } catch (error) {
        console.error('Error obteniendo dirección:', error);
        setLiveAddress('Dirección no disponible');
      }
    };

    if (showModal && (selectedOrder?.latitud || selectedOrder?.lat) && (selectedOrder?.longitud || selectedOrder?.lng)) {
      getReverseAddress();
    }
  }, [selectedOrder, showModal]);

  if (!showModal || !selectedOrder) return null;

  return (
    <div className="detalle-pedido-overlay">
      <div className="detalle-pedido-panel">
        <button className="close-button" onClick={closeModal}>×</button>

        <h2 className="detalle-title">
          Detalles del Pedido <span>{selectedOrder.codigo_pedido}</span>
        </h2>

        <div className="detalle-grid">
          {/* COLUMNA 1 */}
          <div className="grid-col">
            <div className="detalle-card">
              <h3>📋 Información del Pedido</h3>
              <p><strong>Código:</strong> {selectedOrder.codigo_pedido}</p>
              <p><strong>Fecha y Hora:</strong> {formatDate(selectedOrder.fecha_pedido)}</p>
              <p>
                <strong>Estado:</strong>
                <span className={`estado-pill estado-${selectedOrder.estado}`}>
                  <span className="estado-dot" /> {getStatusName(selectedOrder.estado)}
                </span>
              </p>
              <p>
                <strong>Tipo:</strong>{' '}
                <FaTruck className="icon-small" style={{ marginRight: '4px', color: '#facc15' }} />
                {selectedOrder.tipo_envio === 'entrega' ? 'Entrega' : 'Recogida'}
              </p>
            </div>

            <div className="detalle-card">
              <h3>🙍 Información del Cliente</h3>
              <p><strong>Nombre:</strong> {getClientName(selectedOrder)}</p>
              <p><strong>Teléfono:</strong> {selectedOrder.telefono}</p>
              <p><strong>Pago:</strong> {selectedOrder.metodo_pago}</p>
              <p><strong>Dirección:</strong> {selectedOrder.direccion_formateada}</p>              <p><strong>Ubicación Cliente:</strong> 📍 En tiempo real</p>
            </div>

</div>

          {/* COLUMNA 2 */}
          <div className="grid-col">
            {/* Ubicación en Tiempo Real */}
            <div className="detalle-card">
              <h3>📍 Ubicación en Tiempo Real</h3>
              <div className="card-ubicacion">
                <div className="icono-ubicacion-animado">
                  <FaMapMarkerAlt />
                </div>                <h4>Destino: {liveAddress}</h4>

                <div className="label-coordenadas-card">
                  <div className="icono-cliente-card">
                    <FaUserAlt />
                    <span>Cliente</span>
                  </div>
                  <div className="coords">
                    Ubicación verificada
                  </div>
                </div>

                {/* Botones para mapa */}
                <div className="map-controls">
                  <button 
                    className="btn-mapa"
                    onClick={handleShowLocationMap}
                  >
                    <FaMapMarkerAlt className="icono-btn" />
                    Ver Ubicación
                  </button>
                  <button 
                    className="btn-ruta"
                    onClick={handleShowRoute}
                  >
                    <FaRoute className="icono-btn" />
                    {showRoute ? 'Ocultar Ruta' : 'Obtener Ruta'}
                  </button>
                </div>

                {/* Mapa de ubicación */}
                {showMap && (
                  <div className="map-container">
                    <div className="map-header">
                      <h4>
                        {showRoute ? '🗺️ Ruta de Entrega' : '📍 Ubicación del Cliente'}
                      </h4>
                      <button 
                        className="map-close-btn"
                        onClick={handleCloseMap}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <OrderLocationMap 
                      order={{
                        ...selectedOrder,
                        latitud: selectedOrder.latitud || selectedOrder.lat,
                        longitud: selectedOrder.longitud || selectedOrder.lng
                      }}
                      showRoute={showRoute}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA 3 */}
          <div className="grid-col">
            <div className="detalle-card comunicacion-card">
              <h3><FaMobileAlt style={{ marginRight: '8px' }} /> Comunicación</h3>

              <button className="btn-wsp-cliente">
                <FaWhatsapp className="icono-btn" /> WhatsApp al Cliente
              </button>

              <button className="btn-call-cliente">
                <FaPhoneAlt className="icono-btn" /> Llamar al Cliente
              </button>              <button 
                className="btn-ver-ubicacion-final"
                onClick={handleShowLocationMap}
              >
                <FaLocationArrow className="icono-btn" /> Ver Ubicación del Cliente
              </button>
            </div>
            
           <div className="detalle-card productos-card">
  <h3>🛍️ Productos</h3>

  {selectedOrder.detalles.map((item, idx) => (
    <div key={idx} className="producto-line">
      <div className="producto-info">
        <span className="producto-cantidad-nombre">
          {item.cantidad}x {item.emoji || '🧀'} {item.nombre_producto_original}
        </span>
        <span className="producto-precio">${parseFloat(item.precio_unitario).toFixed(2)}</span>
      </div>
      {item.tamano && <div className="producto-tamano-text">({item.tamano})</div>}
    </div>
  ))}

  <hr />

  <div className="producto-totales-resumen">
    <div className="linea-totales">
      <span>Subtotal:</span>
      <span>${parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</span>
    </div>
    <div className="linea-totales">
      <span>Impuestos:</span>
      <span>${parseFloat(selectedOrder.impuestos || 0).toFixed(2)}</span>
    </div>
    <div className="linea-totales total-final">
      <strong>Total:</strong>
      <strong>${parseFloat(selectedOrder.total || 0).toFixed(2)}</strong>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
