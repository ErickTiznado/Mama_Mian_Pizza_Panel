import React, { useState, useEffect } from 'react';
import { FaPizzaSlice, FaPercentage, FaClipboardCheck, FaExchangeAlt, FaStar } from 'react-icons/fa';
import './ProductosKPI.css';
import axios from 'axios';

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api";

// Colores de la marca MamaMianPizza
const brandColors = {
  pizzas: '#991B1B',       // Rojo de marca
  bebidas: '#3D84B8',      // Azul corporativo
  complementos: '#FEB248'  // Amarillo de marca
};

const ProductosKPI = ({ fechasFiltradas }) => {
  const [kpiData, setKpiData] = useState({
    margenPromedio: 42.5, 
    productosActivos: 0, // Inicializado a 0 para mostrar que no hay datos hasta que se carguen
    rotacionInventario: 3.2,
    productosMasRentables: ['Pizza de Camarón', 'Pizza de Curiles', 'Cheese Sticks'],
    calificacionPromedio: 4.7
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductosActivos = async () => {
      setLoading(true);
      try {
        console.log("Obteniendo total de productos desde:", `${API_BASE_URL}/content/totalProducts/totalProducts`);
        
        // Llamada a la API para obtener el total de productos
        const response = await axios.get(`${API_BASE_URL}/totalProducts`);
        console.log("Respuesta de la API totalProducts:", response.data);
        
        if (response.data && response.data.total !== undefined) {
          // Actualizar solo el conteo de productos activos
          setKpiData(prevState => ({
            ...prevState,
            productosActivos: response.data.total
          }));
          console.log("Total de productos activos actualizado:", response.data.total);
        } else {
          console.error("La API no devolvió un objeto con la propiedad 'total'", response.data);
          setError("Formato de respuesta inválido");
        }
      } catch (err) {
        console.error("Error al obtener productos activos:", err);
        setError("Error al cargar productos activos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductosActivos();
  }, [fechasFiltradas]);

  const renderKPIItem = (icon, title, value, suffix = '', className = '') => {
    return (
      <div className={`productos-kpi-item ${className}`}>
        <div className="productos-kpi-icon">{icon}</div>
        <div className="productos-kpi-info">
          <h4>{title}</h4>
          <div className="productos-kpi-value">
            {loading ? (
              <div className="kpi-loading">Cargando...</div>
            ) : error && title === "Productos Activos" ? (
              <div className="kpi-error">Error</div>
            ) : (
              <>
                <span>{value}</span>
                {suffix && <small>{suffix}</small>}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="productos-kpi-container">
      {renderKPIItem(
        <FaPercentage />,
        "Margen Promedio",
        kpiData.margenPromedio,
        '%',
        'margin-kpi'
      )}
      
      {renderKPIItem(
        <FaPizzaSlice />,
        "Productos Activos",
        kpiData.productosActivos,
        '',
        'active-products-kpi'
      )}
      
      {renderKPIItem(
        <FaExchangeAlt />,
        "Rotación de Inventario",
        kpiData.rotacionInventario,
        'x/mes',
        'inventory-turnover-kpi'
      )}
      
      {renderKPIItem(
        <FaStar />,
        "Calificación Promedio",
        kpiData.calificacionPromedio,
        '/5',
        'rating-kpi'
      )}
      
      <div className="productos-kpi-item rentable-products-kpi">
        <div className="productos-kpi-icon">
          <FaClipboardCheck />
        </div>
        <div className="productos-kpi-info">
          <h4>Productos Más Rentables</h4>
          {loading ? (
            <div className="kpi-loading">Cargando...</div>
          ) : (
            <ul className="rentable-products-list">
              {kpiData.productosMasRentables.map((producto, index) => (
                <li key={index}>{producto}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductosKPI;