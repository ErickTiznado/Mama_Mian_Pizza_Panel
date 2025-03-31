import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (data.success) {
        setError(false);
        navigate('/src/components/prueba.jsx'); // Redirige a Prueba.jsx
      } else {
        setError(true); // Muestra mensaje de error en pantalla
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(true);
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <div className="form-box">
        <header className='login-header'>
          <h2 className='login-title'>
            Mama Mian Pizza Panel
          </h2>
        </header>
          <h2 className='login-form-title'>Iniciar Sesión</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={togglePassword}
              ></i>
            </div>

            {/* ✅ Restauramos tu mensaje visual de error */}
            {error && (
              <p className="error-message">
                Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.
              </p>
            )}

            <button type="submit">Ingresar</button>

            <p className="register-text">
            Por seguridad, cambie su contraseña predeterminada después del primer acceso.
            </p>

            <p className="forgot-text">
              <Link to="/recuperar" className="forgot-link">¿Olvidaste tu contraseña?</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
