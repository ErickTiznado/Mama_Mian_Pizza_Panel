import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import './avgTicket.css';

const API_URL = 'https://api.mamamianpizza.com';

const AvgTicket = ({ timePeriod = 'today', orderType = 'all' }) => {
    const [ticketMedio, setTicketMedio] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });

    const fetchTicketMedio = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/orders/statistics/tickets`);
            if (!response.ok) {
                throw new Error('Error al obtener la información');
            }
            
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            // Seleccionar los datos según el filtro de tiempo
            let ticketValue, percentage, isIncrease, comparisonText;
            
            switch (timePeriod) {
                case 'today':
                    ticketValue = parseFloat(data.daily.today);
                    percentage = data.daily.growthVsYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
                    break;
                case 'week':
                    ticketValue = parseFloat(data.weekly.currentWeek);
                    percentage = data.weekly.growthVsLastWeek;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde la semana pasada';
                    break;
                case 'month':
                    ticketValue = parseFloat(data.monthly.currentMonth);
                    percentage = data.monthly.growthVsLastMonth;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde el mes pasado';
                    break;
                default:
                    ticketValue = parseFloat(data.daily.today);
                    percentage = data.daily.growthVsYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
            }
            
            setTicketMedio(ticketValue);
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
        fetchTicketMedio();
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

    // Formatear el valor del ticket medio como moneda
    const formatCurrency = (value) => {
        return `$${parseFloat(value).toFixed(2)}`;
    };

    return (
        <div className="avgt__count__kpi__container">
            <div className="avgt__count__kpi__header">
                <h5>
                    Ticket Medio {getPeriodText()}
                </h5>
                <span>
                    <DollarSign size={16}/>
                </span>
            </div>
            <div className="avgt__count__kpi__body">
                <div className="avgt__count-value">{formatCurrency(ticketMedio)}</div>
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
            </div>
        </div>
    );
};

export default AvgTicket;