import React, { useState } from 'react';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';
import './AgregarContenido.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket,faImage   } from '@fortawesome/free-solid-svg-icons';


const AgregarContenido = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    porciones: '',
    categoria: '',
    imagen: null,
    activo: false,
  });

  const [categorias, setCategorias] = useState([
    'Pizzas',
    'Postres',
    'Bebidas',
    'Agregar nuevo +',
  ]);

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
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  <option value="">Selecciona</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Porciones</label>
                <input
                  type="text"
                  name="porciones"
                  value={formData.porciones}
                  onChange={handleChange}
                />
              </div>
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
            <div className="form-group imagen-upload">
              <div className="upload-box">
              <FontAwesomeIcon
    icon={faImage}
    className="icono-upload"
    onClick={() => document.getElementById('input-imagen').click()}
  />
                
               <div className="texto-upload">Arrastra y suelta una imagen o haz clic para seleccionar</div>

               <button type="button" className="btn-subir">
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
            Subir Imagen
            </button> 
              </div>
              <small className="texto-ayuda">Sube una imagen para la sección de Promociones</small>
            </div>

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
