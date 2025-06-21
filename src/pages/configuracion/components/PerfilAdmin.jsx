import React from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  X,
  Save
} from "lucide-react";

function PerfilAdmin({
  adminData,
  loading,
  modoEdicion,
  setModoEdicion,
  nombreAdmin,
  setNombreAdmin,
  emailAdmin,
  setEmailAdmin,
  telefonoAdmin,
  setTelefonoAdmin,
  guardarCambiosPerfil,
  formatearFecha,
  formatearUltimoAcceso
}) {
  return (
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
  );
}

export default PerfilAdmin;
