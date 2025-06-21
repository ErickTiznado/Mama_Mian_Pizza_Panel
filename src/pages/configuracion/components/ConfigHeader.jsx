import React from 'react';
import {
  Settings,
  User,
  Lock,
  Loader,
  AlertTriangle
} from "lucide-react";

function ConfigHeader({ 
  adminData, 
  loading, 
  error, 
  isAuthenticated, 
  cargarDatosAdmin 
}) {
  return (
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

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-content">
            <Loader className="loading-spinner" size={24} />
            <span className="loading-text">Cargando datos del administrador...</span>
          </div>
        </div>
      )}

      {/* Unauthenticated State */}
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

      {/* Error State */}
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
      )}
    </div>
  );
}

export default ConfigHeader;
