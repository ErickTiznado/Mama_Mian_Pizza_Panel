import { useState } from 'react';

/**
 * Custom hook para manejar alertas personalizadas
 * Reemplaza window.confirm y window.alert con componentes estilizados
 */
export const useCustomAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: null,
    onCancel: null,
    showCancel: true
  });

  const showCustomAlert = (config) => {
    setAlertConfig({
      type: 'confirm',
      title: '',
      message: '',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      showCancel: true,
      ...config
    });
    setShowAlert(true);
  };

  const hideCustomAlert = () => {
    setShowAlert(false);
    setAlertConfig({
      type: 'confirm',
      title: '',
      message: '',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: null,
      onCancel: null,
      showCancel: true
    });
  };

  /**
   * Muestra un diálogo de confirmación
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título opcional
   * @param {function} onConfirm - Callback cuando se confirma
   * @param {function} onCancel - Callback cuando se cancela
   * @param {string} confirmText - Texto del botón de confirmación
   * @param {string} cancelText - Texto del botón de cancelación
   */
  const confirm = ({ 
    message, 
    title = 'Confirmar acción', 
    onConfirm, 
    onCancel = hideCustomAlert,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'confirm'
  }) => {
    showCustomAlert({
      type,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        hideCustomAlert();
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        hideCustomAlert();
        if (onCancel) onCancel();
      }
    });
  };

  /**
   * Muestra una alerta simple (solo botón OK)
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título opcional
   * @param {function} onClose - Callback cuando se cierra
   * @param {string} type - Tipo de alerta ('success', 'warning', 'error', 'info')
   */
  const alert = ({ 
    message, 
    title = 'Información', 
    onClose = hideCustomAlert,
    type = 'info'
  }) => {
    showCustomAlert({
      type,
      title,
      message,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => {
        hideCustomAlert();
        if (onClose) onClose();
      }
    });
  };

  return {
    showAlert,
    alertConfig,
    showCustomAlert,
    hideCustomAlert,
    confirm,
    alert
  };
};

export default useCustomAlert;
