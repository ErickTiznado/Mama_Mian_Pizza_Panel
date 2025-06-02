import React, { useState } from "react";
import {
  Settings,
  Lock,
  HelpCircle,
  Activity,
  DatabaseBackup,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import "./configuracion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane,faClock    } from "@fortawesome/free-regular-svg-icons"; // Regular

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";





function ConfiguracionAdmin() {
  const [activeTab, setActiveTab] = useState("cuenta");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estado para crear ticket
  const [asunto, setAsunto] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const formularioValido =
    asunto.trim() !== "" &&
    prioridad.trim() !== "" &&
    categoria.trim() !== "" &&
    descripcion.trim() !== "";

  return (
    <div className="config-wrapper">
      {/* Header */}
      <div className="config-header-section">
        <h1 className="config-title">
          <Settings className="config-icon" /> Configuración del Administrador
        </h1>
        <p className="config-subtitle">
          Gestiona la configuración de tu cuenta, soporte, historial y backups
        </p>
        <div className="config-divider" />
      </div>

      {/* Main Content */}
      <div className="config-content-background">
        {/* Tabs */}
        <div className="tabs">
          {[
            { key: "cuenta", label: "Cuenta", icon: Lock },
            { key: "soporte", label: "Soporte", icon: HelpCircle },
            { key: "historial", label: "Historial", icon: Activity },
            { key: "backup", label: "Backup", icon: DatabaseBackup },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`tab ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={16} style={{ marginRight: "6px" }} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="config-panels">
          {activeTab === "cuenta" && (
            <>
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
            </>
          )}

          {activeTab === "soporte" && (
            <>
             <div className="panel soporte-form">
  <h2 className="panel-title">
    <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "8px", color: "#f97316" }} />
    Crear Nuevo Ticket
  </h2>

  <label>Asunto</label>
  <input
    type="text"
    placeholder="Describe brevemente el problema"
    value={asunto}
    onChange={(e) => setAsunto(e.target.value)}
  />

  <div style={{ display: "flex", gap: "1rem" }}>
    <div style={{ flex: 1 }}>
      <label>Prioridad</label>
      <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
        <option value="">Selecciona prioridad</option>
        <option value="baja">🟢 Baja</option>
        <option value="media">🟡 Media</option>
        <option value="alta">🔴 Alta</option>
      </select>
    </div>
    <div style={{ flex: 1 }}>
      <label>Categoría</label>
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="">Selecciona categoría</option>
        <option>🛠️ Problema Técnico</option>
        <option>✨ Nueva Funcionalidad</option>
        <option>⚙️ Configuración</option>
        <option>🗄️ Backup/Restauración</option>
        <option>🔒 Seguridad</option>
        <option>❓ Otro</option>
      </select>
    </div>
  </div>

  <label>Descripción del Problema</label>
  <textarea
    placeholder="Describe detalladamente el problema..."
    value={descripcion}
    onChange={(e) => setDescripcion(e.target.value)}
  />

  <button
    className="btn-orange"
    style={{ marginTop: "1rem" }}
    disabled={!formularioValido}
  >
    <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "6px" }} />
    Enviar Ticket
  </button>
</div>


              <div className="panel soporte-tickets">
  <h2 className="panel-title">
    <FontAwesomeIcon icon={faClock} style={{ marginRight: "8px", color: "#f97316" }} />
    Tickets Anteriores
  </h2>

  {/* Ticket 1 */}
  <div className="ticket">
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <strong>Error en el sistema de pagos</strong>
        <p>#TK-001</p>
        <p>Creado: 2025-01-22</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span className="badge blue"><span className="dot blue" /> Abierto</span>
        <span className="badge red"><span className="dot red" /> Alta</span>
      </div>
    </div>
   <p className="ticket-update align-right">Actualizado: 2025-01-22</p>
  </div>

  {/* Ticket 2 */}
  <div className="ticket">
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <strong>Consulta sobre backup automático</strong>
        <p>#TK-002</p>
        <p>Creado: 2025-01-20</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span className="badge green"><span className="check">✔</span> Resuelto</span>
        <span className="badge yellow"><span className="dot yellow" /> Media</span>
      </div>
    </div>
   <p className="ticket-update align-right">Actualizado: 2025-01-22</p>
  </div>

  {/* Ticket 3 */}
  <div className="ticket">
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <strong>Solicitud de nueva funcionalidad</strong>
        <p>#TK-003</p>
        <p>Creado: 2025-01-18</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span className="badge orange"><span className="dot yellow" /> En Progreso</span>
        <span className="badge gray"><span className="dot gray" /> Baja</span>
      </div>
    </div>
  <p className="ticket-update align-right">Actualizado: 2025-01-22</p>

  </div>
</div>



              {/* Contacto */}
              <div className="panelaccount-info">
  <h2 className="panel-title">Información de Contacto</h2>
  <div className="contacto-grid">
    <div className="contact-card">
      <div className="icon-circle blue">
        <FontAwesomeIcon icon={faWhatsapp} />
      </div>
      <strong>Chat en Vivo</strong>
      <p className="text-muted">Lunes a Viernes, 9:00 - 18:00</p>
      <button className="btn-black">Iniciar Chat</button>
    </div>
    <div className="contact-card">
      <div className="icon-circle green">
        <FontAwesomeIcon icon={faPaperPlane} />
      </div>
      <strong>Email</strong>
      <p className="text-muted">soporte@mitienda.com</p>
      <button className="btn-black">Enviar Email</button>
    </div>
    <div className="contact-card">
      <div className="icon-circle orange">
        <FontAwesomeIcon icon={faTriangleExclamation} />
      </div>
      <strong>Emergencias</strong>
      <p className="text-muted">24/7 para problemas críticos</p>
      <button className="btn-black">Contactar</button>
    </div>
  </div>
</div>

            </>
          )}

          {activeTab === "historial" && (
            <p style={{ color: "#cbd5e1" }}>🕒 Aquí va el contenido de Historial</p>
          )}

          {activeTab === "backup" && (
            <p style={{ color: "#cbd5e1" }}>🗄️ Aquí va el contenido de Backup</p>
          )}
        </div>

        {/* Info cuenta SOLO si es tab cuenta */}
        {activeTab === "cuenta" && (
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
        )}
      </div>
    </div>
  );
}

export default ConfiguracionAdmin;
