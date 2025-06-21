import { 
  Loader, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';

const ConfiguracionStates = ({ 
  loading, 
  error, 
  isAuthenticated, 
  cargarDatosAdmin 
}) => {
  // Estado de carga
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader className="loading-spinner" size={24} />
          <span className="loading-text">Cargando datos del administrador...</span>
        </div>
      </div>
    );
  }

  // Estado de no autenticado
  if (!isAuthenticated && !loading) {
    return (
      <div className="alert-container warning">
        <div className="alert-content">
          <Lock size={20} className="alert-icon" />
          <div>
            <h3>Acceso Restringido</h3>
            <p>Necesitas iniciar sesión para acceder a la configuración del administrador.</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error && isAuthenticated) {
    return (
      <div className="alert-container error">
        <div className="alert-content">
          <AlertTriangle size={20} className="alert-icon" />
          <div className="alert-text">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={cargarDatosAdmin}
            className="alert-action-btn"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ConfiguracionStates;
