const API_BASE_URL = 'https://api.mamamianpizza.com/api';

class LogsService {
  /**
   * Obtiene los logs del sistema con filtros opcionales
   * @param {Object} filtros - Objeto con filtros para los logs
   * @param {number} filtros.page - Página actual (por defecto 1)
   * @param {number} filtros.limit - Logs por página (por defecto 50)
   * @param {string} filtros.accion - Filtrar por acción específica
   * @param {string} filtros.tabla_afectada - Filtrar por tabla afectada
   * @param {string} filtros.fecha_inicio - Fecha de inicio (formato YYYY-MM-DD)
   * @param {string} filtros.fecha_fin - Fecha de fin (formato YYYY-MM-DD)
   * @param {number} filtros.id_usuario - ID del usuario
   * @param {string} filtros.search - Búsqueda general en descripción
   * @returns {Promise<Object>} Respuesta con logs, paginación y estadísticas
   */
  static async getLogs(filtros = {}) {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      // Parámetros de paginación
      params.append('page', filtros.page || 1);
      params.append('limit', filtros.limit || 50);
      
      // Filtros opcionales
      if (filtros.accion) params.append('accion', filtros.accion);
      if (filtros.tabla_afectada) params.append('tabla_afectada', filtros.tabla_afectada);
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros.id_usuario) params.append('id_usuario', filtros.id_usuario);
      if (filtros.search) params.append('search', filtros.search);
      
      console.log('Solicitando logs con parámetros:', params.toString());
      
      const response = await fetch(`${API_BASE_URL}/logs?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Aquí podrías agregar headers de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Logs obtenidos exitosamente:', data);
      
      return data;
      
    } catch (error) {
      console.error('Error al obtener logs:', error);
      throw error;
    }
  }

  /**
   * Obtiene las acciones únicas disponibles en los logs
   * @returns {Promise<Array>} Array de acciones únicas
   */
  static async getAccionesUnicas() {
    try {
      const response = await this.getLogs({ limit: 1000 }); // Obtener una muestra grande
      const acciones = [...new Set(response.logs.map(log => log.accion))].sort();
      return acciones;
    } catch (error) {
      console.error('Error al obtener acciones únicas:', error);
      // Retornar acciones por defecto en caso de error
      return ['LOGIN', 'CREATE', 'READ', 'UPDATE', 'DELETE'];
    }
  }

  /**
   * Obtiene las tablas únicas afectadas en los logs
   * @returns {Promise<Array>} Array de tablas únicas
   */
  static async getTablasUnicas() {
    try {
      const response = await this.getLogs({ limit: 1000 }); // Obtener una muestra grande
      const tablas = [...new Set(response.logs.map(log => log.tabla_afectada))].sort();
      return tablas;
    } catch (error) {
      console.error('Error al obtener tablas únicas:', error);
      // Retornar tablas por defecto en caso de error
      return ['usuarios', 'productos', 'pedidos'];
    }
  }

  /**
   * Formatea una fecha para mostrar en la interfaz
   * @param {string} fechaISO - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  static formatearFecha(fechaISO) {
    if (!fechaISO) return 'No disponible';
    
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fechaISO;
    }
  }

  /**
   * Obtiene el color del badge según el tipo de acción
   * @param {string} accion - La acción del log
   * @returns {string} Clase CSS para el color
   */
  static getColorAccion(accion) {
    const colores = {
      'LOGIN': 'success',
      'CREATE': 'info',
      'READ': 'neutral',
      'UPDATE': 'warning',
      'DELETE': 'error',
      'LOGOUT': 'secondary'
    };
    
    return colores[accion] || 'neutral';
  }

  /**
   * Obtiene el color del badge según el tipo de usuario
   * @param {string} tipo - El tipo de usuario
   * @returns {string} Clase CSS para el color
   */
  static getColorTipoUsuario(tipo) {
    const colores = {
      'administrador': 'admin',
      'usuario': 'user',
      'sistema': 'system'
    };
    
    return colores[tipo] || 'neutral';
  }
}

export default LogsService;