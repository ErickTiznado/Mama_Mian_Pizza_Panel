import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Eye, EyeOff } from 'lucide-react';

const AdminForm = ({ adminData = null, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    rol: 'admin',
    contraseña: '',
    confirmarContraseña: '',
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Roles disponibles
  const roles = [
    { value: 'super_admin', label: 'Dueño' },
    { value: 'admin', label: 'Administrador' },
    { value: 'moderador', label: 'Moderador' }
  ];

  // Cargar datos del administrador si estamos editando
  useEffect(() => {
    if (isEditing && adminData) {
      setFormData({
        nombre: adminData.nombre || '',
        correo: adminData.correo || '',
        celular: adminData.celular || '',
        rol: adminData.rol || 'admin',
        contraseña: '',
        confirmarContraseña: '',
        estado: adminData.estado || 'activo'
      });
    }
  }, [isEditing, adminData]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'El correo no tiene un formato válido';
    }

    // Validar celular
    const phoneRegex = /^\+503\s\d{4}-\d{4}$/;
    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (!phoneRegex.test(formData.celular)) {
      newErrors.celular = 'El formato debe ser: +503 XXXX-XXXX';
    }

    // Validar contraseña (solo si no estamos editando o si se proporcionó una nueva)
    if (!isEditing || formData.contraseña) {
      if (!formData.contraseña) {
        newErrors.contraseña = 'La contraseña es requerida';
      } else if (formData.contraseña.length < 6) {
        newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.contraseña !== formData.confirmarContraseña) {
        newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
      }
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar datos según la estructura requerida por la API
      const submitData = {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        celular: formData.celular
      };

      // Solo incluir contraseña si estamos creando un nuevo admin o si se cambió la contraseña
      if (!isEditing || formData.contraseña) {
        submitData.contrasena = formData.contraseña;
      }
      
      // Si estamos editando, incluir el ID
      if (isEditing && adminData) {
        submitData.id_admin = adminData.id_admin;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatear teléfono automáticamente
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    if (value.length > 0) {
      // Agregar +503 automáticamente
      if (!value.startsWith('503')) {
        if (value.length <= 8) {
          value = '503' + value;
        }
      }
      
      // Formatear como +503 XXXX-XXXX
      if (value.length >= 11) {
        value = value.slice(0, 11);
        value = `+${value.slice(0, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`;
      } else if (value.length >= 7) {
        value = `+${value.slice(0, 3)} ${value.slice(3, 7)}-${value.slice(7)}`;
      } else if (value.length >= 3) {
        value = `+${value.slice(0, 3)} ${value.slice(3)}`;
      } else {
        value = `+${value}`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      celular: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-form-grid">
        {/* Nombre completo */}
        <div className="admin-form-group">
          <label htmlFor="nombre" className="admin-form-label">
            <User size={16} />
            Nombre Completo *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`admin-form-input ${errors.nombre ? 'error' : ''}`}
            placeholder="Ej: Juan Carlos Pérez"
          />
          {errors.nombre && <span className="admin-form-error">{errors.nombre}</span>}
        </div>

        {/* Correo electrónico */}
        <div className="admin-form-group">
          <label htmlFor="correo" className="admin-form-label">
            <Mail size={16} />
            Correo Electrónico *
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            className={`admin-form-input ${errors.correo ? 'error' : ''}`}
            placeholder="ejemplo@mamamianpizza.com"
          />
          {errors.correo && <span className="admin-form-error">{errors.correo}</span>}
        </div>

        {/* Número de celular */}
        <div className="admin-form-group">
          <label htmlFor="celular" className="admin-form-label">
            <Phone size={16} />
            Número de Celular *
          </label>
          <input
            type="text"
            id="celular"
            name="celular"
            value={formData.celular}
            onChange={handlePhoneChange}
            className={`admin-form-input ${errors.celular ? 'error' : ''}`}
            placeholder="+503 XXXX-XXXX"
            maxLength={14}
          />
          {errors.celular && <span className="admin-form-error">{errors.celular}</span>}
        </div>

        {/* Rol */}
        <div className="admin-form-group">
          <label htmlFor="rol" className="admin-form-label">
            <Shield size={16} />
            Rol *
          </label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleInputChange}
            className={`admin-form-select ${errors.rol ? 'error' : ''}`}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.rol && <span className="admin-form-error">{errors.rol}</span>}
        </div>

        {/* Contraseña */}
        <div className="admin-form-group">
          <label htmlFor="contraseña" className="admin-form-label">
            <Shield size={16} />
            {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
          </label>
          <div className="admin-form-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleInputChange}
              className={`admin-form-input ${errors.contraseña ? 'error' : ''}`}
              placeholder={isEditing ? 'Dejar vacío para mantener actual' : 'Mínimo 6 caracteres'}
            />
            <button
              type="button"
              className="admin-form-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.contraseña && <span className="admin-form-error">{errors.contraseña}</span>}
        </div>

        {/* Confirmar contraseña */}
        <div className="admin-form-group">
          <label htmlFor="confirmarContraseña" className="admin-form-label">
            <Shield size={16} />
            Confirmar Contraseña {!isEditing && '*'}
          </label>
          <div className="admin-form-password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmarContraseña"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleInputChange}
              className={`admin-form-input ${errors.confirmarContraseña ? 'error' : ''}`}
              placeholder="Repetir contraseña"
            />
            <button
              type="button"
              className="admin-form-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmarContraseña && <span className="admin-form-error">{errors.confirmarContraseña}</span>}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="admin-form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="admin-form-btn admin-form-btn-cancel"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="admin-form-btn admin-form-btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="admin-form-spinner"></div>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditing ? 'Actualizar Administrador' : 'Crear Administrador'
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;
