import React from 'react';
import { FaSearch, FaCalendarWeek, FaUndoAlt, FaCheck, FaChevronDown } from 'react-icons/fa';
import './FilterBar.css';

/**
 * Componente reutilizable de barra de filtros
 * @param {Object} props - Propiedades del componente
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {function} props.setSearchTerm - Función para actualizar el término de búsqueda
 * @param {string} props.searchPlaceholder - Texto de placeholder para la búsqueda
 * @param {string} props.filtroSemana - Filtro de semana actual
 * @param {function} props.setFiltroSemana - Función para actualizar el filtro de semana
 * @param {boolean} props.filtrosAplicados - Indica si los filtros están aplicados
 * @param {function} props.setFiltrosAplicados - Función para actualizar el estado de filtros aplicados
 * @param {function} props.setPaginaActual - Función para actualizar la página actual
 * @param {function} props.aplicarFiltros - Función para aplicar los filtros
 * @param {function} props.resetearFiltros - Función para resetear los filtros
 * @param {boolean} props.showWeekFilter - Indica si mostrar el filtro de semanas
 * @param {string} props.customClassName - Clase personalizada para el componente
 */
const FilterBar = ({
  searchTerm = '',
  setSearchTerm,
  searchPlaceholder = 'Buscar...',
  filtroSemana = 'todas',
  setFiltroSemana,
  filtrosAplicados = false,
  setFiltrosAplicados,
  setPaginaActual,
  aplicarFiltros,
  resetearFiltros,
  showWeekFilter = true,
  customClassName = ''
}) => {
  // Función para aplicar filtros
  const handleApplyFilters = () => {
    setPaginaActual && setPaginaActual(1);
    setFiltrosAplicados(true);
    aplicarFiltros();
  };

  // Función para resetear filtros
  const handleResetFilters = () => {
    if (resetearFiltros) {
      resetearFiltros();
    } else {
      setSearchTerm('');
      if (setFiltroSemana) {
        setFiltroSemana('todas');
      }
      setFiltrosAplicados(false);
      setPaginaActual && setPaginaActual(1);
    }
  };

  return (
    <div className={`filter-bar ${customClassName}`}>
      {showWeekFilter && setFiltroSemana && (
        <div className="filter-group">
          <span className="filter-label">
            <FaCalendarWeek className="filter-icon" />
            Filtrar por Semana
          </span>
          <div className="filter-select-container">
            <select
              className="filter-select"
              value={filtroSemana}
              onChange={(e) => setFiltroSemana(e.target.value)}
            >
              <option value="todas">Todas las semanas</option>
              <option value="actual">Semana actual</option>
              <option value="anterior">Semana anterior</option>
              <option value="ultimoMes">Último mes</option>
            </select>
            <FaChevronDown className="filter-select-icon" />
          </div>
        </div>
      )}

      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button
          type="button"
          className="btn-reset"
          onClick={handleResetFilters}
        >
          <FaUndoAlt className="btn-icon" />
          Resetear
        </button>
        <button
          type="button"
          className="btn-apply"
          onClick={handleApplyFilters}
        >
          <FaCheck className="btn-icon" />
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterBar;