import React, { useState, useEffect } from 'react';
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
}) {
  // Estados locales para filtrado en tiempo real
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [localSearch, setLocalSearch] = useState('');
  const [localAccion, setLocalAccion] = useState('');
  const [localTabla, setLocalTabla] = useState('');
  const [localUsuario, setLocalUsuario] = useState('');
  const [localFechaInicio, setLocalFechaInicio] = useState('');
  const [localFechaFin, setLocalFechaFin] = useState('');
  
  // Estados para paginación local
  const [currentLocalPage, setCurrentLocalPage] = useState(1);
  const logsPerPage = 10;

  // Efecto para filtrar logs cuando cambian los datos o filtros
  useEffect(() => {
    let result = [...logs];

    // Filtro por término de búsqueda en descripción
    if (localSearch.trim()) {
      const searchLower = localSearch.toLowerCase();
      result = result.filter(log => 
        log.descripcion?.toLowerCase().includes(searchLower) ||
        log.usuario?.nombre?.toLowerCase().includes(searchLower) ||
        log.tabla_afectada?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por acción
    if (localAccion) {
      result = result.filter(log => log.accion === localAccion);
    }

    // Filtro por tabla afectada
    if (localTabla) {
      result = result.filter(log => log.tabla_afectada === localTabla);
    }

    // Filtro por ID de usuario
    if (localUsuario) {
      const userId = parseInt(localUsuario);
      result = result.filter(log => log.usuario?.id_usuario === userId);
    }

    // Filtro por fecha de inicio
    if (localFechaInicio) {
      const fechaInicio = new Date(localFechaInicio);
      result = result.filter(log => {
        const fechaLog = new Date(log.fecha_hora);
        return fechaLog >= fechaInicio;
      });
    }

    // Filtro por fecha de fin
    if (localFechaFin) {
      const fechaFin = new Date(localFechaFin);
      fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
      result = result.filter(log => {
        const fechaLog = new Date(log.fecha_hora);
        return fechaLog <= fechaFin;
      });
    }

    setFilteredLogs(result);
    setCurrentLocalPage(1); // Reset pagination when filters change
  }, [logs, localSearch, localAccion, localTabla, localUsuario, localFechaInicio, localFechaFin]);

  // Función para limpiar todos los filtros locales
  const limpiarFiltrosLocales = () => {
    setLocalSearch('');
    setLocalAccion('');
    setLocalTabla('');
    setLocalUsuario('');
    setLocalFechaInicio('');
    setLocalFechaFin('');
    setCurrentLocalPage(1);
  };

  // Calcular logs para la página actual
  const indexOfLastLog = currentLocalPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalLocalPages = Math.ceil(filteredLogs.length / logsPerPage);
  // Calcular estadísticas locales basadas en logs filtrados
  const localStats = {
    total_logs_sistema: filteredLogs.length,
    acciones_unicas: [...new Set(filteredLogs.map(log => log.accion))].length,
    usuarios_activos: [...new Set(filteredLogs.map(log => log.usuario?.id_usuario))].filter(Boolean).length,
    tablas_afectadas: [...new Set(filteredLogs.map(log => log.tabla_afectada))].filter(Boolean).length
  };

  // Obtener opciones dinámicas de los datos reales
  const getAvailableActions = () => {
    const actions = [...new Set(logs.map(log => log.accion))].filter(Boolean);
    return actions.sort();
  };

  const getAvailableTables = () => {
    const tables = [...new Set(logs.map(log => log.tabla_afectada))].filter(Boolean);
    return tables.sort();
  };

  const getAvailableUsers = () => {
    const users = logs
      .map(log => log.usuario)
      .filter(Boolean)
      .reduce((acc, user) => {
        if (user.id_usuario && !acc.find(u => u.id_usuario === user.id_usuario)) {
          acc.push({
            id_usuario: user.id_usuario,
            nombre: user.nombre || `Usuario ${user.id_usuario}`,
            tipo: user.tipo || 'N/A'
          });
        }
        return acc;
      }, [])
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
    return users;
  };

  // Obtener rango de fechas disponibles
  const getDateRange = () => {
    if (logs.length === 0) return { min: '', max: '' };
    
    const dates = logs
      .map(log => log.fecha_hora)
      .filter(Boolean)
      .map(date => new Date(date))
      .sort((a, b) => a - b);
    
    if (dates.length === 0) return { min: '', max: '' };
    
    const minDate = dates[0].toISOString().split('T')[0];
    const maxDate = dates[dates.length - 1].toISOString().split('T')[0];
    
    return { min: minDate, max: maxDate };
  };

  const dateRange = getDateRange();return (
    <div className="Logs_logs-layout">
      {/* Header Section - Similar a AgregarContenido y HistorialTab */}
      <div className="Logs_header-section">
        <h1 className="Logs_main-title">Logs del Sistema</h1>
        <div className="Logs_top-controls">
          <button className="Logs_btn-refresh" onClick={() => cargarLogs(currentPage)}>
            <RotateCcw size={18} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="Logs_contenido-container">        {/* Search bar similar a AgregarContenido */}
        <div className="Logs_search-bar-container">
          <Search className="Logs_search-icon" size={18} />
          <input
            type="text"
            className="Logs_search-input"
            placeholder="Buscar en logs del sistema..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Stats Cards mejoradas - Usando estadísticas locales */}
        <div className="Logs_stats-grid">
          <div className="Logs_stat-card Logs_total">
            <div className="Logs_stat-content">
              <div className="Logs_stat-icon-wrapper">
                <FileText size={24} />
              </div>
              <div className="Logs_stat-details">
                <span className="Logs_stat-number">{localStats.total_logs_sistema}</span>
                <span className="Logs_stat-description">Logs Filtrados</span>
              </div>
            </div>
          </div>
          
          <div className="Logs_stat-card Logs_info">
            <div className="Logs_stat-content">
              <div className="Logs_stat-icon-wrapper">
                <Activity size={24} />
              </div>
              <div className="Logs_stat-details">
                <span className="Logs_stat-number">{localStats.acciones_unicas}</span>
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
                <span className="Logs_stat-number">{localStats.usuarios_activos}</span>
                <span className="Logs_stat-description">Usuarios Únicos</span>
              </div>
            </div>
          </div>
          
          <div className="Logs_stat-card Logs_system">
            <div className="Logs_stat-content">
              <div className="Logs_stat-icon-wrapper">
                <DatabaseBackup size={24} />
              </div>
              <div className="Logs_stat-details">
                <span className="Logs_stat-number">{localStats.tablas_afectadas}</span>
                <span className="Logs_stat-description">Tablas Afectadas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros mejorados con filtros locales */}
        <div className="Logs_controls-wrapper">
          <div className="Logs_filters-header">
            <h3 className="Logs_filters-title">
              <Filter size={20} />
              Filtros Locales (Tiempo Real)
            </h3>
            <button className="Logs_btn-clear-filters" onClick={limpiarFiltrosLocales}>
              <X size={16} />
              Limpiar Filtros
            </button>
          </div>
            <div className="Logs_controls-grid">
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Acción</label>
              <select 
                className="Logs_filter-select" 
                value={localAccion} 
                onChange={(e) => setLocalAccion(e.target.value)}
              >
                <option value="">Todas las acciones ({getAvailableActions().length})</option>
                {getAvailableActions().map(accion => (
                  <option key={accion} value={accion}>
                    {accion} ({logs.filter(log => log.accion === accion).length})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Tabla Afectada</label>
              <select 
                className="Logs_filter-select" 
                value={localTabla} 
                onChange={(e) => setLocalTabla(e.target.value)}
              >
                <option value="">Todas las tablas ({getAvailableTables().length})</option>
                {getAvailableTables().map(tabla => (
                  <option key={tabla} value={tabla}>
                    {tabla} ({logs.filter(log => log.tabla_afectada === tabla).length})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Usuario</label>
              <select
                className="Logs_filter-select"
                value={localUsuario}
                onChange={(e) => setLocalUsuario(e.target.value)}
              >
                <option value="">Todos los usuarios ({getAvailableUsers().length})</option>
                {getAvailableUsers().map(user => (
                  <option key={user.id_usuario} value={user.id_usuario}>
                    {user.nombre} (ID: {user.id_usuario}) - {user.tipo}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Fecha Inicio</label>
              <input
                type="date"
                className="Logs_filter-input"
                value={localFechaInicio}
                onChange={(e) => setLocalFechaInicio(e.target.value)}
                min={dateRange.min}
                max={dateRange.max}
                title={`Rango disponible: ${dateRange.min} a ${dateRange.max}`}
              />
              {dateRange.min && (
                <small className="Logs_date-hint">
                  Disponible desde: {dateRange.min}
                </small>
              )}
            </div>
            
            <div className="Logs_filter-group">
              <label className="Logs_control-label">Fecha Fin</label>
              <input
                type="date"
                className="Logs_filter-input"
                value={localFechaFin}
                onChange={(e) => setLocalFechaFin(e.target.value)}
                min={dateRange.min}
                max={dateRange.max}
                title={`Rango disponible: ${dateRange.min} a ${dateRange.max}`}
              />
              {dateRange.max && (
                <small className="Logs_date-hint">
                  Disponible hasta: {dateRange.max}
                </small>
              )}
            </div>
            
            <div className="Logs_filter-actions">
              <div className="Logs_filter-status">                {(localSearch || localAccion || localTabla || localUsuario || localFechaInicio || localFechaFin) && (
                  <span className="Logs_filter-active-indicator">
                    <Filter size={14} />
                    {[localSearch, localAccion, localTabla, localUsuario, localFechaInicio, localFechaFin].filter(Boolean).length} filtros activos
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contador de resultados actualizado */}
        <div className="Logs_resultados-contador">
          Mostrando <span className="Logs_resaltado">{currentLogs.length}</span> de <span className="Logs_resaltado">{filteredLogs.length}</span> logs filtrados
          {filteredLogs.length !== logs.length && (
            <span className="Logs_total-original"> (Total original: {logs.length})</span>
          )}
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
        )}        {/* Tabla principal */}
        {!logsLoading && !logsError && currentLogs.length > 0 && (
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
                  {currentLogs.map((log) => (
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
                            <span className="Logs_user-name">{log.usuario?.nombre || 'N/A'}</span>
                            <span className={`Logs_user-type Logs_${log.usuario?.tipo?.toLowerCase() || 'usuario'}`}>
                              {log.usuario?.tipo || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="Logs_action-cell">
                        <div
                          className={`Logs_action-pill Logs_action-${log.accion?.toLowerCase() || 'unknown'}`}
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
                          <span className="Logs_table-name">{log.tabla_afectada || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="Logs_datetime-cell">
                        <div className="Logs_datetime-content">
                          <span className="Logs_date">
                            {log.fecha_hora ? LogsService.formatearFecha(log.fecha_hora).split(' ')[0] : 'N/A'}
                          </span>
                          <span className="Logs_time">
                            {log.fecha_hora ? LogsService.formatearFecha(log.fecha_hora).split(' ')[1] : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="Logs_description-cell">
                        <div className="Logs_description-content">
                          <span className="Logs_description-text">{log.descripcion || 'Sin descripción'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}        {/* Paginación local mejorada */}
        {!logsLoading && !logsError && filteredLogs.length > 0 && totalLocalPages > 1 && (
          <div className="Logs_pagination-controls">
            <button 
              className="Logs_pagination-btn"
              onClick={() => setCurrentLocalPage(currentLocalPage - 1)}
              disabled={currentLocalPage === 1}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            
            <div className="Logs_pagination-pages">
              {Array.from({ length: Math.min(5, totalLocalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentLocalPage - 2) + i;
                if (pageNumber <= totalLocalPages) {
                  return (
                    <button
                      key={pageNumber}
                      className={`Logs_pagination-page ${currentLocalPage === pageNumber ? 'Logs_active' : ''}`}
                      onClick={() => setCurrentLocalPage(pageNumber)}
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
              onClick={() => setCurrentLocalPage(currentLocalPage + 1)}
              disabled={currentLocalPage === totalLocalPages}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Estado vacío mejorado - cuando hay datos pero no coinciden con filtros */}
        {!logsLoading && !logsError && logs.length > 0 && filteredLogs.length === 0 && (
          <div className="Logs__container">
            <div className="Logs__content">
              <table className="Logs_styled-table">
                <thead>
                  <tr>
                    <th colSpan="6">
                      <div className="Logs_header-content">
                        <Filter className="Logs_header-icon" size={16} />
                        <span>Sin resultados con los filtros aplicados</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="Logs_empty-row">
                    <td colSpan="6" className="Logs_empty-cell">
                      <div className="Logs_empty-state">
                        <div className="Logs_empty-icon">
                          <Filter className="Logs_no-data-icon" size={48} />
                        </div>
                        <div className="Logs_empty-text">
                          No hay logs que coincidan con los filtros
                        </div>
                        <div className="Logs_empty-subtitle">
                          Intenta ajustar los filtros o limpiarlos para ver más resultados.<br/>
                          Total de logs disponibles: <strong>{logs.length}</strong>
                        </div>
                        <button className="Logs_btn-clear-empty" onClick={limpiarFiltrosLocales}>
                          <X size={16} />
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

        {/* Estado cuando no hay logs del servidor */}
        {!logsLoading && !logsError && logs.length === 0 && (
          <div className="Logs__container">
            <div className="Logs__content">
              <table className="Logs_styled-table">
                <thead>
                  <tr>
                    <th colSpan="6">
                      <div className="Logs_header-content">
                        <FileText className="Logs_header-icon" size={16} />
                        <span>Sin datos</span>
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
                          No se encontraron logs del sistema
                        </div>
                        <div className="Logs_empty-subtitle">
                          Los logs aparecerán aquí cuando se registren actividades en el sistema
                        </div>
                        <button className="Logs_btn-clear-empty" onClick={() => cargarLogs(currentPage)}>
                          <RefreshCw size={16} />
                          Recargar
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
