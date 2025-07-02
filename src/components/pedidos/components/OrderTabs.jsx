import React from 'react';
import './OrderTabs.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

const OrderTabs = ({ activeFilter, handleFilterChange, setPaginaActual, counts = {} }) => {
  const tabs = [
    {
      key: "todos",
      label: "Todos",
      icon: <span className="circle-icon" style={{ backgroundColor: "#6c757d" }}></span>
    },
    {
      key: "pendiente",
      label: "Pendiente",
      icon: <span className="circle-icon" style={{ backgroundColor: "#ffc107" }}></span>
    },
    {
      key: "en proceso",
      label: "En Proceso",
      icon: <span className="circle-icon" style={{ backgroundColor: "#0dcaf0" }}></span>
    },
    {
      key: "en camino",
      label: "En Camino",
      icon: <span className="circle-icon" style={{ backgroundColor: "#fd7e14" }}></span>
    },
    {
      key: "entregado",
      label: "Entregado",
      icon: (
        <span className="square-icon green-bg">
          <FaCheck />
        </span>
      )
    },
  {
  key: "cancelado",
  label: "Cancelado",
  icon: (
    <FaTimes className="cancel-icon" />
  )
}

  ];

  return (
    <div className="order_tabs-pedidos styled-tabs left-align">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`styled-tab ${activeFilter === tab.key ? 'active' : ''}`}
          onClick={() => {
            setPaginaActual(1);
            handleFilterChange(tab.key);
          }}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          <span className="tab-count">{counts[tab.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;
