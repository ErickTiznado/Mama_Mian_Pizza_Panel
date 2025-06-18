import React, { useState, useCallback } from 'react';
import './GeneradorInformes.css';
import {
  FaCog,
  FaEye,
  FaDownload,
  FaSave,
  FaPlay,
  FaQuestionCircle,
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaTable,
  FaDollarSign,
  FaShoppingCart, 
  FaUsers,
  FaCubes,
  FaRegFileAlt, 
  FaCalendarAlt, 
  FaUserFriends,
  FaShareAlt,
  FaFilePdf, 
  FaFileExcel, 
  FaFileCode,
  FaFileExport,
  FaSearch,
  FaPlus,
  FaFilter,
  FaSort,
  FaTrash,
  FaEdit,
  FaCopy,
  FaTimes
} from 'react-icons/fa';

const GeneradorInformes = () => {
  const [activeTab, setActiveTab] = useState('constructor');
  const [rangoFechas, setRangoFechas] = useState('Últimos 30 días');
  const [activeLibraryTab, setActiveLibraryTab] = useState('componentes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [reportTitle, setReportTitle] = useState('Nuevo Informe');
  const [draggedComponent, setDraggedComponent] = useState(null);

  const handleDragStart = useCallback((component, e) => {
    setDraggedComponent(component);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (draggedComponent) {
      const newComponent = {
        ...draggedComponent,
        id: Date.now() + Math.random(),
        position: selectedComponents.length
      };
      setSelectedComponents(prev => [...prev, newComponent]);
      setDraggedComponent(null);
    }
  }, [draggedComponent, selectedComponents]);

  const removeComponent = useCallback((componentId) => {
    setSelectedComponents(prev => prev.filter(comp => comp.id !== componentId));
  }, []);

  const duplicateComponent = useCallback((component) => {
    const duplicated = {
      ...component,
      id: Date.now() + Math.random(),
      position: selectedComponents.length
    };
    setSelectedComponents(prev => [...prev, duplicated]);
  }, [selectedComponents]);

  const addComponent = useCallback((component) => {
    const newComponent = {
      ...component,
      id: Date.now() + Math.random(),
      position: selectedComponents.length
    };
    setSelectedComponents(prev => [...prev, newComponent]);
  }, [selectedComponents]);

  const componentsList = [
    {
      type: 'chart',
      name: 'Gráfico de Barras',
      icon: FaChartBar,
      category: 'Gráficos',
      description: 'Comparar valores entre categorías',
      examples: 'Ventas por mes, productos más vendidos'
    },
    {
      type: 'chart',
      name: 'Gráfico de Líneas',
      icon: FaChartLine,
      category: 'Gráficos',
      description: 'Mostrar tendencias a lo largo del tiempo',
      examples: 'Evolución de ventas, crecimiento mensual'
    },
    {
      type: 'chart',
      name: 'Gráfico Circular',
      icon: FaChartPie,
      category: 'Gráficos',
      description: 'Mostrar proporciones y porcentajes',
      examples: 'Distribución de productos, canales de venta'
    },
    {
      type: 'table',
      name: 'Tabla de Datos',
      icon: FaTable,
      category: 'Tablas',
      description: 'Mostrar datos detallados en formato tabular',
      examples: 'Lista de pedidos, inventario detallado'
    },
    {
      type: 'kpi',
      name: 'KPI Ingresos',
      icon: FaDollarSign,
      category: 'KPIs',
      description: 'Métricas de ingresos y ventas',
      examples: 'Ingresos totales, ticket promedio'
    },
    {
      type: 'kpi',
      name: 'KPI Pedidos',
      icon: FaShoppingCart,
      category: 'KPIs',
      description: 'Métricas de pedidos y conversión',
      examples: 'Total pedidos, tasa de conversión'
    },
    {
      type: 'kpi',
      name: 'KPI Clientes',
      icon: FaUsers,
      category: 'KPIs',
      description: 'Métricas de clientes y retención',
      examples: 'Clientes activos, nuevos registros'
    },
    {
      type: 'kpi',
      name: 'KPI Productos',
      icon: FaCubes,
      category: 'KPIs',
      description: 'Métricas de productos e inventario',
      examples: 'Productos vendidos, stock disponible'
    },
    {
      type: 'text',
      name: 'Bloque de Texto',
      icon: FaRegFileAlt,
      category: 'Texto',
      description: 'Añadir texto descriptivo y análisis',
      examples: 'Resúmenes ejecutivos, conclusiones'
    }
  ];

  const templatesList = [
    {
      name: 'Informe Mensual',
      icon: FaCalendarAlt,
      description: 'Resumen completo del rendimiento mensual',
      components: ['KPI Ingresos', 'KPI Pedidos', 'Gráfico de Líneas', 'Tabla de Datos']
    },
    {
      name: 'Análisis de Clientes',
      icon: FaUserFriends,
      description: 'Comportamiento y métricas de clientes',
      components: ['KPI Clientes', 'Gráfico Circular']
    },
    {
      name: 'Rendimiento de Ventas',
      icon: FaChartLine,
      description: 'Análisis detallado de ventas y productos',
      components: ['KPI Ingresos', 'KPI Productos', 'Gráfico de Barras', 'Bloque de Texto']
    }
  ];

  const filteredComponents = componentsList.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedComponents = filteredComponents.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {});

  return (
    <div className="gen-container">
      {/* HEADER SUPERIOR */}
      <header className="gen-header">
        <div className="gen-title">
          <h1>
            Generador de Informes <span className="beta">Beta</span>
          </h1>
          <span className="component-count">{selectedComponents.length} componentes</span>
        </div>
        <div className="gen-actions">
          <button className="btn btn-secondary" title="Guardar informe">
            <FaSave /> Guardar
          </button>
          <button 
            className="btn btn-primary" 
            disabled={selectedComponents.length === 0}
            title="Generar informe"
          >
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
        {/* CONFIGURACIÓN Y BIBLIOTECA - SOLO EN CONSTRUCTOR */}
        {activeTab === 'constructor' && (
          <div className="gen-sidebar-stack">
            <aside className="gen-sidebar">
              <h2><FaCog className="section-icon" /> Configuración</h2>

              <div className="form-group">
                <label htmlFor="titulo">Título del Informe</label>
                <input 
                  id="titulo" 
                  type="text" 
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Ingresa el título del informe"
                />
              </div>

              <div className="form-group">
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
              </div>

              <div className="form-group">
                <label htmlFor="filtros">Filtros</label>
                <select id="filtros">
                  <option>Todos los datos</option>
                  <option>Solo pendientes</option>
                  <option>Solo completados</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tema">Tema Visual</label>
                <select id="tema">
                  <option>Predeterminado</option>
                  <option>Profesional</option>
                  <option>Colorido</option>
                  <option>Minimalista</option>
                </select>
              </div>

              <button className="btn btn-help">
                <FaQuestionCircle /> Ayuda y Tutoriales
              </button>
            </aside>

            <section className="gen-lib-panel">
              <div className="lib-header">
                <h3><FaPlus className="section-icon" /> Biblioteca de Componentes</h3>
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar componentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="gen-tabs">
                <button
                  className={activeLibraryTab === 'componentes' ? 'active' : ''}
                  onClick={() => setActiveLibraryTab('componentes')}
                >
                  <FaCubes /> Componentes
                </button>
                <button
                  className={activeLibraryTab === 'plantillas' ? 'active' : ''}
                  onClick={() => setActiveLibraryTab('plantillas')}
                >
                  <FaRegFileAlt /> Plantillas
                </button>
              </div>

              <div className="gen-library-content scrollable">
                {activeLibraryTab === 'componentes' && (
                  <div className="component-list">
                    {filteredComponents.length === 0 ? (
                      <div className="no-results">
                        <FaSearch size={24} />
                        <p>No se encontraron componentes</p>
                        <small>Intenta con otros términos de búsqueda</small>
                      </div>
                    ) : (
                      Object.entries(groupedComponents).map(([category, components]) => (
                        <div key={category} className="category-section">
                          <div className="section-divider">
                            <strong className="section-label">{category}</strong>
                          </div>
                          {components.map((component) => {
                            const Icon = component.icon;
                            return (
                              <div
                                key={component.name}
                                className="component-card"
                                draggable
                                onDragStart={(e) => handleDragStart(component, e)}
                                title={`Arrastra para agregar: ${component.name}`}
                              >
                                <div className="card-icon">
                                  <Icon />
                                </div>
                                <div className="card-content">
                                  <div className="card-title-row">
                                    <strong>{component.name}</strong>
                                    <span className={`badge ${component.category.toLowerCase()}`}>
                                      {component.category}
                                    </span>
                                  </div>
                                  <p>{component.description}</p>
                                  <small>{component.examples}</small>
                                </div>
                                <button 
                                  className="add-btn"
                                  onClick={() => addComponent(component)}
                                  title="Agregar componente"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeLibraryTab === 'plantillas' && (
                  <div className="component-list">
                    {templatesList.map((template) => {
                      const Icon = template.icon;
                      return (
                        <div key={template.name} className="component-card template-card">
                          <div className="card-icon orange">
                            <Icon />
                          </div>
                          <div className="card-content">
                            <div className="card-title-row">
                              <strong>{template.name}</strong>
                              <span className="badge plantilla">Plantilla</span>
                            </div>
                            <p>{template.description}</p>
                            <div className="template-tags">
                              {template.components.slice(0, 3).map((comp, index) => (
                                <span key={index} className="template-tag">{comp}</span>
                              ))}
                              {template.components.length > 3 && (
                                <span className="template-tag more">+{template.components.length - 3} más</span>
                              )}
                            </div>
                          </div>
                          <button 
                            className="add-btn"
                            onClick={() => {
                              // Agregar todos los componentes de la plantilla
                              template.components.forEach(compName => {
                                const component = componentsList.find(c => c.name === compName);
                                if (component) {
                                  addComponent(component);
                                }
                              });
                            }}
                            title="Usar plantilla"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      );
                    })}
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
                <h2>{reportTitle}</h2>
                <div className="report-meta">
                  <span className="badge range">{rangoFechas}</span>
                  <span className="live-indicator">
                    <span className="live-dot"></span>
                    En vivo
                  </span>
                </div>
              </div>
              
              {selectedComponents.length === 0 ? (
                <div 
                  className="dropzone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="dropzone-content">
                    <span className="drag-icon">📊</span>
                    <h3>Arrastra componentes aquí para comenzar tu informe</h3>
                    <p>Los componentes aparecerán en el orden que los agregues</p>
                    <small>También puedes hacer clic en el botón <FaPlus style={{display: 'inline'}} /> de cada componente</small>
                  </div>
                </div>
              ) : (
                <div 
                  className="report-canvas"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {selectedComponents.map((component, index) => {
                    const Icon = component.icon;
                    return (
                      <div key={component.id} className="report-component">
                        <div className="component-header">
                          <div className="component-info">
                            <Icon className="component-icon" />
                            <span className="component-name">{component.name}</span>
                            <span className={`component-badge ${component.category.toLowerCase()}`}>
                              {component.category}
                            </span>
                          </div>
                          <div className="component-actions">
                            <button 
                              className="action-btn"
                              onClick={() => duplicateComponent(component)}
                              title="Duplicar"
                            >
                              <FaCopy />
                            </button>
                            <button 
                              className="action-btn"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="action-btn danger"
                              onClick={() => removeComponent(component.id)}
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="component-preview">
                          <div className="preview-placeholder">
                            <Icon size={32} />
                            <span>Vista previa de {component.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="add-component-zone">
                    <span>Arrastra más componentes aquí</span>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'vista_previa' && (
            <div className="preview-container">
              {selectedComponents.length === 0 ? (
                <div className="preview-placeholder empty-preview">
                  <FaCalendarAlt className="preview-icon" />
                  <h3>No hay componentes en el informe</h3>
                  <p>Agrega componentes desde la biblioteca para ver la vista previa del informe</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('constructor')}
                  >
                    <FaPlus /> Agregar Componentes
                  </button>
                </div>
              ) : (
                <div className="preview-content">
                  <div className="preview-header">
                    <h1>{reportTitle}</h1>
                    <div className="preview-meta">
                      <span className="date-range">{rangoFechas}</span>
                      <span className="generation-date">
                        Generado el {new Date().toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <div className="preview-components">
                    {selectedComponents.map((component, index) => {
                      const Icon = component.icon;
                      return (
                        <div key={component.id} className="preview-component">
                          <h3>
                            <Icon className="component-icon" />
                            {component.name}
                          </h3>
                          <div className="preview-chart">
                            <Icon size={48} />
                            <p>Simulación de {component.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'exportar' && (
            <div className="export-container">
              <div className="export-panel">
                <h3 className="export-title">
                  <FaFileExport className="export-title-icon" />
                  Exportar Informe
                </h3>

                <div className="export-options">
                  <div className="export-option">
                    <div className="export-option-info">
                      <div className="export-option-header">
                        <FaFilePdf className="export-icon" />
                        <strong>PDF</strong>
                      </div>
                      <p>Documento portable con formato fijo</p>
                      <small>~2.5 MB</small>
                    </div>
                    <button className="btn btn-export">
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
                    <button className="btn btn-export">
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
                    <button className="btn btn-export">
                      <FaDownload /> Exportar
                    </button>
                  </div>
                </div>

                <div className="secure-share">
                  <button className="btn btn-share">
                    <FaShareAlt /> Compartir Enlace Seguro
                  </button>
                  <small>El enlace expirará en 30 días</small>
                </div>
              </div>

              <div className="export-config">
                <h3>Configuración de Exportación</h3>

                <div className="form-group">
                  <label>Calidad de Imágenes</label>
                  <select>
                    <option>Alta (Mejor calidad)</option>
                    <option>Media (Balanceado)</option>
                    <option>Baja (Rápido)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Incluir Datos Raw</label>
                  <select>
                    <option>Resumen de datos</option>
                    <option>Solo visualizaciones</option>
                    <option>Datos Completos</option>
                  </select>
                </div>

                <div className="export-summary">
                  <h4>Información del Informe</h4>
                  <div className="summary-item">
                    <strong>Componentes:</strong> {selectedComponents.length}
                  </div>
                  <div className="summary-item">
                    <strong>Tamaño estimado:</strong> ~{Math.max(1, selectedComponents.length * 0.5)} MB
                  </div>
                  <div className="summary-item">
                    <strong>Tiempo de generación:</strong> ~{Math.max(1, selectedComponents.length * 2)} segundos
                  </div>
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