import React, { useState, useEffect } from 'react';
import './Heatmap.css';

const API_URL = 'https://server.tiznadodev.com';

const Heatmap = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Definir los colores del mapa de calor del más frío al más caliente
    const colorScale = ['#374151', '#3b82f6', '#ea580c', '#dc2626'];

    // Función para procesar datos acumulativos por día de la semana e hora
    const procesarDatosAcumulativos = (pedidos) => {
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const heatmapData = [];
        const horaInicio = 8; // 8 AM
        const horaFin = 20; // 8 PM

        // Inicializar matriz de datos acumulativos (8 AM a 8 PM para cada día de la semana)
        for (let dia = 0; dia < 7; dia++) {
            for (let hora = horaInicio; hora <= horaFin; hora++) {
                heatmapData.push({
                    hora: hora,
                    dia: dia,
                    diaNombre: diasSemana[dia],
                    horaLabel: `${String(hora).padStart(2, '0')}:00`,
                    cantidad: 0
                });
            }
        }

        // Procesar TODOS los pedidos históricos acumulando por día de la semana
        pedidos.forEach(pedido => {
            const fecha = new Date(pedido.fecha_pedido);
            const hora = fecha.getHours();
            const dia = fecha.getDay(); // 0 = Domingo, 1 = Lunes, etc.
            
            // Solo procesar pedidos dentro del horario comercial
            if (hora >= horaInicio && hora <= horaFin) {
                const index = heatmapData.findIndex(item => item.hora === hora && item.dia === dia);
                if (index !== -1) {
                    heatmapData[index].cantidad += 1;
                }
            }
        });

        return heatmapData;
    };

    // Función para cargar TODOS los datos históricos de pedidos
    const cargarDatosPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/orders/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener los pedidos');
            }
            
            const pedidos = await response.json();
            
            // Procesar TODOS los pedidos sin filtros de fecha para vista acumulativa
            const datosProcessados = procesarDatosAcumulativos(pedidos);
            setData(datosProcessados);
            setLoading(false);
            
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos del mapa de calor');
            setLoading(false);
        }
    };

    // Efecto para cargar datos una sola vez al montar el componente
    useEffect(() => {
        cargarDatosPedidos();
    }, []); // Sin dependencias para que solo se ejecute una vez

    // Función para obtener el color basado en la intensidad
    const obtenerColor = (cantidad, maxCantidad) => {
        if (cantidad === 0) return colorScale[0]; // Color más frío para 0
        
        const intensidad = cantidad / maxCantidad;
        
        if (intensidad <= 0.25) return colorScale[0]; // #374151
        if (intensidad <= 0.5) return colorScale[1];  // #3b82f6
        if (intensidad <= 0.75) return colorScale[2]; // #ea580c
        return colorScale[3]; // #dc2626
    };

    // Calcular valores máximos para normalizar colores
    const maxCantidad = data.length > 0 ? Math.max(...data.map(item => item.cantidad)) : 1;

    // Etiquetas fijas para días de la semana
    const etiquetasDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="heatmap-container">
            <h2 className="heatmap-title">Mapa de Calor Histórico de Pedidos</h2>
            
            <div className="heatmap-content">
                {loading ? (
                    <div className="loading-message">Cargando datos...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : data.length === 0 ? (
                    <div className="no-data-message">No hay datos disponibles</div>
                ) : (
                    <div className="heatmap-wrapper">
                        {/* Etiquetas de horas - Solo horario comercial (8 AM - 8 PM) */}
                        <div className="heatmap-hours-labels">
                            <div className="hour-label-empty"></div>
                            {Array.from({ length: 13 }, (_, i) => {
                                const hora = i + 8; // Horario comercial 8 AM - 8 PM
                                return (
                                    <div key={hora} className="hour-label">
                                        {hora % 2 === 0 ? `${String(hora).padStart(2, '0')}:00` : ''}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Grid del mapa de calor */}
                        <div className="heatmap-grid">
                            {etiquetasDias.map((dia, diaIndex) => (
                                <div key={dia} className="heatmap-row">
                                    <div className="day-label">{dia}</div>
                                    {Array.from({ length: 13 }, (_, i) => {
                                        const hora = i + 8; // Horario comercial 8 AM - 8 PM
                                        const dataPoint = data.find(item => 
                                            item.dia === diaIndex && item.hora === hora
                                        );
                                        const cantidad = dataPoint ? dataPoint.cantidad : 0;
                                        
                                        return (
                                            <div
                                                key={`${dia}-${hora}`}
                                                className="heatmap-cell"
                                                style={{
                                                    backgroundColor: obtenerColor(cantidad, maxCantidad)
                                                }}
                                                title={`${dia} ${String(hora).padStart(2, '0')}:00 - ${cantidad} pedidos acumulados`}
                                            >
                                                {cantidad > 0 && (
                                                    <span className="cell-value">{cantidad}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Leyenda de colores */}

                        
                        {/* Descripción explicativa */}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Heatmap;