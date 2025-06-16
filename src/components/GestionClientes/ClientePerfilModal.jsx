import React, { useState } from 'react';
import './ClientePerfilModal.css';
import { X, User, Mail, Phone, MapPin, Calendar, Star, CheckCircle, XCircle, Trash2, MessageCircle } from 'lucide-react';

const ClientePerfilModal = ({ cliente, onClose, visible }) => {
  if (!visible) return null;
  // Usar reseñas reales de la API y transformarlas al formato del componente
  const comentarios = cliente.resenas ? cliente.resenas.map(resena => ({
    id: resena.id,
    texto: resena.comentario,
    fecha: resena.fecha,
    experiencia: resena.valoracion,
    estado: resena.aprobada === 1 ? 'Aprobado' : resena.aprobada === 0 ? 'Rechazado' : 'Pendiente',
    mostrarEnTienda: resena.mostrarEnTienda !== undefined ? resena.mostrarEnTienda : true,
    producto: resena.producto
  })) : [];

  // Estadísticas del cliente usando datos reales de la API
  const estadisticas = {
    totalPedidos: cliente.pedidos || 0,
    totalGastado: cliente.totalGastado ? `$${cliente.totalGastado}` : '$0.00',
    pedidosRecientes: cliente.pedidosRecientes || []
  };  // Estado para manejar cambios locales en comentarios
  const [comentariosState, setComentariosState] = useState(comentarios);
  // URL base de la API
  const API_URL = 'https://api.mamamianpizza.com';

  // Función adicional para obtener reseñas por estado de aprobación (opcional)
  const fetchResenasByApprovalStatus = async (aprobada) => {
    try {
      const response = await fetch(`${API_URL}/api/resenas/estado/${aprobada}`);
      if (!response.ok) {
        throw new Error('Error al obtener reseñas por estado');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener reseñas por estado:', error);
      return [];
    }
  };

  // Manejadores para los botones de comentarios con integración a la API
  const handleApprove = async (id) => {
    try {
      // Llamada a la API para cambiar el estado de aprobación (1 = aprobado)
      const response = await fetch(`${API_URL}/api/resenas/estado/${id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aprobada: 1 })
      });

      if (!response.ok) {
        throw new Error('Error al aprobar el comentario');
      }
      
      setComentariosState(prev => 
        prev.map(comentario => 
          comentario.id === id 
            ? { ...comentario, estado: 'Aprobado' }
            : comentario
        )
      );
      console.log('Comentario aprobado:', id);
    } catch (error) {
      console.error('Error al aprobar comentario:', error);
      alert('Error al aprobar el comentario. Por favor, intenta nuevamente.');
    }
  };

  const handleReject = async (id) => {
    try {
      // Llamada a la API para cambiar el estado de aprobación (0 = no aprobado/rechazado)
      const response = await fetch(`${API_URL}/api/resenas/estado/${id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aprobada: 0 })
      });

      if (!response.ok) {
        throw new Error('Error al rechazar el comentario');
      }
      
      setComentariosState(prev => 
        prev.map(comentario => 
          comentario.id === id 
            ? { ...comentario, estado: 'Rechazado' }
            : comentario
        )
      );
      console.log('Comentario rechazado:', id);
    } catch (error) {
      console.error('Error al rechazar comentario:', error);
      alert('Error al rechazar el comentario. Por favor, intenta nuevamente.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.')) {
      try {
        // Llamada a la API para eliminar la reseña
        const response = await fetch(`${API_URL}/api/resenas/${id}`, { 
          method: 'DELETE' 
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el comentario');
        }
        
        setComentariosState(prev => prev.filter(comentario => comentario.id !== id));
        console.log('Comentario eliminado:', id);
      } catch (error) {
        console.error('Error al eliminar comentario:', error);
        alert('Error al eliminar el comentario. Por favor, intenta nuevamente.');
      }
    }
  };
  const handleShowInStore = async (id, show) => {
    try {
      // Por ahora solo actualizar el estado local ya que no tienes endpoint específico para visibilidad
      // Podrías agregar un endpoint adicional o usar el campo 'mostrarEnTienda' en tu API
      setComentariosState(prev => 
        prev.map(comentario => 
          comentario.id === id 
            ? { ...comentario, mostrarEnTienda: show }
            : comentario
        )
      );
      console.log(`${show ? 'Mostrar' : 'Ocultar'} comentario en tienda:`, id);
      
      // TODO: Implementar endpoint para visibilidad si es necesario
      // const response = await fetch(`${API_URL}/api/resenas/${id}/visibilidad`, { 
      //   method: 'PUT', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ mostrarEnTienda: show }) 
      // });
      
    } catch (error) {
      console.error('Error al cambiar visibilidad del comentario:', error);
      alert('Error al cambiar la visibilidad del comentario. Por favor, intenta nuevamente.');
    }
  };
  // Función para contactar cliente por WhatsApp
  const handleContactarCliente = () => {
    const telefono = cliente.contacto?.telefono;
    if (!telefono) {
      alert('No hay número de teléfono disponible para este cliente.');
      return;
    }

    // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '');
    
    // Mensaje profesional de saludo de la empresa
    const mensaje = `¡Hola ${cliente.cliente}! 

Somos el equipo de Mama Mia Pizza. Esperamos que esté teniendo un excelente día.

Nos gustaría saber cómo ha sido su experiencia con nosotros y si hay algo en lo que podamos mejorar para servirle mejor.

¡Gracias por elegirnos! 🍕`;
    
    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/503${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="cliente-perfil-modal-overlay">
      <div className="cliente-perfil-modal">
        <header className="cliente-perfil-modal-header">
          <User size={24} />
          <h2>Perfil de {cliente.cliente}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </header>
        <div className="cliente-perfil-modal-subheader">
          <p>Información completa del cliente y gestión de comentarios</p>
        </div>        <div className="cliente-perfil-modal-content">
          <div className="cliente-perfil-modal-columns">
            {/* Columna izquierda - Información personal y Estadísticas */}
            <div className="cliente-perfil-left-section">
              {/* Información personal */}
              <div className="cliente-perfil-column info-personal">
                <div className="column-header">
                  <User size={18} />
                  <h3>Información Personal</h3>
                </div>

                <div className="cliente-avatar-large">
                  <User size={32} />
                </div>

                <div className="cliente-nombre-grande">
                  {cliente.cliente}
                </div>

                <div className={`badge-estado ${cliente.estado === 'Activo' ? 'badge-activo' : cliente.estado === 'VIP' ? 'badge-vip' : 'badge-inactivo'}`}>
                  <div className="estado-indicator"></div>
                  {cliente.estado}
                </div>                <div className="cliente-contacto-info">
                  <div className="contacto-item">
                    <Mail size={16} />
                    <span>{cliente.contacto?.correo}</span>
                  </div>
                  <div className="contacto-item">
                    <Phone size={16} />
                    <span>{cliente.contacto?.telefono}</span>
                  </div>
                  <div className="contacto-item">
                    <MapPin size={16} />
                    <span>{cliente.contacto?.direccion || 'Dirección no disponible'}</span>
                  </div>                  <div className="contacto-item">
                    <Calendar size={16} />
                    <span>{cliente.clienteDesde || 'Cliente desde fecha no disponible'}</span>
                  </div>
                  
                  <button 
                    className='btn-contactar'
                    onClick={handleContactarCliente}
                    title="Contactar por WhatsApp"
                  >
                    <MessageCircle size={16} />
                    Contactar por WhatsApp
                  </button>

                </div>
              </div>

              {/* Sección de Estadísticas - Separada con espacio */}
              <div className="cliente-perfil-column estadisticas-column">
                <div className="column-header">
                  <Star size={18} />
                  <h3>Estadísticas</h3>
                </div>
                
                <div className="estadisticas-grid">
                  <div className="estadistica-card">
                    <div className="estadistica-icono">
                      <i className="box-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 8V21H3V8"></path>
                          <path d="M1 3H23V8H1V3Z"></path>
                          <path d="M10 12H14V17H10V12Z"></path>
                        </svg>
                      </i>
                    </div>
                    <div className="estadistica-valor">{estadisticas.totalPedidos}</div>
                    <div className="estadistica-etiqueta">Pedidos</div>
                  </div>

                  <div className="estadistica-card">
                    <div className="estadistica-icono dinero-icono">
                      <i className="money-icon">$</i>
                    </div>
                    <div className="estadistica-valor dinero-valor">{estadisticas.totalGastado}</div>
                    <div className="estadistica-etiqueta">Total Gastado</div>
                  </div>                  <div className="estadistica-card">
                    <div className="estadistica-icono comentarios-icono">
                      <i className="comment-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"></path>
                        </svg>
                      </i>
                    </div>
                    <div className="estadistica-valor">{comentariosState.length}</div>
                    <div className="estadistica-etiqueta">Comentarios</div>
                  </div>
                </div>

                <div className="valoracion-promedio">
                  <div className="valoracion-promedio-texto">Valoración Promedio</div>
                  <div className="valoracion-promedio-valor">
                    {cliente.valoracion || 'N/A'} {cliente.valoracion && <Star size={20} fill="currentColor" className="valoracion-estrella-grande" />}
                  </div>
                </div>

                <div className="ultimo-pedido-info">
                  <div className="ultimo-pedido-texto">Último Pedido</div>
                  <div className="ultimo-pedido-fecha">{cliente.ultimoPedido || 'No hay pedidos'}</div>
                </div>
              </div>
            </div>            {/* Columna derecha - Comentarios */}
            <div className="cliente-perfil-column">
              <div className="column-header">
                <CheckCircle size={18} />
                <h3>Comentarios y Reseñas ({comentariosState.length})</h3>
              </div>

              <div className="comentarios-container">
                {comentariosState.length === 0 ? (
                  <div className="no-comentarios">
                    <p>Este cliente aún no ha dejado comentarios.</p>
                  </div>
                ) : (
                  comentariosState.map(comentario => (
                    <div key={comentario.id} className="comentario-card">
                      <div className="comentario-header">
                        <div className="comentario-order-id">#{comentario.id}</div>
                        <div className="comentario-experiencia">
                          <span>Experiencia</span>
                          <div className="valoracion">
                            <span className="valoracion-numero">{comentario.experiencia}</span>
                            <Star size={16} fill="currentColor" className="valoracion-estrella" />
                          </div>
                        </div>
                        <div className="comentario-fecha">{comentario.fecha}</div>
                      </div>

                      {/* Mostrar información del producto si está disponible */}
                      {comentario.producto && (
                        <div className="comentario-producto">
                          <span>Producto: </span>
                          <strong>{comentario.producto.nombre}</strong>
                        </div>
                      )}

                      <div className="comentario-texto">
                        "{comentario.texto}"
                      </div>                      <div className="comentario-actions">
                        <div className="comentario-estado">
                          <span>Estado:</span>
                          <div className={`badge-${comentario.estado.toLowerCase()}`}>
                            {comentario.estado === 'Aprobado' ? <CheckCircle size={14} /> : 
                             comentario.estado === 'Rechazado' ? <XCircle size={14} /> : 
                             <XCircle size={14} />}
                            {comentario.estado}
                          </div>
                        </div>
                        
                        <div className="comentario-acciones-botones">
                          {comentario.estado !== 'Aprobado' && (
                            <button 
                              className="btn-aprobar"
                              onClick={() => handleApprove(comentario.id)}
                              title="Aprobar comentario"
                            >
                              <CheckCircle size={14} />
                              Aprobar
                            </button>
                          )}
                          {comentario.estado !== 'Rechazado' && (
                            <button 
                              className="btn-rechazar"
                              onClick={() => handleReject(comentario.id)}
                              title="Rechazar comentario"
                            >
                              <XCircle size={14} />
                              Rechazar
                            </button>
                          )}
                        </div>
                        
                        <div className="comentario-visibilidad">
                          <span>Mostrar en tienda:</span>
                          <div className="visibilidad-botones">
                            <button 
                              className={`btn-si ${comentario.mostrarEnTienda ? 'active' : ''}`}
                              onClick={() => handleShowInStore(comentario.id, true)}
                            >
                              <CheckCircle size={14} />
                              SÍ
                            </button>
                            <button 
                              className={`btn-no ${!comentario.mostrarEnTienda ? 'active' : ''}`}
                              onClick={() => handleShowInStore(comentario.id, false)}
                            >
                              <XCircle size={14} />
                              NO
                            </button>
                            <button 
                              className="btn-eliminar"
                              onClick={() => handleDelete(comentario.id)}
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="comentario-status-indicator">
                        {comentario.mostrarEnTienda ? 
                          <span className="status-visible">Visible en la tienda online</span> :
                          <span className="status-oculto">Oculto en la tienda online</span>
                        }
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientePerfilModal;
