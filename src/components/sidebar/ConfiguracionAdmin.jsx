import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Lock, HelpCircle, Activity, DatabaseBackup, Eye, EyeOff,Shield, AlertTriangle,CheckCircle   } from "lucide-react";
import "./configuracion.css";

function ConfiguracionAdmin() {
  const [activeTab, setActiveTab] = useState("cuenta");
  const [showCurrent, setShowCurrent] = useState(false);
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);


  return (
    <div className="config-wrapper">
      {/* Encabezado */}
      <div className="config-header-section">
        <h1 className="config-title">
          <Settings className="config-icon" /> Configuración del Administrador
        </h1>
        <p className="config-subtitle">
          Gestiona la configuración de tu cuenta, soporte, historial y backups
        </p>
        <div className="config-divider" />
      </div>

      {/* Fondo más claro */}
      <div className="config-content-background">
        {/* Tabs */}
       <div className="tabs">
  <button
    className={`tab ${activeTab === "cuenta" ? "active" : ""}`}
    onClick={() => setActiveTab("cuenta")}
  >
    <Lock size={16} style={{ marginRight: "6px" }} />
    Cuenta
  </button>

  <button
    className={`tab ${activeTab === "soporte" ? "active" : ""}`}
    onClick={() => setActiveTab("soporte")}
  >
    <HelpCircle size={16} style={{ marginRight: "6px" }} />
    Soporte
  </button>

  <button
    className={`tab ${activeTab === "historial" ? "active" : ""}`}
    onClick={() => setActiveTab("historial")}
  >
    <Activity size={16} style={{ marginRight: "6px" }} />
    Historial
  </button>

  <button
    className={`tab ${activeTab === "backup" ? "active" : ""}`}
    onClick={() => setActiveTab("backup")}
  >
    <DatabaseBackup size={16} style={{ marginRight: "6px" }} />
    Backup
  </button>
</div>


        {/* Contenido de la pestaña activa */}
        <div className="config-panels">
          {/* Cambiar contraseña */}
        {/* Cambiar contraseña */}
<div className="panel">
  <h2 className="panel-title">
    <Lock size={20} style={{ marginRight: "8px", color: "#f97316" }} />
    Cambiar Contraseña
  </h2>

  <label>Contraseña Actual</label>
  <div className="password-input">
    <input
      type={showCurrent ? "text" : "password"}
      placeholder="Ingresa tu contraseña actual"
    />
    <span onClick={() => setShowCurrent(!showCurrent)}>
      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>

  <label>Nueva Contraseña</label>
  <div className="password-input">
    <input
      type={showNew ? "text" : "password"}
      placeholder="Ingresa tu nueva contraseña"
    />
    <span onClick={() => setShowNew(!showNew)}>
      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>

  <label>Confirmar Nueva Contraseña</label>
  <div className="password-input">
    <input
      type={showConfirm ? "text" : "password"}
      placeholder="Confirma tu nueva contraseña"
    />
    <span onClick={() => setShowConfirm(!showConfirm)}>
      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>

  <button className="btn-orange">Cambiar Contraseña</button>
</div>


          {/* Seguridad */}
          <div className="panel">
            <h2 className="panel-title">
  <Shield size={20} style={{ marginRight: "8px", color: "#f97316" }} />
  Configuración de Seguridad
</h2>


            <div className="security-box blue">
  <CheckCircle size={18} style={{ marginRight: "8px", color: "white" }} />
  Tu cuenta está protegida con las mejores prácticas de seguridad.
</div>


            <div className="security-item">
              <div>
                <strong>Autenticación de dos factores</strong>
                <p>Protege tu cuenta con un segundo factor</p>
              </div>
              <span className="badge green">Activo</span>
            </div>

            <div className="security-item">
              <div>
                <strong>Sesiones activas</strong>
                <p>Gestiona tus sesiones abiertas</p>
              </div>
              <button className="btn-black">Ver sesiones</button>
            </div>

            <div className="security-item">
              <div>
                <strong>Notificaciones de seguridad</strong>
                <p>Recibe alertas de actividad sospechosa</p>
              </div>
              <span className="badge green">Activo</span>
            </div>

           <div className="alert-box orange">
  <AlertTriangle size={18} style={{ marginRight: "8px", color: "white" }} />
  <strong>Recomendación:</strong> Cambia tu contraseña cada 90 días
  y usa una contraseña única para esta cuenta.
</div>

          </div>
        </div>

        {/* Información de la cuenta */}
         
<div className="panelaccount-info">
  <h2 className="panel-title">Información de la Cuenta</h2>

  <div className="account-details">
    <div className="detail-block">
      <p className="label">Usuario</p>
      <p className="value">admin@mitienda.com</p>
    </div>
    <div className="detail-block">
      <p className="label">Último acceso</p>
      <p className="value">Hoy, 14:30</p>
    </div>
  </div>

  <div className="account-role">
    <span className="label">Rol:</span>
    <span className="admin-tag">Administrador</span>
  </div>
</div>

      </div>
    </div>
  );
}

export default ConfiguracionAdmin;
