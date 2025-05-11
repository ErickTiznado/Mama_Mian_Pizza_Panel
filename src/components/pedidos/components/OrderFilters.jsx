import React from 'react';
import '../OrderManager.css';

const OrderFilters = ({ activeFilter, handleFilterChange }) => {
  return (
    <div className="order__filters">
      <div className="filters">
        <button 
          className={activeFilter === "pendiente" ? "active" : ""}
          onClick={() => handleFilterChange("pendiente")}
        >
          Pendientes
        </button>
      </div>
      <div className="filters">
        <button 
          className={activeFilter === "en_proceso" ? "active" : ""}
          onClick={() => handleFilterChange("en_proceso")}
        >
          En Proceso
        </button>
      </div>
      <div className="filters">
        <button 
          className={activeFilter === "entregado" ? "active" : ""}
          onClick={() => handleFilterChange("entregado")}
        >
          Entregados
        </button>
      </div>
      <div className="filters">
        <button 
          className={activeFilter === "cancelado" ? "active" : ""}
          onClick={() => handleFilterChange("cancelado")}
        >
          Cancelados
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;