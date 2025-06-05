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