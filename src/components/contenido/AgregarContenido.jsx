import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';
import './AgregarContenido.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faImage } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AgregarContenido = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    porciones: '',
    categoria: '',
    nuevaCategoria: '',
    sesion: '',
    imagen: null,
    activo: false,
  });

  const [categorias, setCategorias] = useState([
    'Pizzas',
    'Postres',
    'Bebidas',
  ]);

  const sesionesOptions = [
    'Las más populares',
    'Menú',
    'Sobre Nosotros',
    'Recomendación de la casa',
    'Banner',
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSesiones, setShowSesiones] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  
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
    const { titulo, descripcion, porciones, categoria, sesion } = formData;
    if (!titulo || !descripcion || !porciones || !categoria || !sesion) {
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
    
    // Validate the form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    
    // Create a new FormData object for submission
    const submitFormData = new FormData();
    
    // Append all form fields to the FormData
    submitFormData.append('titulo', formData.titulo);
    submitFormData.append('descripcion', formData.descripcion);
    submitFormData.append('porciones', formData.porciones);
    submitFormData.append('categoria', formData.categoria);
    submitFormData.append('sesion', formData.sesion);
    submitFormData.append('activo', formData.activo);
    
    // Append the image if it exists
    if (formData.imagen) {
      submitFormData.append('imagen', formData.imagen);
    }
    
    try {
      // Send the data to the backend
      const response = await axios.post('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/content/submit', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle successful response
      console.log('Respuesta del servidor:', response.data);
      setSubmitStatus({ 
        type: 'success', 
        message: 'Contenido guardado exitosamente!' 
      });
      
      // Reset form after successful submission
      setFormData({
        titulo: '',
        descripcion: '',
        porciones: '',
        categoria: '',
        nuevaCategoria: '',
        sesion: '',
        imagen: null,
        activo: false,
      });
      setPreviewUrl(null);
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al guardar el contenido' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="agregar-contenido-wrapper">
      <Navbar />
      <div className="contenido-layout">
        <Sidebar />
        <div className="contenido-principal">
          <form className="formulario-contenido" onSubmit={handleSubmit}>
            <h2>Añadir Nuevo Contenido</h2>
            <button className="boton-nuevo">+ Nuevo pedido</button>
            <p>Sube imágenes para las secciones de tu sitio web</p>

            {submitStatus.message && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <div className="form-grid">
              {/* Título */}
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                />
              </div>
              
              {/* Sesiones */}
              <div className="form-group">
                <label>Secciones</label>
                <div className="categoria-wrapper" ref={sesionesRef}>
                  <input
                    type="text"
                    readOnly
                    placeholder="Selecciona una sesión"
                    className="categoria-input"
                    value={formData.sesion}
                    onClick={() => setShowSesiones(!showSesiones)}
                  />
                  <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />

                  {showSesiones && (
                    <div className="categoria-dropdown">
                      {sesionesOptions.map((s, i) => (
                        <div
                          key={i}
                          className="categoria-item"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              sesion: s,
                            }));
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
          
              {/* Descripción */}
              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
              
              {/* Categoría */}
              <div className="form-group">
                <label>Categoría</label>
                <div className="categoria-wrapper" ref={dropdownRef}>
                  <input
                    type="text"
                    readOnly
                    placeholder="Selecciona una categoría"
                    className="categoria-input"
                    value={formData.categoria}
                    onClick={() => setShowDropdown(!showDropdown)}
                  />
                  <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />

                  {showDropdown && (
                    <div className="categoria-dropdown">
                      {categorias.map((cat, index) => (
                        <div
                          key={index}
                          className="categoria-item"
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

                      {/* Inline input + buttons */}
                      <div className="categoria-inline">
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
                          className="input-nueva-categoria"
                        />

                        <button
                          type="button"
                          className="btn-categoria-cancelar"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              nuevaCategoria: '',
                            }));
                            setShowDropdown(false);
                          }}
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          className="btn-categoria-guardar"
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
              
              {/* Porciones */}
              <div className="form-group">
                <label>Porciones</label>
                <input
                  type="text"
                  name="porciones"
                  value={formData.porciones}
                  onChange={handleChange}
                />
              </div>

              {/* Activo */}
              <div className="form-group toggle-activo">
                <div className="toggle-box">
                  <label className="toggle-label">Activo</label>
                  <span className="toggle-text">Mostrar este contenido en el sitio web</span>
                  <div
                    className={`custom-toggle ${formData.activo ? 'activo' : ''}`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, activo: !prev.activo }))
                    }
                  >
                    <div className="toggle-circle" />
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="form-group imagen-upload">
              <div className="upload-box">
                {previewUrl ? (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Vista previa" className="image-preview" />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData(prev => ({...prev, imagen: null}));
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faImage}
                      className="icono-upload"
                      onClick={() => document.getElementById('input-imagen').click()}
                    />
                    <div className="texto-upload">
                      Arrastra y suelta una imagen o haz clic para seleccionar
                    </div>
                    <button 
                      type="button" 
                      className="btn-subir"
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
              <small className="texto-ayuda">
                Sube una imagen para la sección de la pagina
              </small>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="cancelar"
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
                  });
                  setPreviewUrl(null);
                  setSubmitStatus({ type: '', message: '' });
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="guardar"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar contenido'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarContenido;
