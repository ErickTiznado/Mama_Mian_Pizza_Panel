import React, { useState, useEffect } from 'react';
import InventoryTabs from './InventoryTabs';
import InventoryService from '../../services/InventoryService';
import { AlertTriangle } from 'lucide-react';
import './Inventario.css';

const Inventario = () => {
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar productos próximos a vencer al cargar el componente
  useEffect(() => {
    const checkExpiryDates = async () => {
      try {
        setLoading(true);
        
        // Usar el nuevo método especializado para verificar productos que vencen pronto
        const expiryOnly = await InventoryService.checkExpiringProducts(7);
        setExpiryAlerts(expiryOnly);
        
        // Registrar información para depuración
        if (expiryOnly.length > 0) {
          console.info(`[Inventario] Se encontraron ${expiryOnly.length} productos próximos a vencer o vencidos`);
          console.info(`[Inventario] Productos críticos: ${expiryOnly.filter(a => a.type === 'critical').length}`);
        }
        
      } catch (err) {
        console.error('Error checking expiry dates:', err);
        setError(err.message || 'Error al verificar fechas de caducidad');
      } finally {
        setLoading(false);
      }
    };

    checkExpiryDates();
    
    // Configurar una verificación periódica de fechas de caducidad (cada 24 horas)
    const checkInterval = setInterval(checkExpiryDates, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(checkInterval);
  }, []);

  return (
    <div className="inventario-container">
      {/* Mostrar banners de alertas de caducidad según la situación */}
      {!loading && expiryAlerts.length > 0 && (
        <div className={expiryAlerts.some(alert => alert.type === 'critical') 
          ? "expiry-alert-banner" 
          : "expiry-alert-banner warning"}>
          <AlertTriangle size={20} />
          <div className="alert-content">
            <strong>
              {expiryAlerts.some(alert => alert.daysRemaining <= 0) 
                ? '¡Productos vencidos!' 
                : '¡Productos próximos a vencer!'}
            </strong>
            <span>
              {expiryAlerts.some(alert => alert.daysRemaining <= 0) 
                ? `Hay ${expiryAlerts.filter(a => a.daysRemaining <= 0).length} productos vencidos que requieren atención inmediata.` 
                : `Hay ${expiryAlerts.length} productos que vencerán pronto.`
              }
            </span>
          </div>
        </div>
      )}
      
      {/* Cargar el componente principal de inventario */}
      <InventoryTabs initialTab={expiryAlerts.length > 0 ? 'alerts' : 'dashboard'} />
    </div>
  );
};

export default Inventario;
