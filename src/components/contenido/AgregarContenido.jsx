import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';
import './AgregarContenido.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faImage } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


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
  const dropdownRef = useRef(null);
  const sesionesRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
      if (
        sesionesRef.current && !sesionesRef.current.contains(e.target)
      ) {
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
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
                <FontAwesomeIcon
                  icon={faImage}
                  className="icono-upload"
                  onClick={() => document.getElementById('input-imagen').click()}
                />
                <div className="texto-upload">
                  Arrastra y suelta una imagen o haz clic para seleccionar
                </div>
                <button type="button" className="btn-subir">
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />
                  Subir Imagen
                </button>
              </div>
              <small className="texto-ayuda">
                Sube una imagen para la sección de la pagina
              </small>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button type="button" className="cancelar">
                Cancelar
              </button>
              <button type="submit" className="guardar">
                Guardar contenido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarContenido;
