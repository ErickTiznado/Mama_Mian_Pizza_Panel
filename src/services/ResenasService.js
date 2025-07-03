/**
 * Servicio para gestionar las reseñas y comentarios de usuarios
 * API relacionada con el módulo de reseñas en MamaMianPizza
 */

import { debugRequest, debugResponse, validarEstadoAprobacion } from '../utils/debugUtils';

// URL base de la API
const BASE_URL = 'https://api.mamamianpizza.com/api/resenas';

/**
 * Obtener todas las reseñas
 * @returns {Promise} Promise con los datos de todas las reseñas
 */
export const getAllResenas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    if (!response.ok) {
      throw new Error('Error al obtener las reseñas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ResenasService.getAllResenas:', error);
    throw error;
  }
};

/**
 * Obtener reseñas por usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise} Promise con los datos de las reseñas del usuario
 */
export const getResenasByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/usuario/${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener las reseñas del usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ResenasService.getResenasByUser:', error);
    throw error;
  }
};

/**
 * Obtener reseñas por estado de aprobación
 * @param {number} aprobada - Estado de aprobación (0=pendientes, 1=aprobadas)
 * @returns {Promise} Promise con los datos de las reseñas filtradas por estado
 */
export const getResenasByApproval = async (aprobada) => {
  try {
    const response = await fetch(`${BASE_URL}/aprobadas/${aprobada}`);
    if (!response.ok) {
      throw new Error('Error al obtener las reseñas por estado de aprobación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ResenasService.getResenasByApproval:', error);
    throw error;
  }
};

/**
 * Obtener una reseña por ID
 * @param {number} id - ID de la reseña
 * @returns {Promise} Promise con los datos de la reseña
 */
export const getResenaById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la reseña');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ResenasService.getResenaById:', error);
    throw error;
  }
};

/**
 * Cambiar estado de aprobación de una reseña
 * @param {number} id - ID de la reseña
 * @param {boolean} aprobada - Estado de aprobación (true=aprobado, false=no aprobado)
 * @returns {Promise} Promise con la respuesta del cambio de estado
 */
export const updateResenaApproval = async (id, aprobada) => {
  try {
    // Validar y convertir el estado de aprobación
    const estadoNumerico = validarEstadoAprobacion(aprobada);
    const requestData = { aprobada: estadoNumerico };
    
    debugRequest(`${BASE_URL}/estado/${id}`, 'PUT', requestData);
    
    const response = await fetch(`${BASE_URL}/estado/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      debugResponse(`${BASE_URL}/estado/${id}`, response, errorData);
      throw new Error(errorData.message || `Error al actualizar el estado de aprobación de la reseña (Status: ${response.status})`);
    }
    
    const responseData = await response.json();
    debugResponse(`${BASE_URL}/estado/${id}`, response, responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error en ResenasService.updateResenaApproval:', error);
    throw error;
  }
};

/**
 * Eliminar una reseña
 * @param {number} id - ID de la reseña
 * @returns {Promise} Promise con la respuesta de la eliminación
 */
export const deleteResena = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la reseña');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ResenasService.deleteResena:', error);
    throw error;
  }
};
