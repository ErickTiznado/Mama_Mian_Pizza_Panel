import React from 'react';
import { Bell, Check, X, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotification.jsx';
import './NotificationSystemStatus.css';

const NotificationSystemStatus = () => {
    const { 
        canShowNotifications, 
        pushPermission, 
        isPushSupported,
        noleidas,
        connectionStatus,
        reconnectSSE,
        forceRefresh
    } = useNotifications();

    const getSystemStatus = () => {
        if (!isPushSupported) {
            return {
                status: 'unsupported',
                color: '#f44336',
                icon: X,
                title: 'Sistema no compatible',
                description: 'Tu navegador no soporta notificaciones push'
            };
        }

        // Verificar estado de conexión SSE primero
        if (connectionStatus === 'error' || connectionStatus === 'disconnected') {
            return {
                status: 'disconnected',
                color: '#f44336',
                icon: WifiOff,
                title: 'Conexión perdida',
                description: 'Sin conexión con el servidor de notificaciones'
            };
        }

        if (connectionStatus === 'connecting') {
            return {
                status: 'connecting',
                color: '#ff9800',
                icon: Wifi,
                title: 'Conectando...',
                description: 'Estableciendo conexión con el servidor'
            };
        }

        if (canShowNotifications && connectionStatus === 'connected') {
            return {
                status: 'active',
                color: '#4caf50',
                icon: Check,
                title: 'Sistema activo',
                description: 'Las notificaciones están funcionando correctamente'
            };
        }

        if (pushPermission === 'denied') {
            return {
                status: 'blocked',
                color: '#f44336',
                icon: X,
                title: 'Notificaciones bloqueadas',
                description: 'Habilita las notificaciones en la configuración del navegador'
            };
        }

        return {
            status: 'pending',
            color: '#ff9800',
            icon: AlertTriangle,
            title: 'Configuración pendiente',
            description: 'Las notificaciones push no están configuradas'
        };
    };

    const systemStatus = getSystemStatus();
    const StatusIcon = systemStatus.icon;

    return (
        <div className="notification-system-status">
            <div className="status-header">
                <div className="status-icon-container" style={{ background: `${systemStatus.color}20`, border: `1px solid ${systemStatus.color}40` }}>
                    <StatusIcon size={20} style={{ color: systemStatus.color }} />
                </div>
                <div className="status-content">
                    <h4 className="status-title">{systemStatus.title}</h4>
                    <p className="status-description">{systemStatus.description}</p>
                </div>
                {canShowNotifications && noleidas > 0 && (
                    <div className="unread-count">
                        <Bell size={14} />
                        <span>{noleidas}</span>
                    </div>
                )}
            </div>

            <div className="status-indicator">
                <div className={`status-dot ${systemStatus.status}`}></div>
                <span className="status-text">
                    {systemStatus.status === 'active' && 'Conectado'}
                    {systemStatus.status === 'connecting' && 'Conectando...'}
                    {systemStatus.status === 'disconnected' && 'Desconectado'}
                    {systemStatus.status === 'pending' && 'Pendiente'}
                    {systemStatus.status === 'blocked' && 'Bloqueado'}
                    {systemStatus.status === 'unsupported' && 'No soportado'}
                </span>
                <div className="status-actions">
                    {(systemStatus.status === 'disconnected' || systemStatus.status === 'error') && (
                        <button 
                            className="reconnect-button"
                            onClick={reconnectSSE}
                            title="Intentar reconectar"
                        >
                            <Wifi size={14} />
                        </button>
                    )}
                    <button 
                        className="force-refresh-button"
                        onClick={forceRefresh}
                        title="Forzar actualización de notificaciones"
                    >
                        <Bell size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSystemStatus;
