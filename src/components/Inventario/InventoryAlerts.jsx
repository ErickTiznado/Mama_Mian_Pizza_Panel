import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, X, Check, Filter, Clock, Package, TrendingDown, CheckCircle, Lightbulb } from 'lucide-react';
import './InventoryAlerts.css';

const InventoryAlerts = ({ alerts, inventoryData, onDataUpdate }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    if (dismissedAlerts.has(alert.id)) return false;
    if (filterType === 'all') return true;
    return alert.category === filterType;
  });

  // Ordenar alertas
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { 'critical': 3, 'warning': 2, 'info': 1 };
      return (priorityOrder[b.type] || 0) - (priorityOrder[a.type] || 0);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    } else if (sortBy === 'product') {
      return a.product.localeCompare(b.product);
    }
    return 0;
  });

  // Estadísticas de alertas
  const alertStats = {
    total: alerts.length - dismissedAlerts.size,
    critical: alerts.filter(a => a.type === 'critical' && !dismissedAlerts.has(a.id)).length,
    warning: alerts.filter(a => a.type === 'warning' && !dismissedAlerts.has(a.id)).length,
    stock: alerts.filter(a => a.category === 'stock' && !dismissedAlerts.has(a.id)).length,
    expiry: alerts.filter(a => a.category === 'expiry' && !dismissedAlerts.has(a.id)).length
  };

  // Descartar alerta
  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set(prev.add(alertId)));
  };

  // Descartar todas las alertas
  const dismissAllAlerts = () => {
    const allAlertIds = alerts.map(alert => alert.id);
    setDismissedAlerts(new Set(allAlertIds));
  };

  // Obtener icono por tipo de alerta
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle />;
      case 'warning':
        return <AlertCircle />;
      default:
        return <AlertCircle />;
    }
  };

  // Obtener icono por categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'stock':
        return <Package />;
      case 'expiry':
        return <Clock />;
      default:
        return <AlertCircle />;
    }
  };

  // Recomendaciones basadas en alertas
  const getRecommendations = () => {
    const recommendations = [];
    
    if (alertStats.critical > 0) {
      recommendations.push({
        text: "Hay productos con stock crítico. Realiza pedidos urgentes para evitar quedarte sin inventario.",
        icon: <Package />
      });
    }
    
    if (alertStats.expiry > 0) {
      recommendations.push({
        text: "Algunos productos están próximos a vencer. Considera promociones especiales para acelerar su venta.",
        icon: <Clock />
      });
    }
    
    if (alertStats.stock > 5) {
      recommendations.push({
        text: "Múltiples productos requieren reposición. Revisa tu estrategia de pedidos y considera automatizar reórdenes.",
        icon: <TrendingDown />
      });
    }
    
    if (alertStats.total === 0) {
      recommendations.push({
        text: "¡Excelente! Tu inventario está bien gestionado. Mantén este ritmo de monitoreo.",
        icon: <CheckCircle />
      });
    }
    
    return recommendations;
  };

  return (
    <div className="ninv-inventory-alerts">
      {/* Header con título y acciones */}
      <div className="ninv-alerts-header">
        <div className="ninv-alerts-title">
          <AlertTriangle />
          Centro de Alertas
        </div>
        <div className="ninv-header-actions">
          {alertStats.total > 0 && (
            <button 
              className="ninv-btn-dismiss-all"
              onClick={dismissAllAlerts}
            >
              <Check />
              Descartar Todas
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas de alertas */}
      <div className="ninv-alerts-stats">
        <div className="ninv-stat-card total">
          <div className="ninv-stat-icon">
            <AlertTriangle />
          </div>
          <div className="ninv-stat-info">
            <div className="ninv-stat-label">Total Alertas</div>
            <div className="ninv-stat-value">{alertStats.total}</div>
          </div>
        </div>

        <div className="ninv-stat-card critical">
          <div className="ninv-stat-icon">
            <AlertTriangle />
          </div>
          <div className="ninv-stat-info">
            <div className="ninv-stat-label">Críticas</div>
            <div className="ninv-stat-value">{alertStats.critical}</div>
          </div>
        </div>

        <div className="ninv-stat-card warning">
          <div className="ninv-stat-icon">
            <AlertCircle />
          </div>
          <div className="ninv-stat-info">
            <div className="ninv-stat-label">Advertencias</div>
            <div className="ninv-stat-value">{alertStats.warning}</div>
          </div>
        </div>

        <div className="ninv-stat-card stock">
          <div className="ninv-stat-icon">
            <Package />
          </div>
          <div className="ninv-stat-info">
            <div className="ninv-stat-label">Stock Bajo</div>
            <div className="ninv-stat-value">{alertStats.stock}</div>
          </div>
        </div>

        <div className="ninv-stat-card expiry">
          <div className="ninv-stat-icon">
            <Clock />
          </div>
          <div className="ninv-stat-info">
            <div className="ninv-stat-label">Próximos a Vencer</div>
            <div className="ninv-stat-value">{alertStats.expiry}</div>
          </div>
        </div>
      </div>

      {/* Controles de filtros */}
      <div className="ninv-alerts-controls">
        <div className="ninv-filter-group">
          <span className="ninv-filter-label">Filtrar por:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="ninv-filter-select"
          >
            <option value="all">Todas las alertas</option>
            <option value="stock">Stock bajo</option>
            <option value="expiry">Próximos a vencer</option>
          </select>
        </div>

        <div className="ninv-filter-group">
          <span className="ninv-filter-label">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ninv-filter-select"
          >
            <option value="priority">Prioridad</option>
            <option value="category">Categoría</option>
            <option value="product">Producto</option>
          </select>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="ninv-alerts-list">
        {sortedAlerts.length === 0 ? (
          <div className="ninv-alerts-empty">
            <CheckCircle />
            <h3>¡Todo en orden!</h3>
            <p>No hay alertas activas en tu inventario</p>
          </div>
        ) : (
          sortedAlerts.map(alert => (
            <div key={alert.id} className={`ninv-alert-item ${alert.type}`}>
              <div className="ninv-alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="ninv-alert-content">
                <div className="ninv-alert-title">{alert.title || alert.product}</div>
                <div className="ninv-alert-description">{alert.message}</div>
                <div className="ninv-alert-meta">
                  <span className="ninv-alert-product">
                    {getCategoryIcon(alert.category)}
                    {alert.product}
                  </span>
                  <span className="ninv-alert-category">{alert.category}</span>
                </div>
              </div>
              
              <button 
                className="ninv-alert-dismiss"
                onClick={() => dismissAlert(alert.id)}
                title="Descartar alerta"
              >
                <X />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Recomendaciones */}
      <div className="ninv-recommendations">
        <h3 className="ninv-recommendations-title">
          <Lightbulb />
          Recomendaciones
        </h3>
        <div className="ninv-recommendations-list">
          {getRecommendations().map((recommendation, index) => (
            <div key={index} className="ninv-recommendation-item">
              {recommendation.icon}
              <p className="ninv-recommendation-text">{recommendation.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryAlerts;
