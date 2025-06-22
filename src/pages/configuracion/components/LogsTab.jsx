import React from 'react';
import {
  FileText,
  RefreshCw,
  Filter,
  Search,
  X,
  AlertTriangle,
  Loader,
  User,
  Lock,
  Package,
  Eye,
  Edit,
  Activity,
  DatabaseBackup,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Shield,
  RotateCcw,
  Trash2,
  Settings
} from "lucide-react";
import LogsService from '../../../services/LogsService';
import './LogsTab.css';

function LogsTab({
  logsStats,
  cargarLogs,
  currentPage,
  limpiarFiltrosLogs,
  busquedaLogs,
  setBusquedaLogs,
  accionFiltro,
  setAccionFiltro,
  tablaFiltro,
  setTablaFiltro,
  usuarioFiltro,
  setUsuarioFiltro,
  fechaInicioFiltro,
  setFechaInicioFiltro,
  fechaFinFiltro,
  setFechaFinFiltro,
  aplicarFiltrosLogs,
  logsError,
  logsLoading,
  logs,
  totalLogs,
  totalPages,
  cambiarPagina
}) {  return (
    <div className="Logs_logs-layout">
      {/* Header Section - Similar a AgregarContenido y HistorialTab */}
      <div className="Logs_header-section">
        <h1 className="Logs_main-title">Logs del Sistema</h1>
        <div className="Logs_top-controls">
          <button className="Logs_btn-refresh" onClick={() => cargarLogs(currentPage)}>
            <RotateCcw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="Logs_contenido-container">
        {/* Search bar similar a AgregarContenido */}
        <div className="Logs_search-bar-container">
          <Search className="Logs_search-icon" size={16} />
          <input
            type="text"
            className="Logs_search-input"
            placeholder="Buscar en logs del sistema..."
            value={busquedaLogs}
            onChange={(e) => setBusquedaLogs(e.target.value)}
          />
        </div>

        {/* Stats Cards mejoradas */}
        {logsStats && (
          <div className="Logs_stats-grid">
            <div className="Logs_stat-card Logs_total">
              <div className="Logs_stat-content">
                <div className="Logs_stat-icon-wrapper">
                  <FileText size={24} />
                </div>
                <div className="Logs_stat-details">
                  <span className="Logs_stat-number">{logsStats.total_logs_sistema}</span>
                  <span className="Logs_stat-description">Total de Logs</span>
                </div>
              </div>
            </div>
            
            <div className="Logs_stat-card Logs_info">
              <div className="Logs_stat-content">
                <div className="Logs_stat-icon-wrapper">
                  <Activity size={24} />
                </div>
                <div className="Logs_stat-details">
                  <span className="Logs_stat-number">{logsStats.acciones_unicas}</span>
                  <span className="Logs_stat-description">Tipos de Acciones</span>
                </div>
              </div>
            </div>
            
            <div className="Logs_stat-card Logs_user">
              <div className="Logs_stat-content">
                <div className="Logs_stat-icon-wrapper">
                  <User size={24} />
                </div>
                <div className="Logs_stat-details">
                  <span className="Logs_stat-number">{logsStats.usuarios_activos}</span>
                  <span className="Logs_stat-description">Usuarios Activos</span>
                </div>
              </div>
            </div>
            
            <div className="Logs_stat-card Logs_system">
              <div className="Logs_stat-content">
                <div className="Logs_stat-icon-wrapper">
                  <DatabaseBackup size={24} />
                </div>
                <div className="Logs_stat-details">
                  <span className="Logs_stat-number">{logsStats.tablas_afectadas}</span>
                  <span className="Logs_stat-description">Tablas Afectadas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros mejorados */}
        <div className="Logs_controls-wrapper">
          <div className="Logs_filters-header">
            <h3 className="Logs_filters-title">
              <Filter size={20} />
              Filtros de Búsqueda
            </h3>
            <button className="Logs_btn-clear-filters" onClick={limpiarFiltrosLogs}>
              <X size={16} />
              Limpiar Filtros
            </button>
          </div>
          
          <div className="Logs_controls-grid">
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Acción</label>
              <select 
                className="Logs_filter-select" 
                value={accionFiltro} 
                onChange={(e) => setAccionFiltro(e.target.value)}
              >
                <option value="">Todas las acciones</option>
                <option value="LOGIN">LOGIN</option>
                <option value="CREATE">CREATE</option>
                <option value="READ">READ</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LOGOUT">LOGOUT</option>
              </select>
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Tabla Afectada</label>
              <select 
                className="Logs_filter-select" 
                value={tablaFiltro} 
                onChange={(e) => setTablaFiltro(e.target.value)}
              >
                <option value="">Todas las tablas</option>
                <option value="usuarios">Usuarios</option>
                <option value="productos">Productos</option>
                <option value="pedidos">Pedidos</option>
                <option value="categorias">Categorías</option>
              </select>
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">ID Usuario</label>
              <input
                type="number"
                placeholder="ID del usuario"
                className="Logs_filter-input"
                value={usuarioFiltro}
                onChange={(e) => setUsuarioFiltro(e.target.value)}
              />
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Fecha Inicio</label>
              <input
                type="date"
                className="Logs_filter-input"
                value={fechaInicioFiltro}
                onChange={(e) => setFechaInicioFiltro(e.target.value)}
              />
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Fecha Fin</label>
              <input
                type="date"
                className="Logs_filter-input"
                value={fechaFinFiltro}
                onChange={(e) => setFechaFinFiltro(e.target.value)}
              />
            </div>
            
            <div className="Logs_filter-actions">
              <button className="Logs_btn-apply-filters" onClick={aplicarFiltrosLogs}>
                <Search size={16} />
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="Logs_resultados-contador">
          Mostrando <span className="Logs_resaltado">{logs.length}</span> de <span className="Logs_resaltado">{totalLogs}</span> logs
        </div>

        {/* Manejo de errores */}
        {logsError && (
          <div className="Logs_alert-container Logs_error">
            <div className="Logs_alert-content">
              <AlertTriangle size={20} className="Logs_alert-icon" />
              <div className="Logs_alert-text">
                <h4>Error al cargar logs</h4>
                <p>{logsError}</p>
              </div>
              <button 
                onClick={() => cargarLogs(currentPage)}
                className="Logs_alert-action-btn"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {logsLoading && (
          <div className="Logs_loading-container">
            <div className="Logs_loading-content">
              <Loader className="Logs_loading-spinner" size={24} />
              <span className="Logs_loading-text">Cargando logs del sistema...</span>
            </div>
          </div>
        )}

        {/* Tabla principal */}
        {!logsLoading && !logsError && logs.length > 0 && (
          <div className="Logs__container">
            <div className="Logs__content">
              <table className="Logs_styled-table">
                <thead>
                  <tr>
                    <th className="Logs_th-id">
                      <div className="Logs_header-content">
                        <span>ID</span>
                      </div>
                    </th>
                    <th className="Logs_th-user">
                      <div className="Logs_header-content">
                        <User className="Logs_header-icon" size={16} />
                        <span>Usuario</span>
                      </div>
                    </th>
                    <th className="Logs_th-action">
                      <div className="Logs_header-content">
                        <Activity className="Logs_header-icon" size={16} />
                        <span>Acción</span>
                      </div>
                    </th>
                    <th className="Logs_th-table">
                      <div className="Logs_header-content">
                        <DatabaseBackup className="Logs_header-icon" size={16} />
                        <span>Tabla</span>
                      </div>
                    </th>
                    <th className="Logs_th-datetime">
                      <div className="Logs_header-content">
                        <Calendar className="Logs_header-icon" size={16} />
                        <span>Fecha y Hora</span>
                      </div>
                    </th>
                    <th className="Logs_th-description">
                      <div className="Logs_header-content">
                        <FileText className="Logs_header-icon" size={16} />
                        <span>Descripción</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id_log} className="Logs_styled-row Logs_log-row">
                      <td className="Logs_id-cell">
                        <span className="Logs_log-id">#{log.id_log}</span>
                      </td>
                      <td className="Logs_user-cell">
                        <div className="Logs_user-info">
                          <div className="Logs_user-avatar">
                            <User size={16} />
                          </div>
                          <div className="Logs_user-details">
                            <span className="Logs_user-name">{log.usuario.nombre}</span>
                            <span className={`Logs_user-type Logs_${LogsService.getColorTipoUsuario(log.usuario.tipo)}`}>
                              {log.usuario.tipo}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="Logs_action-cell">
                        <div
                          className={`Logs_action-pill Logs_action-${log.accion.toLowerCase()}`}
                          style={{
                            backgroundColor: getActionColor(log.accion),
                            color: '#ffffff',
                            fontWeight: '700'
                          }}
                        >
                          {log.accion === 'LOGIN' && <Lock size={14} />}
                          {log.accion === 'CREATE' && <Package size={14} />}
                          {log.accion === 'READ' && <Eye size={14} />}
                          {log.accion === 'UPDATE' && <Edit size={14} />}
                          {log.accion === 'DELETE' && <Trash2 size={14} />}
                          {log.accion === 'LOGOUT' && <Shield size={14} />}
                          <span className="Logs_action-text">{log.accion}</span>
                        </div>
                      </td>
                      <td className="Logs_table-cell">
                        <div className="Logs_table-info">
                          <span className="Logs_table-name">{log.tabla_afectada}</span>
                        </div>
                      </td>
                      <td className="Logs_datetime-cell">
                        <div className="Logs_datetime-content">
                          <span className="Logs_date">
                            {LogsService.formatearFecha(log.fecha_hora).split(' ')[0]}
                          </span>
                          <span className="Logs_time">
                            {LogsService.formatearFecha(log.fecha_hora).split(' ')[1]}
                          </span>
                        </div>
                      </td>
                      <td className="Logs_description-cell">
                        <div className="Logs_description-content">
                          <span className="Logs_description-text">{log.descripcion}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paginación mejorada */}
        {!logsLoading && !logsError && logs.length > 0 && totalPages > 1 && (
          <div className="Logs_pagination-controls">
            <button 
              className="Logs_pagination-btn"
              onClick={() => cambiarPagina(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            
            <div className="Logs_pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i;
                if (pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      className={`Logs_pagination-page ${currentPage === pageNumber ? 'Logs_active' : ''}`}
                      onClick={() => cambiarPagina(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            
            <button 
              className="Logs_pagination-btn"
              onClick={() => cambiarPagina(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Estado vacío */}
        {!logsLoading && !logsError && logs.length === 0 && (
          <div className="Logs__container">
            <div className="Logs__content">
              <table className="Logs_styled-table">
                <thead>
                  <tr>
                    <th colSpan="6">
                      <div className="Logs_header-content">
                        <FileText className="Logs_header-icon" size={16} />
                        <span>Sin resultados</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="Logs_empty-row">
                    <td colSpan="6" className="Logs_empty-cell">
                      <div className="Logs_empty-state">
                        <div className="Logs_empty-icon">
                          <FileText className="Logs_no-data-icon" size={48} />
                        </div>
                        <div className="Logs_empty-text">
                          No se encontraron logs
                        </div>
                        <div className="Logs_empty-subtitle">
                          No hay logs que coincidan con los filtros aplicados
                        </div>
                        <button className="Logs_btn-clear-empty" onClick={limpiarFiltrosLogs}>
                          <RefreshCw size={16} />
                          Limpiar Filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Función para obtener el color de cada acción
  function getActionColor(accion) {
    const colorMap = {
      'LOGIN': '#3b82f6',
      'CREATE': '#22c55e',
      'READ': '#6b7280',
      'UPDATE': '#f59e0b',
      'DELETE': '#dc2626',
      'LOGOUT': '#8b5cf6'
    };
    return colorMap[accion] || '#6b7280';
  }
}

export default LogsTab;
