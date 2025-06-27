import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Función para verificar si el token JWT es válido
  const isTokenValid = (token) => {
    if (!token || token === 'token-session-active') return true; // Token simulado para compatibilidad
    
    try {
      // Decodificar el JWT para verificar la expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token ha expirado
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token JWT expirado');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar token JWT:', error);
      return false;
    }
  };  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');        if (token && userData) {
          const parsedUserData = JSON.parse(userData);
          
          // 🔧 [TEMP FIX] Asegurar que el usuario tenga un rol
          if (!parsedUserData.rol) {
            parsedUserData.rol = getUserRole(parsedUserData);
            console.log('🔧 [AUTH] Rol asignado al usuario recuperado:', parsedUserData.rol);
            // Actualizar localStorage con el rol
            localStorage.setItem('userData', JSON.stringify(parsedUserData));
          }
          
          if (isTokenValid(token)) {
            setIsAuthenticated(true);
            setUser(parsedUserData);
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      } catch (error) {
        console.error('Error al verificar el estado de autenticación:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);  // 🔧 [TEMP FIX] Función para obtener o asignar el rol del usuario
  const getUserRole = (userData) => {
    // Si el usuario ya tiene rol, devolverlo
    if (userData?.rol) {
      return userData.rol;
    }
    
    // Si no tiene rol, verificar si es un admin basado en el correo o id_admin
    if (userData?.id_admin || userData?.correo?.includes('admin') || userData?.correo === 'tiznadoerick3@gmail.com') {
      console.log('🔧 [TEMP FIX] Asignando rol "admin" basado en criterios');
      return 'admin';
    }
    
    // Rol por defecto
    console.log('🔧 [TEMP FIX] Asignando rol "user" por defecto');
    return 'user';
  };

  // 🔧 [TEMP FIX] Función para verificar permisos de admin
  const isUserAdmin = (userData) => {
    const role = getUserRole(userData);
    const isAdmin = role === 'admin' || role === 'administrador';
    console.log('🔧 [TEMP FIX] isUserAdmin check - role:', role, 'isAdmin:', isAdmin);
    return isAdmin;
  };  const login = (userData, token) => {
    try {
      //  [TEMP FIX] Asegurar que el usuario tenga un rol
      if (!userData.rol) {
        userData.rol = getUserRole(userData);
        console.log('🔧 [AUTH] Rol asignado automáticamente:', userData.rol);
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Error al guardar los datos de autenticación:', error);
    }
  };
  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para obtener el token actual
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  // Función para verificar si el usuario está autenticado y el token es válido
  const checkAuth = () => {
    const token = getToken();
    return token && isTokenValid(token) && isAuthenticated;
  };
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
    checkAuth,
    isTokenValid,
    isUserAdmin, // 🔧 [TEMP FIX] Exportar función helper
    getUserRole  // 🔧 [TEMP FIX] Exportar función helper
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
