import { useState, useEffect } from "react";
import "./graficas.css";
import PedidosGraficas from "./pedidosGraficas/pedidosGraficas";
import ProductosGraficas from "./productosGraficas/productosGraficas";
import ClientesGraficas from "./clientesGraficas/clientesGraficas";
import DateFilterBar from "../../components/common/DateFilterBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Graficas() {
  const [activeTab, setActiveTab] = useState("pedidos");
  const [periodoPredefinido, setPeriodoPredefinido] = useState("ultimo-mes");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [fechasFiltradas, setFechasFiltradas] = useState({
    inicio: null,
    fin: null,
    periodo: "ultimo-mes"
  });
  const [showFilters, setShowFilters] = useState(true);

  // Función para aplicar los filtros de fecha
  const aplicarFiltros = () => {
    // Calcular fechas según el periodo seleccionado
    let inicio, fin;
    
    if (periodoPredefinido === "personalizado") {
      // Si es personalizado, usar las fechas seleccionadas
      if (fechaInicio && fechaFin) {
        inicio = new Date(fechaInicio);
        fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999); // Final del día
      } else {
        console.error("Fechas personalizadas no definidas");
        return;
      }
    } else {
      const hoy = new Date();
      fin = new Date(hoy);
      inicio = new Date(hoy);
      
      switch (periodoPredefinido) {
        case "hoy":
          inicio.setHours(0, 0, 0, 0); // Inicio del día actual
          break;
        case "ultima-semana":
          inicio.setDate(hoy.getDate() - 7);
          break;
        case "ultimo-mes":
          inicio.setMonth(hoy.getMonth() - 1);
          break;
        case "ultimo-anio":
          inicio.setFullYear(hoy.getFullYear() - 1);
          break;
        default:
          inicio.setMonth(hoy.getMonth() - 1); // Por defecto último mes
      }
    }
    
    // Actualizar el estado con las fechas filtradas
    setFechasFiltradas({
      inicio: inicio,
      fin: fin,
      periodo: periodoPredefinido
    });
    
    console.log("Filtros aplicados:", {
      periodo: periodoPredefinido,
      fechaInicio: inicio,
      fechaFin: fin
    });
  };

  // Función para resetear filtros
  const resetearFiltros = () => {
    setPeriodoPredefinido("ultimo-mes");
    setFechaInicio("");
    setFechaFin("");
    
    // Calculamos la fecha de inicio por defecto (último mes)
    const hoy = new Date();
    const fin = new Date(hoy);
    const inicio = new Date(hoy);
    inicio.setMonth(hoy.getMonth() - 1);
    
    // Actualizamos el estado con las fechas reset
    setFechasFiltradas({
      inicio: inicio,
      fin: fin,
      periodo: "ultimo-mes"
    });
  };

  // Al montar el componente, aplicamos los filtros por defecto
  useEffect(() => {
    aplicarFiltros();
  }, []);

  // Formatear el texto del período para mostrarlo en la UI
  const obtenerTextoPeriodo = () => {
    if (!fechasFiltradas) return "Último mes";
    
    switch (fechasFiltradas.periodo) {
      case 'hoy':
        return "Hoy";
      case 'ultima-semana':
        return "Última semana";
      case 'ultimo-mes':
        return "Último mes";
      case 'ultimo-anio':
        return "Último año";
      case 'personalizado':
        return `Desde ${formatoFecha(fechasFiltradas.inicio)} hasta ${formatoFecha(fechasFiltradas.fin)}`;
      default:
        return "Último mes";
    }
  };

  // Función auxiliar para formatear fechas
  const formatoFecha = (fecha) => {
    if (!fecha) return "";
    const f = new Date(fecha);
    return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
  };

  return (
    <div className="graficas-outer-container">
      <div className="graficas-panel">
        {/* Cabecera del panel */}
        <div className="graficas-header">
          <h1>Análisis y Estadísticas</h1>
          <button
            className="graficas-btn-refrescar"
            onClick={aplicarFiltros}
          >
            <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px' }} />
            Actualizar Datos
          </button>
        </div>

        {/* Contenido principal */}
        <div className="graficas-main">
          {/* Botón para ocultar/mostrar filtros */}
          <div className="toggle-filters-container">
            <button 
              className="toggle-filters-btn" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={showFilters ? faFilterCircleXmark : faFilter} style={{ marginRight: '8px' }} />
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

          {/* Filtros y componente de filtro de fechas */}
          {showFilters && (
            <DateFilterBar
              periodoPredefinido={periodoPredefinido}
              setPeriodoPredefinido={setPeriodoPredefinido}
              fechaInicio={fechaInicio}
              setFechaInicio={setFechaInicio}
              fechaFin={fechaFin}
              setFechaFin={setFechaFin}
              aplicarFiltros={aplicarFiltros}
              resetearFiltros={resetearFiltros}
            />
          )}
          
          {/* Contador de resultados */}
          {showFilters && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <div className="graficas-resultados-contador">
                Periodo: <span className="graficas-resaltado">{obtenerTextoPeriodo()}</span>
              </div>
            </div>
          )}

          {/* Filtro de categoría (tabs) */}
          <div className="graficas-tabs-container">
            <div>
              <button 
                className={`graficas-tab-btn ${activeTab === "pedidos" ? "active" : ""}`}
                onClick={() => setActiveTab("pedidos")}
              >
                Pedidos
              </button>
            </div>
            <div>
              <button 
                className={`graficas-tab-btn ${activeTab === "productos" ? "active" : ""}`}
                onClick={() => setActiveTab("productos")}
              >
                Productos
              </button>
            </div>
            <div>
              <button 
                className={`graficas-tab-btn ${activeTab === "clientes" ? "active" : ""}`}
                onClick={() => setActiveTab("clientes")}
              >
                Clientes
              </button>
            </div>
          </div>
          
          {/* Contenido de gráficas según la pestaña activa */}
          <div className="graficas-content-wrapper">
            <div className="graficas-content">
              {activeTab === "pedidos" && <PedidosGraficas fechasFiltradas={fechasFiltradas} />}
              {activeTab === "productos" && <ProductosGraficas fechasFiltradas={fechasFiltradas} />}
              {activeTab === "clientes" && <ClientesGraficas fechasFiltradas={fechasFiltradas} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Graficas;
