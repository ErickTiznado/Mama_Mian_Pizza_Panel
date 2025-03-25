import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Restablecer.css';


const Restablecer = () => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { correo, codigo } = location.state || {};

  const validarContrasena = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleRestablecer = async () => {
    if (!validarContrasena(nuevaContrasena)) {
      setError('Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/restablecer-contrasena', { correo, codigo, nuevaContrasena });
      alert('Contraseña actualizada con éxito');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar la contraseña');
    }
  };

  return (
    <div className="restablecer-page">
      <div className="restablecer-container">
        <h2>Restablecer Contraseña</h2>
        <p className="descripcion">Ingresa tu nueva contraseña.</p>

        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button onClick={handleRestablecer} disabled={!nuevaContrasena || !confirmarContrasena}>
          Restablecer Contraseña
        </button>
      </div>
    </div>
  );
};

export default Restablecer;
