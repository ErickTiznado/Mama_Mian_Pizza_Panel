import { useState, useEffect } from 'react';
import {
  FileText,
  RefreshCw,
  Activity,
  User,
  DatabaseBackup,
  Filter,
  Search,
  X,
  AlertTriangle,
  Loader,
  ChevronLeft,
  ChevronRight,
  Lock,
  Package,
  Eye,
  Edit
} from 'lucide-react';
import LogsService from '../../../services/LogsService';

const LogsTab = ({ user }) => {
  // Estados para logs reales
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState(null);
  const [logsStats, setLogsStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // Estados para filtros de logs
  const [accionFiltro, setAccionFiltro] = useState("");
  const [tablaFiltro, setTablaFiltro] = useState("");
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");
  const [usuarioFiltro, setUsuarioFiltro] = useState("");
  const [busquedaLogs, setBusquedaLogs] = useState("");

  // Funciones para limpiar filtros de logs
  const limpiarFiltrosLogs = () => {
    setAccionFiltro("");
    setTablaFiltro("");
    setFechaInicioFiltro("");
    setFechaFinFiltro("");
    setUsuarioFiltro("");
    setBusquedaLogs("");
    setCurrentPage(1);
  };
  // Función para cargar logs desde la API
  const cargarLogs = async (page = 1) => {
    try {
      setLogsLoading(true);
      setLogsError(null);

      const filtros = {
        page,
        limit: 10,
        accion: accionFiltro,
        tabla_afectada: tablaFiltro,
        fecha_inicio: fechaInicioFiltro,
        fecha_fin: fechaFinFiltro,
        id_usuario: usuarioFiltro,
        search: busquedaLogs
      };

      const response = await LogsService.getLogs(filtros);
      
      setLogs(response.logs);
      setLogsStats(response.estadisticas);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
      setTotalLogs(response.pagination.total_logs);
    } catch (error) {
      console.error('Error al cargar logs:', error);
      setLogsError(error.message || 'Error al cargar los logs del sistema');
      setLogs([]);
      setLogsStats(null);
    } finally {
      setLogsLoading(false);
    }
  };

  // Función para aplicar filtros de logs
  const aplicarFiltrosLogs = () => {
    setCurrentPage(1);
    cargarLogs(1);
  };

  // Función para cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
      setCurrentPage(nuevaPagina);
      cargarLogs(nuevaPagina);
    }
  };

  // useEffect para cargar logs cuando se cambia a la pestaña de logs
  useEffect(() => {
    cargarLogs(currentPage);
  }, [accionFiltro, tablaFiltro, fechaInicioFiltro, fechaFinFiltro, usuarioFiltro, busquedaLogs]);

  return (
    <div className="logs-layout">
      {/* Header de logs */}
      <div className="logs-header">
        <div className="logs-title-section">
          <FileText size={28} className="section-icon" />
          <div>
            <h2 className="section-title">Logs del Sistema</h2>
            <p className="section-subtitle">Monitorea todas las actividades y eventos del sistema en tiempo real</p>
          </div>
        </div>
        <div className="logs-actions">
          <button className="btn-refresh-logs" onClick={() => cargarLogs(currentPage)}>
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas de logs */}
      {logsStats && (
        <div className="logs-stats">
          <div className="stat-card total">
            <div className="stat-content">
              <div className="stat-icon-wrapper">
                <FileText size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-number">{logsStats.total_logs_sistema}</span>
                <span className="stat-description">Total de Logs</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-content">
              <div className="stat-icon-wrapper">
                <Activity size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-number">{logsStats.acciones_unicas}</span>
                <span className="stat-description">Tipos de Acciones</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card user">
            <div className="stat-content">
              <div className="stat-icon-wrapper">
                <User size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-number">{logsStats.usuarios_activos}</span>
                <span className="stat-description">Usuarios Activos</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card system">
            <div className="stat-content">
              <div className="stat-icon-wrapper">
                <DatabaseBackup size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-number">{logsStats.tablas_afectadas}</span>
                <span className="stat-description">Tablas Afectadas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros de logs */}
      <div className="logs-filters modern-card compact">
        <div className="filters-header">
          <h3 className="filters-title">
            <Filter size={20} />
            Filtros de Búsqueda
          </h3>
          <button className="btn-clear-filters" onClick={limpiarFiltrosLogs}>
            <X size={16} />
            Limpiar Filtros
          </button>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Buscar en descripción</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Buscar en logs..."
                className="search-input"
                value={busquedaLogs}
                onChange={(e) => setBusquedaLogs(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Acción</label>
            <select 
              className="filter-select" 
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
          
          <div className="filter-group">
            <label className="filter-label">Tabla Afectada</label>
            <select 
              className="filter-select" 
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
          
          <div className="filter-group">
            <label className="filter-label">ID Usuario</label>
            <input
              type="number"
              placeholder="ID del usuario"
              className="filter-input"
              value={usuarioFiltro}
              onChange={(e) => setUsuarioFiltro(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Fecha Inicio</label>
            <input
              type="date"
              className="filter-input"
              value={fechaInicioFiltro}
              onChange={(e) => setFechaInicioFiltro(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Fecha Fin</label>
            <input
              type="date"
              className="filter-input"
              value={fechaFinFiltro}
              onChange={(e) => setFechaFinFiltro(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filters-actions">
          <button className="btn-apply-filters" onClick={aplicarFiltrosLogs}>
            <Search size={16} />
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {logsError && (
        <div className="alert-container error">
          <div className="alert-content">
            <AlertTriangle size={20} className="alert-icon" />
            <div className="alert-text">
              <h4>Error al cargar logs</h4>
              <p>{logsError}</p>
            </div>
            <button 
              onClick={() => cargarLogs(currentPage)}
              className="alert-action-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {logsLoading && (
        <div className="loading-container">
          <div className="loading-content">
            <Loader className="loading-spinner" size={24} />
            <span className="loading-text">Cargando logs del sistema...</span>
          </div>
        </div>
      )}

      {/* Tabla de logs */}
      {!logsLoading && !logsError && logs.length > 0 && (
        <div className="logs-table-container modern-card">
          <div className="table-header">
            <h3 className="table-title">Registro de Logs del Sistema</h3>
            <div className="table-info">
              <span className="table-subtitle">
                Mostrando {logs.length} de {totalLogs} logs
              </span>
              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>
            </div>
          </div>
          
          <div className="table-wrapper">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Tabla</th>
                  <th>Fecha y Hora</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id_log} className="log-row">
                    <td className="id-cell">
                      <span className="log-id">#{log.id_log}</span>
                    </td>
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-avatar">
                          <User size={16} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">{log.usuario.nombre}</span>
                          <span className={`user-type ${LogsService.getColorTipoUsuario(log.usuario.tipo)}`}>
                            {log.usuario.tipo}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="action-cell">
                      <span className={`action-badge ${LogsService.getColorAccion(log.accion)}`}>
                        {log.accion === 'LOGIN' && <Lock size={14} />}
                        {log.accion === 'CREATE' && <Package size={14} />}
                        {log.accion === 'READ' && <Eye size={14} />}
                        {log.accion === 'UPDATE' && <Edit size={14} />}
                        {log.accion === 'DELETE' && <X size={14} />}
                        {log.accion}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="table-name">{log.tabla_afectada}</span>
                    </td>
                    <td className="datetime-cell">
                      <div className="datetime-content">
                        <span className="date">
                          {LogsService.formatearFecha(log.fecha_hora).split(' ')[0]}
                        </span>
                        <span className="time">
                          {LogsService.formatearFecha(log.fecha_hora).split(' ')[1]}
                        </span>
                      </div>
                    </td>
                    <td className="description-cell">
                      <div className="description-content">
                        <span className="description-text">{log.descripcion}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="pagination-container">
            <div className="pagination-info">
              <span>Mostrando {logs.length} de {totalLogs} registros</span>
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-btn prev"
                onClick={() => cambiarPagina(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              
              <div className="pagination-pages">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum <= totalPages) {
                    return (
                      <button 
                        key={pageNum}
                        className={`pagination-page ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => cambiarPagina(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button 
                className="pagination-btn next"
                onClick={() => cambiarPagina(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!logsLoading && !logsError && logs.length === 0 && (
        <div className="empty-state modern-card">
          <div className="empty-content">
            <FileText size={48} className="empty-icon" />
            <h3>No se encontraron logs</h3>
            <p>No hay logs que coincidan con los filtros aplicados.</p>
            <button className="btn-primary" onClick={limpiarFiltrosLogs}>
              <RefreshCw size={16} />
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsTab;
