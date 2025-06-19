import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import './OrderLocationMap.css';

// Opciones por defecto para el mapa
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
  // Reducir la frecuencia de actualización para mejorar el rendimiento
  refreshInterval: 0,
  // Deshabilitar animaciones que puedan causar saltos
  animatedZoom: false
};

const OrderLocationMap = ({ order, showRoute = false }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Convertir latitud y longitud del pedido a formato adecuado para Google Maps y memoizar
  const orderPosition = useMemo(() => {
    if (order && order.latitud && order.longitud) {
      return { 
        lat: parseFloat(order.latitud), 
        lng: parseFloat(order.longitud) 
      };
    }
    return null;
  }, [order?.latitud, order?.longitud]);  // Cargar la API de Google Maps con el hook compartido
  const { isLoaded, loadError } = useGoogleMaps();

  // Memoizar centro para evitar re-renders
  const mapCenter = useMemo(() => {
    if (orderPosition) return orderPosition;
    return { lat: 13.7, lng: -88.9 }; // Centro por defecto (El Salvador)
  }, [orderPosition]);

  // Manejador para hacer click en un marcador
  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  // Función para abrir Google Maps con navegación
  const openInGoogleMaps = () => {
    if (orderPosition) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${orderPosition.lat},${orderPosition.lng}&travelmode=driving`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Si hay un error al cargar la API de Google Maps
  if (loadError) {
    return <div className="map-error-container">Error al cargar Google Maps: {loadError.message}</div>;
  }

  // Si la API aún no se ha cargado
  if (!isLoaded) {
    return <div className="map-loading">Cargando Google Maps...</div>;
  }

  // Si no hay posición de pedido, mostrar mensaje
  if (!orderPosition) {
    return <div className="map-error-container">No hay coordenadas disponibles para este pedido</div>;
  }
  return (
    <div className="order-map-container">
      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          options={mapOptions}
        >
          {/* Marcador para la ubicación del pedido */}
          <Marker
            position={orderPosition}
            onClick={() => handleMarkerClick({
              id: 'destination',
              position: orderPosition,
              title: 'Punto de entrega',
              info: order.direccion_formateada || order.direccion
            })}
            options={{
              optimized: true,
              zIndex: 999,
              animation: null
            }}
          />

          {/* Mostrar ventana de información cuando se hace click en un marcador */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
              options={{ disableAutoPan: true }}
            >
              <div className="info-window">
                <h3>{selectedMarker.title}</h3>
                <p>{selectedMarker.info}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      
      {/* Botón para abrir en Google Maps */}
      <div className="map-actions">
        <button 
          onClick={openInGoogleMaps}
          className="open-maps-button"
        >
          🗺️ Abrir en Google Maps
        </button>
      </div>
    </div>
  );
};

export default React.memo(OrderLocationMap);