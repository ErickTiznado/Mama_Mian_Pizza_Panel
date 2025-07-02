import React from 'react';
import { AlertTriangle, Wifi, X } from 'lucide-react';
import './ConnectionAlert.css';

const ConnectionAlert = ({ 
    show, 
    onRetry, 
    onDismiss, 
    connectionStatus = 'disconnected' 
}) => {
    if (!show) return null;

    const getAlertConfig = () => {
        switch (connectionStatus) {
            case 'disconnected':
                return {
                    icon: Wifi,
                    title: 'Conexión perdida',
                    message: 'Se ha perdido la conexión con el servidor de notificaciones. Las notificaciones pueden no llegar de inmediato.',
                    color: '#f44336'
                };
            case 'error':
                return {
                    icon: AlertTriangle,
                    title: 'Error de conexión',
                    message: 'Error al conectar con el servidor de notificaciones. Reintentando automáticamente...',
                    color: '#ff9800'
                };
            default:
                return {
                    icon: AlertTriangle,
                    title: 'Problema de conexión',
                    message: 'Hay un problema con las notificaciones en tiempo real.',
                    color: '#ff9800'
                };
        }
    };

    const config = getAlertConfig();
    const IconComponent = config.icon;

    return (
        <div className="connection-alert-overlay">
            <div className="connection-alert">
                <div className="alert-header">
                    <div className="alert-icon" style={{ color: config.color }}>
                        <IconComponent size={24} />
                    </div>
                    <div className="alert-content">
                        <h4 className="alert-title">{config.title}</h4>
                        <p className="alert-message">{config.message}</p>
                    </div>
                    <button className="alert-close" onClick={onDismiss}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="alert-actions">
                    <button className="alert-button secondary" onClick={onDismiss}>
                        Cerrar
                    </button>
                    <button className="alert-button primary" onClick={onRetry}>
                        <Wifi size={16} />
                        Reintentar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectionAlert;
