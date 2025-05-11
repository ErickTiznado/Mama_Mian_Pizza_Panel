import React from 'react';
import './OrderTabs.css';

const OrderTabs = ({ activeFilter, handleFilterChange, setPaginaActual }) => {
  return (
    <div className="order_tabs-pedidos">
      <button
        className={`order_tab-btn ${activeFilter === "pendiente" ? 'order_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          handleFilterChange("pendiente");
        }}
      >
        Pendientes
      </button>
      <button
        className={`order_tab-btn ${activeFilter === "en_proceso" ? 'order_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          handleFilterChange("en_proceso");
        }}
      >
        En Proceso
      </button>
      <button
        className={`order_tab-btn ${activeFilter === "entregado" ? 'order_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          handleFilterChange("entregado");
        }}
      >
        Entregados
      </button>
      <button
        className={`order_tab-btn ${activeFilter === "cancelado" ? 'order_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          handleFilterChange("cancelado");
        }}
      >
        Cancelados
      </button>
    </div>
  );
};

export default OrderTabs;