import React, { useEffect, useState } from 'react';
import { Repeat, TrendingUp, TrendingDown } from "lucide-react";
import './TasaRetencion.css';

const API_URL = 'https://api.mamamianpizza.com';

const TasaRetencion = ({ timePeriod = 'all', orderType = 'all' }) => {
    const [tasaRetencion, setTasaRetencion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });    const fetchTasaRetencion = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/customers/unique-customers`);
            if (!response.ok) {
                throw new Error('Error al obtener la información de retención');
            }
            
            const data = await response.json();
            
            // Calcular tasa de retención basada en la distribución de frecuencia
            const frequencyDistribution = data.customerFrequencyDistribution;
            const totalCustomers = data.uniqueCustomers.total.count;
            
            // Clientes que han hecho más de 1 pedido
            const recurringCustomers = frequencyDistribution
                .filter(item => !item.range.includes('1 pedido'))
                .reduce((sum, item) => sum + item.customerCount, 0);
            
            const tasa = totalCustomers > 0 ? Math.round((recurringCustomers / totalCustomers) * 100) : 0;
            
            // Simular comparación
            const percentage = Math.floor(Math.random() * 15) + 3;
            const isIncrease = Math.random() > 0.3;
            
            let comparisonText;
            switch (timePeriod) {
                case 'today':
                    comparisonText = 'desde ayer';
                    break;
                case 'week':
                    comparisonText = 'desde la semana pasada';
                    break;
                case 'month':
                    comparisonText = 'desde el mes pasado';
                    break;
                default:
                    comparisonText = 'tasa de retención';
            }
            
            setTasaRetencion(tasa);
            setComparison({ percentage, isIncrease, comparisonText });
            
        } catch (error) {
            console.error('Error al obtener tasa de retención:', error);
            setError(error.message);
            setTasaRetencion(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasaRetencion();
    }, [timePeriod, orderType]);

    if (loading) {
        return (
            <div className="tasa-retencion-container">
                <div className="tasa-retencion-header">
                    <h3>Tasa de Retención</h3>
                    <Repeat className="tasa-retencion-icon" size={24} />
                </div>
                <div className="tasa-retencion-content">
                    <div className="tasa-retencion-loading">
                        <span className="loading-spinner"></span>
                        <p>Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tasa-retencion-container">
                <div className="tasa-retencion-header">
                    <h3>Tasa de Retención</h3>
                    <Repeat className="tasa-retencion-icon" size={24} />
                </div>
                <div className="tasa-retencion-content">
                    <div className="tasa-retencion-error">
                        <p>Error al cargar</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tasa-retencion-container">
            <div className="tasa-retencion-header">
                <h3>Tasa de Retención</h3>
                <Repeat className="tasa-retencion-icon" size={24} />
            </div>
            <div className="tasa-retencion-content">
                <div className="tasa-retencion-number">
                    {tasaRetencion}%
                </div>
                <div className={`tasa-retencion-comparison ${comparison.isIncrease ? 'positive' : 'negative'}`}>
                    {comparison.isIncrease ? (
                        <TrendingUp size={16} />
                    ) : (
                        <TrendingDown size={16} />
                    )}
                    <span>{Math.abs(comparison.percentage)}% {comparison.comparisonText}</span>
                </div>
            </div>
        </div>
    );
};

export default TasaRetencion;
