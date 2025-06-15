import React, { useState, useEffect } from 'react';
import './GestionClientes.css';
import { Search, User, Mail, Phone, MapPin, Star, Calendar } from 'lucide-react';

const GestionClientes = () => {
const [clientes, setclientes] = useState([]);
const [filtros, setFiltros] = useState({
  search: '',
  status: 'todos', // 'todos', 'activos', 'inactivos', 'vip'
});
const API_URL = 'https://api.mamamianpizza.com'; // Reemplaza con tu URL de API

const fetchClientes =  async () => {
try {
  const response = await fetch(`${API_URL}/api/customers/all`)
  const data = await response.json();
  console.log('Response:', data.clientes);
  setclientes(data.clientes);
  console.log('Clientes:', clientes);
}
catch (error) {
  console.error('Error fetching clientes:', error);
}
};

useEffect(() => 
{
  fetchClientes();
} , []);


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
            />
            </div>
          </div>
          <div className='gestion-clientes-filters-options'>
            <button>Todos</button>
            <button>Activos</button>
            <button>Inactivos</button>
            <button>VIP</button>
          </div>
        </div>
        {/* Tabla de Clientes */}
        <div className='gestion-clientes-table'>
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
              
          {clientes.map(cl => (
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
              </td>
              <td>
                <div className='acciones'>
                  <button className='btn-perfil'>Ver Perfil</button>
                  <button className='btn-contactar'>Contactar</button>
                </div>
              </td>
            </tr>
          )
          )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionClientes;
