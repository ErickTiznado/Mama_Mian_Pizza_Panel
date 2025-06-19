import { useEffect, useState } from "react";
import {TrendingUp, TrendingDown, Package } from "lucide-react";
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';


const UnidadesVendidas = ({timePeriod = 'today', orderType = 'all' }) => {
    const [UnidadesVendidas, setUnidadesVendidas] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });

    const API_URL = 'https://api.mamamianpizza.com';

    const fetchUnidadesVendidas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/orders/statistics/units`);
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

            setUnidadesVendidas(ingresos);
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
        fetchUnidadesVendidas();
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
                <h5>Unidades Vendidas {getPeriodText()}</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <InfoTooltip
                        title="Unidades Vendidas"
                        content="El número total de productos individuales (pizzas, bebidas, acompañamientos, etc.) que se han vendido en el período seleccionado."
                        businessImpact="Esta métrica te ayuda a entender la demanda real de productos y la capacidad de producción necesaria. Un alto volumen de unidades significa mayor actividad operativa."
                        actionTips="Si las unidades son altas pero los ingresos bajos: revisa la estrategia de precios. Si ambos son bajos: enfócate en marketing y promociones. Usa esta data para planificar inventario y personal."
                        position="bottom"
                        size="small"
                    />
                    <Package size={16}/>
                </div>
            </div>            <div className="count__kpi__body">
                <div className="count-value">
                    {loading ? (
                        <span className="loading-text">Cargando...</span>
                    ) : error ? (
                        <span className="error-text">Error</span>
                    ) : (
                        new Intl.NumberFormat('es-MX').format(UnidadesVendidas || 0)
                    )}
                </div>
                {!loading && !error && (
                    <div className={`count-comparison ${comparison.isIncrease ? 'increase' : 'descrease'}`}>
                            {
                                comparison.percentage === 0 ? null : comparison.isIncrease ? (
                                    <TrendingUp size={16} />
                                ) : (
                                    <TrendingDown size={16} />
                                )
                            }                            <span>
                                {comparison.percentage === 0 
                                    ? `Sin cambios ${comparison.comparisonText}`
                                    : `${comparison.isIncrease ? '+' : '-'}${parseFloat(comparison.percentage).toFixed(1)}% ${comparison.comparisonText}`
                                }
                            </span>
                    </div>                )
                }
                {loading && <div className="loading-text">Cargando...</div>}
                {error && <div className="error-text">Error: {error}</div>}
            </div>
        </div>
    )
}

export default UnidadesVendidas;