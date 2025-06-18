// AdminService.js - Servicio para manejo de administradores

const API_BASE_URL = 'https://api.mamamianpizza.com/api/users';

class AdminService {  // Headers comunes para todas las requests
  static getHeaders() {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Agregar token de autenticación si está disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Manejar errores de respuesta
  static async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }  // GET - Obtener todos los administradores
  static async getAllAdmins() {
    try {
      const response = await fetch(`${API_BASE_URL}/Gettadmins`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse(response);
      
      // Log para verificar la estructura de respuesta
      console.log('Respuesta de la API:', JSON.stringify(data, null, 2));
      
      // Retornar solo el array de administradores
      return data.administradores || [];
    } catch (error) {
      console.error('Error al obtener administradores:', error);
      throw error;
    }
  }  // POST - Crear nuevo administrador
  static async createAdmin(adminData) {
    try {
      // Log para verificar la estructura de datos
      console.log('Datos enviados a la API:', JSON.stringify(adminData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/admins`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(adminData)
      });
      
      const result = await this.handleResponse(response);
      console.log('Respuesta de creación:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error('Error al crear administrador:', error);
      throw error;
    }
  }  // PUT - Actualizar administrador
  static async updateAdmin(adminId, adminData) {
    try {
      console.log('Actualizando administrador:', adminId, JSON.stringify(adminData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/Updateadmins/${adminId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(adminData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar administrador:', error);
      throw error;
    }
  }
  // DELETE - Eliminar administrador
  static async deleteAdmin(adminId) {
    try {
      console.log('Eliminando administrador:', adminId);
      
      const response = await fetch(`${API_BASE_URL}/Deleteadmins/${adminId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
      throw error;
    }
  }  // PUT - Cambiar estado del administrador (activo/inactivo)
  static async toggleAdminStatus(adminId, currentStatus) {
    const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
    try {
      const response = await fetch(`${API_BASE_URL}/Updateadmins/${adminId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ 
          estado: newStatus 
        })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al cambiar estado del administrador:', error);
      throw error;
    }
  }  // GET - Obtener administrador por ID
  static async getAdminById(adminId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse(response);
      console.log('Administrador obtenido:', JSON.stringify(data, null, 2));
      
      // Devolver solo el objeto administrador
      return data.administrador || data;
    } catch (error) {
      console.error('Error al obtener administrador por ID:', error);
      throw error;
    }
  }  // PUT - Cambiar contraseña del administrador
  static async changePassword(adminId, contrasenaActual, nuevaContrasena) {
    try {
      // Asegurar que adminId sea un número
      const idAdmin = parseInt(adminId);
      
      const payload = {
        id_admin: idAdmin,
        contrasenaActual: contrasenaActual,
        nuevaContrasena: nuevaContrasena
      };

      console.log('Cambiando contraseña para administrador ID:', idAdmin);
      
      const response = await fetch('https://api.mamamianpizza.com/api/auth/admin/change-password', {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      
      // Si no es exitoso, intentamos obtener más detalles del error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Contraseña cambiada exitosamente');
      
      return result;    } catch (error) {
      console.error('Error en changePassword:', error);
      throw error;
    }
  }
}

export default AdminService;
