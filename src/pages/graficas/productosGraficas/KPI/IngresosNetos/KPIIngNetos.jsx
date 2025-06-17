import { useEffect, useState } from "react";
import {TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';
const IngresosNetos = ({timePeriod = 'today', orderType = 'all' }) => {
    const [IngresosNetos, setIngresosNetos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });

    const API_URL = 'https://api.mamamianpizza.com';

    const fetchIngresosNetos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/orders/statistics/income`);
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

            setIngresosNetos(ingresos);
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
        fetchIngresosNetos();
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
                <h5>Ingresos Netos {getPeriodText()}</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <InfoTooltip
                        title="Ingresos Netos"
                        content="Los ingresos netos representan el dinero total que ha generado tu pizzería por ventas en el período seleccionado, después de descuentos pero antes de gastos operativos."
                        businessImpact="Esta es la métrica más importante para evaluar el rendimiento financiero de tu pizzería. Un crecimiento constante en ingresos indica que tu negocio está sano y creciendo."
                        actionTips="Para aumentar ingresos: optimiza tu menú con productos de alto margen, implementa estrategias de venta cruzada, mejora el ticket promedio, y ajusta precios según la demanda del mercado."
                        position="bottom"
                        size="small"
                    />
                    <DollarSign size={16}/>
                </div>
            </div>
            <div className="count__kpi__body">
                <div className="count-value">
                    {IngresosNetos}
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

export default IngresosNetos;