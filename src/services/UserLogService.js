const API_BASE_URL = 'https://api.mamamianpizza.com/api';

class UserLogService {
  /**
   * Registra una acción del usuario en los logs del sistema
   * @param {Object} logData - Datos del log
   * @param {number} logData.user_id - ID del usuario que realizó la acción
   * @param {string} logData.action - Tipo de acción (CREATE, UPDATE, DELETE, etc.)
   * @param {string} logData.tabla_afectada - Tabla o entidad afectada
   * @param {number} logData.registro_id - ID del registro afectado
   * @param {string} logData.descripcion - Descripción detallada de la acción
   * @param {Object} logData.datos_anteriores - Datos previos (para UPDATE/DELETE)
   * @param {Object} logData.datos_nuevos - Datos nuevos (para CREATE/UPDATE)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async logUserAction(logData) {
    try {
      const token = localStorage.getItem('authToken');
      
      console.log('Enviando log de acción del usuario:', logData);
      
      const response = await fetch(`${API_BASE_URL}/logs/user-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(logData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Log registrado exitosamente:', result);
      
      return result;
      
    } catch (error) {
      console.error('Error al registrar log de usuario:', error);
      // No lanzar el error para no interrumpir la operación principal
      return { success: false, error: error.message };
    }
  }

  /**
   * Registra una acción sobre un producto (contenido)
   * @param {number} userId - ID del usuario
   * @param {string} action - Acción realizada (CREATE, UPDATE, DELETE)
   * @param {Object} productData - Datos del producto
   * @param {Object} previousData - Datos anteriores (solo para UPDATE/DELETE)
   */
  static async logProductAction(userId, action, productData, previousData = null) {
    const logData = {
      user_id: userId,
      action: action,
      tabla_afectada: 'productos_menu',
      registro_id: productData.id || null,
      descripcion: this.buildProductActionDescription(action, productData),
      datos_anteriores: previousData,
      datos_nuevos: action !== 'DELETE' ? productData : null
    };
    
    return await this.logUserAction(logData);
  }

  /**
   * Construye una descripción detallada de la acción sobre un producto
   * @param {string} action - Acción realizada
   * @param {Object} productData - Datos del producto
   * @returns {string} Descripción de la acción
   */
  static buildProductActionDescription(action, productData) {
    const actionTexts = {
      'CREATE': 'creó el producto',
      'UPDATE': 'actualizó el producto',
      'DELETE': 'eliminó el producto'
    };
    
    const actionText = actionTexts[action] || 'modificó el producto';
    const productTitle = productData.titulo || productData.title || 'Sin título';
    const productCategory = productData.categoria || productData.category || 'Sin categoría';
    
    return `${actionText} "${productTitle}" de la categoría "${productCategory}"`;
  }

  /**
   * Obtiene información resumida del usuario para incluir en logs
   * @param {Object} user - Objeto del usuario
   * @returns {Object} Información resumida del usuario
   */
  static getUserSummary(user) {
    if (!user) return { id: null, nombre: 'Usuario no identificado' };
    
    return {
      id: user.id,
      nombre: user.nombre || user.name || user.username || 'Sin nombre',
      email: user.email || 'Sin email',
      tipo: user.tipo || user.role || 'Sin tipo'
    };
  }
}

export default UserLogService;
