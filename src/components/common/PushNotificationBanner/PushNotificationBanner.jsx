import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotification.jsx';
import './PushNotificationBanner.css';

const PushNotificationBanner = () => {
    const { enablePushNotifications, canShowNotifications, pushPermission, isPushSupported } = useNotifications();
    const [isVisible, setIsVisible] = useState(false);
    const [isEnabling, setIsEnabling] = useState(false);

    useEffect(() => {
        // Mostrar el banner solo si:
        // 1. Las notificaciones están soportadas
        // 2. No se han concedido permisos aún
        // 3. No se ha mostrado antes (o se ha rechazado anteriormente)
        const hasShownBanner = localStorage.getItem('pushNotificationBannerShown');
        
        if (isPushSupported && pushPermission === 'default' && !hasShownBanner) {
            // Mostrar después de 3 segundos para no ser intrusivo
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [isPushSupported, pushPermission]);

    const handleEnable = async () => {
        setIsEnabling(true);
        try {
            const granted = await enablePushNotifications();
            if (granted) {
                setIsVisible(false);
                localStorage.setItem('pushNotificationBannerShown', 'true');
            }
        } catch (error) {
            console.error('Error enabling push notifications:', error);
        } finally {
            setIsEnabling(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pushNotificationBannerShown', 'true');
    };

    // No mostrar si ya están habilitadas o no están soportadas
    if (!isVisible || canShowNotifications || !isPushSupported) {
        return null;
    }

    return (
        <div className="push-notification-banner">
            <div className="push-banner-content">
                <div className="push-banner-icon">
                    <Bell size={24} />
                </div>
                <div className="push-banner-text">
                    <h4>¡Mantente informado!</h4>
                    <p>Habilita las notificaciones para recibir alertas de nuevos pedidos y actualizaciones importantes, incluso cuando no estés en esta pestaña.</p>
                </div>
                <div className="push-banner-actions">
                    <button
                        className="push-banner-button push-banner-button--accept"
                        onClick={handleEnable}
                        disabled={isEnabling}
                    >
                        {isEnabling ? (
                            <>
                                <div className="spinner-small"></div>
                                Habilitando...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                Habilitar
                            </>
                        )}
                    </button>
                    <button
                        className="push-banner-button push-banner-button--dismiss"
                        onClick={handleDismiss}
                    >
                        <X size={16} />
                        No ahora
                    </button>
                </div>
            </div>
            <button
                className="push-banner-close"
                onClick={handleDismiss}
                aria-label="Cerrar"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default PushNotificationBanner;
