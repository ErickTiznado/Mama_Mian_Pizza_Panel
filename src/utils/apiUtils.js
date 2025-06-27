// Utilidades para manejar las peticiones de la API con JWT

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

/**
 * Función para hacer peticiones HTTP con manejo automático de JWT
 * @param {string} url - La URL de la petición
 * @param {object} options - Opciones de la petición (method, body, etc.)
 * @returns {Promise<Response>} - La respuesta de la petición
 */
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  // Configurar headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Agregar Authorization header si hay token
  if (token && token !== 'token-session-active') {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Combinar headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };
  
  // Hacer la petición
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Manejar errores de autenticación
  if (response.status === 401) {
    console.warn('Token expirado o inválido');
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redirigir al login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }
  
  return response;
};

/**
 * Función para verificar si un token JWT es válido
 * @param {string} token - El token JWT a verificar
 * @returns {boolean} - true si el token es válido
 */
export const isTokenValid = (token) => {
  if (!token || token === 'token-session-active') return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp ? payload.exp > currentTime : true;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return false;
  }
};

/**
 * Función para obtener el payload del token JWT
 * @param {string} token - El token JWT
 * @returns {object|null} - El payload del token o null si es inválido
 */
export const getTokenPayload = (token) => {
  if (!token || token === 'token-session-active') return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
};

/**
 * Función para verificar si el token expira pronto (en los próximos 5 minutos)
 * @param {string} token - El token JWT
 * @returns {boolean} - true si el token expira pronto
 */
export const isTokenExpiringSoon = (token) => {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) return false;
  
  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = payload.exp - currentTime;
  
  // Devolver true si expira en menos de 5 minutos (300 segundos)
  return timeUntilExpiry < 300;
};
