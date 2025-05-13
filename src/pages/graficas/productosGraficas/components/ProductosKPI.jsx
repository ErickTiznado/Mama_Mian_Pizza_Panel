import React, { useState, useEffect } from 'react';
import { FaPizzaSlice, FaPercentage, FaClipboardCheck, FaExchangeAlt, FaStar } from 'react-icons/fa';
import './ProductosKPI.css';
import axios from 'axios';

// API Base URL
const API_BASE_URL = "https://server.tiznadodev.com/api/orders";

// Colores de la marca MamaMianPizza
const brandColors = {
  pizzas: '#991B1B',       // Rojo de marca
  bebidas: '#3D84B8',      // Azul corporativo
  complementos: '#FEB248'  // Amarillo de marca
};

const ProductosKPI = () => {
  const [kpiData, setKpiData] = useState({
    margenPromedio: 42.5, // Porcentaje de margen promedio de todos los productos
    productosActivos: 28, // Número de productos disponibles actualmente
    rotacionInventario: 3.2, // Rotación de inventario mensual
    productosMasRentables: ['Pizza de Camarón', 'Pizza de Curiles', 'Cheese Sticks'],
    calificacionPromedio: 4.7 // Calificación promedio de los productos (de 1 a 5)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta función podría obtener datos reales de la API
    const fetchKPIData = async () => {
      try {
        setLoading(true);
        
        // Simulamos obtención de datos (esto se puede reemplazar con llamadas reales a la API)
        // En un caso real, aquí haríamos llamadas a API para obtener los diferentes KPIs
        // const response = await axios.get(`${API_BASE_URL}/productos/kpi`);
        // setKpiData(response.data);
        
        // Simulamos éxito de carga después de 1 segundo
        setTimeout(() => {
          // Agregamos un poco de variación aleatoria para simular datos en vivo
          setKpiData({
            margenPromedio: (40 + Math.random() * 5).toFixed(1),
            productosActivos: Math.floor(25 + Math.random() * 8),
            rotacionInventario: (2.8 + Math.random() * 0.8).toFixed(1),
            productosMasRentables: ['Pizza de Camarón', 'Pizza de Curiles', 'Cheese Sticks'],
            calificacionPromedio: (4.5 + Math.random() * 0.5).toFixed(1)
          });
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError("Error al cargar KPIs de productos: " + err.message);
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  const renderKPIItem = (icon, title, value, suffix = '', className = '') => {
    return (
      <div className={`productos-kpi-item ${className}`}>
        <div className="productos-kpi-icon">{icon}</div>
        <div className="productos-kpi-info">
          <h4>{title}</h4>
          <div className="productos-kpi-value">
            {loading ? (
              <div className="kpi-loading">Cargando...</div>
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