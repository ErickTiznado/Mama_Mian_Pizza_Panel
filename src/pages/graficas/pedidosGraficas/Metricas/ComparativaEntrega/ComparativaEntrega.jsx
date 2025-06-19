import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Home, Truck, TrendingUp, Award } from 'lucide-react';
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';
import './ComparativaEntrega.css';

const API_URL = 'https://api.mamamianpizza.com';

const ComparativaEntrega = ({ timePeriod = 'today' }) => {
    const [data, setData] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [insights, setInsights] = useState({});    // Colores según la paleta de la aplicación
    const COLORS = {
        'local': '#22c55e',     // Verde para local (recogida)
        'domicilio': '#f97316'  // Naranja para domicilio (entrega)
    };

    // Procesar datos de pedidos según método de entrega
    const procesarDatosEntrega = (pedidos) => {
        let localCount = 0;
        let domicilioCount = 0;

        pedidos.forEach(pedido => {
            // Verificar si existe el campo metodo_entrega en los detalles
            if (pedido.detalles && pedido.detalles.length > 0) {
                const metodoEntrega = pedido.detalles[0].metodo_entrega;
                if (metodoEntrega === 0) {
                    localCount++;
                } else if (metodoEntrega === 1) {
                    domicilioCount++;
                }
            }
        });

        const total = localCount + domicilioCount;
        
        const chartData = [
            {
                name: 'En Local',
                value: localCount,
                percentage: total > 0 ? Math.round((localCount / total) * 100) : 0,
                color: COLORS.local
            },
            {
                name: 'A Domicilio',
                value: domicilioCount,
                percentage: total > 0 ? Math.round((domicilioCount / total) * 100) : 0,
                color: COLORS.domicilio
            }
        ];

        return {
            chartData,
            insights: {
                total,
                localCount,
                domicilioCount,
                localPercentage: total > 0 ? Math.round((localCount / total) * 100) : 0,
                domicilioPercentage: total > 0 ? Math.round((domicilioCount / total) * 100) : 0,
                preferredMethod: localCount > domicilioCount ? 'local' : 'domicilio'
            }
        };
    };

    // Obtener fechas según el período seleccionado
    const obtenerFechasSegunPeriodo = () => {
        const hoy = new Date();
        let inicio, fin;

        switch (timePeriod) {
            case 'today':
                inicio = new Date(hoy);
                inicio.setHours(0, 0, 0, 0);
                fin = new Date(hoy);
                fin.setHours(23, 59, 59, 999);
                break;
            case 'week':
                inicio = new Date(hoy);
                inicio.setDate(hoy.getDate() - 6);
                inicio.setHours(0, 0, 0, 0);
                fin = new Date(hoy);
                fin.setHours(23, 59, 59, 999);
                break;
            case 'month':
                inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
                fin.setHours(23, 59, 59, 999);
                break;
            default:
                inicio = new Date(hoy);
                inicio.setHours(0, 0, 0, 0);
                fin = new Date(hoy);
                fin.setHours(23, 59, 59, 999);
        }

        return { inicio, fin };
    };

    // Cargar datos de pedidos
    const cargarDatosPedidos = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/orders/orders`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de pedidos');
            }

            const pedidos = await response.json();
            console.log("Pedidos cargados para comparativa de entrega:", pedidos);

            // Filtrar pedidos según el período seleccionado
            const { inicio, fin } = obtenerFechasSegunPeriodo();
            
            const pedidosFiltrados = pedidos.filter(pedido => {
                const fechaPedido = new Date(pedido.fecha_pedido);
                return fechaPedido >= inicio && fechaPedido <= fin;
            });

            console.log("Pedidos filtrados:", pedidosFiltrados);

            // Procesar datos
            const { chartData, insights: processedInsights } = procesarDatosEntrega(pedidosFiltrados);
            
            setData(chartData);
            setTotalOrders(processedInsights.total);
            setInsights(processedInsights);
            setLoading(false);

        } catch (err) {
            console.error('Error al cargar los datos:', err);
            setError('No se pudieron cargar los datos de pedidos. Inténtelo nuevamente más tarde.');
            setLoading(false);
        }
    };

    // Efecto para cargar datos cuando cambia el período
    useEffect(() => {
        console.log("Período cambiado a:", timePeriod);
        cargarDatosPedidos();
    }, [timePeriod]);

    // Tooltip personalizado
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="comparativa-tooltip">
                    <p className="tooltip-label">{data.name}</p>
                    <p className="tooltip-value">
                        <span>Pedidos:</span> {data.value}
                    </p>
                    <p className="tooltip-percentage">
                        <span>Porcentaje:</span> {data.payload.percentage}%
                    </p>
                </div>
            );
        }
        return null;
    };

    // Renderizar label personalizado para el gráfico
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="16"
                fontWeight="600"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Obtener el texto del período
    const getPeriodText = () => {
        switch (timePeriod) {
            case 'today':
                return 'Hoy';
            case 'week':
                return 'Esta Semana';
            case 'month':
                return 'Este Mes';
            default:
                return '';
        }
    };

    return (
        <div className="comparativa-entrega-container">            <div className="comparativa-entrega-header">
                <h2 className="comparativa-entrega-title">
                    Comparativa de Entrega {getPeriodText()}
                </h2>                <InfoTooltip
                    title="Comparativa de Entrega"
                    content="Este gráfico muestra la distribución de pedidos entre entregas a domicilio y pedidos para recoger en local."
                    businessImpact="Conocer la distribución te permite optimizar personal de reparto y mejorar la experiencia del cliente."
                    actionTips="• Analiza las tendencias para optimizar recursos • Ajusta promociones según preferencias"
                    position="right"
                    size="small"
                    variant="simple"
                />
            </div>

            <div className="comparativa-entrega-content">
                {loading ? (
                    <div className="loading-message">Cargando datos...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : totalOrders === 0 ? (
                    <div className="no-data-message">No hay datos disponibles para el período seleccionado</div>                ) : (
                    <div className="chart-and-stats">
                        {/* Gráfico de torta */}                        <div className="pie-chart-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={120}
                                        innerRadius={45}
                                        fill="#8884d8"
                                        dataKey="value"
                                        animationDuration={800}
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />                                    <Legend 
                                        verticalAlign="bottom"
                                        height={50}
                                        iconType="circle"
                                        wrapperStyle={{ 
                                            paddingTop: '25px',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Estadísticas */}
                        <div className="stats-container">
                            <div className="stat-card-row">
                                <div className="stat-card local">                                    <div className="stat-header">
                                        <div className="stat-icon">
                                            <Home size={20} />
                                        </div>
                                        <h4>En Local</h4>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-number">{insights.localCount}</div>
                                        <div className="stat-percentage">{insights.localPercentage}%</div>
                                        <div className="stat-label">pedidos recogidos</div>
                                    </div>
                                </div>

                                <div className="stat-card domicilio">                                    <div className="stat-header">
                                        <div className="stat-icon">
                                            <Truck size={20} />
                                        </div>
                                        <h4>A Domicilio</h4>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-number">{insights.domicilioCount}</div>
                                        <div className="stat-percentage">{insights.domicilioPercentage}%</div>
                                        <div className="stat-label">pedidos entregados</div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card-row">                                <div className="stat-card total">                                    <div className="stat-header">
                                        <div className="stat-icon total-icon">
                                            <TrendingUp size={20} />
                                        </div>
                                        <h4>Total</h4>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-number total-number">{totalOrders}</div>
                                        <div className="stat-label">pedidos {getPeriodText().toLowerCase()}</div>
                                    </div>
                                </div>                                <div className="stat-card preferred">                                    <div className="stat-header">
                                        <div className="stat-icon preferred-icon">
                                            <Award size={20} />
                                        </div>
                                        <h4>Método Preferido</h4>
                                    </div>
                                    <div className="stat-content">                                        <div className="preferred-method">
                                            {insights.preferredMethod === 'local' ? (
                                                <>
                                                    <Home size={16} />
                                                    <span>En Local</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Truck size={16} />
                                                    <span>A Domicilio</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparativaEntrega;
