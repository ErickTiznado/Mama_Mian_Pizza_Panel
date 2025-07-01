import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Shield,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminTabs from './components/AdminTabs';
import AdminService from '../../services/AdminService';
import './GestionAdministradores.css';

const GestionAdministradores = () => {
  // Estados para manejo de administradores
  const [administradores, setAdministradores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para modales
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Estados para elementos seleccionados
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Función para cargar datos desde la API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await AdminService.getAllAdmins();
      setAdministradores(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los administradores: ' + err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar administradores cuando cambien los filtros
  useEffect(() => {
    let filtered = administradores.filter(admin => {
      const matchesSearch = admin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.celular.includes(searchTerm);
      
      const matchesRol = filtroRol === '' || admin.rol === filtroRol;
      
      // Filtro por tab activo
      const matchesActiveFilter = activeFilter === 'todos' || admin.rol === activeFilter;
      
      return matchesSearch && matchesRol && matchesActiveFilter;
    });
    
    setFilteredAdmins(filtered);
    setCurrentPage(1); // Reset a primera página cuando se filtra
  }, [searchTerm, filtroRol, administradores, activeFilter]);

  // Cálculos de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  // Función para manejar el cambio de filtro de tabs
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    // Limpiar otros filtros cuando se cambia de tab
    setFiltroRol('');
  };

  // Calcular conteos para los tabs
  const counts = {
    todos: administradores.length,
    super_admin: administradores.filter(admin => admin.rol === 'super_admin').length,
    admin: administradores.filter(admin => admin.rol === 'admin').length,
    moderador: administradores.filter(admin => admin.rol === 'moderador').length
  };

  // Funciones de manejo de eventos
  const handlePreview = (admin) => {
    setSelectedAdmin(admin);
    setShowPreviewModal(true);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = (adminId) => {
    setSelectedAdminId(adminId);
    setShowConfirmDialog(true);
  };

  const handleToggleEstado = async (adminId) => {
    try {
      const admin = administradores.find(a => a.id_admin === adminId);
      await AdminService.toggleAdminStatus(adminId, admin.estado);
      
      // Actualizar estado local
      const nuevoEstado = admin.estado === 'activo' ? 'inactivo' : 'activo';
      const updatedAdmins = administradores.map(admin => 
        admin.id_admin === adminId 
          ? { ...admin, estado: nuevoEstado }
          : admin
      );
      setAdministradores(updatedAdmins);
      
      console.log(`Estado del administrador ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error al cambiar el estado del administrador: ' + error.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await AdminService.deleteAdmin(selectedAdminId);
      
      // Actualizar estado local
      const updatedAdmins = administradores.filter(admin => admin.id_admin !== selectedAdminId);
      setAdministradores(updatedAdmins);
      console.log('Administrador eliminado correctamente');
      setShowConfirmDialog(false);
      setSelectedAdminId(null);
    } catch (error) {
      console.error('Error al eliminar el administrador: ' + error.message);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setSelectedAdminId(null);
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = async (newAdminData) => {
    try {
      await AdminService.createAdmin(newAdminData);
      setShowAddModal(false);
      fetchData(); // Recargar datos
      console.log('Administrador agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el administrador: ' + error.message);
    }
  };

  const handleEditSuccess = async (updatedAdminData) => {
    try {
      await AdminService.updateAdmin(updatedAdminData.id_admin, updatedAdminData);
      setShowEditModal(false);
      setEditingAdmin(null);
      fetchData(); // Recargar datos
      console.log('Administrador actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el administrador: ' + error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRolChange = (e) => {
    setFiltroRol(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Funciones de paginación
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRolBadgeClass = (rol) => {
    switch(rol) {
      case 'super_admin': return 'badge-super-admin';
      case 'admin': return 'badge-admin';
      case 'moderador': return 'badge-moderador';
      case 'empleado': return 'badge-empleado';
      default: return 'badge-usuario';
    }
  };

  const getRolDisplayName = (rol) => {
    switch(rol) {
      case 'super_admin': return 'Dueño';
      case 'admin': return 'Administrador';
      case 'moderador': return 'Moderador';
      case 'empleado': return 'Empleado';
      default: return rol;
    }
  };

  return (
    <div className="order_container">
      {/* Panel principal con estilo similar a OrderManager */}
      <div className="order_panel">
        <div className="order_header">
          <h1 className="titulo-pedidos">Gestión de Administradores</h1>
          <button className="order_btn-agregar" onClick={handleAddNew}>
            <Plus size={20} />
            Agregar Administrador
          </button>
        </div>
        
        <main className="order_main">
          {/* Sección integrada de tabs y filtros */}
          <div className="admin-tabs-search-section">
            {/* Tabs para filtrar por rol */}
            <AdminTabs 
              activeFilter={activeFilter}
              handleFilterChange={handleFilterChange}
              setPaginaActual={setCurrentPage}
              counts={counts}
            />

            {/* Barra de búsqueda y filtros */}
            <div className="admin-search-filters-container">
              <div className="admin-search-wrapper">
                <Search size={20} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="admin-search-input"
                />
              </div>
            </div>
          </div>

          {/* Contador de resultados */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <div className="cont_resultados-contador">
              Mostrando <span className="cont_resaltado">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAdmins.length)}</span> de <span className="cont_resaltado">{filteredAdmins.length}</span> administradores
            </div>
          </div>

          {/* Mensajes de carga o error */}
          {isLoading && <div className="loading-indicator">Cargando administradores...</div>}
          {error && <div className="order_error">{error}</div>}

          {/* Tabla de administradores */}
          <div className="order__container">
            <div className="order__content">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>
                      <div className="header-content">
                        <User size={16} className="header-icon" />
                        <span>Administrador</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <Shield size={16} className="header-icon" />
                        <span>Rol</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <Mail size={16} className="header-icon" />
                        <span>Contacto</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <Calendar size={16} className="header-icon" />
                        <span>Fechas</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <CheckCircle size={16} className="header-icon" />
                        <span>Estado</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <span>Acciones</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr className="empty-row">
                      <td colSpan="6" className="empty-cell">
                        <div className="empty-state">
                          <div className="loading-spinner">
                            <div className="spinner"></div>
                          </div>
                          <p className="empty-text">Cargando administradores...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr className="empty-row">
                      <td colSpan="6" className="empty-cell">
                        <div className="empty-state">
                          <AlertTriangle size={48} className="no-data-icon" />
                          <p className="empty-text">Error al cargar</p>
                          <p className="empty-subtitle">{error}</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan="6" className="empty-cell">
                        <div className="empty-state">
                          <Users size={48} className="no-data-icon" />
                          <p className="empty-text">No hay administradores</p>
                          <p className="empty-subtitle">No se encontraron administradores que coincidan con los filtros seleccionados</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((admin) => (
                      <tr key={admin.id_admin} className="order-row">
                        <td>
                          <div className="admin-info-usuario">
                            <div className="admin-avatar">
                              <User size={20} />
                            </div>
                            <div className="admin-datos">
                              <span className="admin-nombre">{admin.nombre}</span>
                              <span className="admin-id">ID: {admin.id_admin}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div className={`estado-pill ${getRolBadgeClass(admin.rol)}`}>
                            <Shield size={12} className="estado-dot" />
                            <span className="estado-text">{getRolDisplayName(admin.rol)}</span>
                          </div>
                        </td>
                        
                        <td>
                          <div className="admin-contacto">
                            <div className="admin-email">
                              <Mail size={14} />
                              <span>{admin.correo}</span>
                            </div>
                            <div className="admin-telefono">
                              <Phone size={14} />
                              <span>{admin.celular}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div className="admin-fecha">
                            <div className="admin-fecha-principal">
                              <Calendar size={14} />
                              <span className="admin-fecha-creacion">
                                Creado: {formatDate(admin.fecha_creacion)}
                              </span>
                            </div>
                            <div className="admin-fecha-registro">
                              Último acceso: {formatDateTime(admin.ultimo_acceso)}
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div className={`estado-pill ${admin.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}>
                            <div className="estado-dot"></div>
                            <span className="estado-text">{admin.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
                          </div>
                        </td>
                        
                        <td>
                          <div className="action-buttons">
                            <button
                              className="enhanced-btn btn-edit"
                              onClick={() => handleEdit(admin)}
                              title="Editar administrador"
                            >
                              <Edit size={16} className="btn-icon" />
                              <span className="btn-text">Editar</span>
                            </button>
                            
                            <button
                              className={`enhanced-btn ${admin.estado === 'activo' ? 'btn-cancel' : 'btn-start'}`}
                              onClick={() => handleToggleEstado(admin.id_admin)}
                              title={admin.estado === 'activo' ? 'Desactivar' : 'Activar'}
                            >
                              {admin.estado === 'activo' ? <UserX size={16} className="btn-icon" /> : <UserCheck size={16} className="btn-icon" />}
                              <span className="btn-text">{admin.estado === 'activo' ? 'Desactivar' : 'Activar'}</span>
                            </button>
                            
                            <button
                              className="enhanced-btn btn-delete"
                              onClick={() => handleDelete(admin.id_admin)}
                              title="Eliminar administrador"
                            >
                              <Trash2 size={16} className="btn-icon" />
                              <span className="btn-text">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {!isLoading && filteredAdmins.length > 0 && (
            <div className="order_pagination">
              <button
                disabled={currentPage === 1}
                onClick={prevPage}
                className="order_pagination-btn"
              >
                ⬅ Anterior
              </button>
              <span className="order_pagination-info">
                Página {currentPage} de {totalPages || 1}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={nextPage}
                className="order_pagination-btn"
              >
                Siguiente ➡
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="admin-confirm-dialog">
            <div className="admin-confirm-dialog-content">
              <AlertTriangle size={48} color="#ef4444" />
              <h3>¿Eliminar administrador?</h3>
              <p>Esta acción no se puede deshacer. El administrador perderá acceso permanentemente al sistema.</p>
              <div className="admin-confirm-dialog-buttons">
                <button className="admin-cancel-btn" onClick={cancelDelete}>
                  Cancelar
                </button>
                <button className="admin-confirm-delete-btn" onClick={confirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GestionAdministradores;
