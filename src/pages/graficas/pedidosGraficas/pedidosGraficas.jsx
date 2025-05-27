import KPIConteo from './KPI/ContPedidos/ContPedidos'
import KPITicket from './KPI/TicketMedio/avgTicket';
import './pedidosGraficas.css';

// Recibir las props desde el componente padre
const pedidosGraficas = ({ timePeriod, orderType }) => {
  return (
    <div className="pedidos-graficas__container ped__col-12">
      <div className='KPI__container'>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
              {/* Pasar los props al componente KPIConteo */}
              <KPIConteo 
                timePeriod={timePeriod} 
                orderType={orderType}
              />
          </div>
        </div>        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            <KPITicket 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            {/* Puedes agregar más KPIs aquí */}
          </div>
        </div>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            {/* Puedes agregar más KPIs aquí */}
            Hola
          </div>
        </div>
      </div>
    </div>
  )
}

export default pedidosGraficas;