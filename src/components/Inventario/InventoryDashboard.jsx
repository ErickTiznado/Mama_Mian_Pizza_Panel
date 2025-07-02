import React, { useMemo } from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Warehouse } from 'lucide-react';
import InventoryService from '../../services/InventoryService';
import './InventoryDashboard.css';

const InventoryDashboard = ({ inventoryData, alerts, loading, inventoryStats }) => {
  
  const metrics = useMemo(() => {
    return InventoryService.calculateMetrics(inventoryData, inventoryStats);
  }, [inventoryData, inventoryStats]);

  const MetricCard = ({ icon: IconComponent, title, value, subtitle, trend, color = 'blue' }) => (
    <div className={`ninv-metric-card ninv-metric-card-${color}`}>
      <div className="ninv-metric-header">
        <IconComponent className="ninv-metric-icon" />
        <div className="ninv-metric-info">
          <h3 className="ninv-metric-title">{title}</h3>
          <div className="ninv-metric-value">{value}</div>
          {subtitle && <p className="ninv-metric-subtitle">{subtitle}</p>}
        </div>
      </div>
      {trend && (
        <div className={`ninv-metric-trend ${trend.type}`}>
          {trend.type === 'up' ? <TrendingUp /> : <TrendingDown />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="ninv-dashboard-loading">
        <div className="ninv-loading-spinner"></div>
        <p>Cargando métricas del inventario...</p>
      </div>
    );
  }

  return (
    <div className="ninv-inventory-dashboard">
      {/* Métricas principales */}
      <div className="ninv-metrics-grid">
        <MetricCard
          icon={Package}
          title="Total de Productos"
          value={metrics.totalItems}
          subtitle="productos únicos"
          color="blue"
        />
        
        <MetricCard
          icon={DollarSign}
          title="Valor Total del Inventario"
          value={`$${metrics.totalValue.toFixed(2)}`}
          subtitle="valor estimado"
          color="green"
        />
        
        <MetricCard
          icon={AlertTriangle}
          title="Stock Bajo"
          value={metrics.lowStockItems}
          subtitle="productos con stock crítico"
          color="orange"
        />
        
        <MetricCard
          icon={Warehouse}
          title="Próximos a Vencer"
          value={metrics.expiringSoon}
          subtitle="en los próximos 7 días"
          color="red"
        />
      </div>

      {/* Gráficos y análisis */}
      <div className="ninv-dashboard-section">
        <div className="ninv-chart-card">
          <h3 className="ninv-section-title">Distribución por Categorías</h3>
          <div className="ninv-category-chart">
            {Object.entries(metrics.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="ninv-category-item">
                <span className="ninv-category-name">{category}</span>
                <div className="ninv-category-bar-container">
                  <div 
                    className="ninv-category-bar"
                    style={{ 
                      width: `${(count / metrics.totalItems) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="ninv-category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ninv-chart-card">
          <h3 className="ninv-section-title">Estado del Inventario</h3>
          <div className="ninv-status-chart">
            {Object.entries(metrics.statusBreakdown).map(([status, count]) => (
              <div key={status} className={`ninv-status-item ninv-status-${status.toLowerCase()}`}>
                <div className="ninv-status-circle">
                  <span className="ninv-status-count">{count}</span>
                </div>
                <span className="ninv-status-label">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas rápidas */}
      {alerts.length > 0 && (
        <div className="ninv-dashboard-section">
          <h3 className="ninv-section-title">
            <AlertTriangle />
            Alertas Activas
          </h3>
          <div className="ninv-quick-alerts">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className={`ninv-alert-item ${alert.type}`}>
                <AlertTriangle className="ninv-alert-icon" />
                <div className="ninv-alert-content">
                  <div className="ninv-alert-title">{alert.title}</div>
                  <div className="ninv-alert-description">{alert.message}</div>
                </div>
              </div>
            ))}
            {alerts.length > 3 && (
              <div className="ninv-alerts-more">
                +{alerts.length - 3} alertas más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Productos con stock más bajo */}
      <div className="ninv-dashboard-section">
        <h3 className="ninv-section-title">
          <Package />
          Productos con Stock Más Bajo
        </h3>
        <div className="ninv-low-stock-list">
          {inventoryData
            .filter(item => parseFloat(item.cantidad_actual || 0) <= 10)
            .sort((a, b) => parseFloat(a.cantidad_actual || 0) - parseFloat(b.cantidad_actual || 0))
            .slice(0, 5)
            .map(item => (
              <div key={item.id_ingrediente} className="ninv-low-stock-item">
                <span className="ninv-item-name">{item.nombre}</span>
                <span className={`ninv-item-stock ${parseFloat(item.cantidad_actual || 0) === 0 ? 'zero-stock' : 'low-stock'}`}>
                  {item.cantidad_actual} {item.unidad}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
