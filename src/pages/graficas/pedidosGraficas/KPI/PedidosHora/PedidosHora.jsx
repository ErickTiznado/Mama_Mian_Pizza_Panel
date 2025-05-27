import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import './PedidosHora.css';

const API_URL = 'https://server.tiznadodev.com';

const PedidosHora = ({ timePeriod = 'today', orderType = 'all' }) => {
    const [pedidosHora, setPedidosHora] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });

    const fetchPedidosHora = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/orders/statistics/averages`);
            if (!response.ok) {
                throw new Error('Error al obtener la información');
            }
            
            const data = await response.json();
            console.log('Datos obtenidos para pedidos por hora:', data);
            // Seleccionar los datos según el filtro de tiempo
            let pedidosValue, percentage, isIncrease, comparisonText;
            
            switch (timePeriod) {
                case 'today':
                    pedidosValue = parseFloat(data.hourly.current24Hours);
                    percentage = data.hourly.growthFromYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
                    break;
                case 'week':
                    pedidosValue = parseFloat(data.daily.currentWeekAvg);
                    percentage = data.daily.growthFromLastWeek;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde la semana pasada';
                    break;
                case 'month':
                    pedidosValue = parseFloat(data.weekly.currentMonthAvg);
                    percentage = data.weekly.growthFromLastMonth;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde el mes pasado';
                    break;
                default:
                    pedidosValue = parseFloat(data.hourly.current24Hours);
                    percentage = data.hourly.growthFromYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
            }            
            setPedidosHora(pedidosValue);
            setComparison({
                percentage: Math.abs(percentage), // Guardamos el valor absoluto para la visualización
                isIncrease: isIncrease,
                comparisonText: comparisonText
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener la información', error);
            setError('No se pudo cargar la información');
            setLoading(false);
        }
    };    useEffect(() => {
        fetchPedidosHora();
    }, [timePeriod, orderType]); // Re-fetch cuando los filtros cambien
    
    // Obtener el texto adecuado según el período seleccionado
    const getPeriodText = () => {
        switch (timePeriod) {
            case 'today':
                return 'de Hoy';
            case 'week':
                return 'Semanal';
            case 'month':
                return 'Este Mes';
            default:
                return '';
        }
    };

    // Formatear el valor de pedidos por hora
    const formatValue = (value) => {
        return parseFloat(value).toFixed(2);
    };    return (
        <div className="avgt__count__kpi__container">
            <div className="avgt__count__kpi__header">
                <h5>
                    Pedidos por Hora {getPeriodText()}
                </h5>
                <span>
                    <Clock size={16}/>
                </span>
            </div>
            <div className="avgt__count__kpi__body">
                <div className="avgt__count-value">{formatValue(pedidosHora)}</div>
                {!loading && !error && (
                    <div className={`avgt__count-comparison ${comparison.isIncrease ? 'increase' : 'decrease'}`}>
                        {comparison.percentage === 0 ? null : comparison.isIncrease ? (
                            <TrendingUp size={16} />
                        ) : (
                            <TrendingDown size={16} />
                        )}
                        <span>
                            {comparison.percentage === 0 
                                ? `Sin cambios ${comparison.comparisonText}`
                                : `${comparison.isIncrease ? '+' : '-'}${comparison.percentage}% ${comparison.comparisonText}`
                            }
                        </span>
                    </div>
                )}
                {loading && <p>Cargando...</p>}
                {error && <div className="error-text">{error}</div>}
            </div>
        </div>
    );
};

export default PedidosHora;