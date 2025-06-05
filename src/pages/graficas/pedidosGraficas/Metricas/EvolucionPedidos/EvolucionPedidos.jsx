// filepath: c:\Users\Precision 7520\Documents\Programacion\MamaMianPizza\src\pages\graficas\pedidosGraficas\Metricas\EvolucionPedidos\EvolucionPedidos.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './EvolucionPedidos.css';

const API_URL = 'https://api.mamamianpizza.com';

const EvolucionPedidos = ({ timePeriod = 'month' }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    // Función para procesar los datos de los pedidos según el periodo seleccionado
    const procesarDatos = (pedidos) => {
        switch (timePeriod) {
            case 'today':
                return procesarDatosPorHora(pedidos);
            case 'week':
                return procesarDatosPorDia(pedidos);
            case 'month':
            default:
                return procesarDatosPorMes(pedidos);
        }
    };

    // Función para procesar los datos de los pedidos y agruparlos por hora (para "Hoy")
    const procesarDatosPorHora = (pedidos) => {
        // Inicializar un objeto para almacenar pedidos por hora (24 horas)
        const pedidosPorHora = {};
        
        // Inicializar todas las horas del día para asegurar que aparezcan en el gráfico
        for (let i = 0; i < 24; i++) {
            const horaFormateada = String(i).padStart(2, '0');
            pedidosPorHora[horaFormateada] = {
                key: horaFormateada,
                mes: `${horaFormateada}:00`, // Usamos "mes" como etiqueta en el gráfico
                hora: i,
                cantidad: 0
            };
        }
        
        // Agrupar los pedidos por hora
        pedidos.forEach(pedido => {
            const fecha = new Date(pedido.fecha_pedido);
            const hora = fecha.getHours();
            const horaKey = String(hora).padStart(2, '0');
            
            // Incrementar el contador para esa hora
            if (pedidosPorHora[horaKey]) {
                pedidosPorHora[horaKey].cantidad += 1;
            }
        });
        
        // Convertir a array y ordenar por hora
        const resultado = Object.values(pedidosPorHora).sort((a, b) => a.hora - b.hora);
        return resultado;
    };
    
    // Función para procesar los datos de los pedidos y agruparlos por día (para "Semana")
    const procesarDatosPorDia = (pedidos) => {
        const pedidosPorDia = {};
        
        // Obtener los últimos 7 días para inicializar el objeto
        const hoy = new Date();
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            
            const diaKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
            const nombreDia = obtenerNombreDiaSemana(fecha.getDay());
            
            pedidosPorDia[diaKey] = {
                key: diaKey,
                mes: `${nombreDia} ${fecha.getDate()}`, // Usamos "mes" como etiqueta en el gráfico
                fecha: new Date(fecha),
                cantidad: 0
            };
        }
        
        // Agrupar los pedidos por día
        pedidos.forEach(pedido => {
            const fecha = new Date(pedido.fecha_pedido);
            const diaKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
            
            if (pedidosPorDia[diaKey]) {
                pedidosPorDia[diaKey].cantidad += 1;
            }
        });
        
        // Convertir a array y ordenar cronológicamente
        const resultado = Object.values(pedidosPorDia).sort((a, b) => a.fecha - b.fecha);
        return resultado;
    };
    
    // Función para procesar los datos de los pedidos y agruparlos por mes (para "Mes")
    const procesarDatosPorMes = (pedidos) => {
        // Objeto para agrupar pedidos por mes
        const pedidosPorMes = {};
        
        // Inicializar los últimos 12 meses
        const hoy = new Date();
        for (let i = 11; i >= 0; i--) {
            const fecha = new Date();
            fecha.setMonth(hoy.getMonth() - i);
            
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            
            pedidosPorMes[mesKey] = {
                key: mesKey,
                mes: obtenerNombreMes(fecha.getMonth()),
                anio: fecha.getFullYear(),
                fecha: new Date(fecha),
                cantidad: 0
            };
        }
        
        // Agrupar pedidos por mes
        pedidos.forEach(pedido => {
            const fecha = new Date(pedido.fecha_pedido);
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            
            if (pedidosPorMes[mesKey]) {
                pedidosPorMes[mesKey].cantidad += 1;
            }
        });
        
        // Convertir a array y ordenar cronológicamente
        const resultado = Object.values(pedidosPorMes).sort((a, b) => a.fecha - b.fecha);
        return resultado;
    };

    // Función para obtener el nombre del mes en español
    const obtenerNombreMes = (mes) => {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[mes];
    };
    
    // Función para obtener el nombre del día de la semana en español
    const obtenerNombreDiaSemana = (dia) => {
        const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return dias[dia];
    };    // Función para obtener fechas según el periodo seleccionado
    const obtenerFechasSegunPeriodo = () => {
        const hoy = new Date();
        let inicio, fin;
        
        switch (timePeriod) {
            case 'today':
                // Para "hoy" mostrar solo las últimas 24 horas
                inicio = new Date(hoy);
                inicio.setHours(0, 0, 0, 0); // Inicio del día actual
                fin = new Date();
                break;
            case 'week':
                // Para "semana" mostrar los últimos 7 días
                inicio = new Date(hoy);
                inicio.setDate(hoy.getDate() - 6); // 7 días incluyendo hoy
                inicio.setHours(0, 0, 0, 0);
                fin = new Date();
                break;
            case 'month':
                // Para "mes" mostrar los últimos 12 meses
                inicio = new Date(hoy);
                inicio.setMonth(hoy.getMonth() - 11); // 12 meses incluyendo el actual
                inicio.setDate(1); // Primer día del mes
                inicio.setHours(0, 0, 0, 0);
                fin = new Date();
                break;
            default:
                // Por defecto, mostrar el día actual
                inicio = new Date(hoy);
                inicio.setHours(0, 0, 0, 0);
                fin = new Date();
        }
        
        return { inicio, fin };
    };    // Función para cargar los datos de los pedidos
    const cargarDatosPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/orders/orders`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de pedidos');
            }
            
            const pedidos = await response.json();
            console.log("Pedidos cargados:", pedidos);
            
            // Filtrar los pedidos por fecha según el periodo seleccionado
            const { inicio, fin } = obtenerFechasSegunPeriodo();
            
            const pedidosFiltrados = pedidos.filter(pedido => {
                const fechaPedido = new Date(pedido.fecha_pedido);
                return fechaPedido >= inicio && fechaPedido <= fin;
            });
            
            // Usar la función procesarDatos que elige el método adecuado basado en timePeriod
            const datosProcesados = procesarDatos(pedidosFiltrados);
            setData(datosProcesados);
            
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los datos:', err);
            setError('No se pudieron cargar los datos de pedidos. Inténtelo nuevamente más tarde.');
            setLoading(false);
        }
    };    // Efecto para cargar datos cuando cambian los filtros
    useEffect(() => {
        console.log("Periodo de tiempo cambiado a:", timePeriod);
        cargarDatosPedidos();
    }, [timePeriod]); // Se ejecuta cada vez que cambia timePeriod// Personalización del tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let tooltipLabel = label;
            
            // Personalizar la etiqueta según el período
            if (timePeriod === 'today') {
                tooltipLabel = `${label} hrs`;
            } else if (timePeriod === 'week') {
                tooltipLabel = label; // Ya incluye el día y número
            } else if (timePeriod === 'month') {
                tooltipLabel = label; // Ya incluye el nombre del mes
            }
            
            return (
                <div className="evolucion-tooltip">
                    <p className="tooltip-label">{tooltipLabel}</p>
                    <p className="tooltip-value">
                        <span>Total de Pedidos:</span> {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Formatear etiquetas del eje X
    const formatXAxis = (label) => {
        return label;
    };// Obtener el texto adecuado según el período seleccionado
    const getPeriodText = () => {
        switch (timePeriod) {
            case 'today':
                return 'de Hoy';
            case 'week':
                return 'Semanal';
            case 'month':
                return 'Mensual';
            default:
                return '';
        }
    };

    return (
        <div className="evolucion-pedidos-container">
            <h2 className="evolucion-pedidos-title">Evolución {getPeriodText()} de Pedidos</h2>
            
            <div className="evolucion-pedidos-chart">
                {loading ? (
                    <div className="loading-message">Cargando datos...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>                ) : data.length === 0 ? (
                    <div className="no-data-message">No hay datos disponibles para el período seleccionado</div>                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 30,    // Aumentado de 20 a 30
                                right: 40,  // Aumentado de 30 a 40
                                left: 40,   // Aumentado de 20 a 40
                                bottom: 50, // Aumentado de 30 a 50
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#FFF" opacity={0.2} vertical={false} />
                            <XAxis 
                                dataKey="mes" 
                                tickFormatter={formatXAxis}
                                tick={{ fill: '#FFF', fontSize: 16 }}
                                axisLine={{ stroke: '#FFF', opacity: 0 }}
                                tickLine={{ stroke: '#FFF', opacity: 0 }}
                                dy={15} // Añade espacio debajo del eje X
                            />
                            <YAxis 
                                tick={{ fill: '#FFF', fontSize: 16 }}
                                axisLine={{ stroke: '#FFF', opacity: 0 }}
                                tickLine={{ stroke: '#FFF', opacity: 0 }}
                                dx={-10} // Añade espacio a la izquierda del eje Y
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{ paddingBottom: '15px' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="cantidad"
                                name="Pedidos"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 6, strokeWidth: 2, fill: '#1E1E1E' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default EvolucionPedidos;