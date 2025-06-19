import { useEffect, useState } from 'react';
import {
  Settings,
  Lock,
  Activity,
  DatabaseBackup,
  Filter,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  ShoppingCart,
  Package,
  Download,
  RefreshCw,
  Calendar,
  User,
  Edit,
  Mail,
  Phone,
  Clock,
  Loader,
  Save,
  X,
  LogOut
} from "lucide-react";
import "./configuracion.css";
import AdminService from "../../services/AdminService";
import { useAuth } from "../../context/AuthContext";



function ConfiguracionAdmin() {
  // Hook de autenticación
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
  const [backupData, setBackupData] = useState([]);  // Funciones utilitarias
  const limpiarFiltros = () => {
    setBusqueda("");
    setTipo("");
    setEstado("");
  };

  // Función auxiliar para obtener el ID del administrador
  const getAdminId = () => {
    if (!user) return null;
    return user.id_admin;
  };// Función para cargar datos del administrador
  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const adminId = getAdminId();
      
      // Verificar que el usuario esté autenticado y tenga un ID
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado o ID de administrador no disponible');
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
  };  // Función para guardar cambios del perfil
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
      
      // Aquí puedes implementar la llamada a la API para actualizar los datos
      // Por ejemplo: await AdminService.updateAdmin(adminId, { nombre: nombreAdmin, correo: emailAdmin, celular: telefonoAdmin });
      
      console.log('Guardando cambios para el administrador ID:', adminId);
      
      // Por ahora solo actualizamos el estado local
      setAdminData(prev => ({
        ...prev,
        nombre: nombreAdmin,
        correo: emailAdmin,
        celular: telefonoAdmin
      }));
      
      setModoEdicion(false);
      setSuccessMessage('Datos del perfil actualizados exitosamente');
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError('Error al guardar los cambios del perfil');
      
      // Ocultar error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
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
  };  // Función para cambiar contraseña
  const cambiarContrasena = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const adminId = getAdminId();
      
      if (!isAuthenticated || !adminId) {
        throw new Error('Usuario no autenticado');
      }
      
      // Llamada a la API para cambiar la contraseña
      await AdminService.changePassword(adminId, contrasenaActual, nuevaPassword);
      
      // Limpiar los campos después del cambio exitoso
      setContrasenaActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Contraseña cambiada exitosamente');
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      // Mostrar mensaje de error específico
      let errorMessage = 'Error al cambiar la contraseña';
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Contraseña actual incorrecta. Verifica que hayas ingresado la contraseña correcta.';
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        errorMessage = 'Datos de contraseña inválidos. Verifica que la nueva contraseña tenga al menos 6 caracteres.';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = 'No tienes permisos para cambiar la contraseña';
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Ocultar error después de 8 segundos
      setTimeout(() => {
        setError(null);
      }, 8000);
      
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Llamar a la función de logout del contexto de autenticación
      if (typeof logout === 'function') {
        logout();
      } else {
        // Fallback: limpiar localStorage y recargar la página
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const filtrados = data.filter((item) => {
    const coincideBusqueda =
      item.action.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.description.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = tipo ? item.type === tipo : true;
    const coincideEstado = estado ? item.state === estado : true;
    return coincideBusqueda && coincideTipo && coincideEstado;
  });  useEffect(() => {
    // Debug: Mostrar información del usuario logueado
    console.log('Usuario autenticado:', isAuthenticated);
    console.log('Datos del usuario:', user);
    console.log('ID del administrador detectado:', getAdminId());
    
    // Solo cargar datos si el usuario está autenticado
    if (isAuthenticated && getAdminId()) {
      cargarDatosAdmin();
    } else {
      setLoading(false);
      if (isAuthenticated) {
        setError('ID de administrador no disponible en los datos del usuario');
      } else {
        setError('Usuario no autenticado');
      }
    }
    
    // Datos simulados para historial
    const historialSimulado = [
      {
        time: "14:30:15",
        date: "2025-01-22",
        action: "Inicio de sesión",
        description: "Admin inició sesión en el sistema",
        type: "Autenticación",
        state: "Exitoso",
        ip: "192.168.1.100"
      },
      {
        time: "14:25:42",
        date: "2025-01-22",
        action: "Pedido actualizado",
        description: "Estado del pedido #P86SQ8F8 cambiado a 'Enviado'",
        type: "Pedido",
        state: "Exitoso",
        ip: "192.168.1.100"
      },
      {
        time: "09:15:22",
        date: "2025-01-22",
        action: "Intento de acceso fallido",
        description: "Intento de inicio con credenciales inválidas",
        type: "Autenticación",
        state: "Fallido",
        ip: "203.0.113.45"
      }
    ];

    // Datos simulados para backup
    const backupSimulado = [
      {
        id: 1,
        nombre: "backup_completo_2025-01-22.zip",
        descripcion: "Backup automático completo del sistema",
        tipo: "Completo",
        tamaño: "245.8 MB",
        fecha: "2025-01-22 03:00:00",
        estado: "Completado"
      },
      {
        id: 2,
        nombre: "backup_incremental_2025-01-21.zip",
        descripcion: "Backup incremental de cambios diarios",
        tipo: "Incremental",
        tamaño: "12.4 MB",
        fecha: "2025-01-21 03:00:00",
        estado: "Completado"
      },
      {
        id: 3,
        nombre: "backup_completo_2025-01-15.zip",
        descripcion: "Backup semanal completo",
        tipo: "Completo",
        tamaño: "238.2 MB",
        fecha: "2025-01-15 03:00:00",
        estado: "Completado"
      }
    ];

    setData(historialSimulado);
    setBackupData(backupSimulado);
  }, [isAuthenticated, user]);  return (
    <div className="config-wrapper">
      {/* Header mejorado */}
      <div className="config-header-section">
        <div className="config-header-content">
          <div className="config-title-container">
            <Settings className="config-icon" size={32} />
            <div>
              <h1 className="config-title">Configuración del Administrador</h1>
              <p className="config-subtitle">
                Gestiona la configuración de tu cuenta, historial y backups del sistema
              </p>
            </div>
          </div>
          
          {/* Badge de estado del usuario */}
          {adminData && (
            <div className="admin-status-badge">
              <div className="admin-avatar">
                <User size={20} />
              </div>
              <div className="admin-info">
                <span className="admin-name">{adminData.nombre}</span>
                <span className="admin-role">
                  {adminData.rol === 'super_admin' ? 'Super Administrador' : 'Administrador'}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="config-divider" />
      </div>      {/* Indicador de carga mejorado */}
      {loading && (
        <div className="loading-container">
          <div className="loading-content">
            <Loader className="loading-spinner" size={24} />
            <span className="loading-text">Cargando datos del administrador...</span>
          </div>
        </div>
      )}

      {/* Mensaje de usuario no autenticado mejorado */}
      {!isAuthenticated && !loading && (
        <div className="alert-container warning">
          <div className="alert-content">
            <Lock size={20} className="alert-icon" />
            <div>
              <h3>Acceso Restringido</h3>
              <p>Necesitas iniciar sesión para acceder a la configuración del administrador.</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error mejorado */}
      {error && isAuthenticated && (
        <div className="alert-container error">
          <div className="alert-content">
            <AlertTriangle size={20} className="alert-icon" />
            <div className="alert-text">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
            <button 
              onClick={cargarDatosAdmin}
              className="alert-action-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}      {/* Main Content */}
      {!loading && !error && isAuthenticated && adminData && (
        <div className="config-content-background">
          {/* Tabs mejorados */}
          <div className="tabs-container">
            <div className="tabs">
              {[
                { key: "cuenta", label: "Mi Cuenta", icon: User, description: "Perfil y seguridad" },
                { key: "historial", label: "Historial", icon: Activity, description: "Actividad reciente" },
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
          </div>        {/* Tab Content */}
        <div className="config-panels">          {/* TAB: CUENTA */}
          {activeTab === "cuenta" && (
            <div className="account-tab-content">
              {/* Layout optimizado en dos columnas */}
              <div className="account-optimized-layout">
                {/* Columna principal - Información y contraseña */}
                <div className="account-main-column">
                  {/* Panel de perfil mejorado */}
                  <div className="panel-perfil-admin modern-card">
                  <div className="panel-header">
                    <div className="panel-title-section">
                      <User size={24} className="panel-icon" />
                      <div>
                        <h2 className="panel-title">Información Personal</h2>
                        <p className="panel-subtitle">Gestiona tu información de perfil</p>
                      </div>
                    </div>
                    <button
                      className={`edit-toggle-btn ${modoEdicion ? 'editing' : ''}`}
                      onClick={() => setModoEdicion(!modoEdicion)}
                    >
                      {modoEdicion ? (
                        <>
                          <X size={16} />
                          Cancelar
                        </>
                      ) : (
                        <>
                          <Edit size={16} />
                          Editar
                        </>
                      )}
                    </button>
                  </div>

                  {!modoEdicion ? (
                    <div className="profile-display">
                      <div className="profile-avatar-section">
                        <div className="profile-avatar">
                          <User size={40} />
                        </div>
                        <div className="profile-status">
                          <span className={`status-badge ${adminData?.rol === 'super_admin' ? 'super-admin' : 'admin'}`}>
                            {adminData?.rol === 'super_admin' ? 'Super Administrador' : 'Administrador'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="profile-info-grid">
                        <div className="info-item">
                          <User size={16} className="info-icon" />
                          <div>
                            <label>Nombre completo</label>
                            <span>{adminData?.nombre || 'No disponible'}</span>
                          </div>
                        </div>
                        
                        <div className="info-item">
                          <Mail size={16} className="info-icon" />
                          <div>
                            <label>Correo electrónico</label>
                            <span>{adminData?.correo || 'No disponible'}</span>
                          </div>
                        </div>
                        
                        <div className="info-item">
                          <Phone size={16} className="info-icon" />
                          <div>
                            <label>Teléfono</label>
                            <span>{adminData?.celular || 'No disponible'}</span>
                          </div>
                        </div>
                        
                        <div className="info-item">
                          <Calendar size={16} className="info-icon" />
                          <div>
                            <label>Miembro desde</label>
                            <span>{formatearFecha(adminData?.fecha_creacion)}</span>
                          </div>
                        </div>
                        
                        <div className="info-item">
                          <Clock size={16} className="info-icon" />
                          <div>
                            <label>Último acceso</label>
                            <span>{formatearUltimoAcceso(adminData?.ultimo_acceso)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-edit-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">
                            <User size={16} />
                            Nombre completo
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={nombreAdmin}
                            onChange={(e) => setNombreAdmin(e.target.value)}
                            placeholder="Ingresa tu nombre completo"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            <Mail size={16} />
                            Correo electrónico
                          </label>
                          <input
                            type="email"
                            className="form-input"
                            value={emailAdmin}
                            onChange={(e) => setEmailAdmin(e.target.value)}
                            placeholder="Ingresa tu correo electrónico"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            <Phone size={16} />
                            Teléfono
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={telefonoAdmin}
                            onChange={(e) => setTelefonoAdmin(e.target.value)}
                            placeholder="Ingresa tu número de teléfono"
                          />
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          className="btn-primary"
                          onClick={guardarCambiosPerfil}
                          disabled={loading}
                        >
                          <Save size={16} />
                          {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                          className="btn-secondary" 
                          onClick={() => setModoEdicion(false)}
                        >
                          <X size={16} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel de cambio de contraseña */}
                <div className="panel-password-change modern-card">
                  <div className="panel-header">
                    <div className="panel-title-section">
                      <Lock size={24} className="panel-icon security" />
                      <div>
                        <h2 className="panel-title">Cambiar Contraseña</h2>
                        <p className="panel-subtitle">Actualiza tu contraseña para mantener tu cuenta segura</p>
                      </div>
                    </div>
                    <div className="security-badge">
                      <Shield size={16} />
                      <span>Cifrado 256-bit</span>
                    </div>
                  </div>

                  {/* Alertas mejoradas */}
                  {successMessage && (
                    <div className="alert-container success">
                      <div className="alert-content">
                        <CheckCircle size={20} className="alert-icon" />
                        <div className="alert-text">
                          <h4>¡Contraseña actualizada!</h4>
                          <p>{successMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="alert-container error">
                      <div className="alert-content">
                        <AlertTriangle size={20} className="alert-icon" />
                        <div className="alert-text">
                          <h4>Error al cambiar contraseña</h4>
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="password-form">
                    <div className="password-fields">
                      <div className="form-group">
                        <label className="form-label">
                          <Lock size={16} />
                          Contraseña actual
                        </label>
                        <div className="password-input-wrapper">
                          <input
                            type={showCurrent ? "text" : "password"}
                            className="form-input password-input"
                            placeholder="Ingresa tu contraseña actual"
                            value={contrasenaActual}
                            onChange={(e) => setContrasenaActual(e.target.value)}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowCurrent(!showCurrent)}
                          >
                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Lock size={16} />
                          Nueva contraseña
                        </label>
                        <div className="password-input-wrapper">
                          <input
                            type={showNew ? "text" : "password"}
                            className="form-input password-input"
                            placeholder="Ingresa tu nueva contraseña"
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowNew(!showNew)}
                          >
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {nuevaPassword && nuevaPassword.length < 6 && (
                          <div className="field-warning">
                            <AlertTriangle size={14} />
                            La contraseña debe tener al menos 6 caracteres
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Lock size={16} />
                          Confirmar nueva contraseña
                        </label>
                        <div className="password-input-wrapper">
                          <input
                            type={showConfirm ? "text" : "password"}
                            className="form-input password-input"
                            placeholder="Confirma tu nueva contraseña"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {nuevaPassword && confirmarPassword && nuevaPassword !== confirmarPassword && (
                          <div className="field-error">
                            <X size={14} />
                            Las contraseñas no coinciden
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="password-actions">
                      <button 
                        className="btn-secondary" 
                        onClick={() => {
                          setContrasenaActual("");
                          setNuevaPassword("");
                          setConfirmarPassword("");
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        disabled={loading}
                      >
                        <RefreshCw size={16} />
                        Limpiar
                      </button>
                      
                      <button
                        className="btn-primary"
                        disabled={!contrasenaValida || loading}
                        onClick={cambiarContrasena}
                      >
                        {loading ? (
                          <>
                            <Loader size={16} className="loading-spinner" />
                            Cambiando...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Cambiar Contraseña
                          </>
                        )}
                      </button>                    </div>
                  </div>
                </div>
                </div>

                {/* Columna lateral - Panel de logout */}
                <div className="account-sidebar-column">
                  {/* Panel de cerrar sesión */}
                  <div className="panel-logout modern-card">
                    <div className="panel-header">
                      <div className="panel-title-section">
                        <LogOut size={24} className="panel-icon logout" />
                        <div>
                          <h2 className="panel-title">Sesión</h2>
                          <p className="panel-subtitle">Administra tu sesión actual</p>
                        </div>
                      </div>
                    </div>

                    <div className="logout-content">
                      <div className="logout-info">
                        <div className="logout-warning">
                          <AlertTriangle size={20} className="warning-icon" />
                          <div className="warning-text">
                            <h4>Cerrar Sesión</h4>
                            <p>Al cerrar sesión perderás el acceso a la administración del sistema hasta que vuelvas a iniciar sesión.</p>
                          </div>
                        </div>
                      </div>

                      <div className="logout-actions">
                        <button
                          className="btn-logout"
                          onClick={cerrarSesion}
                        >
                          <LogOut size={16} />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}{activeTab === "historial" && (
            <div className="historial-layout">
              {/* Header section with filters */}
              <div className="historial-header">
                <div className="historial-title-section">
                  <Activity size={28} className="section-icon" />
                  <div>
                    <h2 className="section-title">Historial de Actividades</h2>
                    <p className="section-subtitle">Monitorea todas las acciones realizadas en el sistema</p>
                  </div>
                </div>
              </div>

              {/* Filters and search panel */}
              <div className="historial-controls modern-card compact">
                <div className="controls-grid">
                  <div className="search-group">
                    <label className="control-label">Buscar actividades</label>
                    <div className="search-input-wrapper">
                      <Search className="search-icon" size={16} />
                      <input
                        type="text"
                        placeholder="Buscar por acción o descripción..."
                        className="search-input"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <label className="control-label">Tipo de acción</label>
                    <select className="filter-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                      <option value="">Todos los tipos</option>
                      <option value="Autenticación">Autenticación</option>
                      <option value="Pedido">Pedido</option>
                      <option value="Inventario">Inventario</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label className="control-label">Estado</label>
                    <select className="filter-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                      <option value="">Todos los estados</option>
                      <option value="Exitoso">Exitoso</option>
                      <option value="Fallido">Fallido</option>
                    </select>
                  </div>
                  
                  <div className="filter-actions">
                    <button className="btn-clear-filters" onClick={limpiarFiltros}>
                      <Filter size={16} />
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics cards */}
              <div className="historial-stats">
                <div className="stat-card success">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <CheckCircle size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">{filtrados.filter(d => d.state === 'Exitoso').length}</span>
                      <span className="stat-description">Acciones Exitosas</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card error">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <AlertTriangle size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">{filtrados.filter(d => d.state === 'Fallido').length}</span>
                      <span className="stat-description">Acciones Fallidas</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card security">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <Shield size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">{filtrados.filter(d => d.type === 'Autenticación').length}</span>
                      <span className="stat-description">Eventos de Seguridad</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card total">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <Activity size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">{filtrados.length}</span>
                      <span className="stat-description">Total de Resultados</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity table */}
              <div className="historial-table-container modern-card">
                <div className="table-header">
                  <h3 className="table-title">Registro de Actividades</h3>
                  <span className="table-subtitle">{filtrados.length} resultados encontrados</span>
                </div>
                
                <div className="table-wrapper">
                  <table className="activity-table">
                    <thead>
                      <tr>
                        <th>Fecha y Hora</th>
                        <th>Acción</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Dirección IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrados.map((row, i) => (
                        <tr key={i} className="activity-row">
                          <td className="datetime-cell">
                            <div className="datetime-content">
                              <span className="date">{row.date}</span>
                              <span className="time">{row.time}</span>
                            </div>
                          </td>
                          <td className="action-cell">
                            <div className="action-content">
                              <span className="action-title">{row.action}</span>
                              <span className="action-description">{row.description}</span>
                            </div>
                          </td>
                          <td className="type-cell">
                            <span className={`type-badge ${row.type.toLowerCase().replace(/\s/g, '-')}`}>
                              {row.type === 'Autenticación' && <Lock size={14} />}
                              {row.type === 'Pedido' && <ShoppingCart size={14} />}
                              {row.type === 'Inventario' && <Package size={14} />}
                              {row.type === 'Backup' && <DatabaseBackup size={14} />}
                              {row.type === 'Configuración' && <Settings size={14} />}
                              {row.type === 'Seguridad' && <Shield size={14} />}
                              {row.type === 'Problema Técnico' && <AlertTriangle size={14} />}
                              {row.type}
                            </span>
                          </td>
                          <td className="status-cell">
                            <span className={`status-badge ${row.state.toLowerCase()}`}>
                              {row.state === 'Exitoso' && <CheckCircle size={14} />}
                              {row.state === 'Fallido' && <AlertTriangle size={14} />}
                              {row.state}
                            </span>
                          </td>
                          <td className="ip-cell">{row.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}          {activeTab === "backup" && (
            <div className="backup-layout">
              {/* Header section */}
              <div className="backup-header">
                <div className="backup-title-section">
                  <DatabaseBackup size={28} className="section-icon" />
                  <div>
                    <h2 className="section-title">Gestión de Backups</h2>
                    <p className="section-subtitle">Administra los respaldos del sistema y configura la programación automática</p>
                  </div>
                </div>
                <button className="btn-create-backup-header">
                  <Download size={20} />
                  Crear Backup Ahora
                </button>
              </div>

              {/* Status overview cards */}
              <div className="backup-overview">
                <div className="backup-status-card success">
                  <div className="status-card-content">
                    <div className="status-icon-wrapper">
                      <CheckCircle size={32} />
                    </div>
                    <div className="status-info">
                      <h3>Último Backup</h3>
                      <p className="status-time">Hace 6 horas</p>
                      <span className="status-detail">Backup completo exitoso</span>
                    </div>
                  </div>
                </div>
                
                <div className="backup-status-card info">
                  <div className="status-card-content">
                    <div className="status-icon-wrapper">
                      <DatabaseBackup size={32} />
                    </div>
                    <div className="status-info">
                      <h3>Espacio Utilizado</h3>
                      <p className="status-time">1.2 GB</p>
                      <span className="status-detail">De 10 GB disponibles</span>
                    </div>
                  </div>
                </div>
                
                <div className="backup-status-card warning">
                  <div className="status-card-content">
                    <div className="status-icon-wrapper">
                      <Clock size={32} />
                    </div>
                    <div className="status-info">
                      <h3>Próximo Backup</h3>
                      <p className="status-time">En 18 horas</p>
                      <span className="status-detail">Backup automático programado</span>
                    </div>
                  </div>
                </div>
                
                <div className="backup-status-card neutral">
                  <div className="status-card-content">
                    <div className="status-icon-wrapper">
                      <Calendar size={32} />
                    </div>
                    <div className="status-info">
                      <h3>Retención</h3>
                      <p className="status-time">30 días</p>
                      <span className="status-detail">Período de conservación</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup configuration panel */}
              <div className="backup-config modern-card">
                <div className="config-header">
                  <div className="config-title-group">
                    <Settings size={24} className="config-icon" />
                    <div>
                      <h3>Configuración de Backups</h3>
                      <p>Personaliza la frecuencia y tipos de respaldo</p>
                    </div>
                  </div>
                </div>
                
                <div className="config-options">
                  <div className="config-option">
                    <div className="option-info">
                      <h4>Backup Automático</h4>
                      <p>Respaldos programados diariamente</p>
                    </div>
                    <div className="option-control">
                      <span className="status-badge active">
                        <CheckCircle size={14} />
                        Activo
                      </span>
                    </div>
                  </div>
                  
                  <div className="config-option">
                    <div className="option-info">
                      <h4>Notificaciones</h4>
                      <p>Alertas sobre estado de backups</p>
                    </div>
                    <div className="option-control">
                      <span className="status-badge active">
                        <CheckCircle size={14} />
                        Habilitado
                      </span>
                    </div>
                  </div>
                  
                  <div className="config-option">
                    <div className="option-info">
                      <h4>Compresión</h4>
                      <p>Reducir tamaño de archivos de backup</p>
                    </div>
                    <div className="option-control">
                      <span className="status-badge active">
                        <CheckCircle size={14} />
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup history table */}
              <div className="backup-history modern-card">
                <div className="history-header">
                  <div className="history-title-group">
                    <Activity size={24} className="history-icon" />
                    <div>
                      <h3>Historial de Backups</h3>
                      <p>Registro completo de todos los respaldos realizados</p>
                    </div>
                  </div>
                  <div className="history-actions">
                    <button className="btn-download-all">
                      <Download size={16} />
                      Descargar Reporte
                    </button>
                  </div>
                </div>
                
                <div className="backup-table-wrapper">
                  <table className="backup-history-table">
                    <thead>
                      <tr>
                        <th>Archivo de Backup</th>
                        <th>Tipo</th>
                        <th>Tamaño</th>
                        <th>Fecha de Creación</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backupData.map((backup) => (
                        <tr key={backup.id} className="backup-row">
                          <td className="file-cell">
                            <div className="file-info">
                              <div className="file-icon">
                                <DatabaseBackup size={20} />
                              </div>
                              <div className="file-details">
                                <span className="file-name">{backup.nombre}</span>
                                <span className="file-description">{backup.descripcion}</span>
                              </div>
                            </div>
                          </td>
                          <td className="type-cell">
                            <span className={`backup-type-badge ${backup.tipo.toLowerCase()}`}>
                              <span className="type-indicator"></span>
                              {backup.tipo}
                            </span>
                          </td>
                          <td className="size-cell">
                            <span className="size-value">{backup.tamaño}</span>
                          </td>
                          <td className="date-cell">
                            <div className="date-info">
                              <Calendar size={14} className="date-icon" />
                              <span className="date-value">{backup.fecha}</span>
                            </div>
                          </td>
                          <td className="status-cell">
                            <span className="backup-status-badge completado">
                              <CheckCircle size={14} />
                              {backup.estado}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <div className="backup-row-actions">
                              <button className="action-btn download" title="Descargar backup">
                                <Download size={16} />
                              </button>
                              <button className="action-btn restore" title="Restaurar desde este backup">
                                <RefreshCw size={16} />
                              </button>
                              <button className="action-btn info" title="Ver detalles">
                                <Settings size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>)}
        </div>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionAdmin;
