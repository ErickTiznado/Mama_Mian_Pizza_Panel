import React, { useState } from 'react';
import './GestionClientes.css';
import Navbar from '../navbar/nabvar';
import Sidebar from '../sidebar/sidebar';

const GestionClientes = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    pedidos: '',
    ultimoPedido: '',
  });

  const [clientes, setClientes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleGuardar = () => {
    setClientes([...clientes, cliente]);
    setCliente({
      nombre: '',
      email: '',
      telefono: '',
      pedidos: '',
      ultimoPedido: '',
    });
    setMostrarFormulario(false);
  };

  return (
    <div className="gc-layout">
      <Sidebar />

      <div className="gc-main-panel">
        <Navbar />

        <div className="content-scroll">
          <div className="gc-wrapper">

            {/* 🔹 Encabezado */}
            <div className="gc-header-outside">
              <h2 className="titulo-cliente">Gestión de Clientes</h2>
              <button
                className="newClientBtn"
                onClick={() => setMostrarFormulario(true)}
              >
                <span className="gc-icon">+</span> Nuevo cliente
              </button>
            </div>

            {/* 🔹 Formulario (condicional) */}
            {mostrarFormulario && (
              <div className="gc-card">
                <div className="gc-form">
                  <div className="gc-inputsRow">
                    <div className="gc-inputGroup">
                      <label>Cliente</label>
                      <input
                        type="text"
                        value={cliente.nombre}
                        onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="gc-inputGroup">
                      <label>Email</label>
                      <input
                        type="email"
                        value={cliente.email}
                        onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                        placeholder="ejemplo@email.com"
                      />
                    </div>
                  </div>

                  <div className="gc-inputsRow">
                    <div className="gc-inputGroup">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        value={cliente.telefono}
                        onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                        placeholder="12345678"
                      />
                    </div>
                    <div className="gc-inputGroup">
                      <label>Pedidos</label>
                      <input
                        type="number"
                        value={cliente.pedidos}
                        onChange={(e) => setCliente({ ...cliente, pedidos: e.target.value })}
                        placeholder="Cantidad de pedidos"
                      />
                    </div>
                    <div className="gc-inputGroup">
                      <label>Último Pedido</label>
                      <input
                        type="date"
                        value={cliente.ultimoPedido}
                        onChange={(e) => setCliente({ ...cliente, ultimoPedido: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="gc-actions">
                    <button className="gc-cancelar" onClick={() => setMostrarFormulario(false)}>
                      Cancelar
                    </button>
                    <button className="gc-guardar" onClick={handleGuardar}>
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 🔹 Tabla de clientes */}
            <div
              className="tabla-clientes"
              style={{ marginTop: mostrarFormulario ? '40px' : '10px' }}
            >
              {clientes.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Pedidos</th>
                      <th>Último Pedido</th>
                      <th>Visualizar pedidos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c, index) => (
                      <tr key={index}>
                        <td>{c.nombre}</td>
                        <td>{c.email}</td>
                        <td>{c.telefono}</td>
                        <td>{c.pedidos}</td>
                        <td>{c.ultimoPedido}</td>
                        <td><button>Ver</button></td>
                        <td>
                          <button style={{ color: 'red' }}>Eliminar</button>{' '}
                          <button>Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionClientes;
