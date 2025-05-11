import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faChevronDown,
  faRotateLeft,
  faCheck,
  faCalendarWeek
} from '@fortawesome/free-solid-svg-icons';
import './FilterRibbon.css';

const FilterRibbon = ({ 
  searchTerm, 
  setSearchTerm, 
  filtroSemana, 
  setFiltroSemana, 
  filtrosAplicados,
  setFiltrosAplicados, 
  setPaginaActual,
  aplicarFiltros 
}) => {
  // Función para resetear filtros
  const handleReset = () => {
    setSearchTerm('');
    setFiltroSemana('todas');
    setFiltrosAplicados(false);
    setPaginaActual(1);
  };

  // Función para aplicar filtros
  const handleApply = () => {
    setFiltrosAplicados(true);
    setPaginaActual(1);
    aplicarFiltros();
  };

  return (
    <div className="cont_filter-ribbon">
      <div className="cont_filter-group">
        <span className="cont_filter-label">
          <FontAwesomeIcon icon={faCalendarWeek} style={{ marginRight: '5px' }} />
          Filtrar por Semana
        </span>
        <div style={{ position: 'relative' }}>
          <select 
            className="cont_filter-select" 
            value={filtroSemana} 
            onChange={(e) => setFiltroSemana(e.target.value)}
          >
            <option value="todas">Todas las semanas</option>
            <option value="actual">Semana actual</option>
            <option value="anterior">Semana anterior</option>
            <option value="ultimoMes">Último mes</option>
          </select>
          <FontAwesomeIcon icon={faChevronDown} className="cont_filter-select-icon" />
        </div>
      </div>

      <div className="cont_search-box">
        <FontAwesomeIcon icon={faSearch} className="cont_search-icon" />
        <input 
          type="text" 
          className="cont_search-input" 
          placeholder="Buscar por nombre o descripción..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cont_filter-actions">
        <button 
          type="button" 
          className="cont_btn-reset"
          onClick={handleReset}
        >
          <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: '5px' }} />
          Resetear
        </button>
        <button 
          type="button" 
          className="cont_btn-apply"
          onClick={handleApply}
        >
          <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterRibbon;