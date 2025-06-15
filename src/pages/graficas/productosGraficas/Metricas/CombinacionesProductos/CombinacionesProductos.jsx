import { useEffect, useState } from "react";
import { Package, ArrowUpDown, Calendar, BarChart3, TrendingUp } from "lucide-react";
import './CombinacionesProductos.css';

const CombinacionesProductos = ({ timePeriod = 'all', orderType = 'all' }) => {
    const [combinaciones, setCombinaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [statistics, setStatistics] = useState({});
    const [sortBy, setSortBy] = useState('frequency');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const API_URL = 'https://api.mamamianpizza.com';

    const fetchCombinaciones = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                sortBy,
                sortOrder,
                page: currentPage,
                limit: 10
            });

            const response = await fetch(`${API_URL}/api/orders/statistics/product-combinations?${params}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener las combinaciones de productos');
            }

            const data = await response.json();
            
            setCombinaciones(data.data || []);
            setPagination(data.pagination || {});
            setStatistics(data.statistics || {});
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener las combinaciones de productos:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombinaciones();
    }, [timePeriod, orderType, sortBy, sortOrder, currentPage]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };

    const getFrequencyColor = (frequency) => {
        if (!statistics.uniqueCombinations || frequency === 0) return '#94a3b8';
        
        // Calculate intensity based on relative frequency
        const maxFreq = Math.max(...combinaciones.map(c => c.vecesJuntos));
        const intensity = frequency / maxFreq;
        
        if (intensity >= 0.8) return '#10b981'; // Verde intenso
        if (intensity >= 0.6) return '#34d399'; // Verde medio
        if (intensity >= 0.4) return '#6ee7b7'; // Verde claro
        if (intensity >= 0.2) return '#a7f3d0'; // Verde muy claro
        return '#d1fae5'; // Verde mínimo
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return <ArrowUpDown size={14} className="sort-icon inactive" />;
        return (
            <ArrowUpDown 
                size={14} 
                className={`sort-icon active ${sortOrder === 'desc' ? 'desc' : 'asc'}`} 
            />
        );
    };

    if (loading) {
        return (
            <div className="combinaciones-container">
                <div className="combinaciones-header">
                    <h3>Combinaciones de Productos</h3>
                    <p>Cargando combinaciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="combinaciones-container">
                <div className="combinaciones-header">
                    <h3>Combinaciones de Productos</h3>
                    <p className="error-text">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="combinaciones-container">
            <div className="combinaciones-header">
                <div className="header-content">
                    <h3>Combinaciones de Productos</h3>
                    <p>Productos que los clientes compran juntos</p>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <BarChart3 size={16} />
                        <span>{statistics.uniqueCombinations || 0} combinaciones</span>
                    </div>
                    <div className="stat-item">
                        <TrendingUp size={16} />
                        <span>{statistics.totalOrdersInPeriod || 0} pedidos</span>
                    </div>
                    <Package className="header-icon" size={24} />
                </div>
            </div>
            
            {combinaciones.length === 0 ? (
                <div className="no-data">
                    <Package size={48} className="no-data-icon" />
                    <p>No hay combinaciones de productos en este período</p>
                </div>
            ) : (
                <div className="combinaciones-content">
                    <div className="combinaciones-table">
                        <div className="table-header">
                            <div 
                                className="col-header producto-a"
                                onClick={() => handleSort('productoA')}
                            >
                                <span>Producto A</span>
                                {getSortIcon('productoA')}
                            </div>
                            <div 
                                className="col-header producto-b"
                                onClick={() => handleSort('productoB')}
                            >
                                <span>Producto B</span>
                                {getSortIcon('productoB')}
                            </div>
                            <div 
                                className="col-header frecuencia"
                                onClick={() => handleSort('frequency')}
                            >
                                <span>Frecuencia</span>
                                {getSortIcon('frequency')}
                            </div>
                        </div>
                        
                        <div className="table-body">
                            {combinaciones.map((combinacion, index) => (
                                <div key={`${combinacion.productoA}-${combinacion.productoB}-${index}`} className="table-row">
                                    <div className="col-producto-a">
                                        <span className="product-name" title={combinacion.productoA}>
                                            {combinacion.productoA}
                                        </span>
                                    </div>
                                    <div className="col-producto-b">
                                        <span className="product-name" title={combinacion.productoB}>
                                            {combinacion.productoB}
                                        </span>
                                    </div>
                                    <div className="col-frecuencia">
                                        <div className="frequency-container">
                                            <span 
                                                className="frequency-value"
                                                style={{ color: getFrequencyColor(combinacion.vecesJuntos) }}
                                            >
                                                {combinacion.vecesJuntos}
                                            </span>
                                            <span className="frequency-label">veces</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-btn"
                                disabled={!pagination.hasPreviousPage}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Anterior
                            </button>
                            <span className="pagination-info">
                                Página {pagination.currentPage} de {pagination.totalPages}
                            </span>
                            <button 
                                className="pagination-btn"
                                disabled={!pagination.hasNextPage}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}

                    <div className="table-footer">
                        <p className="results-info">
                            Mostrando {combinaciones.length} de {pagination.totalItems || 0} combinaciones
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CombinacionesProductos;
