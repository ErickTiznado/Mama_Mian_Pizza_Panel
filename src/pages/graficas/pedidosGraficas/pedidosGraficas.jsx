import KPIConteo from './KPI/ContPedidos/ContPedidos'
import './pedidosGraficas.css';
const pedidosGraficas = () => {
  return (
    <div className="pedidos-graficas__container ped__col-12">
      <div className='KPI__container'>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
              <KPIConteo/>
      
          </div>
      </div>
      <div className='KPI__col-4'>
        <div className='KPI__col__container'>

        </div>
      </div>
      <div className='KPI__col-4'>
        <div className='KPI__col__container'>

        </div>
      </div>
    
      </div>
      </div>
  )
}

export default pedidosGraficas;