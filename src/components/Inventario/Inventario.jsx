import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventario.css';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/nabvar';
import { FaSearch, FaTrashAlt, FaPen } from 'react-icons/fa';

const API_URL = 'http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io';

const Inventario = () => {










  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;
  
  // Estado para manejar respuestas del API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    unidad: '',
    estado: 'Normal',
    fecha_caducidad: '',
    proveedor: '',
    costo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const [invetory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventory/getInventori`);
        const data = await response.json();
        setInventory(data);
      }catch(error){
        console.error('Error fetching inventory:', error);
      }finally{
        console.log('Inventory fetched:', invetory);
      }
    }
    fetchInventory();
  },[]);
  console.log('Inventory:', invetory);




  const resetForm = () => {
    setNuevoProducto({
      nombre: '',
      categoria: '',
      stock: '',
      unidad: '',
      estado: 'Normal',
      fecha_caducidad: '',
      proveedor: '',
      costo: ''
    });
    setModoEdicion(false);
    setProductoEditando(null);
    setMostrarFormulario(false);
    setError(null);
    setSuccessMessage('');
  };

  const handleGuardar = async () => {
    // Validación de campos requeridos
    if (!nuevoProducto.nombre || !nuevoProducto.categoria || !nuevoProducto.stock || 
        !nuevoProducto.unidad || !nuevoProducto.fecha_caducidad || !nuevoProducto.proveedor || 
        !nuevoProducto.costo) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Mapear campos del formulario a los esperados por la API
      const inventarioData = {
        nombre: nuevoProducto.nombre,
        categoria: nuevoProducto.categoria,
        cantidad: nuevoProducto.stock, // Mapeado de stock a cantidad como espera el backend
        unidad: nuevoProducto.unidad,
        fecha_caducidad: nuevoProducto.fecha_caducidad,
        proveedor: nuevoProducto.proveedor,
        costo: nuevoProducto.costo
      };

      if (modoEdicion && productoEditando !== null) {
        // Si implementamos edición en el futuro, aquí iría el código
        const nuevos = productos.map((prod, i) =>
          i === productoEditando ? nuevoProducto : prod
        );
        setProductos(nuevos);
        setSuccessMessage('Producto actualizado con éxito');
      } else {
        // Llamada a la API para crear nuevo inventario
        const response = await axios.post(`${API_URL}/api/inventory/addInventori`, inventarioData);
        
        // Si la llamada a la API es exitosa, añadimos el producto al estado local
        setProductos([...productos, nuevoProducto]);
        setSuccessMessage('Producto agregado con éxito');
      }

      // Reiniciar el formulario
      resetForm();
      setPaginaActual(1);
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setError(error.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
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
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
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

                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Fecha de caducidad</label>
                      <input
                        type="date"
                        name="fecha_caducidad"
                        value={nuevoProducto.fecha_caducidad}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Proveedor</label>
                      <input
                        type="text"
                        name="proveedor"
                        value={nuevoProducto.proveedor}
                        onChange={handleChange}
                        placeholder="Nombre del proveedor"
                      />
                    </div>
                  </div>

                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Costo</label>
                      <input
                        type="number"
                        name="costo"
                        value={nuevoProducto.costo}
                        onChange={handleChange}
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="actions">
                    <button className="cancelar" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button 
                      className="guardar" 
                      onClick={handleGuardar}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Guardar'}
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
                        <th>Fecha Caducidad</th>
                        <th>Proveedor</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invetory
                        .filter(item => 
                          item.nombre.toLowerCase().includes(busqueda.toLowerCase())
                        )
                        .slice(indexInicio, indexFin)
                        .map((item) => (
                          <tr key={item.id_ingrediente}>
                            <td>{item.nombre}</td>
                            <td>{item.categoria || 'No especificada'}</td>
                            <td>{item.cantidad_actual}</td>
                            <td>{item.unidad}</td>
                            <td className="estado" style={{color: 'green'}}>Normal</td>
                            <td>{new Date(item.fecha_caducidad).toLocaleDateString()}</td>
                            <td>{item.proveedor}</td>
                            <td className="acciones-columna">
                              <button className="btn-eliminar" onClick={() => handleEliminar(item.id_ingrediente)}>
                                <FaTrashAlt /> Eliminar
                              </button>
                              <button className="btn-editar" onClick={() => handleEditar(item.id_ingrediente)}>
                                <FaPen /> Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {Math.ceil(invetory.filter(item => 
                  item.nombre.toLowerCase().includes(busqueda.toLowerCase())).length / 
                  productosPorPagina) > 1 && (
                  <div className="paginacion">
                    <button
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                      ⬅ Anterior
                    </button>
                    <span>Página {paginaActual} de {Math.ceil(invetory.filter(item => 
                      item.nombre.toLowerCase().includes(busqueda.toLowerCase())).length / 
                      productosPorPagina)}</span>
                    <button
                      disabled={paginaActual === Math.ceil(invetory.filter(item => 
                        item.nombre.toLowerCase().includes(busqueda.toLowerCase())).length / 
                        productosPorPagina)}
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
