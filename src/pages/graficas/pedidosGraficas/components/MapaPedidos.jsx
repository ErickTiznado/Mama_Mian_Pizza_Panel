import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import './MapaPedidos.css';

// API Key de Google Maps (la misma que se usa en OrderLocationMap)
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
  styles: [
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#444444' }]
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [{ color: '#f2f2f2' }]
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [{ color: '#3D84B8' }]
    }
  ]
};

// Lista exacta de bibliotecas requeridas
const libraries = ["places"];

const MapaPedidos = () => {
  const [pedidosPorZona, setPedidosPorZona] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZona, setSelectedZona] = useState(null);
  const [map, setMap] = useState(null);
  const [apiStatus, setApiStatus] = useState('');
  const [noPedidosConCoordenadas, setNoPedidosConCoordenadas] = useState(false);
  
  // Centro inicial del mapa (se actualizará con los datos de los pedidos)
  // Centro inicial en El Salvador
  const [center, setCenter] = useState({ lat: 13.7, lng: -88.9 });

  // URL base para la API de pedidos
  const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

  // Cargar la API de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Callback para cuando el mapa está cargado
  const onMapLoad = useCallback((mapInstance) => {
    console.log("Mapa cargado correctamente");
    setMap(mapInstance);
  }, []);

  // Limpiar cuando el componente se desmonte
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Obtener datos de pedidos agrupados por zona
  const fetchPedidosPorZona = async () => {
    try {
      setLoading(true);
      setApiStatus('Conectando con el servidor...');
      
      // Obtener todos los pedidos
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setApiStatus(`Respuesta recibida: ${response.data.length} pedidos encontrados`);
      console.log("Respuesta de la API:", response.data);
      const pedidos = response.data;
      
      // Verificar si hay pedidos
      if (!pedidos || pedidos.length === 0) {
        setError("No se encontraron pedidos en la API");
        setLoading(false);
        return;
      }

      setApiStatus('Procesando datos de pedidos...');
      
      // Mostrar una muestra de los datos para depuración
      if (pedidos.length > 0) {
        console.log("Muestra de pedido para depurar:", {
          id: pedidos[0].id_pedido,
          latitud: pedidos[0].latitud,
          longitud: pedidos[0].longitud,
          direccion: pedidos[0].direccion_formateada || pedidos[0].direccion
        });
      }
      
      // Agrupar pedidos que tengan coordenadas válidas
      const pedidosConCoordenadas = pedidos.filter(pedido => {
        // Verificar que el pedido tenga latitud y longitud válidas
        return pedido.latitud && pedido.longitud && 
               !isNaN(parseFloat(pedido.latitud)) && 
               !isNaN(parseFloat(pedido.longitud));
      });
      
      console.log("Pedidos con coordenadas válidas:", pedidosConCoordenadas.length);
      
      if (pedidosConCoordenadas.length === 0) {
        setNoPedidosConCoordenadas(true);
        setApiStatus('No se encontraron pedidos con coordenadas válidas');
        setLoading(false);
        return;
      }
      
      // Agrupar por zona geográfica (usando la dirección como identificador)
      const zonasPedidos = {};
      
      pedidosConCoordenadas.forEach(pedido => {
        // Usar la dirección como clave para agrupar pedidos cercanos
        const claveZona = pedido.direccion_formateada || pedido.direccion || `lat:${pedido.latitud},lng:${pedido.longitud}`;
        
        if (!zonasPedidos[claveZona]) {
          zonasPedidos[claveZona] = {
            codigoPostal: pedido.codigo_postal || "N/A",
            nombre: pedido.direccion_formateada || pedido.direccion || "Ubicación",
            latitud: parseFloat(pedido.latitud),
            longitud: parseFloat(pedido.longitud),
            pedidos: 0,
            detalles: []
          };
        }
        
        zonasPedidos[claveZona].pedidos++;
        
        // Obtener el nombre del cliente
        const nombreCliente = pedido.nombre_cliente ? 
          `${pedido.nombre_cliente} ${pedido.apellido_cliente || ''}`.trim() : 
          pedido.nombre_invitado ? 
            `${pedido.nombre_invitado} ${pedido.apellido_invitado || ''}`.trim() : 
            'Cliente';
        
        zonasPedidos[claveZona].detalles.push({
          id: pedido.id_pedido,
          codigo: pedido.codigo_pedido || `ORD-${pedido.id_pedido}`,
          cliente: nombreCliente,
          total: parseFloat(pedido.total || 0).toFixed(2),
          fecha: new Date(pedido.fecha_pedido).toLocaleDateString()
        });
      });
      
      // Convertir a array y ordenar por cantidad de pedidos
      const zonas = Object.values(zonasPedidos).sort((a, b) => b.pedidos - a.pedidos);
      console.log("Zonas agrupadas:", zonas);
      
      if (zonas.length > 0) {
        // Centrar el mapa en la zona con más pedidos
        setCenter({ lat: zonas[0].latitud, lng: zonas[0].longitud });
      }
      
      setApiStatus(`Datos procesados: ${zonas.length} zonas identificadas`);
      setPedidosPorZona(zonas);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los datos de zonas:", err);
      setError(`Error en la API: ${err.message}`);
      setApiStatus(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    if (isLoaded) {
      fetchPedidosPorZona();
    }
  }, [isLoaded]);

  // Función para calcular el radio del círculo basado en la cantidad de pedidos
  const calcularRadio = (pedidos) => {
    const minRadius = 200;
    const maxRadius = 800;
    const maxPedidos = Math.max(...pedidosPorZona.map(z => z.pedidos), 1);
    return minRadius + (pedidos / maxPedidos) * (maxRadius - minRadius);
  };

  // Función para determinar el color basado en la cantidad de pedidos
  const calcularColor = (pedidos) => {
    const maxPedidos = Math.max(...pedidosPorZona.map(z => z.pedidos), 1);
    const ratio = pedidos / maxPedidos;
    
    if (ratio > 0.8) return 'rgba(153, 27, 27, 0.7)'; // color-brand-red
    if (ratio > 0.6) return 'rgba(254, 178, 72, 0.7)'; // color-brand-yellow
    if (ratio > 0.4) return 'rgba(255, 193, 7, 0.7)'; // color-warning
    if (ratio > 0.2) return 'rgba(76, 175, 80, 0.7)'; // color-success
    return 'rgba(61, 132, 184, 0.7)'; // color-accent
  };

  const handleCircleClick = (zona) => {
    setSelectedZona(zona);
  };

  const handleInfoWindowClose = () => {
    setSelectedZona(null);
  };

  // Si hay un error al cargar Google Maps, mostrar mensaje
  if (loadError) {
    console.error("Error al cargar Google Maps:", loadError);
    return <div className="mapa-error-container">Error al cargar Google Maps: {loadError.message}</div>;
  }

  return (
    <div className="mapa-pedidos-container">
      <h3>Mapa de Pedidos por Zona</h3>
      
      {!isLoaded ? (
        <div className="loading-indicator">Cargando Google Maps API...</div>
      ) : loading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <div className="loading-status">{apiStatus}</div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : noPedidosConCoordenadas ? (
        <div className="no-data-message">
          <p>No se encontraron pedidos con coordenadas geográficas válidas.</p>
          <p>Para que el mapa muestre datos, los pedidos deben incluir:</p>
          <ul>
            <li>Dirección</li>
            <li>Latitud</li>
            <li>Longitud</li>
          </ul>
        </div>
      ) : pedidosPorZona.length === 0 ? (
        <div className="no-data-message">No hay datos de pedidos para mostrar en el mapa</div>
      ) : (
        <>
          <div className="mapa-container">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={9}
              options={mapOptions}
              onLoad={onMapLoad}
              onUnmount={onUnmount}
            >
              {pedidosPorZona.map((zona, index) => (
                <Circle
                  key={index}
                  center={{ lat: zona.latitud, lng: zona.longitud }}
                  radius={calcularRadio(zona.pedidos)}
                  options={{
                    strokeColor: '#333333',
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: calcularColor(zona.pedidos),
                    fillOpacity: 0.6,
                    clickable: true
                  }}
                  onClick={() => handleCircleClick(zona)}
                />
              ))}

              {selectedZona && (
                <InfoWindow
                  position={{ lat: selectedZona.latitud, lng: selectedZona.longitud }}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div className="popup-content">
                    <h4>{selectedZona.nombre}</h4>
                    {selectedZona.codigoPostal !== "N/A" && (
                      <p><strong>Código postal:</strong> {selectedZona.codigoPostal}</p>
                    )}
                    <p><strong>Total pedidos:</strong> {selectedZona.pedidos}</p>
                    {selectedZona.detalles && selectedZona.detalles.length > 0 && (
                      <div className="pedidos-detalles">
                        <p><strong>Últimos pedidos:</strong></p>
                        <ul className="pedidos-lista">
                          {selectedZona.detalles.slice(0, 3).map((detalle, idx) => (
                            <li key={idx}>
                              <strong>{detalle.codigo}</strong>: {detalle.cliente} - ${detalle.total} ({detalle.fecha})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
          
          <div className="zonas-populares">
            <h4>Zonas más populares</h4>
            <div className="zonas-list">
              {pedidosPorZona.slice(0, 5).map((zona, index) => (
                <div key={index} className="zona-item">
                  <div className="zona-color" style={{ backgroundColor: calcularColor(zona.pedidos) }}></div>
                  <div className="zona-info">
                    <div className="zona-nombre">{zona.nombre}</div>
                    <div className="zona-pedidos">{zona.pedidos} pedidos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapaPedidos;