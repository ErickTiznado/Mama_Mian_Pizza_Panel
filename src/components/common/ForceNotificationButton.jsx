import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotification.jsx';
import './ForceNotificationButton.css';

const ForceNotificationButton = () => {
    const { forceRefresh, forceCheck, connectionStatus } = useNotifications();
    
    const handleForceRefresh = async () => {
        console.log('🚀 BOTÓN: Forzando actualización completa de notificaciones...');
        
        // Ejecutar múltiples métodos de actualización
        await forceRefresh();
        await forceCheck();
        
        // Activar debug mode si está disponible
        if (window.notificationDebug) {
            window.notificationDebug.enableDebug();
        }
        
        console.log('✅ BOTÓN: Actualización forzada completada');
    };
    
    return (
        <div className="force-notification-container">
            <button 
                className={`force-notification-btn ${connectionStatus === 'error' ? 'error' : ''}`}
                onClick={handleForceRefresh}
                title="Forzar carga de notificaciones"
            >
                <RefreshCw className="icon" />
                <Zap className="icon-overlay" />
                <span>Forzar Notificaciones</span>
            </button>
            <div className="connection-indicator">
                <div className={`status-dot ${connectionStatus}`}></div>
                <span className="status-text">{connectionStatus}</span>
            </div>
        </div>
    );
};

export default ForceNotificationButton;
