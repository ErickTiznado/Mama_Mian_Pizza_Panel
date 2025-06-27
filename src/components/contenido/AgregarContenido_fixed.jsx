/**
 * AgregarContenido Component
 * 
 * Componente principal para la gestión de contenido (productos del menú).
 * Incluye funcionalidades de creación, edición, eliminación y visualización de productos.
 * 
 * Características principales:
 * - Visualización tabular con filtros y búsqueda
 * - Paginación de resultados
 * - Modales para crear y editar productos
 * - Sistema de logging que registra todas las acciones del usuario
 * - Integración con AuthContext para identificar al usuario
 * - Protección de rutas administrativas con autenticación JWT
 * - Manejo de errores de autenticación y permisos
 * 
 * Logging de acciones:
 * - CREATE: Se registra cuando se crea un nuevo producto
 * - UPDATE: Se registra cuando se modifica un producto existente
 * - DELETE: Se registra cuando se elimina un producto
 * - Todos los logs incluyen el ID del usuario autenticado
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileCirclePlus, 
  faSearch, 
  faPen, 
  faTrash, 
  faEye, 
  faCheck, 
  faFilter, 
  faChevronDown,
  faRotateLeft,
  faCalendar,
  faExclamationTriangle,
  faUser,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// Importar componentes
import NewProductModal from './components/NewProductModal';
// Importar contexto de autenticación
import { useAuth } from '../../context/AuthContext';
// Importar servicio de logs
import UserLogService from '../../services/UserLogService';
// Importar estilos principales
import './AgregarContenido.css';

const AgregarContenido = () => {
  const navigate = useNavigate();
  // Obtener datos del usuario autenticado y funciones de autenticación
  const { user, isAuthenticated, getToken, checkAuth, logout, isTokenValid } = useAuth();
  
  // Estados para manejo de autenticación
  const [authError, setAuthError] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Log para verificar que el usuario esté disponible
  useEffect(() => {
    console.log('Usuario autenticado en AgregarContenido:', user);
  }, [user]);
  
  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const verifyAuthentication = () => {
      setIsCheckingAuth(true);
      const token = getToken();
      
      if (!token || !isTokenValid(token) || !isAuthenticated || !user) {
        console.warn('Usuario no autenticado o token inválido');
        setAuthError('Debe iniciar sesión para acceder a esta función');
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
        return;
      }
      
      // Verificar que el usuario tenga permisos administrativos
      if (user.rol !== 'admin' && user.role !== 'admin') {
        setAuthError('No tiene permisos para acceder a esta función');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
      
      setAuthError(null);
      setIsCheckingAuth(false);
    };

    verifyAuthentication();
  }, [isAuthenticated, user, getToken, isTokenValid, logout, navigate]);
  
  // Estados para manejo de contenido
  const [contenidos, setContenidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados para el diálogo de confirmación y elementos seleccionados
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estados para edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Estados para notificaciones
  const [notification, setNotification] = useState(null);

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-cerrar después de 3 segundos
  };

  // Función para crear headers de autenticación
  const createAuthHeaders = () => {
    const token = getToken();
    if (!token) {
      throw new Error('Token de autenticación no disponible');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Función para manejar errores de autenticación en peticiones
  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado o inválido');
      setAuthError('Su sesión ha expirado. Redirigiendo al login...');
      showNotification('Sesión expirada. Por favor, inicie sesión nuevamente.', 'error');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      return true;
    } else if (error.response?.status === 403) {
      setAuthError('No tiene permisos para realizar esta acción');
      showNotification('No tiene permisos para realizar esta acción.', 'error');
      return true;
    }
    return false;
  };

  // Función para cargar datos desde la API
  const fetchData = async () => {
    if (!checkAuth()) {
      setError('Debe iniciar sesión para ver el contenido');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('https://api.mamamianpizza.com/api/content/getMenu');
      console.log('API Response:', response.data); // Para depuración
      console.log('Menu data sample:', response.data.menu?.[0]); // Ver estructura del primer elemento
      
      // La API devuelve response.data.menu en lugar de response.data.productos
      const menuData = response.data.menu || [];
      const formattedData = menuData.map(item => {
        // Calcular el precio basado en las opciones disponibles
        const precioMinimo = item.opciones && item.opciones.length > 0 
          ? Math.min(...item.opciones.map(opcion => opcion.precio))
          : 0;
        
        // Crear una cadena con todos los tamaños disponibles
        const tamanosDisponibles = item.opciones 
          ? item.opciones.map(opcion => `${opcion.nombre}: $${opcion.precio}`).join(', ')
          : null;
          
        return {
          id: item.id,
          imagen: item.imagen || 'https://via.placeholder.com/150?text=Sin+imagen',
          titulo: item.titulo,
          descripcion: item.descripcion,
          tipo: item.categoria || 'Otros', // Usar categoria en lugar de seccion
          categoria: item.categoria || 'Otros', // Mantener categoria para compatibilidad
          categoria_descripcion: item.categoria_descripcion || '',
          opciones: item.opciones || [], // Mantener opciones para edición
          precio: precioMinimo > 0 ? `Desde $${precioMinimo}` : 'Precio no disponible',
          tamanos: tamanosDisponibles || 'Sin opciones de tamaño',
          estado: item.activo === 1, // Convertir 0/1 a boolean
          fecha: new Date().toISOString().split('T')[0] // Fecha actual como respaldo
        };
      });
      
      console.log('Datos formateados:', formattedData);
      setContenidos(formattedData);
      setFilteredItems(formattedData);
      
      // Extraer tipos únicos de los datos para las pestañas
      const tipos = ['todos', ...new Set(formattedData.map(item => item.tipo))];
      setTiposDisponibles(tipos);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los datos:', err);
      
      // Manejar errores de autenticación
      if (!handleAuthError(err)) {
        setError('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        // En caso de error, mostrar lista vacía
        setContenidos([]);
        setFilteredItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales desde la API real
  useEffect(() => {
    // Solo cargar datos si la autenticación está verificada
    if (!isCheckingAuth && !authError) {
      fetchData();
    }
  }, [isCheckingAuth, authError]);

  // Filtrar contenidos cuando cambia la pestaña activa o el término de búsqueda
  useEffect(() => {
    let result = contenidos;
    
    // Filtrar por tipo según la pestaña seleccionada
    if (activeTab !== 'todos') {
      result = result.filter(item => item.tipo === activeTab);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.titulo.toLowerCase().includes(searchLower) || 
        item.descripcion.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredItems(result);
    // Volver a la primera página al cambiar filtros
    setCurrentPage(1); 
  }, [activeTab, searchTerm, contenidos]);

  // Lógica para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleEdit = (id) => {
    // Verificar autenticación antes de permitir edición
    if (!checkAuth()) {
      setAuthError('Debe iniciar sesión para editar contenido');
      showNotification('Debe iniciar sesión para realizar esta acción.', 'error');
      return;
    }

    console.log(`Editando contenido con ID: ${id}`);
    const itemToEdit = contenidos.find(item => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    // Verificar autenticación antes de permitir eliminación
    if (!checkAuth()) {
      setAuthError('Debe iniciar sesión para eliminar contenido');
      showNotification('Debe iniciar sesión para realizar esta acción.', 'error');
      return;
    }

    // Guardar el ID seleccionado y mostrar diálogo de confirmación
    setSelectedItemId(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedItemId) return;
    
    // Verificar autenticación antes de proceder
    if (!checkAuth()) {
      setAuthError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      showNotification('Sesión expirada. Redirigiendo al login...', 'error');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      return;
    }
    
    const itemToDelete = contenidos.find(item => item.id === selectedItemId);
    
    try {
      setIsLoading(true);
      
      // Preparar datos para el log incluyendo el ID del usuario
      const deleteData = {
        user_id: user?.id || null,
        action: 'DELETE',
        item_id: selectedItemId,
        item_title: itemToDelete?.titulo || 'Producto eliminado'
      };
      
      console.log('Enviando datos de eliminación:', deleteData);
      
      // Crear headers con autenticación
      const headers = createAuthHeaders();
      
      // Llamar a la API para eliminar el contenido usando el endpoint correcto
      await axios.delete(`https://api.mamamianpizza.com/api/content/deleteContent/${selectedItemId}`, {
        data: deleteData,
        headers
      });
      
      // Registrar la acción en los logs del sistema
      if (user?.id && itemToDelete) {
        await UserLogService.logProductAction(user.id, 'DELETE', {
          id: selectedItemId,
          titulo: itemToDelete.titulo,
          categoria: itemToDelete.categoria || itemToDelete.tipo,
          descripcion: itemToDelete.descripcion
        }, itemToDelete);
      }
      
      // Actualizar el estado eliminando el elemento
      const updatedContent = contenidos.filter(item => item.id !== selectedItemId);
      setContenidos(updatedContent);
      setFilteredItems(updatedContent.filter(item => {
        // Mantener los filtros actuales
        if (activeTab !== 'todos' && item.tipo !== activeTab) return false;
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return item.titulo.toLowerCase().includes(searchLower) || 
                 item.descripcion.toLowerCase().includes(searchLower);
        }
        return true;
      }));
      
      // Cerrar el diálogo de confirmación
      setShowConfirmDialog(false);
      setSelectedItemId(null);
      
      // Mostrar mensaje de éxito
      showNotification('Contenido eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar contenido:', error);
      
      // Manejar errores de autenticación
      if (!handleAuthError(error)) {
        showNotification('Error al eliminar el contenido. Por favor, inténtalo de nuevo.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    // Cerrar el diálogo de confirmación sin hacer nada
    setShowConfirmDialog(false);
    setSelectedItemId(null);
  };

  const handlePreview = (id) => {
    // Buscar el elemento para mostrar en la vista previa
    const item = contenidos.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowPreviewModal(true);
    }
  };
  
  const handleAddNew = () => {
    // Verificar autenticación antes de permitir crear nuevo contenido
    if (!checkAuth()) {
      setAuthError('Debe iniciar sesión para crear contenido');
      showNotification('Debe iniciar sesión para realizar esta acción.', 'error');
      return;
    }

    console.log('Agregando nuevo contenido');
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    // Recargar la lista de productos después de una adición exitosa
    fetchData();
    setShowAddModal(false);
  };

  const handleEditSuccess = () => {
    // Recargar la lista de productos después de una edición exitosa
    fetchData();
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Funciones para paginación
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

  // Función para obtener el color de cada categoría
  const getCategoryColor = (tipo) => {
    const colorMap = {
      'Pizza': '#dc2626',
      'Pizzas': '#dc2626', // Para compatibilidad
      'Complementos': '#2563eb',
      'Bebidas': '#16a34a',
      'Banner': '#d97706',
      'Recomendaciones': '#7c3aed',
      'Populares': '#ea580c',
      'Banner Final': '#f59e0b',
      'Postres': '#ec4899',
      'Promociones': '#8b5cf6'
    };
    return colorMap[tipo] || '#6b7280'; // Color por defecto si no se encuentra la categoría
  };

  // Renderizar componente principal
  return (
    <div className="admin-content-management">
      {/* Mostrar estado de verificación de autenticación */}
      {isCheckingAuth && (
        <div className="auth-checking-overlay">
          <div className="auth-checking-content">
            <div className="loading-spinner"></div>
            <p>Verificando autenticación...</p>
          </div>
        </div>
      )}

      {/* Mostrar errores de autenticación */}
      {authError && (
        <div className="auth-error-banner">
          <FontAwesomeIcon icon={faExclamationTriangle} className="auth-error-icon" />
          <span className="auth-error-text">{authError}</span>
        </div>
      )}

      {/* Contenido principal solo si está autenticado */}
      {!isCheckingAuth && !authError && (
        <>
          <div className="header-section">
            <div className="header-title-section">
              <h1 className="main-title">Gestión de Contenido</h1>
              {/* Indicador de usuario autenticado */}
              {user && (
                <div className="admin-info">
                  <div className="admin-status">
                    <FontAwesomeIcon icon={faUser} className="admin-icon" />
                    <span className="admin-name">{user.nombre || user.username}</span>
                    <span className="admin-role">({user.rol || user.role})</span>
                  </div>
                  <button 
                    className="logout-btn"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Cerrar sesión"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </button>
                </div>
              )}
            </div>
            <div className="top-controls">
              {/* Solo mostrar botón si está autenticado */}
              {checkAuth() && (
                <button 
                  className="btn-add-new"
                  onClick={handleAddNew}
                >
                  <FontAwesomeIcon icon={faFileCirclePlus} />
                  Nuevo Contenido
                </button>
              )}
            </div>
          </div>

          <div className='Contenido-container'> 
            <div className="search-bar-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="cont_search-input"
              placeholder="Buscar contenido..."
              value={searchTerm}
              onChange={handleSearch}
            />
              </div>
            
            <div className="content-tabs-wrapper">
              <div className="content-tabs">
                {/* Botón "Todos" siempre presente */}
                <button 
                  className={`tab-button ${activeTab === 'todos' ? 'cont_active' : ''}`}
                  onClick={() => handleTabChange('todos')}
                >
                  Todos
                </button>
                
                {/* Generar botones dinámicamente basados en las categorías disponibles */}
                {tiposDisponibles
                  .filter(tipo => tipo !== 'todos') // Excluir 'todos' ya que lo agregamos manualmente
                  .map(tipo => (
                    <button 
                      key={tipo}
                      className={`tab-button ${activeTab === tipo ? 'cont_active' : ''}`}
                      onClick={() => handleTabChange(tipo)}
                    >
                      {tipo}
                    </button>
                  ))
                }
              </div>
            </div>

          {/* Resultados filtrados */}
        <div className="content-results">
          {isLoading ? (
            <div className="loading-message">Cargando contenido...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              {/* Tabla de contenido */}
              <div className="order__container">
                <div className="order__content">
                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th className="th-preview">
                          <div className="header-content">
                            <FontAwesomeIcon icon={faEye} className="header-icon" />
                            <span>Vista Previa</span>
                          </div>
                        </th>
                        <th className="th-content">
                          <div className="header-content">
                            <FontAwesomeIcon icon={faFileCirclePlus} className="header-icon" />
                            <span>Contenido</span>
                          </div>
                        </th>
                        <th className="th-type">
                          <div className="header-content">
                            <FontAwesomeIcon icon={faFilter} className="header-icon" />
                            <span>Tipo</span>
                          </div>
                        </th>
                        <th className="th-status">
                          <div className="header-content">
                            <FontAwesomeIcon icon={faCheck} className="header-icon" />
                            <span>Estado</span>
                          </div>
                        </th>
                        <th className="th-date">
                          <div className="header-content">
                            <FontAwesomeIcon icon={faCalendar} className="header-icon" />
                            <span>Fecha</span>
                          </div>
                        </th>
                        <th className="th-actions">
                          <div className="header-content">
                            <span>Acciones</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map(item => (
                          <tr key={item.id} className="styled-row content-row">
                            <td className="preview-cell">
                              <div className="preview-image-container">
                                {item.imagen && item.imagen !== '/path/to/image' ? (
                                  <img 
                                    src={item.imagen} 
                                    alt={item.titulo} 
                                    className="preview-image" 
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/150?text=Sin+imagen';
                                    }}
                                  />
                                ) : (
                                  <div className="preview-image-placeholder">Sin imagen</div>
                                )}
                              </div>
                            </td>
                            <td className="content-cell">
                              <div className="content-info">
                                <div className="content-title">{item.titulo}</div>
                                <div className="content-description">{item.descripcion}</div>
                                {item.precio && (
                                  <div className="content-price">
                                    <span className="price-label">{item.precio}</span>
                                    {item.tamanos && <span className="sizes-info">• {item.tamanos}</span>}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="type-cell">
                              <div
                                className={`type-pill type-${item.tipo.toLowerCase().replace(/\s+/g, '-')}`}
                                style={{
                                  backgroundColor: getCategoryColor(item.tipo),
                                  color: '#ffffff',
                                  fontWeight: '700'
                                }}
                              >
                                <span className="type-text">{item.tipo}</span>
                              </div>
                            </td>
                            <td className="status-cell">
                              <div
                                className={`estado-pill estado-${item.estado ? 'activo' : 'inactivo'}`}
                                style={{
                                  backgroundColor: item.estado ? '#22c55e' : '#dc2626',
                                  color: '#ffffff',
                                  fontWeight: '700'
                                }}
                              >
                                <span
                                  className="estado-dot"
                                  style={{
                                    backgroundColor: item.estado ? '#16a34a' : '#b91c1c'
                                  }}
                                ></span>
                                <FontAwesomeIcon 
                                  icon={item.estado ? faCheck : faRotateLeft} 
                                  className="status-icon" 
                                />
                                <span className="estado-text">{item.estado ? 'Activo' : 'Inactivo'}</span>
                              </div>
                            </td>
                            <td className="date-cell">
                              <div className="date-info">
                                <FontAwesomeIcon icon={faCalendar} className="icon-small date-icon" />
                                <span className="date-text">{item.fecha}</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <button
                                  className="btn-details enhanced-btn"
                                  onClick={() => handlePreview(item.id)}
                                  title="Vista previa"
                                >
                                  <FontAwesomeIcon icon={faEye} className="btn-icon" />
                                  <span className="btn-text">Ver</span>
                                </button>
                                <button
                                  className="btn-edit enhanced-btn action-btn"
                                  onClick={() => handleEdit(item.id)}
                                  title="Editar"
                                >
                                  <FontAwesomeIcon icon={faPen} className="action-icon" />
                                  <span className="btn-text">Editar</span>
                                </button>
                                <button
                                  className="btn-delete enhanced-btn action-btn"
                                  onClick={() => handleDelete(item.id)}
                                  title="Eliminar"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="action-icon" />
                                  <span className="btn-text">Eliminar</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="empty-row">
                          <td colSpan="6" className="empty-cell">
                            <div className="empty-state">
                              <div className="empty-icon">
                                <FontAwesomeIcon icon={faFileCirclePlus} className="no-data-icon" />
                              </div>
                              <div className="empty-text">
                                No hay contenido para mostrar
                              </div>
                              <div className="empty-subtitle">
                                Los productos aparecerán aquí cuando estén disponibles
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    className="pagination-btn"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        </div>
        </>
      )}

      {/* Modal de Vista Previa */}
      {showPreviewModal && selectedItem && (
        <div className="modal-overlay">
          <div className="preview-modal">
            <div className="cont_modal-header">
              <h2>Vista Previa</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowPreviewModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="cont-modal-content">              
              <div className="preview-modal-image">
                <img 
                  src={selectedItem.imagen || 'https://via.placeholder.com/300?text=Sin+imagen'} 
                  alt={selectedItem.titulo} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/300?text=Sin+imagen';
                  }}
                  className="cont_preview-modal-image-container"
                />
              </div>
              
              <div className="cont_preview-modal-info">
                <h3 className="cont_preview-modal-title">{selectedItem.titulo}</h3>
                
                <p className="cont_preview-modal-description">{selectedItem.descripcion}</p>
                
                <div className="cont_preview-details">
                  <div className="cont_preview-detail-item">
                    <span className="cont_detail-label">Tipo:</span>
                    <span className="cont_detail-value cont_detail-value-type">{selectedItem.tipo}</span>
                  </div>
                  
                  {selectedItem.precio && (
                    <div className="cont_preview-detail-item">
                      <span className="cont_detail-label">Precio:</span>
                      <span className="cont_detail-value cont_detail-value-price">{selectedItem.precio}</span>
                    </div>
                  )}
                  
                  {selectedItem.tamanos && (
                    <div className="cont_preview-detail-item">
                      <span className="cont_detail-label">Tamaños:</span>
                      <span className="cont_detail-value cont_detail-value-size">{selectedItem.tamanos}</span>
                    </div>
                  )}
                  
                  <div className="cont_preview-detail-item">
                    <span className="cont_detail-label">Estado:</span>
                    <span className={`cont_detail-value cont_detail-value-status ${selectedItem.estado ? 'active' : 'inactive'}`}>
                      {selectedItem.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="cont_preview-detail-item">
                    <span className="cont_detail-label">Fecha:</span>
                    <span className="cont_detail-value cont_detail-value-date">
                      <FontAwesomeIcon icon={faCalendar} style={{opacity: 0.7}} /> {selectedItem.fecha}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="cont_confirm-dialog">
            <div className="cont_confirm-dialog-content">
              <h3>Confirmar Eliminación</h3>
              <p>¿Estás seguro de que deseas eliminar este contenido? Esta acción no se puede deshacer.</p>
              <div className="cont_confirm-dialog-buttons">
                <button 
                  className="cont_cancel-btn"
                  onClick={cancelDelete}
                >
                  Cancelar
                </button>
                <button 
                  className="cont_confirm-delete-btn"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar nuevo producto */}
      <NewProductModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={handleAddSuccess}
        user={user}
      />

      {/* Modal para editar producto */}
      <NewProductModal 
        show={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }} 
        onSuccess={handleEditSuccess}
        editingProduct={editingItem}
        isEditing={true}
        user={user}
      />

      {/* Componente de notificación */}
      {notification && (
        <div className={`notification-toast notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarContenido;
