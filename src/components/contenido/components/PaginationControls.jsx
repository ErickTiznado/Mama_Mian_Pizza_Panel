import React from 'react';
import './PaginationControls.css';

const PaginationControls = ({ 
  paginaActual, 
  setPaginaActual, 
  contenidos, 
  contenidosFiltrados, 
  filtrosAplicados, 
  filtroCategoria, 
  elementosPorPagina 
}) => {
  // Determinar qué datos usar para la paginación según los filtros aplicados
  const datosAMostrar = filtrosAplicados ? contenidosFiltrados : contenidos;
  
  // Calcular el total de elementos filtrados
  const totalElementos = datosAMostrar.filter(item => {
    const categoriaMatch = filtroCategoria === 'Todos' || parseInt(item.id_categoria) === filtroCategoria;
    return categoriaMatch;
  }).length;
  
  // Calcular el número total de páginas
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina) || 1;
  
  // Verificar si hay siguiente o anterior
  const hayAnterior = paginaActual > 1;
  const haySiguiente = paginaActual < totalPaginas;

  return (
    <div className="cont_paginacion">
      <button
        disabled={!hayAnterior}
        onClick={() => setPaginaActual((prev) => prev - 1)}
        className="cont_btn-paginacion"
      >
        ⬅ Anterior
      </button>
      <span className="cont_info-pagina">
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        disabled={!haySiguiente}
        onClick={() => setPaginaActual((prev) => prev + 1)}
        className="cont_btn-paginacion"
      >
        Siguiente ➡
      </button>
    </div>
  );
};

export default PaginationControls;