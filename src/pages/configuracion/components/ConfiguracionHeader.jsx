import { 
  Settings, 
  User, 
  Activity, 
  FileText, 
  DatabaseBackup 
} from 'lucide-react';

const ConfiguracionHeader = ({ adminData }) => {
  return (
    <div className="config-header-section">
      <div className="config-header-content">
        <div className="config-title-container">
          <Settings className="config-icon" size={32} />
          <div>
            <h1 className="config-title">Configuración del Administrador</h1>
            <p className="config-subtitle">
              Gestiona la configuración de tu cuenta, historial y backups del sistema
            </p>
          </div>
        </div>
        
        {adminData && (
          <div className="admin-status-badge">
            <div className="admin-avatar">
              <User size={20} />
            </div>
            <div className="admin-info">
              <span className="admin-name">{adminData.nombre}</span>
              <span className="admin-role">
                {adminData.rol === 'super_admin' ? 'Super Administrador' : 'Administrador'}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="config-divider" />
    </div>
  );
};

export default ConfiguracionHeader;
