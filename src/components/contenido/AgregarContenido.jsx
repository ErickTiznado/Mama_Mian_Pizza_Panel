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
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
// Importar componentes
import NewProductModal from './components/NewProductModal';
// Importar estilos principales
import './AgregarContenido.css';

const AgregarContenido = () => {
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

  // Función para cargar datos desde la API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.mamamianpizza.com/api/content/getMenu');
      console.log('API Response:', response.data); // Para depuración
      
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
          tipo: item.seccion || 'Otros',
          precio: `Desde $${precioMinimo}`,
          tamanos: tamanosDisponibles,
          estado: item.activo !== false, // Asumir activo si no se especifica
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
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      // En caso de error, mostrar lista vacía
      setContenidos([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales desde la API real
  useEffect(() => {
    fetchData();
  }, []);

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

  // Estados para el diálogo de confirmación y elementos seleccionados
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Manejadores de eventos
  const handleEdit = (id) => {
    console.log(`Editando contenido con ID: ${id}`);
    // Aquí se podría implementar la redirección a la página de edición
    // o abrir un modal para editar el contenido
    const itemToEdit = contenidos.find(item => item.id === id);
    if (itemToEdit) {
      // Implementación futura: Redireccionar a una página de edición o abrir modal
      alert(`Editando: ${itemToEdit.titulo}`);
    }
  };

  const handleDelete = (id) => {
    // Guardar el ID seleccionado y mostrar diálogo de confirmación
    setSelectedItemId(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedItemId) return;
    
    try {
      setIsLoading(true);
      // Llamar a la API para eliminar el contenido
      await axios.delete(`https://api.mamamianpizza.com/api/content/${selectedItemId}`);
      
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
      alert('Contenido eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar contenido:', error);
      alert('Error al eliminar el contenido. Por favor, inténtalo de nuevo.');
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
    console.log('Agregando nuevo contenido');
    setShowAddModal(true);
  };
  
  const handleAddSuccess = () => {
    // Recargar la lista de productos después de una adición exitosa
    fetchData();
    setShowAddModal(false);
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

  // Renderizar componente principal
  return (
    <div className="admin-content-management">
        <div className="header-section">
          <h1 className="main-title">Gestión de Contenido</h1>
          <div className="top-controls">
            <button 
          className="btn-add-new"
          onClick={handleAddNew}
            >
          <FontAwesomeIcon icon={faFileCirclePlus} />
          Nuevo Contenido
            </button>
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
            </div>          <div className="content-tabs-wrapper">
            <div className="content-tabs">
              <button 
                className={`tab-button ${activeTab === 'todos' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('todos')}
              >
                Todos
              </button>
              <button 
                className={`tab-button ${activeTab === 'Pizzas' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Pizzas')}
              >
                Pizzas
              </button>
              <button 
                className={`tab-button ${activeTab === 'Complementos' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Complementos')}
              >
                Complementos
              </button>
              <button 
                className={`tab-button ${activeTab === 'Bebidas' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Bebidas')}
              >
                Bebidas
              </button>
              <button 
                className={`tab-button ${activeTab === 'Banner' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Banner')}
              >
                Banner
              </button>
              <button 
                className={`tab-button ${activeTab === 'Recomendaciones' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Recomendaciones')}
              >
                Recomendaciones
              </button>
              <button 
                className={`tab-button ${activeTab === 'Populares' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Populares')}
              >
                Populares
              </button>
              <button 
                className={`tab-button ${activeTab === 'Banner Final' ? 'cont_active' : ''}`}
                onClick={() => handleTabChange('Banner Final')}
              >
                Banner Final
              </button>
            </div>
          </div>

        {/* Resultados filtrados */}
      <div className="content-results">
        {isLoading ? (
          <div className="loading-message">Cargando contenido...</div>
        ) : error ? (
          <div className="error-message">{error}</div>        ) : (
          <>
            {/* Tabla de contenido */}
            <div className="content-table-container">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>Vista Previa</th>
                    <th>Contenido</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>                  {currentItems.map(item => (
                    <tr key={item.id}>
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
                          <h3>{item.titulo}</h3>
                          <p>{item.descripcion}</p>
                          {item.precio && <div className="content-price">{item.precio} {item.tamanos && <span>• {item.tamanos}</span>}</div>}
                        </div>
                      </td>
                      <td className="type-cell">
                        <span className={`type-badge type-${item.tipo.toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td className="status-cell">
                        {item.estado ? (
                          <span className="status-cont_active">
                            <FontAwesomeIcon icon={faCheck} className="icon-check" />
                            Activo
                          </span>
                        ) : (
                          <span className="status-inactive">Inactivo</span>
                        )}
                      </td>
                      <td className="date-cell"><FontAwesomeIcon icon={faCalendar} /> {" " + item.fecha}</td>
                      <td className="actions-cell">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handlePreview(item.id)}
                          title="Vista previa"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(item.id)}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(item.id)}
                          title="Eliminar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      {/* Modal de Vista Previa */}
      {showPreviewModal && selectedItem && (        <div className="modal-overlay">
          <div className="preview-modal">
            <div className="cont_modal-header">
              <h2>Vista Previa</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowPreviewModal(false)}
              >
                &times;
              </button>
            </div>            <div className="cont-modal-content">              
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
      )}      {/* Diálogo de confirmación para eliminar */}
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
      />
    </div>
  );
};

export default AgregarContenido;
