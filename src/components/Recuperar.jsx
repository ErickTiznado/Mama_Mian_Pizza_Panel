import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/src/styles/Recuperar.css';

const Recuperar = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/enviar-codigo', { correo });
      setMensaje(response.data.message);

      // ✅ Redirigir a VerificarCodigo.jsx pasando el correo como parámetro
      navigate('/verificar-codigo', { state: { correo } });
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error al enviar el código');
    }
  };

  return (
    <div className="recuperar-page">
      <div className="recuperar-container">
        <h2>Recuperar Contraseña</h2>
        <p className="descripcion">
          Introduce tu correo y te enviaremos un código para restablecer tu contraseña.
        </p>
        <form onSubmit={handleEnviarCodigo}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit">Restablecer Contraseña</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="volver">
          <a href="/login">Volver al inicio de sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Recuperar;
