import { useState, useEffect } from 'react';
import {
  Settings,
  User,
  AlertTriangle,
  Loader,
  Lock,
  Activity,
  FileText,
  DatabaseBackup,
  Edit,
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminService from '../../services/AdminService';
import LogsService from '../../services/LogsService';
import "./configuracion.css";

// Importaciones de los componentes modularizados
import HistorialTab from './components/HistorialTab';
import LogsTab from './components/LogsTab';
import ConfigHeader from './components/ConfigHeader';
import TabNavigation from './components/TabNavigation';
import CuentaTab from './components/CuentaTab';
import BackupTab from './components/BackupTab';

function ConfiguracionAdmin() {  // Hook de autenticación
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

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

  // Validación de contraseña
  const contrasenaValida =
    contrasenaActual.trim().length >= 6 &&
    nuevaPassword.trim().length >= 6 &&
    confirmarPassword.trim().length >= 6 &&
    nuevaPassword === confirmarPassword;

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
  
  // Funciones utilitarias
  const limpiarFiltros = () => {
    setBusqueda("");
    setTipo("");
    setEstado("");
  };

  // Funciones para limpiar filtros de logs
  const limpiarFiltrosLogs = () => {
    setAccionFiltro("");
    setTablaFiltro("");
    setFechaInicioFiltro("");
    setFechaFinFiltro("");
    setUsuarioFiltro("");
    setBusquedaLogs("");
    setCurrentPage(1);
  };
  
  // Función auxiliar para obtener el ID del administrador
  const getAdminId = () => {
    if (!user) return null;
    return user.id_admin;
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

      console.log('Cargando logs con filtros:', filtros);

      const response = await LogsService.getLogs(filtros);
      
      setLogs(response.logs);
      setLogsStats(response.estadisticas);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
      setTotalLogs(response.pagination.total_logs);
      
      console.log('Logs cargados exitosamente:', response);
      
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
    // Función para cargar datos del administrador
  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
        // Esperar a que la autenticación esté completamente cargada
      if (authLoading) {
        console.log('Esperando a que termine la carga de autenticación...');
        return;
      }
      
      const adminId = getAdminId();
      
      console.log('Estado de autenticación:', { isAuthenticated, user, adminId });
      
      // Verificar que el usuario esté autenticado y tenga un ID
      if (!isAuthenticated) {
        throw new Error('Usuario no autenticado');
      }
      
      if (!adminId) {
        console.log('Estructura del usuario:', user);
        throw new Error('ID de administrador no disponible en los datos del usuario');
      }
      
      console.log('Cargando datos para el administrador ID:', adminId);
      
      // Obtener datos del administrador logueado
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
      
      // Verificar que el usuario esté autenticado
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado');
      }
      
      // Preparar los datos actualizados
      const datosActualizados = {
        nombre: nombreAdmin.trim(),
        correo: emailAdmin.trim(),
        celular: telefonoAdmin.trim()
      };
      
      // Enviar solicitud de actualización
      const adminActualizado = await AdminService.updateAdmin(adminId, datosActualizados);
      
      // Actualizar el estado con los nuevos datos
      setAdminData({
        ...adminData,
        ...datosActualizados
      });
      
      // Desactivar modo de edición y mostrar mensaje de éxito
      setModoEdicion(false);
      setSuccessMessage('Perfil actualizado correctamente');
      
      // Eliminar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error al guardar cambios del perfil:', error);
      setError(error.message || 'Error al actualizar el perfil');
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
      
      // Verificar que el usuario esté autenticado
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado');
      }
      
      // Verificar que las contraseñas sean válidas
      if (!contrasenaValida) {
        throw new Error('Las contraseñas no cumplen con los requisitos o no coinciden');
      }
        // Enviar solicitud de cambio de contraseña
      await AdminService.changePassword(adminId, contrasenaActual, nuevaPassword);
      
      // Limpiar los campos de contraseña
      setContrasenaActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Contraseña actualizada correctamente');
      
      // Eliminar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError(error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };
  
  // Función para formatear último acceso
  const formatearUltimoAcceso = (fecha) => {
    if (!fecha) return 'No disponible';
    
    const ahora = new Date();
    const fechaAcceso = new Date(fecha);
    const diferencia = ahora - fechaAcceso;
    
    // Menos de 24 horas
    if (diferencia < 86400000) {
      const horas = Math.floor(diferencia / 3600000);
      
      if (horas < 1) {
        const minutos = Math.floor(diferencia / 60000);
        return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
      }
      
      return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
    
    // Menos de 7 días
    if (diferencia < 604800000) {
      const dias = Math.floor(diferencia / 86400000);
      return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
    
    // Más de 7 días
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return fechaAcceso.toLocaleDateString('es-ES', opciones);
  };
  
  // Función para cerrar sesión
  const cerrarSesion = () => {
    logout();
  };
  // Cargar datos cuando se monta el componente
  useEffect(() => {
    // Solo cargar datos si la autenticación ha terminado de cargar y el usuario está autenticado
    if (!authLoading && isAuthenticated) {
      cargarDatosAdmin();
    }
    // Simulamos datos de historial (en un caso real, vendría de una API)
    setData([
      {
        id: 1,
        type: "seguridad",
        action: "Cambio de contraseña",
        description: "Se actualizó la contraseña del administrador principal",
        date: "2023-06-15T10:30:00",
        user: "Admin",
        state: "completado"
      },
      {
        id: 2,
        type: "pedido",
        action: "Cancelación de pedido",
        description: "Se canceló el pedido #1234 por solicitud del cliente",
        date: "2023-06-14T14:45:00",
        user: "Admin",
        state: "completado"
      },
      {
        id: 3,
        type: "producto",
        action: "Actualización de inventario",
        description: "Se actualizó el stock de ingredientes en el inventario",
        date: "2023-06-13T09:15:00",
        user: "Admin",
        state: "completado"
      },
      {
        id: 4,
        type: "backup",
        action: "Backup automático",
        description: "Se realizó un backup automático de la base de datos",
        date: "2023-06-12T23:00:00",
        user: "Sistema",
        state: "completado"
      },
      {
        id: 5,
        type: "seguridad",
        action: "Intento de acceso fallido",
        description: "3 intentos fallidos de acceso desde IP desconocida",
        date: "2023-06-12T16:20:00",
        user: "Sistema",
        state: "alerta"
      },
      // Más entradas de historial...
    ]);

    // Simulamos datos de backup (en un caso real, vendría de una API)
    setBackupData([
      {
        id: 1,
        nombre: "backup_mamapizza_completo_20230615.sql",
        descripcion: "Backup completo de la base de datos",
        tipo: "Completo", 
        tamaño: "45.7 MB",
        fecha: "15/06/2023 23:00",
        estado: "Completado"
      },
      {
        id: 2,
        nombre: "backup_mamapizza_pedidos_20230614.sql",
        descripcion: "Backup de la tabla de pedidos",
        tipo: "Parcial",
        tamaño: "12.3 MB",
        fecha: "14/06/2023 23:00",
        estado: "Completado"
      },
      {
        id: 3,
        nombre: "backup_mamapizza_clientes_20230613.sql",
        descripcion: "Backup de la información de clientes",
        tipo: "Parcial",
        tamaño: "8.5 MB",
        fecha: "13/06/2023 23:00",
        estado: "Completado"
      },
      {
        id: 4,
        nombre: "backup_mamapizza_completo_20230610.sql",
        descripcion: "Backup completo de la base de datos",
        tipo: "Completo",
        tamaño: "44.2 MB",
        fecha: "10/06/2023 23:00",
        estado: "Completado"
      }    ]);
    
  }, [authLoading, isAuthenticated]);
  
  // Cargar logs cuando se cambia a esa pestaña
  useEffect(() => {
    if (activeTab === 'logs' && isAuthenticated) {
      cargarLogs();
    }
  }, [activeTab, isAuthenticated]);
  
  return (
    <div className="config-container">
      {/* Header principal */}
      <ConfigHeader />
      
      {/* Estados de carga y error */}
      {loading && (
        <div className="loading-state">
          <Loader className="loading-spinner" />
          <p>Cargando información...</p>
        </div>
      )}
      
      {error && (
        <div className="error-state">
          <div className="error-content">
            <AlertTriangle size={48} className="error-icon" />
            <h3>Se produjo un error</h3>
            <p>{error}</p>
            <button 
              onClick={cargarDatosAdmin}
              className="alert-action-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {!loading && !error && isAuthenticated && adminData && (
        <div className="config-content-background">
          {/* Tabs mejorados */}
          <div className="tabs-container">
            <div className="tabs">
              {[
                { key: "cuenta", label: "Mi Cuenta", icon: User, description: "Perfil y seguridad" },
                { key: "historial", label: "Historial", icon: Activity, description: "Actividad reciente" },
                { key: "logs", label: "Logs del Sistema", icon: FileText, description: "Logs detallados" },
                { key: "backup", label: "Backups", icon: DatabaseBackup, description: "Respaldos del sistema" },
              ].map(({ key, label, icon: Icon, description }) => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon size={18} className="tab-icon" />
                  <div className="tab-content">
                    <span className="tab-label">{label}</span>
                    <span className="tab-description">{description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="config-panels">
            {/* TAB: CUENTA */}
            {activeTab === "cuenta" && (
              <CuentaTab
                adminData={adminData}
                loading={loading}
                error={error}
                successMessage={successMessage}
                modoEdicion={modoEdicion}
                setModoEdicion={setModoEdicion}
                nombreAdmin={nombreAdmin}
                setNombreAdmin={setNombreAdmin}
                emailAdmin={emailAdmin}
                setEmailAdmin={setEmailAdmin}
                telefonoAdmin={telefonoAdmin}
                setTelefonoAdmin={setTelefonoAdmin}
                guardarCambiosPerfil={guardarCambiosPerfil}
                formatearFecha={formatearFecha}
                formatearUltimoAcceso={formatearUltimoAcceso}
                contrasenaActual={contrasenaActual}
                setContrasenaActual={setContrasenaActual}
                nuevaPassword={nuevaPassword}
                setNuevaPassword={setNuevaPassword}
                confirmarPassword={confirmarPassword}
                setConfirmarPassword={setConfirmarPassword}
                contrasenaValida={contrasenaValida}
                showCurrent={showCurrent}
                setShowCurrent={setShowCurrent}
                showNew={showNew}
                setShowNew={setShowNew}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                cambiarContrasena={cambiarContrasena}
                cerrarSesion={cerrarSesion}
              />
            )}
            
            {/* TAB: HISTORIAL */}
            {activeTab === "historial" && (
              <HistorialTab
                data={data}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                tipo={tipo}
                setTipo={setTipo}
                estado={estado}
                setEstado={setEstado}
                limpiarFiltros={limpiarFiltros}
              />
            )}
            
            {/* TAB: LOGS */}
            {activeTab === "logs" && (
              <LogsTab
                logsStats={logsStats}
                cargarLogs={cargarLogs}
                currentPage={currentPage}
                limpiarFiltrosLogs={limpiarFiltrosLogs}
                busquedaLogs={busquedaLogs}
                setBusquedaLogs={setBusquedaLogs}
                accionFiltro={accionFiltro}
                setAccionFiltro={setAccionFiltro}
                tablaFiltro={tablaFiltro}
                setTablaFiltro={setTablaFiltro}
                usuarioFiltro={usuarioFiltro}
                setUsuarioFiltro={setUsuarioFiltro}
                fechaInicioFiltro={fechaInicioFiltro}
                setFechaInicioFiltro={setFechaInicioFiltro}
                fechaFinFiltro={fechaFinFiltro}
                setFechaFinFiltro={setFechaFinFiltro}
                aplicarFiltrosLogs={aplicarFiltrosLogs}
                logsError={logsError}
                logsLoading={logsLoading}
                logs={logs}
                totalLogs={totalLogs}
                totalPages={totalPages}
                cambiarPagina={cambiarPagina}
              />
            )}
            
            {/* TAB: BACKUP */}
            {activeTab === "backup" && (
              <BackupTab
                backupData={backupData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionAdmin;
