import React, { useState, useEffect } from "react";
import "./OrderManager.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


// Importación de componentes modulares
import FilterBar from '../common/FilterBar'; // Reemplazamos OrderFilterRibbon por nuestro nuevo componente
import OrderTable from './components/OrderTable';
import OrderDetailModal from './components/OrderDetailModal';
// Importar el nuevo componente OrderTabs en lugar de OrderFilters
import OrderTabs from './components/OrderTabs';
import NewOrderModal from './components/NewOrderModal';
import CustomAlert from '../common/CustomAlert';
import ConnectionAlert from '../common/ConnectionAlert/ConnectionAlert';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import { useNotifications } from '../../hooks/useNotification.jsx';
import { useOrderNotificationMonitor, useConnectionMonitor } from '../../hooks/useNotificationMonitor.js';

const OrderManager = () => {
  // Custom Alert Hook
  const { showAlert, alertConfig, confirm } = useCustomAlert();
  
  // Hook para notificaciones
  const { fetchNoLeidas, connectionStatus } = useNotifications();
  
  // Hook para monitorear notificaciones de pedidos específicamente
  const orderNotificationMonitor = useOrderNotificationMonitor(
    // Callback para nuevos pedidos
    (notification) => {
      console.log('Nuevo pedido recibido:', notification);
      // Refrescar la lista de pedidos automáticamente
      fetchAllOrders();
      // Mostrar alerta de nuevo pedido
      showAlert({
        type: 'info',
        title: 'Nuevo Pedido',
        message: `Se ha recibido un nuevo pedido: ${notification.formattedMessage || 'Verifique la lista de pedidos'}`
      });
    },
    // Callback para actualizaciones de pedidos
    (notification) => {
      console.log('Pedido actualizado:', notification);
      // Refrescar la lista de pedidos
      fetchAllOrders();
    }
  );
  
  // Estados principales
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  
  // Estado para controlar visibilidad de filtros y contador
  const [showFilters, setShowFilters] = useState(true);
  
  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSemana, setFiltroSemana] = useState('todas');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  // Base URL para la API
  const API_BASE_URL = "https://api.mamamianpizza.com/api/orders";

  // Cargar todos los pedidos al montar el componente
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Actualizar filtros cuando cambia el término de búsqueda o periodo
  useEffect(() => {
    if (filtrosAplicados) {
      aplicarFiltros();
    }
  }, [searchTerm, filtroSemana, filtrosAplicados, orders]);

  // Función para obtener todos los pedidos
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/orders`);
      console.log("Respuesta de la API (todos los pedidos):", response.data);
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
      const response = await axios.get(`${API_BASE_URL}/orders/status/${status}`);
      console.log(`Respuesta de la API (pedidos con estado ${status}):`, response.data);
      setOrders(response.data);      setPaginaActual(1); // Reset de paginación al cambiar filtros
      setLoading(false);
      
      // Eliminamos la creación automática de notificaciones para evitar duplicados
    } catch (err) {
      setLoading(false);
      setError("Error al cargar los pedidos: " + err.message);
      console.error("Error fetching orders:", err);
    }
  };
  
  // Función para actualizar el estado de un pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setError(null);
      const response = await axios.put(`https://api.mamamianpizza.com/api/orders/orders/${orderId}/status`, {
        estado: newStatus
      });
      console.log("Respuesta de actualización de estado:", response.data);
      
      // Si la orden seleccionada es la que se actualizó, actualizar su estado en el modal
      if (selectedOrder && selectedOrder.id_pedido === orderId) {
        setSelectedOrder({...selectedOrder, estado: newStatus});
      }
      
      // Refrescar los pedidos después de actualizar el estado
      fetchAllOrders();
      
      // Actualizar contador de notificaciones para reflejar cambios
      setTimeout(() => {
        fetchNoLeidas();
      }, 1000); // Delay para dar tiempo al backend de procesar

      console.log("Estado del pedido actualizado correctamente");
    } catch (err) {
      setError("Error al actualizar el estado del pedido: " + err.message);
      console.error("Error updating order status:", err);
    }
  };

  // Función para manejar el cambio de filtro
  const handleFilterChange = (status) => {
    setActiveFilter(status);
    // Remove API call, we'll filter locally
    setFiltrosAplicados(false);
    setSearchTerm('');
    setFiltroSemana('todas');
    setPaginaActual(1);
  };

  // Función para cancelar un pedido
  const handleCancelOrder = async (orderId) => {
    confirm({
      type: 'warning',
      title: 'Cancelar Pedido',
      message: '¿Estás seguro que deseas cancelar este pedido?',
      confirmText: 'Sí, cancelar',
      cancelText: 'No, mantener',
      onConfirm: async () => {
        try {
          await updateOrderStatus(orderId, "cancelado");
        } catch (err) {
          console.error("Error canceling order:", err);
        }
      }
    });
  };

  // Función para ver detalles de un pedido
  // Función para ver detalles de un pedido
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  
  // Funciones para el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setShowMap(false);
    setShowRoute(false);
  };
  
  const formatProductList = (detalles) => {
    if (!detalles || detalles.length === 0) return "Sin productos";
    return detalles.map(item => item.nombre_producto_original).join(", ");
  };

  // Función para obtener el nombre del cliente
  const getClientName = (order) => {
    if (order.nombre_usuario) return order.nombre_usuario;
    if (order.nombre_invitado) return `${order.nombre_invitado} ${order.apellido_invitado || ''}`.trim();
    if (order.nombre_cliente) return `${order.nombre_cliente} ${order.apellido_cliente || ''}`.trim();
    return "Cliente sin nombre";
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Función para cambiar el estado de un pedido
  const changeOrderStatus = (orderId, newStatus) => {
    confirm({
      type: 'confirm',
      title: 'Cambiar Estado',
      message: `¿Cambiar estado del pedido a ${getStatusName(newStatus)}?`,
      confirmText: 'Sí, cambiar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        updateOrderStatus(orderId, newStatus);
      }
    });
  };
  // Función para obtener el nombre del estado
  const getStatusName = (status) => {
    const statusMap = {
      "pendiente": "Pendiente",
      "en proceso": "En Proceso",
      "en camino": "En Camino",
      "entregado": "Entregado",
      "cancelado": "Cancelado"
    };
    return statusMap[status] || status;
  };

  // Función para obtener el color de fondo según el tiempo transcurrido
  const getRowBackgroundClass = (fechaCreacion) => {
    if (!fechaCreacion) return "";
    
    const fechaPedido = new Date(fechaCreacion);
    const ahora = new Date();
    const tiempoTranscurrido = ahora - fechaPedido; // milisegundos
    const minutosTranscurridos = tiempoTranscurrido / (1000 * 60);

    if (minutosTranscurridos > 30) return "pedido-urgente";
    if (minutosTranscurridos > 15) return "pedido-alerta";
    return "";
  };

  // Función para formatear tiempo transcurrido
  const formatTiempoTranscurrido = (fechaCreacion) => {
    if (!fechaCreacion) return "N/A";
    
    const fechaPedido = new Date(fechaCreacion);
    const ahora = new Date();
    const tiempoTranscurrido = ahora - fechaPedido; // milisegundos
    
    const minutos = Math.floor(tiempoTranscurrido / (1000 * 60));
    
    if (minutos < 60) {
      return `${minutos} min`;
    } else {
      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;
      return `${horas}h ${minutosRestantes}m`;
    }
  };

  // Función para contar el total de productos en un pedido
  const getTotalProductos = (detalles) => {
    if (!detalles || detalles.length === 0) return 0;
    return detalles.reduce((total, item) => total + parseInt(item.cantidad), 0);
  };

  const [showNewOrderModal, setNewOrderModal] = useState(false);
  
  
  // Funciones para el mapa
  const handleShowLocationMap = () => {
    setShowMap(true);
    setShowRoute(false);
  };

  const handleShowRoute = () => {
    setShowRoute(true);
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setShowRoute(false);
  };


  const handleNerOrderModal = () => {
    setNewOrderModal(true);
  }

  const closeModalNewOrder = () => {
    setNewOrderModal(false);
  }
  
  // Aplicar filtros avanzados (semana y búsqueda)
  const aplicarFiltros = () => {
    // Start with orders filtered by active status
    let baseOrders = activeFilter === "todos" ? orders : orders.filter(order => order.estado === activeFilter);
    
    // Filtrar por término de búsqueda
    let resultados = baseOrders.filter(order => {
      // Buscar en código de pedido
      const codigoMatch = order.codigo_pedido?.toLowerCase().includes(searchTerm.toLowerCase());
      // Buscar en nombre de cliente
      const nombreMatch = getClientName(order).toLowerCase().includes(searchTerm.toLowerCase());
      // Buscar en dirección
      const direccionMatch = order.direccion_formateada?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return !searchTerm || codigoMatch || nombreMatch || direccionMatch;
    });
    
    // Filtrar por semana
    if (filtroSemana !== 'todas') {
      const hoy = new Date();
      let fechaInicio, fechaFin;
      
      switch (filtroSemana) {
        case 'actual':
          // Inicio de esta semana (lunes)
          fechaInicio = new Date(hoy);
          fechaInicio.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1));
          fechaInicio.setHours(0, 0, 0, 0);
          
          // Fin de esta semana (domingo)
          fechaFin = new Date(fechaInicio);
          fechaFin.setDate(fechaInicio.getDate() + 6);
          fechaFin.setHours(23, 59, 59, 999);
          break;
          
        case 'anterior':
          // Inicio de la semana anterior (lunes)
          fechaInicio = new Date(hoy);
          fechaInicio.setDate(hoy.getDate() - hoy.getDay() - 6);
          fechaInicio.setHours(0, 0, 0, 0);
          
          // Fin de la semana anterior (domingo)
          fechaFin = new Date(fechaInicio);
          fechaFin.setDate(fechaFin.getDate() + 6);
          fechaFin.setHours(23, 59, 59, 999);
          break;
          
        case 'ultimoMes':
          // Hace 30 días
          fechaInicio = new Date(hoy);
          fechaInicio.setDate(hoy.getDate() - 30);
          fechaInicio.setHours(0, 0, 0, 0);
          
          fechaFin = new Date(hoy);
          fechaFin.setHours(23, 59, 59, 999);
          break;
          
        default:
          break;
      }
      
      if (fechaInicio && fechaFin) {
        resultados = resultados.filter(order => {
          const fechaPedido = order.fecha_pedido ? new Date(order.fecha_pedido) : null;
          return fechaPedido && fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
        });
      }
    }
    
    setPaginaActual(1); // Reset de paginación al aplicar filtros
    setFilteredOrders(resultados);
  };

  // Resetear filtros
  const resetearFiltros = () => {
    setSearchTerm('');
    setFiltroSemana('todas');
    setFiltrosAplicados(false);
    setPaginaActual(1);
    // Reload all orders when resetting filters
    fetchAllOrders();
  };  // Calcular resultados totales para mostrar en contador y filtrar por estado activo
  const filteredOrdersByStatus = activeFilter === "todos" ? orders : orders.filter(order => order.estado === activeFilter);
  const displayOrdersForTable = filtrosAplicados ? filteredOrders : filteredOrdersByStatus;
  const totalPedidos = displayOrdersForTable.length;
  
  const counts = {
  todos: orders.length,
  pendiente: orders.filter(p => p.estado === "pendiente").length,
  "en proceso": orders.filter(p => p.estado === "en proceso").length,
  "en camino": orders.filter(p => p.estado === "en camino").length,
  entregado: orders.filter(p => p.estado === "entregado").length,
  cancelado: orders.filter(p => p.estado === "cancelado").length
};


  return (
    <div className="order_container">
      {/* Panel principal con estilo similar a AgregarContenido */}
      <div className="order_panel">
        <div className="order_header">
          <h1 className="titulo-pedidos">Gestión de Pedidos</h1>
          <div className="header-controls">
            {/* Indicador de estado de notificaciones */}
            <div className={`notification-status ${connectionStatus}`}>
              <div className="status-dot"></div>
              <span className="status-text">
                {connectionStatus === 'connected' && 'Notificaciones activas'}
                {connectionStatus === 'connecting' && 'Conectando...'}
                {connectionStatus === 'disconnected' && 'Sin notificaciones'}
                {connectionStatus === 'error' && 'Error de conexión'}
              </span>
            </div>
            <button 
              className="order_btn-agregar" onClick={handleNerOrderModal}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />
              Nuevo Pedido
            </button>
          </div>
        </div>
        
        <main className="order_main">
          {/* Botón para ocultar/mostrar filtros y contador */}
          <div className="toggle-filters-container">
            <button 
              className="toggle-filters-btn" 
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

          {/* Reemplazamos OrderFilterRibbon con nuestro nuevo componente FilterBar */}
          {showFilters && (
            <FilterBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceholder="Buscar por código, cliente o dirección..."
              filtroSemana={filtroSemana}
              setFiltroSemana={setFiltroSemana}
              filtrosAplicados={filtrosAplicados}
              setFiltrosAplicados={setFiltrosAplicados}
              setPaginaActual={setPaginaActual}
              aplicarFiltros={aplicarFiltros}
              resetearFiltros={resetearFiltros}
              customClassName="order-filter-bar"
            />
          )}
          
          {/* Contador de resultados con el mismo estilo que AgregarContenido */}
          {showFilters && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <div className="cont_resultados-contador">
                Mostrando <span className="cont_resaltado">{totalPedidos}</span> pedidos
              </div>
            </div>
          )}
          
          {/* Reemplazar OrderFilters con el nuevo componente OrderTabs */}
        <OrderTabs 
  activeFilter={activeFilter}
  handleFilterChange={handleFilterChange}
  setPaginaActual={setPaginaActual}
  counts={counts}
