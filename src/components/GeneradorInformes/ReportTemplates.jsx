import React, { useState } from 'react';
import './ReportTemplates.css';
import {
  FaCalendarAlt,
  FaUserFriends,
  FaChartLine,
  FaTrophy,
  FaMoneyBillWave,
  FaShoppingCart,
  FaCubes,
  FaUsers,
  FaChartBar,
  FaTable,
  FaDollarSign,
  FaRegFileAlt,
  FaChartPie,
  FaInfoCircle,
  FaPlay,
  FaStar,
  FaClock,
  FaBuilding,
  FaGlobe,
  FaRocket,
  FaFileDownload,
  FaEye,
  FaFilter,
  FaSearch,
  FaSort,
  FaTags
} from 'react-icons/fa';

const ReportTemplates = ({ onSelectTemplate, componentsList }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularidad');

  // Plantillas profesionales y funcionales
  const templateCategories = {
    ejecutivo: {
      name: 'Ejecutivo',
      icon: FaTrophy,
      color: '#8b5cf6',
      description: 'Reportes de alto nivel para directivos'
    },
    operativo: {
      name: 'Operativo',
      icon: FaCubes,
      color: '#06b6d4',
      description: 'Análisis operacional detallado'
    },
    comercial: {
      name: 'Comercial',
      icon: FaMoneyBillWave,
      color: '#10b981',
      description: 'Métricas de ventas y comerciales'
    },
    cliente: {
      name: 'Cliente',
      icon: FaUserFriends,
      color: '#f59e0b',
      description: 'Análisis de comportamiento de clientes'
    },
    financiero: {
      name: 'Financiero',
      icon: FaDollarSign,
      color: '#ef4444',
      description: 'Reportes financieros y contables'
    }
  };

  const professionalTemplates = [
    // PLANTILLAS EJECUTIVAS
    {
      id: 'dashboard-ejecutivo',
      name: 'Dashboard Ejecutivo',
      category: 'ejecutivo',
      icon: FaTrophy,
      difficulty: 'Principiante',
      timeToCreate: '2 min',
      popularity: 95,
      rating: 4.9,
      usage: 'Más usado',
      description: 'Vista panorámica del negocio con KPIs críticos para la toma de decisiones estratégicas',
      benefits: [
        'Visión general instantánea del negocio',
        'KPIs críticos en tiempo real',
        'Ideal para reuniones de directorio',
        'Información condensada y clara'
      ],
      components: [
        { name: 'KPI Ingresos', config: { period: 'mes', comparison: true } },
        { name: 'KPI Pedidos', config: { trend: true, target: true } },
        { name: 'KPI Clientes', config: { growth: true, retention: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Tendencia de Ingresos', period: '12m' } },
        { name: 'Bloque de Texto', config: { title: 'Resumen Ejecutivo', type: 'summary' } }
      ],
      insights: [
        'Crecimiento del 15% vs mes anterior',
        'Retención de clientes del 87%',
        'Meta de ingresos cumplida al 112%'
      ],
      bestFor: 'Reuniones ejecutivas, reportes mensuales a directorio, presentaciones estratégicas'
    },
    {
      id: 'informe-trimestral',
      name: 'Informe Trimestral Completo',
      category: 'ejecutivo',
      icon: FaCalendarAlt,
      difficulty: 'Intermedio',
      timeToCreate: '4 min',
      popularity: 88,
      rating: 4.8,
      description: 'Análisis exhaustivo de rendimiento trimestral con comparativas y proyecciones',
      benefits: [
        'Análisis profundo de 3 meses',
        'Comparativas año anterior',
        'Proyecciones y tendencias',
        'Métricas de crecimiento'
      ],
      components: [
        { name: 'KPI Ingresos', config: { period: 'trimestre', comparison: 'year' } },
        { name: 'KPI Pedidos', config: { growth: true, seasonal: true } },
        { name: 'Gráfico de Barras', config: { title: 'Ingresos por Mes', comparison: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Evolución Trimestral', trend: true } },
        { name: 'Tabla de Datos', config: { title: 'Top Productos', limit: 10 } },
        { name: 'Bloque de Texto', config: { title: 'Análisis y Conclusiones', type: 'analysis' } }
      ],
      insights: [
        'Mejor trimestre del año',
        'Crecimiento sostenido del 8%',
        'Nuevos mercados emergentes'
      ],
      bestFor: 'Reportes trimestrales, análisis de performance, planificación estratégica'
    },

    // PLANTILLAS OPERATIVAS
    {
      id: 'control-operaciones',
      name: 'Control de Operaciones',
      category: 'operativo',
      icon: FaCubes,
      difficulty: 'Intermedio',
      timeToCreate: '3 min',
      popularity: 85,
      rating: 4.7,
      description: 'Monitoreo detallado de operaciones diarias con métricas de eficiencia',
      benefits: [
        'Control operativo en tiempo real',
        'Métricas de eficiencia',
        'Identificación de cuellos de botella',
        'Optimización de procesos'
      ],
      components: [
        { name: 'KPI Pedidos', config: { efficiency: true, status: 'detailed' } },
        { name: 'KPI Productos', config: { inventory: true, rotation: true } },
        { name: 'Tabla de Datos', config: { title: 'Pedidos Pendientes', realtime: true } },
        { name: 'Gráfico de Barras', config: { title: 'Productividad por Hora', hourly: true } },
        { name: 'Gráfico Circular', config: { title: 'Estados de Pedidos', status: true } },
        { name: 'Bloque de Texto', config: { title: 'Alertas Operativas', type: 'alerts' } }
      ],
      insights: [
        'Tiempo promedio de entrega: 28 min',
        'Eficiencia operativa: 92%',
        'Pico de demanda: 19:00-21:00'
      ],
      bestFor: 'Supervisión diaria, control de calidad, optimización operativa'
    },
    {
      id: 'inventario-avanzado',
      name: 'Análisis de Inventario Avanzado',
      category: 'operativo',
      icon: FaBuilding,
      difficulty: 'Avanzado',
      timeToCreate: '5 min',
      popularity: 78,
      rating: 4.6,
      description: 'Control exhaustivo de inventario con predicciones y alertas de reposición',
      benefits: [
        'Control total del inventario',
        'Predicciones de demanda',
        'Alertas de stock mínimo',
        'Optimización de compras'
      ],
      components: [
        { name: 'KPI Productos', config: { stock: true, rotation: true, alerts: true } },
        { name: 'Tabla de Datos', config: { title: 'Productos Críticos', alerts: true } },
        { name: 'Gráfico de Barras', config: { title: 'Rotación por Categoría', category: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Tendencia de Consumo', prediction: true } },
        { name: 'Gráfico Circular', config: { title: 'Distribución de Stock', percentage: true } },
        { name: 'Bloque de Texto', config: { title: 'Recomendaciones de Compra', type: 'recommendations' } }
      ],
      insights: [
        '15 productos bajo stock mínimo',
        'Rotación mejorada 23% vs mes anterior',
        'Predicción: reposición necesaria en 5 días'
      ],
      bestFor: 'Gestión de inventario, planificación de compras, control de costos'
    },

    // PLANTILLAS COMERCIALES
    {
      id: 'performance-ventas',
      name: 'Performance de Ventas',
      category: 'comercial',
      icon: FaChartLine,
      difficulty: 'Intermedio',
      timeToCreate: '3 min',
      popularity: 92,
      rating: 4.9,
      usage: 'Trending',
      description: 'Análisis detallado del rendimiento comercial con métricas de conversión',
      benefits: [
        'Análisis de conversión completo',
        'Identificación de oportunidades',
        'Métricas de performance',
        'Estrategias de crecimiento'
      ],
      components: [
        { name: 'KPI Ingresos', config: { conversion: true, growth: true } },
        { name: 'KPI Pedidos', config: { conversion: true, funnel: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Evolución de Ventas', trend: true } },
        { name: 'Gráfico de Barras', config: { title: 'Ventas por Canal', channel: true } },
        { name: 'Tabla de Datos', config: { title: 'Top Vendedores', ranking: true } },
        { name: 'Bloque de Texto', config: { title: 'Estrategias de Mejora', type: 'strategy' } }
      ],
      insights: [
        'Conversión web mejoró 18%',
        'Canal delivery creció 45%',
        'Meta mensual superada en 8%'
      ],
      bestFor: 'Análisis comercial, estrategias de venta, reuniones de ventas'
    },
    {
      id: 'competencia-mercado',
      name: 'Análisis Competitivo',
      category: 'comercial',
      icon: FaGlobe,
      difficulty: 'Avanzado',
      timeToCreate: '6 min',
      popularity: 75,
      rating: 4.5,
      description: 'Comparativa de mercado y posicionamiento competitivo con insights estratégicos',
      benefits: [
        'Posicionamiento vs competencia',
        'Análisis de precios',
        'Oportunidades de mercado',
        'Ventajas competitivas'
      ],
      components: [
        { name: 'KPI Ingresos', config: { marketShare: true, competition: true } },
        { name: 'Gráfico de Barras', config: { title: 'Market Share', competitive: true } },
        { name: 'Gráfico Circular', config: { title: 'Posicionamiento de Precios', pricing: true } },
        { name: 'Tabla de Datos', config: { title: 'Análisis Competitivo', comparison: true } },
        { name: 'Bloque de Texto', config: { title: 'Ventajas Competitivas', type: 'competitive' } },
        { name: 'Bloque de Texto', config: { title: 'Recomendaciones Estratégicas', type: 'strategy' } }
      ],
      insights: [
        'Lideramos en calidad-precio',
        'Oportunidad en delivery nocturno',
        'Ventaja competitiva en variedad'
      ],
      bestFor: 'Planificación estratégica, análisis de mercado, decisiones de precios'
    },

    // PLANTILLAS DE CLIENTE
    {
      id: 'comportamiento-cliente',
      name: 'Comportamiento del Cliente',
      category: 'cliente',
      icon: FaUserFriends,
      difficulty: 'Intermedio',
      timeToCreate: '4 min',
      popularity: 89,
      rating: 4.8,
      description: 'Análisis profundo del comportamiento de clientes con segmentación avanzada',
      benefits: [
        'Segmentación de clientes',
        'Patrones de compra',
        'Oportunidades de fidelización',
        'Personalización de ofertas'
      ],
      components: [
        { name: 'KPI Clientes', config: { segmentation: true, lifecycle: true } },
        { name: 'Gráfico Circular', config: { title: 'Segmentos de Clientes', segments: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Frecuencia de Compra', behavior: true } },
        { name: 'Tabla de Datos', config: { title: 'Clientes VIP', ranking: true } },
        { name: 'Gráfico de Barras', config: { title: 'Preferencias por Categoría', preferences: true } },
        { name: 'Bloque de Texto', config: { title: 'Insights de Comportamiento', type: 'insights' } }
      ],
      insights: [
        'Clientes VIP: 12% del total, 45% de ingresos',
        'Frecuencia promedio: 2.3 pedidos/mes',
        'Mayor actividad: viernes y sábados'
      ],
      bestFor: 'Marketing personalizado, estrategias de retención, segmentación'
    },
    {
      id: 'satisfaccion-cliente',
      name: 'Satisfacción y Retención',
      category: 'cliente',
      icon: FaStar,
      difficulty: 'Intermedio',
      timeToCreate: '3 min',
      popularity: 84,
      rating: 4.7,
      description: 'Métricas de satisfacción del cliente con análisis de retención y lealtad',
      benefits: [
        'Métricas de satisfacción',
        'Análisis de retención',
        'Identificación de detractores',
        'Estrategias de mejora'
      ],
      components: [
        { name: 'KPI Clientes', config: { satisfaction: true, retention: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Evolución Satisfacción', nps: true } },
        { name: 'Gráfico Circular', config: { title: 'Distribución NPS', nps: true } },
        { name: 'Tabla de Datos', config: { title: 'Feedback Reciente', feedback: true } },
        { name: 'Gráfico de Barras', config: { title: 'Satisfacción por Servicio', service: true } },
        { name: 'Bloque de Texto', config: { title: 'Plan de Acción', type: 'action_plan' } }
      ],
      insights: [
        'NPS Score: 72 (Excelente)',
        'Retención de clientes: 89%',
        'Área de mejora: tiempo de entrega'
      ],
      bestFor: 'Mejora de servicio, estrategias de retención, calidad del servicio'
    },

    // PLANTILLAS FINANCIERAS
    {
      id: 'analisis-financiero',
      name: 'Análisis Financiero Integral',
      category: 'financiero',
      icon: FaDollarSign,
      difficulty: 'Avanzado',
      timeToCreate: '5 min',
      popularity: 81,
      rating: 4.6,
      description: 'Análisis financiero completo con métricas de rentabilidad y proyecciones',
      benefits: [
        'Análisis de rentabilidad',
        'Control de costos',
        'Proyecciones financieras',
        'Métricas de eficiencia'
      ],
      components: [
        { name: 'KPI Ingresos', config: { profit: true, margin: true, costs: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Evolución P&L', financial: true } },
        { name: 'Gráfico de Barras', config: { title: 'Costos por Categoría', costs: true } },
        { name: 'Tabla de Datos', config: { title: 'Métricas Financieras', financial: true } },
        { name: 'Gráfico Circular', config: { title: 'Distribución de Gastos', expenses: true } },
        { name: 'Bloque de Texto', config: { title: 'Análisis de Rentabilidad', type: 'financial' } }
      ],
      insights: [
        'Margen bruto: 68.5%',
        'ROI: 24.8%',
        'Costos optimizados 12% vs trimestre anterior'
      ],
      bestFor: 'Reportes financieros, análisis de rentabilidad, control de costos'
    },
    {
      id: 'flujo-caja',
      name: 'Control de Flujo de Caja',
      category: 'financiero',
      icon: FaMoneyBillWave,
      difficulty: 'Intermedio',
      timeToCreate: '3 min',
      popularity: 77,
      rating: 4.4,
      description: 'Monitoreo de flujo de efectivo con proyecciones y alertas de liquidez',
      benefits: [
        'Control de liquidez',
        'Proyecciones de flujo',
        'Alertas de cash flow',
        'Planificación financiera'
      ],
      components: [
        { name: 'KPI Ingresos', config: { cashflow: true, liquidity: true } },
        { name: 'Gráfico de Líneas', config: { title: 'Flujo de Caja', cashflow: true } },
        { name: 'Gráfico de Barras', config: { title: 'Ingresos vs Egresos', comparison: true } },
        { name: 'Tabla de Datos', config: { title: 'Próximos Vencimientos', payments: true } },
        { name: 'Bloque de Texto', config: { title: 'Alertas de Liquidez', type: 'alerts' } },
        { name: 'Bloque de Texto', config: { title: 'Recomendaciones', type: 'financial_advice' } }
      ],
      insights: [
        'Liquidez actual: $125,400',
        'Próximo pago importante: 15 días',
        'Proyección positiva: +$18,200 este mes'
      ],
      bestFor: 'Control de tesorería, planificación de pagos, gestión de liquidez'
    }
  ];

  // Filtrar plantillas
  const filteredTemplates = professionalTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'todos' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Ordenar plantillas
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popularidad':
        return b.popularity - a.popularity;
      case 'rating':
        return b.rating - a.rating;
      case 'nombre':
        return a.name.localeCompare(b.name);
      case 'tiempo':
        return parseFloat(a.timeToCreate) - parseFloat(b.timeToCreate);
      default:
        return 0;
    }
  });

  const handleApplyTemplate = (template) => {
    // Aplicar la plantilla agregando todos sus componentes
    template.components.forEach((templateComponent, index) => {
      const component = componentsList.find(c => c.name === templateComponent.name);
      if (component) {
        setTimeout(() => {
          onSelectTemplate({
            ...component,
            ...templateComponent.config,
            templateId: template.id,
            templateName: template.name
          });
        }, index * 100); // Delay escalonado para mejor UX
      }
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Principiante': return '#10b981';
      case 'Intermedio': return '#f59e0b';
      case 'Avanzado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category) => {
    return templateCategories[category]?.color || '#6b7280';
  };

  return (
    <div className="report-templates">
      {/* Header con filtros */}
      <div className="templates-header">
        <div className="header-content">
          <h3>
            <FaRocket className="header-icon" />
            Plantillas Profesionales
          </h3>
          <p className="header-description">
            Comienza rápidamente con plantillas diseñadas por expertos para casos de uso específicos
          </p>
        </div>

        <div className="templates-filters">
          <div className="filter-group">
            <label>
              <FaFilter className="filter-icon" />
              Categoría
            </label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todas las categorías</option>
              {Object.entries(templateCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaSort className="filter-icon" />
              Ordenar por
            </label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="popularidad">Popularidad</option>
              <option value="rating">Rating</option>
              <option value="nombre">Nombre</option>
              <option value="tiempo">Tiempo de creación</option>
            </select>
          </div>

          <div className="search-group">
            <label>
              <FaSearch className="filter-icon" />
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Categorías rápidas */}
      <div className="category-pills">
        <button 
          className={`category-pill ${selectedCategory === 'todos' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('todos')}
        >
          <FaTags className="pill-icon" />
          Todas
        </button>
        {Object.entries(templateCategories).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <button 
              key={key}
              className={`category-pill ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
              style={{ '--category-color': category.color }}
            >
              <Icon className="pill-icon" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Grid de plantillas */}
      <div className="templates-grid">
        {sortedTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div key={template.id} className="template-card professional">
              {/* Header de la plantilla */}
              <div className="template-card-header">
                <div className="template-icon" style={{ '--icon-color': getCategoryColor(template.category) }}>
                  <Icon />
                </div>
                <div className="template-badges">
                  {template.usage && (
                    <span className="usage-badge">{template.usage}</span>
                  )}
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(template.difficulty) }}
                  >
                    {template.difficulty}
                  </span>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="template-content">
                <h4 className="template-title">{template.name}</h4>
                <p className="template-description">{template.description}</p>

                {/* Métricas */}
                <div className="template-metrics">
                  <div className="metric">
                    <FaStar className="metric-icon" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="metric">
                    <FaClock className="metric-icon" />
                    <span>{template.timeToCreate}</span>
                  </div>
                  <div className="metric">
                    <FaUsers className="metric-icon" />
                    <span>{template.popularity}%</span>
                  </div>
                </div>

                {/* Beneficios clave */}
                <div className="template-benefits">
                  <h5>Beneficios clave:</h5>
                  <ul>
                    {template.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                {/* Vista previa de componentes */}
                <div className="components-preview">
                  <span className="preview-label">Incluye {template.components.length} componentes:</span>
                  <div className="components-mini">
                    {template.components.slice(0, 5).map((comp, index) => (
                      <div 
                        key={index} 
                        className="component-mini"
                        title={comp.name}
                      >
                        {comp.name.includes('KPI') && <FaDollarSign />}
                        {comp.name.includes('Gráfico de Barras') && <FaChartBar />}
                        {comp.name.includes('Gráfico de Líneas') && <FaChartLine />}
                        {comp.name.includes('Gráfico Circular') && <FaChartPie />}
                        {comp.name.includes('Tabla') && <FaTable />}
                        {comp.name.includes('Texto') && <FaRegFileAlt />}
                      </div>
                    ))}
                    {template.components.length > 5 && (
                      <div className="component-mini more">
                        +{template.components.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Insights destacados */}
                {template.insights && (
                  <div className="template-insights">
                    <h5>Insights que obtendrás:</h5>
                    <div className="insights-list">
                      {template.insights.slice(0, 2).map((insight, index) => (
                        <div key={index} className="insight-item">
                          <FaInfoCircle className="insight-icon" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer con acciones */}
              <div className="template-footer">
                <div className="template-meta">
                  <span className="best-for">
                    <strong>Ideal para:</strong> {template.bestFor.split(',')[0]}
                  </span>
                </div>
                <div className="template-actions">
                  <button 
                    className="btn-template-preview"
                    title="Vista previa"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="btn-template-info"
                    title="Más información"
                  >
                    <FaInfoCircle />
                  </button>
                  <button 
                    className="btn-template-apply"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    <FaPlay />
                    Usar Plantilla
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedTemplates.length === 0 && (
        <div className="no-templates">
          <FaSearch className="no-templates-icon" />
          <h3>No se encontraron plantillas</h3>
          <p>Intenta cambiar los filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default ReportTemplates;
