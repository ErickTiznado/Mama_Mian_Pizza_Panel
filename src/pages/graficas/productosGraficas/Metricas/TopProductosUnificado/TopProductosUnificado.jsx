import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Package, DollarSign, Star, ToggleLeft, ToggleRight } from "lucide-react";
import InfoTooltip from '../../../../../components/common/InfoTooltip/InfoTooltip';
import "./TopProductosUnificado.css";

const TopProductosUnificado = ({ timePeriod = 'all', orderType = 'all' }) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('');
    const [viewMode, setViewMode] = useState('unidades'); // 'unidades' o 'ingresos'

    const API_URL = 'https://api.mamamianpizza.com';

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let url;
            
            if (viewMode === 'unidades') {
                url = `${API_URL}/api/orders/statistics/top-products-filtered`;
            } else {
                // Para ingresos
                url = `${API_URL}/api/orders/statistics/top-revenue`;
                if (timePeriod && timePeriod !== 'all') {
                    url = `${API_URL}/api/orders/statistics/top-revenue-filtered?period=${timePeriod}`;
                }
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error al obtener los top productos por ${viewMode}`);
            }

            const data = await response.json();
            
            setTopProducts(data.topProducts || []);
            setPeriod(data.period || 'todos los tiempos');
            setLoading(false);
        } catch (error) {
            console.error(`Error al obtener los top productos por ${viewMode}:`, error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, [timePeriod, orderType, viewMode]);

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

    const getHeaderConfig = () => {
        if (viewMode === 'unidades') {
            return {
                title: 'Top 5 Productos Más Vendidos',
                icon: <Package size={24} />,
                columns: [
                    { key: 'rank', label: '#', width: '50px' },
                    { key: 'product', label: 'Producto', width: '1fr' },
                    { key: 'units', label: 'Unidades', icon: <Package size={16} />, width: '80px' },
                    { key: 'orders', label: 'Órdenes', icon: <TrendingUp size={16} />, width: '80px' },
                    { key: 'revenue', label: 'Ingresos', icon: <DollarSign size={16} />, width: '100px' }
                ]
            };
        } else {
            return {
                title: 'Top 5 Productos por Ingresos',
                icon: <DollarSign size={24} />,
                columns: [
                    { key: 'rank', label: '#', width: '50px' },
                    { key: 'product', label: 'Producto', width: '1fr' },
                    { key: 'revenue', label: 'Ingresos', icon: <DollarSign size={16} />, width: '100px' },
                    { key: 'units', label: 'Unidades', icon: <Package size={16} />, width: '80px' },
                    { key: 'avgPrice', label: 'Precio Prom.', icon: <Star size={16} />, width: '100px' }
                ]
            };
        }
    };

    const renderTableRow = (product, index) => {
        const config = getHeaderConfig();
        const gridColumns = config.columns.map(col => col.width).join(' ');

        return (
            <div 
                key={product.rank || index} 
                className={`table-row ${product.rank <= 3 ? 'top-three' : ''}`}
                style={{ gridTemplateColumns: gridColumns }}
            >
                <div className="col-rank">
                    {getRankIcon(product.rank)}
                </div>
                <div className="col-product">
                    <span className="product-name" title={product.productName}>
                        {product.productName}
                    </span>
                </div>
                
                {viewMode === 'unidades' ? (
                    <>
                        <div className="col-units">
                            <span className="metric-value">
                                {product.totalUnitsSold}
                            </span>
                        </div>
                        <div className="col-orders">
                            <span className="metric-value">
                                {product.ordersCount}
                            </span>
                        </div>
                        <div className="col-revenue">
                            <span className="metric-value revenue-highlight">
                                {formatCurrency(product.totalRevenue)}
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-revenue">
                            <span className="metric-value revenue-highlight">
                                {formatCurrency(product.totalRevenue)}
                            </span>
                        </div>
                        <div className="col-units">
                            <span className="metric-value">
                                {product.totalUnitsSold}
                            </span>
                        </div>
                        <div className="col-avg-price">
                            <span className="metric-value">
                                {formatCurrency(product.avgPrice)}
                            </span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="top-productos-unificado-container">
                <div className="top-productos-unificado-header">
                    <h3>{getHeaderConfig().title}</h3>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="top-productos-unificado-container">
                <div className="top-productos-unificado-header">
                    <h3>{getHeaderConfig().title}</h3>
                    <p className="error-text">Error: {error}</p>
                </div>
            </div>
        );
    }

    const config = getHeaderConfig();

    return (
        <div className="top-productos-unificado-container">            <div className="top-productos-unificado-header">
                <div className="header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3>{config.title}</h3>
                        <InfoTooltip
                            title="Top Productos"
                            content="Ranking de los 5 productos más exitosos según el criterio seleccionado (unidades vendidas o ingresos generados). Puedes alternar entre ambas vistas para obtener diferentes perspectivas."
                            businessImpact="Conocer tus productos estrella te permite optimizar tu menú, enfocar esfuerzos de marketing, gestionar inventario eficientemente y maximizar la rentabilidad promocionando los productos más exitosos."
                            actionTips="• Promociona más los productos top para aumentar ventas
• Analiza qué hace exitosos estos productos para replicar en otros
• Asegúrate de tener suficiente inventario de productos populares
• Considera crear variaciones de tus productos más vendidos"
                            position="bottom"
                        />
                    </div>
                    <p>Período: {period}</p>
                </div>
                <div className="header-controls">
                    <div className="view-toggle">
                        <button 
                            className={`toggle-btn ${viewMode === 'unidades' ? 'active' : ''}`}
                            onClick={() => setViewMode('unidades')}
                        >
                            <Package size={16} />
                            Unidades
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === 'ingresos' ? 'active' : ''}`}
                            onClick={() => setViewMode('ingresos')}
                        >
                            <DollarSign size={16} />
                            Ingresos
                        </button>
                    </div>
                    {config.icon && (
                        <div className="header-icon">
                            {config.icon}
                        </div>
                    )}
                </div>
            </div>
            
            {topProducts.length === 0 ? (
                <div className="no-data">
                    <p>No hay datos disponibles</p>
                </div>
            ) : (
                <div className="top-productos-unificado-table">
                    <div 
                        className="table-header"
                        style={{ gridTemplateColumns: config.columns.map(col => col.width).join(' ') }}
                    >
                        {config.columns.map((col) => (
                            <div key={col.key} className={`col-${col.key}`}>
                                {col.icon && col.icon}
                                <span>{col.label}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="table-body">
                        {topProducts.map((product, index) => renderTableRow(product, index))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopProductosUnificado;
