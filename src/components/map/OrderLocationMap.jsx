import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
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
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const directionsService = useRef(null);

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

  // Obtener ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation && showRoute) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setLocationError('No se pudo obtener la ubicación actual');
          // Usar ubicación por defecto de Mama Mian Pizza
          setCurrentLocation({ lat: 13.6988, lng: -89.2407 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    }
  }, [showRoute]);

  // Calcular ruta cuando se solicite
  useEffect(() => {
    if (isLoaded && showRoute && currentLocation && orderPosition) {
      setIsCalculatingRoute(true);
      
      if (!directionsService.current) {
        directionsService.current = new window.google.maps.DirectionsService();
      }

      directionsService.current.route(
        {
          origin: currentLocation,
          destination: orderPosition,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          setIsCalculatingRoute(false);
          
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            
            // Extraer información de la ruta
            const route = result.routes[0];
            const leg = route.legs[0];
            setRouteInfo({
              distance: leg.distance.text,
              duration: leg.duration.text,
              startAddress: leg.start_address,
              endAddress: leg.end_address
            });
          } else {
            console.error('Error calculando ruta:', status);
            setDirections(null);
            setRouteInfo(null);
          }
        }
      );
    } else if (!showRoute) {
      setDirections(null);
      setRouteInfo(null);
      setIsCalculatingRoute(false);
    }
  }, [isLoaded, showRoute, currentLocation, orderPosition]);

  // Memoizar centro para evitar re-renders
  const mapCenter = useMemo(() => {
    if (showRoute && directions) {
      // Si hay ruta, centrar en el punto medio
      return orderPosition;
    }
    if (orderPosition) return orderPosition;
    return { lat: 13.7, lng: -88.9 }; // Centro por defecto (El Salvador)
  }, [orderPosition, showRoute, directions]);

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

  // Función para abrir Waze con navegación
  const openInWaze = () => {
    if (orderPosition) {
      const url = `https://waze.com/ul?ll=${orderPosition.lat},${orderPosition.lng}&navigate=yes`;
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
      {/* Información de la ruta */}
      {showRoute && (
        <div className="route-info">
          {isCalculatingRoute ? (
            <div className="route-loading">
              <span>🔄 Calculando ruta óptima...</span>
            </div>
          ) : routeInfo ? (
            <div className="route-details">
              <span className="route-distance">📏 {routeInfo.distance}</span>
              <span className="route-duration">⏱️ {routeInfo.duration}</span>
            </div>
          ) : (
            <div className="route-error">
              ⚠️ No se pudo calcular la ruta
            </div>
          )}
          {locationError && (
            <div className="location-warning">
              ⚠️ {locationError}
            </div>
          )}
        </div>
      )}
      
      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={showRoute ? 13 : 15}
          options={mapOptions}
        >
          {/* Renderizar la ruta si está disponible */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#4285F4',
                  strokeWeight: 5,
                  strokeOpacity: 0.8
                }
              }}
            />
          )}

          {/* Marcador para la ubicación actual (solo si no hay ruta) */}
          {!showRoute && currentLocation && (
            <Marker
              position={currentLocation}
              onClick={() => handleMarkerClick({
                id: 'current',
                position: currentLocation,
                title: 'Tu ubicación',
                info: 'Ubicación actual'
              })}
              options={{
                optimized: true,
                zIndex: 1000,
                animation: null,
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(24, 24),
                  anchor: new window.google.maps.Point(12, 12)
                }
              }}
            />
          )}

          {/* Marcador para la ubicación del pedido (solo si no hay ruta) */}
          {!showRoute && (
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
          )}

          {/* Mostrar ventana de información cuando se hace click en un marcador */}
          {selectedMarker && !showRoute && (
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
      
      {/* Botones de acción */}
      <div className="map-actions">
        {showRoute && routeInfo && (
          <div className="route-actions">
            <button 
              onClick={() => {
                const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${orderPosition.lat},${orderPosition.lng}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="navigate-button google-maps"
            >
              🗺️ Navegar con Google Maps
            </button>
            
            <button 
              onClick={openInWaze}
              className="navigate-button waze"
            >
              🚗 Navegar con Waze
            </button>
          </div>
        )}
        
        <button 
          onClick={openInGoogleMaps}
          className="open-maps-button"
        >
          🗺️ Ver en Google Maps
        </button>
      </div>
    </div>
  );
};

export default React.memo(OrderLocationMap);