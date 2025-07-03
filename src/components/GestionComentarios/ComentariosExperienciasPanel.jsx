import React, { useState, useEffect } from 'react';
import './ComentariosExperienciasPanel.css';
import { Star, CheckCircle, XCircle, Trash2, User, Award, MessageCircle, AlertCircle } from 'lucide-react';
import { getAllExperiencias, updateExperienciaApproval, deleteExperiencia } from '../../services/ExperienciasService';
import { getAllResenas, updateResenaApproval, deleteResena } from '../../services/ResenasService';

/**
 * Panel simplificado de gestión de comentarios y experiencias
 */
const ComentariosExperienciasPanel = () => {
  // Estados para los datos
  const [experiencias, setExperiencias] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  
  // Estados para carga y errores
  const [cargandoExperiencias, setCargandoExperiencias] = useState(false);
  const [cargandoComentarios, setCargandoComentarios] = useState(false);
  const [errorExperiencias, setErrorExperiencias] = useState(null);
  const [errorComentarios, setErrorComentarios] = useState(null);
  
  // Estados para filtros y paginación
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [tipoContenido, setTipoContenido] = useState('ambos');
  const [ordenacion, setOrdenacion] = useState('fecha-desc');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  // Constantes
  const ITEMS_PER_PAGE = 10;
  const API_URL = 'https://api.mamamianpizza.com';

  // Cargar datos cuando el componente se monta o cambian los filtros
  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroActivo, tipoContenido]);

  // Efecto para recalcular paginación cuando cambian los datos
  useEffect(() => {
    const itemsFiltrados = obtenerItemsFiltrados();
    setTotalPaginas(Math.ceil(itemsFiltrados.length / ITEMS_PER_PAGE));
    // Resetear a la primera página cuando cambian los filtros
    setPaginaActual(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiencias, comentarios, filtroActivo, tipoContenido, ordenacion]);

  // Función para cargar todos los datos necesarios
  const cargarDatos = async () => {
    if (tipoContenido === 'ambos' || tipoContenido === 'experiencias') {
      await cargarExperiencias();
    }
    
    if (tipoContenido === 'ambos' || tipoContenido === 'comentarios') {
      await cargarComentarios();
    }
  };

  // Función para cargar experiencias desde la API
  const cargarExperiencias = async () => {
    setCargandoExperiencias(true);
    setErrorExperiencias(null);
    
    try {
      const respuesta = await getAllExperiencias();
      
      // Normalizar los datos de experiencias para tener un formato consistente
      const experienciasNormalizadas = (respuesta.experiencias || []).map(experiencia => {
        // Determinar el estado basado en el campo aprobado
        let estado, aprobado;
        if (experiencia.aprobado === 1 || experiencia.aprobado === true) {
          estado = 'aprobado';
          aprobado = true;
        } else if (experiencia.aprobado === 0 || experiencia.aprobado === false) {
          estado = experiencia.rechazado ? 'rechazado' : 'pendiente';
          aprobado = false;
        } else {
          estado = 'pendiente';
          aprobado = false;
        }
        
        return {
          ...experiencia,
          aprobado: aprobado,
          estado: estado
        };
      });
      
      // Ordenar primero por pendientes y luego por fecha más reciente
      const experienciasOrdenadas = ordenarPorPrioridad(experienciasNormalizadas);
      setExperiencias(experienciasOrdenadas);
    } catch (error) {
      console.error('Error al cargar experiencias:', error);
      setErrorExperiencias('No se pudieron cargar las experiencias');
      setExperiencias([]);
    } finally {
      setCargandoExperiencias(false);
    }
  };

  // Función para cargar comentarios desde la API
  const cargarComentarios = async () => {
    setCargandoComentarios(true);
    setErrorComentarios(null);
    
    try {
      // Usamos el servicio de reseñas para los comentarios
      const data = await getAllResenas();
      
      // Transformar los datos para tener un formato consistente
      const comentariosFormateados = (data.resenas || []).map(comentario => {
        // Determinar el estado basado en el campo aprobada
        let estado, aprobado;
        if (comentario.aprobada === 1) {
          estado = 'aprobado';
          aprobado = true;
        } else if (comentario.aprobada === 0) {
          estado = 'rechazado';
          aprobado = false;
        } else {
          estado = 'pendiente';
          aprobado = false;
        }
        
        return {
          id: comentario.id,
          texto: comentario.comentario,
          fecha: comentario.fecha,
          valoracion: comentario.valoracion,
          aprobado: aprobado,
          estado: estado,
          usuario: {
            id: comentario.id_usuario,
            nombre: comentario.nombre_usuario || 'Usuario',
            foto_perfil: comentario.foto_perfil
          },
          producto: comentario.producto,
          mostrarEnTienda: comentario.mostrarEnTienda !== undefined ? comentario.mostrarEnTienda : true
        };
      });
      
      // Ordenar primero por pendientes y luego por fecha más reciente
      const comentariosOrdenados = ordenarPorPrioridad(comentariosFormateados);
      setComentarios(comentariosOrdenados);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setErrorComentarios('No se pudieron cargar los comentarios');
      setComentarios([]);
    } finally {
      setCargandoComentarios(false);
    }
  };
  
  // Función para ordenar elementos priorizando pendientes
  const ordenarPorPrioridad = (items) => {
    return [...items].sort((a, b) => {
      // Primero, priorizar los pendientes
      if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
      if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;
      
      // Si ambos tienen el mismo estado de aprobación, ordenar por fecha
      // Asumiendo que la fecha más reciente es mejor
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA; // Orden descendente (más reciente primero)
    });
  };
  
  // Aplicar filtros y ordenación actual
  const obtenerItemsFiltrados = () => {
    let items = [];
    
    // Combinar ambos tipos de contenido si es necesario
    if (tipoContenido === 'ambos') {
      // Añadir un campo tipo para diferenciarlos al renderizar
      const experienciasConTipo = experiencias.map(exp => ({ ...exp, tipo: 'experiencia' }));
      const comentariosConTipo = comentarios.map(com => ({ ...com, tipo: 'comentario' }));
      items = [...experienciasConTipo, ...comentariosConTipo];
    } else if (tipoContenido === 'experiencias') {
      items = experiencias.map(exp => ({ ...exp, tipo: 'experiencia' }));
    } else {
      items = comentarios.map(com => ({ ...com, tipo: 'comentario' }));
    }
    
    // Aplicar filtro por estado
    if (filtroActivo !== 'todos') {
      if (filtroActivo === 'pendientes') {
        items = items.filter(item => item.estado === 'pendiente');
      } else if (filtroActivo === 'aprobados') {
        items = items.filter(item => item.estado === 'aprobado');
      } else if (filtroActivo === 'rechazados') {
        items = items.filter(item => item.estado === 'rechazado');
      }
    }
    
    // Aplicar ordenación
    items = ordenarItems(items);
    
    return items;
  };
  
  // Función para ordenar los elementos según el criterio seleccionado
  const ordenarItems = (items) => {
    return [...items].sort((a, b) => {
      switch (ordenacion) {
        case 'fecha-desc':
          return new Date(b.fecha) - new Date(a.fecha);
        case 'fecha-asc':
          return new Date(a.fecha) - new Date(b.fecha);
        case 'valoracion-desc':
          return b.valoracion - a.valoracion;
        case 'valoracion-asc':
          return a.valoracion - b.valoracion;
        default:
          return 0;
      }
    });
  };
  
  // Obtener elementos para la página actual
  const obtenerItemsPaginaActual = () => {
    const itemsFiltrados = obtenerItemsFiltrados();
    const inicio = (paginaActual - 1) * ITEMS_PER_PAGE;
    const fin = inicio + ITEMS_PER_PAGE;
    return itemsFiltrados.slice(inicio, fin);
  };
  
  // Manejar aprobación o rechazo de experiencias
  const handleExperienciaApproval = async (idExperiencia, aprobado) => {
    try {
      await updateExperienciaApproval(idExperiencia, aprobado);
      // Actualizar el estado local
      setExperiencias(prevExperiencias => 
        prevExperiencias.map(exp => 
          exp.id_experiencia === idExperiencia 
            ? { 
                ...exp, 
                aprobado: aprobado, 
                estado: aprobado ? 'aprobado' : 'rechazado' 
              }
            : exp
        )
      );
    } catch (error) {
      console.error(`Error al ${aprobado ? 'aprobar' : 'rechazar'} la experiencia:`, error);
      alert(`Error al ${aprobado ? 'aprobar' : 'rechazar'} la experiencia. Por favor, intenta nuevamente.`);
    }
  };
  
  // Manejar eliminación de experiencias
  const handleDeleteExperiencia = async (idExperiencia) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia? Esta acción no se puede deshacer.')) {
      try {
        await deleteExperiencia(idExperiencia);
        // Eliminar del estado local
        setExperiencias(prevExperiencias => 
          prevExperiencias.filter(exp => exp.id_experiencia !== idExperiencia)
        );
      } catch (error) {
        console.error('Error al eliminar la experiencia:', error);
        alert('Error al eliminar la experiencia. Por favor, intenta nuevamente.');
      }
    }
  };
  
  // Manejar aprobación o rechazo de comentarios
  const handleComentarioApproval = async (id, aprobado) => {
    try {
      // Llamada al servicio para cambiar el estado de aprobación
      await updateResenaApproval(id, aprobado);
      
      // Actualizar el estado local
      setComentarios(prevComentarios => 
        prevComentarios.map(comentario => 
          comentario.id === id 
            ? { 
                ...comentario, 
                aprobado: aprobado,
                estado: aprobado ? 'aprobado' : 'rechazado' 
              }
            : comentario
        )
      );
    } catch (error) {
      console.error(`Error al ${aprobado ? 'aprobar' : 'rechazar'} comentario:`, error);
      alert(`Error al ${aprobado ? 'aprobar' : 'rechazar'} el comentario. Por favor, intenta nuevamente.`);
    }
  };
  
  // Manejar eliminación de comentarios
  const handleDeleteComentario = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.')) {
      try {
        // Llamada al servicio para eliminar la reseña
        await deleteResena(id);
        
        // Actualizar el estado local
        setComentarios(prevComentarios => prevComentarios.filter(comentario => comentario.id !== id));
      } catch (error) {
        console.error('Error al eliminar comentario:', error);
        alert('Error al eliminar el comentario. Por favor, intenta nuevamente.');
      }
    }
  };

  // Renderizar cada elemento (comentario o experiencia)
  const renderItem = (item) => {
    if (item.tipo === 'experiencia') {
      return renderExperiencia(item);
    } else {
      return renderComentario(item);
    }
  };
  
  // Renderizar una experiencia
  const renderExperiencia = (experiencia) => (
    <div 
      key={`exp-${experiencia.id_experiencia}`} 
      className={`panel-item experiencia-card ${experiencia.estado === 'pendiente' ? 'pendiente-item' : ''}`}
    >
      <div className="panel-item-header">
        <div className="panel-item-tipo">
          <Award size={16} />
          <span>Experiencia</span>
        </div>
        <div className="panel-item-id">#{experiencia.id_experiencia}</div>
        <div className="panel-item-valoracion">
          <span>{experiencia.valoracion}</span>
          <Star size={16} fill="currentColor" />
        </div>
        <div className={`panel-item-estado ${experiencia.estado === 'aprobado' ? 'estado-aprobado' : experiencia.estado === 'rechazado' ? 'estado-rechazado' : 'estado-pendiente'}`}>
          {experiencia.estado === 'aprobado' ? 
            <CheckCircle size={14} /> : 
            experiencia.estado === 'rechazado' ?
            <XCircle size={14} /> :
            <AlertCircle size={14} />
          }
          <span>{experiencia.estado === 'aprobado' ? 'Aprobado' : experiencia.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}</span>
        </div>
      </div>
      
      <div className="panel-item-titulo">
        {experiencia.titulo}
      </div>
      
      <div className="panel-item-contenido">
        "{experiencia.contenido}"
      </div>
      
      <div className="panel-item-usuario">
        <User size={14} />
        <span>{experiencia.usuario?.nombre || 'Usuario anónimo'}</span>
      </div>
      
      <div className="panel-item-acciones">
        {experiencia.estado !== 'aprobado' && (
          <button 
            className="btn-aprobar"
            onClick={() => handleExperienciaApproval(experiencia.id_experiencia, true)}
          >
            <CheckCircle size={14} />
            Aprobar
          </button>
        )}
        {experiencia.estado !== 'rechazado' && experiencia.estado !== 'pendiente' && (
          <button 
            className="btn-rechazar"
            onClick={() => handleExperienciaApproval(experiencia.id_experiencia, false)}
          >
            <XCircle size={14} />
            Rechazar
          </button>
        )}
        <button 
          className="btn-eliminar"
          onClick={() => handleDeleteExperiencia(experiencia.id_experiencia)}
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );
  
  // Renderizar un comentario
  const renderComentario = (comentario) => (
    <div 
      key={`com-${comentario.id}`} 
      className={`panel-item comentario-card ${comentario.estado === 'pendiente' ? 'pendiente-item' : ''}`}
    >
      <div className="panel-item-header">
        <div className="panel-item-tipo">
          <MessageCircle size={16} />
          <span>Comentario</span>
        </div>
        <div className="panel-item-id">#{comentario.id}</div>
        <div className="panel-item-valoracion">
          <span>{comentario.valoracion}</span>
          <Star size={16} fill="currentColor" />
        </div>
        <div className={`panel-item-estado ${comentario.estado === 'aprobado' ? 'estado-aprobado' : comentario.estado === 'rechazado' ? 'estado-rechazado' : 'estado-pendiente'}`}>
          {comentario.estado === 'aprobado' ? 
            <CheckCircle size={14} /> : 
            comentario.estado === 'rechazado' ?
            <XCircle size={14} /> :
            <AlertCircle size={14} />
          }
          <span>{comentario.estado === 'aprobado' ? 'Aprobado' : comentario.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}</span>
        </div>
      </div>
      
      <div className="panel-item-contenido">
        "{comentario.texto}"
      </div>
      
      {comentario.producto && (
        <div className="panel-item-producto">
          <span>Producto: </span>
          <strong>{comentario.producto.nombre}</strong>
        </div>
      )}
      
      <div className="panel-item-usuario">
        <User size={14} />
        <span>{comentario.usuario?.nombre || 'Usuario anónimo'}</span>
      </div>
      
      <div className="panel-item-acciones">
        {comentario.estado !== 'aprobado' && (
          <button 
            className="btn-aprobar"
            onClick={() => handleComentarioApproval(comentario.id, true)}
          >
            <CheckCircle size={14} />
            Aprobar
          </button>
        )}
        {comentario.estado !== 'rechazado' && comentario.estado !== 'pendiente' && (
          <button 
            className="btn-rechazar"
            onClick={() => handleComentarioApproval(comentario.id, false)}
          >
            <XCircle size={14} />
            Rechazar
          </button>
        )}
        <button 
          className="btn-eliminar"
          onClick={() => handleDeleteComentario(comentario.id)}
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );

  // Contar items pendientes
  const contarPendientes = () => {
    const experienciasPendientes = experiencias.filter(exp => exp.estado === 'pendiente').length;
    const comentariosPendientes = comentarios.filter(com => com.estado === 'pendiente').length;
    return experienciasPendientes + comentariosPendientes;
  };
  
  // Elementos para renderizar
  const itemsActuales = obtenerItemsPaginaActual();
  const totalPendientes = contarPendientes();

  return (
    <div className="comentarios-experiencias-panel">
      {/* Banner de alerta para elementos pendientes */}
      {totalPendientes > 0 && (
        <div className="pendientes-alert-banner">
          <AlertCircle size={20} />
          <div className="alert-content">
            <strong>¡Elementos pendientes de revisión!</strong>
            <span>
              Hay {totalPendientes} {totalPendientes === 1 ? 'elemento' : 'elementos'} que requieren tu atención.
            </span>
          </div>
        </div>
      )}
      
      <div className="panel-filtros">
        <div className="filtro-grupo">
          <span>Estado:</span>
          <div className="filtro-botones">
            <button 
              className={filtroActivo === 'todos' ? 'active' : ''} 
              onClick={() => setFiltroActivo('todos')}
            >
              Todos
            </button>
            <button 
              className={filtroActivo === 'pendientes' ? 'active' : ''} 
              onClick={() => setFiltroActivo('pendientes')}
            >
              Pendientes
            </button>
            <button 
              className={filtroActivo === 'aprobados' ? 'active' : ''} 
              onClick={() => setFiltroActivo('aprobados')}
            >
              Aprobados
            </button>
            <button 
              className={filtroActivo === 'rechazados' ? 'active' : ''} 
              onClick={() => setFiltroActivo('rechazados')}
            >
              Rechazados
            </button>
          </div>
        </div>
        
        <div className="filtro-grupo">
          <span>Tipo:</span>
          <div className="filtro-botones">
            <button 
              className={tipoContenido === 'ambos' ? 'active' : ''} 
              onClick={() => setTipoContenido('ambos')}
            >
              Todos
            </button>
            <button 
              className={tipoContenido === 'comentarios' ? 'active' : ''} 
              onClick={() => setTipoContenido('comentarios')}
            >
              Comentarios
            </button>
            <button 
              className={tipoContenido === 'experiencias' ? 'active' : ''} 
              onClick={() => setTipoContenido('experiencias')}
            >
              Experiencias
            </button>
          </div>
        </div>
        
        <div className="filtro-grupo">
          <span>Ordenar por:</span>
          <select 
            value={ordenacion} 
            onChange={(e) => setOrdenacion(e.target.value)}
            className="ordenacion-select"
          >
            <option value="fecha-desc">Más recientes primero</option>
            <option value="fecha-asc">Más antiguos primero</option>
            <option value="valoracion-desc">Mayor valoración</option>
            <option value="valoracion-asc">Menor valoración</option>
          </select>
        </div>
        
        <button 
          className="btn-refrescar" 
          onClick={cargarDatos}
          disabled={cargandoExperiencias || cargandoComentarios}
        >
          {cargandoExperiencias || cargandoComentarios ? 'Cargando...' : 'Refrescar'}
        </button>
      </div>
      
      <div className="panel-contenido">
        {(cargandoExperiencias || cargandoComentarios) ? (
          <div className="panel-cargando">Cargando contenido...</div>
        ) : (errorExperiencias || errorComentarios) ? (
          <div className="panel-error">
            {errorExperiencias && <p>{errorExperiencias}</p>}
            {errorComentarios && <p>{errorComentarios}</p>}
          </div>
        ) : itemsActuales.length === 0 ? (
          <div className="panel-vacio">
            <p>No hay contenido que mostrar con los filtros actuales.</p>
          </div>
        ) : (
          <div className="panel-items">
            {itemsActuales.map(renderItem)}
          </div>
        )}
      </div>
      
      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="panel-paginacion">
          <button 
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="btn-pagina"
          >
            Anterior
          </button>
          
          <div className="pagina-info">
            Página {paginaActual} de {totalPaginas}
          </div>
          
          <button 
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="btn-pagina"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ComentariosExperienciasPanel;
