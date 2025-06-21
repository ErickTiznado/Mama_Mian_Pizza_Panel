import { useState, useEffect } from 'react';
import {
  DatabaseBackup,
  Download,
  CheckCircle,
  Clock,
  Calendar,
  Settings,
  Activity,
  RefreshCw
} from 'lucide-react';

const BackupTab = () => {
  // Estados para datos de backup
  const [backupData, setBackupData] = useState([]);

  // Cargar datos simulados de backup
  useEffect(() => {
    const datosBackup = [
      {
        id: 1,
        nombre: 'backup_completo_2024_01_15.sql',
        descripcion: 'Backup completo del sistema',
        tipo: 'Completo',
        tamaño: '245.8 MB',
        fecha: '15/01/2024 02:00:00',
        estado: 'Completado'
      },      {
        id: 2,
        nombre: 'backup_incremental_2024_01_14.sql',
        descripcion: 'Backup incremental diario',
        tipo: 'Incremental',
        tamaño: '42.3 MB',
        fecha: '14/01/2024 02:00:00',
        estado: 'Completado'
      },
      {
        id: 3,
        nombre: 'backup_completo_2024_01_08.sql',
        descripcion: 'Backup completo semanal',
        tipo: 'Completo',
        tamaño: '238.1 MB',
        fecha: '08/01/2024 02:00:00',
        estado: 'Completado'
      },
      {
        id: 4,
        nombre: 'backup_incremental_2024_01_07.sql',
        descripcion: 'Backup incremental diario',
        tipo: 'Incremental',
        tamaño: '38.7 MB',
        fecha: '07/01/2024 02:00:00',
        estado: 'Completado'
      },
      {
        id: 5,
        nombre: 'backup_diferencial_2024_01_06.sql',
        descripcion: 'Backup diferencial',
        tipo: 'Diferencial',
        tamaño: '95.2 MB',
        fecha: '06/01/2024 02:00:00',
        estado: 'Completado'
      }
    ];
    setBackupData(datosBackup);
  }, []);

  return (
    <div className="backup-layout">
      {/* Header de backup */}
      <div className="backup-header">
        <div className="backup-title-section">
          <DatabaseBackup size={28} className="section-icon" />
          <div>
            <h2 className="section-title">Gestión de Backups</h2>
            <p className="section-subtitle">Administra los respaldos del sistema y configura la programación automática</p>
          </div>
        </div>
        <button className="btn-create-backup-header">
          <Download size={20} />
          Crear Backup Ahora
        </button>
      </div>

      {/* Resumen de estado de backups */}
      <div className="backup-overview">
        <div className="backup-status-card success">
          <div className="status-card-content">
            <div className="status-icon-wrapper">
              <CheckCircle size={32} />
            </div>
            <div className="status-info">
              <h3>Último Backup</h3>
              <p className="status-time">Hace 6 horas</p>
              <span className="status-detail">Backup completo exitoso</span>
            </div>
          </div>
        </div>
        
        <div className="backup-status-card info">
          <div className="status-card-content">
            <div className="status-icon-wrapper">
              <DatabaseBackup size={32} />
            </div>
            <div className="status-info">
              <h3>Espacio Utilizado</h3>
              <p className="status-time">1.2 GB</p>
              <span className="status-detail">De 10 GB disponibles</span>
            </div>
          </div>
        </div>
        
        <div className="backup-status-card warning">
          <div className="status-card-content">
            <div className="status-icon-wrapper">
              <Clock size={32} />
            </div>
            <div className="status-info">
              <h3>Próximo Backup</h3>
              <p className="status-time">En 18 horas</p>
              <span className="status-detail">Backup automático programado</span>
            </div>
          </div>
        </div>
        
        <div className="backup-status-card neutral">
          <div className="status-card-content">
            <div className="status-icon-wrapper">
              <Calendar size={32} />
            </div>
            <div className="status-info">
              <h3>Retención</h3>
              <p className="status-time">30 días</p>
              <span className="status-detail">Período de conservación</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de backups */}
      <div className="backup-config modern-card">
        <div className="config-header">
          <div className="config-title-group">
            <Settings size={24} className="config-icon" />
            <div>
              <h3>Configuración de Backups</h3>
              <p>Personaliza la frecuencia y tipos de respaldo</p>
            </div>
          </div>
        </div>
        
        <div className="config-options">
          <div className="config-option">
            <div className="option-info">
              <h4>Backup Automático</h4>
              <p>Respaldos programados diariamente</p>
            </div>
            <div className="option-control">
              <span className="status-badge active">
                <CheckCircle size={14} />
                Activo
              </span>
            </div>
          </div>
          
          <div className="config-option">
            <div className="option-info">
              <h4>Notificaciones</h4>
              <p>Alertas sobre estado de backups</p>
            </div>
            <div className="option-control">
              <span className="status-badge active">
                <CheckCircle size={14} />
                Habilitado
              </span>
            </div>
          </div>
          
          <div className="config-option">
            <div className="option-info">
              <h4>Compresión</h4>
              <p>Reducir tamaño de archivos de backup</p>
            </div>
            <div className="option-control">
              <span className="status-badge active">
                <CheckCircle size={14} />
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de backups */}
      <div className="backup-history modern-card">
        <div className="history-header">
          <div className="history-title-group">
            <Activity size={24} className="history-icon" />
            <div>
              <h3>Historial de Backups</h3>
              <p>Registro completo de todos los respaldos realizados</p>
            </div>
          </div>
          <div className="history-actions">
            <button className="btn-download-all">
              <Download size={16} />
              Descargar Reporte
            </button>
          </div>
        </div>
        
        <div className="backup-table-wrapper">
          <table className="backup-history-table">
            <thead>
              <tr>
                <th>Archivo de Backup</th>
                <th>Tipo</th>
                <th>Tamaño</th>
                <th>Fecha de Creación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {backupData.map((backup) => (
                <tr key={backup.id} className="backup-row">
                  <td className="file-cell">
                    <div className="file-info">
                      <div className="file-icon">
                        <DatabaseBackup size={20} />
                      </div>
                      <div className="file-details">
                        <span className="file-name">{backup.nombre}</span>
                        <span className="file-description">{backup.descripcion}</span>
                      </div>
                    </div>
                  </td>
                  <td className="type-cell">
                    <span className={`backup-type-badge ${backup.tipo.toLowerCase()}`}>
                      <span className="type-indicator"></span>
                      {backup.tipo}
                    </span>
                  </td>
                  <td className="size-cell">
                    <span className="size-value">{backup.tamaño}</span>
                  </td>
                  <td className="date-cell">
                    <div className="date-info">
                      <Calendar size={14} className="date-icon" />
                      <span className="date-value">{backup.fecha}</span>
                    </div>
                  </td>
                  <td className="status-cell">
                    <span className="backup-status-badge completado">
                      <CheckCircle size={14} />
                      {backup.estado}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="backup-row-actions">
                      <button className="action-btn download" title="Descargar backup">
                        <Download size={16} />
                      </button>
                      <button className="action-btn restore" title="Restaurar desde este backup">
                        <RefreshCw size={16} />
                      </button>
                      <button className="action-btn info" title="Ver detalles">
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackupTab;
