import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';
import './AgregarContenido.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faImage, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const AgregarContenido = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contenidos, setContenidos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [filtroSesion, setFiltroSesion] = useState('Todos');

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

  const [categorias, setCategorias] = useState(['Pizzas', 'Postres', 'Bebidas']);
  const sesionesOptions = ['Recomendaciónes','Las más populares', 'Menú','Banner', 'Recomendación de la casa'];
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSesiones, setShowSesiones] = useState(false);
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContenidos((prev) => [...prev, formData]);
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
    setMostrarFormulario(false);
  };

  return (
    <div className="agregar-contenido-wrapper">
      <Navbar />
      <div className="contenido-layout">
        <Sidebar />
        <div className="contenido-principal">
          {!mostrarFormulario ? (
            <div className="vista-principal">
              <h2>Gestión de Contenido</h2>
              <button className="boton-nuevo" onClick={() => setMostrarFormulario(true)}>
                + Nuevo Contenido
              </button>

              <div className="tabs-contenido">
  {['Todos', ...sesionesOptions].map((sesion, i) => (
    <button
      key={i}
      className={`tab-btn ${filtroSesion === sesion ? 'activo' : ''}`}
      onClick={() => {
        setPaginaActual(1); // reset paginación
        setFiltroSesion(sesion);
      }}
    >
      {sesion}
    </button>
  ))}
</div>


              <table className="tabla-contenido">
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
  .filter((item) => filtroSesion === 'Todos' || item.sesion === filtroSesion)
  .slice((paginaActual - 1) * elementosPorPagina, paginaActual * elementosPorPagina)
  .map((item, index) => (

                      <tr key={index}>
                        <td>
                          {item.imagen ? (
                            <img src={URL.createObjectURL(item.imagen)} alt="preview" />
                          ) : (
                            <img
  src={item.imagen ? URL.createObjectURL(item.imagen) : 'https://via.placeholder.com/60'}
  alt="preview"
  style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
/>

                          )}
                        </td>
                        <td>{item.descripcion}</td>
                        <td>${item.porciones || '0.00'}</td>
                        <td>
  <span className={item.activo ? 'estado-activo' : 'estado-inactivo'}>
    {item.activo ? 'Activo' : 'Inactivo'}
  </span>
</td>

<td>
<div className="acciones-botones">
<button className="btn-eliminar">
    <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '6px' }} />
    Eliminar
  </button>
  <button className="btn-editar">
    <FontAwesomeIcon icon={faPen} style={{ marginRight: '6px' }} />
    Editar
  </button>
  </div>
  
</td>

                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="paginacion">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((prev) => prev - 1)}
                >
                  ⬅ Anterior
                </button>
                <span>Página {paginaActual}</span>
                <button
                  disabled={paginaActual * elementosPorPagina >= contenidos.length}
                  onClick={() => setPaginaActual((prev) => prev + 1)}
                >
                  Siguiente ➡
                </button>
              </div>
            </div>
          ) : (
            <form className="formulario-contenido" onSubmit={handleSubmit}>
              <h2>Añadir Nuevo Contenido</h2>
              
              <p>Sube imágenes para las secciones de tu sitio web</p>

              <div className="form-grid">
                <div className="form-group">
                  <label>Título</label>
                  <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Sesiones</label>
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

                <div className="form-group">
                  <label>Descripción</label>
                  <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                </div>

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
                              setFormData((prev) => ({ ...prev, nuevaCategoria: '' }));
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

                <div className="form-group">
                  <label>Porciones</label>
                  <input type="text" name="porciones" value={formData.porciones} onChange={handleChange} />
                </div>

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
                  <input
                    type="file"
                    id="input-imagen"
                    hidden
                    onChange={handleImageUpload}
                  />
                </div>
                <small className="texto-ayuda">
                  Sube una imagen para la sección de la pagina
                </small>
              </div>

              <div className="form-actions">
                <button type="button" className="cancelar" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
                <button type="submit" className="guardar">
                  Guardar contenido
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgregarContenido;

