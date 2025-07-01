import { useAuth } from '../context/AuthContext';

export const useRoleDebugger = () => {
  const { user, login } = useAuth();

  const checkAndFixRole = () => {
    if (!user) {
      console.log('🔧 [ROLE DEBUGGER] No hay usuario autenticado');
      return;
    }

    console.log('🔧 [ROLE DEBUGGER] Verificando rol del usuario:', user);

    // Verificar si hay inconsistencias entre localStorage y contexto
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedStoredData = JSON.parse(storedUserData);
        if (parsedStoredData.rol !== user.rol) {
          console.log('🔧 [ROLE DEBUGGER] Inconsistencia detectada entre localStorage y contexto');
          console.log('🔧 [ROLE DEBUGGER] localStorage:', parsedStoredData.rol, 'contexto:', user.rol);
          
          // Usar el rol de localStorage (más reciente)
          const updatedUser = { ...user, rol: parsedStoredData.rol };
          const token = localStorage.getItem('authToken') || 'token-session-active';
          login(updatedUser, token);
          
          console.log('🔧 [ROLE DEBUGGER] Rol sincronizado a:', parsedStoredData.rol);
          return true;
        }
      } catch (error) {
        console.error('🔧 [ROLE DEBUGGER] Error al verificar localStorage:', error);
      }
    }

    console.log('🔧 [ROLE DEBUGGER] No se detectaron inconsistencias');
    return false;
  };

  const forceRole = (newRole) => {
    if (!user) {
      console.error('🔧 [ROLE DEBUGGER] No hay usuario autenticado');
      return;
    }

    const updatedUser = { ...user, rol: newRole };
    const token = localStorage.getItem('authToken') || 'token-session-active';
    
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    login(updatedUser, token);
    
    console.log('🔧 [ROLE DEBUGGER] Rol forzado a:', newRole);
    
    // Recargar la página para aplicar cambios
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return {
    checkAndFixRole,
    forceRole,
    currentRole: user?.rol
  };
};

// Funciones globales para debug en consola del navegador
window.debugRole = (newRole) => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      parsedData.rol = newRole;
      localStorage.setItem('userData', JSON.stringify(parsedData));
      console.log('🔧 [GLOBAL DEBUG] Rol actualizado en localStorage a:', newRole);
      console.log('🔧 [GLOBAL DEBUG] Recargando página para aplicar cambios...');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('🔧 [GLOBAL DEBUG] Error:', error);
    }
  } else {
    console.error('🔧 [GLOBAL DEBUG] No hay datos de usuario en localStorage');
  }
};

window.debugShowUserInfo = () => {
  const userData = localStorage.getItem('userData');
  const token = localStorage.getItem('authToken');
  
  console.log('🔧 [GLOBAL DEBUG] === INFORMACIÓN COMPLETA DEL USUARIO ===');
  console.log('🔧 [GLOBAL DEBUG] localStorage authToken:', token);
  console.log('🔧 [GLOBAL DEBUG] localStorage userData (raw):', userData);
  
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      console.log('🔧 [GLOBAL DEBUG] userData parseado:', parsedData);
      console.log('🔧 [GLOBAL DEBUG] Rol actual:', parsedData.rol);
      console.log('🔧 [GLOBAL DEBUG] typeof rol:', typeof parsedData.rol);
      console.log('🔧 [GLOBAL DEBUG] Email:', parsedData.correo);
      console.log('🔧 [GLOBAL DEBUG] ID Admin:', parsedData.id_admin);
      console.log('🔧 [GLOBAL DEBUG] Nombre:', parsedData.nombre);
      
      // Verificar si el rol debería ser diferente
      if (parsedData.rol === 'user') {
        console.warn('⚠️ [GLOBAL DEBUG] PROBLEMA: El rol es "user" pero debería ser super_admin o admin');
        console.warn('⚠️ [GLOBAL DEBUG] Esto indica que el rol se perdió durante el proceso de login');
      }
      
    } catch (error) {
      console.error('🔧 [GLOBAL DEBUG] Error al leer userData:', error);
    }
  } else {
    console.log('🔧 [GLOBAL DEBUG] No hay datos de usuario en localStorage');
  }
  
  console.log('🔧 [GLOBAL DEBUG] === FIN DE INFORMACIÓN ===');
};

window.debugFixRole = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      console.log('🔧 [GLOBAL DEBUG] Datos actuales del usuario:', parsedData);
      console.log('🔧 [GLOBAL DEBUG] Rol actual:', parsedData.rol);
      
      // No hacer cambios automáticos, solo mostrar información
      console.log('🔧 [GLOBAL DEBUG] Para cambiar el rol manualmente, usa: debugRole("super_admin") o debugRole("admin")');
    } catch (error) {
      console.error('🔧 [GLOBAL DEBUG] Error:', error);
    }
  }
};

// Nueva función para consultar el endpoint de administradores y obtener el rol correcto
window.debugGetRoleFromAPI = async () => {
  const userData = localStorage.getItem('userData');
  const token = localStorage.getItem('authToken');
  
  if (!userData) {
    console.error('🔧 [API DEBUG] No hay datos de usuario');
    return;
  }

  try {
    const parsedData = JSON.parse(userData);
    console.log('🔧 [API DEBUG] Consultando endpoint de administradores...');
    
    const response = await fetch('https://api.mamamianpizza.com/api/users/Gettadmins', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || 'token-session-active'}`
      }
    });
    
    const data = await response.json();
    console.log('🔧 [API DEBUG] Respuesta completa:', data);
    
    if (data.administradores) {
      // Buscar por id_admin (que viene como 'id' en el login)
      const currentAdmin = data.administradores.find(admin => 
        admin.id_admin === parsedData.id_admin || admin.correo === parsedData.correo
      );
      
      if (currentAdmin) {
        console.log('🔧 [API DEBUG] Tu admin encontrado:', currentAdmin);
        console.log('🔧 [API DEBUG] Rol según la API:', currentAdmin.rol);
        console.log('🔧 [API DEBUG] Rol local actual:', parsedData.rol);
        
        if (currentAdmin.rol !== parsedData.rol) {
          console.log('🔧 [API DEBUG] ¡Rol diferente! Local:', parsedData.rol, 'API:', currentAdmin.rol);
          console.log('🔧 [API DEBUG] Para corregir ejecuta: debugRole("' + currentAdmin.rol + '")');
        } else {
          console.log('✅ [API DEBUG] Rol coincide entre local y API');
        }
      } else {
        console.error('❌ [API DEBUG] No se encontró tu admin en la respuesta');
        console.log('🔧 [API DEBUG] Tu ID:', parsedData.id_admin, 'Tu correo:', parsedData.correo);
        console.log('🔧 [API DEBUG] Administradores disponibles:', data.administradores.map(a => ({id: a.id_admin, correo: a.correo})));
      }
    } else {
      console.error('❌ [API DEBUG] Respuesta no contiene administradores');
    }
  } catch (error) {
    console.error('🔧 [API DEBUG] Error:', error);
  }
};