/>

          
          {/* Mensajes de carga o error */}
          {loading && <div className="loading-indicator">Cargando pedidos...</div>}
          {error && <div className="order_error">{error}</div>}
          
          {/* Tabla de pedidos */}
          <OrderTable 
            orders={filteredOrdersByStatus}
            filteredOrders={filteredOrders}
            filtrosAplicados={filtrosAplicados}
            activeFilter={activeFilter}
            loading={loading}
            paginaActual={paginaActual}
            elementosPorPagina={elementosPorPagina}
            getRowBackgroundClass={getRowBackgroundClass}
            formatDate={formatDate}
            formatTiempoTranscurrido={formatTiempoTranscurrido}
            getTotalProductos={getTotalProductos}
            getClientName={getClientName}
            getStatusName={getStatusName}
            handleViewDetails={handleViewDetails}
            changeOrderStatus={changeOrderStatus}
            handleCancelOrder={handleCancelOrder}
          />
          
          {/* Paginación con el mismo estilo que AgregarContenido */}
          {!loading && totalPedidos > 0 && (
            <div className="order_pagination">
              <button
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
                className="order_pagination-btn"
              >
                ⬅ Anterior
              </button>
              <span className="order_pagination-info">
                Página {paginaActual} de {Math.ceil(totalPedidos / elementosPorPagina) || 1}
              </span>
              <button
                disabled={paginaActual >= Math.ceil(totalPedidos / elementosPorPagina)}
                onClick={() => setPaginaActual(paginaActual + 1)}
                className="order_pagination-btn"
              >
                Siguiente ➡
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Componente modal para detalles */}
      <OrderDetailModal 
        showModal={showModal}
        selectedOrder={selectedOrder}
        showMap={showMap}
        showRoute={showRoute}
        closeModal={closeModal}
        handleShowLocationMap={handleShowLocationMap}
        handleShowRoute={handleShowRoute}
        handleCloseMap={handleCloseMap}
        formatDate={formatDate}
        getClientName={getClientName}
        changeOrderStatus={changeOrderStatus}
        getStatusName={getStatusName}
      />
      <NewOrderModal show={showNewOrderModal} onClose={closeModalNewOrder} />

      {/* Custom Alert Modal */}
      <CustomAlert 
        show={showAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />

    </div>
  );
};

export default OrderManager;
