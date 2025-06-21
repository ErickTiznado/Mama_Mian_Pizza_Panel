import { useEffect, useState } from 'react';
import "./configuracion.css";
import AdminService from "../../services/AdminService";
import { useAuth } from "../../context/AuthContext";

// Importar componentes
import ConfiguracionHeader from "./components/ConfiguracionHeader";
import ConfiguracionTabs from "./components/ConfiguracionTabs";
import ConfiguracionStates from "./components/ConfiguracionStates";
import CuentaTab from "./components/CuentaTab";
import HistorialTab from "./components/HistorialTab";
import LogsTab from "./components/LogsTab";
import BackupTab from "./components/BackupTab";

function ConfiguracionAdmin() {
  // Hook de autenticación
  const { user, isAuthenticated, logout } = useAuth();

  // Estados de datos del administrador
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Estado general
  const [activeTab, setActiveTab] = useState("cuenta");

  // Función auxiliar para obtener el ID del administrador
  const getAdminId = () => {
    if (!user) return null;
    return user.id_admin;
  };
  // Función para cargar datos del administrador
  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      setError(null);

      const adminId = getAdminId();
      if (!adminId) {
        throw new Error('No se pudo obtener el ID del administrador');
      }

      const adminData = await AdminService.getAdminById(adminId);
      setAdminData(adminData);
      
    } catch (error) {
      console.error('Error al cargar datos del administrador:', error);
      setError(error.message || 'Error al cargar la información del administrador');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debug: Mostrar información del usuario logueado
    console.log('Usuario autenticado:', isAuthenticated);
    console.log('Datos del usuario:', user);
    console.log('ID del administrador detectado:', getAdminId());
    
    // Solo cargar datos si el usuario está autenticado
    if (isAuthenticated && getAdminId()) {
      cargarDatosAdmin();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Función para renderizar el contenido de las pestañas
  const renderTabContent = () => {
    switch (activeTab) {
      case "cuenta":
        return (
          <CuentaTab
            adminData={adminData}
            user={user}
            loading={loading}
            error={error}
            successMessage={successMessage}
            setError={setError}
            setSuccessMessage={setSuccessMessage}
            cargarDatosAdmin={cargarDatosAdmin}
            logout={logout}
          />
        );
      case "historial":
        return <HistorialTab />;
      case "logs":
        return <LogsTab user={user} />;
      case "backup":
        return <BackupTab />;
      default:
        return null;
    }
  };

  return (
    <div className="config-wrapper">
      <ConfiguracionHeader adminData={adminData} />
      
      {/* Estados de carga, error o no autenticado */}
      <ConfiguracionStates 
        loading={loading}
        error={error}
        isAuthenticated={isAuthenticated}
        cargarDatosAdmin={cargarDatosAdmin}
      />

      {/* Contenido principal cuando está cargado y autenticado */}
      {!loading && !error && isAuthenticated && adminData && (
        <div className="config-content-background">
          <ConfiguracionTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <div className="config-panels">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionAdmin;
