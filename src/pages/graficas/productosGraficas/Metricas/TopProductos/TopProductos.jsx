import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Package, DollarSign } from "lucide-react";
import './TopProductos.css';

const TopProductos = ({ timePeriod = 'all', orderType = 'all' }) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('');

    const API_URL = 'https://api.mamamianpizza.com';

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/api/orders/statistics/top-products-filtered`);
            
            if (!response.ok) {
                throw new Error('Error al obtener los top productos');
            }

            const data = await response.json();
            
            setTopProducts(data.topProducts || []);
            setPeriod(data.period || 'todos los tiempos');
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los top productos:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, [timePeriod, orderType]);

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
            <div className="top-productos-container">
                <div className="top-productos-header">
                    <h3>Top 5 Productos Más Vendidos</h3>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="top-productos-container">
                <div className="top-productos-header">
                    <h3>Top 5 Productos Más Vendidos</h3>
                    <p className="error-text">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="top-productos-container">
            <div className="top-productos-header">
                <div className="header-content">
                    <h3>Top 5 Productos Más Vendidos</h3>
                    <p>Período: {period}</p>
                </div>
                <Trophy className="header-icon" size={24} />
            </div>
            
            {topProducts.length === 0 ? (
                <div className="no-data">
                    <p>No hay datos disponibles</p>
                </div>
            ) : (
                <div className="top-productos-table">
                    <div className="table-header">
                        <div className="col-rank">#</div>
                        <div className="col-product">Producto</div>
                        <div className="col-units">
                            <Package size={16} />
                            <span>Unidades</span>
                        </div>
                        <div className="col-orders">
                            <TrendingUp size={16} />
                            <span>Órdenes</span>
                        </div>
                        <div className="col-revenue">
                            <DollarSign size={16} />
                            <span>Ingresos</span>
                        </div>
                    </div>
                    
                    <div className="table-body">
                        {topProducts.map((product, index) => (
                            <div 
                                key={product.rank || index} 
                                className={`table-row ${product.rank <= 3 ? 'top-three' : ''}`}
                            >
                                <div className="col-rank">
                                    {getRankIcon(product.rank)}
                                </div>
                                <div className="col-product">
                                    <span className="product-name" title={product.productName}>
                                        {product.productName}
                                    </span>
                                </div>
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
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopProductos;
