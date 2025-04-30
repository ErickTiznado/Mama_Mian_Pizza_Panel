import './graficas.css';
import Kpicards from './kpicards/kpicards';
import LineGraf from './graficodeLineas/lineGraf';
import PedidosRecientes from './pedidosRecientes/pedidosRecientes';
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


const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]


function Graficas() {
  return (
    <div className="graficas-container">
      <div className="kpi-content">
        {kpiinfor.map((kpiinfor, index) => (
            <Kpicards key={index} kpinfo={kpiinfor}/>
        ))}
      </div>
      <div className='graficas-content'>
        <div className='graficas-content-1'>
        <LineGraf data={chartData}/>
        </div>
        <div className='graficas-content-2'> 
        <PedidosRecientes />
        </div>
      </div>
    </div>
  );
}

export default Graficas;