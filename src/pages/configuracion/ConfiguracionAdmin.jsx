import { useEffect, useState } from 'react';

import {
  Settings,
  Lock,
  Activity,
  DatabaseBackup,
  Filter,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  ShoppingCart,
  Package,
  Download,
  MessageSquare,
   Info,
  RefreshCw,
  Calendar,
   User,    // Nuevo
  Edit,    // Nuevo
  Mail,    // Nuevo
  Phone,   // Nuevo
  Clock    // Nuevo
} from "lucide-react";
import "./configuracion.css";



function ConfiguracionAdmin() {
  

const [modoEdicion, setModoEdicion] = useState(false);
const [nombreAdmin, setNombreAdmin] = useState("Administrador Principal");
const [emailAdmin, setEmailAdmin] = useState("admin@mitienda.com");
const [telefonoAdmin, setTelefonoAdmin] = useState("+34 612 345 678");

const [nuevaPassword, setNuevaPassword] = useState("");
const [confirmarPassword, setConfirmarPassword] = useState("");

const contrasenaValida =
  nuevaPassword.trim().length >= 6 &&
  confirmarPassword.trim().length >= 6 &&
  nuevaPassword === confirmarPassword;

  // ✅ ESTADOS VERIFICACIÓN DE CÓDIGO
  const [mostrarVerificacion, setMostrarVerificacion] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState("123456");
  const [codigoInput, setCodigoInput] = useState("");
  const [metodoEnvio, setMetodoEnvio] = useState("");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [verificado, setVerificado] = useState(false);

  // ✅ ESTADOS GENERALES
  const [activeTab, setActiveTab] = useState("cuenta");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ ESTADOS FILTROS E HISTORIAL
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [backupData, setBackupData] = useState([]);

  // ✅ FUNCIONES
  const limpiarFiltros = () => {
    setBusqueda("");
    setTipo("");
    setEstado("");
  };

  const enviarCodigo = (metodo) => {
    setMetodoEnvio(metodo);
    setMostrarVerificacion(true);
    setCodigoInput("123456");

    const mensaje = metodo === "sms"
      ? "📲 Código enviado vía SMS al +34 612 345 678"
      : "📧 Código enviado vía Email a admin@mitienda.com";

    setMensajeAlerta(mensaje);

    setTimeout(() => setMensajeAlerta(""), 3000);
  };

  const filtrados = data.filter((item) => {
    const coincideBusqueda =
      item.action.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.description.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = tipo ? item.type === tipo : true;
    const coincideEstado = estado ? item.state === estado : true;
    return coincideBusqueda && coincideTipo && coincideEstado;
  });

  useEffect(() => {
    // Datos simulados para historial
    const historialSimulado = [
      {
        time: "14:30:15",
        date: "2025-01-22",
        action: "Inicio de sesión",
        description: "Admin inició sesión en el sistema",
        type: "Autenticación",
        state: "Exitoso",
        ip: "192.168.1.100"
      },
      {
        time: "14:25:42",
        date: "2025-01-22",
        action: "Pedido actualizado",
        description: "Estado del pedido #P86SQ8F8 cambiado a 'Enviado'",
        type: "Pedido",
        state: "Exitoso",
        ip: "192.168.1.100"
      },
      {
        time: "09:15:22",
        date: "2025-01-22",
        action: "Intento de acceso fallido",
        description: "Intento de inicio con credenciales inválidas",
        type: "Autenticación",
        state: "Fallido",
        ip: "203.0.113.45"
      }
    ];

    // Datos simulados para backup
    const backupSimulado = [
      {
        id: 1,
        nombre: "backup_completo_2025-01-22.zip",
        descripcion: "Backup automático completo del sistema",
        tipo: "Completo",
        tamaño: "245.8 MB",
        fecha: "2025-01-22 03:00:00",
        estado: "Completado"
      },
      {
        id: 2,
        nombre: "backup_incremental_2025-01-21.zip",
        descripcion: "Backup incremental de cambios diarios",
        tipo: "Incremental",
        tamaño: "12.4 MB",
        fecha: "2025-01-21 03:00:00",
        estado: "Completado"
      },
      {
        id: 3,
        nombre: "backup_completo_2025-01-15.zip",
        descripcion: "Backup semanal completo",
        tipo: "Completo",
        tamaño: "238.2 MB",
        fecha: "2025-01-15 03:00:00",
        estado: "Completado"
      }
    ];

    setData(historialSimulado);
    setBackupData(backupSimulado);
  }, []);

  return (
    <div className="config-wrapper">
      {/* Header */}
      <div className="config-header-section">
        <h1 className="config-title">
          <Settings className="config-icon" /> Configuración del Administrador
        </h1>        <p className="config-subtitle">
          Gestiona la configuración de tu cuenta, historial y backups
        </p>
        <div className="config-divider" />
      </div>

      {/* Main Content */}
      <div className="config-content-background">
        {/* Tabs */}
        <div className="tabs">          {[
            { key: "cuenta", label: "Cuenta", icon: Lock },
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
         {/* TAB: CUENTA */}
        {activeTab === "cuenta" && (
          <div className="config-panels">
           <div className="panel-perfil-admin">
  <div className="perfil-header">
    <h2 className="panel-title">
      <User size={20} style={{ marginRight: "8px", color: "#f97316" }} />
      Perfil del Administrador
    </h2>
    <button
      className="btn-editar"
      onClick={() => setModoEdicion(!modoEdicion)}
    >
      <Edit size={16} style={{ marginRight: "4px" }} />{" "}
      {modoEdicion ? "Cancelar" : "Editar"}
    </button>
  </div>

  {!modoEdicion ? (
    <div className="perfil-contenido">
      <div className="avatar-admin">
        <User size={32} />
      </div>
      <div className="info-admin">
        <h3>{nombreAdmin}</h3>
        <span className="badge-admin">Administrador</span>
        <p>
          <Mail size={16} /> {emailAdmin}
        </p>
        <p>
          <Phone size={16} /> {telefonoAdmin}
        </p>
        <p>
          <Calendar size={16} /> Miembro desde 2023-01-15
        </p>
        <p>
          <Clock size={16} /> Último acceso: Hoy, 14:30
        </p>
      </div>
    </div>
  ) : (
    <div className="perfil-contenido">
      <label>Nombre</label>
      <input
        type="text"
        className="input-codigo"
        value={nombreAdmin}
        onChange={(e) => setNombreAdmin(e.target.value)}
      />

      <label>Email</label>
      <input
        type="email"
        className="input-codigo"
        value={emailAdmin}
        onChange={(e) => setEmailAdmin(e.target.value)}
      />

      <label>Teléfono</label>
      <input
        type="text"
        className="input-codigo"
        value={telefonoAdmin}
        onChange={(e) => setTelefonoAdmin(e.target.value)}
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          className="btn-guardar-perfil"
          onClick={() => {
            // Aquí puedes guardar en backend si deseas
            setModoEdicion(false);
          }}
        >
          Guardar Cambios
        </button>
        <button className="btn-cancelar-perfil" onClick={() => setModoEdicion(false)}>
          Cancelar
        </button>
      </div>
    </div>
  )}
</div>

           <div className="panel-cambiar-password">
  <h2 className="panel-title">
    <Lock size={20} style={{ marginRight: "8px", color: "#f97316" }} />
    Cambiar Contraseña
  </h2>

  {/* Paso 1: Verificación de Identidad */}
  {!mostrarVerificacion && !verificado && (
    <div className="verificacion-identidad">
      <h3>Verificación de Identidad</h3>
      <p>Selecciona cómo quieres recibir el código de verificación</p>

      <div className="opciones-verificacion">
        <div className="opcion-verificacion">
          <div className="opcion-contenido">
            <Phone size={20} color="#60A5FA" />
            <div className="texto-verificacion">
              <strong>SMS al teléfono</strong>
              <p>+34 612 345 678</p>
            </div>
          </div>
          <button className="btn-enviar-sms" onClick={() => enviarCodigo("sms")}>
            Enviar SMS
          </button>
        </div>

        <div className="opcion-verificacion">
          <div className="opcion-contenido">
            <Mail size={20} color="#10B981" />
            <div className="texto-verificacion">
              <strong>Email</strong>
              <p>admin@mitienda.com</p>
            </div>
          </div>
          <button className="btn-enviar-email" onClick={() => enviarCodigo("email")}>
            Enviar Email
          </button>
        </div>
      </div>

      <div className="demo-codigo">
        <Info size={16} /> Demo: El código de verificación es: 123456
      </div>

      {mensajeAlerta && <div className="alerta-verde">{mensajeAlerta}</div>}
    </div>
  )}

  {/* Paso 2: Ingreso del Código */}
  {mostrarVerificacion && !verificado && (
    <div className="panel-verificacion-codigo">
      <div className="icono-verificacion-grande">
        <Shield size={48} color="white" />
      </div>

      <div className="bloque-verificacion">
        <h3 className="titulo-verificacion">Verificar Código</h3>
        <p className="subtexto-verificacion">Ingresa el código que recibiste</p>
      </div>

      <input
        type="text"
        className="input-codigo"
        maxLength={6}
        value={codigoInput}
        onChange={(e) => setCodigoInput(e.target.value)}
      />

      <div className="demo-codigo">
        <Shield size={16} /> Demo: El código de verificación es: 123456
      </div>

      <div className="acciones-codigo">
        <button className="btn-black" onClick={() => setMostrarVerificacion(false)}>
          Volver
        </button>
        <button
          className="btn-orange"
          disabled={codigoInput !== "123456"}
          onClick={() => {
            setVerificado(true);
            setMostrarVerificacion(false);
            setCodigoInput("");
          }}
        >
          Verificar
        </button>
      </div>
    </div>
  )}

  {/* Paso 3: Formulario Nueva Contraseña */}
  {verificado && (
   <div className="panel-nueva-contrasena">
  <h3 className="titulo-verificacion">Nueva Contraseña</h3>
  <p className="subtexto-verificacion">Crea una nueva contraseña segura</p>

  <label>Nueva Contraseña</label>
  <input
    type="password"
    className="input-codigo"
    placeholder="Ingresa tu nueva contraseña"
    value={nuevaPassword}
    onChange={(e) => setNuevaPassword(e.target.value)}
  />

  <label>Confirmar Nueva Contraseña</label>
  <input
    type="password"
    className="input-codigo"
    placeholder="Confirma tu nueva contraseña"
    value={confirmarPassword}
    onChange={(e) => setConfirmarPassword(e.target.value)}
  />

  {nuevaPassword && confirmarPassword && nuevaPassword !== confirmarPassword && (
    <p style={{ color: "red", marginTop: "8px" }}>❗Las contraseñas no coinciden</p>
  )}

  <div className="acciones-codigo">
    <button className="btn-black" onClick={() => setVerificado(false)}>
      Volver
    </button>
    <button
      className="btn-cambiar"
      disabled={!contrasenaValida}
      onClick={() => {
        // Aquí puedes guardar o enviar la contraseña
        console.log("Contraseña cambiada");
        setNuevaPassword("");
        setConfirmarPassword("");
        setVerificado(false);
      }}
    >
      Cambiar Contraseña
    </button>
  </div>
</div>

  )}
</div>     


<div className="panel-seguridad">
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
                    <strong>Verificación por SMS</strong>
                    <p>Protege cambios importantes con códigos SMS</p>
                  </div>
                  <span className="badge green">Activo</span>
                </div>

                <div className="security-item">
                  <div>
                    <strong>Sesiones activas</strong>
                    <p>Gestiona tus sesiones abiertas</p>
                  </div>
                  <button className="btn-sesiones">Ver sesiones</button>
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
          </div>        )}

          {activeTab === "historial" && (
            <div className="historial-container">
              {/* Panel de Filtros */}
              <div className="historial-panel">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar actividades..."
                    className="historial-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <select className="historial-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="">Todos los tipos</option>
                  <option value="Autenticación">Autenticación</option>
                  <option value="Pedido">Pedido</option>
                  <option value="Inventario">Inventario</option>
                </select>
                <select className="historial-input" value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option value="">Todos los estados</option>
                  <option value="Exitoso">Exitoso</option>
                  <option value="Fallido">Fallido</option>
                </select>
                <button className="historial-limpiar" onClick={limpiarFiltros}>
                  <Filter size={16} style={{ marginRight: "6px" }} /> Limpiar
                </button>
              </div>

              {/* Contadores */}
              <div className="historial-contadores">
                <div className="contador exito"><h2>{filtrados.filter(d => d.state === 'Exitoso').length}</h2><p>Acciones Exitosas</p></div>
                <div className="contador fallo"><h2>{filtrados.filter(d => d.state === 'Fallido').length}</h2><p>Acciones Fallidas</p></div>
                <div className="contador seguridad"><h2>{filtrados.filter(d => d.type === 'Autenticación').length}</h2><p>Eventos de Seguridad</p></div>
                <div className="contador total"><h2>{filtrados.length}</h2><p>Resultados</p></div>
              </div>

              {/* Tabla */}
              <div className="tabla-contenedor">
                <table className="tabla-historial">
                  <thead>
                    <tr>
                      <th className="orange-header">Fecha y Hora</th>
                      <th className="orange-header">Acción</th>
                      <th className="orange-header">Tipo</th>
                      <th className="orange-header">Estado</th>
                      <th className="orange-header">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((row, i) => (
                      <tr key={i}>
                        <td>{`${row.time} ${row.date}`}</td>
                        <td>
                          <strong>{row.action}</strong><br />
                          <span className="descripcion">{row.description}</span>
                        </td>
                        <td>
                          <span className={`badge tipo ${row.type.toLowerCase().replace(/\s/g, '-')}`}>
                            {row.type === 'Autenticación' && <Lock size={14} style={{ marginRight: "4px" }} />}
                            {row.type === 'Pedido' && <ShoppingCart size={14} style={{ marginRight: "4px" }} />}
                            {row.type === 'Inventario' && <Package size={14} style={{ marginRight: "4px" }} />}
                            {row.type === 'Backup' && <DatabaseBackup size={14} style={{ marginRight: "4px" }} />}
                            {row.type === 'Configuración' && <Settings size={14} style={{ marginRight: "4px" }} />}
                            {row.type === 'Seguridad' && <Shield size={14} style={{ marginRight: "4px" }} />}
                            {row.type === 'Problema Técnico' && <AlertTriangle size={14} style={{ marginRight: "4px" }} />}
                            {row.type}
                          </span>
                        </td>
                        <td>
                          <span className={`badge estado ${row.state.toLowerCase()}`}>
                            {row.state === 'Exitoso' && <CheckCircle size={14} style={{ marginRight: "4px" }} />}
                            {row.state === 'Fallido' && <AlertTriangle size={14} style={{ marginRight: "4px" }} />}
                            {row.state}
                          </span>
                        </td>
                        <td>{row.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="backup-container">
              {/* Cards de estadísticas */}
              <div className="backup-stats">
                <div className="backup-card status">
                  <div className="backup-card-content">
                    <div className="backup-icon-wrapper green">
                      <CheckCircle size={24} />
                    </div>
                    <div className="backup-card-info">
                      <h3>Último Backup</h3>
                      <p>Hace 6 horas</p>
                    </div>
                  </div>
                </div>
                
                <div className="backup-card usage">
                  <div className="backup-card-content">
                    <div className="backup-icon-wrapper blue">
                      <DatabaseBackup size={24} />
                    </div>
                    <div className="backup-card-info">
                      <h3>Espacio Usado</h3>
                      <p>1.2 GB</p>
                    </div>
                  </div>
                </div>
                
                <div className="backup-card schedule">
                  <div className="backup-card-content">
                    <div className="backup-icon-wrapper orange">
                      <Calendar size={24} />
                    </div>
                    <div className="backup-card-info">
                      <h3>Próximo Backup</h3>
                      <p>En 18 horas</p>
                    </div>
                  </div>
                </div>
                
                <div className="backup-card action">
                  <button className="btn-create-backup">
                    <Download size={20} />
                    Crear Backup
                  </button>
                </div>
              </div>

              {/* Historial de Backups */}
              <div className="backup-history">
                <h2 className="backup-section-title">Historial de Backups</h2>
                
                <div className="backup-table-container">
                  <table className="backup-table">
                    <thead>
                      <tr>
                        <th>Nombre del Archivo</th>
                        <th>Tipo</th>
                        <th>Tamaño</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backupData.map((backup) => (
                        <tr key={backup.id}>
                          <td>
                            <div className="backup-file-info">
                              <strong>{backup.nombre}</strong>
                              <span className="backup-description">{backup.descripcion}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`backup-badge tipo-${backup.tipo.toLowerCase()}`}>
                              {backup.tipo === 'Completo' && '●'}
                              {backup.tipo === 'Incremental' && '●'}
                              {backup.tipo}
                            </span>
                          </td>
                          <td>{backup.tamaño}</td>
                          <td>
                            <div className="backup-date">
                              <Calendar size={14} />
                              {backup.fecha}
                            </div>
                          </td>
                          <td>
                            <span className="backup-badge estado-completado">
                              <CheckCircle size={14} />
                              {backup.estado}
                            </span>
                          </td>
                          <td>
                            <div className="backup-actions">
                              <button className="backup-action-btn download" title="Descargar">
                                <Download size={16} />
                              </button>
                              <button className="backup-action-btn restore" title="Restaurar">
                                <RefreshCw size={16} />
                                Restaurar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

    
      </div>
    </div>
  );
}

export default ConfiguracionAdmin;
