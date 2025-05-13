import axios from 'axios';
import { createOrderNotification } from './NotificationService';

// Base URL para la API
const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

// Función para obtener todos los pedidos
export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los pedidos:", error);
    throw error;
  }
};

// Función para obtener pedidos por estado
export const fetchOrdersByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener pedidos con estado ${status}:`, error);
    throw error;
  }
};

// Función para actualizar el estado de un pedido
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
      estado: newStatus
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    throw error;
  }
};

// Función para iniciar el servicio de polling de pedidos
let pollingInterval = null;
let lastCheckedTime = null;
let cachedPendingOrders = [];

export const startOrderPolling = (notificationContext, interval = 30000) => {
  // Si ya hay un intervalo activo, detenerlo primero
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  // Inicializar tiempo de última verificación (ahora)
  lastCheckedTime = new Date();
  
  // Guardar los pedidos pendientes actuales para comparar después
  fetchOrdersByStatus('pendiente')
    .then(orders => {
      cachedPendingOrders = orders;
      console.log('Servicio de polling de pedidos iniciado. Pedidos iniciales:', cachedPendingOrders.length);
    })
    .catch(error => {
      console.error('Error al iniciar el polling de pedidos:', error);
    });
  
  // Iniciar el intervalo de polling
  pollingInterval = setInterval(async () => {
    try {
      console.log('Verificando nuevos pedidos...');
      // Obtener pedidos pendientes actuales
      const latestOrders = await fetchOrdersByStatus('pendiente');
      
      // Verificar si hay nuevos pedidos
      const newOrders = latestOrders.filter(newOrder => {
        // Verificar si el pedido no estaba en nuestra caché
        return !cachedPendingOrders.some(cachedOrder => 
          cachedOrder.id_pedido === newOrder.id_pedido
        );
      });
      
      // Si hay nuevos pedidos, notificar
      if (newOrders.length > 0) {
        console.log(`Se detectaron ${newOrders.length} nuevos pedidos`);
        
        // Notificar cada nuevo pedido
        newOrders.forEach(order => {
          createOrderNotification(notificationContext, order);
        });
        
        // Actualizar la caché con los nuevos pedidos
        cachedPendingOrders = latestOrders;
      }
    } catch (error) {
      console.error('Error en el polling de pedidos:', error);
    }
  }, interval);
  
  return () => {
    // Función para detener el polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
      console.log('Servicio de polling de pedidos detenido');
    }
  };
};

// Función para detener el polling manualmente
export const stopOrderPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('Servicio de polling de pedidos detenido manualmente');
  }
};

// Verificar si el polling está activo
export const isPollingActive = () => {
  return pollingInterval !== null;
};