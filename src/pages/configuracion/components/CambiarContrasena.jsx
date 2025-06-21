import React from 'react';
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Save,
  Loader
} from "lucide-react";

function CambiarContrasena({
  successMessage,
  error,
  contrasenaActual,
  setContrasenaActual,
  nuevaPassword,
  setNuevaPassword,
  confirmarPassword,
  setConfirmarPassword,
  contrasenaValida,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  cambiarContrasena,
  loading
}) {
  
  const limpiarCampos = () => {
    setContrasenaActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
  };

  return (
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
            onClick={limpiarCampos}
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
  );
}

export default CambiarContrasena;
