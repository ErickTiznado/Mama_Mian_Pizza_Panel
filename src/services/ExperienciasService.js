/**
 * Servicio para gestionar las experiencias de usuarios
 * API relacionada con el módulo de experiencias en MamaMianPizza
 */

import { debugRequest, debugResponse, validarEstadoAprobacion } from '../utils/debugUtils';

// URL base de la API
const BASE_URL = 'https://api.mamamianpizza.com/api/experiencias';

/**
 * Obtener todas las experiencias
 * @returns {Promise} Promise con los datos de todas las experiencias
 */
export const getAllExperiencias = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    if (!response.ok) {
      throw new Error('Error al obtener las experiencias');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.getAllExperiencias:', error);
    throw error;
  }
};

/**
 * Obtener experiencias por usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise} Promise con los datos de las experiencias del usuario
 */
export const getExperienciasByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener las experiencias del usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.getExperienciasByUser:', error);
    throw error;
  }
};

/**
 * Obtener experiencias por estado de aprobación
 * @param {number} status - Estado de aprobación (0=pendientes, 1=aprobadas)
 * @returns {Promise} Promise con los datos de las experiencias filtradas por estado
 */
export const getExperienciasByStatus = async (status) => {
  try {
    const response = await fetch(`${BASE_URL}/status/${status}`);
    if (!response.ok) {
      throw new Error('Error al obtener las experiencias por estado');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.getExperienciasByStatus:', error);
    throw error;
  }
};

/**
 * Obtener una experiencia por ID
 * @param {number} id - ID de la experiencia
 * @returns {Promise} Promise con los datos de la experiencia
 */
export const getExperienciaById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la experiencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.getExperienciaById:', error);
    throw error;
  }
};

/**
 * Crear una nueva experiencia
 * @param {Object} data - Datos de la experiencia a crear
 * @returns {Promise} Promise con la respuesta de la creación
 */
export const createExperiencia = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al crear la experiencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.createExperiencia:', error);
    throw error;
  }
};

/**
 * Actualizar una experiencia
 * @param {number} id - ID de la experiencia
 * @param {Object} data - Nuevos datos de la experiencia
 * @returns {Promise} Promise con la respuesta de la actualización
 */
export const updateExperiencia = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la experiencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.updateExperiencia:', error);
    throw error;
  }
};

/**
 * Cambiar estado de aprobación de una experiencia
 * @param {number} id - ID de la experiencia
 * @param {boolean} aprobado - Estado de aprobación (true=aprobado, false=no aprobado)
 * @returns {Promise} Promise con la respuesta del cambio de estado
 */
export const updateExperienciaApproval = async (id, aprobado) => {
  try {
    // Validar y convertir el estado de aprobación
    const estadoNumerico = validarEstadoAprobacion(aprobado);
    const requestData = { aprobado: estadoNumerico };
    
    debugRequest(`${BASE_URL}/${id}/approval`, 'PUT', requestData);
    
    const response = await fetch(`${BASE_URL}/${id}/approval`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      debugResponse(`${BASE_URL}/${id}/approval`, response, errorData);
      throw new Error(errorData.message || `Error al actualizar el estado de aprobación (Status: ${response.status})`);
    }
    
    const responseData = await response.json();
    debugResponse(`${BASE_URL}/${id}/approval`, response, responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error en ExperienciasService.updateExperienciaApproval:', error);
    throw error;
  }
};

/**
 * Eliminar una experiencia
 * @param {number} id - ID de la experiencia
 * @returns {Promise} Promise con la respuesta de la eliminación
 */
export const deleteExperiencia = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la experiencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en ExperienciasService.deleteExperiencia:', error);
    throw error;
  }
};
