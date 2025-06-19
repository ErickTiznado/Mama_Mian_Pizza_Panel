import KPIConteo from './KPI/ContPedidos/ContPedidos'
import KPITicket from './KPI/TicketMedio/avgTicket';
import KPIHora from './KPI/PedidosHora/PedidosHora';
import EvolucionPedidos from './Metricas/EvolucionPedidos/EvolucionPedidos';
import Heatmap from './Metricas/MapaDeCalor/Heatmap';
import ComparativaEntrega from './Metricas/ComparativaEntrega/ComparativaEntrega';
import './pedidosGraficas.css';

// Recibir las props desde el componente padre
const pedidosGraficas = ({ timePeriod, orderType }) => {
  return (
    <div className="pedidos-graficas__container">
      <div className='KPI__container'>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            {/* Pasar los props al componente KPIConteo */}
            <KPIConteo 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            <KPITicket 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            <KPIHora 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
      </div>      <div className='pedidos-graficas__body'>
        <div className="metrics__containers histogram__container">
          <EvolucionPedidos 
            timePeriod={timePeriod} 
          />
        </div>        <div className="metrics__containers heatmap__container">
          <Heatmap />
        </div>
      </div>
      <div className='comparativa-entrega__section'>
        <div className="metrics__containers comparativa-entrega__container">
          <ComparativaEntrega 
            timePeriod={timePeriod} 
          />
        </div>
      </div>
    </div>
  )
}

export default pedidosGraficas;