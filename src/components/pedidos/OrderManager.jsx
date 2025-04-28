import React, { useState } from "react";
import "./OrderManager.css";


const OrderManager = () => {
  const [modo, setModo] = useState("restaurante");
  const [metodoPago, setMetodoPago] = useState("");

  return (
    <div className="order__container">
      <header className="order__header">
        <h1>Gestion de Pedidos</h1>
      </header>
      <main className="order__main">
        <div className="order__filters">
          <div className="filters">
            <button className="active">Pendientes</button>
          </div>
          <div className="filters">
            <button>En Proceso</button>
          </div>
          <div className="filters">
            <button>Entregados</button>
          </div>
          <div className="filters">
            <button>Cancelados</button>
          </div>
        </div>
        <div className="order__content">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Productos</th>
                <th>Descripcion</th>
                <th>Cliente</th>
                <th>Direccion</th>
                <th>Notas</th>
                <th>Metodo de Pago</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Pizza, Ensalada</td>
                <td>Sin cebolla</td>
                <td>Juan Perez</td>
                <td>Calle Falsa 123</td>
                <td>Ninguna</td>
                <td>Tarjeta de Credito</td>
                <td>$20.00</td>
                <td>Pendiente</td>
                <td>
                  <button className="btn__action">Ver Detalles</button>
                  <button className="btn__action">Cancelar</button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Pizza, Ensalada</td>
                <td>Sin cebolla</td>
                <td>Juan Perez</td>
                <td>Calle Falsa 123</td>
                <td>Ninguna</td>
                <td>Tarjeta de Credito</td>
                <td>$20.00</td>
                <td>Pendiente</td>
                <td>
                  <button className="btn__action">Ver Detalles</button>
                  <button className="btn__action">Cancelar</button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Pizza, Ensalada</td>
                <td>Sin cebolla</td>
                <td>Juan Perez</td>
                <td>Calle Falsa 123</td>
                <td>Ninguna</td>
                <td>Tarjeta de Credito</td>
                <td>$20.00</td>
                <td>Pendiente</td>
                <td>
                  <button className="btn__action">Ver Detalles</button>
                  <button className="btn__action">Cancelar</button>
                </td>
              </tr>
              </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default OrderManager;
