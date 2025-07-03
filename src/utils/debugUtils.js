/**
 * Utilidades para debug de servicios de comentarios y experiencias
 */

/**
 * Función helper para debugging de requests
 * @param {string} endpoint - El endpoint que se está llamando
 * @param {string} method - El método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} data - Los datos que se están enviando
 */
export const debugRequest = (endpoint, method, data = null) => {
  console.group(`🔍 API Request Debug: ${method} ${endpoint}`);
  
  if (data) {
    console.log('📤 Datos enviados:', data);
    console.log('📤 JSON stringify:', JSON.stringify(data));
  }
  
  console.groupEnd();
};

/**
 * Función helper para debugging de responses
 * @param {string} endpoint - El endpoint que se llamó
 * @param {Response} response - La respuesta de la API
 * @param {Object} data - Los datos de respuesta
 */
export const debugResponse = (endpoint, response, data = null) => {
  console.group(`🔍 API Response Debug: ${endpoint}`);
  
  console.log('📊 Status:', response.status);
  console.log('📊 OK:', response.ok);
  
  if (data) {
    console.log('📥 Datos recibidos:', data);
  }
  
  console.groupEnd();
};

/**
 * Valida que el estado de aprobación sea correcto
 * @param {any} estado - El estado a validar
 * @returns {number} El estado validado (0 o 1)
 */
export const validarEstadoAprobacion = (estado) => {
  if (typeof estado === 'boolean') {
    return estado ? 1 : 0;
  }
  
  if (estado === 1 || estado === 0) {
    return estado;
  }
  
  if (estado === '1' || estado === 'true') {
    return 1;
  }
  
  if (estado === '0' || estado === 'false') {
    return 0;
  }
  
  throw new Error(`Estado de aprobación inválido: ${estado}. Debe ser 0 o 1.`);
};
