import React, { useState } from 'react';
import './GeneradorInformes.css';
import {
  FaCog,
  FaEye,
  FaDownload,
  FaSave,
  FaPlay,
  FaQuestionCircle,
  FaChartBar, FaChartLine, FaChartPie, FaTable,
  FaDollarSign,
  FaShoppingCart, FaUsers,
  FaCubes,
  FaRegFileAlt, FaCalendarAlt, FaUserFriends,FaShareAlt ,FaFilePdf, FaFileExcel, FaFileCode,FaFileExport 
} from 'react-icons/fa';

const GeneradorInformes = () => {
  const [activeTab, setActiveTab] = useState('constructor');
  const [rangoFechas, setRangoFechas] = useState('Últimos 30 días');
  const [activeLibraryTab, setActiveLibraryTab] = useState('componentes');

  return (
    <div className="gen-container">
      {/* HEADER SUPERIOR */}
      <header className="gen-header">
        <div className="gen-title">
          <h1>
            Generador de Informes <span className="beta">Beta</span>
          </h1>
          <span className="component-count">0 componentes</span>
        </div>
        <div className="gen-actions">
          <button className="btn">
            <FaSave /> Guardar
          </button>
          <button className="btn primary">
            <FaPlay /> Generar
          </button>
        </div>
      </header>

      {/* TABS DE NAVEGACIÓN */}
      <nav className="gen-nav">
        <button
          className={activeTab === 'constructor' ? 'active' : ''}
          onClick={() => setActiveTab('constructor')}
        >
          <FaCog /> Constructor
        </button>
        <button
          className={activeTab === 'vista_previa' ? 'active' : ''}
          onClick={() => setActiveTab('vista_previa')}
        >
          <FaEye /> Vista Previa
        </button>
        <button
          className={activeTab === 'exportar' ? 'active' : ''}
          onClick={() => setActiveTab('exportar')}
        >
          <FaDownload /> Exportar
        </button>
      </nav>

      <div className="gen-body">
        {/* SOLO MOSTRAR CONFIGURACIÓN Y BIBLIOTECA SI ESTAMOS EN CONSTRUCTOR */}
        {activeTab === 'constructor' && (
          <div className="gen-sidebar-stack">
            <aside className="gen-sidebar">
              <h2>Configuración</h2>

              <label htmlFor="titulo">Título del Informe</label>
              <input id="titulo" type="text" value="Nuevo Informe" readOnly />

              <label htmlFor="rango">Rango de Fechas</label>
              <select
                id="rango"
                value={rangoFechas}
                onChange={(e) => setRangoFechas(e.target.value)}
              >
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
                <option>Últimos 90 días</option>
                <option>Último año</option>
                <option>Personalizado</option>
              </select>

              <label htmlFor="filtros">Filtros</label>
              <select id="filtros">
                <option>Todos los datos</option>
                <option>Solo pendientes</option>
                <option>Solo completados</option>
              </select>

              <label htmlFor="tema">Tema Visual</label>
              <select id="tema">
                <option>Predeterminado</option>
                <option>Profesional</option>
                <option>Colorido</option>
                <option>Minimalista</option>
              </select>

              <button className="btn help">
                <FaQuestionCircle /> Ayuda y Tutoriales
              </button>
            </aside>

            <section className="gen-lib-panel">
              <h3>Biblioteca de Componentes</h3>
              <div className="gen-tabs">
                <button
                  className={activeLibraryTab === 'componentes' ? 'active' : ''}
                  onClick={() => setActiveLibraryTab('componentes')}
                >
                  Componentes
                </button>
                <button
                  className={activeLibraryTab === 'plantillas' ? 'active' : ''}
                  onClick={() => setActiveLibraryTab('plantillas')}
                >
                  Plantillas
                </button>
              </div>

              <div className="gen-library-content scrollable">
                {activeLibraryTab === 'componentes' && (
                  <div className="component-list">
                    {/* Charts */}
                    <strong className="section-label">Charts</strong>

                    <div className="component-card">
                      <div className="card-icon"><FaChartBar /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Gráfico de Barras</strong>
                          <span className="badge">Gráficos</span>
                        </div>
                        <p>Comparar valores entre categorías</p>
                        <small>Ventas por mes, productos más vendidos</small>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon"><FaChartLine /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Gráfico de Líneas</strong>
                          <span className="badge">Gráficos</span>
                        </div>
                        <p>Mostrar tendencias a lo largo del tiempo</p>
                        <small>Evolución de ventas, crecimiento mensual</small>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon"><FaChartPie /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Gráfico Circular</strong>
                          <span className="badge">Gráficos</span>
                        </div>
                        <p>Mostrar proporciones y porcentajes</p>
                        <small>Distribución de productos, canales de venta</small>
                      </div>
                    </div>

                    {/* Tables */}
                    <strong className="section-label">Tables</strong>

                    <div className="component-card">
                      <div className="card-icon"><FaTable /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Tabla de Datos</strong>
                          <span className="badge">Tablas</span>
                        </div>
                        <p>Mostrar datos detallados en formato tabular</p>
                        <small>Lista de pedidos, inventario detallado</small>
                      </div>
                    </div>

                    {/* KPIs */}
                    <strong className="section-label">KPIs</strong>

                    <div className="component-card">
                      <div className="card-icon"><FaDollarSign /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>KPI Ingresos</strong>
                          <span className="badge">KPIs</span>
                        </div>
                        <p>Métricas de ingresos y ventas</p>
                        <small>Ingresos totales, ticket promedio</small>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon"><FaShoppingCart /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>KPI Pedidos</strong>
                          <span className="badge">KPIs</span>
                        </div>
                        <p>Métricas de pedidos y conversión</p>
                        <small>Total pedidos, tasa de conversión</small>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon"><FaUsers /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>KPI Clientes</strong>
                          <span className="badge">KPIs</span>
                        </div>
                        <p>Métricas de clientes y retención</p>
                        <small>Clientes activos, nuevos registros</small>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon"><FaCubes /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>KPI Productos</strong>
                          <span className="badge">KPIs</span>
                        </div>
                        <p>Métricas de productos e inventario</p>
                        <small>Productos vendidos, stock disponible</small>
                      </div>
                    </div>

                    {/* Text */}
                    <strong className="section-label">Text</strong>

                    <div className="component-card">
                      <div className="card-icon"><FaRegFileAlt /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Bloque de Texto</strong>
                          <span className="badge">Texto</span>
                        </div>
                        <p>Añadir texto descriptivo y análisis</p>
                        <small>Resúmenes ejecutivos, conclusiones</small>
                      </div>
                    </div>
                  </div>
                )}

                {activeLibraryTab === 'plantillas' && (
                  <div className="component-list">
                    <div className="component-card">
                      <div className="card-icon orange"><FaCalendarAlt /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Informe Mensual</strong>
                          <span className="badge plantilla">Plantilla</span>
                        </div>
                        <p>Resumen completo del rendimiento mensual</p>
                        <div className="template-tags">
                          <span>KPI Ingresos</span>
                          <span>KPI Pedidos</span>
                          <span>Gráfico de Líneas</span>
                          <span>+2 más</span>
                        </div>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon orange"><FaUserFriends /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Análisis de Clientes</strong>
                          <span className="badge plantilla">Plantilla</span>
                        </div>
                        <p>Comportamiento y métricas de clientes</p>
                        <div className="template-tags">
                          <span>KPI Clientes</span>
                          <span>Gráfico Circular</span>
                        </div>
                      </div>
                    </div>

                    <div className="component-card">
                      <div className="card-icon orange"><FaChartLine /></div>
                      <div className="card-content">
                        <div className="card-title-row">
                          <strong>Rendimiento de Ventas</strong>
                          <span className="badge plantilla">Plantilla</span>
                        </div>
                        <p>Análisis detallado de ventas y productos</p>
                        <div className="template-tags">
                          <span>KPI Ingresos</span>
                          <span>KPI Productos</span>
                          <span>Gráfico de Barras</span>
                          <span>+1 más</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* PANEL CENTRAL */}
        <main className="gen-main">
          {activeTab === 'constructor' && (
            <>
              <div className="gen-report-header">
                <h2>Nuevo Informe</h2>
                <span className="badge">{rangoFechas}</span>
                <span className="live">En vivo</span>
              </div>
              <div className="dropzone">
                <span className="drag-icon">⛶</span>
                <p>Arrastra componentes aquí para comenzar tu informe</p>
                <small>Los componentes aparecerán en el orden que los agregues</small>
              </div>
            </>
          )}

          {activeTab === 'vista_previa' && (
            <div className="preview-placeholder empty-preview">
              <FaCalendarAlt className="preview-icon" />
              <h3>No hay componentes en el informe</h3>
              <p>Agrega componentes desde la biblioteca para ver la vista previa del informe</p>
            </div>
          )}

         {activeTab === 'exportar' && (
  <div className="export-grid">
    <div className="export-panel export-panel-only">
  <h3 className="export-title">
  <FaFileExport className="export-title-icon" />
  Exportar Informe
</h3>


     <div className="export-option">
  <div className="export-option-info">
    <div className="export-option-header">
      <FaFilePdf className="export-icon" />
      <strong>PDF</strong>
    </div>
    <p>Documento portable con formato fijo</p>
    <small>~2.5 MB</small>
  </div>
  <button className="btn export-btn">
    <FaDownload /> Exportar
  </button>
</div>


     <div className="export-option">
  <div className="export-option-info">
    <div className="export-option-header">
     <FaFileExcel className="export-icon" />  
      <strong>Excel</strong>
    </div>
    <p>Hoja de cálculo con datos editables</p>
    <small>~1.8 MB</small>
  </div>
  <button className="btn export-btn">
    <FaDownload /> Exportar
  </button>
</div>

<div className="export-option">
  <div className="export-option-info">
    <div className="export-option-header">
     <FaFileCode className="export-icon" /> 
      <strong>HTML Interactivo</strong>
    </div>
    <p>Página web con gráficos interactivos</p>
    <small>~3.2 MB</small>
  </div>
  <button className="btn export-btn">
    <FaDownload /> Exportar
  </button>
</div>


      <div className="secure-share">
        <div className="secure-share">
  <button className="btn secure-btn">
    <FaShareAlt /> Compartir Enlace Seguro
  </button>
  <small>El enlace expirará en 30 días</small>
</div>
      </div>
    </div>

    <div className="export-config">
      <h3>Configuración de Exportación</h3>

      <label>Calidad de Imágenes</label>
      <select>
        <option>Alta (Mejor calidad)</option>
        <option>Media (Balanceado)</option>
        <option>Baja (Rapido)</option>
      </select>

      <label>Incluir Datos Raw</label>
      <select>
        <option>Resumen de datos</option>
        <option>Solo visualizaciones</option>
        <option>Datos Completos</option>
      </select>

      <div className="export-summary">
        <h4>Información del Informe</h4>
        <p><strong>Componentes:</strong> 0</p>
        <p><strong>Tamaño estimado:</strong> ~1 MB</p>
        <p><strong>Tiempo de generación:</strong> ~1 segundos</p>
      </div>
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
};

export default GeneradorInformes;   