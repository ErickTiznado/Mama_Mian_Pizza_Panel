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
  Settings
} from "lucide-react";

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
    <div className="historial-layout">
      <div className="historial-header">
        <div className="historial-title-section">
          <Activity size={28} className="section-icon" />
          <div>
            <h2 className="section-title">Historial de Actividades</h2>
            <p className="section-subtitle">Monitorea todas las acciones realizadas en el sistema</p>
          </div>
        </div>
      </div>

      <div className="historial-controls modern-card compact">
        <div className="controls-grid">
          <div className="search-group">
            <label className="control-label">Buscar actividades</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Buscar por acción o descripción..."
                className="search-input"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label className="control-label">Tipo de acción</label>
            <select className="filter-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              <option value="Autenticación">Autenticación</option>
              <option value="Pedido">Pedido</option>
              <option value="Inventario">Inventario</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="control-label">Estado</label>
            <select className="filter-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="Exitoso">Exitoso</option>
              <option value="Fallido">Fallido</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="btn-clear-filters" onClick={limpiarFiltros}>
              <Filter size={16} />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="historial-stats">
        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <CheckCircle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-number">{filtrados.filter(d => d.state === 'Exitoso').length}</span>
              <span className="stat-description">Acciones Exitosas</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card error">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-number">{filtrados.filter(d => d.state === 'Fallido').length}</span>
              <span className="stat-description">Acciones Fallidas</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card security">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <Shield size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-number">{filtrados.filter(d => d.type === 'Autenticación').length}</span>
              <span className="stat-description">Eventos de Seguridad</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card total">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <Activity size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-number">{filtrados.length}</span>
              <span className="stat-description">Total de Resultados</span>
            </div>
          </div>
        </div>
      </div>

      <div className="historial-table-container modern-card">
        <div className="table-header">
          <h3 className="table-title">Registro de Actividades</h3>
          <span className="table-subtitle">{filtrados.length} resultados encontrados</span>
        </div>
        
        <div className="table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Acción</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Dirección IP</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((row, i) => (
                <tr key={i} className="activity-row">
                  <td className="datetime-cell">
                    <div className="datetime-content">
                      <span className="date">{row.date}</span>
                      <span className="time">{row.time}</span>
                    </div>
                  </td>
                  <td className="action-cell">
                    <div className="action-content">
                      <span className="action-title">{row.action}</span>
                      <span className="action-description">{row.description}</span>
                    </div>
                  </td>
                  <td className="type-cell">
                    <span className={`type-badge ${row.type.toLowerCase().replace(/\s/g, '-')}`}>
                      {row.type === 'Autenticación' && <Lock size={14} />}
                      {row.type === 'Pedido' && <ShoppingCart size={14} />}
                      {row.type === 'Inventario' && <Package size={14} />}
                      {row.type === 'Backup' && <DatabaseBackup size={14} />}
                      {row.type === 'Configuración' && <Settings size={14} />}
                      {row.type === 'Seguridad' && <Shield size={14} />}
                      {row.type === 'Problema Técnico' && <AlertTriangle size={14} />}
                      {row.type}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${row.state.toLowerCase()}`}>
                      {row.state === 'Exitoso' && <CheckCircle size={14} />}
                      {row.state === 'Fallido' && <AlertTriangle size={14} />}
                      {row.state}
                    </span>
                  </td>
                  <td className="ip-cell">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistorialTab;
