import TotalClientes from './KPI/TotalClientes/TotalClientes';
import ClientesNuevos from './KPI/ClientesNuevos/ClientesNuevos';
import TasaRetencion from './KPI/TasaRetencion/TasaRetencion';
import EvolucionClientes from './Metricas/EvolucionClientes/EvolucionClientes';
import TopClientes from './Metricas/TopClientes/TopClientes';
import './clientesGraficas.css';

// Recibir las props desde el componente padre
const ClientesGraficas = ({ timePeriod, orderType }) => {
  return (
    <div className="clientes-graficas__container">
      <div className='KPI__container'>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            {/* Pasar los props al componente TotalClientes */}
            <TotalClientes 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            <ClientesNuevos 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
        <div className='KPI__col-4'>
          <div className='KPI__col__container'>
            <TasaRetencion 
              timePeriod={timePeriod} 
              orderType={orderType}
            />
          </div>
        </div>
      </div>
      
      <div className='clientes-graficas__body'>
        <div className="metrics__containers evolucion__container">
          <EvolucionClientes 
            timePeriod={timePeriod} 
          />
        </div>
        <div className="metrics__containers top-clientes__container">
          <TopClientes 
            timePeriod={timePeriod}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientesGraficas;
          