import "./UltimosPedidos.css";
import axios from "axios";
import React, { useState, useEffect } from "react";


const API_URL = "https://server.tiznadodev.com";

const UltimosPedidos = () => {
const [pedidos, setPedidos] = useState([]);

const cargarPedidos = async () => {
    try {
        const {data} = await axios.get(`${API_URL}/api/orders/orders`)
        const today = new Date().toISOString().slice(0, 10);   
    const filtered = data 
        .filter(o => o.fecha_pedido.startsWith(today) &&
        o.estado !== "cancelado" && o.estado !== "entregado")
        .sort((a,b) => 
        new Date(b.fecha_pedido) - new Date(a.fecha_pedido))
        .slice(0, 10);
        setPedidos(filtered);
        console.log("Pedidos filtrados:", filtered);
    }
        
catch (error) {
        console.error("Error al cargar los pedidos:", error);
    }
}

useEffect(() => {
    cargarPedidos();
    console.log("Pedidos cargados:", pedidos);
}
, []);
    return(
        <div className="ultimos_pedidos__cont">
            <header>
                    <h2> Pedidos Recientes</h2>
            </header>
            <div className="ultimos_tabla__cont">
                <table>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map( o =>(
                            <tr key={o._id}>
                                <td>{o._id}</td>
                                <td>{o.nombre_cliente + " " + o.apellido_cliente}</td>
                                <td>${o.total}</td>
                                <td>{o.estado}</td>
                                <td>{new Date(o.fecha_pedido).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UltimosPedidos;