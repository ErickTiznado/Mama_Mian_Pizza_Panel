import React from 'react';
import {
  Activity,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Shield,
  Lock,
  ShoppingCart,
  Package,
  DatabaseBackup,
  Settings,
  Calendar,
  Eye,
  RotateCcw
} from "lucide-react";
import './HistorialTab.css';

function HistorialTab({
  data,
  busqueda,
  setBusqueda,
  tipo,
  setTipo,
  estado,
  setEstado,
  limpiarFiltros
}) {
  const filtrados = data.filter((item) => {
    const coincideBusqueda =
      item.action.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.description.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = tipo ? item.type === tipo : true;
    const coincideEstado = estado ? item.state === estado : true;
    return coincideBusqueda && coincideTipo && coincideEstado;
  });
  return (
    <div className="Hist_historial-layout">
      {/* Header Section - Similar a AgregarContenido */}
      <div className="Hist_header-section">
        <h1 className="Hist_main-title">Historial de Actividades</h1>
        <div className="Hist_top-controls">
          <button className="Hist_btn-refresh" onClick={() => window.location.reload()}>
            <RotateCcw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="Hist_contenido-container">
        {/* Search bar similar a AgregarContenido */}
        <div className="Hist_search-bar-container">
          <Search className="Hist_search-icon" size={16} />
          <input
            type="text"
            className="Hist_search-input"
            placeholder="Buscar por acción o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtros mejorados */}
        <div className="Hist_controls-wrapper">
          <div className="Hist_controls-grid">
            <div className="Hist_filter-group">
              <label className="Hist_control-label">Tipo de acción</label>
              <select className="Hist_filter-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos los tipos</option>
                <option value="Autenticación">Autenticación</option>
                <option value="Pedido">Pedido</option>
                <option value="Inventario">Inventario</option>
                <option value="Configuración">Configuración</option>
                <option value="Backup">Backup</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </div>
            
            <div className="Hist_filter-group">
              <label className="Hist_control-label">Estado</label>
              <select className="Hist_filter-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Exitoso">Exitoso</option>
                <option value="Fallido">Fallido</option>
              </select>
            </div>
            
            <div className="Hist_filter-actions">
              <button className="Hist_btn-clear-filters" onClick={limpiarFiltros}>
                <Filter size={16} />
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Contador de resultados similar a AgregarContenido */}
        <div className="Hist_resultados-contador">
          Mostrando <span className="Hist_resaltado">{filtrados.length}</span> actividades
        </div>

        {/* Stats Cards con estilo mejorado */}
        <div className="Hist_stats-grid">
          <div className="Hist_stat-card Hist_success">
            <div className="Hist_stat-content">
              <div className="Hist_stat-icon-wrapper">
                <CheckCircle size={24} />
              </div>
              <div className="Hist_stat-details">
                <span className="Hist_stat-number">{filtrados.filter(d => d.state === 'Exitoso').length}</span>
                <span className="Hist_stat-description">Acciones Exitosas</span>
              </div>
            </div>
          </div>
          
          <div className="Hist_stat-card Hist_error">
            <div className="Hist_stat-content">
              <div className="Hist_stat-icon-wrapper">
                <AlertTriangle size={24} />
              </div>
              <div className="Hist_stat-details">
                <span className="Hist_stat-number">{filtrados.filter(d => d.state === 'Fallido').length}</span>
                <span className="Hist_stat-description">Acciones Fallidas</span>
              </div>
            </div>
          </div>
          
          <div className="Hist_stat-card Hist_security">
            <div className="Hist_stat-content">
              <div className="Hist_stat-icon-wrapper">
                <Shield size={24} />
              </div>
              <div className="Hist_stat-details">
                <span className="Hist_stat-number">{filtrados.filter(d => d.type === 'Autenticación').length}</span>
                <span className="Hist_stat-description">Eventos de Seguridad</span>
              </div>
            </div>
          </div>
          
          <div className="Hist_stat-card Hist_total">
            <div className="Hist_stat-content">
              <div className="Hist_stat-icon-wrapper">
                <Activity size={24} />
              </div>
              <div className="Hist_stat-details">
                <span className="Hist_stat-number">{filtrados.length}</span>
                <span className="Hist_stat-description">Total de Resultados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla con estilo similar a OrderManager y AgregarContenido */}
        <div className="Hist__container">
          <div className="Hist__content">
            <table className="Hist_styled-table">
              <thead>
                <tr>
                  <th className="Hist_th-datetime">
                    <div className="Hist_header-content">
                      <Calendar className="Hist_header-icon" size={16} />
                      <span>Fecha y Hora</span>
                    </div>
                  </th>
                  <th className="Hist_th-action">
                    <div className="Hist_header-content">
                      <Activity className="Hist_header-icon" size={16} />
                      <span>Acción</span>
                    </div>
                  </th>
                  <th className="Hist_th-type">
                    <div className="Hist_header-content">
                      <Filter className="Hist_header-icon" size={16} />
                      <span>Tipo</span>
                    </div>
                  </th>
                  <th className="Hist_th-status">
                    <div className="Hist_header-content">
                      <CheckCircle className="Hist_header-icon" size={16} />
                      <span>Estado</span>
                    </div>
                  </th>
                  <th className="Hist_th-ip">
                    <div className="Hist_header-content">
                      <Shield className="Hist_header-icon" size={16} />
                      <span>IP</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length > 0 ? (
                  filtrados.map((row, i) => (
                    <tr key={i} className="Hist_styled-row Hist_activity-row">
                      <td className="Hist_datetime-cell">
                        <div className="Hist_datetime-content">
                          <span className="Hist_date">{row.date}</span>
                          <span className="Hist_time">{row.time}</span>
                        </div>
                      </td>
                      <td className="Hist_action-cell">
                        <div className="Hist_action-content">
                          <div className="Hist_action-title">{row.action}</div>
                          <div className="Hist_action-description">{row.description}</div>
                        </div>
                      </td>
                      <td className="Hist_type-cell">
                        <div
                          className={`Hist_type-pill Hist_type-${row.type.toLowerCase().replace(/\s+/g, '-')}`}
                          style={{
                            backgroundColor: getTypeColor(row.type),
                            color: '#ffffff',
                            fontWeight: '700'
                          }}
                        >
                          {row.type === 'Autenticación' && <Lock size={14} />}
                          {row.type === 'Pedido' && <ShoppingCart size={14} />}
                          {row.type === 'Inventario' && <Package size={14} />}
                          {row.type === 'Backup' && <DatabaseBackup size={14} />}
                          {row.type === 'Configuración' && <Settings size={14} />}
                          {row.type === 'Seguridad' && <Shield size={14} />}
                          {row.type === 'Problema Técnico' && <AlertTriangle size={14} />}
                          <span className="Hist_type-text">{row.type}</span>
                        </div>
                      </td>
                      <td className="Hist_status-cell">
                        <div
                          className={`Hist_estado-pill Hist_estado-${row.state.toLowerCase()}`}
                          style={{
                            backgroundColor: row.state === 'Exitoso' ? '#22c55e' : '#dc2626',
                            color: '#ffffff',
                            fontWeight: '700'
                          }}
                        >
                          <span
                            className="Hist_estado-dot"
                            style={{
                              backgroundColor: row.state === 'Exitoso' ? '#16a34a' : '#b91c1c'
                            }}
                          ></span>
                          {row.state === 'Exitoso' && <CheckCircle size={14} className="Hist_status-icon" />}
                          {row.state === 'Fallido' && <AlertTriangle size={14} className="Hist_status-icon" />}
                          <span className="Hist_estado-text">{row.state}</span>
                        </div>
                      </td>
                      <td className="Hist_ip-cell">
                        <div className="Hist_ip-content">
                          <span className="Hist_ip-text">{row.ip}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="Hist_empty-row">
                    <td colSpan="5" className="Hist_empty-cell">
                      <div className="Hist_empty-state">
                        <div className="Hist_empty-icon">
                          <Activity className="Hist_no-data-icon" size={48} />
                        </div>
                        <div className="Hist_empty-text">
                          No hay actividades para mostrar
                        </div>
                        <div className="Hist_empty-subtitle">
                          Las actividades aparecerán aquí cuando se realicen acciones en el sistema
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Función para obtener el color de cada tipo
  function getTypeColor(tipo) {
    const colorMap = {
      'Autenticación': '#3b82f6',
      'Pedido': '#f97316',
      'Inventario': '#10b981',
      'Backup': '#8b5cf6',
      'Configuración': '#6b7280',
      'Seguridad': '#dc2626',
      'Problema Técnico': '#f59e0b'
    };
    return colorMap[tipo] || '#6b7280';
  }
}

export default HistorialTab;
