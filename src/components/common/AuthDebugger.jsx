import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRoleDebugger } from '../../hooks/useRoleDebugger';

const AuthDebugger = () => {
  const { user, isAuthenticated } = useAuth();
  const { checkAndFixRole } = useRoleDebugger();

  useEffect(() => {
    console.log('🔧 [AUTH DEBUGGER] Estado actual de autenticación:');
    console.log('🔧 [AUTH DEBUGGER] isAuthenticated:', isAuthenticated);
    console.log('🔧 [AUTH DEBUGGER] user:', user);
    console.log('🔧 [AUTH DEBUGGER] user.rol:', user?.rol);
    console.log('🔧 [AUTH DEBUGGER] localStorage authToken:', localStorage.getItem('authToken'));
    console.log('🔧 [AUTH DEBUGGER] localStorage userData:', localStorage.getItem('userData'));
    
    // Verificar si hay inconsistencias
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedStoredData = JSON.parse(storedUserData);
        console.log('🔧 [AUTH DEBUGGER] userData parseado desde localStorage:', parsedStoredData);
        console.log('🔧 [AUTH DEBUGGER] rol desde localStorage:', parsedStoredData.rol);
        
        if (user && user.rol !== parsedStoredData.rol) {
          console.warn('⚠️ [AUTH DEBUGGER] INCONSISTENCIA: rol en contexto vs localStorage');
          console.warn('⚠️ [AUTH DEBUGGER] Contexto:', user.rol, 'localStorage:', parsedStoredData.rol);
          console.log('🔧 [AUTH DEBUGGER] Intentando corregir automáticamente...');
          checkAndFixRole();
        }
      } catch (error) {
        console.error('🔧 [AUTH DEBUGGER] Error parseando userData de localStorage:', error);
      }
    }

    // Funciones de debug globales
    window.debugShowUserInfo = () => {
      console.log('🔧 [GLOBAL DEBUG] Usuario actual:', user);
      console.log('🔧 [GLOBAL DEBUG] localStorage userData:', localStorage.getItem('userData'));
    };

    console.log('🔧 [AUTH DEBUGGER] Funciones de debug disponibles:');
    console.log('🔧 [AUTH DEBUGGER] - debugRole("super_admin") - Cambia el rol a super_admin');
    console.log('🔧 [AUTH DEBUGGER] - debugRole("admin") - Cambia el rol a admin');
    console.log('🔧 [AUTH DEBUGGER] - debugShowUserInfo() - Muestra información del usuario');
    console.log('🔧 [AUTH DEBUGGER] - debugFixRole() - Muestra información del rol actual');
    console.log('🔧 [AUTH DEBUGGER] - debugGetRoleFromAPI() - Consulta el rol desde la API de administradores');

    // Solo verificar inconsistencias entre contexto y localStorage, no hacer correcciones automáticas
    if (user && user.rol) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedStoredData = JSON.parse(storedUserData);
          if (parsedStoredData.rol !== user.rol) {
            console.warn('⚠️ [AUTH DEBUGGER] INCONSISTENCIA detectada entre contexto y localStorage');
            console.warn('⚠️ [AUTH DEBUGGER] Contexto:', user.rol, 'localStorage:', parsedStoredData.rol);
            console.log('🔧 [AUTH DEBUGGER] Sincronizando...');
            checkAndFixRole();
          }
        } catch (error) {
          console.error('🔧 [AUTH DEBUGGER] Error al verificar localStorage:', error);
        }
      }
    }

  }, [user, isAuthenticated, checkAndFixRole]);

  // Este componente no renderiza nada, solo debug
  return null;
};

export default AuthDebugger;
