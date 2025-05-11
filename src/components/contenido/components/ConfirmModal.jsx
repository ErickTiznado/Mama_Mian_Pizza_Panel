import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  modalConfirmacion, 
  cancelarEliminacion, 
  confirmarEliminacion, 
  isSubmitting 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  
  // Si el modal no está visible, no mostrarlo
  if (!modalConfirmacion.visible && !isClosing) return null;
  
  // Efecto para manejar el escape y el enfoque inicial
  useEffect(() => {
    if (modalConfirmacion.visible) {
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape' && !isSubmitting) {
          handleClose();
        }
      };
      
      // Enfoque al botón de confirmar al abrir el modal
      if (confirmButtonRef.current) {
        confirmButtonRef.current.focus();
      }
      
      // Evitar que el fondo se desplace cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      
      // Agregar listener para la tecla Escape
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        // Limpiar efectos al cerrar el modal
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [modalConfirmacion.visible, isSubmitting]);
  
  // Función para cerrar el modal con animación
  const handleClose = () => {
    if (isSubmitting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      cancelarEliminacion();
    }, 200); // Corresponde con la duración de la animación CSS
  };
  
  // Usar createPortal para renderizar el modal en el nivel superior del DOM
  return createPortal(
    <div 
      className="cont_modal-overlay" 
      onClick={handleClose} 
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`cont_modal-content ${isClosing ? 'cont_modal-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cont_modal-header">
          <h3 id="modal-title">
            <FontAwesomeIcon icon={faTrashAlt} /> Confirmar eliminación
          </h3>
        </div>
        <div className="cont_modal-body">
          <p>¿Estás seguro de que deseas eliminar el siguiente producto del menú?</p>
          <div className="cont_modal-producto">{modalConfirmacion.nombreProducto}</div>
          <p><strong>Atención:</strong> Esta acción no se puede deshacer y eliminará permanentemente este producto.</p>
        </div>
        <div className="cont_modal-actions">
          <button 
            className="cont_btn-cancelar-modal" 
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Cancelar eliminación"
          >
            Cancelar
          </button>
          <button 
            className="cont_btn-confirmar-eliminar" 
            onClick={confirmarEliminacion}
            disabled={isSubmitting}
            ref={confirmButtonRef}
            aria-label="Confirmar eliminación del producto"
          >
            {isSubmitting ? 'Eliminando...' : 'Eliminar producto'}
          </button>
        </div>
      </div>
    </div>,
    document.body // Renderizar directamente en el body del documento
  );
};

export default ConfirmModal;