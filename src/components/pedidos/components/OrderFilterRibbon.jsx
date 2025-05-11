import React from 'react';
import { FaSearch, FaCalendarWeek, FaUndoAlt, FaCheck } from 'react-icons/fa';
import '../OrderManager.css';

const OrderFilterRibbon = ({
  searchTerm,
  setSearchTerm,
  filtroSemana,
  setFiltroSemana,
  filtrosAplicados,
  setFiltrosAplicados,
  setPaginaActual,
  aplicarFiltros,
  resetearFiltros
}) => {
  // Función para manejar el cambio de filtro y reset de paginación
  const handleApplyFilters = () => {
    setPaginaActual(1); // Resetear a la primera página al aplicar filtros
    setFiltrosAplicados(true);
    aplicarFiltros();
  };

  // Función para resetear filtros y paginación
  const handleResetFilters = () => {
    resetearFiltros();
    setPaginaActual(1);
  };

  return (
    <div className="order__filter-ribbon">
      <div className="order__filter-group">
        <span className="order__filter-label">
          <FaCalendarWeek style={{ marginRight: '5px' }} />
          Filtrar por Semana
        </span>
        <select 
          className="order__filter-select" 
          value={filtroSemana} 
          onChange={(e) => setFiltroSemana(e.target.value)}
        >
          <option value="todas">Todas las semanas</option>
          <option value="actual">Semana actual</option>
          <option value="anterior">Semana anterior</option>
          <option value="ultimoMes">Último mes</option>
        </select>
      </div>

      <div className="order__search-box">
        <FaSearch className="order__search-icon" />
        <input 
          type="text" 
          className="order__search-input" 
          placeholder="Buscar por código, cliente o dirección..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="order__filter-actions">
        <button 
          type="button" 
          className="order__btn-reset"
          onClick={handleResetFilters}
        >
          <FaUndoAlt style={{ marginRight: '5px' }} />
          Resetear
        </button>
        <button 
          type="button" 
          className="order__btn-apply"
          onClick={handleApplyFilters}
        >
          <FaCheck style={{ marginRight: '5px' }} />
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default OrderFilterRibbon;