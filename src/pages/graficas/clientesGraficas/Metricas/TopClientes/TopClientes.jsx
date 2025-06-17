import React, { useState, useEffect } from 'react';
import { Trophy, Users, DollarSign } from 'lucide-react';
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';
import './TopClientes.css';

const API_URL = 'https://api.mamamianpizza.com';

const TopClientes = ({ timePeriod = 'all' }) => {
    const [topClientes, setTopClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    const fetchTopClientes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/customers/unique-customers`);
            if (!response.ok) {
                throw new Error('Error al obtener datos de top clientes');
            }
            
            const data = await response.json();
            
            // Usar los datos de topSpendingCustomers del endpoint
            const topClientesData = data.topSpendingCustomers.map(customer => ({
                rank: customer.rank,
                nombre: customer.customerName,
                pedidos: customer.totalOrders,
                gasto: parseFloat(customer.totalSpent)
            }));
            
            setTopClientes(topClientesData);
            
        } catch (error) {
            console.error('Error al obtener top clientes:', error);
            setError(error.message);
            
            // Datos de muestra en caso de error
            setTopClientes([
                { rank: 1, nombre: 'Juan Pérez', pedidos: 28, gasto: 1250.50 },
                { rank: 2, nombre: 'María González', pedidos: 24, gasto: 980.25 },
                { rank: 3, nombre: 'Carlos López', pedidos: 22, gasto: 875.75 },
                { rank: 4, nombre: 'Ana Martínez', pedidos: 19, gasto: 720.30 },
                { rank: 5, nombre: 'Luis Rodríguez', pedidos: 17, gasto: 650.80 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopClientes();
    }, [timePeriod]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="rank-icon rank-1" size={20} />;
        if (rank === 2) return <Trophy className="rank-icon rank-2" size={20} />;
        if (rank === 3) return <Trophy className="rank-icon rank-3" size={20} />;
        return <span className="rank-number">{rank}</span>;
    };

    if (loading) {
    return (
        <div className="top-clientes-container">
            <div className="top-clientes-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3>
                        <Trophy className="header-icon" size={20} />
                        Top 5 Clientes
                    </h3>
                    <InfoTooltip
                        title="Top Clientes"
                        content="Ranking de tus 5 mejores clientes ordenados por gasto total. Incluye el número de pedidos realizados y el monto total gastado por cada cliente."
                        businessImpact="Tus mejores clientes son tu activo más valioso. Representan una fuente estable de ingresos y pueden ayudarte a atraer nuevos clientes a través de recomendaciones."
                        actionTips="• Implementa programas VIP para estos clientes
• Ofrece descuentos o beneficios especiales por su lealtad
• Pide feedback para mejorar el servicio
• Usa sus preferencias para desarrollar nuevos productos"
                        position="bottom"
                    />
                </div>
                <p>Los clientes más activos</p>
            </div>
                <div className="top-clientes-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando clientes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="top-clientes-container">
                <div className="top-clientes-header">
                    <h3>
                        <Trophy className="header-icon" size={20} />
                        Top 5 Clientes
                    </h3>
                    <p>Error al cargar los datos</p>
                </div>
                <div className="top-clientes-error">
                    <p>No se pudieron cargar los datos</p>
                    <button onClick={fetchTopClientes} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="top-clientes-container">
            <div className="top-clientes-header">
                <h3>
                    <Trophy className="header-icon" size={20} />
                    Top 5 Clientes
                </h3>
                <p>Los clientes más activos del período</p>
            </div>
            
            {topClientes.length === 0 ? (
                <div className="no-data">
                    <p>No hay datos disponibles</p>
                </div>
            ) : (
                <div className="top-clientes-list">
                    {topClientes.map((cliente) => (
                        <div key={cliente.rank} className={`cliente-item ${cliente.rank <= 3 ? 'top-three' : ''}`}>
                            <div className="cliente-rank">
                                {getRankIcon(cliente.rank)}
                            </div>
                            <div className="cliente-info">
                                <div className="cliente-nombre">
                                    {cliente.nombre}
                                </div>
                                <div className="cliente-stats">
                                    <div className="stat-item">
                                        <Users size={14} />
                                        <span>{cliente.pedidos} pedidos</span>
                                    </div>
                                    <div className="stat-item gasto">
                                        <DollarSign size={14} />
                                        <span>{formatCurrency(cliente.gasto)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopClientes;
