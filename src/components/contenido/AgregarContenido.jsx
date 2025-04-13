import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';
import './AgregarContenido.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faImage, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const API_URL = 'http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io';

const AgregarContenido = () => {
  // Estados generales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contenidos, setContenidos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  
  // Estado para modo edición
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  
  // Estado para modal de confirmación de eliminación
  const [modalConfirmacion, setModalConfirmacion] = useState({
    visible: false,
    productoId: null,
    nombreProducto: ''
  });

  // Estado del formulario
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

  // Estado para categorías y opciones de sesión (únicos)
  const [categorias, setCategorias] = useState([
    'Pizzas',
    'Postres',
    'Bebidas',
    'Complementos'
  ]);
  const sesionesOptions = [
    'Las más populares',
    'Menú',
    'Sobre Nosotros',
    'Recomendación de la casa',
    'Banner',
    'Sin Seccion',
  ];

  // Otros estados y referencias
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSesiones, setShowSesiones] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dropdownRef = useRef(null);
  const sesionesRef = useRef(null);

  useEffect(() => {
    


    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (sesionesRef.current && !sesionesRef.current.contains(e.target)) {
        setShowSesiones(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    


  }, []);

  // Cargar contenidos desde el servidor
  const cargarContenidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/content/getMenu`);
      
      // Verificamos que la respuesta sea un array, si no lo es, usamos un array vacío
      const menuData = response.data;
      console.log('Datos recibidos del API:', menuData.productos);
      
      if (Array.isArray(menuData.productos)) {
        setContenidos(menuData.productos);
      } else if (menuData && typeof menuData === 'object') {
        // Si la respuesta es un objeto pero no un array, verificamos si tiene alguna propiedad que podría contener los datos
        // Comúnmente, las APIs devuelven estructuras como { data: [...] }, { menu: [...] }, { items: [...] }, etc.
        const possibleArrayProps = ['data', 'menu', 'items', 'results', 'contenidos'];
        
        for (const prop of possibleArrayProps) {
          if (Array.isArray(menuData[prop])) {
            console.log(`Encontrados datos en la propiedad ${prop}:`, menuData[prop]);
            setContenidos(menuData[prop]);
            return;
          }
        }
        
        // Si no encontramos un array en ninguna propiedad común, convertimos las propiedades del objeto en un array
        console.warn('La respuesta no es un array ni contiene arrays en propiedades comunes. Intentando convertir el objeto a array.');
        const objectToArray = Object.values(menuData).filter(item => typeof item === 'object' && item !== null);
        if (objectToArray.length > 0) {
          setContenidos(objectToArray);
        } else {
          console.error('No se pudo convertir la respuesta a un array válido.');
          setContenidos([]);
          setError('El formato de datos recibido no es válido. Por favor, contacta al administrador.');
        }
      } else {
        console.error('La respuesta no es un array ni un objeto:', menuData);
        setContenidos([]);
        setError('El formato de datos recibido no es válido. Por favor, contacta al administrador.');
      }
    } catch (err) {
      console.error('Error al cargar los contenidos:', err);
      setError('No se pudieron cargar los contenidos. Por favor, intenta de nuevo.');
      setContenidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar confirmación de eliminación
  const mostrarConfirmacion = (id, titulo) => {
    setModalConfirmacion({
      visible: true,
      productoId: id,
      nombreProducto: titulo || 'este producto'
    });
  };
  
  // Cancelar eliminación
  const cancelarEliminacion = () => {
    setModalConfirmacion({
      visible: false,
      productoId: null,
      nombreProducto: ''
    });
  };
  
  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!modalConfirmacion.productoId) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.delete(`${API_URL}/api/content/deleteContent/${modalConfirmacion.productoId}`);
      
      if (response.status === 200) {
        // Actualizar el estado eliminando el producto
        setContenidos(prevContenidos => 
          prevContenidos.filter(item => item.id_producto !== modalConfirmacion.productoId)
        );
        
        setSubmitStatus({
          type: 'success',
          message: 'Producto eliminado exitosamente'
        });
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error al eliminar el producto'
      });
    } finally {
      setModalConfirmacion({
        visible: false,
        productoId: null,
        nombreProducto: ''
      });
      setIsSubmitting(false);
    }
  };

  // Manejar la edición de un producto
  const handleEditar = (id) => {
    const producto = contenidos.find(item => item.id_producto === id);
    
    if (!producto) {
      setError('No se pudo encontrar el producto para editar');
      return;
    }
    
    // Cargar los datos en el formulario
    setFormData({
      titulo: producto.titulo || '',
      descripcion: producto.descripcion || '',
      porciones: producto.porciones || '',
      categoria: producto.categoria || '',
      nuevaCategoria: '',
      sesion: producto.seccion || '',
      imagen: null,  // No podemos cargar el archivo, solo la URL
      activo: producto.activo || false,
      precio: producto.precio?.toString() || '',
    });
    
    // Si hay una imagen, establecer la URL de vista previa
    if (producto.imagen) {
      setPreviewUrl(producto.imagen);
    } else {
      setPreviewUrl(null);
    }
    
    setProductoEditando(id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  // Efecto para cargar los contenidos al montar el componente
  useEffect(() => {
    cargarContenidos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const { titulo, descripcion, porciones, categoria, sesion, precio } = formData;
    if (!titulo || !descripcion || !porciones || !categoria || !sesion || !precio) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Por favor completa todos los campos obligatorios' 
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Iniciando envío del formulario");
    console.log("Modo edición:", modoEdicion);
    console.log("ID producto editando:", productoEditando);

    // Valida el formulario antes de continuar
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Prepara un objeto FormData para enviar al backend
    const submitFormData = new FormData();
    submitFormData.append('titulo', formData.titulo);
    submitFormData.append('descripcion', formData.descripcion);
    submitFormData.append('porciones', formData.porciones);
    submitFormData.append('categoria', formData.categoria);
    submitFormData.append('sesion', formData.sesion);
    submitFormData.append('activo', formData.activo.toString()); // Convertir a string para asegurar compatibilidad
    submitFormData.append('precio', formData.precio);

    if (formData.imagen) {
      submitFormData.append('imagen', formData.imagen);
    }
    
    try {
      let response;
      
      // Determina si estamos editando o creando
      if (modoEdicion && productoEditando) {
        console.log(`Enviando solicitud PUT a ${API_URL}/api/content/updateContent/${productoEditando}`);
        console.log("Datos que se envían:", Object.fromEntries(submitFormData));
        
        // Llamada para actualizar
        response = await axios.put(
          `${API_URL}/api/content/updateContent/${productoEditando}`, 
          submitFormData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        console.log('Respuesta de actualización:', response);
        
        // Actualiza el producto en la lista local
        setContenidos(prevContenidos => 
          prevContenidos.map(item => 
            item.id_producto === productoEditando 
              ? { 
                  ...item, 
                  titulo: formData.titulo,
                  descripcion: formData.descripcion,
                  porciones: formData.porciones,
                  categoria: formData.categoria, 
                  seccion: formData.sesion,
                  activo: formData.activo,
                  precio: formData.precio,
                  imagen: response.data?.imagen || item.imagen
                }
              : item
          )
        );

        setSubmitStatus({ 
          type: 'success', 
          message: 'Producto actualizado exitosamente!' 
        });
      } else {
        // Llamada para crear nuevo
        response = await axios.post(
          `${API_URL}/api/content/submit`, 
          submitFormData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Actualiza el estado local agregando el nuevo contenido
        const nuevoProducto = {
          id_producto: response.data.id_producto,
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          porciones: formData.porciones,
          categoria: formData.categoria,
          seccion: formData.sesion,
          activo: formData.activo,
          precio: formData.precio,
          imagen: response.data.imagen || null
        };
        
        setContenidos(prev => [...prev, nuevoProducto]);
        
        setSubmitStatus({ 
          type: 'success', 
          message: 'Contenido guardado exitosamente!' 
        });
      }
      
      console.log('Respuesta del servidor:', response.data);

      // Reinicia el formulario y cierra la vista de alta
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
      setMostrarFormulario(false);
      setModoEdicion(false);
      setProductoEditando(null);
      
      // Recargar contenidos para asegurar consistencia
      setTimeout(() => {
        cargarContenidos();
      }, 500);
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      // Mostrar más información sobre el error
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
        console.log(formData)
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
      }
      
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al guardar el contenido' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cont_agregar-contenido-wrapper">
      <Navbar />
      <div className="cont_contenido-layout">
        <Sidebar />
        <div className="cont_contenido-principal">
          {/* Vista Listado: se muestra cuando no se está agregando contenido nuevo */}
          {!mostrarFormulario ? (
            <div className="cont_vista-principal">
              <h2>Gestión de Contenido</h2>
              <button className="cont_boton-nuevo" onClick={() => setMostrarFormulario(true)}>
                + Nuevo Contenido
              </button>

              {/* Botones para filtrar por categoría */}
              <div className="cont_tabs-contenido">
                <button
                  className={`cont_tab-btn ${filtroCategoria === 'Todos' ? 'cont_activo' : ''}`}
                  onClick={() => {
                    setPaginaActual(1);
                    setFiltroCategoria('Todos');
                  }}
                >
                  Todos
                </button>
                <button
                  className={`cont_tab-btn ${filtroCategoria === 1 ? 'cont_activo' : ''}`}
                  onClick={() => {
                    setPaginaActual(1);
                    setFiltroCategoria(1);
                  }}
                >
                  Pizzas
                </button>
                <button
                  className={`cont_tab-btn ${filtroCategoria === 3 ? 'cont_activo' : ''}`}
                  onClick={() => {
                    setPaginaActual(1);
                    setFiltroCategoria(3);
                  }}
                >
                  Complementos
                </button>
                <button
                  className={`cont_tab-btn ${filtroCategoria === 5 ? 'cont_activo' : ''}`}
                  onClick={() => {
                    setPaginaActual(1);
                    setFiltroCategoria(5);
                  }}
                >
                  Bebidas
                </button>
              </div>

              <table className="cont_tabla-contenido">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contenidos
                    .filter((item) => {
                      // Solo filtro por categoría basado en id_categoria
                      return filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria;
                    })
                    .slice((paginaActual - 1) * elementosPorPagina, paginaActual * elementosPorPagina)
                    .map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="cont_imagen-container">
                            {item.imagen ? (
                              <img
                                src={item.imagen}
                                alt={item.titulo || 'producto'}
                                className="cont_imagen-producto"
                              />
                            ) : (
                              <img
                                src="https://via.placeholder.com/60"
                                alt="placeholder"
                                className="cont_imagen-producto"
                              />
                            )}
                          </div>
                        </td>
                        <td className="cont_descripcion-celda">{item.descripcion}</td>
                        <td>${item.precio || '0.00'}</td>
                        <td>
                          <span className={item.activo ? 'cont_estado-activo' : 'cont_estado-inactivo'}>
                            {item.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="cont_acciones-botones">
                            <button className="cont_btn-eliminar" onClick={() => mostrarConfirmacion(item.id_producto, item.titulo)}>
                              <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '6px' }} />
                              Eliminar
                            </button>
                            <button className="cont_btn-editar" onClick={() => handleEditar(item.id_producto)}>
                              <FontAwesomeIcon icon={faPen} style={{ marginRight: '6px' }} />
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="cont_paginacion">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((prev) => prev - 1)}
                >
                  ⬅ Anterior
                </button>
                <span>
                  Página {paginaActual} de {
                    Math.ceil(
                      contenidos.filter(item => {
                        // Aplicamos los mismos filtros que en la tabla
                        const categoriaMatch = filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria;
                        return categoriaMatch;
                      }).length / elementosPorPagina
                    ) || 1
                  }
                </span>
                <button
                  disabled={
                    paginaActual * elementosPorPagina >= contenidos.filter(item => {
                      // Aplicamos los mismos filtros que en la tabla
                      const categoriaMatch = filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria;
                      return categoriaMatch;
                    }).length
                  }
                  onClick={() => setPaginaActual((prev) => prev + 1)}
                >
                  Siguiente ➡
                </button>
              </div>
            </div>
          ) : (
            // Vista Formulario: se muestra para agregar o editar contenido
            <form className="cont_formulario-contenido" onSubmit={handleSubmit}>
              <h2>{modoEdicion ? 'Editar Contenido' : 'Añadir Nuevo Contenido'}</h2>
              <p>{modoEdicion ? 'Modifica los detalles del producto seleccionado' : 'Sube imágenes para las secciones de tu sitio web'}</p>

              {submitStatus.message && (
                <div className={`cont_status-message ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="cont_form-grid">
                {/* Campo Título */}
                <div className="cont_form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                  />
                </div>

                {/* Campo Secciones */}
                <div className="cont_form-group">
                  <label>Secciones</label>
                  <div className="cont_categoria-wrapper" ref={sesionesRef}>
                    <input
                      type="text"
                      readOnly
                      placeholder="Selecciona una sesión"
                      className="cont_categoria-input"
                      value={formData.sesion}
                      onClick={() => setShowSesiones(!showSesiones)}
                    />
                    <FontAwesomeIcon icon={faChevronDown} className="cont_dropdown-icon" />
                    {showSesiones && (
                      <div className="cont_categoria-dropdown">
                        {sesionesOptions.map((s, i) => (
                          <div
                            key={i}
                            className="cont_categoria-item"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, sesion: s }));
                              setShowSesiones(false);
                            }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Campo Descripción */}
                <div className="cont_form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>

                {/* Campo Precio */}
                <div className="cont_form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Campo Categoría */}
                <div className="cont_form-group">
                  <label>Categoría</label>
                  <div className="cont_categoria-wrapper" ref={dropdownRef}>
                    <input
                      type="text"
                      readOnly
                      placeholder="Selecciona una categoría"
                      className="cont_categoria-input"
                      value={formData.categoria}
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    <FontAwesomeIcon icon={faChevronDown} className="cont_dropdown-icon" />
                    {showDropdown && (
                      <div className="cont_categoria-dropdown">
                        {categorias.map((cat, index) => (
                          <div
                            key={index}
                            className="cont_categoria-item"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                categoria: cat,
                                nuevaCategoria: '',
                              }));
                              setShowDropdown(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                        <div className="cont_categoria-inline">
                          <input
                            type="text"
                            placeholder="Agregar nueva categoría"
                            value={formData.nuevaCategoria}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                nuevaCategoria: e.target.value,
                              }))
                            }
                            className="cont_input-nueva-categoria"
                          />
                          <button
                            type="button"
                            className="cont_btn-categoria-cancelar"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, nuevaCategoria: '' }));
                              setShowDropdown(false);
                            }}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            className="cont_btn-categoria-guardar"
                            onClick={() => {
                              const nueva = formData.nuevaCategoria.trim();
                              if (nueva && !categorias.includes(nueva)) {
                                setCategorias((prev) => [...prev, nueva]);
                                setFormData((prev) => ({
                                  ...prev,
                                  categoria: nueva,
                                  nuevaCategoria: '',
                                }));
                                setShowDropdown(false);
                              }
                            }}
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Campo Porciones */}
                <div className="cont_form-group">
                  <label>Porciones</label>
                  <input
                    type="text"
                    name="porciones"
                    value={formData.porciones}
                    onChange={handleChange}
                  />
                </div>

                {/* Toggle Activo */}
                <div className="cont_form-group cont_toggle-activo">
                  <div className="cont_toggle-box">
                    <label className="cont_toggle-label">Activo</label>
                    <span className="cont_toggle-text">Mostrar este contenido en el sitio web</span>
                    <div
                      className={`cont_custom-toggle ${formData.activo ? 'cont_activo' : ''}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, activo: !prev.activo }))
                      }
                    >
                      <div className="cont_toggle-circle" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de subida de imagen */}
              <div className="cont_form-group imagen-upload">
                <div className="cont_upload-box">
                  {previewUrl ? (
                    <div className="cont_preview-container">
                      <img src={previewUrl} alt="Vista previa" className="cont_image-preview" />
                      <button 
                        type="button" 
                        className="cont_remove-image" 
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData((prev) => ({ ...prev, imagen: null }));
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faImage}
                        className="cont_icono-upload"
                        onClick={() => document.getElementById('input-imagen').click()}
                      />
                      <div className="cont_texto-upload">
                        Arrastra y suelta una imagen o haz clic para seleccionar
                      </div>
                      <button 
                        type="button" 
                        className="cont_btn-subir"
                        onClick={() => document.getElementById('input-imagen').click()}
                      >
                        <FontAwesomeIcon icon={faArrowUpFromBracket} />
                        Subir Imagen
                      </button>
                    </>
                  )}
                </div>
                <input
                  id="input-imagen"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <small className="cont_texto-ayuda">
                  Sube una imagen para la sección de la pagina
                </small>
              </div>

              {/* Botones de acción */}
              <div className="cont_form-actions">
                <button
                  type="button"
                  className="cont_cancelar"
                  onClick={() => {
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
                    setSubmitStatus({ type: '', message: '' });
                    setMostrarFormulario(false);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="cont_guardar" disabled={isSubmitting}>
                  {isSubmitting 
                    ? 'Guardando...' 
                    : modoEdicion 
                      ? 'Actualizar producto' 
                      : 'Guardar contenido'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Modal de confirmación de eliminación */}
      {modalConfirmacion.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faTrashAlt} /> Confirmar eliminación
              </h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el siguiente producto del menú?</p>
              <div className="modal-producto">{modalConfirmacion.nombreProducto}</div>
              <p><strong>Atención:</strong> Esta acción no se puede deshacer y eliminará permanentemente este producto.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancelar-modal" 
                onClick={cancelarEliminacion}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar-eliminar" 
                onClick={confirmarEliminacion}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarContenido;
