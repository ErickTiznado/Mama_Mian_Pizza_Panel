import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import './TotalClientes.css';

const API_URL = 'https://api.mamamianpizza.com';

const TotalClientes = ({ timePeriod = 'all', orderType = 'all' }) => {
    const [totalClientes, setTotalClientes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState({ percentage: 0, isIncrease: true, comparisonText: '' });    const fetchTotalClientes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/customers/unique-customers`);
            if (!response.ok) {
                throw new Error('Error al obtener la información de clientes');
            }
            
            const data = await response.json();
            const count = data.uniqueCustomers.total.count;            
            // Simular comparación (en una implementación real se compararía con periodo anterior)
            const percentage = Math.floor(Math.random() * 20) + 5;
            const isIncrease = Math.random() > 0.3;
            
            let comparisonText;
            switch (timePeriod) {
                case 'today':
                    comparisonText = 'desde ayer';
                    break;
                case 'week':
                    comparisonText = 'desde la semana pasada';
                    break;
                case 'month':
                    comparisonText = 'desde el mes pasado';
                    break;
                default:
                    comparisonText = 'total de clientes';
            }
            
            setTotalClientes(count);
            setComparison({ percentage, isIncrease, comparisonText });
            
        } catch (error) {
            console.error('Error al obtener total de clientes:', error);
            setError(error.message);
            setTotalClientes(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalClientes();
    }, [timePeriod, orderType]);

    if (loading) {
        return (
            <div className="total-clientes-container">
                <div className="total-clientes-header">
                    <h3>Total Clientes</h3>
                    <Users className="total-clientes-icon" size={24} />
                </div>
                <div className="total-clientes-content">
                    <div className="total-clientes-loading">
                        <span className="loading-spinner"></span>
                        <p>Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="total-clientes-container">
                <div className="total-clientes-header">
                    <h3>Total Clientes</h3>
                    <Users className="total-clientes-icon" size={24} />
                </div>
                <div className="total-clientes-content">
                    <div className="total-clientes-error">
                        <p>Error al cargar</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="total-clientes-container">
            <div className="total-clientes-header">
                <h3>Total Clientes</h3>
                <Users className="total-clientes-icon" size={24} />
            </div>
            <div className="total-clientes-content">
                <div className="total-clientes-number">
                    {totalClientes.toLocaleString()}
                </div>
                <div className={`total-clientes-comparison ${comparison.isIncrease ? 'positive' : 'negative'}`}>
                    {comparison.isIncrease ? (
                        <TrendingUp size={16} />
                    ) : (
                        <TrendingDown size={16} />
                    )}
                    <span>{Math.abs(comparison.percentage)}% {comparison.comparisonText}</span>
                </div>
            </div>
        </div>
    );
};

export default TotalClientes;
