import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';
import './EvolucionClientes.css';

const API_URL = 'https://api.mamamianpizza.com';

const EvolucionClientes = ({ timePeriod = 'all' }) => {
    const [lifetimeValueData, setLifetimeValueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInsights, setShowInsights] = useState(false);const fetchSegmentValueData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Usar el endpoint de clientes únicos para obtener datos de segmentación
            const response = await fetch(`${API_URL}/api/customers/unique-customers`);
            if (!response.ok) {
                throw new Error('Error al obtener datos de segmentación');
            }
            
            const data = await response.json();
            
            // Procesar los datos para generar análisis de valor por segmento
            const processedData = processSegmentData(data);
            setLifetimeValueData(processedData);

        } catch (error) {
            console.error('Error al obtener datos de segmentación:', error);
            setError(error.message);
            
            // Datos de muestra en caso de error para demostrar la funcionalidad
            const sampleData = generateSampleSegmentData();
            setLifetimeValueData(sampleData);
        } finally {
            setLoading(false);
        }
    };    // Función para generar datos de muestra de segmentación
    const generateSampleSegmentData = () => {
        return [
            { segment: 'Nuevos (1 pedido)', customers: 168, avgValue: 35.50, totalValue: 5964, color: '#94a3b8', percentage: 51.9 },
            { segment: 'Ocasionales (2-3)', customers: 89, avgValue: 78.25, totalValue: 6964, color: '#3b82f6', percentage: 27.5 },
            { segment: 'Habituales (4-6)', customers: 52, avgValue: 142.80, totalValue: 7426, color: '#10b981', percentage: 16.0 },
            { segment: 'Leales (7+)', customers: 28, avgValue: 284.60, totalValue: 7969, color: '#8b5cf6', percentage: 8.6 }
        ];
    };

    // Función para procesar los datos reales del API (cuando esté disponible)
    const processSegmentData = (apiData) => {
        const { uniqueCustomers, customerFrequencyDistribution } = apiData;
        
        // En una implementación real, aquí procesarías los datos del API
        // Por ahora, generamos datos de muestra basados en la estructura real
        return generateSampleSegmentData();
    };    useEffect(() => {
        fetchSegmentValueData();
    }, [timePeriod]);

    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };if (loading) {
        return (
            <div className="evolucion-clientes-container">
                <div className="evolucion-clientes-header">
                    <h3>
                        <DollarSign className="header-icon" size={20} />
                        Análisis de Valor por Segmento
                    </h3>
                    <p>Segmentación de clientes por valor y frecuencia de compra</p>
                </div>
                <div className="evolucion-clientes-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando análisis de valor por segmento...</p>
                </div>
            </div>
        );
    }    if (error) {
        return (
            <div className="evolucion-clientes-container">
                <div className="evolucion-clientes-header">
                    <h3>
                        <DollarSign className="header-icon" size={20} />
                        Análisis de Valor por Segmento
                    </h3>
                    <p>Error al cargar los datos</p>
                </div>                <div className="evolucion-clientes-error">
                    <p>No se pudieron cargar los datos del análisis de valor</p>
                    <button onClick={fetchSegmentValueData} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }return (
        <div className="evolucion-clientes-container">
            <div className="evolucion-clientes-header">                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3>
                        <DollarSign className="header-icon" size={20} />
                        Análisis de Valor por Segmento
                    </h3>
                    <InfoTooltip
                        title="Análisis de Valor por Segmento"
                        content="Segmentación inteligente de tus clientes basada en su frecuencia de compra y análisis del valor económico que aporta cada segmento a tu pizzería."
                        businessImpact="Esta segmentación te permite identificar a tus clientes más valiosos, calcular el retorno de inversión en marketing y diseñar estrategias específicas para maximizar el valor de cada grupo de clientes."
                        actionTips="• Enfócate en convertir clientes 'Nuevos' en 'Ocasionales' con seguimiento post-compra
• Usa promociones frecuentes para que 'Ocasionales' se vuelvan 'Habituales'
• Mantén la excelencia para retener a los 'Habituales'
• Crea programas VIP y de referidos para los clientes 'Leales'"
                        position="bottom"
                    />
                </div>
                <p>Segmentación de clientes por valor y frecuencia de compra</p>
            </div>            <div className="evolucion-clientes-content">
                {/* Análisis de valor por segmento */}
                <div className="lifetime-value-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <h4>Segmentación por Valor de Cliente</h4>
                        <InfoTooltip
                            title="Segmentación por Valor de Cliente"
                            content="Análisis que segmenta a tus clientes según su frecuencia de compra y muestra el valor económico promedio y total que aporta cada segmento a tu pizzería."
                            businessImpact="Entender el valor de cada segmento te permite enfocar tus recursos en los clientes más rentables, diseñar estrategias específicas para cada grupo y calcular el retorno de inversión en marketing y retención."
                            actionTips="• Clientes 'Nuevos': Implementa campañas de seguimiento para convertirlos en ocasionales
• Clientes 'Ocasionales': Usa promociones personalizadas para aumentar frecuencia
• Clientes 'Habituales': Mantén la calidad y consistencia para retenerlos
• Clientes 'Leales': Crea programas VIP y busca que recomienden tu pizzería"
                            position="bottom"
                        />
                    </div>
                    <div className="value-segments">
                        {lifetimeValueData.map((segment, index) => (
                            <div key={index} className="value-segment">
                                <div className="segment-header">
                                    <div 
                                        className="segment-indicator"
                                        style={{ backgroundColor: segment.color }}
                                    ></div>
                                    <span className="segment-name">{segment.segment}</span>
                                    <span className="segment-percentage">({segment.percentage}%)</span>
                                </div>
                                <div className="segment-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Clientes</span>
                                        <span className="metric-value">{segment.customers.toLocaleString()}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Valor Promedio</span>
                                        <span className="metric-value">{formatCurrency(segment.avgValue)}</span>
                                    </div>
                                    <div className="metric primary">
                                        <span className="metric-label">Valor Total</span>
                                        <span className="metric-value">{formatCurrency(segment.totalValue)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>                </div>

                {/* Toggle para Insights y recomendaciones */}
                <div className="insights-toggle-container">
                    <button 
                        className="insights-toggle-btn"
                        onClick={() => setShowInsights(!showInsights)}
                        aria-expanded={showInsights}
                    >
                        <div className="toggle-content">
                            <div className="toggle-left">
                                <Lightbulb size={18} />
                                <span>Insights Inteligentes & Recomendaciones</span>
                            </div>
                            <div className="toggle-right">
                                {showInsights ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                        </div>
                    </button>
                    
                    {showInsights && (
                        <div className="insights-content">
                            <div className="recommendation-grid">
                                <div className="recommendation-item opportunity">
                                    <div className="rec-header">
                                        <DollarSign size={16} />
                                        <strong>Nuevos Clientes (1 pedido)</strong>
                                    </div>
                                    <p>Representan el 52% de tu base pero solo el 21% de ingresos. <strong>Oportunidad clave:</strong> Implementa seguimiento automático a las 48-72 horas post-compra con ofertas personalizadas.</p>
                                </div>
                                
                                <div className="recommendation-item success">
                                    <div className="rec-header">
                                        <DollarSign size={16} />
                                        <strong>Ocasionales (2-3 pedidos)</strong>
                                    </div>
                                    <p>Balance ideal entre volumen y valor. <strong>Estrategia:</strong> Usa promociones frecuentes (cada 2 semanas) y recordatorios para mantener el momentum y convertirlos en habituales.</p>
                                </div>
                                
                                <div className="recommendation-item action">
                                    <div className="rec-header">
                                        <DollarSign size={16} />
                                        <strong>Habituales (4-6 pedidos)</strong>
                                    </div>
                                    <p>Alta conversión y valor promedio excelente. <strong>Mantén:</strong> Calidad consistente, tiempos de entrega y servicio al cliente. Son la base sólida de tu negocio.</p>
                                </div>
                                
                                <div className="recommendation-item critical">
                                    <div className="rec-header">
                                        <DollarSign size={16} />
                                        <strong>Leales (7+ pedidos)</strong>
                                    </div>
                                    <p>Máximo valor per cápita pero pocos clientes. <strong>Acción VIP:</strong> Crea programa de beneficios exclusivos y pídeles que recomienden tu pizzería a amigos.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvolucionClientes;
