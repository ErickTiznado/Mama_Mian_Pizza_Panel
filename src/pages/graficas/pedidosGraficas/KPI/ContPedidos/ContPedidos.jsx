import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, TrendingDown } from "lucide-react";
import './ContPedidos.css';

const API_URL = 'https://api.mamamianpizza.com';

const ContPedidos = ({ timePeriod = 'today', orderType = 'all' }) => {
    const [countPed, setCountPed] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });

    const fetchCountPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/orders/statistics`);
            if (!response.ok) {
                throw new Error('Error al obtener la información');
            }
            
            const data = await response.json();
            
            // Seleccionar los datos según el filtro de tiempo
            let count, percentage, isIncrease, comparisonText;
            
            switch (timePeriod) {
                case 'today':
                    count = data.daily.today;
                    percentage = data.daily.growthFromYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
                    break;
                case 'week':
                    count = data.weekly.currentWeek;
                    percentage = data.weekly.growthFromLastWeek;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde la semana pasada';
                    break;
                case 'month':
                    count = data.monthly.currentMonth;
                    percentage = data.monthly.growthFromLastMonth;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde el mes pasado';
                    break;
                default:
                    count = data.daily.today;
                    percentage = data.daily.growthFromYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
            }
            
            setCountPed(count);
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
    };

    useEffect(() => {
        fetchCountPedidos();
    }, [timePeriod, orderType]); // Re-fetch cuando los filtros cambien
    
    // Obtener el texto adecuado según el período seleccionado
    const getPeriodText = () => {
        switch (timePeriod) {
            case 'today':
                return 'de Hoy';
            case 'week':
                return 'Semanales';
            case 'month':
                return 'Este Mes';
            default:
                return '';
        }
    };

    return (
        <div className="count__kpi__container">
            <div className="count__kpi__header">
                <h5>
                    Pedidos Totales {getPeriodText()}
                </h5>
                <span>
                    <ShoppingBag size={16}/>
                </span>            </div>            <div className="count__kpi__body">
                <div className="count-value">{countPed || 0}</div>
                {!loading && !error && (
                    <div className={`count-comparison ${comparison.isIncrease ? 'increase' : 'decrease'}`}>
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

export default ContPedidos;