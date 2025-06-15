import KPIneto from '../productosGraficas/KPI/IngresosNetos/KPIIngNetos';
import UnidadesVendidas from './KPI/UnidadesVendidas/UnidadesKPI';
import UnidadesPorOrden from './KPI/UnidadesPorOrdenes/UnidadesPorOrden';
import TopProductosUnificado from './Metricas/TopProductosUnificado/TopProductosUnificado';
import CombinacionesProductos from './Metricas/CombinacionesProductos/CombinacionesProductos';
import './productosGraficas.css';

const productosGraficas = ({timePeriod, orderType}) => {
    return (
        <div className="pedidos-graficas__container">
            <div className="KPI__container">
                <div className="KPI__col-4">
                    <div className="KPI__col__container">
                        <KPIneto 
                            timePeriod={timePeriod} 
                            orderType={orderType}
                        />
                    </div>
                </div>
                <div className='KPI__col-4'>
                    <div className="KPI__col__container">
                        <UnidadesVendidas 
                            timePeriod={timePeriod} 
                            orderType={orderType}
                        />
                    </div>
                </div>
                <div className='KPI__col-4'>
                    <div className="KPI__col__container">
                        <UnidadesPorOrden 
                            timePeriod={timePeriod} 
                            orderType={orderType}
                        />
                    </div>
                </div>
            </div>            <div className='productos-graficas__body'>
                <div className="metrics__containers top-productos__container">
                    <TopProductosUnificado 
                        timePeriod={timePeriod} 
                        orderType={orderType}
                    />
                </div>
            </div>
            
            <div className='combinaciones-productos__section'>
                <div className="metrics__containers combinaciones__container">
                    <CombinacionesProductos 
                        timePeriod={timePeriod} 
                        orderType={orderType}
                    />
                </div>
            </div>
        </div>
    )
}


export default productosGraficas;