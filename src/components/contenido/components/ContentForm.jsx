import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowUpFromBracket, 
  faImage, 
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import './ContentForm.css';

const ContentForm = ({
  formData,
  setFormData,
  previewUrl,
  setPreviewUrl,
  handleSubmit,
  isSubmitting,
  submitStatus,
  setMostrarFormulario,
  modoEdicion,
  dropdownRef,
  sesionesRef,
  showDropdown,
  setShowDropdown,
  showSesiones,
  setShowSesiones,
  categorias,
  setCategorias,
  sesionesOptions
}) => {
  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para manejar la carga de imágenes
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

  // Función para cancelar y cerrar el formulario
  const handleCancel = () => {
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
  };

  return (
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
          onClick={handleCancel}
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
  );
};

export default ContentForm;