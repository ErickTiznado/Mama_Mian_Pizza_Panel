import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

// Importación de componentes modulares
import FilterBar from '../common/FilterBar'; // Reemplazamos FilterRibbon por nuestro nuevo componente
import ContentTable from './components/ContentTable';
import ContentForm from './components/ContentForm';
import NewConfirmModal from './components/NewConfirmModal';
import PaginationControls from './components/PaginationControls';
import CategoryTabs from './components/CategoryTabs';

// Importar estilos principales
import './AgregarContenido.css';

const AgregarContenido = () => {
  // Estados principales
  const [contenidos, setContenidos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // Estado para controlar la visibilidad de los filtros
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    porciones: '',
    categoria: '',
    nuevaCategoria: '',
    sesion: '',
    imagen: null,
    activo: false,
    precio: '',
  });
  
  // Estado para filtros y paginación
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSemana, setFiltroSemana] = useState('todas');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [contenidosFiltrados, setContenidosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  
  // Estados adicionales
  const [previewUrl, setPreviewUrl] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditarId, setProductoEditarId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSesiones, setShowSesiones] = useState(false);
  const [categorias, setCategorias] = useState(['Pizzas', 'Complementos', 'Bebidas']);
  const [modalConfirmacion, setModalConfirmacion] = useState({
    visible: false,
    idProducto: null,
    nombreProducto: '',
  });
  
  // Referencias para cerrar dropdowns cuando se hace clic afuera
  const dropdownRef = useRef(null);
  const sesionesRef = useRef(null);
  const formRef = useRef(null);
  
  // URL base para la API
  const API_URL = 'https://server.tiznadodev.com';
  
  // Opciones para secciones
  const sesionesOptions = [
    'Menu Principal',
    'Ofertas',
    'Especiales',
    'Temporada',
    'Promociones',
  ];

  // Efecto para cerrar dropdowns cuando se hace clic fuera de ellos
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (sesionesRef.current && !sesionesRef.current.contains(event.target)) {
        setShowSesiones(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar contenidos cuando se monta el componente
  useEffect(() => {
    fetchContenidos();
  }, []);

  useEffect(() => {
    if (mostrarFormulario && formRef.current) {
      // Desplazar suavemente hacia el formulario cuando se abre
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mostrarFormulario]);

  // Función para obtener los contenidos desde la API
  const fetchContenidos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/api/content/getMenu`);
      
      if (response.data.productos) {
        setContenidos(response.data.productos);
      } else {
        setContenidos([]);
      }
    } catch (err) {
      setError('Error al cargar los contenidos. Por favor, inténtalo de nuevo.');
      console.error('Error fetching contenidos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    const filtered = contenidos.filter((item) => {
      // Filtro por término de búsqueda
      const terminoMatch = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por semana (esto se implementaría según la lógica de fechas requerida)
      const semanaMatch = filtroSemana === 'todas' || true; // Implementar lógica específica aquí
      
      return terminoMatch && semanaMatch;
    });
    
    setContenidosFiltrados(filtered);
  };

  // Función para mostrar modal de confirmación de eliminación
  const mostrarConfirmacion = (id, nombre) => {
    setModalConfirmacion({
      visible: true,
      idProducto: id,
      nombreProducto: nombre || 'este producto',
    });
  };

  // Función para cancelar eliminación
  const cancelarEliminacion = () => {
    setModalConfirmacion({
      visible: false,
      idProducto: null,
      nombreProducto: '',
    });
  };

  // Función para confirmar eliminación
  const confirmarEliminacion = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.delete(
        `${API_URL}/api/content/deleteContent/${modalConfirmacion.idProducto}`
      );
      
      if (response.status === 200) {
        // Actualizar la lista después de eliminar
        fetchContenidos();
        setSubmitStatus({
          type: 'success',
          message: 'Producto eliminado con éxito',
        });
        
        // Cerrar modal después de eliminar
        setModalConfirmacion({
          visible: false,
          idProducto: null,
          nombreProducto: '',
        });
        
        // Resetear el status después de 3 segundos
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 3000);
      }
    } catch (err) {
      console.error('Error eliminando producto:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Error al eliminar el producto. Inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para editar un producto
  const handleEditar = async (id) => {
    setIsLoading(true);
    setModoEdicion(true);
    setProductoEditarId(id);
    
    try {
      const response = await axios.get(`${API_URL}/api/content/getMenu`);
      
      // Buscar el producto por ID en la respuesta
      const producto = response.data.productos.find(prod => prod.id_producto === id);
      
      if (producto) {
        setFormData({
          titulo: producto.titulo || '',
          descripcion: producto.descripcion || '',
          porciones: producto.porciones || '',
          categoria: producto.categoria || '',
          nuevaCategoria: '',
          sesion: producto.seccion || '', // Nota: cambiado a seccion según la estructura del controlador
          imagen: null,
          activo: producto.activo || false,
          precio: producto.precio || '',
        });
        
        setPreviewUrl(producto.imagen || null);
        setMostrarFormulario(true);
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (err) {
      console.error('Error obteniendo producto para editar:', err);
      setError('Error al obtener los detalles del producto.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para procesar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    
    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'imagen' && value !== null) {
          formDataToSend.append('imagen', value);
        } else if (key !== 'nuevaCategoria' && key !== 'imagen') {
          if (key === 'sesion') {
            // Mapear 'sesion' a 'seccion' como espera el controlador
            formDataToSend.append('sesion', value);
          } else {
            formDataToSend.append(key, value);
          }
        }
      });
      
      let response;
      
      if (modoEdicion) {
        // Actualizar producto existente
        response = await axios.put(
          `${API_URL}/api/content/updateContent/${productoEditarId}`,
          formDataToSend,
          { 
            headers: { 
              'Content-Type': 'multipart/form-data',
            } 
          }
        );
        
        if (response.status === 200) {
          setSubmitStatus({
            type: 'success',
            message: 'Producto actualizado con éxito',
          });
        }
      } else {
        // Crear nuevo producto
        response = await axios.post(
          `${API_URL}/api/content/submit`,
          formDataToSend,
          { 
            headers: { 
              'Content-Type': 'multipart/form-data',
            } 
          }
        );
        
        if (response.status === 201) {
          setSubmitStatus({
            type: 'success',
            message: 'Producto creado con éxito',
          });
        }
      }
      
      // Actualizar la lista de contenidos
      fetchContenidos();
      
      // Resetear el formulario después de éxito
      if (response.status === 200 || response.status === 201) {
        setTimeout(() => {
          setFormData({
            titulo: '',
            descripcion: '',
            porciones: '',
            categoria: '',
            nuevaCategoria: '',
            sesion: '',
            imagen: null,
            activo: false,
            precio: '',
          });
          setPreviewUrl(null);
          setModoEdicion(false);
          setProductoEditarId(null);
          setMostrarFormulario(false);
          setSubmitStatus({ type: '', message: '' });
        }, 2000);
      }
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Error al guardar el producto. Inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular resultados totales para mostrar en contador
  const totalResultados = filtrosAplicados
    ? contenidosFiltrados.filter(item => filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria).length
    : contenidos.filter(item => filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria).length;

  return (
    <div className="cont_container">
      {/* Panel principal */}
      <div className="cont_panel">
        <div className="cont_header">
        <h1>Gestión de Contenido</h1>
        <button 
          className="cont_btn-agregar"
          onClick={() => {
            setMostrarFormulario(true);
            setModoEdicion(false);
            setFormData({
              titulo: '',
              descripcion: '',
              porciones: '',
              categoria: '',
              nuevaCategoria: '',
              sesion: '',
              imagen: null,
              activo: false,
              precio: '',
            });
            setPreviewUrl(null);
          }}
        >
          <FontAwesomeIcon icon={faFileCirclePlus} style={{ marginRight: '10px' }} />
          Agregar Producto
        </button>
        </div>
        
        {/* Botón para ocultar/mostrar filtros y contador */}
        <div className="toggle-filters-container">
          <button 
            className="toggle-filters-btn" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {/* Reemplazamos el componente FilterRibbon con nuestro nuevo FilterBar */}
        {showFilters && (
          <FilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceholder="Buscar por nombre o descripción..."
            filtroSemana={filtroSemana}
            setFiltroSemana={setFiltroSemana}
            filtrosAplicados={filtrosAplicados}
            setFiltrosAplicados={setFiltrosAplicados}
            setPaginaActual={setPaginaActual}
            aplicarFiltros={aplicarFiltros}
            customClassName="cont-filter-bar"
          />
        )}

        {/* Contador de resultados */}
        {showFilters && (
          <div className="cont_resultados-contador">
            Mostrando <span className="cont_resaltado">{totalResultados}</span> resultados
          </div>
        )}

        {/* Filtro por categorías (pestañas) */}
        <CategoryTabs
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          setPaginaActual={setPaginaActual}
        />

        {/* Tabla de contenidos */}
        <ContentTable
          contenidos={contenidos}
          contenidosFiltrados={contenidosFiltrados}
          filtrosAplicados={filtrosAplicados}
          filtroCategoria={filtroCategoria}
          paginaActual={paginaActual}
          elementosPorPagina={elementosPorPagina}
          handleEditar={handleEditar}
          mostrarConfirmacion={mostrarConfirmacion}
          isLoading={isLoading}
        />

        {/* Paginación */}
        <PaginationControls 
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
          contenidos={contenidos}
          contenidosFiltrados={contenidosFiltrados}
          filtrosAplicados={filtrosAplicados}
          filtroCategoria={filtroCategoria}
          elementosPorPagina={elementosPorPagina}
        />

        {/* Mostrar errores */}
        {error && <div className="cont_error">{error}</div>}
      </div>

      {/* Formulario para agregar/editar contenido (condicional) */}
      {mostrarFormulario && (
        <div className="cont_form-overlay" ref={formRef}>
          <div className="cont_form-container">
            <ContentForm
              formData={formData}
              setFormData={setFormData}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              setMostrarFormulario={setMostrarFormulario}
              modoEdicion={modoEdicion}
              dropdownRef={dropdownRef}
              sesionesRef={sesionesRef}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              showSesiones={showSesiones}
              setShowSesiones={setShowSesiones}
              categorias={categorias}
              setCategorias={setCategorias}
              sesionesOptions={sesionesOptions}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <NewConfirmModal
        modalConfirmacion={modalConfirmacion}
        cancelarEliminacion={cancelarEliminacion}
        confirmarEliminacion={confirmarEliminacion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AgregarContenido;
