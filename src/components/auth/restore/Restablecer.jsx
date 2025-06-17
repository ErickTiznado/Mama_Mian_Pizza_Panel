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
  const { token } = location.state || {};

  const validarContrasena = (password) => {
    // Validación según las instrucciones: mínimo 8 caracteres, mayúscula, minúscula, número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  const handleRestablecer = async () => {
    if (!validarContrasena(nuevaContrasena)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token) {
      setError('Token de verificación no encontrado. Por favor, inicia el proceso nuevamente.');
      return;
    }

    try {
      const response = await axios.put('https://api.mamamianpizza.com/api/auth/reset-password', { 
        token, 
        nuevaContrasena 
      });
      
      alert('Contraseña actualizada con éxito');
      navigate('/login');
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      if (error.response?.status === 400) {
        setError(error.response.data.error || 'Token inválido o expirado');
      } else {
        setError('Error al actualizar la contraseña. Por favor, intenta nuevamente.');
      }
    }  };

  return (
    <div className="restablecer-page">
      <div className="restablecer-container">
        <h2>Restablecer Contraseña</h2>
        <p className="descripcion">Ingresa tu nueva contraseña.</p>

        {!token && (
          <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
            ⚠️ Token de verificación no encontrado. Por favor, inicia el proceso de recuperación nuevamente.
          </div>
        )}

        <input
          type="password"
          placeholder="Nueva Contraseña (mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}          disabled={!token}
        />

        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          disabled={!token}
        />

        {error && <p className="error-message">{error}</p>}

        <button 
          onClick={handleRestablecer} 
          disabled={!nuevaContrasena || !confirmarContrasena || !token}
        >
          Restablecer Contraseña
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a href="/recuperar">← Volver a recuperar contraseña</a>
        </div>
      </div>
    </div>
  );
};

export default Restablecer;
