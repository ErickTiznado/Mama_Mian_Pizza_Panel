import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  X,
  Save,
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader,
  LogOut
} from 'lucide-react';
import AdminService from '../../../services/AdminService';

const CuentaTab = ({ 
  adminData, 
  user, 
  loading, 
  error, 
  successMessage, 
  setError, 
  setSuccessMessage,
  cargarDatosAdmin,
  logout 
}) => {
  // Estados de edición de perfil
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [emailAdmin, setEmailAdmin] = useState("");
  const [telefonoAdmin, setTelefonoAdmin] = useState("");

  // Estados de cambio de contraseña
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Estados para mostrar/ocultar contraseñas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
  // Función para guardar cambios del perfil
  const guardarCambiosPerfil = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      const adminId = getAdminId();
      if (!adminId) {
        throw new Error('No se pudo obtener el ID del administrador');
      }

      const datosActualizados = {
        nombre: nombreAdmin.trim(),
        correo: emailAdmin.trim(),
        celular: telefonoAdmin.trim()
      };

      const response = await AdminService.updateAdmin(adminId, datosActualizados);
      
      setSuccessMessage('Perfil actualizado correctamente');
      setModoEdicion(false);
      // Recargar datos del administrador
      await cargarDatosAdmin();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError(error.message || 'Error al actualizar el perfil');
    }
  };
  // Función para cambiar contraseña
  const cambiarContrasena = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      const adminId = getAdminId();
      if (!adminId) {
        throw new Error('No se pudo obtener el ID del administrador');
      }

      const response = await AdminService.changePassword(adminId, contrasenaActual, nuevaPassword);

      setSuccessMessage('Contraseña actualizada correctamente');
      // Limpiar campos
      setContrasenaActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.message || 'Error al cambiar la contraseña');
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
    if (!fecha) return 'No disponible';
    const ahora = new Date();
    const fechaAcceso = new Date(fecha);
    const diferencia = ahora - fechaAcceso;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    return `Hace ${dias} días`;
  };
  // Efecto para inicializar datos del formulario cuando se entra en modo edición
  useEffect(() => {
    if (modoEdicion && adminData) {
      setNombreAdmin(adminData.nombre || '');
      setEmailAdmin(adminData.correo || '');
      setTelefonoAdmin(adminData.celular || '');
    }
  }, [modoEdicion, adminData]);

  return (
    <div className="account-tab-content">
      <div className="account-optimized-layout">
        <div className="account-main-column">
          {/* Panel de información personal */}
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

            {/* Mensajes de éxito y error */}
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
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna lateral */}
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
    </div>
  );
};

export default CuentaTab;
