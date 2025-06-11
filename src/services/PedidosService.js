import axios from 'axios';

// Base URL para la API
const API_BASE_URL = "https://api.mamamianpizza.com/api/orders";

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

// Función para crear un nuevo pedido
export const createNewOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/neworder`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error al crear nuevo pedido:", error);
    throw error;
  }
};

// Función para obtener estadísticas de pedidos
export const fetchOrderStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de pedidos:", error);
    throw error;
  }
};

// Función para obtener el ticket promedio
export const fetchAverageTicket = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/statistics/tickets`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener ticket promedio:", error);
    throw error;
  }
};

// Función para obtener promedios de pedidos
export const fetchOrderAverages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/statistics/averages`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener promedios de pedidos:", error);
    throw error;
  }
};

// Función para obtener un pedido por ID
export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener pedido con ID ${orderId}:`, error);
    throw error;
  }
};

// Función para reparar pedidos sin detalles
export const repairOrderDetails = async (orderId, productos) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/repair`, {
      productos
    });
    return response.data;
  } catch (error) {
    console.error(`Error al reparar pedido ${orderId}:`, error);
    throw error;
  }
};

// Función para crear usuario invitado
export const createGuestUser = async (userData) => {
  try {
    const API_BASE = "https://api.mamamianpizza.com/api";
    const response = await axios.post(`${API_BASE}/usuarios/invitado`, userData);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario invitado:", error);
    throw error;
  }
};

// Función para buscar cliente por teléfono
export const findClienteByPhone = async (telefono) => {
  try {
    const API_BASE = "https://api.mamamianpizza.com/api";
    const response = await axios.get(`${API_BASE}/cliente/resumen/${telefono}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Cliente no encontrado
    }
    console.error("Error al buscar cliente:", error);
    throw error;
  }
};