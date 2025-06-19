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
            
            // Usar el endpoint específico de segmentación
            const response = await fetch(`${API_URL}/api/segmentacion/`);
            if (!response.ok) {
                throw new Error('Error al obtener datos de segmentación');
            }
            
            const data = await response.json();
            
            // Procesar los datos reales del API
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
    };// Función para generar datos de muestra de segmentación
    const generateSampleSegmentData = () => {
        return [
            { segment: 'Nuevos (1 pedido)', customers: 168, avgValue: 35.50, totalValue: 5964, color: '#94a3b8', percentage: 51.9 },
            { segment: 'Ocasionales (2-3)', customers: 89, avgValue: 78.25, totalValue: 6964, color: '#3b82f6', percentage: 27.5 },
            { segment: 'Habituales (4-6)', customers: 52, avgValue: 142.80, totalValue: 7426, color: '#10b981', percentage: 16.0 },
            { segment: 'Leales (7+)', customers: 28, avgValue: 284.60, totalValue: 7969, color: '#8b5cf6', percentage: 8.6 }
        ];
    };    // Función para procesar los datos reales del API
    const processSegmentData = (apiData) => {
        const { segments, totalCustomers } = apiData;
        
        // Procesar cada segmento con los datos reales del API
        return segments.map(segment => ({
            segment: segment.segment,
            customers: segment.customers,
            avgValue: parseFloat(segment.avgValue),
            totalValue: parseFloat(segment.totalValue),
            color: segment.color,
            percentage: segment.percentage
        }));
    };    useEffect(() => {
        fetchSegmentValueData();
    }, [timePeriod]);

    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    // Función para generar insights inteligentes basados en los datos reales
    const generateSmartInsights = (segmentData) => {
        if (!segmentData || segmentData.length === 0) return [];

        const insights = [];
        const totalCustomers = segmentData.reduce((sum, segment) => sum + segment.customers, 0);
        const totalRevenue = segmentData.reduce((sum, segment) => sum + segment.totalValue, 0);

        segmentData.forEach(segment => {
            const revenuePercentage = ((segment.totalValue / totalRevenue) * 100).toFixed(1);
            
            switch (segment.segment) {
                case 'Nuevos (1 pedido)':
                    insights.push({
                        type: segment.percentage > 70 ? 'critical' : segment.percentage > 50 ? 'opportunity' : 'success',
                        title: segment.segment,
                        content: generateNewCustomerInsight(segment, revenuePercentage, totalCustomers)
                    });
                    break;
                    
                case 'Ocasionales (2-3)':
                    insights.push({
                        type: segment.percentage < 15 ? 'opportunity' : 'success',
                        title: segment.segment,
                        content: generateOccasionalInsight(segment, revenuePercentage)
                    });
                    break;
                    
                case 'Habituales (4-6)':
                    insights.push({
                        type: segment.percentage > 0 ? 'action' : 'opportunity',
                        title: segment.segment,
                        content: generateRegularInsight(segment, revenuePercentage)
                    });
                    break;
                    
                case 'Leales (7+)':
                    insights.push({
                        type: segment.percentage < 10 ? 'critical' : 'success',
                        title: segment.segment,
                        content: generateLoyalInsight(segment, revenuePercentage)
                    });
                    break;
                    
                default:
                    // Para cualquier otro segmento que pueda aparecer
                    insights.push({
                        type: 'action',
                        title: segment.segment,
                        content: `Este segmento representa ${segment.percentage}% de clientes (${segment.customers}) con valor promedio de ${formatCurrency(segment.avgValue)}.`
                    });
            }
        });

        return insights;
    };

    const generateNewCustomerInsight = (segment, revenuePercentage, totalCustomers) => {
        if (segment.percentage > 80) {
            return `¡ALERTA! El ${segment.percentage}% de tus clientes (${segment.customers} de ${totalCustomers}) son nuevos, pero solo generan el ${revenuePercentage}% de ingresos. <strong>Acción urgente:</strong> Implementa campañas de retención inmediatas y seguimiento personalizado.`;
        } else if (segment.percentage > 60) {
            return `Tienes ${segment.customers} clientes nuevos (${segment.percentage}%) con valor promedio de ${formatCurrency(segment.avgValue)}. <strong>Oportunidad:</strong> Programa seguimiento automático en 48-72 horas con descuentos del 15-20%.`;
        } else if (segment.percentage > 40) {
            return `Balance saludable: ${segment.customers} nuevos clientes (${segment.percentage}%) generan ${revenuePercentage}% de ingresos. <strong>Mantén:</strong> Calidad en primera experiencia y programa de bienvenida.`;
        } else {
            return `Excelente retención: Solo ${segment.percentage}% son clientes nuevos. <strong>Continúa:</strong> Tu estrategia de fidelización está funcionando muy bien.`;
        }
    };

    const generateOccasionalInsight = (segment, revenuePercentage) => {
        if (segment.customers === 0) {
            return `No tienes clientes ocasionales actualmente. <strong>Oportunidad:</strong> Enfócate en convertir a los nuevos clientes con promociones de "segunda compra" atractivas.`;
        } else if (segment.percentage < 10) {
            return `Solo ${segment.customers} clientes ocasionales (${segment.percentage}%). <strong>Estrategia:</strong> Aumenta conversión de nuevos a ocasionales con ofertas personalizadas y recordatorios cada 10-14 días.`;
        } else {
            return `${segment.customers} clientes ocasionales (${segment.percentage}%) con valor promedio de ${formatCurrency(segment.avgValue)}. <strong>Optimiza:</strong> Programa promociones quincenales para convertirlos en habituales.`;
        }
    };

    const generateRegularInsight = (segment, revenuePercentage) => {
        if (segment.customers === 0) {
            return `Sin clientes habituales detectados. <strong>Prioridad:</strong> Desarrolla programa de fidelización para convertir ocasionales en habituales con beneficios progresivos.`;
        } else {
            return `${segment.customers} clientes habituales (${segment.percentage}%) con excelente valor promedio de ${formatCurrency(segment.avgValue)}. <strong>Mantén:</strong> Calidad consistente y tiempos de entrega. Son tu base más estable.`;
        }
    };

    const generateLoyalInsight = (segment, revenuePercentage) => {
        if (segment.customers === 0) {
            return `Sin clientes leales identificados. <strong>Oportunidad:</strong> Crea programa VIP para clientes con 7+ pedidos. Implementa sistema de puntos y beneficios exclusivos.`;
        } else if (segment.percentage < 5) {
            return `Solo ${segment.customers} cliente${segment.customers > 1 ? 's' : ''} leal${segment.customers > 1 ? 'es' : ''} (${segment.percentage}%) pero con alto valor: ${formatCurrency(segment.avgValue)}. <strong>Acción VIP:</strong> Programa de referidos y beneficios exclusivos.`;
        } else {
            return `Excelente: ${segment.customers} clientes leales (${segment.percentage}%) con valor premium de ${formatCurrency(segment.avgValue)}. <strong>Expande:</strong> Programa de embajadores y referencias para multiplicar este segmento.`;
        }
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
                                {generateSmartInsights(lifetimeValueData).map((insight, index) => (
                                    <div key={index} className={`recommendation-item ${insight.type}`}>
                                        <div className="rec-header">
                                            <DollarSign size={16} />
                                            <strong>{insight.title}</strong>
                                        </div>
                                        <p dangerouslySetInnerHTML={{ __html: insight.content }}></p>
                                    </div>
                                ))}
                                
                                {/* Insight adicional basado en el análisis general */}
                                {lifetimeValueData.length > 0 && (
                                    <div className="recommendation-item summary">
                                        <div className="rec-header">
                                            <DollarSign size={16} />
                                            <strong>Análisis General</strong>
                                        </div>
                                        <p>
                                            <strong>Total de clientes:</strong> {lifetimeValueData.reduce((sum, segment) => sum + segment.customers, 0)} • 
                                            <strong> Valor total:</strong> {formatCurrency(lifetimeValueData.reduce((sum, segment) => sum + segment.totalValue, 0))} • 
                                            <strong> Valor promedio general:</strong> {formatCurrency(lifetimeValueData.reduce((sum, segment) => sum + segment.totalValue, 0) / lifetimeValueData.reduce((sum, segment) => sum + segment.customers, 0))}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvolucionClientes;
