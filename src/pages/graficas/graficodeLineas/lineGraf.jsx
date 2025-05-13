import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './lineGraf.css';

const lineGraf = ({ data, xKey = "month" }) => {
  // Se extraen las claves del primer objeto, excepto la clave que usaremos en el eje X
  const lineKeys = data && data.length > 0 ? Object.keys(data[0]).filter(key => key !== xKey) : [];
  
  // Colores adaptados a la paleta oscura
  const colors = {
    pizzas: '#991B1B', // Rojo de marca
    bebidas: '#3D84B8', // Azul corporativo
    complementos: '#FEB248', // Amarillo de marca
    // Colores adicionales si se necesitan
    default: ['#991B1B', '#3D84B8', '#FEB248', '#4CAF50', '#E53935']
  };

  // Función para formatear los nombres de los meses
  const formatMonth = (month) => {
    const monthsES = {
      "January": "Enero",
      "February": "Febrero",
      "March": "Marzo",
      "April": "Abril",
      "May": "Mayo",
      "June": "Junio",
      "July": "Julio",
      "August": "Agosto",
      "September": "Septiembre",
      "October": "Octubre",
      "November": "Noviembre",
      "December": "Diciembre"
    };
    return monthsES[month] || month;
  };

  // Personalización del tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{formatMonth(label)}</p>
          <div className="tooltip-content">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {entry.name}: {entry.value} unidades
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Configuración para la leyenda personalizada
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="custom-legend">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            <span style={{ backgroundColor: entry.color }} className="legend-icon"></span>
            <span className="legend-text">
              {entry.value.charAt(0).toUpperCase() + entry.value.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 10,
          bottom: 10,
        }}
        style={{
          backgroundColor: 'transparent',
          borderRadius: '8px',
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.3} vertical={false} />
        <XAxis 
          dataKey={xKey}
          tick={{ fill: '#E5E7EB', fontSize: 12 }}
          tickFormatter={formatMonth}
          axisLine={{ stroke: '#4B5563', opacity: 0.5 }}
          tickLine={{ stroke: '#4B5563', opacity: 0.5 }}
        />
        <YAxis 
          tick={{ fill: '#E5E7EB', fontSize: 12 }}
          axisLine={{ stroke: '#4B5563', opacity: 0.5 }}
          tickLine={{ stroke: '#4B5563', opacity: 0.5 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
        {lineKeys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={key.charAt(0).toUpperCase() + key.slice(1)}
            stroke={colors[key] || colors.default[lineKeys.indexOf(key) % colors.default.length]}
            strokeWidth={2.5}
            dot={{ r: 4, strokeWidth: 2, fill: '#1E1E1E' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default lineGraf;
