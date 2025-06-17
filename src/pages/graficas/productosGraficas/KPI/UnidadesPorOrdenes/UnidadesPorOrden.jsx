import { useEffect, useState } from "react";
import {TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';


const UnidadesPorOrden = ({timePeriod = 'today', orderType = 'all' }) => {
    const [UnidadespOrden, setUnidadespOrden] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });

    const API_URL = 'https://api.mamamianpizza.com';

    const fetchUnidadespOrden = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/orders/statistics/units-per-order`);
            if(!response.ok){
                throw new Error('Error al obtener la información');
            }

            const data = await response.json();

            let ingresos, percentage, isIncrease, comparisonText;
            switch (timePeriod) {
                case 'today':
                    ingresos = data.daily.today;
                    percentage = data.daily.growthFromYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
                    break;
                case 'week':
                    ingresos = data.weekly.currentWeek;
                    percentage = data.weekly.growthFromLastWeek;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde la semana pasada';
                    break;
                case 'month':
                    ingresos = data.monthly.currentMonth;
                    percentage = data.monthly.growthFromLastMonth;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde el mes pasado';
                    break;
                default:
                    ingresos = data.daily.today;
                    percentage = data.daily.growthFromYesterday;
                    isIncrease = percentage >= 0;
                    comparisonText = 'desde ayer';
            }

            setUnidadespOrden(ingresos);
            console.log(ingresos);
            setComparison({
                percentage: Math.abs(percentage), // Guardamos el valor absoluto para la visualización
                isIncrease: isIncrease,
                comparisonText: comparisonText
            });
            setLoading(false);
        }catch (error) {
            console.error('Error al obtener la informacion', error);
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchUnidadespOrden();
    }, [timePeriod, orderType]);

    const getPeriodText = () => {
        switch (timePeriod) {
            case 'today':
                return 'de Hoy';
            case 'week':
                return 'de Esta Semana';
            case 'month':
                return 'de Este Mes';
            default:
                return '';
        }
    }

    return (
        <div className="count__kpi__container">            <div className="count__kpi__header">
                <h5>Unidades por Orden {getPeriodText()}</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <InfoTooltip
                        title="Unidades por Orden"
                        content="El promedio de productos que incluye cada pedido. Por ejemplo, si un cliente pide 2 pizzas y 1 bebida, son 3 unidades por esa orden."
                        businessImpact="Un mayor número de unidades por orden indica que los clientes están comprando más productos en cada pedido, lo que aumenta el valor de cada transacción y mejora la eficiencia operativa."
                        actionTips="Para aumentar unidades por orden: sugiere combos, implementa ofertas de 'segunda pizza con descuento', promociona acompañamientos, y capacita al personal en técnicas de venta cruzada."
                        position="bottom"
                        size="small"
                    />
                    <BarChart3 size={16}/>
                </div>
            </div>
            <div className="count__kpi__body">
                <div className="count-value">
                    {UnidadespOrden}
                </div>
                {!loading && !error && (
                    <div className={`count-comparison ${comparison.isIncrease ? 'increase' : 'descrease'}`}>
                            {
                                comparison.percentage === 0 ? null : comparison.isIncrease ? (
                                    <TrendingUp size={16} />
                                ) : (
                                    <TrendingDown size={16} />
                                )
                            }
                            <span>
                                {comparison.percentage === 0 
                                    ? `Sin cambios ${comparison.comparisonText}`
                                    : `${comparison.isIncrease ? '+' : '-'}${comparison.percentage}% ${comparison.comparisonText}`
                                }
                            </span>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default UnidadesPorOrden;