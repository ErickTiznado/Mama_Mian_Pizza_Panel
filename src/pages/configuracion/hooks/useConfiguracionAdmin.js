import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminService from '../../../services/AdminService';
import LogsService from '../../../services/LogsService';

export function useConfiguracionAdmin() {
  const { user, isAuthenticated, logout } = useAuth();

  // Estados de datos del administrador
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Estados de edición de perfil
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [emailAdmin, setEmailAdmin] = useState("");
  const [telefonoAdmin, setTelefonoAdmin] = useState("");

  // Estados de cambio de contraseña
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Estados generales
  const [activeTab, setActiveTab] = useState("cuenta");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de historial y filtros
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [backupData, setBackupData] = useState([]);

  // Estados para logs reales
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState(null);
  const [logsStats, setLogsStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Estados para filtros de logs
  const [accionFiltro, setAccionFiltro] = useState("");
  const [tablaFiltro, setTablaFiltro] = useState("");
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");
  const [usuarioFiltro, setUsuarioFiltro] = useState("");
  const [busquedaLogs, setBusquedaLogs] = useState("");

  // Validación de contraseña
  const contrasenaValida =
    contrasenaActual.trim().length >= 6 &&
    nuevaPassword.trim().length >= 6 &&
    confirmarPassword.trim().length >= 6 &&
    nuevaPassword === confirmarPassword;

  // Función auxiliar para obtener el ID del administrador
  const getAdminId = () => {
    if (!user) return null;
    return user.id_admin;
  };

  // Funciones utilitarias
  const limpiarFiltros = () => {
    setBusqueda("");
    setTipo("");
    setEstado("");
  };

  const limpiarFiltrosLogs = () => {
    setAccionFiltro("");
    setTablaFiltro("");
    setFechaInicioFiltro("");
    setFechaFinFiltro("");
    setUsuarioFiltro("");
    setBusquedaLogs("");
    setCurrentPage(1);
  };

  // Función para cargar datos del administrador
  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const adminId = getAdminId();
      
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado o ID de administrador no disponible');
      }
      
      const admin = await AdminService.getAdminById(adminId);
      
      setAdminData(admin);
      setNombreAdmin(admin.nombre || "");
      setEmailAdmin(admin.correo || "");
      setTelefonoAdmin(admin.celular || "");
      
    } catch (error) {
      console.error('Error al cargar datos del administrador:', error);
      setError(error.message || 'Error al cargar los datos del administrador');
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar cambios del perfil
  const guardarCambiosPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const adminId = getAdminId();
      
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado');
      }
      
      setAdminData(prev => ({
        ...prev,
        nombre: nombreAdmin,
        correo: emailAdmin,
        celular: telefonoAdmin
      }));
      
      setModoEdicion(false);
      setSuccessMessage('Datos del perfil actualizados exitosamente');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError('Error al guardar los cambios del perfil');
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar contraseña
  const cambiarContrasena = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const adminId = getAdminId();
      
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado');
      }
      
      await AdminService.changePassword(adminId, contrasenaActual, nuevaPassword);
      
      setContrasenaActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
      
      setSuccessMessage('Contraseña cambiada exitosamente');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      let errorMessage = 'Error al cambiar la contraseña';
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Contraseña actual incorrecta. Verifica que hayas ingresado la contraseña correcta.';
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        errorMessage = 'Datos de contraseña inválidos. Verifica que la nueva contraseña tenga al menos 6 caracteres.';
      }
      
      setError(errorMessage);
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar logs desde la API
  const cargarLogs = async (page = 1) => {
    try {
      setLogsLoading(true);
      setLogsError(null);
      
      const filtros = {
        page,
        limit: 50,
        ...(accionFiltro && { accion: accionFiltro }),
        ...(tablaFiltro && { tabla_afectada: tablaFiltro }),
        ...(fechaInicioFiltro && { fecha_inicio: fechaInicioFiltro }),
        ...(fechaFinFiltro && { fecha_fin: fechaFinFiltro }),
        ...(usuarioFiltro && { id_usuario: parseInt(usuarioFiltro) }),
        ...(busquedaLogs && { search: busquedaLogs })
      };

      const response = await LogsService.getLogs(filtros);
      
      setLogs(response.logs);
      setLogsStats(response.estadisticas);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
      setTotalLogs(response.pagination.total_logs);
      
    } catch (error) {
      console.error('Error al cargar logs:', error);
      setLogsError(error.message || 'Error al cargar los logs del sistema');
    } finally {
      setLogsLoading(false);
    }
  };

  // Función para aplicar filtros de logs
  const aplicarFiltrosLogs = () => {
    setCurrentPage(1);
    cargarLogs(1);
  };

  // Función para cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
      cargarLogs(nuevaPagina);
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear último acceso
  const formatearUltimoAcceso = (fecha) => {
    if (!fecha) return 'No registrado';
    const ahora = new Date();
    const fechaAcceso = new Date(fecha);
    const diferencia = ahora - fechaAcceso;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    return `Hace ${dias} días`;
  };

  return {
    // Estados
    adminData,
    loading,
    error,
    successMessage,
    modoEdicion,
    nombreAdmin,
    emailAdmin,
    telefonoAdmin,
    contrasenaActual,
    nuevaPassword,
    confirmarPassword,
    contrasenaValida,
    activeTab,
    showCurrent,
    showNew,
    showConfirm,
    data,
    busqueda,
    tipo,
    estado,
    backupData,
    logs,
    logsLoading,
    logsError,
    logsStats,
    currentPage,
    totalPages,
    totalLogs,
    accionFiltro,
    tablaFiltro,
    fechaInicioFiltro,
    fechaFinFiltro,
    usuarioFiltro,
    busquedaLogs,
    isAuthenticated,
    
    // Setters
    setModoEdicion,
    setNombreAdmin,
    setEmailAdmin,
    setTelefonoAdmin,
    setContrasenaActual,
    setNuevaPassword,
    setConfirmarPassword,
    setActiveTab,
    setShowCurrent,
    setShowNew,
    setShowConfirm,
    setBusqueda,
    setTipo,
    setEstado,
    setAccionFiltro,
    setTablaFiltro,
    setFechaInicioFiltro,
    setFechaFinFiltro,
    setUsuarioFiltro,
    setBusquedaLogs,
    
    // Funciones
    cargarDatosAdmin,
    guardarCambiosPerfil,
    cambiarContrasena,
    cargarLogs,
    aplicarFiltrosLogs,
    cambiarPagina,
    cerrarSesion,
    formatearFecha,
    formatearUltimoAcceso,
    limpiarFiltros,
    limpiarFiltrosLogs,
    getAdminId
  };
}
