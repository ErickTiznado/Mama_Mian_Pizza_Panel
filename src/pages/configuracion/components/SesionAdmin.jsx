import React from 'react';
import {
  LogOut,
  AlertTriangle
} from "lucide-react";

function SesionAdmin({ cerrarSesion }) {
  return (
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
  );
}

export default SesionAdmin;
