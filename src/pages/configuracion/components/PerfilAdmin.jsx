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
import './PerfilAdmin.css';

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
          <User size={24} className="" />
          <div>
            <h2 className="panel-title">Información Personal</h2>
            <p className="panel-subtitle">Gestiona tu información de perfil</p>
          </div>
        </div>        <button
          className={`edit-toggle-btn ${modoEdicion ? 'editing' : ''}`}
          onClick={() => setModoEdicion(!modoEdicion)}
        >
          {modoEdicion ? (
            <>
              <X size={20} />
              Cancelar
            </>
          ) : (
            <>
              <Edit size={20} />
              Editar
            </>
          )}
        </button>
      </div>
      
      <div className="panel-content">        {!modoEdicion ? (
          <div className="profile-unified-container">
            <div className="profile-unified-section">
              {/* Header con avatar, nombre y rol */}
              <div className="profile-header-info">
                <div className="profile-avatar">
                  <User size={48} />
                </div>
                <div className="profile-basic-info">
                  <h3 className="profile-name">{adminData?.nombre || 'Usuario'}</h3>
                  <span className={`status-badge ${adminData?.rol === 'super_admin' ? 'super-admin' : 'admin'}`}>
                    {adminData?.rol === 'super_admin' ? 'Dueño' : 'Administrador'}
                  </span>
                </div>
              </div>
              
              {/* Información adicional integrada */}
              <div className="profile-additional-info">                <div className="info-item">
                  <Mail size={20} className="" />
                  <div className="info-content">
                    <label>Correo electrónico</label>
                    <span>{adminData?.correo || 'No disponible'}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <Phone size={20} className="" />
                  <div className="info-content">
                    <label>Teléfono</label>
                    <span>{adminData?.celular || 'No disponible'}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <Calendar size={20} className="" />
                  <div className="info-content">
                    <label>Miembro desde</label>
                    <span>{formatearFecha(adminData?.fecha_creacion)}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <Clock size={20} className="" />
                  <div className="info-content">
                    <label>Último acceso</label>
                    <span>{formatearUltimoAcceso(adminData?.ultimo_acceso)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>) : (
          <div className="profile-edit-container">
            <div className="edit-form-header">
              <h3>Editar Información Personal</h3>
              <p>Actualiza tu información de perfil</p>
            </div>
            
            <div className="profile-edit-form">
              <div className="form-grid">                <div className="form-group">
                  <label className="form-label">
                    <User size={20} />
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
                    <Mail size={20} />
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
                    <Phone size={20} />
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
              </div>              <div className="form-actions">
                <button
                  className="btn-primary"
                  onClick={guardarCambiosPerfil}
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setModoEdicion(false)}
                >
                  <X size={20} />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>    </div>
  );
}

export default PerfilAdmin;
