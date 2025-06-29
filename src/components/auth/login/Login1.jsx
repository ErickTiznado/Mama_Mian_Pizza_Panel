import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);    try {
      const response = await fetch('https://api.mamamianpizza.com/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });      const data = await response.json();

      if (data.success) {
        const userData = {
          id_admin: data.id_admin,
          nombre: data.nombre,
          rol: data.rol,
          correo: correo
        };
        
        // Log solo si el rol no viene del backend (para diagnóstico)
        if (!data.rol) {
          console.log('⚠️ [AUTH] Usuario sin rol del backend, se asignará automáticamente');
        }
        
        const token = data.token || data.accessToken || data.authToken || data.jwt || data.access_token;
        
        if (token) {
          login(userData, token);
        } else {
          login(userData, 'token-session-active');
        }
        
        // Redirigir a la página que intentaba acceder o a home por defecto
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(true);
    } finally {
      setLoading(false);
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
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={togglePassword}
                className="password-toggle-icon"
              />
            </div>

            {/* ✅ Restauramos tu mensaje visual de error */}
            {error && (
              <p className="error-message">
                Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

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
