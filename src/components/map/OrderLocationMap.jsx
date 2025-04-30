import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import './OrderLocationMap.css';

// API Key de Google Maps
const GOOGLE_MAPS_API_KEY = 'AIzaSyDAiO05_RG1ycHFVfvcUyCEG6g4pfWQ8VY';

// Opciones por defecto para el mapa
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Opciones avanzadas para el mapa
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

const libraries = ['places', 'directions'];

const OrderLocationMap = ({ order, showRoute = false }) => {
  const [map, setMap] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convertir latitud y longitud del pedido a formato adecuado para Google Maps y memoizar
  const orderPosition = useMemo(() => {
    if (order && order.latitud && order.longitud) {
      return { 
        lat: parseFloat(order.latitud), 
        lng: parseFloat(order.longitud) 
      };
    }
    return null;
  }, [order?.latitud, order?.longitud]);

  // Cargar la API de Google Maps con configuración mejorada
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    preventGoogleFontsLoading: true // Mejora el rendimiento evitando la carga de fuentes
  });

  // Callback para cuando el mapa está completamente cargado
  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Memoizar centro para evitar re-renders
  const mapCenter = useMemo(() => {
    if (orderPosition) return orderPosition;
    return { lat: 13.7, lng: -88.9 }; // Centro por defecto (El Salvador)
  }, [orderPosition]);

  // Obtener la posición actual del usuario una sola vez al mostrar la ruta
  useEffect(() => {
    if (showRoute && isLoaded && !userPosition) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserPosition(pos);
          setLoading(false);
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err);
          setError("No se pudo obtener tu ubicación actual. Por favor, activa el GPS y recarga la página.");
          setLoading(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, [showRoute, isLoaded, userPosition]);

  // Calcular ruta cuando tengamos la posición del usuario y del pedido
  useEffect(() => {
    if (showRoute && isLoaded && userPosition && orderPosition && map && !directions) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userPosition,
          destination: orderPosition,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
          provideRouteAlternatives: false,
          avoidTolls: false,
          avoidHighways: false,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            // Ajustar el zoom para que se vea toda la ruta
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(userPosition);
            bounds.extend(orderPosition);
            map.fitBounds(bounds);
          } else {
            console.error(`Error obteniendo direcciones: ${status}`);
            setError(`No se pudo calcular la ruta: ${status}`);
          }
        }
      );
    }
  }, [showRoute, isLoaded, userPosition, orderPosition, map, directions]);

  // Manejador para hacer click en un marcador
  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

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
      {loading ? (
        <div className="map-loading">Obteniendo ubicación...</div>
      ) : error ? (
        <div className="map-error-container">{error}</div>
      ) : (
        <div className="map-wrapper">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
            options={mapOptions}
            onLoad={onMapLoad}
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
              // Mejorar estabilidad con opciones optimizadas
              options={{
                optimized: true,
                zIndex: 999,
                animation: null // Desactivar animación
              }}
            />

            {/* Marcador para la ubicación del usuario (si estamos mostrando la ruta) */}
            {showRoute && userPosition && (
              <Marker
                position={userPosition}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                }}
                onClick={() => handleMarkerClick({
                  id: 'user',
                  position: userPosition,
                  title: 'Tu ubicación actual',
                  info: 'Esta es tu posición actual'
                })}
                // Mejorar estabilidad con opciones optimizadas
                options={{
                  optimized: true,
                  zIndex: 998,
                  animation: null // Desactivar animación
                }}
              />
            )}

            {/* Mostrar ventana de información cuando se hace click en un marcador */}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
                options={{ disableAutoPan: true }} // Evitar que el mapa salte al abrir InfoWindow
              >
                <div className="info-window">
                  <h3>{selectedMarker.title}</h3>
                  <p>{selectedMarker.info}</p>
                </div>
              </InfoWindow>
            )}

            {/* Mostrar ruta si estamos en modo de ruta */}
            {showRoute && directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true, // Usar nuestros propios marcadores
                  preserveViewport: true, // No cambiar el viewport automáticamente
                  polylineOptions: {
                    strokeColor: '#1a73e8',
                    strokeWeight: 5,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>
      )}
      
      {showRoute && directions && (
        <div className="map-instructions">
          <div className="route-summary">
            <h3>Resumen de la ruta:</h3>
            <p>
              <strong>Distancia:</strong> {directions.routes[0].legs[0].distance.text}
            </p>
            <p>
              <strong>Tiempo estimado:</strong> {directions.routes[0].legs[0].duration.text}
            </p>
          </div>
          
          <div className="route-steps">
            <h3>Indicaciones:</h3>
            <ol>
              {directions.routes[0].legs[0].steps.slice(0, 5).map((step, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step.instructions }} />
              ))}
              {directions.routes[0].legs[0].steps.length > 5 && (
                <li>... y {directions.routes[0].legs[0].steps.length - 5} indicaciones más</li>
              )}
            </ol>
          </div>
          
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${orderPosition.lat},${orderPosition.lng}&travelmode=driving`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="open-maps-button"
          >
            Abrir en Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default React.memo(OrderLocationMap);