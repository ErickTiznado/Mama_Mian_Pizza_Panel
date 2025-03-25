import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerificarCodigo.css';

const VerificarCodigo = () => {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const correo = location.state?.correo;

  const handleVerificarCodigo = async () => {
    try {
      await axios.post('http://localhost:3001/verificar-codigo', { correo, codigo });
      navigate('/restablecer', { state: { correo, codigo } });
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Código incorrecto o expirado');
    }
  };

  return (
    <div className="verificar-page">
      <div className="verificar-container">
        <h2>Verificar Código</h2>
        <p className="descripcion">Ingresa el código que recibiste en tu correo.</p>

        <input
          type="text"
          placeholder="Código de verificación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />

        {mensaje && <p className="error-message">{mensaje}</p>}

        <button onClick={handleVerificarCodigo} disabled={!codigo}>
          Verificar Código
        </button>

        <p className="volver">
          <a href="/recuperar">Reenviar Código</a>
        </p>
      </div>
    </div>
  );
};

export default VerificarCodigo;
