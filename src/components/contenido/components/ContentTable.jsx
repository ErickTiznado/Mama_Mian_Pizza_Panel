import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import './ContentTable.css';

const ContentTable = ({ 
  contenidos, 
  contenidosFiltrados, 
  filtrosAplicados, 
  filtroCategoria, 
  paginaActual, 
  elementosPorPagina, 
  handleEditar,
  mostrarConfirmacion,
  isLoading
}) => {
  // Determinar qué datos mostrar según los filtros aplicados
  const datosAMostrar = filtrosAplicados ? contenidosFiltrados : contenidos;
  
  // Filtrar por categoría y paginación
  const contenidosFiltradosPorCategoria = datosAMostrar
    .filter((item) => filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria)
    .slice((paginaActual - 1) * elementosPorPagina, paginaActual * elementosPorPagina);

  return (
    <table className="cont_tabla-contenido">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {contenidosFiltradosPorCategoria.length > 0 ? (
          contenidosFiltradosPorCategoria.map((item, index) => (
            <tr key={item.id_producto || index}>
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
              <td>{item.titulo || 'Sin título'}</td>
              <td className="cont_descripcion-celda">{item.descripcion}</td>
              <td>${item.precio || '0.00'}</td>
              <td>
                <span className={item.activo ? 'cont_estado-activo' : 'cont_estado-inactivo'}>
                  {item.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="cont_acciones-botones">
                  <button className="cont_btn-editar" onClick={() => handleEditar(item.id_producto)}>
                    <FontAwesomeIcon icon={faPen} style={{ marginRight: '6px' }} />
                    Editar
                  </button>
                  <button className="cont_btn-eliminar" onClick={() => mostrarConfirmacion(item.id_producto, item.titulo)}>
                    <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '6px' }} />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
              {isLoading ? "Cargando..." : "No hay productos para mostrar"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ContentTable;