import React, { useState } from 'react';
import './Inventario.css';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/nabvar';
import { FaSearch, FaTrashAlt, FaPen } from 'react-icons/fa';

const Inventario = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    unidad: '',
    estado: 'Normal',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = () => {
    if (modoEdicion && productoEditando !== null) {
      const nuevos = productos.map((prod, i) =>
        i === productoEditando ? nuevoProducto : prod
      );
      setProductos(nuevos);
    } else {
      setProductos([...productos, nuevoProducto]);
    }

    setNuevoProducto({
      nombre: '',
      categoria: '',
      stock: '',
      unidad: '',
      estado: 'Normal',
    });
    setModoEdicion(false);
    setProductoEditando(null);
    setMostrarFormulario(false);
    setPaginaActual(1);
  };

  const handleEliminar = (index) => {
    const nuevos = productos.filter((_, i) => i !== index);
    setProductos(nuevos);
  };

  const handleEditar = (index) => {
    const producto = productos[index];
    setNuevoProducto(producto);
    setProductoEditando(index);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;
  const productosEnPagina = productosFiltrados.slice(indexInicio, indexFin);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-panel">
        <Navbar />

        {!mostrarFormulario ? (
          <div className="header-inventario">
            <h2 className="titulo-inventario">Control de Inventario</h2>
            <button className="agregarBtn" onClick={() => setMostrarFormulario(true)}>
              <span className="icon"></span> +Agregar Inventario
            </button>
          </div>
        ) : (
          <div className="header-formulario">
            <h2 className="titulo-inventario">
              {modoEdicion ? 'Editar producto' : 'Agregar nuevo producto'}
            </h2>
          </div>
        )}

        <div className="content-scroll">
          <div className="wrapper">
            {mostrarFormulario ? (
              <div className="card">
                <div className="form">
                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={nuevoProducto.nombre}
                        onChange={handleChange}
                        placeholder="Nombre del producto"
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Categoría</label>
                      <select
                        name="categoria"
                        value={nuevoProducto.categoria}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Quesos">Quesos</option>
                        <option value="Carnes">Carnes</option>
                        <option value="Vegetales">Vegetales</option>
                        <option value="Mariscos">Mariscos</option>
                        <option value="Salsas">Salsas</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>
                  </div>

                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Stock Actual</label>
                      <input
                        type="number"
                        name="stock"
                        value={nuevoProducto.stock}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Unidad</label>
                      <select
                        name="unidad"
                        value={nuevoProducto.unidad}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar unidad</option>
                        <option value="kg">kg</option>
                        <option value="litros">litros</option>
                        <option value="unidades">unidades</option>
                        <option value="porciones">porciones</option>
                        <option value="bandejas">bandejas</option>
                        <option value="gramos">gramos</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>

                  <div className="actions">
                    <button className="cancelar" onClick={() => {
                      setMostrarFormulario(false);
                      setModoEdicion(false);
                      setNuevoProducto({
                        nombre: '',
                        categoria: '',
                        stock: '',
                        unidad: '',
                        estado: 'Normal',
                      });
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
              <>
                <div className="buscador">
                  <input
                    type="text"
                    placeholder="Buscar producto"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <span className="icono-buscar"><FaSearch /></span>
                </div>

                <div className="tabla-inventario">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Stock Actual</th>
                        <th>Unidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosEnPagina.map((prod, i) => (
                        <tr key={i}>
                          <td>{prod.nombre}</td>
                          <td>{prod.categoria}</td>
                          <td>{prod.stock}</td>
                          <td>{prod.unidad}</td>
                          <td className="estado">{prod.estado}</td>
                          <td className="acciones-columna">
                            <button className="btn-eliminar" onClick={() => handleEliminar(i)}>
                              <FaTrashAlt /> Eliminar
                            </button>
                            <button className="btn-editar" onClick={() => handleEditar(i)}>
                              <FaPen /> Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 1 && (
                  <div className="paginacion">
                    <button
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                      ⬅ Anterior
                    </button>
                    <span>Página {paginaActual} de {totalPaginas}</span>
                    <button
                      disabled={paginaActual === totalPaginas}
                      onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                      Siguiente ➡
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
