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

const recentOrders = [
  {
    name: "Juan Pérez",
    orderId: "ORD-1001",
    total: 25.90,
    status: "Entregado"
  },
  {
    name: "María López",
    orderId: "ORD-1002",
    total: 18.50,
    status: "En proceso"
  },
  {
    name: "Carlos Díaz",
    orderId: "ORD-1003",
    total: 45.99,
    status: "Entregado"
  },
  {
    name: "Ana Martínez",
    orderId: "ORD-1004",
    total: 32.00,
    status: "Cancelado"
  },
  {
    name: "Sofía González",
    orderId: "ORD-1005",
    total: 27.90,
    status: "En proceso"
  },
  {
    name: "Luis Ramírez",
    orderId: "ORD-1006",
    total: 15.50,
    status: "Entregado"
  },
  {
    name: "Lucía Ortega",
    orderId: "ORD-1008",
    total: 22.30,
    status: "Entregado"
  },
  {
    name: "Ricardo Torres",
    orderId: "ORD-1009",
    total: 19.99,
    status: "En proceso"
  },
  {
    name: "Daniela Navarro",
    orderId: "ORD-1010",
    total: 55.00,
    status: "Cancelado"
  },
];


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
        <PedidosRecientes data={recentOrders}/>
        </div>
      </div>
    </div>
  );
}

export default Graficas;