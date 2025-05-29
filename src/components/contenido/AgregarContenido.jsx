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
// Importar estilos principales
import './AgregarContenido.css';

const AgregarContenido = () => {
  // Estados para manejo de contenido
  const [contenidos, setContenidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todos');
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos de muestra para desarrollo (en producción se reemplazará con llamada a la API)
  const mockData = [
    {
      id: 1,
      imagen: '/path/to/image1.jpg',
      titulo: 'Banner Principal - Bienvenidos',
      descripcion: 'Bienvenidos a Pizzeria Bella - Las mejores pizzas...',
      tipo: 'Banner',
      estado: true,
      fecha: '2025-01-15'
    },
    {
      id: 2,
      imagen: '/path/to/image2.jpg',
      titulo: 'Pizza Margherita',
      descripcion: 'Deliciosa pizza con tomate, mozzarella fresca...',
      tipo: 'Pizzas',
      precio: '$12.50',
      tamanos: 'Personal, Mediana, Familiar',
      estado: true,
      fecha: '2025-01-20'
    },
    {
      id: 3,
      imagen: '/path/to/image3.jpg',
      titulo: 'Pizza Pepperoni',
      descripcion: 'Pizza clásica con pepperoni y queso mozzarella',
      tipo: 'Pizzas',
      precio: '$14.90',
      tamanos: 'Personal, Mediana, Familiar',
      estado: true,
      fecha: '2025-01-18'
    },
    {
      id: 4,
      imagen: '/path/to/image4.jpg',
      titulo: 'Coca Cola 500ml',
      descripcion: 'Refrescante Coca Cola de 500ml',
      tipo: 'Bebidas',
      precio: '$2.50',
      estado: true,
      fecha: '2025-01-10'
    },
    {
      id: 5,
      imagen: '/path/to/image5.jpg',
      titulo: 'Papas Fritas',
      descripcion: 'Crujientes papas fritas',
      tipo: 'Complementos',
      precio: '$4.50',
      tamanos: 'Porción grande',
      estado: true,
      fecha: '2025-01-12'
    },
    {
      id: 6,
      imagen: '/path/to/image6.jpg',
      titulo: 'Pizza Hawaiana',
      descripcion: 'Pizza con jamón, piña y queso - ¡Nuestra recomendación!',
      tipo: 'Recomendaciones',
      precio: '$16.50',
      estado: true,
      fecha: '2025-01-14'
    },
    {
      id: 7,
      imagen: '/path/to/image7.jpg',
      titulo: 'Pizza 4 Quesos',
      descripcion: 'La favorita de nuestros clientes - 4 tipos de quesos italianos',
      tipo: 'Populares',
      precio: '$16.90',
      estado: true,
      fecha: '2025-01-16'
    }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    // Simular carga de datos desde la API
    setIsLoading(true);
    setTimeout(() => {
      setContenidos(mockData);
      setFilteredItems(mockData);
      setIsLoading(false);
    }, 800);
    
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

  // Manejadores de eventos
  const handleEdit = (id) => {
    console.log(`Editando contenido con ID: ${id}`);
    // Implementar lógica para editar contenido
  };

  const handleDelete = (id) => {
    console.log(`Eliminando contenido con ID: ${id}`);
    // Implementar lógica para eliminar contenido
  };

  const handlePreview = (id) => {
    console.log(`Previsualizando contenido con ID: ${id}`);
    // Implementar lógica para previsualizar contenido
  };

  const handleAddNew = () => {
    console.log('Agregando nuevo contenido');
    // Implementar lógica para agregar nuevo contenido
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
            </div>

          <div className="content-tabs-wrapper">
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
          <div className="error-message">{error}</div>
        ) : (
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
                <tbody>
                  {currentItems.map(item => (
                    <tr key={item.id}>
                      <td className="preview-cell">
                        <div className="preview-image-container">
                          {/* Usamos un div en lugar de imagen real para el ejemplo */}
                          <div className="preview-image-placeholder"></div>
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
    
      {/* Pestañas de categorías */}

    </div>
  );
};

export default AgregarContenido;
