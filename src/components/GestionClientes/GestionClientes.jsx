import React, { useState } from 'react';
import { FaTrash, FaPen } from 'react-icons/fa'; // Importar iconos FontAwesome
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
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indiceEditar, setIndiceEditar] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 4;

  const handleGuardar = () => {
    if (modoEdicion && indiceEditar !== null) {
      const clientesActualizados = [...clientes];
      clientesActualizados[indiceEditar] = cliente;
      setClientes(clientesActualizados);
      setModoEdicion(false);
      setIndiceEditar(null);
    } else {
      setClientes([...clientes, cliente]);
      setPaginaActual(1);
    }
    setCliente({
      nombre: '',
      email: '',
      telefono: '',
      pedidos: '',
      ultimoPedido: '',
    });
    setMostrarFormulario(false);
  };

  const handleEditar = (index) => {
    setCliente(clientes[index]);
    setIndiceEditar(index);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = (index) => {
    const clientesActualizados = clientes.filter((_, i) => i !== index);
    setClientes(clientesActualizados);
    if ((paginaActual - 1) * clientesPorPagina >= clientesActualizados.length && paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const indiceUltimoCliente = paginaActual * clientesPorPagina;
  const indicePrimerCliente = indiceUltimoCliente - clientesPorPagina;
  const clientesActuales = clientes.slice(indicePrimerCliente, indiceUltimoCliente);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  const handleSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const handleAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <div className="content-scroll">
          <div className="wrapper">
        
            <div className="header-outside">
              <h2 className="titulo-cliente">Gestión de Clientes</h2>
              {!mostrarFormulario && (
                <button
                  className="newClientBtn"
                  onClick={() => {
                    setMostrarFormulario(true);
                    setModoEdicion(false);
                    setCliente({
                      nombre: '',
                      email: '',
                      telefono: '',
                      pedidos: '',
                      ultimoPedido: '',
                    });
                  }}
                >
                  <span className="icon"></span>+ Nuevo cliente
                </button>
              )}
            </div>

            {/* 🔹 Mostrar solo Formulario o Tabla */}
            {mostrarFormulario ? (
              <div className="card">
                <div className="form">
                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Cliente</label>
                      <input
                        type="text"
                        value={cliente.nombre}
                        onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="inputGroup">
                      <label>Email</label>
                      <input
                        type="email"
                        value={cliente.email}
                        onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                        placeholder="ejemplo@email.com"
                      />
                    </div>
                  </div>

                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        value={cliente.telefono}
                        onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                        placeholder="12345678"
                      />
                    </div>
                    <div className="inputGroup">
                      <label>Pedidos</label>
                      <input
                        type="number"
                        value={cliente.pedidos}
                        onChange={(e) => setCliente({ ...cliente, pedidos: e.target.value })}
                        placeholder="Cantidad de pedidos"
                      />
                    </div>
                    <div className="inputGroup">
                      <label>Último Pedido</label>
                      <input
                        type="date"
                        value={cliente.ultimoPedido}
                        onChange={(e) => setCliente({ ...cliente, ultimoPedido: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="actions">
                    <button className="cancelar" onClick={() => {
                      setMostrarFormulario(false);
                      setModoEdicion(false);
                      setIndiceEditar(null);
                    }}>
                      Cancelar
                    </button>
                    <button className="guardar" onClick={handleGuardar}>
                      {modoEdicion ? 'Actualizar' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tabla-clientes" style={{ marginTop: '40px' }}>
                {clientes.length > 0 ? (
                  <>
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
                        {clientesActuales.map((c, index) => (
                          <tr key={indicePrimerCliente + index}>
                            <td>{c.nombre}</td>
                            <td>{c.email}</td>
                            <td>{c.telefono}</td>
                            <td>{c.pedidos}</td>
                            <td>{c.ultimoPedido}</td>
                            <td><button>Ver</button></td>
                            <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                              <button
                                className="btn-eliminar"
                                onClick={() => handleEliminar(indicePrimerCliente + index)}
                              >
                                <FaTrash /> Eliminar
                              </button>
                              <button
                                className="btn-editar"
                                onClick={() => handleEditar(indicePrimerCliente + index)}
                              >
                                <FaPen /> Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="paginacion-container">
                      <button 
                        onClick={handleAnterior} 
                        disabled={paginaActual === 1}
                        className="paginacion-boton"
                      >
                        Anterior
                      </button>

                      <span className="paginacion-texto">
                        Página {paginaActual} de {totalPaginas}
                      </span>

                      <button 
                        onClick={handleSiguiente} 
                        disabled={paginaActual === totalPaginas}
                        className="paginacion-boton"
                      >
                        Siguiente
                      </button>
                    </div>
                  </>
                ) : (
                  <p style={{ color: 'white', textAlign: 'center' }}>No hay clientes aún.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionClientes;
