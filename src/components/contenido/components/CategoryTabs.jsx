import React from 'react';
import './CategoryTabs.css';

const CategoryTabs = ({ filtroCategoria, setFiltroCategoria, setPaginaActual }) => {
  return (
    <div className="cont_tabs-contenido">
      <button
        className={`cont_tab-btn ${filtroCategoria === 'Todos' ? 'cont_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          setFiltroCategoria('Todos');
        }}
      >
        Todos
      </button>
      <button
        className={`cont_tab-btn ${filtroCategoria === 1 ? 'cont_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          setFiltroCategoria(1);
        }}
      >
        Pizzas
      </button>
      <button
        className={`cont_tab-btn ${filtroCategoria === 3 ? 'cont_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          setFiltroCategoria(3);
        }}
      >
        Complementos
      </button>
      <button
        className={`cont_tab-btn ${filtroCategoria === 5 ? 'cont_activo' : ''}`}
        onClick={() => {
          setPaginaActual(1);
          setFiltroCategoria(5);
        }}
      >
        Bebidas
      </button>
    </div>
  );
};

export default CategoryTabs;