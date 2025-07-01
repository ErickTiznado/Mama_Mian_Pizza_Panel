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
        const userData = localStorage.getItem('userData');
        
        console.log('🔧 [AUTH DEBUG] Token encontrado:', !!token);
        console.log('🔧 [AUTH DEBUG] UserData encontrado:', !!userData);

        if (token && userData) {
          const parsedUserData = JSON.parse(userData);
          console.log('🔧 [AUTH DEBUG] UserData parseado:', parsedUserData);
          
          // 🔧 [TEMP FIX] Asegurar que el usuario tenga un rol
          if (!parsedUserData.rol) {
            parsedUserData.rol = getUserRole(parsedUserData);
            console.log('🔧 [AUTH] Rol asignado al usuario recuperado:', parsedUserData.rol);
            // Actualizar localStorage con el rol
            localStorage.setItem('userData', JSON.stringify(parsedUserData));
          }
          
          console.log('🔧 [AUTH DEBUG] Rol final del usuario:', parsedUserData.rol);
          
          if (isTokenValid(token)) {
            setIsAuthenticated(true);
            setUser(parsedUserData);
            console.log('🔧 [AUTH DEBUG] Usuario autenticado exitosamente');
          } else {
            console.log('🔧 [AUTH DEBUG] Token inválido, limpiando localStorage');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        } else {
          console.log('🔧 [AUTH DEBUG] No hay token o userData en localStorage');
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
  }, []);  // 🔧 Función para obtener o asignar el rol del usuario
  const getUserRole = (userData) => {
    console.log('❌ [GETUSRROLE] === FUNCIÓN getUserRole EJECUTADA ===');
    console.log('❌ [GETUSRROLE] Esto NO debería ejecutarse si el backend envía rol');
    console.log('❌ [GETUSRROLE] userData completa:', JSON.stringify(userData, null, 2));
    console.log('❌ [GETUSRROLE] userData.rol:', userData.rol);
    
    // Si el usuario ya tiene rol, devolverlo tal como viene del backend
    if (userData?.rol) {
      console.log('✅ [GETUSRROLE] Usuario tiene rol del backend:', userData.rol);
      return userData.rol;
    }
    
    // Esto ya NO debería pasar porque el backend envía el rol
    console.error('❌ [GETUSRROLE] Usuario SIN rol - investigar por qué llegó aquí');
    console.error('❌ [GETUSRROLE] Verificar que el login esté usando los campos correctos');
    console.log('❌ [GETUSRROLE] userData sin rol:', JSON.stringify(userData, null, 2));
    
    // Fallback de emergencia
    if (userData?.id_admin) {
      console.warn('🔧 [GETUSRROLE] FALLBACK DE EMERGENCIA: Asignando rol "admin"');
      return 'admin';
    }
    
    console.error('❌ [GETUSRROLE] No se puede determinar el rol del usuario');
    console.error('❌ [GETUSRROLE] Devolviendo "user" como último recurso');
    return 'user';
  };

  // 🔧 [TEMP FIX] Función para verificar permisos de admin
  const isUserAdmin = (userData) => {
    const role = getUserRole(userData);
    const isAdmin = role === 'admin' || role === 'administrador' || role === 'super_admin';
    console.log('🔧 [TEMP FIX] isUserAdmin check - role:', role, 'isAdmin:', isAdmin);
    return isAdmin;
  };  const login = (userData, token) => {
    try {
      console.log('🔧 [AUTH DEBUG] === FUNCIÓN LOGIN EJECUTADA ===');
      console.log('🔧 [AUTH DEBUG] userData recibido:', JSON.stringify(userData, null, 2));
      console.log('🔧 [AUTH DEBUG] userData.rol recibido:', userData.rol);
      console.log('🔧 [AUTH DEBUG] typeof userData.rol:', typeof userData.rol);
      console.log('🔧 [AUTH DEBUG] userData.rol === undefined:', userData.rol === undefined);
      console.log('🔧 [AUTH DEBUG] userData.rol === null:', userData.rol === null);
      console.log('🔧 [AUTH DEBUG] userData.rol === "":', userData.rol === '');
      console.log('🔧 [AUTH DEBUG] !userData.rol:', !userData.rol);
      
      // FORZAR el uso del rol que viene del backend sin ninguna modificación
      let finalUserData = { ...userData };
      
      // CRUCIAL: Solo llamar getUserRole si el rol está completamente ausente
      if (userData.rol === undefined || userData.rol === null || userData.rol === '') {
        console.error('❌ [AUTH ERROR] Rol completamente ausente, usando fallback');
        finalUserData.rol = getUserRole(userData);
      } else {
        console.log('✅ [AUTH SUCCESS] Usando rol del backend SIN modificaciones:', userData.rol);
        finalUserData.rol = userData.rol; // Asignación directa y explícita
      }
      
      console.log('🔧 [AUTH DEBUG] === VERIFICACIÓN ANTES DE GUARDAR ===');
      console.log('🔧 [AUTH DEBUG] finalUserData.rol:', finalUserData.rol);
      console.log('🔧 [AUTH DEBUG] typeof finalUserData.rol:', typeof finalUserData.rol);
      
      // Guardar en localStorage
      const dataToSave = JSON.stringify(finalUserData);
      console.log('🔧 [AUTH DEBUG] Datos a guardar en localStorage:', dataToSave);
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', dataToSave);
      
      // Actualizar estado de React
      setIsAuthenticated(true);
      setUser(finalUserData);
      
      console.log('🔧 [AUTH DEBUG] === VERIFICACIÓN INMEDIATA POST-GUARDADO ===');
      const savedData = localStorage.getItem('userData');
      const parsedSavedData = JSON.parse(savedData);
      console.log('🔧 [AUTH DEBUG] localStorage userData raw:', savedData);
      console.log('🔧 [AUTH DEBUG] localStorage userData parsed:', parsedSavedData);
      console.log('🔧 [AUTH DEBUG] localStorage rol:', parsedSavedData.rol);
      
    } catch (error) {
      console.error('❌ [AUTH ERROR] Error al guardar los datos de autenticación:', error);
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
