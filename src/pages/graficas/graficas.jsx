import './graficas.css';
import Kpicards from './kpicards/kpicards';

const kpiinfor = [{
  title: 'Ingresos Totales',
  value: '15,231.89',
  description: '+20% desde el mes pasado',
}, {
    title: 'Pedidos',
    value: '15,231.89',
    description: '+20% desde el mes pasado',
  },
    {
        title: 'Clientes',
        value: '789',
        description: '+20% desde el mes pasado',
    },
    {
        title: 'Pizzas Vendidas',
        value: '1,231',
        description: '+20% desde el mes pasado',
    }
];

function Graficas() {
  return (
    <div className="graficas-container">
      <div className="kpi-content">
        {kpiinfor.map((kpiinfor, index) => (
            <Kpicards key={index} kpinfo={kpiinfor}/>
        ))}
      </div>
    </div>
  );
}

export default Graficas;