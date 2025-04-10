import React, { useState } from 'react';
import './OrderManager.css';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';

const OrderManager = () => {
  const [modo, setModo] = useState('restaurante');
  const [metodoPago, setMetodoPago] = useState('');

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-panel">
        <Navbar />

        <div className="content-scroll">
          <div className="wrapper">
            <div className="card">
              <div className="header">
                <h2>Gestión de Pedidos</h2>
                <button className="newOrderBtn">
                <span className="icon1">+</span> Nuevo pedido
                </button>
              </div>

              <div className="tabs">
                <button
                  className={modo === 'domicilio' ? 'tabActive' : 'tab'}
                  onClick={() => setModo('domicilio')}
                >
                  A domicilio
                </button>
                <button
                  className={modo === 'restaurante' ? 'tabActive' : 'tab'}
                  onClick={() => setModo('restaurante')}
                >
                  En el restaurante
                </button>
              </div>

              <h3>Crear nuevo pedido</h3>

              <div className="form">
                <label>Cliente</label>
                <div className="inputsRow">
                  <input type="text" placeholder="Nombre" />
                  <input type="text" placeholder="Apellido" />
                </div>

                {modo === 'domicilio' && (
                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Dirección</label>
                      <input type="text" placeholder="Calle principal 123" />
                    </div>
                    <div className="inputGroup">
                      <label>Teléfono</label>
                      <input type="text" placeholder="12345678" />
                    </div>
                  </div>
                )}

                <label>Método de Pago</label>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                  <option value="">Seleccionar método de pago</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de crédito</option>
                  <option value="paypal">Paypal</option>
                </select>

                <label>Productos del Pedido</label>
                <select>
                  <option>Seleccionar del menú</option>
                </select>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
