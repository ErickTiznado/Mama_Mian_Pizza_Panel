import React from 'react';
import './CustomAlert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faQuestion, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const CustomAlert = ({ 
  show, 
  type = 'confirm', // 'confirm', 'alert', 'success', 'warning'
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  showCancel = true
}) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'confirm':
        return faQuestion;
      case 'warning':
        return faExclamationTriangle;
      case 'success':
        return faCheck;
      case 'error':
        return faTimes;
      default:
        return faQuestion;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'confirm':
        return '#3498db';
      case 'warning':
        return '#f39c12';
      case 'success':
        return '#27ae60';
      case 'error':
        return '#e74c3c';
      default:
        return '#3498db';
    }
  };

  return (
    <div className="custom-alert-overlay">
      <div className={`custom-alert-modal ${type}`}>
        <div className="custom-alert-header">
          <FontAwesomeIcon 
            icon={getIcon()} 
            className="custom-alert-icon"
            style={{ color: getIconColor() }}
          />
          {title && <h3 className="custom-alert-title">{title}</h3>}
        </div>
        
        <div className="custom-alert-body">
          <p className="custom-alert-message">{message}</p>
        </div>
        
        <div className="custom-alert-footer">
          {showCancel && (
            <button 
              className="custom-alert-btn custom-alert-btn-cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button 
            className="custom-alert-btn custom-alert-btn-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
