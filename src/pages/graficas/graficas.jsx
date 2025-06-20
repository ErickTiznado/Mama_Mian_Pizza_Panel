import { useState, useEffect } from "react";
import "./graficas.css";
import PedidosGraficas from "./pedidosGraficas/pedidosGraficas";
import ProductosGraficas from "./productosGraficas/productosGraficas";
import { Download, Funnel, ChevronDown } from "lucide-react";
import ClientesGraficas from "./clientesGraficas/clientesGraficas";
function Graficas() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pedidos"); // Agregar estado para la pestaña activa
  // Agregar estados para los filtros
  const [timePeriod, setTimePeriod] = useState("today");  // today, week, month
  const [orderType, setOrderType] = useState("all");      // all, ecommerce, local

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  // Manejadores para los cambios de filtro
  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };
  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  // Manejador para cambio de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="dashboard__container">
      <div className="dash__action-bar__container">
        <div className="dash__action-bar gap--4">
          <div className="dash__act__col-3">            <div className="dash__act__flex-container">
              <div className="dash__act__btn-container">
                <button 
                  className={`dash__act__btn ${activeTab === 'pedidos' ? 'active' : ''}`}
                  onClick={() => handleTabChange('pedidos')}
                >
                  Pedidos
                </button>
                <button 
                  className={`dash__act__btn ${activeTab === 'productos' ? 'active' : ''}`}
                  onClick={() => handleTabChange('productos')}
                >
                  Productos
                </button>
                <button 
                  className={`dash__act__btn ${activeTab === 'clientes' ? 'active' : ''}`}
                  onClick={() => handleTabChange('clientes')}
                >
                  Clientes
                </button>
              </div>
            </div>
          </div>
          <div className="dash__act__col-6">
            <div className=" gap--4 dash__act__flex-container dash__act__flex-container__center">
              <select 
                value={timePeriod} 
                onChange={handleTimePeriodChange} 
                className="dash__act__select"
              >
                <option value="today">Hoy</option>
                <option value="week">Semanal</option>
                <option value="month">Mes</option>
              </select>
              <select 
                value={orderType} 
                onChange={handleOrderTypeChange} 
                className="dash__act__select"
              >
                <option value="all">Todos los Pedidos</option>
                <option value="ecommerce">Eccomerce</option>
                <option value="local">En local</option>
              </select>
              <div className="dash__act__advFilter gap--3">
                <Funnel className="" size={16} />
                <span>Filtros Avanzados</span>
              </div>
            </div>
          </div>
          <div className="dash__act__col-3">
            <div className="gap--3 dash__act__flex-container dash__act__flex-container__end">
              <button onClick={handleToggle} className="gap--3 dash__act__btn__export">
                <Download size={20}/>
                <span>Exportar</span>
                <ChevronDown size={20} />
              </button>
              {isOpen && (
                <div className="dash__act__export__options__container">
                  <div className="dash__act__export__options">
                  <button className="dash__act__export__option">Exportar como Excel</button>
                  <button className="dash__act__export__option">Exportar como PDF</button>
                  <button className="dash__act__export__option">Exportar como CSV</button>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>      <div className="dash__content-container">
        <div className="content__container">
          {activeTab === 'pedidos' && (
            <PedidosGraficas timePeriod={timePeriod} orderType={orderType} />
          )}
          {activeTab === 'productos' && (
            <ProductosGraficas timePeriod={timePeriod} orderType={orderType} />
          )}
          {activeTab === 'clientes' && (
            <ClientesGraficas timePeriod={timePeriod} orderType={orderType} />
          )}
        </div>
      </div>    </div>
  );
}

export default Graficas;
