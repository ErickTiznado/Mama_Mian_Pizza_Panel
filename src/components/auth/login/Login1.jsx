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
      console.log('🔧 [LOGIN DEBUG] === RESPUESTA COMPLETA DEL BACKEND ===');
      console.log('🔧 [LOGIN DEBUG] data completo:', JSON.stringify(data, null, 2));
      console.log('🔧 [LOGIN DEBUG] data.success:', data.success);
      console.log('🔧 [LOGIN DEBUG] data.admin:', data.admin);
      
      // Los datos están en data.admin, no directamente en data
      const adminData = data.admin || {};
      console.log('🔧 [LOGIN DEBUG] adminData:', adminData);
      console.log('🔧 [LOGIN DEBUG] adminData.rol:', adminData.rol);
      console.log('🔧 [LOGIN DEBUG] adminData.id:', adminData.id);
      console.log('🔧 [LOGIN DEBUG] adminData.nombre:', adminData.nombre);

      // CORREGIR: Verificar éxito usando la estructura correcta
      const isSuccess = data.success === true && data.admin;
      console.log('🔧 [LOGIN DEBUG] ¿Login exitoso?:', isSuccess);

      if (isSuccess) {
        // CONSTRUCCIÓN USANDO LA ESTRUCTURA CORRECTA: data.admin
        console.log('🔧 [LOGIN DEBUG] === CONSTRUYENDO USERDATA ===');
        console.log('🔧 [LOGIN DEBUG] Usando adminData.id:', adminData.id);
        console.log('🔧 [LOGIN DEBUG] Usando adminData.rol:', adminData.rol);
        console.log('🔧 [LOGIN DEBUG] Usando adminData.nombre:', adminData.nombre);
        
        const userData = {
          id_admin: adminData.id,
          nombre: adminData.nombre,
          rol: adminData.rol,
          correo: correo
        };
        
        console.log('🔧 [LOGIN DEBUG] === USERDATA CONSTRUIDO ===');
        console.log('🔧 [LOGIN DEBUG] userData final:', JSON.stringify(userData, null, 2));
        console.log('🔧 [LOGIN DEBUG] userData.rol específicamente:', userData.rol);
        console.log('🔧 [LOGIN DEBUG] typeof userData.rol:', typeof userData.rol);
        
        // VALIDACIÓN ESTRICTA antes de continuar
        if (!userData.rol) {
          console.error('❌ [LOGIN CRITICAL] userData.rol está vacío después de construcción');
          console.error('❌ [LOGIN CRITICAL] adminData.rol original era:', adminData.rol);
          console.error('❌ [LOGIN CRITICAL] Abortando login para investigar');
          setError(true);
          return;
        }
        
        if (!userData.id_admin) {
          console.error('❌ [LOGIN CRITICAL] userData.id_admin está vacío');
          console.error('❌ [LOGIN CRITICAL] adminData.id original era:', adminData.id);
          setError(true);
          return;
        }
        
        console.log('✅ [LOGIN SUCCESS] Todas las validaciones pasaron');
        console.log('✅ [LOGIN SUCCESS] Llamando función login del contexto...');
        
        const token = data.token || data.accessToken || data.authToken || data.jwt || data.access_token || 'token-session-active';
        login(userData, token);
        
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
