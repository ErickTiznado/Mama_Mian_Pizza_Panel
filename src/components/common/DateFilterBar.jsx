import React, { useState } from 'react';
import './DateFilterBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFilter, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const DateFilterBar = ({ 
  periodoPredefinido, 
  setPeriodoPredefinido, 
  fechaInicio, 
  setFechaInicio, 
  fechaFin, 
  setFechaFin, 
  aplicarFiltros,
  resetearFiltros,
  customClassName = ""
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Manejador para cambios en periodo predefinido
  const handlePeriodoChange = (e) => {
    setPeriodoPredefinido(e.target.value);
    // Si se selecciona un periodo predefinido, limpiamos las fechas personalizadas
    if (e.target.value !== 'personalizado') {
      setFechaInicio('');
      setFechaFin('');
    }
  };

  // Manejador para mostrar/ocultar filtros avanzados
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
    if (!showAdvancedFilters) {
      setPeriodoPredefinido('personalizado');
    }
  };

  // Función para aplicar los filtros
  const handleAplicarFiltros = () => {
    aplicarFiltros();
  };

  // Función para resetear los filtros
  const handleResetearFiltros = () => {
    resetearFiltros();
    setShowAdvancedFilters(false);
  };

  return (
    <div className={`date-filter-bar ${customClassName}`}>
      <div className="date-filter-header">
        <div className="date-filter-basic">
          <div className="date-filter-select-container">
            <FontAwesomeIcon icon={faCalendarAlt} className="date-filter-icon" />
            <select 
              className="date-filter-select"
              value={periodoPredefinido}
              onChange={handlePeriodoChange}
              aria-label="Seleccionar periodo"
            >
              <option value="hoy">Hoy</option>
              <option value="ultima-semana">Última semana</option>
              <option value="ultimo-mes">Último mes</option>
              <option value="ultimo-anio">Último año</option>
              <option value="personalizado">Periodo personalizado</option>
            </select>
          </div>
          
          <button 
            className={`date-filter-advanced-toggle ${showAdvancedFilters ? 'active' : ''}`}
            onClick={toggleAdvancedFilters}
            aria-label="Mostrar filtros avanzados"
          >
            <FontAwesomeIcon icon={faFilter} /> 
            {showAdvancedFilters ? "Ocultar filtros avanzados" : "Filtros avanzados"}
          </button>
        </div>
      </div>

      {/* Filtros avanzados (rango de fechas personalizado) */}
      {showAdvancedFilters && (
        <div className="date-filter-advanced">
          <div className="date-filter-range">
            <div className="date-filter-field">
              <label htmlFor="fecha-inicio">Fecha inicio:</label>
              <input 
                type="date" 
                id="fecha-inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="date-filter-date-input"
              />
            </div>
            <div className="date-filter-field">
              <label htmlFor="fecha-fin">Fecha fin:</label>
              <input 
                type="date" 
                id="fecha-fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="date-filter-date-input"
              />
            </div>
          </div>
          
          <div className="date-filter-actions">
            <button 
              className="date-filter-apply"
              onClick={handleAplicarFiltros}
              disabled={periodoPredefinido === 'personalizado' && (!fechaInicio || !fechaFin)}
            >
              <FontAwesomeIcon icon={faSearch} /> Aplicar filtros
            </button>
            <button 
              className="date-filter-reset"
              onClick={handleResetearFiltros}
            >
              <FontAwesomeIcon icon={faTimes} /> Resetear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilterBar;