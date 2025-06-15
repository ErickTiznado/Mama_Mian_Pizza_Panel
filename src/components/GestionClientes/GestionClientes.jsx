import React, { useState, useEffect } from 'react';
import './GestionClientes.css';
import { Search, User, Mail, Phone, MapPin, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ClientePerfilModal from './ClientePerfilModal';

const GestionClientes = () => {
const [clientes, setclientes] = useState([]);
const [clientesFiltrados, setClientesFiltrados] = useState([]);
const [filtros, setFiltros] = useState({
  search: '',
  status: 'todos', // 'todos', 'activos', 'inactivos', 'vip'
});
const [paginacion, setPaginacion] = useState({
  paginaActual: 1,
  elementosPorPagina: 10,
  totalPaginas: 1
});
const [modalVisible, setModalVisible] = useState(false);
const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
const API_URL = 'https://api.mamamianpizza.com'; // Reemplaza con tu URL de API

const fetchClientes =  async () => {
try {
  const response = await fetch(`${API_URL}/api/customers/all`)
  const data = await response.json();
  console.log('Response:', data.clientes);
  setclientes(data.clientes);
  setClientesFiltrados(data.clientes); // Inicializar clientes filtrados
  console.log('Clientes:', clientes);
}
catch (error) {
  console.error('Error fetching clientes:', error);
}
};

// Función para filtrar clientes
const filtrarClientes = () => {
  let clientesTemp = [...clientes];

  // Filtrar por búsqueda
  if (filtros.search.trim() !== '') {
    clientesTemp = clientesTemp.filter(cliente => 
      cliente.cliente.toLowerCase().includes(filtros.search.toLowerCase()) ||
      cliente.contacto.correo.toLowerCase().includes(filtros.search.toLowerCase()) ||
      cliente.contacto.telefono.includes(filtros.search)
    );
  }

  // Filtrar por estado
  if (filtros.status !== 'todos') {
    clientesTemp = clientesTemp.filter(cliente => {
      switch (filtros.status) {
        case 'activos':
          return cliente.estado === 'Activo';
        case 'inactivos':
          return cliente.estado === 'Inactivo';
        case 'vip':
          return cliente.estado === 'VIP';
        default:
          return true;
      }
    });
  }
  setClientesFiltrados(clientesTemp);
  
  // Actualizar información de paginación
  const totalPaginas = Math.ceil(clientesTemp.length / paginacion.elementosPorPagina);
  setPaginacion(prev => ({
    ...prev,
    totalPaginas: totalPaginas,
    paginaActual: 1 // Resetear a primera página cuando se filtra
  }));
};

// Manejar cambios en la búsqueda
const handleSearchChange = (e) => {
  setFiltros(prev => ({
    ...prev,
    search: e.target.value
  }));
};

// Manejar cambios en el filtro de estado
const handleStatusChange = (status) => {
  setFiltros(prev => ({
    ...prev,
    status: status
  }));
};

// Funciones de paginación
const irAPagina = (numeroPagina) => {
  setPaginacion(prev => ({
    ...prev,
    paginaActual: numeroPagina
  }));
};

const paginaAnterior = () => {
  if (paginacion.paginaActual > 1) {
    irAPagina(paginacion.paginaActual - 1);
  }
};

const paginaSiguiente = () => {
  if (paginacion.paginaActual < paginacion.totalPaginas) {
    irAPagina(paginacion.paginaActual + 1);
  }
};

const cambiarElementosPorPagina = (cantidad) => {
  setPaginacion(prev => ({
    ...prev,
    elementosPorPagina: cantidad,
    paginaActual: 1,
    totalPaginas: Math.ceil(clientesFiltrados.length / cantidad)
  }));
};

// Funciones para el modal
const abrirModal = (cliente) => {
  setClienteSeleccionado(cliente);
  setModalVisible(true);
  // Para evitar scroll en el fondo mientras el modal está abierto
  document.body.style.overflow = 'hidden';
};

const cerrarModal = () => {
  setModalVisible(false);
  // Restaurar scroll
  document.body.style.overflow = 'auto';
};

// Obtener clientes para la página actual
const obtenerClientesPaginados = () => {
  const inicio = (paginacion.paginaActual - 1) * paginacion.elementosPorPagina;
  const fin = inicio + paginacion.elementosPorPagina;
  return clientesFiltrados.slice(inicio, fin);
};

useEffect(() => 
{
  fetchClientes();
} , []);

// Effect para filtrar cuando cambien los filtros o clientes
useEffect(() => {
  if (clientes.length > 0) {
    filtrarClientes();
  }
}, [filtros, clientes]);


  return (
    <div className='gestion-clientes'>
      <header className='gestion-clientes-header'>
        <h2>Gestión de Clientes</h2>
      </header>
      <div className='gestion-clientes-content'>

        {/* Filtros */}
        <div className='gestion-clientes-filters'>
          <div className='gestion-clientes-search'>
            <div className='gestion-clientes-search-input'>
            <span>
              <Search size={20} color='#888' />
            </span>
                            <input
              type='text'
              placeholder='Buscar cliente...'
              value={filtros.search}
              onChange={handleSearchChange}
            />
            </div>
          </div>          <div className='gestion-clientes-filters-options'>
            <button 
              className={filtros.status === 'todos' ? 'active' : ''}
              onClick={() => handleStatusChange('todos')}
            >
              Todos
            </button>
            <button 
              className={filtros.status === 'activos' ? 'active' : ''}
              onClick={() => handleStatusChange('activos')}
            >
              Activos
            </button>
            <button 
              className={filtros.status === 'inactivos' ? 'active' : ''}
              onClick={() => handleStatusChange('inactivos')}
            >
              Inactivos
            </button>
            <button 
              className={filtros.status === 'vip' ? 'active' : ''}
              onClick={() => handleStatusChange('vip')}
            >
              VIP
            </button>
          </div>
        </div>        {/* Tabla de Clientes */}
        <div className='gestion-clientes-table'>
          <div className="table-header-info">
            <div className="resultados-contador">
              Mostrando {((paginacion.paginaActual - 1) * paginacion.elementosPorPagina) + 1} - {Math.min(paginacion.paginaActual * paginacion.elementosPorPagina, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
            </div>
            <div className="elementos-por-pagina">
              <label>Mostrar: </label>
              <select 
                value={paginacion.elementosPorPagina} 
                onChange={(e) => cambiarElementosPorPagina(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span> por página</span>
            </div>
          </div>
          <table className='cl-table'>
            <thead className='cl-table-header'>
              <tr>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Pedidos</th>
                <th>Total Gastado</th>
                <th>Ultimo Pedido</th>
                <th>Valoracion</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>            <tbody className='cl-table-body'>
              
          {obtenerClientesPaginados().length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-results">
                    <div className="no-results-content">
                      <User size={48} color="#6b7280" />
                      <h3>No se encontraron clientes</h3>
                      <p>Intenta ajustar los filtros o la búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                obtenerClientesPaginados().map(cl => (
            <tr key={cl.id} >
              <td>
                <div className='cliente-info'>
                  <div className='cliente-avatar'>
                    <User />
                  </div>
                  <div className='cliente-datos'>
                    <div className='cliente-nombre'>{cl.cliente}</div>
                    <div className='cliente-desde'>Cliente desde {cl.fechaRegistro || '2024-03-15'}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className='contacto-info'>
                  <div className='contacto-item'>
                    <Mail size={16} />
                    <span>{cl.contacto.correo}</span>
                  </div>
                  <div className='contacto-item'>
                    <Phone size={16} />
                    <span>{cl.contacto.telefono}</span>
                  </div>
                  <div className='contacto-item'>
                    <MapPin size={16} />
                    <span>{cl.contacto.direccion || 'Dirección no disponible'}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className='pedidos-info'>
                  <div className='pedidos-count'>{cl.pedidos}</div>
                  <div className='pedidos-text'>pedidos</div>
                </div>
              </td>
              <td>
                <div className='total-gastado'>{cl.totalGastado}</div>
              </td>
              <td>
                <div className='ultimo-pedido'>
                  <Calendar size={16} />
                  <span>{cl.ultimoPedido}</span>
                </div>
              </td>
              <td>
                <div className='valoracion'>
                  <span className='valoracion-numero'>{cl.valoracion || 5}</span>
                  <Star size={16} fill="currentColor" className='valoracion-estrella' />
                  <span className='valoracion-total'>({cl.totalReseñas || '5/5'})</span>
                </div>
              </td>
              <td>
                <div className={`badge-estado ${cl.estado === 'Activo' ? 'badge-activo' : cl.estado === 'VIP' ? 'badge-vip' : 'badge-inactivo'}`}>
                  <div className='estado-indicator'></div>
                  {cl.estado}
                </div>
              </td>              <td>
                <div className='acciones'>
                  <button className='btn-perfil' onClick={() => abrirModal(cl)}>Ver Perfil</button>
                  <button className='btn-contactar'>Contactar</button>
                </div>
              </td>
            </tr>
          )
          ))}            </tbody>
          </table>
          
          {/* Controles de Paginación */}
          {clientesFiltrados.length > 0 && (
            <div className="paginacion-container">
              <div className="paginacion-info">
                Página {paginacion.paginaActual} de {paginacion.totalPaginas}
              </div>
              
              <div className="paginacion-controles">
                <button 
                  className="btn-paginacion"
                  onClick={paginaAnterior}
                  disabled={paginacion.paginaActual === 1}
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                
                <div className="numeros-pagina">
                  {Array.from({ length: paginacion.totalPaginas }, (_, i) => i + 1)
                    .filter(num => {
                      // Mostrar primera página, última página, página actual y páginas adyacentes
                      return num === 1 || 
                             num === paginacion.totalPaginas || 
                             Math.abs(num - paginacion.paginaActual) <= 1;
                    })
                    .map((num, index, array) => {
                      // Agregar puntos suspensivos si hay saltos
                      const elementos = [];
                      if (index > 0 && num - array[index - 1] > 1) {
                        elementos.push(
                          <span key={`dots-${num}`} className="puntos-suspensivos">...</span>
                        );
                      }
                      elementos.push(
                        <button
                          key={num}
                          className={`btn-numero-pagina ${num === paginacion.paginaActual ? 'activo' : ''}`}
                          onClick={() => irAPagina(num)}
                        >
                          {num}
                        </button>
                      );
                      return elementos;
                    })}
                </div>
                
                <button 
                  className="btn-paginacion"
                  onClick={paginaSiguiente}
                  disabled={paginacion.paginaActual === paginacion.totalPaginas}
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>      </div>
      
      {/* Modal de Perfil de Cliente */}
      {clienteSeleccionado && (
        <ClientePerfilModal 
          cliente={clienteSeleccionado}
          visible={modalVisible}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
};

export default GestionClientes;
