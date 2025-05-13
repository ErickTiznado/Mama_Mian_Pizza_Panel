import React from "react";
import LineGraf from "../graficodeLineas/lineGraf";
import "./clientesGraficas.css";

// Sample data for Clientes charts
const clientesChartData = [
  { month: "January", nuevos: 42, recurrentes: 138 },
  { month: "February", nuevos: 58, recurrentes: 147 },
  { month: "March", nuevos: 65, recurrentes: 172 },
  { month: "April", nuevos: 47, recurrentes: 143 },
  { month: "May", nuevos: 73, recurrentes: 157 },
  { month: "June", nuevos: 61, recurrentes: 165 },
];

// Top customers sample data
const topClientes = [
  { nombre: "Carlos Méndez", pedidos: 24, gasto: "$352.80" },
  { nombre: "María López", pedidos: 18, gasto: "$287.50" },
  { nombre: "Juan Rodríguez", pedidos: 15, gasto: "$231.40" },
  { nombre: "Ana García", pedidos: 12, gasto: "$198.75" },
  { nombre: "Pedro Sánchez", pedidos: 10, gasto: "$167.90" },
];

function ClientesGraficas() {
  return (
    <div className="clientes-graficas-container">
      <h2>Análisis de Clientes</h2>
      <div className="clientes-graficas-content">
        <div className="clientes-chart">
          <h3>Clientes Nuevos vs Recurrentes</h3>
          <LineGraf data={clientesChartData} />
        </div>
        
        <div className="clientes-top">
          <h3>Clientes Frecuentes</h3>
          <div className="top-clientes-list">
            {topClientes.map((cliente, index) => (
              <div key={index} className="top-cliente-item">
                <span className="cliente-nombre">{cliente.nombre}</span>
                <span className="cliente-pedidos">{cliente.pedidos} pedidos</span>
                <span className="cliente-gasto">{cliente.gasto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientesGraficas;