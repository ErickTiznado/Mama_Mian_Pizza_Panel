import React, { useState } from 'react';
import axios from 'axios';
import '/src/styles/Register.css';

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmar: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValid, setPasswordValid] = useState(false); // 👈 validación clave

  const validarPassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'correo') {
      setError('');
      setSuccess('');
    }

    if (name === 'contrasena') {
      setPasswordValid(validarPassword(value));
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      setError('La contraseña no cumple con los requisitos.');
      return;
    }

    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/registro', {
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        contrasena: form.contrasena,
      });

      setError('');
      setSuccess(response.data.message);

      // Limpiar campos y validación
      setForm({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        confirmar: '',
      });
      setPasswordValid(false);
    } catch (err) {
      console.error(err);
      setSuccess('');

      if (err.response && err.response.status === 409) {
        setError('Correo ya registrado, ingrese otro correo');
      } else {
        setError('Correo ya registrado, ingrese otro correo');
      }
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <div className="form-box">
          <h2>Registro</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="correo"
              placeholder="Correo Electrónico"
              value={form.correo}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
            />

            {/* Mensaje si la contraseña es inválida */}
            {form.contrasena && !passwordValid && (
              <p className="error-message">
                Debe contener al menos 8 caracteres, 1 número y 1 carácter especial.
              </p>
            )}

            <input
              type="password"
              name="confirmar"
              placeholder="Confirmar Contraseña"
              value={form.confirmar}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={!passwordValid}>
              Registrarse
            </button>

            <p className="register-text">
              ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
            </p>

            {error && (
              <p className="error-message">{error}</p>
            )}
            {success && (
              <p className="success-message">{success}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
