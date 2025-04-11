import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventario.css';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/nabvar';
import { FaSearch, FaTrashAlt, FaPen } from 'react-icons/fa';

const API_URL = 'http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io';

const Inventario = () => {
  // Menú array para almacenar el inventario y utilizarlo para las cards
  const [menu, setMenu] = useState([]);

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


  const handleDelete = (e) =>{
    e.eventpreventDefault();
  }

  // Estado para el nuevo producto con valores por defecto
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

  // Optimización: Uso de useRef para mantener el valor actualizado en efectos asíncronos
  const [inventory, setInventory] = useState([]);

  // Cargar inventario desde la API
  const cargarInventario = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/inventory/getInventori`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setInventory(data);
      setMenu(data); // También guardamos los datos en el array de menú
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Error al cargar el inventario. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    cargarInventario();
  }, []);

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
    if (!nuevoProducto.nombre?.trim()) {
      setError('El nombre del producto es obligatorio');
      return;
    }
    
    if (!nuevoProducto.categoria?.trim()) {
      setError('Debes seleccionar una categoría');
      return;
    }
    
    if (!nuevoProducto.stock || isNaN(parseFloat(nuevoProducto.stock)) || parseFloat(nuevoProducto.stock) < 0) {
      setError('El stock debe ser un número válido mayor o igual a 0');
      return;
    }
    
    if (!nuevoProducto.unidad?.trim()) {
      setError('Debes seleccionar una unidad de medida');
      return;
    }
    
    if (!nuevoProducto.fecha_caducidad?.trim()) {
      setError('La fecha de caducidad es obligatoria');
      return;
    }
    
    if (!nuevoProducto.proveedor?.trim()) {
      setError('El proveedor es obligatorio');
      return;
    }
    
    if (!nuevoProducto.costo || isNaN(parseFloat(nuevoProducto.costo)) || parseFloat(nuevoProducto.costo) < 0) {
      setError('El costo debe ser un número válido mayor o igual a 0');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Preparamos los datos para el envío - aseguramos que todos los campos estén formateados correctamente
      const inventarioData = {
        nombre: nuevoProducto.nombre.trim(),
        categoria: nuevoProducto.categoria.trim(),
        cantidad: parseFloat(nuevoProducto.stock), // Convertimos a número
        unidad: nuevoProducto.unidad.trim(),
        fecha_caducidad: nuevoProducto.fecha_caducidad,
        proveedor: nuevoProducto.proveedor.trim(),
        costo: parseFloat(nuevoProducto.costo).toFixed(2), // Formateamos a 2 decimales
        estado: nuevoProducto.estado
      };

      if (modoEdicion && productoEditando !== null) {
        // Actualización de un producto existente
        const response = await axios.put(
          `${API_URL}/api/inventory/updateInventori/${productoEditando}`,
          inventarioData
        );
        
        if (response.status === 200) {
          // Actualizamos ambos arrays de datos (menu y inventory)
          const actualizados = inventory.map(item => 
            item.id_ingrediente === productoEditando 
              ? { ...item, ...inventarioData, id_ingrediente: productoEditando } 
              : item
          );
          setInventory(actualizados);
          setMenu(actualizados);
          
          setSuccessMessage('Producto actualizado con éxito');
        }
      } else {
        // Creación de un nuevo producto
        const response = await axios.post(
          `${API_URL}/api/inventory/addInventori`, 
          inventarioData, 
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.status === 201 || response.status === 200) {
          // Si tenemos un ID del nuevo producto en la respuesta
          const nuevoProductoConId = { 
            ...inventarioData, 
            id_ingrediente: response.data.id_ingrediente || Date.now(), // Usar ID de la respuesta o generar uno temporal
            cantidad_actual: inventarioData.cantidad // Asegurar consistencia en los nombres de campos
          };
          
          // Actualizamos ambos arrays de datos
          setInventory(prev => [...prev, nuevoProductoConId]);
          setMenu(prev => [...prev, nuevoProductoConId]);
          
          setSuccessMessage('Producto agregado con éxito');
        }
      }

      // Reiniciar el formulario
      resetForm();
      setPaginaActual(1);
      
      // Refrescamos los datos desde el servidor para garantizar consistencia
      setTimeout(() => {
        cargarInventario();
      }, 1000);
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setError(error.response?.data?.message || 'Error al guardar el producto. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!id) {
      setError('No se pudo identificar el producto a eliminar');
      return;
    }
    
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.delete(`${API_URL}/api/inventory/deleteInventori/${id}`);
      
      if (response.status === 200 || response.status === 204) {
        // Actualizar estado local removiendo el producto eliminado
        setInventory(prev => prev.filter(item => item.id_ingrediente !== id));
        setMenu(prev => prev.filter(item => item.id_ingrediente !== id));
        setSuccessMessage('Producto eliminado correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('No se pudo eliminar el producto. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    const producto = inventory.find(item => item.id_ingrediente === id);
    
    if (!producto) {
      setError('No se pudo encontrar el producto para editar');
      return;
    }
    
    // Mapear los campos del producto a editar al formato del formulario
    setNuevoProducto({
      nombre: producto.nombre || '',
      categoria: producto.categoria || '',
      stock: producto.cantidad_actual?.toString() || '',
      unidad: producto.unidad || '',
      estado: producto.estado || 'Normal',
      fecha_caducidad: producto.fecha_caducidad ? new Date(producto.fecha_caducidad).toISOString().split('T')[0] : '',
      proveedor: producto.proveedor || '',
      costo: producto.costo?.toString() || ''
    });
    
    setProductoEditando(id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  // Filtrar elementos para búsqueda y paginación
  const menuFiltrado = menu.filter(item => 
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  const totalPaginas = Math.ceil(menuFiltrado.length / productosPorPagina);
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;
  const menuEnPagina = menuFiltrado.slice(indexInicio, indexFin);

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
                      <label>Nombre <span className="campo-requerido">*</span></label>
                      <input
                        type="text"
                        name="nombre"
                        value={nuevoProducto.nombre}
                        onChange={handleChange}
                        placeholder="Nombre del producto"
                        required
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Categoría <span className="campo-requerido">*</span></label>
                      <select
                        name="categoria"
                        value={nuevoProducto.categoria}
                        onChange={handleChange}
                        required
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
                      <label>Stock Actual <span className="campo-requerido">*</span></label>
                      <input
                        type="number"
                        name="stock"
                        value={nuevoProducto.stock}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Unidad <span className="campo-requerido">*</span></label>
                      <select
                        name="unidad"
                        value={nuevoProducto.unidad}
                        onChange={handleChange}
                        required
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
                      <label>Fecha de caducidad <span className="campo-requerido">*</span></label>
                      <input
                        type="date"
                        name="fecha_caducidad"
                        value={nuevoProducto.fecha_caducidad}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Proveedor <span className="campo-requerido">*</span></label>
                      <input
                        type="text"
                        name="proveedor"
                        value={nuevoProducto.proveedor}
                        onChange={handleChange}
                        placeholder="Nombre del proveedor"
                        required
                      />
                    </div>
                  </div>

                  <div className="inputsRow">
                    <div className="inputGroup">
                      <label>Costo <span className="campo-requerido">*</span></label>
                      <input
                        type="number"
                        name="costo"
                        value={nuevoProducto.costo}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div className="inputGroup">
                      <label>Estado</label>
                      <select
                        name="estado"
                        value={nuevoProducto.estado}
                        onChange={handleChange}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Bajo">Bajo</option>
                        <option value="Crítico">Crítico</option>
                      </select>
                    </div>
                  </div>

                  <div className="actions">
                    <button 
                      type="button" 
                      className="cancelar" 
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
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

                {/* Vista de cards en lugar de tabla */}
                <div className="cards-container">
                  {menuFiltrado.length > 0 ? (
                    menuEnPagina.map((item) => (
                      <div className="inventory-card" key={item.id_ingrediente}>
                        <div className="card-header">
                          <h3>{item.nombre}</h3>
                          <span className={`card-status ${item.estado?.toLowerCase() || 'normal'}`}>
                            {item.estado || 'Normal'}
                          </span>
                        </div>
                        <div className="card-body">
                          <div className="card-info">
                            <p><span>Categoría:</span> {item.categoria || 'No especificada'}</p>
                            <p><span>Stock:</span> {item.cantidad_actual} {item.unidad}</p>
                            <p><span>Proveedor:</span> {item.proveedor}</p>
                            <p><span>Caducidad:</span> {new Date(item.fecha_caducidad).toLocaleDateString()}</p>
                            <p><span>Costo:</span> ${parseFloat(item.costo || 0).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="card-actions">
                          <button className="btn-editar-card" onClick={() => handleEditar(item.id_ingrediente)}>
                            <FaPen /> Editar
                          </button>
                          <button className="btn-eliminar-card" onClick={() => handleEliminar(item.id_ingrediente)}>
                            <FaTrashAlt /> Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No se encontraron productos que coincidan con tu búsqueda</p>
                    </div>
                  )}
                </div>

                {Math.ceil(menuFiltrado.length / productosPorPagina) > 1 && (
                  <div className="paginacion">
                    <button
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                      ⬅ Anterior
                    </button>
                    <span>Página {paginaActual} de {Math.ceil(menuFiltrado.length / productosPorPagina)}</span>
                    <button
                      disabled={paginaActual === Math.ceil(menuFiltrado.length / productosPorPagina)}
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
