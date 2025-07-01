import React from 'react';
import {
  User,
  Activity,
  FileText,
  DatabaseBackup
} from "lucide-react";

function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "cuenta", label: "Mi Cuenta", icon: User, description: "Perfil y seguridad" },
    { key: "historial", label: "Historial", icon: Activity, description: "Actividad reciente" },
    { key: "logs", label: "Logs del Sistema", icon: FileText, description: "Logs detallados" },
    { key: "backup", label: "Backups", icon: DatabaseBackup, description: "Respaldos del sistema" },
  ];

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map(({ key, label, icon: Icon, description }) => (
          <button
            key={key}
            className={`tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={24} className="tab-icon" />
            <div className="tab-content">
              <span className="tab-label">{label}</span>
              <span className="tab-description">{description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;
