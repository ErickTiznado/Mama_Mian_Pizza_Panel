import React, { useState } from 'react';
import { Bell, BellOff, Check, X, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotification.jsx';
import './PushNotificationSettings.css';

const PushNotificationSettings = () => {
    const { 
        enablePushNotifications, 
        canShowNotifications, 
        pushPermission, 
        isPushSupported 
    } = useNotifications();
    
    const [isEnabling, setIsEnabling] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleEnableNotifications = async () => {
        setIsEnabling(true);
        try {
            const granted = await enablePushNotifications();
            if (granted) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error enabling notifications:', error);
        } finally {
            setIsEnabling(false);
        }
    };

    const getStatusInfo = () => {
        if (!isPushSupported) {
            return {
                status: 'not-supported',
                icon: X,
                text: 'Tu navegador no soporta notificaciones push',
                color: '#f44336',
                action: null
            };
        }

        switch (pushPermission) {
            case 'granted':
                return {
                    status: 'enabled',
                    icon: Check,
                    text: 'Notificaciones push habilitadas',
                    color: '#4caf50',
                    action: null
                };
            case 'denied':
                return {
                    status: 'denied',
                    icon: X,
                    text: 'Notificaciones bloqueadas. Habilítalas en la configuración del navegador',
                    color: '#f44336',
                    action: null
                };
            default:
                return {
                    status: 'default',
                    icon: Bell,
                    text: 'Habilitar notificaciones push para recibir alertas aunque no estés en la pestaña',
                    color: '#2196f3',
                    action: handleEnableNotifications
                };
        }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    return (
        <div className="push-notification-settings">
            <div className="push-notification-header">
                <Bell size={24} />
                <h3>Notificaciones Push</h3>
            </div>
            
            <div className="push-notification-content">
                <div className="status-indicator" style={{ color: statusInfo.color }}>
                    <StatusIcon size={20} />
                    <span>{statusInfo.text}</span>
                </div>

                {showSuccess && (
                    <div className="success-message">
                        <Check size={16} />
                        ¡Notificaciones push habilitadas correctamente!
                    </div>
                )}

                {statusInfo.action && (
                    <button
                        className="enable-button"
                        onClick={statusInfo.action}
                        disabled={isEnabling}
                    >
                        {isEnabling ? (
                            <>
                                <div className="spinner"></div>
                                Habilitando...
                            </>
                        ) : (
                            <>
                                <Bell size={16} />
                                Habilitar Notificaciones
                            </>
                        )}
                    </button>
                )}

                <div className="push-notification-info">
                    <AlertCircle size={16} />
                    <div>
                        <p><strong>¿Qué son las notificaciones push?</strong></p>
                        <ul>
                            <li>Recibirás alertas de nuevos pedidos incluso si no estás en la pestaña</li>
                            <li>Te notificaremos sobre cambios importantes en el inventario</li>
                            <li>Manténte informado sobre la actividad de clientes</li>
                            <li>Puedes deshabilitarlas en cualquier momento desde tu navegador</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PushNotificationSettings;
