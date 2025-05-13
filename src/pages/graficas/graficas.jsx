import { useState } from "react";
import "./graficas.css";
import PedidosGraficas from "./pedidosGraficas/pedidosGraficas";
import ProductosGraficas from "./productosGraficas/productosGraficas";
import ClientesGraficas from "./clientesGraficas/clientesGraficas";

function Graficas() {
  const [activeTab, setActiveTab] = useState("pedidos");

  return (
    <div className="graficas-container">
      <div className="Categori__tabs__container">
        <div>
          <button 
            className={`category_tab-btn ${activeTab === "pedidos" ? "active" : ""}`}
            onClick={() => setActiveTab("pedidos")}
          >
            Pedidos
          </button>
        </div>
        <div>
          <button 
            className={`category_tab-btn ${activeTab === "productos" ? "active" : ""}`}
            onClick={() => setActiveTab("productos")}
          >
            Productos
          </button>
        </div>
        <div>
          <button 
            className={`category_tab-btn ${activeTab === "clientes" ? "active" : ""}`}
            onClick={() => setActiveTab("clientes")}
          >
            Clientes
          </button>
        </div>
      </div>
      
      <div className="graficas-content">
        {activeTab === "pedidos" && <PedidosGraficas />}
        {activeTab === "productos" && <ProductosGraficas />}
        {activeTab === "clientes" && <ClientesGraficas />}
      </div>
    </div>
  );
}

export default Graficas;
