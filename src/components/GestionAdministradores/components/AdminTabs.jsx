import React from 'react';
import './AdminTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserShield, 
  faUserCog, 
  faUserTie
} from '@fortawesome/free-solid-svg-icons';

const AdminTabs = ({ activeFilter, handleFilterChange, setPaginaActual, counts = {} }) => {
  const tabs = [
    {
      key: "todos",
      label: "Todos",
      icon: <FontAwesomeIcon icon={faUsers} />,
      color: "#6b7280"
    },
    {
      key: "super_admin",
      label: "Dueños",
      icon: <FontAwesomeIcon icon={faUserShield} />,
      color: "#dc2626"
    },
    {
      key: "admin",
      label: "Administradores",
      icon: <FontAwesomeIcon icon={faUserTie} />,
      color: "#2563eb"
    },
    {
      key: "moderador",
      label: "Moderador",
      icon: <FontAwesomeIcon icon={faUserCog} />,
      color: "#059669"
    }
  ];

  return (
    <div className="admin_tabs styled-tabs left-align">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`styled-tab admin-tab ${activeFilter === tab.key ? 'active' : ''}`}
          style={{
            backgroundColor: activeFilter === tab.key ? tab.color : '#0f172a',
            borderColor: tab.color
          }}
          onClick={() => {
            setPaginaActual(1);
            handleFilterChange(tab.key);
          }}
        >
          <span className="tab-icon" style={{ color: activeFilter === tab.key ? '#fff' : tab.color }}>
            {tab.icon}
          </span>
          <span className="tab-label">{tab.label}</span>
          <span className="tab-count">{counts[tab.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminTabs;
