import React from 'react';
import {
  LogOut
} from "lucide-react";
import './SesionAdmin.css';

function SesionAdmin({ cerrarSesion }) {
  return (
    <div className="panel-session modern-card">
      <div className="panel-header">
        <div className="panel-title-section">
          <LogOut size={24} className=" logout" />
          <div>
            <h2 className="panel-title">Control de Sesión</h2>
            <p className="panel-subtitle">Administra tu sesión de forma segura</p>
          </div>
        </div>
      </div>

      <div className="session-content">
        {/* Status de sesión */}
        <div className="session-status">
          <div className="status-indicator active">
            <div className="status-dot"></div>
            <span>Sesión Activa</span>
          </div>
        </div>        {/* Acciones de sesión */}
        <div className="session-actions">
          <button
            className="btn-logout-primary"
            onClick={cerrarSesion}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SesionAdmin;
