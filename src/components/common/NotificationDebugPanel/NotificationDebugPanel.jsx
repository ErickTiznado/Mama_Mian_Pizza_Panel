import React, { useState, useEffect } from 'react';
import { Bell, Wifi, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotification.jsx';
import './NotificationDebugPanel.css';

const NotificationDebugPanel = () => {
    const { 
        notifications,
        noleidas,
        connectionStatus,
        reconnectSSE,
        forceRefresh,
        forceCheck
    } = useNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [testResults, setTestResults] = useState({});

    useEffect(() => {
        setLastUpdate(new Date());
    }, [notifications, noleidas, connectionStatus]);

    const runConnectionTest = async () => {
        setTestResults({ testing: true });
        
        const results = {
            sse_connection: 'testing',
            api_reachable: 'testing',
            notifications_fetch: 'testing',
            timestamp: new Date().toLocaleTimeString()
        };
        
        // Test 1: API reachability
        try {
            const response = await fetch('https://api.mamamianpizza.com/api/notifications/unread', {
                credentials: 'include',
                method: 'GET'
            });
            results.api_reachable = response.ok ? 'success' : 'error';
        } catch (error) {
            results.api_reachable = 'error';
        }

        // Test 2: Force notifications check
        try {
            await forceCheck();
            results.notifications_fetch = 'success';
        } catch (error) {
            results.notifications_fetch = 'error';
        }

        // Test 3: SSE connection status
        results.sse_connection = connectionStatus === 'connected' ? 'success' : 'error';

        setTestResults(results);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle size={16} className="status-success" />;
            case 'error': return <AlertTriangle size={16} className="status-error" />;
            case 'testing': return <Clock size={16} className="status-testing" />;
            default: return <Clock size={16} className="status-unknown" />;
        }
    };

    return (
        <div className="notification-debug-panel">
            <button 
                className="debug-toggle"
                onClick={() => setIsOpen(!isOpen)}
                title="Panel de debug de notificaciones"
            >
                <Bell size={16} />
                Debug
            </button>

            {isOpen && (
                <div className="debug-content">
                    <div className="debug-header">
                        <h4>Debug Panel - Notificaciones</h4>
                        <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
                    </div>

                    <div className="debug-stats">
                        <div className="stat-item">
                            <span className="stat-label">Estado Conexión:</span>
                            <span className={`stat-value status-${connectionStatus}`}>
                                {connectionStatus}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">No Leídas:</span>
                            <span className="stat-value">{noleidas}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Cargadas:</span>
                            <span className="stat-value">{notifications.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Última Actualización:</span>
                            <span className="stat-value">{lastUpdate.toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <div className="debug-actions">
                        <button onClick={forceRefresh} className="action-btn refresh">
                            <RefreshCw size={14} />
                            Forzar Refresh
                        </button>
                        <button onClick={reconnectSSE} className="action-btn reconnect">
                            <Wifi size={14} />
                            Reconectar SSE
                        </button>
                        <button onClick={runConnectionTest} className="action-btn test">
                            <CheckCircle size={14} />
                            Test Conexión
                        </button>
                    </div>

                    {Object.keys(testResults).length > 0 && (
                        <div className="test-results">
                            <h5>Resultados de Test</h5>
                            <div className="test-list">
                                <div className="test-item">
                                    {getStatusIcon(testResults.api_reachable)}
                                    <span>API Accesible</span>
                                </div>
                                <div className="test-item">
                                    {getStatusIcon(testResults.sse_connection)}
                                    <span>Conexión SSE</span>
                                </div>
                                <div className="test-item">
                                    {getStatusIcon(testResults.notifications_fetch)}
                                    <span>Fetch Notificaciones</span>
                                </div>
                                {testResults.timestamp && (
                                    <div className="test-timestamp">
                                        Ejecutado: {testResults.timestamp}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="recent-notifications">
                        <h5>Últimas 3 Notificaciones</h5>
                        {notifications.slice(0, 3).map((notif, index) => (
                            <div key={index} className="notif-item">
                                <div className="notif-title">{notif.formattedTitle || notif.titulo}</div>
                                <div className="notif-time">
                                    {new Date(notif.timestamp || notif.fecha_emision).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="no-notifications">Sin notificaciones</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDebugPanel;
