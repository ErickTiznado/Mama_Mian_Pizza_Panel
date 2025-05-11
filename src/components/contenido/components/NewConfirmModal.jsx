import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './NewConfirmModal.css';

// Este componente utiliza un enfoque diferente para garantizar que el modal esté encima de todo
const NewConfirmModal = ({ 
  modalConfirmacion, 
  cancelarEliminacion, 
  confirmarEliminacion, 
  isSubmitting 
}) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const modalContainerRef = useRef(null);

  // Crear y gestionar el elemento del modal
  useEffect(() => {
    if (!modalConfirmacion.visible) return;

    // Crear contenedor si no existe
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }

    // Bloquear el desplazamiento del body
    document.body.style.overflow = 'hidden';
    
    // Al limpiar
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalConfirmacion.visible]);

  // Control de teclas
  useEffect(() => {
    if (!modalConfirmacion.visible) return;
    
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        cancelarEliminacion();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [modalConfirmacion.visible, isSubmitting, cancelarEliminacion]);

  // Si no es visible, no renderizar nada
  if (!modalConfirmacion.visible) return null;

  return (
    <div id="modal-container" ref={modalContainerRef} className="new-modal-container">
      <div 
        ref={overlayRef}
        className="new-modal-overlay" 
        onClick={!isSubmitting ? cancelarEliminacion : undefined}
      />
      <div 
        ref={modalRef}
        className="new-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="new-modal-header">
          <h3>
            <FontAwesomeIcon icon={faTrashAlt} /> Confirmar eliminación
          </h3>
        </div>
        <div className="new-modal-body">
          <p>¿Estás seguro de que deseas eliminar el siguiente producto del menú?</p>
          <div className="new-modal-producto">{modalConfirmacion.nombreProducto}</div>
          <p><strong>Atención:</strong> Esta acción no se puede deshacer y eliminará permanentemente este producto.</p>
        </div>
        <div className="new-modal-actions">
          <button 
            className="new-btn-cancelar-modal" 
            onClick={cancelarEliminacion}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            className="new-btn-confirmar-eliminar" 
            onClick={confirmarEliminacion}
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? 'Eliminando...' : 'Eliminar producto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewConfirmModal;