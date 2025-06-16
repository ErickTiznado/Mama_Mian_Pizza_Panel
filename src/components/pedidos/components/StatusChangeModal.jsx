import React from 'react';
import {
  FaPlay,
  FaTruck,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import './StatusChangeModal.css';

const StatusChangeModal = ({
  show,
  onClose,
  onConfirm,
  order,
  newStatus,
  currentStatus
}) => {
  if (!show) return null;

  const getStatusInfo = (status) => {
    const statusMap = {
      'en proceso': {
        name: 'En Proceso',
        icon: <FaPlay className="status-modal-icon" />,
        color: '#2563eb',
        description: 'El pedido comenzará a prepararse'
      },
      'en camino': {
        name: 'En Camino',
        icon: <FaTruck className="status-modal-icon" />,
        color: '#d97706',
        description: 'El pedido será enviado al cliente'
      },
      'entregado': {
        name: 'Entregado',
        icon: <FaCheck className="status-modal-icon" />,
        color: '#22c55e',
        description: 'El pedido se marcará como completado'
      },
      'cancelado': {
        name: 'Cancelado',
        icon: <FaTimes className="status-modal-icon" />,
        color: '#dc2626',
        description: 'El pedido será cancelado'
      }
    };
    return statusMap[status] || { name: status, icon: <FaInfoCircle />, color: '#6b7280' };
  };

  const statusInfo = getStatusInfo(newStatus);
  const currentStatusInfo = getStatusInfo(currentStatus);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="status-modal-overlay" onClick={onClose}>
      <div className="status-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal-header">
          <div className="status-modal-title">
            <FaExclamationTriangle className="warning-icon" />
            <h3>Confirmar Cambio de Estado</h3>
          </div>
          <button className="status-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="status-modal-content">
          <div className="order-info">
            <div className="order-code">
              <span className="label">Pedido:</span>
              <span className="value">#{order?.codigo_pedido}</span>
            </div>
            <div className="order-client">
              <span className="label">Cliente:</span>
              <span className="value">{order?.nombre_usuario || order?.nombre_invitado || 'Sin nombre'}</span>
            </div>
          </div>

          <div className="status-change-info">
            <div className="status-transition">
              <div className="status-from">
                <div className="status-indicator" style={{ backgroundColor: currentStatusInfo.color }}>
                  {currentStatusInfo.icon}
                </div>
                <span className="status-name">{currentStatusInfo.name}</span>
              </div>
              
              <div className="status-arrow">→</div>
              
              <div className="status-to">
                <div className="status-indicator" style={{ backgroundColor: statusInfo.color }}>
                  {statusInfo.icon}
                </div>
                <span className="status-name">{statusInfo.name}</span>
              </div>
            </div>

            <div className="status-description">
              <FaInfoCircle className="info-icon" />
              <p>{statusInfo.description}</p>
            </div>
          </div>
        </div>

        <div className="status-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            <FaTimes className="btn-icon" />
            <span>Cancelar</span>
          </button>
          <button 
            className="btn-confirm" 
            onClick={handleConfirm}
            style={{ backgroundColor: statusInfo.color }}
          >
            {statusInfo.icon}
            <span>Confirmar Cambio</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
