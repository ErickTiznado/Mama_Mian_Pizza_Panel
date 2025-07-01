import React from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  X,
  Save,
  LogOut
} from "lucide-react";
import PerfilAdmin from './PerfilAdmin';
import CambiarContrasena from './CambiarContrasena';
import SesionAdmin from './SesionAdmin';
import './CuentaTab.css';

function CuentaTab({ 
  adminData, 
  loading, 
  error, 
  successMessage, 
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
  formatearUltimoAcceso,
  // Password change props
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
  cerrarSesion
}) {
  return (
    <div className="cuenta-tab-wrapper">      {/* Header simplificado */}
      <div className="cuenta-header">
        <div className="cuenta-header-content">
          <div className="cuenta-header-icon-container">
            <User size={28} className="cuenta-header-icon" />
          </div>
          <div className="cuenta-header-text">
            <h1 className="cuenta-title">Mi Cuenta</h1>
            <p className="cuenta-subtitle">Gestiona tu información personal y preferencias</p>
          </div>
          <div className="cuenta-header-status">
            <div className="admin-badge">
              <span className="admin-role">{adminData?.rol === 'super_admin' ? 'Dueño' : 'Administrador'}</span>
            </div>
          </div>
        </div>
      </div>{/* Layout principal simplificado */}
      <div className="cuenta-layout-grid">
        {/* Columna principal - Información y seguridad */}
        <div className="cuenta-main-section">
          <div className="cuenta-panels-container">
            
            {/* Información Personal */}
            <div className="cuenta-panel-wrapper">
              <PerfilAdmin
                adminData={adminData}
                loading={loading}
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
              />
            </div>

            {/* Seguridad */}
            <div className="cuenta-panel-wrapper">
              <CambiarContrasena
                successMessage={successMessage}
                error={error}
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
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Sidebar - Control de sesión y información */}
        <div className="cuenta-sidebar-section">
          <div className="cuenta-sidebar-sticky">
            {/* Session Control */}
            <SesionAdmin cerrarSesion={cerrarSesion} />
            
            {/* Quick Info Panel */}
            <div className="sidebar-info-panel">
              <div className="quick-info-content">
                <div className="info-stat">
                  <span className="stat-label">Última actualización</span>
                  <span className="stat-value">{formatearUltimoAcceso(adminData?.ultimo_acceso)}</span>
                </div>
                <div className="info-stat">
                  <span className="stat-label">Miembro desde</span>
                  <span className="stat-value">{formatearFecha(adminData?.fecha_creacion)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuentaTab;
