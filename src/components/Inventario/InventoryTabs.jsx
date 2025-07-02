import React, { useState, useEffect } from 'react';
import { Package, BarChart3, AlertTriangle, Plus } from 'lucide-react';
import './InventoryTabs.css';
import InventoryDashboard from './InventoryDashboard';
import InventoryList from './InventoryList';
import InventoryAlerts from './InventoryAlerts';
import InventoryService from '../../services/InventoryService';

const InventoryTabs = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  // Cargar datos del inventario y estadísticas usando el servicio
  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar datos de productos
      const data = await InventoryService.getAllProducts();
      setInventoryData(data);
      
      // Intentar cargar estadísticas del backend
      let stats = null;
      try {
        stats = await InventoryService.getInventoryStats();
        setInventoryStats(stats);
      } catch (statsError) {
        console.warn('Could not load backend stats, using local calculations:', statsError);
      }
      
      // Generar alertas automáticamente usando el servicio
      const generatedAlerts = InventoryService.generateAlerts(data, stats);
      setAlerts(generatedAlerts);
      
    } catch (error) {
      console.error('Error loading inventory:', error);
      setError(error.message || 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      component: InventoryDashboard
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: Package,
      component: InventoryList
    },
    {
      id: 'alerts',
      label: 'Alertas',
      icon: AlertTriangle,
      component: InventoryAlerts,
      badge: alerts.length > 0 ? alerts.length : null
    }
  ];

  return (
    <div className="ninv-inventory-tabs-container">
      {/* Mensaje de error */}
      {error && (
        <div className="ninv-error-banner">
          <AlertTriangle />
          <span>{error}</span>
          <button onClick={loadInventoryData}>Reintentar</button>
        </div>
      )}

      <div className="ninv-inventory-tabs-header">
        <h1 className="ninv-inventory-title">
          <Package />
          Sistema de Inventario
        </h1>
        <div className="ninv-tabs-navigation">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`ninv-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ninv-tab-badge">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ninv-tab-content">
        {tabs.map(tab => {
          const ActiveComponent = tab.component;
          return (
            <div
              key={tab.id}
              className={`ninv-tab-panel ${activeTab === tab.id ? 'active' : ''}`}
            >
              {activeTab === tab.id && ActiveComponent && (
                <ActiveComponent
                  inventoryData={inventoryData}
                  inventoryStats={inventoryStats}
                  alerts={alerts}
                  loading={loading}
                  onDataUpdate={loadInventoryData}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryTabs;
