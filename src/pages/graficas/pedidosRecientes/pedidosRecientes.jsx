import './pedidosRecientes.css';

const PedidosRecientes = ({data}) => {
return(
    <>
    <div className='pedidos-container'>
        <header className='pedidos-header'>
            <h3>Pedidos Recientes</h3>
            <p>Has recibido {data.length} pedidos hoy</p>
        </header>
        <div className='pedidos-content'>
            <ul className='pedidos-list'>
            {data.slice(0, 5).map((pedido, index) => (
  <li key={index} className='pedido-item'>
    <div className='pedido-info'>
      <span className='pedido-name'>
        <strong>{pedido.name}</strong>
      </span>
      <span className='pedido-id'>
        {pedido.orderId}
      </span>
    </div>
    <div className='pedido-details'>
      <span className='pedido-total'>
        ${pedido.total.toFixed(2)}
      </span>
      <div className='pedido-status'>
        {(() => {
          const statusClass =
            pedido.status === "Entregado" ? "entregado"
            : pedido.status === "En proceso" ? "en-proceso"
            : pedido.status === "Cancelado" ? "cancelado"
            : "pendiente";
          return (
            <div className={`status ${statusClass}`}>
              <span>{pedido.status}</span>
            </div>
          );
        })()}
      </div>
    </div>
  </li>
))}

            </ul>
        </div>

    </div>
    </>
);
}

export default PedidosRecientes;