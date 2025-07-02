import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotification.jsx';
import './ForceNotificationButton.css';

const ForceNotificationButton = () => {
    const { forceRefresh } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    const handleForceRefresh = async () => {
        setIsLoading(true);
        try {
            await forceRefresh();
            console.log('🔄 Forzado refrescar notificaciones manualmente');
        } catch (error) {
            console.error('Error al forzar refresh:', error);
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    return (
        <button 
            className="force-notification-btn"
            onClick={handleForceRefresh}
            disabled={isLoading}
            title="Forzar carga de notificaciones"
        >
            <RefreshCw 
                size={16} 
                className={isLoading ? 'spinning' : ''} 
            />
            <span>Forzar carga</span>
        </button>
    );
};

export default ForceNotificationButton;
