import React, { useMemo } from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Warehouse } from 'lucide-react';
import InventoryService from '../../services/InventoryService';

const InventoryDashboard = ({ inventoryData, alerts, loading }) => {
  
  const metrics = useMemo(() => {
    return InventoryService.calculateMetrics(inventoryData);
  }, [inventoryData]);

  const MetricCard = ({ icon: IconComponent, title, value, subtitle, trend, color = 'blue' }) => (
    <div className={`metric-card metric-card-${color}`}>
      <div className="metric-header">
        <IconComponent className="metric-icon" />
        <div className="metric-info">
          <h3 className="metric-title">{title}</h3>
          <div className="metric-value">{value}</div>
          {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        </div>
      </div>
      {trend && (
        <div className={`metric-trend ${trend.type}`}>
          {trend.type === 'up' ? <TrendingUp /> : <TrendingDown />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando métricas del inventario...</p>
      </div>
    );
  }

  return (
    <div className="inventory-dashboard">
      {/* Métricas principales */}
      <div className="metrics-grid">
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
      <div className="dashboard-charts">
        <div className="chart-card">
          <h3 className="chart-title">Distribución por Categorías</h3>
          <div className="category-chart">
            {Object.entries(metrics.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <div className="category-bar-container">
                  <div 
                    className="category-bar"
                    style={{ 
                      width: `${(count / metrics.totalItems) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Estado del Inventario</h3>
          <div className="status-chart">
            {Object.entries(metrics.statusBreakdown).map(([status, count]) => (
              <div key={status} className={`status-item status-${status.toLowerCase()}`}>
                <div className="status-circle">
                  <span className="status-count">{count}</span>
                </div>
                <span className="status-label">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas rápidas */}
      {alerts.length > 0 && (
        <div className="dashboard-alerts">
          <h3 className="alerts-title">Alertas Activas</h3>
          <div className="alerts-preview">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                <AlertTriangle className="alert-icon" />
                <div className="alert-content">
                  <strong>{alert.title}</strong>
                  <p>{alert.message}</p>
                </div>
              </div>
            ))}
            {alerts.length > 3 && (
              <div className="alerts-more">
                +{alerts.length - 3} alertas más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Productos con stock más bajo */}
      <div className="low-stock-preview">
        <h3 className="preview-title">Productos con Stock Más Bajo</h3>
        <div className="low-stock-list">
          {inventoryData
            .filter(item => parseFloat(item.cantidad_actual || 0) <= 10)
            .sort((a, b) => parseFloat(a.cantidad_actual || 0) - parseFloat(b.cantidad_actual || 0))
            .slice(0, 5)
            .map(item => (
              <div key={item.id_ingrediente} className="low-stock-item">
                <span className="item-name">{item.nombre}</span>
                <span className={`item-stock ${parseFloat(item.cantidad_actual || 0) === 0 ? 'zero-stock' : 'low-stock'}`}>
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
